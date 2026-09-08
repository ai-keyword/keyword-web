from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.prompt import KeywordListResponse
from app.services import prompt_service
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.keyword_service import get_trending_keywords
from app.core.database import get_db
from app.services import keyword_service

router = APIRouter(prefix="/api/keywords", tags=["keywords"])


@router.get("/trending", response_model=KeywordListResponse)
def list_trending_keywords(db: Session = Depends(get_db)):
    # DB의 Keyword.name 문자열 리스트를 반환 (예: ["정리", "음악", "개발"])
    keywords = keyword_service.get_trending_keywords(db)
    return {"keywords": keywords}