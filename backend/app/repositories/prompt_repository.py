from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from app.models.prompt import Prompt
from app.schemas.prompt import PromptCreate


def list_prompts(
    db: Session,
    keyword: str | None = None,
    prompt_type: str | None = None,
    sort: str = "rank",
) -> list[Prompt]:
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

    statement = apply_sort(statement, sort)
    return list(db.scalars(statement).all())


def get_prompt(db: Session, prompt_id: str) -> Prompt | None:
    return db.get(Prompt, prompt_id)


def list_trending_keywords(db: Session) -> list[str]:
    prompts = db.scalars(select(Prompt).order_by(Prompt.created_at.asc())).all()
    keywords: list[str] = []

    for prompt in prompts:
        if prompt.keyword not in keywords:
            keywords.append(prompt.keyword)

    return keywords


def create_prompt(db: Session, prompt: PromptCreate) -> Prompt:
    db_prompt = Prompt(
        id=prompt.id,
        type=prompt.type,
        keyword=prompt.keyword,
        rank=prompt.rank,
        content=prompt.content,
        description=prompt.description,
        thumbnail_url=prompt.thumbnail_url,
        author=prompt.author,
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
                rank=prompt.rank,
                content=prompt.content,
                description=prompt.description,
                thumbnail_url=prompt.thumbnail_url,
                author=prompt.author,
                created_at=prompt.created_at,
            )
        )

    db.commit()


def apply_sort(statement: Select[tuple[Prompt]], sort: str) -> Select[tuple[Prompt]]:
    if sort == "recent":
        return statement.order_by(Prompt.created_at.desc())

    return statement.order_by(Prompt.rank.asc(), Prompt.created_at.desc())
