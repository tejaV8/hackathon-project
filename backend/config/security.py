"""Security configuration for authentication.

Values are read from environment variables so deployment secrets are not
hard-coded in the application.
"""

from dataclasses import dataclass

from backend.config.settings import get_settings


@dataclass(frozen=True)
class SecuritySettings:
    """Authentication-related security settings."""

    jwt_secret_key: str
    jwt_algorithm: str
    access_token_expire_minutes: int
    allow_admin_signup: bool


def get_security_settings() -> SecuritySettings:
    """Return security settings from the process environment."""

    settings = get_settings()

    return SecuritySettings(
        jwt_secret_key=settings.jwt_secret_key,
        jwt_algorithm=settings.jwt_algorithm,
        access_token_expire_minutes=settings.access_token_expire_minutes,
        allow_admin_signup=settings.allow_admin_signup,
    )
