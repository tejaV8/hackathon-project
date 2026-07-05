"""PDF text extractor."""
import logging
from typing import Optional
import PyPDF2

from .base import BaseExtractor

logger = logging.getLogger(__name__)

class PDFExtractor(BaseExtractor):
    """Extract text from PDF files."""

    def extract(self, file_path: str) -> str:
        """Extract text from a PDF file.

        Args:
            file_path: Path to the PDF file.

        Returns:
            Extracted text as a string.
        """
        try:
            with open(file_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() or ""
                return text
        except Exception as e:
            logger.error(f"Failed to extract text from PDF {file_path}: {e}")
            return ""