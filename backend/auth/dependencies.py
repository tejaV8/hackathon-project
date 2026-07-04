"""FastAPI dependencies for authentication."""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from backend.auth.jwt import decode_access_token
from backend.db.session import get_db_session
from backend.models.user import User


bearer_scheme = HTTPBearer(auto_error=False)


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

    from backend.services.auth_service import AuthService
    if AuthService(db).is_token_blacklisted(credentials.credentials):
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
