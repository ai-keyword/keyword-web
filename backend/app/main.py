import random
import string
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import Base, SessionLocal, engine, get_db
from app.routers import keywords, prompts
from app.services.prompt_service import seed_from_json
from app.services.email_service import send_email
import app.models as models

# 1. 설정 로드
settings = get_settings()

# 2. 임시 인증번호 메모리 저장소 (개발용)
verification_codes = {}


# 3. 앱 시작 시 DB 테이블 생성 및 시드 데이터 로드
@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)

    with SessionLocal() as db:
        seed_from_json(db, settings.seed_data_path)

    yield


# 4. FastAPI 앱 생성
app = FastAPI(title=settings.app_name, lifespan=lifespan)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(prompts.router)
app.include_router(keywords.router)


# 5. Pydantic 요청 스키마 정의
class SignupRequest(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class EmailRequest(BaseModel):
    email: EmailStr


class VerifyCodeRequest(BaseModel):
    email: EmailStr
    code: str


# 6. API 엔드포인트 정의

@app.get("/health")
def health_check():
    return {"status": "ok"}


# [이메일 인증번호 전송 API] - email_service.py 의 동기 send_email 방식 적용
@app.post("/api/send-verification")
def send_verification_code(request: EmailRequest):
    # 6자리 랜덤 숫자 생성
    code = "".join(random.choices(string.digits, k=6))
    
    # 이메일 발송 (email_service.py 호출)
    send_email(request.email, code)
    
    # 검증용 코드 저장
    verification_codes[request.email] = code
    
    return {"message": "인증번호가 발송되었습니다."}


# [이메일 인증번호 확인 API]
@app.post("/api/verify-code")
def verify_code(request: VerifyCodeRequest):
    saved_code = verification_codes.get(request.email)
    if not saved_code or saved_code != request.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="인증번호가 일치하지 않습니다."
        )

    # 인증 성공 시 번호 삭제
    del verification_codes[request.email]
    return {"message": "인증 성공"}


# [회원가입 API]
@app.post("/api/signup")
def signup(user_data: SignupRequest, db: Session = Depends(get_db)):
    existing_email = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 등록된 이메일입니다."
        )

    existing_username = db.query(models.User).filter(models.User.username == user_data.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 사용 중인 아이디입니다."
        )

    new_user = models.User(
        name=user_data.name,
        username=user_data.username,
        email=user_data.email,
        password=user_data.password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "회원가입 성공", "user_id": new_user.id}


# [로그인 API]
@app.post("/api/login")
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not user or user.password != login_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다."
        )

    return {"message": "로그인 성공", "username": user.username}