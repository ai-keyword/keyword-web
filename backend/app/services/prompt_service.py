import json
from pathlib import Path

from sqlalchemy.orm import Session

from app.repositories import prompt_repository
from app.schemas.prompt import PromptCreate


VALID_PROMPT_TYPES = {"image", "text"}


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
