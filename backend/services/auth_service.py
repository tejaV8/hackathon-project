"""Business logic for user signup and login."""

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.config.security import get_security_settings
from backend.auth.jwt import create_access_token
from backend.auth.password import hash_password, verify_password
from backend.models.user import User, UserRole
from backend.schemas.auth import LoginRequest, SignupRequest


class AuthService:
    """Authentication service isolated from HTTP route concerns."""

    def __init__(self, db: Session) -> None:
        self._db = db

    def get_user_by_email(self, email: str) -> User | None:
        """Return a user by normalized email address."""

        normalized_email = self._normalize_email(email)
        statement = select(User).where(User.email == normalized_email)
        return self._db.scalar(statement)

    def signup(self, payload: SignupRequest) -> User:
        """Create a new active user with a bcrypt password hash."""

        normalized_email = self._normalize_email(payload.email)
        settings = get_security_settings()

        if payload.role == UserRole.ADMIN and not settings.allow_admin_signup:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin signup is disabled.",
            )

        if self.get_user_by_email(normalized_email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this email already exists.",
            )

        user = User(
            full_name=payload.full_name.strip(),
            email=normalized_email,
            password_hash=hash_password(payload.password),
            role=payload.role,
            is_active=True,
        )
        self._db.add(user)

        try:
            self._db.commit()
        except IntegrityError as exc:
            self._db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this email already exists.",
            ) from exc

        self._db.refresh(user)
        return user

    def login(self, payload: LoginRequest) -> str:
        """Authenticate a user and return a JWT access token."""

        user = self.get_user_by_email(payload.email)

        if not user or not verify_password(payload.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive.",
            )

        return create_access_token(
            subject=str(user.id),
            claims={"role": user.role.value, "email": user.email},
        )

    @staticmethod
    def _normalize_email(email: str) -> str:
        """Normalize email before storage and lookup."""

        return email.strip().lower()
