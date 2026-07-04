"""Recursive text chunker service preserving page boundaries."""

import re
from typing import Any


class TextChunker:
    """Splits cleaned document text page-by-page into semantic chunks

    using recursive structural boundaries (paragraphs, sentences, characters).
    """

    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200) -> None:
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_document(self, pages: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """Split a list of pages [{"page_number": int, "text": str}] into chunks.

        Returns:
            list[dict]: A list of chunks with keys {"chunk_index": int, "content": str, "page_number": int}
        """
        chunks = []
        chunk_idx = 0

        for page in pages:
            page_num = page["page_number"]
            text = page["text"]

            page_chunks = self._split_text(text)

            for content in page_chunks:
                chunks.append(
                    {
                        "chunk_index": chunk_idx,
                        "content": content,
                        "page_number": page_num,
                    }
                )
                chunk_idx += 1

        return chunks

    def _split_text(self, text: str) -> list[str]:
        """Split page text recursively into chunks using paragraph divisions."""

        if len(text) <= self.chunk_size:
            return [text] if text.strip() else []

        paragraphs = text.split("\n\n")
        chunks = []
        current_chunk = []
        current_len = 0

        for para in paragraphs:
            para_len = len(para)

            # If a single paragraph is too large, split it by sentence
            if para_len > self.chunk_size:
                if current_chunk:
                    chunks.append("\n\n".join(current_chunk))
                    current_chunk = []
                    current_len = 0

                sentence_chunks = self._split_paragraph_by_sentences(para)
                chunks.extend(sentence_chunks)
                continue

            # Standard accumulation with size verification
            if current_len + para_len + (2 if current_chunk else 0) > self.chunk_size:
                chunks.append("\n\n".join(current_chunk))

                # Build overlap from previous chunk end
                overlap_text = self._build_overlap(current_chunk)
                current_chunk = [overlap_text, para] if overlap_text else [para]
                current_len = sum(len(c) for c in current_chunk) + (
                    2 if len(current_chunk) > 1 else 0
                )
            else:
                current_chunk.append(para)
                current_len += para_len + (2 if len(current_chunk) > 1 else 0)

        if current_chunk:
            chunks.append("\n\n".join(current_chunk))

        return [c.strip() for c in chunks if c.strip()]

    def _split_paragraph_by_sentences(self, paragraph: str) -> list[str]:
        """Split a large paragraph using sentence boundaries."""

        sentences = re.split(r"(?<=[.!?])\s+", paragraph)
        chunks = []
        current_chunk = []
        current_len = 0

        for sentence in sentences:
            sent_len = len(sentence)

            # If a single sentence exceeds the chunk size, slice by characters
            if sent_len > self.chunk_size:
                if current_chunk:
                    chunks.append(" ".join(current_chunk))
                    current_chunk = []
                    current_len = 0
                char_chunks = self._split_by_chars(sentence)
                chunks.extend(char_chunks)
                continue

            if current_len + sent_len + (1 if current_chunk else 0) > self.chunk_size:
                chunks.append(" ".join(current_chunk))

                overlap_text = self._build_overlap(current_chunk)
                current_chunk = [overlap_text, sentence] if overlap_text else [sentence]
                current_len = sum(len(c) for c in current_chunk) + (
                    1 if len(current_chunk) > 1 else 0
                )
            else:
                current_chunk.append(sentence)
                current_len += sent_len + (1 if len(current_chunk) > 1 else 0)

        if current_chunk:
            chunks.append(" ".join(current_chunk))

        return chunks

    def _split_by_chars(self, text: str) -> list[str]:
        """Fallback slicing method when sentences are longer than chunk size."""

        chunks = []
        start = 0
        while start < len(text):
            end = start + self.chunk_size
            chunks.append(text[start:end])
            start += self.chunk_size - self.chunk_overlap
        return chunks

    def _build_overlap(self, chunk_parts: list[str]) -> str:
        """Helper to extract trailing text from list of strings to act as overlap."""

        if not chunk_parts or self.chunk_overlap <= 0:
            return ""
        full_text = "\n\n".join(chunk_parts)
        if len(full_text) <= self.chunk_overlap:
            return full_text
        # Return the last chunk_overlap characters
        return full_text[-self.chunk_overlap :]
