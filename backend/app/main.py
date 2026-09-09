import random
import string
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from app.core.security import get_current_user

from app.core.config import get_settings
from app.core.database import Base, engine, get_db
from app.core.security import get_password_hash
from app.routers import keywords, prompts, auth
from app.services.email_service import send_email
import app.models as models
from app.core.security import verify_turnstile


# =========================================================
# 1. 설정
# =========================================================

settings = get_settings()


# =========================================================
# 2. 임시 이메일 인증번호 저장소
#    개발용 - 서버가 재시작되면 초기화됨
# =========================================================

verification_codes = {}


# =========================================================
# 3. 앱 시작 시 실행
# =========================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    # DB 테이블 생성
    Base.metadata.create_all(bind=engine)

    yield


# =========================================================
# 4. FastAPI 앱 생성
# =========================================================

app = FastAPI(
    title=settings.app_name,
    lifespan=lifespan
)


# =========================================================
# 5. CORS 설정
# =========================================================

origins = [
    settings.frontend_origin,
    "https://keyword-web-henna.vercel.app",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# 6. Router 등록
# =========================================================

app.include_router(prompts.router)
app.include_router(keywords.router)
app.include_router(auth.router)


# =========================================================
# 7. Pydantic 요청 스키마
# =========================================================

class SignupRequest(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: str
    captcha_token: str


class EmailRequest(BaseModel):
    email: EmailStr


class VerifyCodeRequest(BaseModel):
    email: EmailStr
    code: str


# =========================================================
# 8. Health Check
# =========================================================

@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }


# =========================================================
# 9. 이메일 인증번호 전송
# =========================================================

@app.post("/api/send-verification")
def send_verification_code(
    request: EmailRequest
):
    # 6자리 랜덤 숫자 생성
    code = "".join(
        random.choices(
            string.digits,
            k=6
        )
    )

    # 이메일 전송
    send_email(
        request.email,
        code
    )

    # 인증번호 저장
    verification_codes[request.email] = code

    return {
        "message": "인증번호가 발송되었습니다."
    }


# =========================================================
# 10. 이메일 인증번호 확인
# =========================================================

@app.post("/api/verify-code")
def verify_code(
    request: VerifyCodeRequest
):
    saved_code = verification_codes.get(
        request.email
    )

    # 인증번호가 없거나 일치하지 않는 경우
    if (
        not saved_code
        or saved_code != request.code
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="인증번호가 일치하지 않습니다."
        )

    # 인증 성공 → 인증번호 삭제
    del verification_codes[request.email]

    return {
        "message": "인증 성공"
    }


# =========================================================
# 11. 회원가입
# =========================================================

@app.post("/api/signup")
async def signup(
    user_data: SignupRequest,
    db: Session = Depends(get_db)
):
    # -----------------------------------------------------
    # CAPTCHA 검증
    # -----------------------------------------------------

    await verify_turnstile(user_data.captcha_token)

    # -----------------------------------------------------
    # 이메일 중복 확인
    # -----------------------------------------------------

    existing_email = (
        db.query(models.User)
        .filter(
            models.User.email == user_data.email
        )
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 등록된 이메일입니다."
        )

    # -----------------------------------------------------
    # 아이디 중복 확인
    # -----------------------------------------------------

    existing_username = (
        db.query(models.User)
        .filter(
            models.User.username == user_data.username
        )
        .first()
    )

    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 사용 중인 아이디입니다."
        )

    # -----------------------------------------------------
    # 비밀번호 해싱
    # -----------------------------------------------------

    hashed_password = get_password_hash(
        user_data.password
    )

    # -----------------------------------------------------
    # 사용자 생성
    # -----------------------------------------------------

    new_user = models.User(
        name=user_data.name,
        username=user_data.username,
        email=user_data.email,
        password=hashed_password
    )

    # -----------------------------------------------------
    # DB 저장
    # -----------------------------------------------------

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "회원가입 성공",
        "user_id": new_user.id
    }
# =========================================================
# 12. getme
# =========================================================
@app.get("/getme")
def get_me(
    current_user: models.User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "name": current_user.name,
        "created_year": current_user.created_at.year if hasattr(current_user, "created_at") and current_user.created_at else None,
        "written_prompts": [
            {
                "id": prompt.id,
                "type": prompt.type,
                "keyword": prompt.keyword,
                "ai_model": prompt.ai_model,
                "rank": prompt.rank,
                "content": prompt.content,
                "description": prompt.description,
                "thumbnail_url": prompt.thumbnail_url,
                "is_hide": bool(prompt.is_hide),
                "views": prompt.views,
                "like_count": prompt.like_count,
                "is_liked": prompt in current_user.liked_prompts,
                "created_at": prompt.created_at,
                "author": {
                    "id": prompt.author.id,
                    "username": prompt.author.username,
                },
            }
            for prompt in getattr(current_user, "prompts", [])
        ],
        "liked_prompts": [
            {
                "id": prompt.id,
                "type": prompt.type,
                "keyword": prompt.keyword,
                "ai_model": prompt.ai_model,
                "rank": prompt.rank,
                "content": prompt.content,
                "description": prompt.description,
                "thumbnail_url": prompt.thumbnail_url,
                "is_hide": bool(prompt.is_hide),
                "views": prompt.views,
                "like_count": prompt.like_count,
                "is_liked": True,
                "created_at": prompt.created_at,
                "author": {
                    "id": prompt.author.id,
                    "username": prompt.author.username,
                },
            }
            for prompt in getattr(current_user, "liked_prompts", [])
        ],
    }

# =========================================================
# 13. prompt like
# =========================================================
@app.post("/api/prompts/{prompt_id}/like")
def toggle_prompt_like(
    prompt_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    프롬프트 좋아요 토글 (이미 좋아요한 경우 취소, 안 한 경우 좋아요)
    """
    prompt = (
        db.query(models.Prompt)
        .filter(models.Prompt.id == prompt_id)
        .first()
    )

    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="프롬프트를 찾을 수 없습니다."
        )

    # 이미 좋아요를 눌렀는지 확인
    like_entry = (
        db.query(models.PromptLike)
        .filter(
            models.PromptLike.prompt_id == prompt_id,
            models.PromptLike.user_id == current_user.id
        )
        .first()
    )

    if like_entry:
        # 이미 눌렀다면 좋아요 취소
        db.delete(like_entry)
        prompt.like_count = max(0, prompt.like_count - 1)
    else:
        # 안 눌렀다면 좋아요 추가
        new_like = models.PromptLike(
            prompt_id=prompt_id,
            user_id=current_user.id
        )
        db.add(new_like)
        prompt.like_count += 1

    db.commit()
    db.refresh(prompt)

    return {
        "id": prompt.id,
        "is_liked": like_entry is None,
        "like_count": prompt.like_count
    }