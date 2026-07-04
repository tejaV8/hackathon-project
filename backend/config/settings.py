"""Application settings loaded from environment variables."""

from functools import lru_cache

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration for the backend."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "AI Company Brain API"
    app_version: str = "0.1.0"
    environment: str = "development"
    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:5173"])

    database_url: str = Field(..., alias="DATABASE_URL")
    jwt_secret_key: str = Field(
        ...,
        validation_alias=AliasChoices("JWT_SECRET", "JWT_SECRET_KEY"),
    )
    jwt_algorithm: str = Field("HS256", alias="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(
        30,
        alias="ACCESS_TOKEN_EXPIRE_MINUTES",
    )
    allow_admin_signup: bool = Field(False, alias="ALLOW_ADMIN_SIGNUP")


@lru_cache
def get_settings() -> Settings:
    """Return cached application settings."""

    return Settings()
