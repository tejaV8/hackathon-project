# AI COMPANY BRAIN - TODO

## Milestone 1: Environment Setup & Monorepo Foundation
- [x] Create root docker-compose.yml with PostgreSQL, Neo4j, Qdrant
- [x] Create .env file with environment variables
- [x] Configure frontend with Next.js 14+ (App Router), TypeScript, Tailwind CSS, Shadcn UI
- [x] Configure backend with FastAPI, pydantic-settings, SQLAlchemy, Alembic
- [x] Verify frontend and backend build/run successfully

## Milestone 2: Secure Core Authentication & DB Schema
- [x] Create PostgreSQL schemas for Users (id, email, hashed_password, role) and Documents (id, filename, storage_path, uploaded_by, visibility_role)
- [x] Implement JWT-based auth backend with secure handling (bearer tokens or HTTP-only cookies)
- [x] Implement explicit role-based access control (RBAC) dependency wrapper (check_role("Admin"))
- [x] Build complete Frontend Login & Registration pages with form handling, input validation, and error toasts
- [x] Implement email verification and password reset flows (optional but recommended)

## Milestone 3: Document Ingestion & Knowledge Graph Pipeline
- [ ] Build backend file extraction services for PDF, DOCX, TXT, and MD
- [ ] Implement semantic chunking utility in rag/
- [ ] Implement Qdrant vector storage engine with embedding generation (SentenceTransformers or OpenAI)
- [ ] Insert chunks with RBAC metadata filters (allowed_roles: ["Admin", "Employee"])
- [ ] Implement entity-relationship extraction prompts (backend/prompts/graph_extraction.txt)
- [ ] Write Neo4j service (graph/neo4j_service.py) to map and insert entities (Employee, Department, Project) and relationships (BELONGS_TO, OWNS)
- [ ] Build Document Management Dashboard Page in frontend: display table of documents, upload progress, status badges (Processing, Indexed, Failed), role assignment selectors

## Milestone 4: LangGraph Multi-Agent Orchestration & RAG Engine
- [ ] Define LangGraph state schema: user query, vector context, graph context, verified citations, final response
- [ ] Build specialized agents:
    * Planner Agent: parses query intent
    * Retriever Agent: queries Qdrant with metadata filters from user JWT role
    * Graph Agent: queries Neo4j with dynamic Cypher queries for entity context
    * Reasoning Agent: synthesizes textual and graph contexts
    * Citation Agent: cross-references LLM claims against raw chunk IDs for truthfulness
    * Response Agent: constructs final payloads (Answer, Sources[], ConfidenceScore)
- [ ] Wire nodes into active LangGraph workflow state machine

## Milestone 5: Next-Gen Enterprise Chat Interface
- [ ] Build high-fidelity ChatGPT-like conversational UI (frontend/app/chat/page.tsx)
    * Framer Motion message transitions
    * Dark theme obsidian aesthetic
    * Source citation expanding drawers
    * Instant UI feedback
- [ ] Build full frontend-backend integration (Server-Sent Events or clean JSON response mapping)

## Milestone 6: Executive Analytics Dashboard & Visualization
- [ ] Build backend analytics aggregators querying PostgreSQL for:
    * Total Documents
    * Popular Keywords
    * Search Volumes
    * Average System Latency
    * Unanswered Questions (Knowledge Gaps)
- [ ] Build frontend Analytics Page using recharts for usage spikes, latency drops, knowledge gap metrics
- [ ] Integrate interactive 2D Graph visualization component showcasing mini-interactive node graph of company entities

## Additional Notes
- All code must be production-ready: no stubs, strict TypeScript, full error handling.
- Prompts must be stored in backend/prompts/ directory.
- Ensure all services are tested and work together via docker-compose.