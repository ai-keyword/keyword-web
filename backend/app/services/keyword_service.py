from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.keyword import Keyword
from app.models.prompt import Prompt


def get_trending_keywords(db: Session) -> list[str]:
    rows = db.scalars(
        select(Prompt.keyword)
        .order_by(Prompt.rank.asc(), Prompt.created_at.desc())
        .distinct()
    ).all()

    return list(rows[:10])