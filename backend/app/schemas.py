import re
from datetime import datetime
from typing import Optional, List, Any

from pydantic import BaseModel, EmailStr, field_validator, ConfigDict

from .models import Role

# ---------------------------------------------------------------- Clubs ----

class ClubLeadOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: Optional[int] = None
    name: str
    role: Optional[str] = None
    is_public: bool = True


class ClubLeadIn(BaseModel):
    name: str
    role: Optional[str] = None
    is_public: bool = True


class ClubSummaryOut(BaseModel):
    """Shown in the public directory grid. Deliberately lean for fast list loads."""
    model_config = ConfigDict(from_attributes=True)
    slug: str
    name: str
    category: str
    tagline: Optional[str] = None
    logo: Optional[str] = None
    banner: Optional[str] = None
    detail_image: Optional[str] = None
    registration_open: bool
    is_active: bool = True


class ClubDetailOut(BaseModel):
    """Shown on a club's profile page."""
    model_config = ConfigDict(from_attributes=True)
    slug: str
    name: str
    category: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    what_we_do: list[str] = []
    domains: list[str] = []
    logo: Optional[str] = None
    banner: Optional[str] = None
    detail_image: Optional[str] = None
    faculty_coordinator: Optional[str] = None
    instagram: Optional[str] = None
    linkedin: Optional[str] = None
    website: Optional[str] = None
    registration_open: bool
    is_active: bool = True
    leads: list[ClubLeadOut] = []


class ClubAdminOut(ClubDetailOut):
    id: int
    registration_count: int = 0


class ClubCreateUpdate(BaseModel):
    slug: str
    name: str
    category: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    what_we_do: list[str] = []
    domains: list[str] = []
    logo: Optional[str] = None
    banner: Optional[str] = None
    detail_image: Optional[str] = None
    faculty_coordinator: Optional[str] = None
    instagram: Optional[str] = None
    linkedin: Optional[str] = None
    website: Optional[str] = None
    registration_open: bool = True
    is_active: bool = True
    leads: list[ClubLeadIn] = []


# ---------------------------------------------------------- Registration ----

class StudentIn(BaseModel):
    name: str
    roll_number: str
    branch: str
    section: Optional[str] = None
    email: EmailStr
    phone: str

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Enter your full name.")
        return v

    @field_validator("roll_number")
    @classmethod
    def roll_not_blank(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 3:
            raise ValueError("Enter a valid roll number.")
        return v.upper()

    @field_validator("branch")
    @classmethod
    def branch_not_blank(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Enter your branch.")
        return v

    @field_validator("phone")
    @classmethod
    def phone_valid(cls, v: str) -> str:
        digits = re.sub(r"\D", "", v)
        if len(digits) != 10:
            raise ValueError("Enter a valid 10-digit phone number.")
        return digits


class RegistrationCreate(BaseModel):
    student: StudentIn
    clubs: list[str]  # club slugs

    @field_validator("clubs")
    @classmethod
    def at_least_one_club(cls, v: list[str]) -> list[str]:
        cleaned = list(dict.fromkeys(s.strip().lower() for s in v if s.strip()))
        if not cleaned:
            raise ValueError("Select at least one club.")
        return cleaned


class RegistrationResultItem(BaseModel):
    slug: str
    name: str
    status: str  # "registered" | "already_registered" | "closed" | "disabled"


class RegistrationResponse(BaseModel):
    student_name: str
    newly_registered: list[RegistrationResultItem]
    already_registered: list[RegistrationResultItem]
    closed: list[RegistrationResultItem]


# ---------------------------------------------------------------- Auth & Staff ----

class LoginRequest(BaseModel):
    username_or_email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: Role
    club_slug: Optional[str] = None
    user_id: str
    email: str
    name: str


class StaffProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: str
    name: str
    email: str
    role: Role
    club_id: Optional[int] = None
    club_name: Optional[str] = None
    club_slug: Optional[str] = None
    is_active: bool
    created_at: datetime


class StaffProfileCreate(BaseModel):
    user_id: Optional[str] = None
    name: str
    email: EmailStr
    role: Role = Role.CLUB_HEAD
    club_id: Optional[int] = None
    password: Optional[str] = None


class StaffProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[Role] = None
    club_id: Optional[int] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None


# ---------------------------------------------------------------- Admin & Ops ----

class AdminStatsOut(BaseModel):
    total_students: int
    total_registrations: int
    total_clubs: int
    open_clubs: int
    global_registration_enabled: bool
    by_club: list[dict]
    by_branch: list[dict]
    trend: list[dict]


class StudentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    roll_number: str
    branch: str
    section: Optional[str] = None
    email: str
    phone: str
    club_count: int = 0
    created_at: datetime


class StudentDetailOut(StudentOut):
    registered_clubs: list[dict] = []


class RegistrationOut(BaseModel):
    id: int
    student: StudentOut
    club_slug: str
    club_name: str
    registered_at: datetime
    status: str


class SystemSettingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    key: str
    value: Optional[str]
    updated_at: datetime


class SystemSettingUpdate(BaseModel):
    value: str


class AuditLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: Optional[str]
    user_email: Optional[str]
    action: str
    details: Optional[str]
    ip_address: Optional[str]
    created_at: datetime


class SystemHealthOut(BaseModel):
    status: str
    database: str
    storage: str
    global_registration_enabled: bool
    timestamp: datetime

