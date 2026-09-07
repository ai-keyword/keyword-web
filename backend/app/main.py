import random
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from app.core.config import get_settings
from app.core.database import Base, SessionLocal, engine, get_db
from app.routers import keywords, prompts
from app.services.prompt_service import seed_from_json
import app.models as models

# 설정 로드
settings = get_settings()

# FastMail 설정 (.env 파일 기반)
mail_config = ConnectionConfig(
    MAIL_USERNAME=settings.mail_username,
    MAIL_PASSWORD=settings.mail_password,
    MAIL_FROM=settings.mail_from,
    MAIL_PORT=settings.mail_port,
    MAIL_SERVER=settings.mail_server,
    MAIL_STARTTLS=settings.mail_starttls,
    MAIL_SSL_TLS=settings.mail_ssl_tls,
    USE_CREDENTIALS=True
)

# 임시 인증번호 저장소
verification_codes = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)

    with SessionLocal() as db:
        seed_from_json(db, settings.seed_data_path)

    yield


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


# Request Body 스키마 정의
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


@app.get("/health")
def health_check():
    return {"status": "ok"}


# 1. 이메일 인증번호 전송 API
@app.post("/api/send-verification")
async def send_verification(request: EmailRequest, background_tasks: BackgroundTasks):
    code = f"{random.randint(100000, 999999)}"
    verification_codes[request.email] = code

    message = MessageSchema(
        subject="[PromptHub] 이메일 인증번호입니다.",
        recipients=[request.email],
        body=f"인증번호는 [{code}] 입니다.",
        subtype=MessageType.html
    )

    fm = FastMail(mail_config)
    background_tasks.add_task(fm.send_message, message)
    return {"message": "인증번호가 발송되었습니다."}


# 2. 이메일 인증번호 확인 API
@app.post("/api/verify-code")
def verify_code(request: VerifyCodeRequest):
    saved_code = verification_codes.get(request.email)
    if not saved_code or saved_code != request.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="인증번호가 일치하지 않습니다."
        )

    del verification_codes[request.email]
    return {"message": "인증 성공"}


# 3. 회원가입 API
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


# 4. 로그인 API
@app.post("/api/login")
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not user or user.password != login_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다."
        )

    return {"message": "로그인 성공", "username": user.username}