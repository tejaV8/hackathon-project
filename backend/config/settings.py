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

    # Neo4j Graph Database Configuration
    neo4j_uri: str = Field("bolt://localhost:7687", alias="NEO4J_URI")
    neo4j_username: str = Field("neo4j", alias="NEO4J_USERNAME")
    neo4j_password: str = Field("password", alias="NEO4J_PASSWORD")

    # Qdrant Vector Database Configuration
    qdrant_url: str = Field("http://localhost:6333", alias="QDRANT_URL")
    qdrant_api_key: str | None = Field(None, alias="QDRANT_API_KEY")
    qdrant_collection_name: str = Field("company_brain", alias="QDRANT_COLLECTION")

    # AI Service Settings
    openai_api_key: str | None = Field(None, alias="OPENAI_API_KEY")
    embedding_model: str = Field("text-embedding-3-small", alias="EMBEDDING_MODEL")
    llm_model: str = Field("gpt-4o-mini", alias="LLM_MODEL")

    # Storage Configuration
    upload_dir: str = Field("uploads", alias="UPLOAD_DIR")
    max_upload_size_bytes: int = Field(10 * 1024 * 1024, alias="MAX_UPLOAD_SIZE")


@lru_cache
def get_settings() -> Settings:
    """Return cached application settings."""

    return Settings()
