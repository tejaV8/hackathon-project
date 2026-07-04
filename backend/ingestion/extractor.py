"""Service to extract text from PDF, DOCX, TXT, and Markdown documents."""

from typing import Any
import fitz  # PyMuPDF
import docx


class DocumentExtractor:
    """Extracts text page-by-page from company documents."""

    @classmethod
    def extract_text(cls, file_path: str, file_type: str) -> list[dict[str, Any]]:
        """Extract text from the given file path based on its file extension.

        Returns:
            list[dict]: A list of dicts like [{"page_number": int, "text": str}]
        """
        normalized_type = file_type.lower().strip(".")
        if normalized_type == "pdf":
            return cls._extract_pdf(file_path)
        elif normalized_type == "docx":
            return cls._extract_docx(file_path)
        elif normalized_type in ("txt", "text"):
            return cls._extract_txt(file_path)
        elif normalized_type == "md":
            return cls._extract_md(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")

    @classmethod
    def _extract_pdf(cls, file_path: str) -> list[dict[str, Any]]:
        """Extract text page-by-page from a PDF file."""

        pages = []
        doc = fitz.open(file_path)
        try:
            for idx, page in enumerate(doc, start=1):
                text = page.get_text()
                pages.append({"page_number": idx, "text": text})
        finally:
            doc.close()
        return pages

    @classmethod
    def _extract_docx(cls, file_path: str) -> list[dict[str, Any]]:
        """Extract text from a Word document, respecting page breaks where possible."""

        pages = []
        doc = docx.Document(file_path)

        current_page_text = []
        current_page = 1

        for para in doc.paragraphs:
            # Look for page breaks in paragraph runs XML
            has_page_break = False
            for run in para.runs:
                # Check for manual page breaks or rendered page breaks
                if "w:br" in run._r.xml and 'type="page"' in run._r.xml:
                    has_page_break = True
                    break
                elif "w:lastRenderedPageBreak" in run._r.xml:
                    has_page_break = True
                    break

            if has_page_break:
                text_content = "\n".join(current_page_text).strip()
                if text_content:
                    pages.append({"page_number": current_page, "text": text_content})
                current_page += 1
                current_page_text = [para.text]
            else:
                current_page_text.append(para.text)

        # Flush the final page
        text_content = "\n".join(current_page_text).strip()
        if text_content:
            pages.append({"page_number": current_page, "text": text_content})

        if not pages:
            pages.append({"page_number": 1, "text": ""})

        return pages

    @classmethod
    def _extract_txt(cls, file_path: str) -> list[dict[str, Any]]:
        """Read standard plain text file as a single-page document."""

        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        return [{"page_number": 1, "text": content}]

    @classmethod
    def _extract_md(cls, file_path: str) -> list[dict[str, Any]]:
        """Read markdown text file as a single-page document."""

        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        return [{"page_number": 1, "text": content}]
