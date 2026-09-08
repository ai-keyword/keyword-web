import json
import os
import uuid
from pathlib import Path

from sqlalchemy.orm import Session

from app.models.prompt import Prompt
from app.repositories import prompt_repository
from app.schemas.prompt import PromptCreate

VALID_PROMPT_TYPES = {"image", "text"}
UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def create_prompt_with_file(db: Session, prompt_data: dict):
    thumbnail = prompt_data.get("thumbnail")
    thumbnail_url = None

    # 업로드된 파일이 있다면 서버 디렉토리에 저장하고 상대 경로 URL 생성
    if thumbnail and thumbnail.filename:
        file_extension = thumbnail.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)

        with open(file_path, "wb") as buffer:
            buffer.write(thumbnail.file.read())

        thumbnail_url = f"/{UPLOAD_DIR}/{unique_filename}"

    db_prompt = Prompt(
        type=prompt_data["type"],
        keyword=prompt_data["keyword"],
        content=prompt_data["content"],
        description=prompt_data.get("description"),
        author_id=prompt_data["author_id"],  # author(문자열) 대신 로그인한 유저의 id
        thumbnail_url=thumbnail_url,
        views=0,
        rank=0,
    )

    db.add(db_prompt)
    db.commit()
    db.refresh(db_prompt)

    return db_prompt


def list_prompts(
    db: Session,
    keyword: str | None = None,
    prompt_type: str | None = None,
    sort: str = "rank",
):
    normalized_keyword = normalize_keyword(keyword)
    normalized_type = prompt_type if prompt_type in VALID_PROMPT_TYPES else None
    normalized_sort = sort if sort in {"rank", "recent"} else "rank"

    return prompt_repository.list_prompts(
        db,
        keyword=normalized_keyword,
        prompt_type=normalized_type,
        sort=normalized_sort,
    )


def get_prompt(db: Session, prompt_id: str):
    return prompt_repository.get_prompt(db, prompt_id)


def increment_views(db: Session, prompt_id: str):
    prompt = get_prompt(db, prompt_id)
    if prompt:
        prompt.views += 1
        db.commit()
        db.refresh(prompt)
    return prompt


def create_prompt(db: Session, prompt: PromptCreate):
    return prompt_repository.create_prompt(db, prompt)


def list_trending_keywords(db: Session):
    return prompt_repository.list_trending_keywords(db)


def seed_from_json(db: Session, data_path: Path) -> None:
    if not data_path.exists():
        return

    raw_prompts = json.loads(data_path.read_text(encoding="utf-8"))
    prompts = [PromptCreate.model_validate(prompt) for prompt in raw_prompts]
    prompt_repository.seed_prompts(db, prompts)


def normalize_keyword(keyword: str | None):
    if not keyword:
        return None

    return keyword.strip().removeprefix("#")