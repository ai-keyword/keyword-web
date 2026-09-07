from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.prompt import KeywordListResponse
from app.services import prompt_service

router = APIRouter(prefix="/api/keywords", tags=["keywords"])


@router.get("/trending", response_model=KeywordListResponse)
def list_trending_keywords(db: Session = Depends(get_db)):
    return {"keywords": prompt_service.list_trending_keywords(db)}
