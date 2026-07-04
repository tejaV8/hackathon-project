"""Pydantic schemas for analytics API validation."""

from typing import Dict, List, Any
from pydantic import BaseModel


class TopicFrequency(BaseModel):
    """Word occurrence count in user queries."""

    topic: str
    count: int


class AnalyticsResponse(BaseModel):
    """Enterprise metrics dashboard response."""

    total_questions: int
    avg_response_time_ms: float
    most_searched_topics: List[TopicFrequency]
    unused_documents: List[str]
    knowledge_gaps: List[str]
    total_uploads: int
    uploads_by_department: Dict[str, int]
