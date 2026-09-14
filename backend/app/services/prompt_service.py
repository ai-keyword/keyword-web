import json
from datetime import datetime
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.keyword import Keyword
from app.models.prompt import Prompt
from app.models.user import User
from app.models.like import user_likes
from app.repositories import prompt_repository
from app.schemas.prompt import PromptCreate
from app.core.security import verify_turnstile


VALID_PROMPT_TYPES = {"image", "text"}


async def create_prompt_with_file(db: Session, prompt_data: dict):
    # 캡차 검증
    await verify_turnstile(prompt_data.get("captcha_token"))

    thumbnail = prompt_data.get("thumbnail")
    thumbnail_data = None
    thumbnail_content_type = None

    if thumbnail and thumbnail.filename:
        thumbnail_data = await thumbnail.read()
        thumbnail_content_type = thumbnail.content_type

    # 프론트에서 OpenAI Moderation으로 판정한 값
    is_hide = bool(
        prompt_data.get(
            "is_hide",
            prompt_data.get("isHide", False),
        )
    )

    db_prompt = Prompt(
        type=prompt_data["type"],
        keyword=prompt_data["keyword"],
        ai_model=prompt_data.get("ai_model"),
        content=prompt_data["content"],
        description=prompt_data.get("description"),
        author_id=prompt_data["author_id"],
        thumbnail_url=None,
        thumbnail_data=thumbnail_data,
        thumbnail_content_type=thumbnail_content_type,
        is_hide=is_hide,
        views=0,
        rank=0,
    )

    db.add(db_prompt)
    db.flush()

    if thumbnail_data:
        db_prompt.thumbnail_url = (
            f"/api/prompts/{db_prompt.id}/thumbnail"
        )

    db.commit()

    return db_prompt


def list_prompts(
    db: Session,
    keyword: str | None = None,
    prompt_type: str | None = None,
    sort: str = "rank",
    page: int = 1,
    page_size: int = 12,
):
    normalized_keyword = normalize_keyword(keyword)

    normalized_type = (
        prompt_type
        if prompt_type in VALID_PROMPT_TYPES
        else None
    )

    normalized_sort = (
        sort
        if sort in {"rank", "recent"}
        else "rank"
    )

    page = max(1, page)
    page_size = max(1, page_size)

    prompts, total = prompt_repository.list_prompts(
        db,
        keyword=normalized_keyword,
        prompt_type=normalized_type,
        sort=normalized_sort,
        page=page,
        page_size=page_size,
    )

    total_pages = (
        max(1, (total + page_size - 1) // page_size)
        if total
        else 1
    )

    return {
        "prompts": prompts,
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": total_pages,
    }


def get_prompt(db: Session, prompt_id: str):
    return prompt_repository.get_prompt(db, prompt_id)


def increment_views(db: Session, prompt_id: str):
    prompt = get_prompt(db, prompt_id)

    if prompt:
        prompt.views += 1
        db.commit()

    return prompt


def create_prompt(db: Session, prompt: PromptCreate):
    # 캡차/검열이 필요한 실제 등록 흐름은
    # create_prompt_with_file()에서 처리
    return prompt_repository.create_prompt(db, prompt)


def toggle_like(
    db: Session,
    prompt_id: str,
    user_id: int,
) -> tuple[Prompt | None, bool]:

    # 1. 프롬프트 조회
    prompt = (
        db.query(Prompt)
        .filter(Prompt.id == prompt_id)
        .first()
    )

    if not prompt:
        return None, False

    # 2. 해당 사용자가 해당 프롬프트를 좋아요 했는지만 확인
    # liked_by 전체를 불러오지 않음
    like_exists = db.execute(
        select(user_likes).where(
            user_likes.c.user_id == user_id,
            user_likes.c.prompt_id == prompt_id,
        )
    ).first()

    # 3. 좋아요 취소
    if like_exists:
        db.execute(
            user_likes.delete().where(
                user_likes.c.user_id == user_id,
                user_likes.c.prompt_id == prompt_id,
            )
        )

        prompt.like_count = max(
            0,
            prompt.like_count - 1,
        )

        is_liked = False

    # 4. 좋아요 추가
    else:
        db.execute(
            user_likes.insert().values(
                user_id=user_id,
                prompt_id=prompt_id,
            )
        )

        prompt.like_count += 1
        is_liked = True

    # 5. 저장
    db.commit()

    # refresh()는 제거
    return prompt, is_liked


def get_trending_keywords(db: Session) -> list[str]:
    keywords = (
        db.query(Keyword.name)
        .limit(10)
        .all()
    )

    return [keyword[0] for keyword in keywords]


def seed_from_json(
    db: Session,
    data_path: Path,
) -> None:

    if not data_path.exists():
        return

    # 이미 프롬프트가 있으면 seed하지 않음
    if db.query(Prompt.id).first():
        return

    default_user = (
        db.query(User)
        .filter(
            User.email == "system@keyword-web.dev"
        )
        .first()
    )

    if not default_user:
        default_user = User(
            name="Keyword System",
            username="keyword-system",
            email="system@keyword-web.dev",
            password=get_password_hash("seed-user"),
        )

        db.add(default_user)
        db.flush()

    elif not default_user.password.startswith("$2"):
        default_user.password = get_password_hash("seed-user")

    raw_prompts = json.loads(
        data_path.read_text(encoding="utf-8")
    )

    seeded_keywords: set[str] = set()

    for prompt_data in raw_prompts:
        keyword_name = prompt_data.get("keyword")

        # Keyword 생성
        if (
            keyword_name
            and keyword_name not in seeded_keywords
            and not db.get(Keyword, keyword_name)
        ):
            db.add(
                Keyword(name=keyword_name)
            )

            seeded_keywords.add(keyword_name)

        # created_at 처리
        created_at = prompt_data.get("created_at")

        if isinstance(created_at, str):
            created_dt = datetime.fromisoformat(
                created_at
            )
        else:
            created_dt = datetime.now()

        # Prompt 생성
        db.add(
            Prompt(
                id=prompt_data.get("id"),
                type=prompt_data.get(
                    "type",
                    "image",
                ),
                keyword=keyword_name,
                ai_model=prompt_data.get(
                    "ai_model"
                ),
                rank=int(
                    prompt_data.get(
                        "rank",
                        0,
                    )
                ),
                like_count=int(
                    prompt_data.get(
                        "like_count",
                        0,
                    )
                ),
                content=prompt_data.get(
                    "content",
                    "",
                ),
                description=prompt_data.get(
                    "description"
                ),
                thumbnail_url=(
                    prompt_data.get(
                        "thumbnail_url"
                    )
                    or prompt_data.get(
                        "thumbnailUrl"
                    )
                ),
                is_hide=bool(
                    prompt_data.get(
                        "is_hide",
                        prompt_data.get(
                            "isHide",
                            False,
                        ),
                    )
                ),
                views=int(
                    prompt_data.get(
                        "views",
                        0,
                    )
                ),
                author_id=default_user.id,
                created_at=created_dt,
            )
        )

    db.commit()


def normalize_keyword(
    keyword: str | None,
):
    if not keyword:
        return None

    return keyword.strip().removeprefix("#")