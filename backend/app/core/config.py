from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "#키워드 API"
    database_url: str = "sqlite:///./keyword.db"
    frontend_origin: str = "http://localhost:3000"
    seed_data_path: Path = Path("data/prompts.mock.json")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    return Settings()
