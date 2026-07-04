from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from backend.api.auth import router as auth_router
from backend.api.documents import router as documents_router
from backend.api.rag import router as rag_router
from backend.api.analytics import router as analytics_router
from backend.middleware.logging_middleware import LoggingMiddleware
from backend.config.settings import get_settings


from contextlib import asynccontextmanager

logger = logging.getLogger("ai_company_brain")
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Execute seeding procedures on database startup."""
    from backend.db.session import SessionLocal
    from backend.db.seed import seed_db_on_startup

    db = SessionLocal()
    try:
        seed_db_on_startup(db)
    except Exception as exc:
        logger.warning(f"Startup mock database seeding skipped: {exc}")
    finally:
        db.close()
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend API for AI Company Brain.",
    lifespan=lifespan,
)

# Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Capture unhandled exceptions, log them, and return a clean HTTP 500 payload."""
    logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected database or server error occurred."},
    )

# Register Middleware
app.add_middleware(LoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth_router)
app.include_router(documents_router)
app.include_router(rag_router)
app.include_router(analytics_router)


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    """Return a lightweight startup and routing health signal."""

    return {"status": "ok"}
