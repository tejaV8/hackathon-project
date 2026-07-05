"""Semantic chunking utility."""
import re
from typing import List

class SemanticChunker:
    """Split text into chunks based on semantic boundaries (paragraphs) and size."""

    def __init__(self, chunk_size: int = 1000, overlap: int = 200):
        """Initialize the chunker.

        Args:
            chunk_size: Maximum size of each chunk in characters.
            overlap: Number of characters to overlap between chunks.
        """
        self.chunk_size = chunk_size
        self.overlap = overlap

    def chunk(self, text: str) -> List[str]:
        """Split text into chunks.

        Args:
            text: Input text to be chunked.

        Returns:
            List of text chunks.
        """
        # First, split by paragraphs (double newline)
        paragraphs = re.split(r'\n\s*\n', text)
        chunks = []
        current_chunk = ""
        for para in paragraphs:
            para = para.strip()
            if not para:
                continue
            # If adding this paragraph exceeds the chunk size, save the current chunk and start a new one
            if len(current_chunk) + len(para) + 2 > self.chunk_size and current_chunk:
                chunks.append(current_chunk.strip())
                # Start new chunk with overlap from the end of the current chunk
                overlap_text = self._get_overlap(current_chunk)
                current_chunk = overlap_text + "\n\n" + para if overlap_text else para
            else:
                if current_chunk:
                    current_chunk += "\n\n" + para
                else:
                    current_chunk = para
        # Add the last chunk
        if current_chunk:
            chunks.append(current_chunk.strip())
        return chunks

    def _get_overlap(self, overlap: int = 200):
        """Get the overlap text from the end of a chunk.

        Args:
            chunk: The chunk text.
            overlap: Number of characters to take from the end.

        Returns:
            Overlap text.
        """
        if len(chunk) <= self.overlap:
            return chunk
        return chunk[-self.overlap:]