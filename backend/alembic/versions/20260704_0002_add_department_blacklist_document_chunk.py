"""Add department blacklist document chunk.

Revision ID: 20260704_0002
Revises: 20260704_0001
Create Date: 2026-07-04
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "20260704_0002"
down_revision: str | None = "20260704_0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Add column to users
    op.add_column("users", sa.Column("department", sa.String(length=100), nullable=True))

    # Create blacklisted_tokens table
    op.create_table(
        "blacklisted_tokens",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("token", sa.String(length=500), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_blacklisted_tokens_id", "blacklisted_tokens", ["id"], unique=False)
    op.create_index("ix_blacklisted_tokens_token", "blacklisted_tokens", ["token"], unique=True)

    # Create documents table
    op.create_table(
        "documents",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("filename", sa.String(length=255), nullable=False),
        sa.Column("file_path", sa.String(length=500), nullable=False),
        sa.Column("file_type", sa.String(length=10), nullable=False),
        sa.Column("file_size", sa.Integer(), nullable=False),
        sa.Column("uploader_id", sa.Integer(), nullable=False),
        sa.Column("department", sa.String(length=100), nullable=True),
        sa.Column("is_processed", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["uploader_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_documents_id", "documents", ["id"], unique=False)

    # Create chunks table
    op.create_table(
        "chunks",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("document_id", sa.Integer(), nullable=False),
        sa.Column("chunk_index", sa.Integer(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("page_number", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["document_id"], ["documents.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_chunks_id", "chunks", ["id"], unique=False)


def downgrade() -> None:
    # Drop chunks table
    op.drop_index("ix_chunks_id", table_name="chunks")
    op.drop_table("chunks")

    # Drop documents table
    op.drop_index("ix_documents_id", table_name="documents")
    op.drop_table("documents")

    # Drop blacklisted_tokens table
    op.drop_index("ix_blacklisted_tokens_token", table_name="blacklisted_tokens")
    op.drop_index("ix_blacklisted_tokens_id", table_name="blacklisted_tokens")
    op.drop_table("blacklisted_tokens")

    # Drop column from users
    op.drop_column("users", "department")
