"""create prompts table

Revision ID: 20260907_0001
Revises:
Create Date: 2026-09-07 00:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260907_0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "prompts",
        sa.Column("id", sa.String(length=80), nullable=False),
        sa.Column("type", sa.String(length=20), nullable=False),
        sa.Column("keyword", sa.String(length=80), nullable=False),
        sa.Column("rank", sa.Integer(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("thumbnail_url", sa.String(length=500), nullable=True),
        sa.Column("author", sa.String(length=80), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_prompts_created_at"), "prompts", ["created_at"], unique=False)
    op.create_index(op.f("ix_prompts_id"), "prompts", ["id"], unique=False)
    op.create_index(op.f("ix_prompts_keyword"), "prompts", ["keyword"], unique=False)
    op.create_index(op.f("ix_prompts_rank"), "prompts", ["rank"], unique=False)
    op.create_index(op.f("ix_prompts_type"), "prompts", ["type"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_prompts_type"), table_name="prompts")
    op.drop_index(op.f("ix_prompts_rank"), table_name="prompts")
    op.drop_index(op.f("ix_prompts_keyword"), table_name="prompts")
    op.drop_index(op.f("ix_prompts_id"), table_name="prompts")
    op.drop_index(op.f("ix_prompts_created_at"), table_name="prompts")
    op.drop_table("prompts")
