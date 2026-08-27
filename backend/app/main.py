import logging
from pathlib import Path
from fastapi import FastAPI, Request, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError



from . import config
from .database import Base, engine, SessionLocal
from .models import StaffProfile, Role, SystemSetting
from .auth import hash_password
from .routers import clubs, registrations, auth_router, admin, excel_export, club_head

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("clubfair")

app = FastAPI(title="Club Discovery & Registration Portal", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount local uploads directory for static asset serving in dev
uploads_dir = Path(__file__).resolve().parent.parent / "uploads"
uploads_dir.mkdir(parents=True, exist_ok=True)
app.mount("/api/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")


@app.on_event("startup")
def on_startup():
    # Creates tables if they don't exist
    Base.metadata.create_all(bind=engine)

    # Auto-migrate missing columns for PostgreSQL/SQLite
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE clubs ADD COLUMN IF NOT EXISTS detail_image TEXT;"))
            conn.commit()
    except Exception as e:
        logger.warning(f"Column migration info: {e}")

    db = SessionLocal()
    try:
        # Guarantee initial admin StaffProfile exists
        if not db.query(StaffProfile).filter(StaffProfile.role == Role.ADMIN).first():
            initial_email = f"{config.INITIAL_ADMIN_USERNAME}@college.edu" if "@" not in config.INITIAL_ADMIN_USERNAME else config.INITIAL_ADMIN_USERNAME
            db.add(
                StaffProfile(
                    user_id=config.INITIAL_ADMIN_USERNAME,
                    name="System Administrator",
                    email=initial_email,
                    role=Role.ADMIN,
                    is_active=True,
                )
            )
            db.commit()
            logger.info("Created initial admin StaffProfile '%s'.", config.INITIAL_ADMIN_USERNAME)

        # Default system settings
        if not db.query(SystemSetting).filter(SystemSetting.key == "registration_enabled").first():
            db.add(SystemSetting(key="registration_enabled", value="true"))
            db.commit()
    finally:
        db.close()


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    first = exc.errors()[0]
    message = first.get("msg", "Invalid input.")
    return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content={"detail": message})


@app.exception_handler(SQLAlchemyError)
async def db_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.exception("Database error handling %s %s", request.method, request.url)
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"detail": "The database is temporarily unavailable. Please try again."},
    )


@app.get("/")
def root():
    return {"status": "ok", "message": "SVEC Club Portal API is running"}


@app.get("/api/health")
def health(db=Depends(admin.get_db)):
    return admin.admin_health_check(db=db)


app.include_router(clubs.router)
app.include_router(registrations.router)
app.include_router(auth_router.router)
app.include_router(admin.router)
app.include_router(excel_export.router)
app.include_router(club_head.router)


if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)

