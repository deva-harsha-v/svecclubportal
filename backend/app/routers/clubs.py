from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_, func, String
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Club, ClubLead
from ..schemas import ClubSummaryOut, ClubDetailOut

router = APIRouter(prefix="/api/clubs", tags=["clubs"])


@router.get("", response_model=list[ClubSummaryOut])
def list_clubs(
    search: str | None = Query(None, description="Matches name, tagline, description, or domains"),
    category: str | None = Query(None),
    db: Session = Depends(get_db),
):
    """
    Public club directory. Only active clubs are shown.
    Kept lean (no description/leads) for fast performance on mobile.
    """
    q = db.query(Club).filter(Club.is_active == True)

    if category and category.lower() != "all":
        q = q.filter(func.lower(Club.category) == category.lower())

    if search:
        like = f"%{search.strip()}%"
        q = q.filter(
            or_(
                Club.name.ilike(like),
                Club.tagline.ilike(like),
                Club.description.ilike(like),
                func.cast(Club.domains, String).ilike(like),
            )
        )

    return q.order_by(Club.category, Club.name).all()


@router.get("/categories", response_model=list[str])
def list_categories(db: Session = Depends(get_db)):
    rows = (
        db.query(Club.category)
        .filter(Club.is_active == True)
        .distinct()
        .order_by(Club.category)
        .all()
    )
    return [r[0] for r in rows]


@router.get("/{slug}", response_model=ClubDetailOut)
def get_club(slug: str, db: Session = Depends(get_db)):
    club = db.query(Club).filter(Club.slug == slug.lower(), Club.is_active == True).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found or currently unavailable.")

    # Filter leads to public leads only
    public_leads = [lead for lead in club.leads if getattr(lead, "is_public", True)]
    
    res = ClubDetailOut.model_validate(club)
    res.leads = public_leads
    return res

