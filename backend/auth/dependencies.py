"""FastAPI dependencies for authentication."""

import os
from collections.abc import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from backend.auth.jwt import decode_access_token
from backend.models.user import User


bearer_scheme = HTTPBearer(auto_error=False)
_engine: Engine | None = None
_session_factory: sessionmaker[Session] | None = None


def get_db_engine() -> Engine:
    """Return a lazily initialized PostgreSQL SQLAlchemy engine."""

    global _engine

    if _engine is None:
        database_url = os.getenv("DATABASE_URL")

        if not database_url:
            raise RuntimeError("DATABASE_URL is required for authentication.")

        _engine = create_engine(database_url, pool_pre_ping=True)

    return _engine


def get_db_session() -> Generator[Session, None, None]:
    """Yield a database session for request-scoped work."""

    global _session_factory

    if _session_factory is None:
        _session_factory = sessionmaker(
            bind=get_db_engine(),
            autoflush=False,
            autocommit=False,
            expire_on_commit=False,
        )

    db = _session_factory()

    try:
        yield db
    finally:
        db.close()


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db_session),
) -> User:
    """Return the authenticated user represented by the bearer token."""

    auth_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate authentication credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if credentials is None:
        raise auth_error

    try:
        payload = decode_access_token(credentials.credentials)
        user_id = int(payload.get("sub", ""))
    except (TypeError, ValueError):
        raise auth_error

    user = db.get(User, user_id)

    if user is None:
        raise auth_error

    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Return the authenticated user only if the account is active."""

    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive.",
        )

    return current_user
