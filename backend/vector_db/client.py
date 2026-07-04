"""Qdrant client interface for vector storage and permission-aware searches."""

from typing import List
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue

from backend.config.settings import get_settings
from backend.embeddings.service import EmbeddingService


class QdrantVectorStore:
    """Interacts with Qdrant Vector database, providing indexing and permission filtering."""

    def __init__(self) -> None:
        self.settings = get_settings()
        self.embedding_service = EmbeddingService()
        self.collection_name = self.settings.qdrant_collection_name

        try:
            self.client = QdrantClient(
                url=self.settings.qdrant_url,
                api_key=self.settings.qdrant_api_key,
                timeout=5.0,  # 5 seconds timeout limit
            )
            self.enabled = True
        except Exception as exc:
            print(
                f"Qdrant initialization failed: {exc}. Vector db running in fallback mock mode."
            )
            self.client = None
            self.enabled = False

    def ensure_collection(self) -> None:
        """Create the Qdrant collection if it does not already exist."""

        if not self.enabled or not self.client:
            return

        try:
            collections = self.client.get_collections().collections
            exists = any(c.name == self.collection_name for c in collections)
            if not exists:
                dimension = self.embedding_service.get_embedding_dimension()
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(
                        size=dimension, distance=Distance.COSINE
                    ),
                )
        except Exception as exc:
            print(f"Qdrant collection creation failed: {exc}. Disabling client.")
            self.enabled = False

    def upsert_chunks(self, chunks: List[dict]) -> None:
        """Upsert a list of text chunks with generated embeddings into Qdrant."""

        self.ensure_collection()

        if not self.enabled or not self.client:
            return

        points = []
        for chunk in chunks:
            point_id = chunk["id"]  # Using primary key integer from Chunk DB
            points.append(
                PointStruct(
                    id=point_id,
                    vector=chunk["vector"],
                    payload={
                        "chunk_id": chunk["id"],
                        "document_id": chunk["document_id"],
                        "content": chunk["content"],
                        "page_number": chunk["page_number"],
                        "department": chunk["department"],
                    },
                )
            )

        try:
            self.client.upsert(collection_name=self.collection_name, points=points)
        except Exception as exc:
            print(f"Qdrant upsert failed: {exc}")

    def search(
        self,
        query: str,
        limit: int = 5,
        department: str | None = None,
        is_admin: bool = False,
    ) -> List[dict]:
        """Perform similarity search with role and department access filtering."""

        query_vector = self.embedding_service.embed_text(query)

        self.ensure_collection()

        if not self.enabled or not self.client:
            return []

        qdrant_filter = None
        if not is_admin:
            # Match user's department OR "public" documents (null/empty is also public)
            should_conditions = [FieldCondition(key="department", match=MatchValue(value="public"))]
            if department:
                should_conditions.append(
                    FieldCondition(key="department", match=MatchValue(value=department))
                )

            # In Qdrant, we query using Filter with should array (OR logic)
            qdrant_filter = Filter(should=should_conditions)

        try:
            search_result = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                query_filter=qdrant_filter,
                limit=limit,
            )

            results = []
            for hit in search_result:
                payload = hit.payload or {}
                results.append(
                    {
                        "chunk_id": payload.get("chunk_id"),
                        "document_id": payload.get("document_id"),
                        "content": payload.get("content"),
                        "page_number": payload.get("page_number"),
                        "department": payload.get("department"),
                        "score": hit.score,
                    }
                )
            return results
        except Exception as exc:
            print(f"Qdrant search failed: {exc}")
            return []
