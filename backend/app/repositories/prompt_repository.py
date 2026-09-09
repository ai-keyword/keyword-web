from sqlalchemy import Select, func, select
from sqlalchemy.orm import Session

from app.models.prompt import Prompt
from app.schemas.prompt import PromptCreate


def list_prompts(
    db: Session,
    keyword: str | None = None,
    prompt_type: str | None = None,
    sort: str = "rank",
    page: int = 1,
    page_size: int = 12,
) -> tuple[list[Prompt], int]:
    statement = select(Prompt)
    

    if keyword:
        search = f"%{keyword}%"
        statement = statement.where(
            (Prompt.keyword.ilike(search))
            | (Prompt.content.ilike(search))
            | (Prompt.description.ilike(search))
        )

    if prompt_type:
        statement = statement.where(Prompt.type == prompt_type)

    count_statement = select(func.count()).select_from(statement.subquery())
    total = int(db.scalar(count_statement) or 0)

    sorted_statement = apply_sort(statement, sort)
    paged_statement = sorted_statement.offset((page - 1) * page_size).limit(page_size)
    prompts = list(db.scalars(paged_statement).all())

    if sort == "rank":
        for idx, prompt in enumerate(prompts, start=1):
            prompt.rank = idx

    return prompts, total


def get_prompt(db: Session, prompt_id: int) -> Prompt | None:
    return db.get(Prompt, prompt_id)


def list_trending_keywords(db: Session) -> list[str]:
    prompts = db.scalars(select(Prompt).order_by(Prompt.created_at.asc())).all()
    keywords: list[str] = []

    for prompt in prompts:
        if prompt.keyword not in keywords:
            keywords.append(prompt.keyword)

    return keywords

def increment_views(db: Session, prompt_id: int) -> Prompt | None:
    prompt = get_prompt(db, prompt_id)
    if prompt:
        prompt.views += 1
        db.commit()
        db.refresh(prompt)
    return prompt

def create_prompt(db: Session, prompt: PromptCreate) -> Prompt:
    db_prompt = Prompt(
        id=prompt.id,
        type=prompt.type,
        keyword=prompt.keyword,
        ai_model=prompt.ai_model,
        rank=prompt.rank,
        content=prompt.content,
        description=prompt.description,
        thumbnail_url=prompt.thumbnail_url,
        author=prompt.author,
        is_hide=getattr(prompt, "is_hide", False),
        views=getattr(prompt, "views", 0),  # 조회수 반영 (없으면 기본값 0)
        created_at=prompt.created_at,
    )
    db.add(db_prompt)
    db.commit()
    db.refresh(db_prompt)
    return db_prompt


def seed_prompts(db: Session, prompts: list[PromptCreate]) -> None:
    if db.scalar(select(Prompt.id).limit(1)):
        return

    for prompt in prompts:
        db.add(
            Prompt(
                id=prompt.id,
                type=prompt.type,
                keyword=prompt.keyword,
                ai_model=prompt.ai_model,
                rank=prompt.rank,
                content=prompt.content,
                description=prompt.description,
                thumbnail_url=prompt.thumbnail_url,
                author=prompt.author,
                is_hide=getattr(prompt, "is_hide", False),
                views=getattr(prompt, "views", 0),  # 조회수 반영
                created_at=prompt.created_at,
            )
        )

    db.commit()


def apply_sort(statement: Select[tuple[Prompt]], sort: str) -> Select[tuple[Prompt]]:
    if sort == "recent":
        return statement.order_by(Prompt.created_at.desc())

    return statement.order_by(Prompt.like_count.desc(), Prompt.created_at.desc())