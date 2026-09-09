from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Keyword API"
    database_url: str = "mysql+pymysql://root:@127.0.0.1:3306/prompthub_db"
    frontend_origin: str = "http://localhost:3000"
    secret_key: str = "dev-secret-key-change-me-in-production" 
    seed_data_path: Path = Path("data/prompts.mock.json")

    # 이메일 인증 관련 설정 추가
    mail_username: str
    mail_password: str
    mail_from: str
    mail_port: int = 587
    mail_server: str = "smtp.gmail.com"
    mail_starttls: bool = True
    mail_ssl_tls: bool = False

    # 전화번호 등 추가 정보 (선택 사항)
    support_phone: str = ""
    company_phone: str = ""

    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore"
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()