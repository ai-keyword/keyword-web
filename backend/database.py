from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import get_settings

# .env 파일에서 database_url을 불러옵니다.
settings = get_settings()

connect_args = (
    {"check_same_thread": False}
    if settings.database_url.startswith("sqlite")
    else {}
)

engine = create_engine(
    settings.database_url,
    connect_args=connect_args,
    pool_pre_ping=True,
    pool_recycle=1800,
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)
if getattr(settings, "debug", False):

    @event.listens_for(engine, "before_cursor_execute")
    def before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
        conn.info.setdefault("query_start_time", []).append(time.perf_counter())

    @event.listens_for(engine, "after_cursor_execute")
    def after_cursor_execute(conn, cursor, statement, parameters, context, executemany):
        start = conn.info["query_start_time"].pop()
        elapsed = time.perf_counter() - start
        print(f"[SQL] {elapsed:.3f}s | {statement[:200]}")

# FastAPI Dependency Injection용 세션 함수
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()