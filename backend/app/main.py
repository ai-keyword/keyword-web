import random
import string
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import Base, SessionLocal, engine, get_db
from app.core.security import get_password_hash
from app.routers import keywords, prompts, auth
from app.services.prompt_service import seed_from_json
from app.services.email_service import send_email
import app.models as models


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

    # 시드 데이터 로드
    with SessionLocal() as db:
        seed_from_json(
            db,
            settings.seed_data_path
        )

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_origin
    ],
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
def signup(
    user_data: SignupRequest,
    db: Session = Depends(get_db)
):
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