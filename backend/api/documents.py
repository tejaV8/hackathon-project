"""Document ingestion and upload API endpoints."""

import os
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from backend.auth.dependencies import get_current_active_user
from backend.config.settings import get_settings
from backend.db.session import get_db_session
from backend.models.user import User, UserRole
from backend.models.document import Document, Chunk
from backend.schemas.document import DocumentResponse
from backend.ingestion.extractor import DocumentExtractor
from backend.ingestion.cleaner import clean_text
from backend.ingestion.chunker import TextChunker


router = APIRouter(prefix="/documents", tags=["Documents"])

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt", ".md"}


@router.post(
    "/upload",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_document(
    file: UploadFile = File(...),
    department: str | None = Form(None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db_session),
) -> Document:
    """Upload a company document and run the text extraction and chunking pipeline."""

    # 1. Enforce Admin only
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required to upload documents.",
        )

    settings = get_settings()

    # 2. Validate file extension
    _, ext = os.path.splitext(file.filename)
    ext = ext.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format. Allowed formats: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # 3. Create upload directory
    upload_dir = settings.upload_dir
    os.makedirs(upload_dir, exist_ok=True)

    # 4. Save file path definition
    file_path = os.path.join(upload_dir, file.filename)

    # 5. Read file and validate size
    try:
        content_size = 0
        with open(file_path, "wb") as buffer:
            while chunk := await file.read(8192):
                content_size += len(chunk)
                if content_size > settings.max_upload_size_bytes:
                    buffer.close()
                    if os.path.exists(file_path):
                        os.remove(file_path)
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail=(
                            f"File exceeds maximum allowed size of "
                            f"{settings.max_upload_size_bytes / (1024*1024):.1f}MB."
                        ),
                    )
                buffer.write(chunk)
    except Exception as exc:
        if isinstance(exc, HTTPException):
            raise exc
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving file: {str(exc)}",
        ) from exc

    # 6. Save document entry in database
    db_doc = Document(
        filename=file.filename,
        file_path=file_path,
        file_type=ext.strip("."),
        file_size=content_size,
        uploader_id=current_user.id,
        department=department.strip() if department else None,
        is_processed=False,
    )
    db.add(db_doc)
    db.flush()  # Populates db_doc.id

    # 7. Extract, Clean, and Chunk Text
    try:
        pages = DocumentExtractor.extract_text(file_path, ext)
        cleaned_pages = [
            {"page_number": page["page_number"], "text": clean_text(page["text"])}
            for page in pages
        ]
        chunks = TextChunker().chunk_document(cleaned_pages)

        # Save Chunks to database
        db_chunks = []
        for c in chunks:
            db_chunk = Chunk(
                document_id=db_doc.id,
                chunk_index=c["chunk_index"],
                content=c["content"],
                page_number=c["page_number"],
            )
            db.add(db_chunk)
            db_chunks.append(db_chunk)

        db.flush()  # Populates chunk IDs

        # 8. Generate Embeddings & Upsert to Qdrant
        try:
            from backend.embeddings.service import EmbeddingService
            from backend.vector_db.client import QdrantVectorStore

            texts_to_embed = [chunk.content for chunk in db_chunks]
            embeddings = EmbeddingService().embed_batch(texts_to_embed)

            qdrant_payload = []
            for db_chunk, vector in zip(db_chunks, embeddings):
                qdrant_payload.append(
                    {
                        "id": db_chunk.id,
                        "document_id": db_doc.id,
                        "content": db_chunk.content,
                        "page_number": db_chunk.page_number,
                        "department": db_doc.department or "public",
                        "vector": vector,
                    }
                )

            QdrantVectorStore().upsert_chunks(qdrant_payload)
        except Exception as qdrant_exc:
            print(f"Qdrant vector indexing failed (continuing without vectors): {qdrant_exc}")

        # 9. Extract & Build Knowledge Graph (Neo4j)
        try:
            from backend.graph.extractor import GraphExtractorService
            graph_extractor = GraphExtractorService()
            for db_chunk in db_chunks:
                graph_extractor.process_chunk(
                    chunk_content=db_chunk.content,
                    department=db_doc.department,
                )
        except Exception as graph_exc:
            print(f"Neo4j graph extraction failed (continuing without graphs): {graph_exc}")

        db_doc.is_processed = True
        db.commit()
    except Exception as exc:
        db.rollback()
        # Clean up saved file on ingestion failure
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ingestion pipeline failed: {str(exc)}",
        ) from exc

    db.refresh(db_doc)
    return db_doc


@router.get(
    "",
    response_model=list[DocumentResponse],
)
def list_documents(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db_session),
) -> list[Document]:
    """Retrieve all uploaded documents (Admin sees all, Employee sees public & department documents)."""

    from sqlalchemy import select, or_

    if current_user.role == UserRole.ADMIN:
        stmt = select(Document).order_by(Document.created_at.desc())
    else:
        stmt = select(Document).where(
            or_(
                Document.department == None,
                Document.department == current_user.department
            )
        ).order_by(Document.created_at.desc())

    return list(db.scalars(stmt).all())


@router.delete(
    "/{document_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db_session),
) -> None:
    """Delete a document by ID (Admin only)."""

    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required to delete documents.",
        )

    doc = db.get(Document, document_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found.",
        )

    # Clean up from disk
    if os.path.exists(doc.file_path):
        try:
            os.remove(doc.file_path)
        except Exception as exc:
            print(f"Failed to delete file {doc.file_path}: {exc}")

    # Clean up from vector store
    try:
        from backend.vector_db.client import QdrantVectorStore
        QdrantVectorStore().delete_by_document_id(doc.id)
    except Exception as qdrant_exc:
        print(f"Failed to delete vectors from Qdrant: {qdrant_exc}")

    db.delete(doc)
    db.commit()

