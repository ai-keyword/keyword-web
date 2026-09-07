from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.models.user import User

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "name": current_user.name,
        # 계정 생성 연도 추출 (created_at이 datetime 객체인 경우)
        "created_year": current_user.created_at.year if hasattr(current_user, "created_at") and current_user.created_at else None,
        # 내가 작성한 프롬프트 목록
        "written_prompts": [
            {
                "id": prompt.id,
                "title": prompt.title,
                "created_at": prompt.created_at
            }
            for prompt in getattr(current_user, "prompts", [])
        ],
        # 내가 좋아요 누른 프롬프트 목록
        "liked_prompts": [
            {
                "id": prompt.id,
                "title": prompt.title,
                "author": prompt.author.username if hasattr(prompt, "author") else None
            }
            for prompt in getattr(current_user, "liked_prompts", [])
        ]
    }