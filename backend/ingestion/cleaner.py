"""Text cleaning utility for parsed document texts."""

import re


def clean_text(text: str) -> str:
    """Clean extracted document text by removing noise like page numbers,

    recurrent headers, and normalizing empty lines.
    """
    if not text:
        return ""

    lines = text.splitlines()
    cleaned_lines = []

    # Regexes for page numbers and typical document placeholders
    # e.g., "Page 12", "12 of 100", "- 12 -", "12" on its own line
    page_num_patterns = [
        re.compile(r"^\s*page\s+\d+\s*(of\s+\d+)?\s*$", re.IGNORECASE),
        re.compile(r"^\s*-?\s*\d+\s*-?\s*$"),
        re.compile(r"^\s*\d+\s+of\s+\d+\s*$", re.IGNORECASE),
    ]

    for line in lines:
        stripped = line.strip()

        # Handle blank lines
        if not stripped:
            cleaned_lines.append("")
            continue

        # Skip identified page numbers
        is_page_number = False
        for pattern in page_num_patterns:
            if pattern.match(stripped):
                is_page_number = True
                break

        if is_page_number:
            continue

        # Keep original line spacing but strip trailing spaces
        cleaned_lines.append(line.rstrip())

    # Reassemble text
    reconstructed = "\n".join(cleaned_lines)

    # Normalize multiple consecutive empty lines to a maximum of two newlines
    # (keeps paragraph separations without extra vertical spacing noise)
    normalized = re.sub(r"\n{3,}", "\n\n", reconstructed)

    return normalized.strip()
