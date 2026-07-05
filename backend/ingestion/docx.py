"""DOCX text extractor."""
import logging
from typing import Optional
import docx

from .base import BaseExtractor

logger = logging.getLogger(__name__)

class DocxExtractor(BaseExtractor):
    """Extract text from DOCX files."""

    def extract(self, file_path: str) -> str:
        """Extract text from a DOCX file.

        Args:
            file_path: Path to the DOCX file.

        Returns:
            Extracted text as a string.
        """
        try:
            doc = docx.Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            logger.error(f"Failed to extract text from DOCX {file_path}: {e}")
            return ""