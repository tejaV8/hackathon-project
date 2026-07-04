"""Tests for authentication security primitives."""

import os

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET", "test-secret")
os.environ.setdefault("JWT_ALGORITHM", "HS256")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "30")

from backend.auth.jwt import create_access_token, decode_access_token
from backend.auth.password import hash_password, verify_password
from backend.auth.permissions import Permission, has_permission
from backend.models.user import User, UserRole


def test_password_hashing_and_verification() -> None:
    password = "correct-horse-password"

    password_hash = hash_password(password)

    assert password_hash != password
    assert verify_password(password, password_hash)
    assert not verify_password("wrong-password", password_hash)


def test_jwt_generation_and_validation() -> None:
    token = create_access_token(
        subject="123",
        claims={"role": UserRole.EMPLOYEE.value, "email": "user@example.com"},
    )

    payload = decode_access_token(token)

    assert payload["sub"] == "123"
    assert payload["role"] == UserRole.EMPLOYEE.value
    assert payload["email"] == "user@example.com"


def test_role_permissions() -> None:
    admin = User(
        id=1,
        full_name="Admin User",
        email="admin@example.com",
        password_hash="hash",
        role=UserRole.ADMIN,
        is_active=True,
    )
    employee = User(
        id=2,
        full_name="Employee User",
        email="employee@example.com",
        password_hash="hash",
        role=UserRole.EMPLOYEE,
        is_active=True,
    )

    assert has_permission(admin, Permission.UPLOAD_DOCUMENTS)
    assert has_permission(admin, Permission.ACCESS_ANALYTICS)
    assert not has_permission(employee, Permission.UPLOAD_DOCUMENTS)
    assert has_permission(employee, Permission.SEARCH_KNOWLEDGE)
