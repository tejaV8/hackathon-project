"""FastAPI middleware for request/response structured logging."""

import time
import logging
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


# Setup standard structured logger
logger = logging.getLogger("ai_company_brain")
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)


class LoggingMiddleware(BaseHTTPMiddleware):
    """Intercepts and logs every API request method, path, response status, and duration."""

    async def dispatch(self, request: Request, call_next) -> Response:
        start_time = time.perf_counter()

        logger.info(f"Incoming Request: {request.method} {request.url.path}")

        try:
            response = await call_next(request)
            duration_ms = (time.perf_counter() - start_time) * 1000
            logger.info(
                f"Completed Request: {request.method} {request.url.path} | "
                f"Status: {response.status_code} | Duration: {duration_ms:.2f}ms"
            )
            return response
        except Exception as exc:
            duration_ms = (time.perf_counter() - start_time) * 1000
            logger.error(
                f"Request Failed: {request.method} {request.url.path} | "
                f"Error: {str(exc)} | Duration: {duration_ms:.2f}ms",
                exc_info=True,
            )
            raise exc
