"""Security configuration for authentication.

Values are read from environment variables so deployment secrets are not
hard-coded in the application.
"""

from dataclasses import dataclass
import os


@dataclass(frozen=True)
class SecuritySettings:
    """Authentication-related security settings."""

    jwt_secret_key: str
    jwt_algorithm: str
    access_token_expire_minutes: int
    allow_admin_signup: bool


def get_security_settings() -> SecuritySettings:
    """Return security settings from the process environment."""

    return SecuritySettings(
        jwt_secret_key=os.getenv("JWT_SECRET_KEY", "change-me-in-production"),
        jwt_algorithm=os.getenv("JWT_ALGORITHM", "HS256"),
        access_token_expire_minutes=int(
            os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
        ),
        allow_admin_signup=os.getenv("ALLOW_ADMIN_SIGNUP", "false").lower()
        == "true",
    )
