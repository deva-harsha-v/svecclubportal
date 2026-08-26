# SVEC Club Portal — Production Deployment & Configuration Guide

This guide details the complete deployment process for the **SVEC Club Portal**, including environment variables, database initialization, backend hosting, frontend static hosting, and local campus server setup.

---

## 1. Production Environment Variables

### Backend Environment Variables (`backend/.env`)

Create a `.env` file inside the `backend/` directory:

```env
# 1. Database Connection (Supabase PostgreSQL / Managed Postgres)
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_SUPABASE_PROJECT.supabase.co:5432/postgres

# 2. Supabase Auth Integration
SUPABASE_URL=https://YOUR_SUPABASE_PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

# 3. Security & Application Secrets
JWT_SECRET=svec_club_portal_secure_jwt_secret_2026_key
ENVIRONMENT=production

# 4. Allowed Frontend CORS Origins (Comma-separated)
CORS_ORIGINS=https://svec-club-portal.vercel.app,http://localhost:5173,http://localhost:3000
```

### Frontend Environment Variables (`frontend/.env`)

Create a `.env` file inside the `frontend/` directory:

```env
# Production Backend API Base URL
VITE_API_BASE_URL=https://svec-club-portal-api.onrender.com
```

---

## 2. Database Setup & Migrations

### Step A: Initialize PostgreSQL (Supabase / Render / Local)

1. Create a PostgreSQL database instance on [Supabase](https://supabase.com) or [Render](https://render.com).
2. Copy the PostgreSQL connection URI string into `backend/.env` as `DATABASE_URL`.

### Step B: Run Alembic Database Migrations

Run database migrations to generate all required tables (`clubs`, `students`, `registrations`, `staff_profiles`, `audit_logs`, `system_settings`):

```bash
cd backend
python -m alembic upgrade head
```

### Step C: Seed Default SVEC Clubs & Admin Account

Populate default SVEC clubs (**Sakala**, **Beats of Hearts**, **Photography**, **Technical**, **ACE Club**) and default admin account:

```bash
python seed_dev.py
```

*Default Admin Credentials:*
- **Username / Email**: `admin@sves.org.in`
- **Password**: `admin123`

---

## 3. Option A — Cloud Deployment (Recommended)

### Backend Deployment (Render / Railway / Fly.io)

1. Connect your GitHub repository (`https://github.com/deva-harsha-v/svecclubportal.git`) to Render or Railway.
2. Set **Root Directory**: `backend`
3. Set **Build Command**: `pip install -r requirements.txt`
4. Set **Start Command**:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 4
   ```
5. Add all Environment Variables under Environment Settings.

### Frontend Deployment (Vercel / Netlify)

1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Set **Root Directory**: `frontend`
3. Set **Framework Preset**: Vite
4. Set **Build Command**: `npm run build`
5. Set **Output Directory**: `dist`
6. Add Environment Variable:
   - `VITE_API_BASE_URL` = `https://your-backend-api.onrender.com`

---

## 4. Option B — Local Campus Server Deployment (SVEC LAN / Wi-Fi)

If you are running the portal on a physical college server connected to Sri Vasavi Engineering College's local Wi-Fi / LAN network:

### Step 1: Start Backend Uvicorn Server with 4 Workers

```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Step 2: Build & Serve Frontend

```bash
cd frontend
npm run build
npm run preview -- --host 0.0.0.0 --port 5173
```

Students connected to the college network can access the portal directly using the server's IP address:
`http://192.168.x.x:5173`

---

## 5. Event-Day Health Check Verification

Before launching registration on orientation day:

1. **Verify Backend Health Endpoint**:
   ```bash
   curl http://localhost:8000/api/health
   # Returns: {"status":"ok","database":"connected"}
   ```
2. **Verify Public Clubs Endpoint**:
   ```bash
   curl http://localhost:8000/api/clubs
   ```
3. **Verify Excel Export**:
   Log into the Admin Portal (`/admin/login`), navigate to **Registrations**, and click **Export Excel Sheet**.
