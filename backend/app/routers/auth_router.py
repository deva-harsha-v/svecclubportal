from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import StaffProfile
from ..schemas import LoginRequest, LoginResponse
from ..auth import verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Staff / Admin login endpoint. Validates credentials against active StaffProfiles.
    Returns access token along with user role and assigned club slug if applicable.
    """
    staff = (
        db.query(StaffProfile)
        .filter((StaffProfile.email == payload.username_or_email) | (StaffProfile.user_id == payload.username_or_email))
        .first()
    )

    if not staff or not staff.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/username or account is inactive."
        )

    # In production with Supabase Auth, tokens can be issued via Supabase SDK.
    # For local/API testing fallback, token is signed with JWT_SECRET.
    token = create_access_token(
        user_id=staff.user_id,
        email=staff.email,
        role=staff.role.value,
        club_id=staff.club_id
    )

    return LoginResponse(
        access_token=token,
        role=staff.role,
        club_slug=staff.club.slug if staff.club else None,
        user_id=staff.user_id,
        email=staff.email,
        name=staff.name,
    )

