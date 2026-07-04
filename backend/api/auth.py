"""Authentication API routes."""

from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from backend.auth.dependencies import bearer_scheme, get_current_active_user
from backend.db.session import get_db_session
from backend.models.user import User
from backend.schemas.auth import (
    LoginRequest,
    SignupRequest,
    TokenResponse,
    UserResponse,
)
from backend.services.auth_service import AuthService


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/signup",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def signup(
    payload: SignupRequest,
    db: Session = Depends(get_db_session),
) -> User:
    """Create a new user account."""

    return AuthService(db).signup(payload)


@router.post("/login", response_model=TokenResponse)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db_session),
) -> TokenResponse:
    """Authenticate a user and return a bearer access token."""

    access_token = AuthService(db).login(payload)
    return TokenResponse(access_token=access_token)


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_active_user),
) -> User:
    """Return the current authenticated user."""

    return current_user


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db_session),
) -> dict[str, str]:
    """Logout the current user by blacklisting their access token."""

    if credentials:
        AuthService(db).blacklist_token(credentials.credentials)
    return {"detail": "Successfully logged out."}
