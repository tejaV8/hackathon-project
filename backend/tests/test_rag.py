"""Integration and unit tests for vector DB, graph DB, RAG agents, and Analytics."""

import os

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET", "test-secret")
os.environ.setdefault("JWT_ALGORITHM", "HS256")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
os.environ.setdefault("ALLOW_ADMIN_SIGNUP", "false")

from collections.abc import Generator

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool
from starlette.testclient import TestClient

from backend.db.session import get_db_session
from backend.main import app
from backend.models.user import Base, User, UserRole
from backend.models.document import Document, Chunk
from backend.models.analytics import QueryLog
from backend.embeddings.service import EmbeddingService
from backend.graph.client import Neo4jGraphStore
from backend.vector_db.client import QdrantVectorStore


@pytest.fixture(autouse=True)
def setup_rag_settings() -> Generator[None, None, None]:
    """Dynamically set settings limits for RAG tests."""
    os.environ["UPLOAD_DIR"] = "test_uploads_rag"
    os.environ["MAX_UPLOAD_SIZE"] = str(100 * 1024)
    os.environ["ENVIRONMENT"] = "testing"
    from backend.config.settings import get_settings
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()



@pytest.fixture()
def db_session() -> Generator[Session, None, None]:
    """Isolated SQL database session populated with test accounts and departments."""

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

    # Prepopulate Admin and Employees with different departments
    from backend.auth.password import hash_password

    admin = User(
        full_name="Admin Director",
        email="admin@company.com",
        password_hash=hash_password("admin-password"),
        role=UserRole.ADMIN,
        department="Operations",
        is_active=True,
    )
    eng_user = User(
        full_name="Engineering Employee",
        email="engineer@company.com",
        password_hash=hash_password("engineer-password"),
        role=UserRole.EMPLOYEE,
        department="Engineering",
        is_active=True,
    )
    hr_user = User(
        full_name="HR Employee",
        email="hr@company.com",
        password_hash=hash_password("hr-password"),
        role=UserRole.EMPLOYEE,
        department="HR",
        is_active=True,
    )
    db.add_all([admin, eng_user, hr_user])
    db.commit()

    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)
        engine.dispose()


@pytest.fixture()
def client(db_session: Session) -> Generator[TestClient, None, None]:
    """TestClient with database session overridden."""

    def override_get_db_session() -> Generator[Session, None, None]:
        yield db_session

    app.dependency_overrides[get_db_session] = override_get_db_session
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture(autouse=True)
def cleanup_test_uploads() -> Generator[None, None, None]:
    yield
    if os.path.exists("test_uploads_rag"):
        import shutil

        shutil.rmtree("test_uploads_rag")


def get_token(client: TestClient, email: str, secret: str) -> str:
    """Helper to retrieve JWT token."""

    res = client.post("/auth/login", json={"email": email, "password": secret})
    return res.json()["access_token"]


# =====================================================================
# UNIT TESTS - EMBEDDINGS
# =====================================================================


def test_embedding_service_fallback() -> None:
    service = EmbeddingService()
    dim = service.get_embedding_dimension()
    assert dim in (384, 1536)

    # Test single embed
    vector = service.embed_text("Verify system behavior")
    assert len(vector) == dim
    assert isinstance(vector[0], float)

    # Test batch embed
    vectors = service.embed_batch(["First string", "Second string"])
    assert len(vectors) == 2
    assert len(vectors[0]) == dim


# =====================================================================
# UNIT TESTS - KNOWLEDGE GRAPH
# =====================================================================


def test_knowledge_graph_in_memory_fallback() -> None:
    store = Neo4jGraphStore()
    # Force mock mode
    store.enabled = False

    store.add_node("Person", "Alice", {"name": "Alice Smith", "role": "Engineer"})
    store.add_node("Project", "Phoenix", {"name": "Project Phoenix"})
    store.add_relationship("Alice", "Phoenix", "WORKS_ON", {"since": "2026"})

    # Verify query retrieval
    nodes = store.query("MATCH (n:Person) RETURN n")
    assert len(nodes) == 2  # Alice and Phoenix nodes in mock database
    names = [n["n"]["name"] for n in nodes]
    assert "Alice Smith" in names
    assert "Project Phoenix" in names

    edges = store.query("MATCH (a)-[r:WORKS_ON]->(b) RETURN a, r, b")
    assert len(edges) == 1
    assert edges[0]["source"]["name"] == "Alice Smith"
    assert edges[0]["target"]["name"] == "Project Phoenix"
    assert edges[0]["rel"]["type"] == "WORKS_ON"


# =====================================================================
# INTEGRATION TESTS - RAG AND ACCESS CONTROLS
# =====================================================================


def test_query_requires_auth(client: TestClient) -> None:
    response = client.post("/query", json={"question": "What is the policy?"})
    assert response.status_code == 401


def test_query_department_security_filtering(
    client: TestClient, db_session: Session
) -> None:
    # 1. Signups & tokens
    admin_token = get_token(client, "admin@company.com", "admin-password")
    eng_token = get_token(client, "engineer@company.com", "engineer-password")
    hr_token = get_token(client, "hr@company.com", "hr-password")

    # 2. Upload Document A for Engineering (Admin only)
    headers = {"Authorization": f"Bearer {admin_token}"}
    client.post(
        "/documents/upload",
        files={"file": ("eng_spec.txt", "Engineering server runs on FastAPI and Python.", "text/plain")},
        data={"department": "Engineering"},
        headers=headers,
    )

    # 3. Upload Document B for HR (Admin only)
    client.post(
        "/documents/upload",
        files={"file": ("hr_guide.txt", "HR conducts employee benefits review annually.", "text/plain")},
        data={"department": "HR"},
        headers=headers,
    )

    # A. Engineering User queries about "FastAPI" -> Should retrieve engineering spec and answer
    eng_headers = {"Authorization": f"Bearer {eng_token}"}
    eng_response = client.post(
        "/query", json={"question": "What technology is used for server?"}, headers=eng_headers
    )
    assert eng_response.status_code == 200
    eng_body = eng_response.json()
    assert eng_body["confidence_score"] > 0
    assert len(eng_body["citations"]) == 1
    assert eng_body["citations"][0]["filename"] == "eng_spec.txt"
    assert "FastAPI" in eng_body["response"]

    # B. HR User queries about "FastAPI" -> Should NOT retrieve engineering spec (401/no citations)
    hr_headers = {"Authorization": f"Bearer {hr_token}"}
    hr_response = client.post(
        "/query", json={"question": "What technology is used for server?"}, headers=hr_headers
    )
    assert hr_response.status_code == 200
    hr_body = hr_response.json()
    # Should yield low confidence and empty citations because HR user is locked out of engineering files
    assert hr_body["confidence_score"] == 0.0
    assert len(hr_body["citations"]) == 0
    assert "I could not find" in hr_body["response"]


# =====================================================================
# INTEGRATION TESTS - ANALYTICS
# =====================================================================


def test_analytics_requires_admin_role(client: TestClient) -> None:
    eng_token = get_token(client, "engineer@company.com", "engineer-password")
    headers = {"Authorization": f"Bearer {eng_token}"}

    response = client.get("/analytics/dashboard", headers=headers)
    assert response.status_code == 403
    assert "Admin privileges required" in response.json()["detail"]


def test_analytics_dashboard_metrics(client: TestClient, db_session: Session) -> None:
    admin_token = get_token(client, "admin@company.com", "admin-password")
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # 1. Populating documents (Upload 2 docs: cited and uncited)
    client.post(
        "/documents/upload",
        files={"file": ("operations_manual.txt", "Operations standard operating guidelines.", "text/plain")},
        data={"department": "Operations"},
        headers=admin_headers,
    )
    client.post(
        "/documents/upload",
        files={"file": ("unused_doc.txt", "This text is never queried by users.", "text/plain")},
        data={"department": "Operations"},
        headers=admin_headers,
    )

    # 2. Trigger queries (to build logs)
    # Valid query matching operations_manual.txt
    client.post(
        "/query", json={"question": "What are operations guidelines?"}, headers=admin_headers
    )
    # Low confidence query to trigger knowledge gap
    client.post(
        "/query", json={"question": "Where is the secret vault key?"}, headers=admin_headers
    )

    # 3. Pull analytics
    dashboard_res = client.get("/analytics/dashboard", headers=admin_headers)
    assert dashboard_res.status_code == 200
    data = dashboard_res.json()

    # Verify aggregates
    assert data["total_questions"] == 2
    assert data["total_uploads"] == 2
    assert data["avg_response_time_ms"] > 0
    
    # Topic stats (should detect 'operations' or 'guidelines')
    topics = [t["topic"] for t in data["most_searched_topics"]]
    assert len(topics) > 0

    # Unused documents (should contain unused_doc.txt)
    assert "unused_doc.txt" in data["unused_documents"]
    assert "operations_manual.txt" not in data["unused_documents"]

    # Knowledge gap (should capture the low confidence question)
    assert "Where is the secret vault key?" in data["knowledge_gaps"]

    # Uploads by department
    assert data["uploads_by_department"]["Operations"] == 2
