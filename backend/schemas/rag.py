"""Pydantic schemas for RAG query request and response validation."""

from typing import List
from pydantic import BaseModel, Field


class QueryRequest(BaseModel):
    """Payload for querying the enterprise knowledge base."""

    question: str = Field(..., min_length=2, max_length=1000)


class CitationSchema(BaseModel):
    """Schema representing validated document citations."""

    filename: str
    page_number: int | None
    confidence_score: float
    snippet: str


class QueryResponse(BaseModel):
    """Final answer object returned to the user/frontend."""

    response: str
    confidence_score: float
    citations: List[CitationSchema]
