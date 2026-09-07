from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import (
    create_access_token,
    verify_password
)
from app.models.user import User
from app.schemas.auth import LoginRequest


router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)


@router.post("/login")
def login(
    user_data: LoginRequest,
    db: Session = Depends(get_db)
):
    # 1. 사용자 조회
    user = (
        db.query(User)
        .filter(
            User.email == user_data.email
        )
        .first()
    )

    # 2. 사용자 존재 여부 + 비밀번호 확인
    if not user or not verify_password(
        user_data.password,
        user.password
    ):
        raise HTTPException(
            status_code=400,
            detail="이메일 또는 비밀번호가 올바르지 않습니다."
        )

    # 3. JWT 생성
    access_token = create_access_token(
        data={
            "sub": user.email
        }
    )

    # 4. 응답
    return {
        "message": "로그인 성공",
        "username": user.username,
        "token": access_token
    }