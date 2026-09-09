from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pwdlib import PasswordHash
from pwdlib.hashers.bcrypt import BcryptHasher
from pwdlib.exceptions import UnknownHashError
from sqlalchemy.orm import Session
import httpx
from fastapi import HTTPException

from app.core.config import get_settings
from app.core.database import get_db
from app.models.user import User

settings = get_settings()

# ── JWT 및 OAuth2 Scheme 설정 ─────────────────────────
SECRET_KEY = settings.secret_key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24시간

# 필수 인증용 (토큰이 없거나 유효하지 않으면 401 Unauthorized 에러 발생)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# 선택적 인증용 (auto_error=False: 토큰이 없어도 401 에러를 내지 않고 None 반환)
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


# ── 비밀번호 해싱 ─────────────────────────────────────
password_hash = PasswordHash((BcryptHasher(),))


def get_password_hash(password: str) -> str:
    return password_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return password_hash.verify(plain_password, hashed_password)
    except UnknownHashError:
        return False


# ── JWT 토큰 생성 ─────────────────────────────────────
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# ── 로그인 필수 유저 조회 ────────────────────────────────
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="유효하지 않은 인증 정보입니다.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str | None = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception

    return user


# ── 로그인 선택 유저 조회 (비로그인 상태 허용) ──────────────
def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme_optional),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """
    유효한 토큰이 있으면 User 객체를 반환하고,
    토큰이 없거나 유효하지 않은 경우에도 401 에러를 일으키지 않고 None을 반환합니다.
    """
    if not token:
        return None

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str | None = payload.get("sub")
        if email is None:
            return None

        user = db.query(User).filter(User.email == email).first()
        return user
    except jwt.PyJWTError:
        return None

import httpx
from fastapi import HTTPException

from app.core.config import get_settings

settings = get_settings()


async def verify_turnstile(token: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            data={
                "secret": settings.TURNSTILE_SECRET_KEY,
                "response": token,
            },
        )

    result = response.json()

    if not result.get("success"):
        raise HTTPException(
            status_code=400,
            detail="CAPTCHA verification failed",
        )