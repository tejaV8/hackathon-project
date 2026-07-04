"""Pydantic schemas for authentication endpoints."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from backend.models.user import UserRole


class SignupRequest(BaseModel):
    """Payload for creating a user account."""

    full_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    role: UserRole = UserRole.EMPLOYEE
    department: str | None = Field(None, max_length=100)


class LoginRequest(BaseModel):
    """Payload for authenticating a user."""

    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class TokenResponse(BaseModel):
    """JWT access token response."""

    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """Public user representation returned by auth APIs."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: EmailStr
    role: UserRole
    department: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime
