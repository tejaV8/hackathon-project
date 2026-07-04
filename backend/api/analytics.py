"""REST API routes for backend analytics and system usage metrics."""

import re
from collections import Counter
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from backend.auth.dependencies import get_current_active_user
from backend.db.session import get_db_session
from backend.models.user import User, UserRole
from backend.models.analytics import QueryLog
from backend.models.document import Document
from backend.schemas.analytics import AnalyticsResponse, TopicFrequency


router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/dashboard", response_model=AnalyticsResponse)
def get_analytics_dashboard(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db_session),
) -> AnalyticsResponse:
    """Return an aggregates dashboard of system metrics (Admin only)."""

    # 1. Enforce Admin only
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required to view analytics dashboard.",
        )

    # 2. Gather total logs
    logs_stmt = select(QueryLog)
    all_logs = db.scalars(logs_stmt).all()

    # 3. Gather total documents
    docs_stmt = select(Document)
    all_docs = db.scalars(docs_stmt).all()

    # A. Total questions
    total_questions = len(all_logs)

    # B. Average response time
    if total_questions > 0:
        total_time = sum(log.response_time_ms for log in all_logs)
        avg_response_time = float(total_time) / total_questions
    else:
        avg_response_time = 0.0

    # C. Most searched topics (excluding generic English stopwords)
    stopwords = {
        "what", "where", "about", "there", "their", "would", "could", "should",
        "which", "these", "those", "under", "after", "before", "while", "during",
        "about", "other", "another", "how", "why", "when", "who", "whom", "whose"
    }
    word_counter: Counter = Counter()
    for log in all_logs:
        # Match alphanumeric words of length > 3
        words = re.findall(r"\b[a-zA-Z]{4,}\b", log.question.lower())
        filtered = [w for w in words if w not in stopwords]
        word_counter.update(filtered)

    most_searched = [
        TopicFrequency(topic=topic, count=count)
        for topic, count in word_counter.most_common(5)
    ]

    # D. Unused documents (documents never cited in any log)
    cited_ids = set()
    for log in all_logs:
        if log.cited_document_ids:
            for doc_id_str in log.cited_document_ids.split(","):
                if doc_id_str.strip():
                    try:
                        cited_ids.add(int(doc_id_str))
                    except ValueError:
                        continue

    unused_documents = [
        doc.filename for doc in all_docs if doc.id not in cited_ids
    ]

    # E. Knowledge gaps (questions asked yielding low confidence, e.g., < 0.20)
    gaps_stmt = (
        select(QueryLog.question)
        .where(QueryLog.confidence_score < 0.20)
        .limit(10)
    )
    knowledge_gaps = db.scalars(gaps_stmt).all()

    # F. Upload aggregates
    total_uploads = len(all_docs)
    uploads_by_dept = {}
    for doc in all_docs:
        dept = doc.department or "Public"
        uploads_by_dept[dept] = uploads_by_dept.get(dept, 0) + 1

    return AnalyticsResponse(
        total_questions=total_questions,
        avg_response_time_ms=round(avg_response_time, 2),
        most_searched_topics=most_searched,
        unused_documents=unused_documents,
        knowledge_gaps=list(set(knowledge_gaps)),  # Dedup gap questions
        total_uploads=total_uploads,
        uploads_by_department=uploads_by_dept,
    )
