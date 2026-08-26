import time
from datetime import datetime, timezone, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Request, UploadFile, File
from sqlalchemy import func, or_, cast, Date
from sqlalchemy.orm import Session, joinedload

from ..database import get_db, engine
from ..models import Club, ClubLead, Student, Registration, StaffProfile, Role, SystemSetting, AuditLog
from ..schemas import (
    AdminStatsOut,
    ClubAdminOut,
    ClubCreateUpdate,
    StudentOut,
    StudentDetailOut,
    RegistrationOut,
    StaffProfileOut,
    StaffProfileCreate,
    StaffProfileUpdate,
    SystemSettingOut,
    SystemSettingUpdate,
    AuditLogOut,
    SystemHealthOut,
)
from ..auth import require_admin, require_admin_or_club_head, hash_password
from ..storage import save_club_logo

router = APIRouter(prefix="/api/admin", tags=["admin"])


def _visible_club_ids(staff: StaffProfile, db: Session) -> list[int] | None:
    if staff.role == Role.ADMIN:
        return None
    if not staff.club_id:
        raise HTTPException(status_code=403, detail="This account is not linked to a club.")
    return [staff.club_id]


def _log_audit(db: Session, staff: StaffProfile, action: str, details: str, ip: Optional[str] = None):
    audit = AuditLog(
        user_id=staff.user_id,
        user_email=staff.email,
        action=action,
        details=details,
        ip_address=ip,
    )
    db.add(audit)
    db.commit()


# ---------------------------------------------------------------- Health ----

@router.get("/health", response_model=SystemHealthOut)
def admin_health_check(db: Session = Depends(get_db)):
    db_status = "ok"
    try:
        t0 = time.time()
        db.execute(func.now())
        db_latency_ms = int((time.time() - t0) * 1000)
        db_status = f"connected ({db_latency_ms}ms)"
    except Exception as err:
        db_status = f"error: {str(err)}"

    global_reg = db.query(SystemSetting).filter(SystemSetting.key == "registration_enabled").first()
    reg_enabled = True
    if global_reg and global_reg.value:
        reg_enabled = global_reg.value.lower() not in ("false", "0", "off", "disabled")

    return SystemHealthOut(
        status="operational",
        database=db_status,
        storage="ready",
        global_registration_enabled=reg_enabled,
        timestamp=datetime.now(timezone.utc),
    )


# ---------------------------------------------------------------- Stats ----

@router.get("/stats", response_model=AdminStatsOut)
def admin_stats(staff: StaffProfile = Depends(require_admin), db: Session = Depends(get_db)):
    total_students = db.query(func.count(Student.id)).scalar() or 0
    total_registrations = db.query(func.count(Registration.id)).scalar() or 0
    total_clubs = db.query(func.count(Club.id)).filter(Club.is_active == True).scalar() or 0
    open_clubs = db.query(func.count(Club.id)).filter(Club.is_active == True, Club.registration_open == True).scalar() or 0

    global_setting = db.query(SystemSetting).filter(SystemSetting.key == "registration_enabled").first()
    reg_enabled = True
    if global_setting and global_setting.value:
        reg_enabled = global_setting.value.lower() not in ("false", "0", "off", "disabled")

    # Popularity by Club
    by_club_rows = (
        db.query(Club.name, Club.slug, func.count(Registration.id))
        .outerjoin(Registration, Registration.club_id == Club.id)
        .filter(Club.is_active == True)
        .group_by(Club.id)
        .order_by(func.count(Registration.id).desc())
        .all()
    )
    by_club = [{"club": name, "slug": slug, "registrations": count} for name, slug, count in by_club_rows]

    # Branch Distribution
    branch_rows = (
        db.query(Student.branch, func.count(Student.id))
        .group_by(Student.branch)
        .order_by(func.count(Student.id).desc())
        .all()
    )
    by_branch = [{"branch": branch, "count": count} for branch, count in branch_rows]

    # Registration Trend (Timeseries by Date)
    trend_rows = (
        db.query(func.date(Registration.registered_at).label("reg_date"), func.count(Registration.id))
        .group_by("reg_date")
        .order_by("reg_date")
        .all()
    )

    trend = [{"date": str(d), "count": count} for d, count in trend_rows]

    return AdminStatsOut(
        total_students=total_students,
        total_registrations=total_registrations,
        total_clubs=total_clubs,
        open_clubs=open_clubs,
        global_registration_enabled=reg_enabled,
        by_club=by_club,
        by_branch=by_branch,
        trend=trend,
    )


# ---------------------------------------------------------------- Clubs ----

@router.get("/clubs", response_model=list[ClubAdminOut])
def admin_list_clubs(
    staff: StaffProfile = Depends(require_admin_or_club_head), db: Session = Depends(get_db)
):
    allowed = _visible_club_ids(staff, db)
    q = db.query(Club)
    if allowed is not None:
        q = q.filter(Club.id.in_(allowed))
    clubs = q.order_by(Club.is_active.desc(), Club.category, Club.name).all()

    counts = dict(
        db.query(Registration.club_id, func.count(Registration.id))
        .group_by(Registration.club_id)
        .all()
    )
    out = []
    for c in clubs:
        item = ClubAdminOut.model_validate(c)
        item.registration_count = counts.get(c.id, 0)
        out.append(item)
    return out


@router.post("/clubs", response_model=ClubAdminOut)
def admin_create_club(
    payload: ClubCreateUpdate,
    request: Request,
    staff: StaffProfile = Depends(require_admin),
    db: Session = Depends(get_db),
):
    existing = db.query(Club).filter(Club.slug == payload.slug.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="A club with this slug already exists.")

    leads_data = payload.leads
    club_dict = payload.model_dump(exclude={"leads"})
    club_dict["slug"] = club_dict["slug"].lower().strip()

    club = Club(**club_dict)
    club.leads = [ClubLead(name=l.name, role=l.role, is_public=l.is_public) for l in leads_data]
    db.add(club)
    db.commit()
    db.refresh(club)

    _log_audit(db, staff, "CLUB_CREATED", f"Created club '{club.name}' ({club.slug})", request.client.host if request.client else None)

    item = ClubAdminOut.model_validate(club)
    item.registration_count = 0
    return item


@router.put("/clubs/{slug}", response_model=ClubAdminOut)
def admin_update_club(
    slug: str,
    payload: ClubCreateUpdate,
    request: Request,
    staff: StaffProfile = Depends(require_admin),
    db: Session = Depends(get_db),
):
    club = db.query(Club).filter(Club.slug == slug.lower()).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found.")

    leads_data = payload.leads
    update_data = payload.model_dump(exclude={"slug", "leads"})

    for field, value in update_data.items():
        setattr(club, field, value)

    # Recreate leads
    db.query(ClubLead).filter(ClubLead.club_id == club.id).delete()
    club.leads = [ClubLead(name=l.name, role=l.role, is_public=l.is_public) for l in leads_data]

    db.commit()
    db.refresh(club)

    _log_audit(db, staff, "CLUB_EDITED", f"Updated club '{club.name}' ({club.slug})", request.client.host if request.client else None)

    item = ClubAdminOut.model_validate(club)
    item.registration_count = db.query(func.count(Registration.id)).filter(Registration.club_id == club.id).scalar() or 0
    return item


@router.delete("/clubs/{slug}")
def admin_deactivate_club(
    slug: str,
    request: Request,
    staff: StaffProfile = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Soft deletes/deactivates a club to preserve historical registrations."""
    club = db.query(Club).filter(Club.slug == slug.lower()).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found.")

    club.is_active = False
    club.registration_open = False
    db.commit()

    _log_audit(db, staff, "CLUB_DEACTIVATED", f"Deactivated club '{club.name}' ({club.slug})", request.client.host if request.client else None)
    return {"status": "success", "message": f"Club '{club.name}' has been deactivated."}


@router.post("/clubs/{slug}/logo")
def admin_upload_logo(
    slug: str,
    file: UploadFile = File(...),
    request: Request = None,
    staff: StaffProfile = Depends(require_admin),
    db: Session = Depends(get_db),
):
    club = db.query(Club).filter(Club.slug == slug.lower()).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found.")

    logo_url = save_club_logo(file, slug)
    club.logo = logo_url
    db.commit()

    _log_audit(db, staff, "CLUB_LOGO_UPLOADED", f"Uploaded logo for '{club.name}'", request.client.host if request.client else None)
    return {"logo_url": logo_url}


# ---------------------------------------------------------------- Students ----

@router.get("/students", response_model=list[StudentOut])
def admin_list_students(
    search: Optional[str] = Query(None),
    branch: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    staff: StaffProfile = Depends(require_admin),
    db: Session = Depends(get_db),
):
    q = db.query(Student)
    if branch and branch.lower() != "all":
        q = q.filter(func.lower(Student.branch) == branch.lower())
    if search:
        like = f"%{search.strip()}%"
        q = q.filter(
            or_(
                Student.name.ilike(like),
                Student.roll_number.ilike(like),
                Student.email.ilike(like),
                Student.phone.ilike(like),
            )
        )

    students = q.order_by(Student.created_at.desc()).offset(offset).limit(limit).all()
    
    # Attach count of registered clubs
    student_ids = [s.id for s in students]
    counts = dict(
        db.query(Registration.student_id, func.count(Registration.id))
        .filter(Registration.student_id.in_(student_ids))
        .group_by(Registration.student_id)
        .all()
    ) if student_ids else {}

    res = []
    for s in students:
        item = StudentOut.model_validate(s)
        item.club_count = counts.get(s.id, 0)
        res.append(item)

    return res


@router.get("/students/{student_id}", response_model=StudentDetailOut)
def admin_get_student(
    student_id: int,
    staff: StaffProfile = Depends(require_admin),
    db: Session = Depends(get_db),
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")

    regs = (
        db.query(Registration)
        .options(joinedload(Registration.club))
        .filter(Registration.student_id == student.id)
        .all()
    )

    reg_clubs = [
        {
            "club_name": r.club.name,
            "club_slug": r.club.slug,
            "category": r.club.category,
            "registered_at": r.registered_at.isoformat(),
            "status": r.status,
        }
        for r in regs
    ]

    res = StudentDetailOut.model_validate(student)
    res.club_count = len(regs)
    res.registered_clubs = reg_clubs
    return res


# ---------------------------------------------------------------- Registrations ----

@router.get("/registrations", response_model=list[RegistrationOut])
def admin_list_registrations(
    club: str | None = Query(None, description="Filter by club slug"),
    branch: str | None = Query(None),
    search: str | None = Query(None),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    staff: StaffProfile = Depends(require_admin_or_club_head),
    db: Session = Depends(get_db),
):
    allowed = _visible_club_ids(staff, db)
    q = (
        db.query(Registration)
        .options(joinedload(Registration.student), joinedload(Registration.club))
        .join(Club)
        .join(Student)
    )
    if allowed is not None:
        q = q.filter(Registration.club_id.in_(allowed))

    if club:
        club_obj = db.query(Club).filter(Club.slug == club.lower()).first()
        if not club_obj:
            raise HTTPException(status_code=404, detail="Club not found.")
        if allowed is not None and club_obj.id not in allowed:
            raise HTTPException(status_code=403, detail="Access denied to this club's registrations.")
        q = q.filter(Registration.club_id == club_obj.id)

    if branch and branch.lower() != "all":
        q = q.filter(func.lower(Student.branch) == branch.lower())

    if search:
        like = f"%{search.strip()}%"
        q = q.filter(
            or_(
                Student.name.ilike(like),
                Student.roll_number.ilike(like),
                Student.email.ilike(like),
                Club.name.ilike(like),
            )
        )

    regs = q.order_by(Registration.registered_at.desc()).offset(offset).limit(limit).all()

    return [
        RegistrationOut(
            id=r.id,
            student=StudentOut.model_validate(r.student),
            club_slug=r.club.slug,
            club_name=r.club.name,
            registered_at=r.registered_at,
            status=r.status,
        )
        for r in regs
    ]


# ---------------------------------------------------------------- Staff & Club Heads ----

@router.get("/staff", response_model=list[StaffProfileOut])
def admin_list_staff(staff: StaffProfile = Depends(require_admin), db: Session = Depends(get_db)):
    profiles = db.query(StaffProfile).options(joinedload(StaffProfile.club)).order_by(StaffProfile.created_at.desc()).all()
    res = []
    for p in profiles:
        item = StaffProfileOut.model_validate(p)
        item.club_name = p.club.name if p.club else None
        item.club_slug = p.club.slug if p.club else None
        res.append(item)
    return res


@router.post("/staff", response_model=StaffProfileOut)
def admin_create_staff(
    payload: StaffProfileCreate,
    request: Request,
    staff: StaffProfile = Depends(require_admin),
    db: Session = Depends(get_db),
):
    uid = payload.user_id or payload.email.lower()
    existing = db.query(StaffProfile).filter((StaffProfile.user_id == uid) | (StaffProfile.email == payload.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Staff account with this email/UID already exists.")

    profile = StaffProfile(
        user_id=uid,
        name=payload.name,
        email=payload.email,
        role=payload.role,
        club_id=payload.club_id,
        is_active=True,
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)

    _log_audit(db, staff, "STAFF_CREATED", f"Created staff profile '{profile.name}' ({profile.role})", request.client.host if request.client else None)

    item = StaffProfileOut.model_validate(profile)
    item.club_name = profile.club.name if profile.club else None
    item.club_slug = profile.club.slug if profile.club else None
    return item


@router.put("/staff/{staff_id}", response_model=StaffProfileOut)
def admin_update_staff(
    staff_id: int,
    payload: StaffProfileUpdate,
    request: Request,
    staff: StaffProfile = Depends(require_admin),
    db: Session = Depends(get_db),
):
    profile = db.query(StaffProfile).filter(StaffProfile.id == staff_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Staff profile not found.")

    for field, val in payload.model_dump(exclude_unset=True).items():
        if field == "password":
            continue
        setattr(profile, field, val)

    db.commit()
    db.refresh(profile)

    _log_audit(db, staff, "STAFF_UPDATED", f"Updated staff profile '{profile.name}'", request.client.host if request.client else None)

    item = StaffProfileOut.model_validate(profile)
    item.club_name = profile.club.name if profile.club else None
    item.club_slug = profile.club.slug if profile.club else None
    return item


# ---------------------------------------------------------------- System Settings ----

@router.get("/settings", response_model=list[SystemSettingOut])
def admin_list_settings(staff: StaffProfile = Depends(require_admin), db: Session = Depends(get_db)):
    # Initialize default settings if missing
    defaults = {
        "registration_enabled": "true",
        "fallback_registration_url": "",
    }
    for key, val in defaults.items():
        if not db.query(SystemSetting).filter(SystemSetting.key == key).first():
            db.add(SystemSetting(key=key, value=val))
    db.commit()

    return db.query(SystemSetting).order_by(SystemSetting.key).all()


@router.put("/settings/{key}", response_model=SystemSettingOut)
def admin_update_setting(
    key: str,
    payload: SystemSettingUpdate,
    request: Request,
    staff: StaffProfile = Depends(require_admin),
    db: Session = Depends(get_db),
):
    setting = db.query(SystemSetting).filter(SystemSetting.key == key.lower()).first()
    if not setting:
        setting = SystemSetting(key=key.lower(), value=payload.value)
        db.add(setting)
    else:
        setting.value = payload.value

    db.commit()
    db.refresh(setting)

    _log_audit(db, staff, "SETTING_CHANGED", f"Updated setting '{key}' = '{payload.value}'", request.client.host if request.client else None)
    return setting


# ---------------------------------------------------------------- Audit Logs ----

@router.get("/audit-logs", response_model=list[AuditLogOut])
def admin_list_audit_logs(
    search: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    staff: StaffProfile = Depends(require_admin),
    db: Session = Depends(get_db),
):
    q = db.query(AuditLog)
    if search:
        like = f"%{search.strip()}%"
        q = q.filter(
            or_(
                AuditLog.action.ilike(like),
                AuditLog.user_email.ilike(like),
                AuditLog.details.ilike(like),
            )
        )
    return q.order_by(AuditLog.created_at.desc()).offset(offset).limit(limit).all()
