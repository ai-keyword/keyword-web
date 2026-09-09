from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.models.prompt import Prompt


def get_trending_keywords(db: Session) -> list[str]:
    rows = db.scalars(
        select(Prompt.keyword)
        .group_by(Prompt.keyword)
        .order_by(
            func.min(Prompt.rank).asc(),
            func.max(Prompt.created_at).desc(),
        )
        .limit(10)
    ).all()

    return list(rows)