"""LangGraph multi-agent RAG workflow definition."""

from typing import Any, Dict, List, TypedDict
from sqlalchemy.orm import Session
from sqlalchemy import select

from backend.config.settings import get_settings
from backend.vector_db.client import QdrantVectorStore
from backend.graph.client import Neo4jGraphStore
from backend.models.document import Document, Chunk


# Define the agentic state schema
class AgentState(TypedDict):
    db: Session
    question: str
    user_department: str | None
    is_admin: bool

    plan: str
    retrieved_chunks: List[Dict[str, Any]]
    graph_context: List[Dict[str, Any]]
    reasoning: str
    citations: List[Dict[str, Any]]
    confidence_score: float
    response: str


# =====================================================================
# AGENT NODES
# =====================================================================


def planner_agent(state: AgentState) -> Dict[str, Any]:
    """planner node: Analyzes the question and formats search plan tags."""

    question = state["question"]
    # Identify search terms/tags for keyword vector/graph queries
    words = re_words = [
        w.strip(",.?!").capitalize()
        for w in question.split()
        if len(w) > 4
        and w.lower() not in ("about", "their", "where", "there", "would", "could")
    ]
    plan_desc = f"Search vector store for '{question}' and query graph paths for: {', '.join(words)}"
    return {"plan": plan_desc}


def retriever_agent(state: AgentState) -> Dict[str, Any]:
    """retriever node: Queries Qdrant with user department security limits."""

    question = state["question"]
    dept = state["user_department"]
    is_admin = state["is_admin"]
    db = state["db"]

    # 1. Try vector store search
    vector_store = QdrantVectorStore()
    chunks = vector_store.search(
        query=question, limit=5, department=dept, is_admin=is_admin
    )

    # 2. Fallback SQL text search if Qdrant yields no hits (offline or cold start)
    if not chunks:
        # Get allowed documents based on department
        if is_admin:
            stmt = select(Document.id)
        else:
            # Match user department or public documents
            stmt = select(Document.id).where(
                (Document.department == dept)
                | (Document.department == "public")
                | (Document.department.is_(None))
            )
        allowed_doc_ids = db.scalars(stmt).all()

        if allowed_doc_ids:
            # Retrieve chunks with simple text match (stripping punctuation from keywords)
            words = [w.strip(",.?!:;()\"'").lower() for w in question.split() if len(w) > 3]
            words = [w for w in words if w]

            chunk_stmt = select(Chunk).where(Chunk.document_id.in_(allowed_doc_ids))
            db_chunks = db.scalars(chunk_stmt).all()

            # Rank by keyword occurrences
            scored_chunks = []
            for db_chunk in db_chunks:
                score = sum(
                    1 for w in words if w in db_chunk.content.lower()
                )
                if score > 0:
                    doc = db_chunk.document
                    scored_chunks.append(
                        {
                            "chunk_id": db_chunk.id,
                            "document_id": db_chunk.document_id,
                            "content": db_chunk.content,
                            "page_number": db_chunk.page_number,
                            "department": doc.department,
                            "filename": doc.filename,
                            "score": float(score) / len(words),
                        }
                    )
            scored_chunks.sort(key=lambda x: x["score"], reverse=True)
            chunks = scored_chunks[:5]

    # Map filenames to chunks that don't have them
    for chunk in chunks:
        if "filename" not in chunk:
            doc = db.get(Document, chunk["document_id"])
            chunk["filename"] = doc.filename if doc else "Unknown Source"

    return {"retrieved_chunks": chunks}


def graph_agent(state: AgentState) -> Dict[str, Any]:
    """graph node: Query Neo4j for entities and relationships."""

    graph_store = Neo4jGraphStore()
    # Query Neo4j for nodes and relations
    cypher = (
        "MATCH (source)-[rel]->(target) "
        "RETURN source.name AS source, type(rel) AS relationship, target.name AS target "
        "LIMIT 10"
    )
    records = graph_store.query(cypher)
    return {"graph_context": records}


def reasoning_agent(state: AgentState) -> Dict[str, Any]:
    """reasoning node: Combines text facts & graph relations to create draft response."""

    settings = get_settings()
    question = state["question"]
    chunks = state["retrieved_chunks"]
    graph = state["graph_context"]

    # Build context string
    text_context = "\n\n".join(
        [f"[Source: {c['filename']}, Page {c['page_number']}] {c['content']}" for c in chunks]
    )
    graph_context = "\n".join(
        [f"- {r.get('source')} {r.get('relationship')} {r.get('target')}" for r in graph]
    )

    # 1. Use OpenAI if key is present
    if settings.openai_api_key:
        try:
            from openai import OpenAI

            client = OpenAI(api_key=settings.openai_api_key)
            prompt = (
                f"You are the AI Company Brain. Answer the question using the context provided below.\n\n"
                f"### Fact Context:\n{text_context}\n\n"
                f"### Entity Relations:\n{graph_context}\n\n"
                f"### Question:\n{question}\n\n"
                f"Write an accurate, professional answer. Do not add outside assumptions."
            )
            res = client.chat.completions.create(
                model=settings.llm_model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.0,
            )
            return {"reasoning": res.choices[0].message.content}
        except Exception as exc:
            print(f"OpenAI completion failed, using fallback synthesis: {exc}")

    # 2. Resilient deterministic text synthesizer fallback
    if not chunks:
        draft = "I could not find any matching documents in the database to answer your question."
    else:
        # Create a summary using the top chunk
        top_chunk = chunks[0]
        draft = (
            f"According to {top_chunk['filename']} (Page {top_chunk['page_number']}): "
            f"\"{top_chunk['content']}\"\n\n"
        )
        if graph:
            draft += "Additionally, the following business graph links were found:\n"
            draft += "\n".join(
                [
                    f"- {r.get('source')} is related to {r.get('target')} via {r.get('relationship')}."
                    for r in graph[:3]
                ]
            )

    return {"reasoning": draft}


def citation_agent(state: AgentState) -> Dict[str, Any]:
    """citation node: Verifies draft content against actual chunks and constructs citations."""

    draft = state["reasoning"]
    chunks = state["retrieved_chunks"]

    citations = []
    # Calculate confidence based on keyword matching
    matches_count = 0
    total_chunks = len(chunks)

    for chunk in chunks:
        # A simple check: if keywords from the chunk appear in the draft, link it as citation
        words = [w.lower() for w in chunk["content"].split() if len(w) > 4]
        match_ratio = (
            sum(1 for w in words if w in draft.lower()) / len(words)
            if words
            else 0
        )

        if match_ratio > 0.15:
            matches_count += 1
            citations.append(
                {
                    "filename": chunk["filename"],
                    "page_number": chunk["page_number"],
                    "confidence_score": round(match_ratio, 2),
                    "snippet": chunk["content"][:200] + "...",
                }
            )

    confidence = 0.0
    if total_chunks > 0:
        # Base confidence calculation
        confidence = float(matches_count) / total_chunks
        # Clamp between 0.0 and 1.0
        confidence = min(max(confidence, 0.0), 1.0)
    else:
        confidence = 0.0

    return {"citations": citations, "confidence_score": round(confidence, 2)}


def response_agent(state: AgentState) -> Dict[str, Any]:
    """response node: Compiles the final response formatted in Markdown."""

    answer = state["reasoning"]
    citations = state["citations"]
    confidence = state["confidence_score"]

    response_md = f"### Answer\n{answer}\n\n"
    response_md += f"**Confidence Score:** {confidence * 100:.0f}%\n\n"

    if citations:
        response_md += "#### Sources & Citations\n"
        response_md += "| Document Name | Page Number | Matching Confidence | Snippet |\n"
        response_md += "|---|---|---|---|\n"
        for cit in citations:
            response_md += (
                f"| {cit['filename']} | {cit['page_number']} | "
                f"{cit['confidence_score'] * 100:.0f}% | {cit['snippet']} |\n"
            )
    else:
        response_md += "\n*No direct document citations were linked to verify this answer.*"

    return {"response": response_md}


# =====================================================================
# STATE GRAPH COMPILATION
# =====================================================================


def build_rag_workflow() -> Any:
    """Build and compile the multi-agent LangGraph workflow."""

    from langgraph.graph import StateGraph, END

    # Instantiate StateGraph with TypedDict
    builder = StateGraph(AgentState)

    # Register Nodes
    builder.add_node("planner", planner_agent)
    builder.add_node("retriever", retriever_agent)
    builder.add_node("graph", graph_agent)
    builder.add_node("reasoner", reasoning_agent)
    builder.add_node("citator", citation_agent)
    builder.add_node("responder", response_agent)

    # Define Edges
    builder.set_entry_point("planner")
    builder.add_edge("planner", "retriever")
    builder.add_edge("retriever", "graph")
    builder.add_edge("graph", "reasoner")
    builder.add_edge("reasoner", "citator")
    builder.add_edge("citator", "responder")
    builder.add_edge("responder", END)

    return builder.compile()
