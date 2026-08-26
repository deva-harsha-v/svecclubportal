import os
import shutil
from pathlib import Path
from fastapi import UploadFile

UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_STORAGE_BUCKET = os.getenv("SUPABASE_STORAGE_BUCKET", "club-logos")


def save_club_logo(file: UploadFile, filename_prefix: str) -> str:
    """
    Uploads a club logo. If Supabase Storage credentials are standard, uploads to Supabase.
    Otherwise saves to local static uploads directory and returns local endpoint path.
    """
    ext = Path(file.filename or "").suffix.lower() or ".png"
    safe_filename = f"{filename_prefix}_logo{ext}"

    if SUPABASE_URL and SUPABASE_KEY:
        try:
            # Upload to Supabase Storage via HTTP REST API
            import httpx
            headers = {
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "apikey": SUPABASE_KEY,
            }
            url = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_STORAGE_BUCKET}/{safe_filename}"
            file.file.seek(0)
            content = file.file.read()
            resp = httpx.post(url, headers=headers, files={"file": (safe_filename, content, file.content_type)})
            if resp.status_code in (200, 201):
                return f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_STORAGE_BUCKET}/{safe_filename}"
        except Exception as err:
            print(f"Supabase storage upload fallback due to: {err}")

    # Fallback: Local file system save
    dest_path = UPLOAD_DIR / safe_filename
    file.file.seek(0)
    with dest_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return f"/api/uploads/{safe_filename}"
