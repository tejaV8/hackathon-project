"""File ingestion package."""
from .base import BaseExtractor
from .docx import DocxExtractor
from .md import MdExtractor
from .pdf import PDFExtractor
from .txt import TxtExtractor

__all__ = [
    "BaseExtractor",
    "DocxExtractor",
    "MdExtractor",
    "PDFExtractor",
    "TxtExtractor",
]