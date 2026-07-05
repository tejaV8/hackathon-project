"""MD text extractor."""
import logging
from typing import Optional

from .base import BaseExtractor

logger = logging.getLogger(__name__)

class MdExtractor(BaseExtractor):
    """Extract text from MD files."""

    def extract(self, file_path: str) -> str:
        """Extract text from an MD file.

        Args:
            file_path: Path to the MD file.

        Returns:
            Extracted text as a string.
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        except UnicodeDecodeError:
            # Try with a different encoding
            try:
                with open(file_path, 'r', encoding='latin-1') as file:
                    return file.read()
            except Exception as e:
                logger.error(f"Failed to extract text from MD {file_path} with fallback encoding: {e}")
                return ""
        except Exception as e:
            logger.error(f"Failed to extract text from MD {file_path}: {e}")
            return ""