"""add the AI model used for each prompt

Revision ID: 20260908_0004
Revises: 20260908_0003
Create Date: 2026-09-08 00:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op


revision: str = "20260908_0004"
down_revision: str | None = "20260908_0003"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("prompts", sa.Column("ai_model", sa.String(length=100), nullable=True))


def downgrade() -> None:
    op.drop_column("prompts", "ai_model")