"""
Development Seed Script for Local Testing ONLY.

Usage:
    python seed_dev.py --dev-mode

This script populates the database with sample demo clubs for local UI testing.
It REQUIRES the --dev-mode flag so it CANNOT execute in production environments.
"""
import sys
from app.database import Base, engine, SessionLocal
from app.models import Club, ClubLead, StaffProfile, Role

DEMO_CLUBS = [
    dict(
        slug="mlsc",
        name="Microsoft Learn Student Club",
        category="Technical",
        tagline="Learn. Build. Connect.",
        description="MLSC is the campus chapter connecting students to Microsoft's learning resources, cloud platforms, and builder community.",
        what_we_do=["Workshops", "Hackathons", "Technical sessions", "Projects"],
        domains=["AI", "Web", "Cloud", "Development"],
        logo="⌘",
        faculty_coordinator="Dr. A. Sharma",
        instagram="https://instagram.com/mlsc.college",
        leads=[("Ananya Rao", "Chapter Lead", True), ("Kabir Mehta", "Technical Lead", True)],
    ),
    dict(
        slug="gfg",
        name="GeeksforGeeks Campus Body",
        category="Technical",
        tagline="Code. Compete. Contribute.",
        description="The GFG campus body runs DSA and competitive programming prep, open-source drives, and interview readiness.",
        what_we_do=["DSA sessions", "Contests", "Open-source drives", "Mock interviews"],
        domains=["DSA", "Competitive Programming", "Open Source"],
        logo="⚙",
        faculty_coordinator="Prof. R. Iyer",
        leads=[("Meera Nair", "President", True)],
    ),
    dict(
        slug="edc",
        name="E-Cell",
        category="Social",
        tagline="Startups, pitches, and ideas.",
        description="The Entrepreneurship Cell helps students validate ideas, meet founders and investors, and run pitch competitions.",
        what_we_do=["Pitch nights", "Founder talks", "Startup bootcamps"],
        domains=["Entrepreneurship", "Business", "Innovation"],
        logo="▲",
        faculty_coordinator="Prof. N. Desai",
        leads=[("Aarav Singh", "President", True)],
    ),
    dict(
        slug="music-club",
        name="Music Club",
        category="Cultural",
        tagline="Bands, jams, and open mics.",
        description="From weekly jam sessions to the annual battle of bands, Music Club is home for every genre and skill level.",
        what_we_do=["Jam sessions", "Open mics", "Battle of Bands"],
        domains=["Music", "Performance"],
        logo="♪",
        faculty_coordinator="Dr. S. Menon",
        leads=[("Rehan Ali", "Coordinator", True)],
    ),
]


def run():
    if "--dev-mode" not in sys.argv:
        print("ERROR: Development seed script requires explicit '--dev-mode' flag to execute.")
        print("Usage: python seed_dev.py --dev-mode")
        sys.exit(1)

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        created = 0
        for c in DEMO_CLUBS:
            if db.query(Club).filter(Club.slug == c["slug"]).first():
                continue
            leads = c.pop("leads", [])
            club = Club(**c, is_active=True, registration_open=True)
            club.leads = [ClubLead(name=n, role=r, is_public=p) for n, r, p in leads]
            db.add(club)
            created += 1
        db.commit()
        print(f"Seeded {created} sample demo club(s).")

        # Example demo club-head StaffProfile
        mlsc = db.query(Club).filter(Club.slug == "mlsc").first()
        if mlsc and not db.query(StaffProfile).filter(StaffProfile.user_id == "mlsc_head").first():
            db.add(
                StaffProfile(
                    user_id="mlsc_head",
                    name="Ananya Rao (MLSC)",
                    email="mlsc_head@college.edu",
                    role=Role.CLUB_HEAD,
                    club_id=mlsc.id,
                    is_active=True,
                )
            )
            db.commit()
            print("Created sample club-head staff profile: mlsc_head / mlsc_head@college.edu")
    finally:
        db.close()


if __name__ == "__main__":
    run()
