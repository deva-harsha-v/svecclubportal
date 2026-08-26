import enum
from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
    UniqueConstraint,
    JSON,
    Enum,
    Index,
)
from sqlalchemy.orm import relationship

from .database import Base


def utcnow():
    return datetime.now(timezone.utc)


class Role(str, enum.Enum):
    ADMIN = "admin"
    CLUB_HEAD = "club_head"


class Club(Base):
    __tablename__ = "clubs"

    id = Column(Integer, primary_key=True)
    slug = Column(String(80), unique=True, nullable=False, index=True)
    name = Column(String(160), nullable=False)
    category = Column(String(60), nullable=False, index=True)
    tagline = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)          # "About"
    what_we_do = Column(JSON, default=list)             # list[str] of activities
    domains = Column(JSON, default=list)                # list[str] interests/tags
    logo = Column(Text, nullable=True)           # emoji, glyph, image URL, or Base64 data URL
    banner = Column(Text, nullable=True)         # Banner / Cover Image URL or Base64 data URL
    faculty_coordinator = Column(String(160), nullable=True)
    instagram = Column(String(300), nullable=True)
    linkedin = Column(String(300), nullable=True)
    website = Column(String(300), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    registration_open = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    leads = relationship("ClubLead", back_populates="club", cascade="all, delete-orphan")
    registrations = relationship("Registration", back_populates="club")
    staff_profiles = relationship("StaffProfile", back_populates="club")


class ClubLead(Base):
    """A public student lead / office bearer shown on a club's public profile."""
    __tablename__ = "club_leads"

    id = Column(Integer, primary_key=True)
    club_id = Column(Integer, ForeignKey("clubs.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(160), nullable=False)
    role = Column(String(120), nullable=True)  # e.g. "President", "Tech Lead"
    is_public = Column(Boolean, default=True, nullable=False)

    club = relationship("Club", back_populates="leads")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True)
    name = Column(String(160), nullable=False)
    roll_number = Column(String(60), unique=True, nullable=False, index=True)
    branch = Column(String(80), nullable=False)
    section = Column(String(20), nullable=True)
    email = Column(String(200), nullable=False, index=True)
    phone = Column(String(20), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    registrations = relationship("Registration", back_populates="student")


class Registration(Base):
    __tablename__ = "registrations"
    __table_args__ = (
        UniqueConstraint("student_id", "club_id", name="uq_student_club"),
        Index("ix_registrations_club_id", "club_id"),
        Index("ix_registrations_student_id", "student_id"),
    )

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    club_id = Column(Integer, ForeignKey("clubs.id", ondelete="CASCADE"), nullable=False)
    registered_at = Column(DateTime(timezone=True), default=utcnow)
    status = Column(String(20), default="confirmed", nullable=False)

    student = relationship("Student", back_populates="registrations")
    club = relationship("Club", back_populates="registrations")


class StaffProfile(Base):
    """
    Staff / Auth user profile for application-level authorization.
    Linked to Supabase Auth UID (user_id) or fallback local auth UID.
    """
    __tablename__ = "staff_profiles"

    id = Column(Integer, primary_key=True)
    user_id = Column(String(120), unique=True, nullable=False, index=True)
    name = Column(String(160), nullable=False)
    email = Column(String(200), nullable=False, index=True)
    role = Column(Enum(Role), nullable=False, default=Role.CLUB_HEAD)
    club_id = Column(Integer, ForeignKey("clubs.id", ondelete="SET NULL"), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    club = relationship("Club", back_populates="staff_profiles")


class SystemSetting(Base):
    """Key-value system configurations e.g. global registration_enabled, fallback_registration_url."""
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True)
    key = Column(String(80), unique=True, nullable=False, index=True)
    value = Column(Text, nullable=True)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)


class AuditLog(Base):
    """Audit logs for tracking admin & operational actions."""
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True)
    user_id = Column(String(120), nullable=True)
    user_email = Column(String(200), nullable=True)
    action = Column(String(100), nullable=False, index=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String(60), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, index=True)

