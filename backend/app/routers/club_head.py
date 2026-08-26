from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, cast, Date
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..models import Club, Student, Registration, StaffProfile, Role
from ..schemas import RegistrationOut, StudentOut
from ..auth import require_admin_or_club_head

router = APIRouter(prefix="/api/club-head", tags=["club-head"])


@router.get("/dashboard")
def get_club_head_dashboard(
    staff: StaffProfile = Depends(require_admin_or_club_head),
    db: Session = Depends(get_db),
):
    """Returns dashboard metrics strictly scoped to the logged-in club head's assigned club."""
    if staff.role != Role.CLUB_HEAD or not staff.club_id:
        if staff.role == Role.ADMIN:
            # Fallback if admin accesses club-head endpoint
            club = db.query(Club).first()
            if not club:
                raise HTTPException(status_code=404, detail="No clubs exist yet.")
            club_id = club.id
        else:
            raise HTTPException(status_code=403, detail="Account is not associated with a club.")
    else:
        club_id = staff.club_id

    club = db.query(Club).filter(Club.id == club_id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Assigned club not found.")

    total_registrations = db.query(func.count(Registration.id)).filter(Registration.club_id == club_id).scalar() or 0

    # Today's registrations
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    today_registrations = (
        db.query(func.count(Registration.id))
        .filter(Registration.club_id == club_id, Registration.registered_at >= today_start)
        .scalar() or 0
    )

    # Trend by date
    trend_rows = (
        db.query(func.date(Registration.registered_at).label("reg_date"), func.count(Registration.id))
        .filter(Registration.club_id == club_id)
        .group_by("reg_date")
        .order_by("reg_date")
        .all()
    )

    trend = [{"date": str(d), "count": count} for d, count in trend_rows]

    # Recent registrations
    recent_regs = (
        db.query(Registration)
        .options(joinedload(Registration.student))
        .filter(Registration.club_id == club_id)
        .order_by(Registration.registered_at.desc())
        .limit(20)
        .all()
    )

    recent = [
        {
            "id": r.id,
            "student_name": r.student.name,
            "roll_number": r.student.roll_number,
            "branch": r.student.branch,
            "section": r.student.section,
            "email": r.student.email,
            "phone": r.student.phone,
            "registered_at": r.registered_at.isoformat(),
            "status": r.status,
        }
        for r in recent_regs
    ]

    return {
        "club_name": club.name,
        "club_slug": club.slug,
        "category": club.category,
        "registration_open": club.registration_open,
        "is_active": club.is_active,
        "total_registrations": total_registrations,
        "today_registrations": today_registrations,
        "trend": trend,
        "recent_registrations": recent,
    }
