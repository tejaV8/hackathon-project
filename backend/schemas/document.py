"""Pydantic schemas for document and chunk representations."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ChunkResponse(BaseModel):
    """Schema representing a parsed text chunk."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    chunk_index: int
    content: str
    page_number: int | None
    created_at: datetime


class DocumentResponse(BaseModel):
    """Schema representing an uploaded document's metadata."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    filename: str
    file_path: str
    file_type: str
    file_size: int
    uploader_id: int
    department: str | None
    is_processed: bool
    created_at: datetime
    updated_at: datetime
