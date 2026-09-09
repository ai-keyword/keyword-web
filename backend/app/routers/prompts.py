from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Response, UploadFile, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user, get_current_user_optional
from app.models.user import User
from app.schemas.prompt import LikeToggleResponse, PromptListResponse, PromptRead
from app.services import prompt_service

router = APIRouter(prefix="/api/prompts", tags=["prompts"])


# =========================================================
# 1. 목록 및 생성 (Static / Base Routes)
# =========================================================
@router.get("", response_model=PromptListResponse)
def list_prompts(
    keyword: str | None = Query(default=None),
    type: str | None = Query(default=None),
    sort: str = Query(default="rank"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    payload = prompt_service.list_prompts(
        db,
        keyword=keyword,
        prompt_type=type,
        sort=sort,
        page=page,
        page_size=page_size,
    )
    prompts = payload["prompts"]

    # 목록 조회 시 유저별 is_liked 계산
    for prompt in prompts:
        prompt.is_liked = current_user in prompt.liked_by if current_user else False

    return {
        "prompts": prompts,
        "page": payload["page"],
        "page_size": payload["page_size"],
        "total": payload["total"],
        "total_pages": payload["total_pages"],
    }


@router.post("", response_model=PromptRead, status_code=status.HTTP_201_CREATED)
async def create_prompt(
    type: str = Form(...),
    keyword: str = Form(...),
    ai_model: Optional[str] = Form(None),
    content: str = Form(...),
    description: Optional[str] = Form(None),
    captcha_token: Optional[str] = Form(None),
    is_hide: bool = Form(False),
    thumbnail: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    prompt_data = {
        "type": type,
        "keyword": keyword,
        "ai_model": ai_model,
        "content": content,
        "description": description,
        "author_id": current_user.id,
        "thumbnail": thumbnail,
        "captcha_token": captcha_token,
        "is_hide": is_hide,
    }

    new_prompt = await prompt_service.create_prompt_with_file(db, prompt_data)
    new_prompt.is_liked = False
    return new_prompt


@router.get("/{prompt_id}/thumbnail")
def get_prompt_thumbnail(
    prompt_id: int,
    db: Session = Depends(get_db),
):
    prompt = prompt_service.get_prompt(db, prompt_id)
    if not prompt or not prompt.thumbnail_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="썸네일을 찾을 수 없습니다.",
        )

    return Response(
        content=prompt.thumbnail_data,
        media_type=prompt.thumbnail_content_type or "application/octet-stream",
    )


# =========================================================
# 2. 특수 액션 경로 (Action Sub-routes)
# =========================================================
@router.post("/{prompt_id}/like", response_model=LikeToggleResponse)
def toggle_prompt_like(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    프롬프트 좋아요 토글 (Next.js Server Action 응답 규격 맞춤)
    """
    prompt, is_liked = prompt_service.toggle_like(db, prompt_id=prompt_id, user_id=current_user.id)

    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="프롬프트를 찾을 수 없습니다.",
        )

    return {
        "is_liked": is_liked,
        "like_count": prompt.like_count,
    }


@router.post("/{prompt_id}/view", response_model=PromptRead)
def increase_prompt_views(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    prompt = prompt_service.increment_views(db, prompt_id)
    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="프롬프트를 찾을 수 없습니다.",
        )

    prompt.is_liked = current_user in prompt.liked_by if current_user else False
    return prompt


# =========================================================
# 3. 단일 조회 (Generic Parametric Route)
# =========================================================
@router.get("/{prompt_id}", response_model=PromptRead)
def get_prompt(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    prompt = prompt_service.get_prompt(db, prompt_id)

    if prompt is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="프롬프트를 찾을 수 없습니다.",
        )

    prompt.is_liked = current_user in prompt.liked_by if current_user else False
    return prompt