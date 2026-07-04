"""SQLAlchemy session management for FastAPI requests."""

from collections.abc import Generator

from sqlalchemy.orm import Session, sessionmaker

from backend.config.database import create_database_engine


engine = create_database_engine()
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)


def get_db_session() -> Generator[Session, None, None]:
    """Yield a request-scoped database session."""

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
