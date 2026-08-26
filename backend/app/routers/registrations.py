from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Club, Student, Registration, SystemSetting
from ..schemas import RegistrationCreate, RegistrationResponse, RegistrationResultItem

router = APIRouter(prefix="/api/registrations", tags=["registrations"])


@router.post("", response_model=RegistrationResponse)
def create_registration(payload: RegistrationCreate, db: Session = Depends(get_db)):
    """
    One student, submitted once, joining any number of clubs.

    Guarantees:
    - Global event registration switch (registration_enabled) overrides individual settings when disabled.
    - Database-level unique constraint (student_id, club_id) prevents duplicate entries.
    - SAVEPOINT (begin_nested) per club handling ensures race condition safety during high event traffic.
    - Matched on roll number; existing student contact details are refreshed.
    """
    # Check Global Event Registration Switch
    global_setting = db.query(SystemSetting).filter(SystemSetting.key == "registration_enabled").first()
    if global_setting and global_setting.value and global_setting.value.lower() in ("false", "0", "off", "disabled"):
        raise HTTPException(
            status_code=400,
            detail="Portal registration is currently disabled by event administrators."
        )

    student_in = payload.student

    # Find-or-create student matched by roll number
    student = db.query(Student).filter(Student.roll_number == student_in.roll_number).first()
    if student:
        student.name = student_in.name
        student.branch = student_in.branch
        student.section = student_in.section
        student.email = student_in.email
        student.phone = student_in.phone
    else:
        student = Student(
            name=student_in.name,
            roll_number=student_in.roll_number,
            branch=student_in.branch,
            section=student_in.section,
            email=student_in.email,
            phone=student_in.phone,
        )
        db.add(student)
    db.flush()

    clubs = db.query(Club).filter(Club.slug.in_(payload.clubs)).all()
    found_slugs = {c.slug for c in clubs}
    missing = [s for s in payload.clubs if s not in found_slugs]
    if missing:
        raise HTTPException(status_code=404, detail=f"Unknown club(s): {', '.join(missing)}")

    existing_regs = {
        r.club_id
        for r in db.query(Registration.club_id).filter(Registration.student_id == student.id).all()
    }

    newly_registered: list[RegistrationResultItem] = []
    already_registered: list[RegistrationResultItem] = []
    closed: list[RegistrationResultItem] = []

    for club in clubs:
        if not club.is_active:
            closed.append(RegistrationResultItem(slug=club.slug, name=club.name, status="closed"))
            continue
        if club.id in existing_regs:
            already_registered.append(
                RegistrationResultItem(slug=club.slug, name=club.name, status="already_registered")
            )
            continue
        if not club.registration_open:
            closed.append(RegistrationResultItem(slug=club.slug, name=club.name, status="closed"))
            continue

        try:
            with db.begin_nested():
                db.add(Registration(student_id=student.id, club_id=club.id))
            newly_registered.append(
                RegistrationResultItem(slug=club.slug, name=club.name, status="registered")
            )
        except IntegrityError:
            already_registered.append(
                RegistrationResultItem(slug=club.slug, name=club.name, status="already_registered")
            )

    db.commit()

    return RegistrationResponse(
        student_name=student.name,
        newly_registered=newly_registered,
        already_registered=already_registered,
        closed=closed,
    )

