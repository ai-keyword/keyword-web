from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, status, UploadFile
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.schemas.prompt import PromptListResponse, PromptRead
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
async def create_prompt(
    type: str = Form(...),
    keyword: str = Form(...),
    content: str = Form(...),
    description: Optional[str] = Form(None),
    author: str = Form("익명"),
    thumbnail: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    prompt_data = {
        "type": type,
        "keyword": keyword,
        "content": content,
        "description": description,
        "author": author,
        "thumbnail": thumbnail,
    }
    
    new_prompt = prompt_service.create_prompt_with_file(db, prompt_data)
    return new_prompt


@router.post("/{prompt_id}/view", response_model=PromptRead)
def increase_prompt_views(prompt_id: str, db: Session = Depends(get_db)):
    prompt = prompt_service.increment_views(db, prompt_id)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return prompt