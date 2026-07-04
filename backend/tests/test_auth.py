"""Integration tests for authentication endpoints."""

import os
from collections.abc import Generator

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET", "test-secret")
os.environ.setdefault("JWT_ALGORITHM", "HS256")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
os.environ.setdefault("ALLOW_ADMIN_SIGNUP", "false")

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool
from starlette.testclient import TestClient

from backend.db.session import get_db_session
from backend.main import app
from backend.models.user import Base, User, UserRole


@pytest.fixture()
def db_session() -> Generator[Session, None, None]:
    """Create an isolated in-memory database session per test."""

    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(
        bind=engine,
        autoflush=False,
        autocommit=False,
        expire_on_commit=False,
    )
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)
        engine.dispose()


@pytest.fixture()
def client(db_session: Session) -> Generator[TestClient, None, None]:
    """Create a TestClient with the auth DB dependency overridden."""

    def override_get_db_session() -> Generator[Session, None, None]:
        yield db_session

    app.dependency_overrides[get_db_session] = override_get_db_session

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


def signup_payload(email: str = "user@example.com") -> dict[str, str]:
    """Return a valid employee signup payload."""

    return {
        "full_name": "Test User",
        "email": email,
        "password": "correct-horse-password",
        "role": UserRole.EMPLOYEE.value,
    }


def test_signup_creates_employee(client: TestClient) -> None:
    response = client.post("/auth/signup", json=signup_payload())

    assert response.status_code == 201
    body = response.json()
    assert body["email"] == "user@example.com"
    assert body["role"] == UserRole.EMPLOYEE.value
    assert "password" not in body
    assert "password_hash" not in body


def test_signup_rejects_duplicate_email(client: TestClient) -> None:
    payload = signup_payload()

    first_response = client.post("/auth/signup", json=payload)
    second_response = client.post("/auth/signup", json=payload)

    assert first_response.status_code == 201
    assert second_response.status_code == 409


def test_signup_rejects_public_admin_creation(client: TestClient) -> None:
    payload = signup_payload("admin@example.com")
    payload["role"] = UserRole.ADMIN.value

    response = client.post("/auth/signup", json=payload)

    assert response.status_code == 403


def test_login_returns_token(client: TestClient) -> None:
    client.post("/auth/signup", json=signup_payload())

    response = client.post(
        "/auth/login",
        json={
            "email": "user@example.com",
            "password": "correct-horse-password",
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["access_token"]
    assert body["token_type"] == "bearer"


def test_login_rejects_invalid_password(client: TestClient) -> None:
    client.post("/auth/signup", json=signup_payload())

    response = client.post(
        "/auth/login",
        json={"email": "user@example.com", "password": "wrong-password"},
    )

    assert response.status_code == 401


def test_current_user_endpoint(client: TestClient) -> None:
    client.post("/auth/signup", json=signup_payload())
    login_response = client.post(
        "/auth/login",
        json={
            "email": "user@example.com",
            "password": "correct-horse-password",
        },
    )
    token = login_response.json()["access_token"]

    response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert response.json()["email"] == "user@example.com"


def test_current_user_requires_token(client: TestClient) -> None:
    response = client.get("/auth/me")

    assert response.status_code == 401


def test_inactive_user_cannot_login(
    client: TestClient,
    db_session: Session,
) -> None:
    client.post("/auth/signup", json=signup_payload())
    user = db_session.query(User).filter_by(email="user@example.com").one()
    user.is_active = False
    db_session.commit()

    response = client.post(
        "/auth/login",
        json={
            "email": "user@example.com",
            "password": "correct-horse-password",
        },
    )

    assert response.status_code == 403


def test_inactive_user_cannot_access_current_user(
    client: TestClient,
    db_session: Session,
) -> None:
    client.post("/auth/signup", json=signup_payload())
    login_response = client.post(
        "/auth/login",
        json={
            "email": "user@example.com",
            "password": "correct-horse-password",
        },
    )
    token = login_response.json()["access_token"]
    user = db_session.query(User).filter_by(email="user@example.com").one()
    user.is_active = False
    db_session.commit()

    response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 403


def test_signup_with_department(client: TestClient) -> None:
    """Verify that department information is recorded and returned on signup."""
    payload = signup_payload("dept_user@example.com")
    payload["department"] = "Engineering"
    response = client.post("/auth/signup", json=payload)
    assert response.status_code == 201
    body = response.json()
    assert body["department"] == "Engineering"


def test_logout_blacklists_token(client: TestClient) -> None:
    """Verify that logging out blacklists the active token."""
    # 1. Create a user
    client.post("/auth/signup", json=signup_payload("logout_user@example.com"))

    # 2. Login to get token
    login_response = client.post(
        "/auth/login",
        json={
            "email": "logout_user@example.com",
            "password": "correct-horse-password",
        },
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Verify token works
    me_response = client.get("/auth/me", headers=headers)
    assert me_response.status_code == 200

    # 4. Logout (invalidate token)
    logout_response = client.post("/auth/logout", headers=headers)
    assert logout_response.status_code == 200
    assert logout_response.json() == {"detail": "Successfully logged out."}

    # 5. Verify subsequent /me requests fail with 401
    blocked_response = client.get("/auth/me", headers=headers)
    assert blocked_response.status_code == 401
