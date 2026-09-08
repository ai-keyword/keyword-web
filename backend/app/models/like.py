from sqlalchemy import Column, ForeignKey, Table

from app.core.database import Base

# users <-> prompts 좋아요 N:M 매핑 테이블
# 별도 모델 클래스 없이 Table로만 정의 (복합 PK, 추가 컬럼 필요 없을 때 권장되는 패턴)
user_likes = Table(
    "user_likes",
    Base.metadata,
    Column("user_id", ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("prompt_id", ForeignKey("prompts.id", ondelete="CASCADE"), primary_key=True),
)