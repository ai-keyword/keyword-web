from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.prompt import PromptCreate, PromptListResponse, PromptRead
from app.services import prompt_service

router = APIRouter(prefix="/api/prompts", tags=["prompts"])


@router.get("", response_model=PromptListResponse)
def list_prompts(
    keyword: str | None = Query(default=None),
    type: str | None = Query(default=None),
    sort: str = Query(default="rank"),
    db: Session = Depends(get_db),
):
    prompts = prompt_service.list_prompts(db, keyword=keyword, prompt_type=type, sort=sort)
    return {"prompts": prompts}


@router.get("/{prompt_id}", response_model=PromptRead)
def get_prompt(prompt_id: str, db: Session = Depends(get_db)):
    prompt = prompt_service.get_prompt(db, prompt_id)

    if prompt is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="프롬프트를 찾을 수 없습니다.",
        )

    return prompt


@router.post("", response_model=PromptRead, status_code=status.HTTP_201_CREATED)
def create_prompt(prompt: PromptCreate, db: Session = Depends(get_db)):
    return prompt_service.create_prompt(db, prompt)
