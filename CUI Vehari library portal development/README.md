# CUI Vehari — Plagiarism Detection Portal

A full-stack academic integrity portal for COMSATS University Islamabad, Vehari Campus.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) |
| File Storage | Cloudflare R2 |
| Auth | JWT (role-based) |

## Roles

- **Student** — Register, upload thesis, download reports
- **Supervisor** — Approve/reject student files, preview reports
- **Librarian** — Download files, run plagiarism checks, upload reports
- **Admin** — Manage users, delete files, manage storage

---

## Project Structure

```
cui-plagiarism-portal/
├── frontend/          # React app (deploy to Cloudflare Pages)
│   └── src/
│       ├── components/
│       │   ├── auth/
│       │   ├── layout/
│       │   ├── student/
│       │   ├── supervisor/
│       │   ├── librarian/
│       │   └── admin/
│       ├── pages/
│       ├── hooks/
│       └── lib/
└── backend/           # Cloudflare Worker (API)
    └── src/
```

---

## Setup Guide

### Prerequisites
- Node.js 18+
- Cloudflare account
- Wrangler CLI: `npm install -g wrangler`

---

### Step 1 — Cloudflare D1 Database

```bash
# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create cui-plagiarism-db

# Copy the database_id from output and paste into backend/wrangler.toml
```

Run migrations:
```bash
cd backend
wrangler d1 execute cui-plagiarism-db --file=./schema.sql
```

---

### Step 2 — Cloudflare R2 Bucket

```bash
# Create R2 bucket
wrangler r2 bucket create cui-plagiarism-files
```

---

### Step 3 — Deploy Backend (Cloudflare Worker)

```bash
cd backend
npm install
wrangler deploy
```

Note the Worker URL (e.g., `https://cui-backend.your-account.workers.dev`)

---

### Step 4 — Frontend Setup

```bash
cd frontend
npm install

# Copy env file
cp .env.example .env
# Edit .env and set VITE_API_URL to your Worker URL
```

Run locally:
```bash
npm run dev
```

Deploy to Cloudflare Pages:
```bash
npm run build
wrangler pages deploy dist --project-name cui-plagiarism-portal
```

---

### Step 5 — Create First Admin

After deploying, run this in D1 console or via wrangler:

```sql
INSERT INTO users (name, email, password_hash, role, department, reg_number, phone)
VALUES ('Admin', 'admin@cui.edu.pk', '$2b$10$REPLACE_WITH_HASHED_PASSWORD', 'admin', 'Administration', 'ADMIN-001', '03001234567');
```

Or use the `/api/admin/seed` endpoint (only works once, disabled after first admin is created).

---

## Environment Variables

### Backend (wrangler.toml)
```toml
[vars]
JWT_SECRET = "your-super-secret-jwt-key-change-this"
FRONTEND_URL = "https://cui-plagiarism-portal.pages.dev"
```

### Frontend (.env)
```
VITE_API_URL=https://cui-backend.your-account.workers.dev
```

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Student self-registration
- `POST /api/auth/login` — All roles login
- `GET  /api/auth/me` — Get current user

### Student
- `POST /api/submissions/upload` — Upload file (returns presigned R2 URL)
- `GET  /api/submissions/my` — My submissions
- `GET  /api/submissions/:id/reports` — Download reports

### Supervisor
- `GET  /api/submissions/pending` — Pending approvals
- `POST /api/submissions/:id/approve` — Approve submission
- `POST /api/submissions/:id/reject` — Reject with reason

### Librarian
- `GET  /api/submissions/approved` — Approved files ready for checking
- `POST /api/submissions/:id/reports` — Upload AI + plagiarism reports
- `GET  /api/submissions/:id/download` — Get R2 download URL

### Admin
- `GET  /api/admin/users` — All users
- `POST /api/admin/users` — Add supervisor/librarian
- `DELETE /api/admin/users/:id` — Remove user
- `GET  /api/admin/files` — All files with sizes
- `DELETE /api/admin/files/:id` — Delete file from R2

---

## Database Schema

See `backend/schema.sql` for full schema.

Tables:
- `users` — all roles
- `submissions` — thesis files with status
- `reports` — AI and plagiarism reports per submission
