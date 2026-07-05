"""Base class for file extractors."""
from abc import ABC, abstractmethod

class BaseExtractor(ABC):
    """Base class for file extractors."""

    @abstractmethod
    def extract(self, file_path: str) -> str:
        """Extract text from a file.

        Args:
            file_path: Path to the file.

        Returns:
            Extracted text as a string.
        """
        pass