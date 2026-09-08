from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from pydantic import BaseModel

class Keyword(Base):
    __tablename__ = "keywords"

    name: Mapped[str] = mapped_column(String(80), primary_key=True, index=True)

class KeywordListResponse(BaseModel):
    keywords: list[str]