# Authentication Module TODO

## Milestone 1: Security Foundation

- [x] Create security configuration for JWT settings.
- [x] Create bcrypt password hashing utilities.
- [x] Create JWT access token helpers.

## Milestone 2: User SQLAlchemy Model

- [x] Create normalized user table model.
- [x] Create admin and employee role enum.
- [x] Add uniqueness and lookup indexes.

## Milestone 3: Pydantic Auth Schemas

- [x] Create signup request validation.
- [x] Create login request validation.
- [x] Create token and public user response schemas.

## Milestone 4: Authentication Service

- [x] Implement duplicate email handling.
- [x] Prevent public admin signup unless explicitly enabled.
- [x] Implement bcrypt password hashing during signup.
- [x] Implement login credential verification.
- [x] Implement JWT generation after successful login.

## Milestone 5: Dependencies and Permissions

- [x] Implement database session dependency.
- [x] Implement current user dependency.
- [x] Implement active user protection.
- [x] Implement reusable role and permission checks.

## Milestone 6: Auth API Routes

- [x] Implement POST /auth/signup.
- [x] Implement POST /auth/login.
- [x] Implement GET /auth/me.

## Milestone 7: Build Verification and Integration Cleanup

- [x] Add package initialization files.
- [x] Keep scope limited to authentication-related files.
- [x] Run Python syntax verification once Python is available on PATH.

## Backend Integration Milestone 2: Bootstrap and Auth Integration

- [x] Create FastAPI application entrypoint.
- [x] Configure environment-driven application settings.
- [x] Configure SQLAlchemy database engine and session management.
- [x] Register authentication routes in the FastAPI app.
- [x] Configure CORS.
- [x] Add Alembic migration setup.
- [x] Add initial users table migration.
- [x] Add authentication and security tests.
- [x] Verify imports and Python compilation.
- [x] Verify tests pass.
- [x] Verify OpenAPI exposes authentication endpoints.
- [x] Verify Uvicorn startup and Swagger UI availability.

## Milestone 8: Database Foundation, User Schema Refinement, and Configuration Setup (Completed)

- [x] Configure database settings (Qdrant, Neo4j, LLM, OpenAI) in `backend/config/settings.py` and `.env.example`
- [x] Refine user model to include `department` in `backend/models/user.py`
- [x] Create token blacklist database model in `backend/models/token_blacklist.py`
- [x] Create document and chunk database models in `backend/models/document.py`
- [x] Update authentication schemas to include `department` in `backend/schemas/auth.py`
- [x] Update `AuthService` to support department registration and token blacklisting
- [x] Update JWT dependency validation to check blacklisted tokens
- [x] Implement `POST /auth/logout` endpoint in `backend/api/auth.py`
- [x] Create `docker-compose.yml` for PostgreSQL, Neo4j, and Qdrant in workspace root
- [x] Create Alembic migration script for department, token blacklist, documents, and chunks tables
- [x] Run unit and integration tests (14 passed) verifying signup, login, logout, and token invalidation

## Milestone 9: Document Ingestion, Text Extraction, and Chunking Services (Completed)

- [x] Implement Document Upload API (`POST /documents/upload` - Admin only, validation for PDF, DOCX, TXT, MD, store files and metadata).
- [x] Create Ingestion Service layout (`backend/ingestion/`).
- [x] Implement Text Extraction service support for PDF (PyMuPDF), DOCX (python-docx), TXT, and Markdown in `extractor.py`.
- [x] Implement Text Cleaning utility (remove headers, footers, blank lines, page numbers) in `cleaner.py`.
- [x] Implement Recursive Chunking service to split document text into chunks and retain metadata (chunk ID, document ID, page numbers) in `chunker.py`.
- [x] Create Document and Chunk Pydantic schemas in `backend/schemas/document.py`.
- [x] Register router in `backend/main.py` and create local `uploads` storage directory.
- [x] Write and run unit and integration tests (10 new tests, total 24 tests passed) in `backend/tests/test_ingestion.py`.

## Milestone 10: Embedding Service & Vector Database Integration (Completed)

- [x] Add `qdrant-client` and AI embeddings packages (Sentence Transformers or OpenAI) to `backend/requirements.txt`.
- [x] Implement an Embedding Service (`backend/embeddings/`) that interacts with OpenAI or SentenceTransformers.
- [x] Implement a Qdrant client client/service (`backend/vector_db/`) to initialize collections, load/upsert vectors, and perform vector searches.
- [x] Create a synchronization pipeline that reads un-vectorized text chunks from PostgreSQL, generates embeddings, and saves them to Qdrant alongside document metadata (document ID, chunk index, department).
- [x] Implement permission-aware filtering (e.g. filter Qdrant payloads by `department == user_department` or admin bypass).
- [x] Write integration and unit tests for the embedding service and vector store queries.

## Milestone 11: Knowledge Graph & Neo4j Integration (Completed)

- [x] Add `neo4j` to `backend/requirements.txt` and establish client connections in `backend/graph/client.py`.
- [x] Implement in-memory graph database fallback for offline testing environments.
- [x] Implement entity and relationship extractor in `backend/graph/extractor.py` using regex and contextual markers.
- [x] Hook extraction service to the document ingestion pipeline to dynamically build nodes and edges on upload.

## Milestone 12: Multi-Agent RAG Pipeline with LangGraph (Completed)

- [x] Add `langgraph`, `langchain-core` to requirements.
- [x] Build state graph workflow structure in `backend/workflows/rag_workflow.py`.
- [x] Implement individual agents: Planner, Retriever, Graph, Reasoning, Citation, and Response.
- [x] Implement fallback SQL text matching in Retriever agent.
- [x] Create POST /query endpoint in `backend/api/rag.py`.

## Milestone 13: Analytics Backend (Completed)

- [x] Create QueryLog database model in `backend/models/analytics.py`.
- [x] Implement GET /analytics/dashboard endpoint tracking total queries, latency, unused documents, upload stats, and low-confidence knowledge gaps.
- [x] Log analytics details synchronously on each user query.

## Milestone 14: Logging, Error Handling, and Verification (Completed)

- [x] Implement request/response logging middleware in `backend/middleware/logging_middleware.py`.
- [x] Implement central exception interceptors in `backend/main.py`.
- [x] Write and run 30 unit and integration tests verifying all platform functionalities.
