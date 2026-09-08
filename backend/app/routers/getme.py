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
        "created_year": current_user.created_at.year if hasattr(current_user, "created_at") and current_user.created_at else None,
        "written_prompts": [
            {
                "id": prompt.id,
                "title": getattr(prompt, "content", None)[:80] if getattr(prompt, "content", None) else None,
                "created_at": prompt.created_at,
            }
            for prompt in getattr(current_user, "prompts", [])
        ],
        "liked_prompts": [
            {
                "id": prompt.id,
                "title": getattr(prompt, "content", None)[:80] if getattr(prompt, "content", None) else None,
                "author": prompt.author.username if hasattr(prompt, "author") else None,
            }
            for prompt in getattr(current_user, "liked_prompts", [])
        ],
    }