from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import get_settings

# .env 파일에서 database_url을 불러옵니다.
settings = get_settings()

engine = create_engine(settings.database_url, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# FastAPI Dependency Injection용 세션 함수
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()