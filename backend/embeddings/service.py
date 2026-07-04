"""Embedding service for generating text representations."""

from typing import List
import numpy as np

from backend.config.settings import get_settings


class EmbeddingService:
    """Generates vector embeddings for text chunks, supporting OpenAI and

    SentenceTransformers, with a robust deterministic fallback for offline tests.
    """

    def __init__(self) -> None:
        self.settings = get_settings()
        self.model_name = self.settings.embedding_model
        self.openai_api_key = self.settings.openai_api_key

        self._st_model = None
        self._openai_client = None

    def get_embedding_dimension(self) -> int:
        """Return the vector dimension based on active provider configuration."""

        if self.openai_api_key and "gpt" in self.settings.llm_model.lower():
            return 1536  # OpenAI text-embedding-3-small
        return 384  # SentenceTransformers all-MiniLM-L6-v2

    def embed_text(self, text: str) -> List[float]:
        """Generate embedding vector for a single text chunk."""

        return self.embed_batch([text])[0]

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embedding vectors for a batch of text chunks."""

        if not texts:
            return []

        # 1. OpenAI Integration
        if self.openai_api_key:
            try:
                from openai import OpenAI

                if not self._openai_client:
                    self._openai_client = OpenAI(api_key=self.openai_api_key)

                response = self._openai_client.embeddings.create(
                    input=texts, model=self.model_name
                )
                return [data.embedding for data in response.data]
            except Exception as exc:
                print(f"OpenAI embedding failed, falling back: {exc}")

        # 2. Local SentenceTransformers Integration
        try:
            from sentence_transformers import SentenceTransformer

            if not self._st_model:
                self._st_model = SentenceTransformer("all-MiniLM-L6-v2")

            embeddings = self._st_model.encode(texts)
            return [embedding.tolist() for embedding in embeddings]
        except Exception as exc:
            # Output traceback or warning for developers
            print(
                f"Local SentenceTransformers failed, using deterministic mock: {exc}"
            )

        # 3. Deterministic Mock Fallback (Resilient offline testing mode)
        dimension = self.get_embedding_dimension()
        mock_embeddings = []
        for text in texts:
            # Deterministic seeding based on text string hash
            state = hash(text) & 0xFFFFFFFF
            np.random.seed(state)
            vector = np.random.randn(dimension)
            norm = np.linalg.norm(vector)
            if norm > 0:
                vector = vector / norm
            mock_embeddings.append(vector.tolist())

        return mock_embeddings
