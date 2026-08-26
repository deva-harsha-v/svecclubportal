from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from . import config

# Connection pooling tuned for event-day concurrency. pool_pre_ping avoids
# handing out dead connections after idle periods (common on managed Postgres).
connect_args = {}
engine_kwargs = {"pool_pre_ping": True}

if config.DATABASE_URL.startswith("sqlite"):
    # SQLite is only intended for local development/testing, not production.
    connect_args = {"check_same_thread": False}
else:
    engine_kwargs.update(pool_size=10, max_overflow=20, pool_recycle=1800)

engine = create_engine(config.DATABASE_URL, connect_args=connect_args, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
