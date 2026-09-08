# app/services/keyword_service.py
from sqlalchemy.orm import Session
from app.models.keyword import Keyword


def get_trending_keywords(db: Session) -> list[str]:
    # Keyword 테이블의 name 컬럼을 리스트 형태로 추출
    keywords = db.query(Keyword.name).limit(10).all()
    return [k[0] for k in keywords]