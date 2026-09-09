"""convert prompt.id and user_likes.prompt_id from legacy string UUIDs to integer keys

Revision ID: 20260909_0007
Revises: 20260909_0006
Create Date: 2026-09-09 00:00:00.000000
"""

from collections.abc import Sequence

from alembic import op


revision: str = "20260909_0007"
down_revision: str | None = "20260909_0006"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name != "mysql":
        return

    op.execute("SET FOREIGN_KEY_CHECKS = 0")

    # Keep an explicit mapping from the old string PK values to the new numeric surrogate ids.
    op.execute("""
        CREATE TABLE IF NOT EXISTS prompt_id_map (
            old_prompt_id VARCHAR(80) NOT NULL PRIMARY KEY,
            new_prompt_id INT NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)

    op.execute("TRUNCATE TABLE prompt_id_map")

    op.execute("""
        INSERT INTO prompt_id_map (old_prompt_id, new_prompt_id)
        SELECT old_id, @rownum := @rownum + 1 AS new_prompt_id
        FROM (
            SELECT id AS old_id
            FROM prompts
            ORDER BY created_at ASC, id ASC
        ) AS ordered_prompts
        CROSS JOIN (SELECT @rownum := 0) AS init
    """)

    # Create a new integer-backed prompts table using the same columns as the current model.
    op.execute("""
        CREATE TABLE prompts_new (
            id INT NOT NULL AUTO_INCREMENT,
            type VARCHAR(20) NOT NULL,
            keyword VARCHAR(80) NOT NULL,
            ai_model VARCHAR(100) NULL,
            rank INT NOT NULL DEFAULT 0,
            like_count INT NOT NULL DEFAULT 0,
            content TEXT NOT NULL,
            description TEXT NULL,
            thumbnail_url VARCHAR(500) NULL,
            thumbnail_data LONGBLOB NULL,
            thumbnail_content_type VARCHAR(100) NULL,
            is_hide TINYINT(1) NOT NULL DEFAULT 0,
            views INT NOT NULL DEFAULT 0,
            author_id INT NOT NULL,
            created_at DATETIME NOT NULL,
            PRIMARY KEY (id),
            KEY ix_prompts_keyword (keyword),
            KEY ix_prompts_type (type),
            KEY ix_prompts_created_at (created_at),
            KEY ix_prompts_rank (rank),
            KEY ix_prompts_views (views),
            KEY author_id (author_id),
            CONSTRAINT prompts_new_ibfk_1
                FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)

    op.execute("""
        INSERT INTO prompts_new (
            type, keyword, ai_model, rank, like_count, content,
            description, thumbnail_url, thumbnail_data,
            thumbnail_content_type, is_hide, views,
            author_id, created_at
        )
        SELECT
            type, keyword, ai_model, rank, like_count, content,
            description, thumbnail_url, thumbnail_data,
            thumbnail_content_type, is_hide, views,
            author_id, created_at
        FROM prompts
        ORDER BY created_at ASC, id ASC
    """)

    # Rematerialize the join-table relation on the integer side.
    op.execute("""
        CREATE TABLE user_likes_new (
            user_id INT NOT NULL,
            prompt_id INT NOT NULL,
            PRIMARY KEY (user_id, prompt_id),
            KEY prompt_id (prompt_id),
            CONSTRAINT user_likes_new_ibfk_1
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            CONSTRAINT user_likes_new_ibfk_2
                FOREIGN KEY (prompt_id) REFERENCES prompts_new(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)

    op.execute("""
        INSERT INTO user_likes_new (user_id, prompt_id)
        SELECT ul.user_id, m.new_prompt_id
        FROM user_likes ul
        JOIN prompt_id_map m ON m.old_prompt_id = ul.prompt_id
    """)

    # Swap tables and drop the legacy string-backed artifacts.
    op.execute("DROP TABLE user_likes")
    op.execute("DROP TABLE prompts")
    op.execute("RENAME TABLE prompts_new TO prompts")
    op.execute("RENAME TABLE user_likes_new TO user_likes")

    op.execute("SET FOREIGN_KEY_CHECKS = 1")


def downgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name != "mysql":
        return

    op.execute("SET FOREIGN_KEY_CHECKS = 0")
    op.execute("DROP TABLE IF EXISTS prompt_id_map")
    op.execute("DROP TABLE IF EXISTS user_likes_new")
    op.execute("DROP TABLE IF EXISTS prompts_new")
    op.execute("SET FOREIGN_KEY_CHECKS = 1")
