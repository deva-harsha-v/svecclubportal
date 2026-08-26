"""
All configuration comes from environment variables (loaded from a local .env
file in development). Nothing secret is ever hardcoded here.
"""
import os
from dotenv import load_dotenv

load_dotenv()


def _require(name: str, default: str | None = None) -> str:
    val = os.getenv(name, default)
    if val is None:
        raise RuntimeError(
            f"Missing required environment variable: {name}. "
            f"Copy backend/.env.example to backend/.env and fill it in."
        )
    return val


_raw_db_url = _require("DATABASE_URL", "sqlite:///./clubfair.db").strip()
if _raw_db_url.startswith("DATABASE_URL="):
    _raw_db_url = _raw_db_url[len("DATABASE_URL="):].strip()

DATABASE_URL: str = _raw_db_url
JWT_SECRET: str = _require("JWT_SECRET", "dev-only-insecure-secret-change-me")

JWT_ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))

CORS_ORIGINS: list[str] = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "*").split(",")
    if origin.strip()
]

INITIAL_ADMIN_USERNAME: str = os.getenv("INITIAL_ADMIN_USERNAME", "admin")
INITIAL_ADMIN_PASSWORD: str = os.getenv("INITIAL_ADMIN_PASSWORD", "changeme_immediately")
