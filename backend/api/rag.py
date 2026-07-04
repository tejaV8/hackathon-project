"""REST API routes for RAG queries."""

import time
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.auth.dependencies import get_current_active_user
from backend.db.session import get_db_session
from backend.models.user import User
from backend.models.analytics import QueryLog
from backend.schemas.rag import QueryRequest, QueryResponse
from backend.workflows.rag_workflow import build_rag_workflow


router = APIRouter(tags=["RAG"])

# Compile LangGraph RAG application at startup
rag_app = build_rag_workflow()


@router.post("/query", response_model=QueryResponse)
def query_knowledge_base(
    payload: QueryRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db_session),
) -> QueryResponse:
    """Submit a question to the multi-agent RAG pipeline and receive a citation-backed response."""

    start_time = time.perf_counter()

    # Initialize execution state for LangGraph
    initial_state = {
        "db": db,
        "question": payload.question.strip(),
        "user_department": current_user.department,
        "is_admin": current_user.role.value == "admin",
        "plan": "",
        "retrieved_chunks": [],
        "graph_context": [],
        "reasoning": "",
        "citations": [],
        "confidence_score": 0.0,
        "response": "",
    }

    # Execute workflow graph
    output = rag_app.invoke(initial_state)

    # Compute execution latency
    response_time_ms = int((time.perf_counter() - start_time) * 1000)

    # Gather cited document IDs to compute utilization analytics
    citations = output.get("citations", [])
    cited_doc_names = list(set([c["filename"] for c in citations]))

    # Retrieve matching document IDs from PostgreSQL for logging
    from backend.models.document import Document
    from sqlalchemy import select

    cited_doc_ids = []
    if cited_doc_names:
        stmt = select(Document.id).where(Document.filename.in_(cited_doc_names))
        cited_doc_ids = db.scalars(stmt).all()

    cited_document_ids_str = (
        ",".join(map(str, cited_doc_ids)) if cited_doc_ids else None
    )

    # Persist log entry for metrics tracking
    log_entry = QueryLog(
        user_id=current_user.id,
        question=payload.question.strip(),
        response_time_ms=response_time_ms,
        confidence_score=output.get("confidence_score", 0.0),
        cited_document_ids=cited_document_ids_str,
    )
    db.add(log_entry)
    db.commit()

    return QueryResponse(
        response=output.get("response", ""),
        confidence_score=output.get("confidence_score", 0.0),
        citations=citations,
    )
