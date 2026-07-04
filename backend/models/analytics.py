"""SQLAlchemy model for logging query analytics and metrics."""

from datetime import datetime, timezone
from sqlalchemy import DateTime, ForeignKey, Integer, Float, Text
from sqlalchemy.orm import Mapped, mapped_column

from backend.models.user import Base


class QueryLog(Base):
    """Database record for user queries, pipeline latency, and confidence metrics."""

    __tablename__ = "query_logs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    question: Mapped[str] = mapped_column(Text, nullable=False)
    response_time_ms: Mapped[int] = mapped_column(Integer, nullable=False)
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False)
    cited_document_ids: Mapped[str | None] = mapped_column(
        Text, nullable=True
    )  # Comma-separated list of document IDs

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
