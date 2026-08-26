# College Club Discovery & Registration Portal — B.Tech Orientation 2026

<!-- Release Trigger: 2026-08-26 Production Deployment -->

Production-ready, mobile-first College Club Discovery & Registration Portal built for high-concurrency event-day registration and long-term campus club administration.

```
ONE QR CODE → Public Portal → Search/Filter → Multi-Club Selection → Single Student Entry → Central Storage → Operational Dashboards
```

## System Architecture

```
[ Mobile Browsers / QR Code ]
            │
            ▼
React 18 + TypeScript + Vite + Tailwind SPA
            │
            ▼ REST API
FastAPI Backend (app/)
     ├── Auth (Supabase Auth / StaffProfile RBAC)
     ├── Registrations (Duplicate-Safe SAVEPOINT Transactions)
     ├── Admin & Scoped Club-Head Operations
     ├── Multi-Sheet Excel Generator (openpyxl)
     └── Audit Logging & System Health Monitoring
            │
            ▼
Supabase PostgreSQL & Supabase Storage
```

---

## Technical Highlights & Architectural Features

1. **Zero Source Code Hardcoding**: The production database starts clean. All clubs, leads, logos, categories, and links are managed dynamically via the Admin Dashboard (`/admin/clubs`) without redeploying code.
2. **Supabase Auth & Staff Profiles**: Identity managed via Supabase Auth with application-level authorization mapped in `staff_profiles` (`user_id`, `name`, `email`, `role`, `club_id`, `is_active`).
3. **Soft Delete & Dual Status Controls**:
   - `is_active`: Deactivating a club removes it from public discovery while preserving historical student registration records.
   - `registration_open`: Individual club registration toggle.
4. **Global Event Registration Override**: Admin can instantly disable registration event-wide via `registration_enabled` setting in `/admin/settings`.
5. **Database-Level Anti-Duplicate Safeguard**:
   - `UNIQUE(student_id, club_id)` database constraint.
   - Per-club `db.begin_nested()` (SAVEPOINT) transaction loop preventing duplicate inserts during high event concurrency without crashing requests.
6. **Multi-Sheet Excel (.xlsx) Reporting**: Backend generates real Excel workbooks containing Summary metrics, All Registrations, and separate worksheets for each club (`openpyxl`).
7. **Event-Day System Health & Audit Logs**: Live dashboard monitoring of API server, DB connection latency, Storage readiness, and immutable `audit_logs` tracking staff actions.
8. **NAT-Aware Rate Limiting**: Designed for campus Wi-Fi NAT environments with shared public IPs.

---

## Project Structure

```
club-fair-portal/
├── backend/
│   ├── alembic/              # Alembic database version control
│   │   ├── versions/         # Migration revision scripts
│   │   └── env.py
│   ├── app/
│   │   ├── main.py           # FastAPI entrypoint & router registration
│   │   ├── config.py         # Environment configuration loader
│   │   ├── database.py       # SQLAlchemy engine & session pool
│   │   ├── models.py         # Student, Club, ClubLead, StaffProfile, SystemSetting, AuditLog
│   │   ├── schemas.py        # Pydantic request/response schemas
│   │   ├── auth.py           # Supabase Auth / Bearer token RBAC
│   │   ├── storage.py        # Supabase Storage & local upload fallback
│   │   └── routers/
│   │       ├── clubs.py           # Public club endpoints
│   │       ├── registrations.py   # Transactional registration endpoint
│   │       ├── auth_router.py     # Staff authentication endpoint
│   │       ├── admin.py           # Admin management suite & System Health
│   │       ├── excel_export.py    # Multi-sheet Excel workbook generator
│   │       └── club_head.py       # Scoped Club-Head dashboard
│   ├── seed_dev.py           # Development-only seed script (--dev-mode flag required)
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/       # UI, Club, Admin, and Layout components
│   │   ├── pages/            # Public & Staff Pages (HomePage, RegistrationPage, AdminDashboard...)
│   │   ├── layouts/          # PublicLayout & AdminLayout
│   │   ├── hooks/            # useClubSelection & useAuth
│   │   ├── services/         # API & Auth clients
│   │   ├── types/            # TypeScript type declarations
│   │   ├── App.tsx           # React Router route definitions
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── index.html
└── README.md
```

---

## Quick Start (Local Development)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Run database migrations
python -m alembic upgrade head

# Run local development API
uvicorn app.main:app --reload --port 8000
```

*(Optional for local testing)*: To populate sample demo clubs for UI preview:
```bash
python seed_dev.py --dev-mode
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
# Open http://localhost:3000
```

---

## Production Deployment (Supabase + HTTPS)

### 1. Database & Migrations (Supabase PostgreSQL)
1. Set `DATABASE_URL` in `backend/.env` to your Supabase PostgreSQL connection string (`postgresql://postgres.xxx:pass@host:6543/postgres`).
2. Run database migrations:
   ```bash
   python -m alembic upgrade head
   ```

### 2. Initial Admin Creation
On first boot, FastAPI automatically provisions the initial admin `StaffProfile` from `INITIAL_ADMIN_USERNAME` in `.env`.

### 3. Build & Serve Frontend
```bash
cd frontend
npm run build
```
Deploy the resulting static build in `frontend/dist` behind Nginx/Cdn, or serve via reverse proxy alongside the FastAPI backend.

---

## Verification & Testing

Run the automated integration test suite:
```bash
python scratch/test_portal.py
```
Checks: Health check, Public directory listing, Transactional registration, Anti-duplicate SAVEPOINT handling, Admin stats, Multi-sheet Excel export, Scoped Club-Head access, and Soft-Deactivation.
