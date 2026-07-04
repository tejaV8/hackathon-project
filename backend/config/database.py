"""Database engine configuration."""

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from backend.config.settings import get_settings


def create_database_engine(database_url: str | None = None) -> Engine:
    """Create a SQLAlchemy engine using application database settings."""

    url = database_url or get_settings().database_url
    connect_args = {"check_same_thread": False} if url.startswith("sqlite") else {}

    return create_engine(
        url,
        connect_args=connect_args,
        pool_pre_ping=not url.startswith("sqlite"),
    )
