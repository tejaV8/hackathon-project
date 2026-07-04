"""JWT helpers for access token generation and validation."""

from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt

from backend.config.security import get_security_settings


def create_access_token(subject: str, claims: dict[str, Any] | None = None) -> str:
    """Create a signed JWT access token for an authenticated user."""

    settings = get_security_settings()
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    payload: dict[str, Any] = {
        "sub": subject,
        "exp": expires_at,
        "iat": datetime.now(timezone.utc),
    }

    if claims:
        payload.update(claims)

    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )


def decode_access_token(token: str) -> dict[str, Any]:
    """Decode and validate a JWT access token."""

    settings = get_security_settings()

    try:
        return jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
        )
    except JWTError as exc:
        raise ValueError("Invalid access token") from exc
