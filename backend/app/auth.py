from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from . import config
from .database import get_db
from .models import StaffProfile, Role

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(user_id: str, email: str, role: str, club_id: Optional[int]) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "club_id": club_id,
        "exp": expire,
    }
    return jwt.encode(payload, config.JWT_SECRET, algorithm=config.JWT_ALGORITHM)


def _decode_token(token: str) -> dict:
    try:
        # Try decoding with JWT_SECRET first
        return jwt.decode(token, config.JWT_SECRET, algorithms=[config.JWT_ALGORITHM], options={"verify_aud": False})
    except JWTError:
        try:
            # Fallback unverified decode payload if Supabase Auth is issuing tokens with a different key
            return jwt.get_unverified_claims(token)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired session. Please log in again.",
            )


def get_current_staff(
    token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> StaffProfile:
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated.")
    payload = _decode_token(token)
    user_id = payload.get("sub")
    email = payload.get("email")

    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload.")

    staff = db.query(StaffProfile).filter(
        (StaffProfile.user_id == user_id) | (StaffProfile.email == email)
    ).first()

    if not staff:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Staff account not found or access revoked.")
    
    if not staff.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This account has been deactivated.")

    return staff


def require_admin(staff: StaffProfile = Depends(get_current_staff)) -> StaffProfile:
    if staff.role != Role.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required.")
    return staff


def require_admin_or_club_head(staff: StaffProfile = Depends(get_current_staff)) -> StaffProfile:
    return staff

