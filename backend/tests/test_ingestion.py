"""Integration and unit tests for document ingestion and chunking services."""

import os

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET", "test-secret")
os.environ.setdefault("JWT_ALGORITHM", "HS256")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
os.environ.setdefault("ALLOW_ADMIN_SIGNUP", "false")

from collections.abc import Generator
from unittest.mock import MagicMock, patch

import pytest


@pytest.fixture(autouse=True)
def setup_ingestion_settings() -> Generator[None, None, None]:
    """Dynamically set settings limits for ingestion tests."""
    os.environ["UPLOAD_DIR"] = "test_uploads"
    os.environ["MAX_UPLOAD_SIZE"] = str(50 * 1024)  # 50 KB
    os.environ["ENVIRONMENT"] = "testing"
    from backend.config.settings import get_settings
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool
from starlette.testclient import TestClient

from backend.db.session import get_db_session
from backend.main import app
from backend.models.user import Base, User, UserRole
from backend.models.document import Document, Chunk
from backend.ingestion.cleaner import clean_text
from backend.ingestion.chunker import TextChunker
from backend.ingestion.extractor import DocumentExtractor


@pytest.fixture()
def db_session() -> Generator[Session, None, None]:
    """Isolated SQL database session for tests."""

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

    # Prepopulate an Admin and an Employee
    from backend.auth.password import hash_password

    admin = User(
        full_name="System Admin",
        email="admin@company.com",
        password_hash=hash_password("admin-password"),
        role=UserRole.ADMIN,
        is_active=True,
    )
    employee = User(
        full_name="Regular Employee",
        email="employee@company.com",
        password_hash=hash_password("employee-password"),
        role=UserRole.EMPLOYEE,
        is_active=True,
    )
    db.add(admin)
    db.add(employee)
    db.commit()

    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)
        engine.dispose()


@pytest.fixture()
def client(db_session: Session) -> Generator[TestClient, None, None]:
    """TestClient with overridden database session."""

    def override_get_db_session() -> Generator[Session, None, None]:
        yield db_session

    app.dependency_overrides[get_db_session] = override_get_db_session
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


# Clean up test uploads directory after run
@pytest.fixture(autouse=True)
def cleanup_test_uploads() -> Generator[None, None, None]:
    yield
    if os.path.exists("test_uploads"):
        import shutil

        shutil.rmtree("test_uploads")


def get_token(client: TestClient, email: str, secret: str) -> str:
    """Helper to retrieve JWT access token for a user."""

    res = client.post("/auth/login", json={"email": email, "password": secret})
    return res.json()["access_token"]


# =====================================================================
# UNIT TESTS - TEXT CLEANER
# =====================================================================


def test_clean_text_removes_page_numbers() -> None:
    text_with_noise = (
        "This is the first page.\n"
        "Page 1\n"
        "And some other text.\n"
        "2 of 10\n"
        "More text.\n"
        "- 3 -\n"
        "Final paragraph."
    )
    cleaned = clean_text(text_with_noise)
    assert "Page 1" not in cleaned
    assert "2 of 10" not in cleaned
    assert "- 3 -" not in cleaned
    assert "This is the first page." in cleaned
    assert "Final paragraph." in cleaned


def test_clean_text_normalizes_empty_lines() -> None:
    text_with_spacing = "First block.\n\n\n\nSecond block.\n\n\nThird block."
    cleaned = clean_text(text_with_spacing)
    assert "\n\n\n" not in cleaned
    assert "First block.\n\nSecond block.\n\nThird block." in cleaned


# =====================================================================
# UNIT TESTS - TEXT CHUNKER
# =====================================================================


def test_chunker_respects_boundaries_and_page_numbers() -> None:
    pages = [
        {"page_number": 1, "text": "Paragraph A.\n\nParagraph B."},
        {"page_number": 2, "text": "Paragraph C."},
    ]
    # Small chunk size to force splits, overlap=0 to check exact splitting boundaries
    chunker = TextChunker(chunk_size=15, chunk_overlap=0)
    chunks = chunker.chunk_document(pages)

    assert len(chunks) == 3
    # Check page mapping
    assert chunks[0]["page_number"] == 1
    assert chunks[0]["content"] == "Paragraph A."
    assert chunks[1]["page_number"] == 1
    assert chunks[1]["content"] == "Paragraph B."
    assert chunks[2]["page_number"] == 2
    assert chunks[2]["content"] == "Paragraph C."


# =====================================================================
# UNIT TESTS - DOCUMENT EXTRACTOR (MOCK)
# =====================================================================


@patch("fitz.open")
def test_extractor_pdf(mock_fitz_open: MagicMock) -> None:
    # Setup mock fitz page get_text return values
    mock_doc = MagicMock()
    mock_page1 = MagicMock()
    mock_page1.get_text.return_value = "PDF Page 1 Text"
    mock_page2 = MagicMock()
    mock_page2.get_text.return_value = "PDF Page 2 Text"

    mock_doc.__iter__.return_value = [mock_page1, mock_page2]
    mock_fitz_open.return_value = mock_doc

    pages = DocumentExtractor.extract_text("dummy.pdf", ".pdf")
    assert len(pages) == 2
    assert pages[0]["page_number"] == 1
    assert pages[0]["text"] == "PDF Page 1 Text"
    assert pages[1]["page_number"] == 2
    assert pages[1]["text"] == "PDF Page 2 Text"
    mock_doc.close.assert_called_once()


@patch("docx.Document")
def test_extractor_docx(mock_docx_doc: MagicMock) -> None:
    # Setup mock docx paragraphs and runs containing a page break
    mock_p1 = MagicMock()
    mock_p1.text = "Para 1"
    mock_run1 = MagicMock()
    mock_run1._r.xml = "<w:r><w:t>Para 1</w:t></w:r>"
    mock_p1.runs = [mock_run1]

    # Paragraph containing a page break
    mock_p2 = MagicMock()
    mock_p2.text = "Para 2"
    mock_run2 = MagicMock()
    mock_run2._r.xml = '<w:r><w:br w:type="page"/></w:r>'
    mock_p2.runs = [mock_run2]

    mock_docx_instance = MagicMock()
    mock_docx_instance.paragraphs = [mock_p1, mock_p2]
    mock_docx_doc.return_value = mock_docx_instance

    pages = DocumentExtractor.extract_text("dummy.docx", ".docx")
    # Para 1 on page 1, Para 2 on page 2
    assert len(pages) == 2
    assert pages[0]["page_number"] == 1
    assert pages[0]["text"] == "Para 1"
    assert pages[1]["page_number"] == 2
    assert pages[1]["text"] == "Para 2"


# =====================================================================
# INTEGRATION TESTS - API ENDPOINT
# =====================================================================


def test_upload_requires_authentication(client: TestClient) -> None:
    files = {"file": ("test.txt", "Test content", "text/plain")}
    response = client.post("/documents/upload", files=files, data={"department": "HR"})
    assert response.status_code == 401


def test_upload_rejects_non_admin_employees(client: TestClient) -> None:
    token = get_token(client, "employee@company.com", "employee-password")
    headers = {"Authorization": f"Bearer {token}"}
    files = {"file": ("test.txt", "Test content", "text/plain")}

    response = client.post(
        "/documents/upload",
        files=files,
        data={"department": "HR"},
        headers=headers,
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Admin privileges required to upload documents."


def test_upload_rejects_unsupported_extensions(client: TestClient) -> None:
    token = get_token(client, "admin@company.com", "admin-password")
    headers = {"Authorization": f"Bearer {token}"}
    files = {"file": ("test.png", b"binarydata", "image/png")}

    response = client.post(
        "/documents/upload",
        files=files,
        data={"department": "HR"},
        headers=headers,
    )
    assert response.status_code == 400
    assert "Unsupported file format" in response.json()["detail"]


def test_upload_rejects_large_files(client: TestClient) -> None:
    token = get_token(client, "admin@company.com", "admin-password")
    headers = {"Authorization": f"Bearer {token}"}

    # Setting size limit to 50KB. Uploading 60KB.
    large_data = "a" * (60 * 1024)
    files = {"file": ("test.txt", large_data, "text/plain")}

    response = client.post(
        "/documents/upload",
        files=files,
        data={"department": "HR"},
        headers=headers,
    )
    assert response.status_code == 413
    assert "exceeds maximum allowed size" in response.json()["detail"]


def test_upload_admin_success(client: TestClient, db_session: Session) -> None:
    token = get_token(client, "admin@company.com", "admin-password")
    headers = {"Authorization": f"Bearer {token}"}

    text_content = (
        "This is a company policy document.\n\n"
        "It governs internal communication guidelines.\n\n"
        "Page 1\n\n"  # Noise to be cleaned
        "All employee accounts should be secure."
    )
    files = {"file": ("policy.txt", text_content, "text/plain")}

    response = client.post(
        "/documents/upload",
        files=files,
        data={"department": "Compliance"},
        headers=headers,
    )

    assert response.status_code == 201
    body = response.json()
    assert body["filename"] == "policy.txt"
    assert body["department"] == "Compliance"
    assert body["is_processed"] is True

    # 1. Verify file was saved locally
    saved_path = body["file_path"]
    assert os.path.exists(saved_path)

    # 2. Verify document record in database
    doc_id = body["id"]
    doc_in_db = db_session.get(Document, doc_id)
    assert doc_in_db is not None
    assert doc_in_db.filename == "policy.txt"
    assert doc_in_db.department == "Compliance"

    # 3. Verify chunk generation in database (should have cleaned noise and split content)
    chunks_in_db = db_session.query(Chunk).filter_by(document_id=doc_id).all()
    assert len(chunks_in_db) > 0

    # The string "Page 1" should be cleaned out of the persisted chunks
    all_chunks_text = " ".join([c.content for c in chunks_in_db])
    assert "Page 1" not in all_chunks_text
    assert "company policy document" in all_chunks_text
    assert "internal communication" in all_chunks_text
    assert "employee accounts" in all_chunks_text
