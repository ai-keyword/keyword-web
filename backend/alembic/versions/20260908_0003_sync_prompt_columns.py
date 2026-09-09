"""sync prompt columns for existing databases

Revision ID: 20260908_0003
Revises: 20260908_0002
Create Date: 2026-09-08 00:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy import inspect
from sqlalchemy.dialects import mysql


revision: str = "20260908_0003"
down_revision: str | None = "20260908_0002"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    existing_columns = {
        column["name"] for column in inspect(op.get_bind()).get_columns("prompts")
    }
    columns = {
        "like_count": sa.Column("like_count", sa.Integer(), nullable=False, server_default="0"),
        "thumbnail_data": sa.Column(
            "thumbnail_data", sa.LargeBinary().with_variant(mysql.LONGBLOB(), "mysql"), nullable=True
        ),
        "thumbnail_content_type": sa.Column(
            "thumbnail_content_type", sa.String(length=100), nullable=True
        ),
    }

    for name, column in columns.items():
        if name not in existing_columns:
            op.add_column("prompts", column)


def downgrade() -> None:
    existing_columns = {
        column["name"] for column in inspect(op.get_bind()).get_columns("prompts")
    }
    for name in ("thumbnail_content_type", "thumbnail_data", "like_count"):
        if name in existing_columns:
            op.drop_column("prompts", name)