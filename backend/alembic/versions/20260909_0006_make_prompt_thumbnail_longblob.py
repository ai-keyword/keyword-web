"""make prompt thumbnail_data a MySQL LONGBLOB column

Revision ID: 20260909_0006
Revises: 20260909_0005
Create Date: 2026-09-09 00:00:00.000000
"""

from collections.abc import Sequence

from alembic import op


revision: str = "20260909_0006"
down_revision: str | None = "20260909_0005"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name == "mysql":
        op.execute("ALTER TABLE prompts MODIFY thumbnail_data LONGBLOB NULL")


def downgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name == "mysql":
        op.execute("ALTER TABLE prompts MODIFY thumbnail_data BLOB NULL")
