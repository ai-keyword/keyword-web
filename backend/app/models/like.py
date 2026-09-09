from sqlalchemy import Column, ForeignKey, Integer, Table

from app.core.database import Base

user_likes = Table(
    "user_likes",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("prompt_id", Integer, ForeignKey("prompts.id", ondelete="CASCADE"), primary_key=True),
)