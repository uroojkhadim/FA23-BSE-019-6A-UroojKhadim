# CUI Vehari — Plagiarism Detection Portal

A full-stack academic integrity portal for COMSATS University Islamabad, Vehari Campus.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | Node.js + Express |
| Database | MongoDB |
| File Storage | Backblaze B2 |
| Auth | JWT (role-based) |

## Roles

- **Student** — Register, upload thesis, track status, download reports
- **Supervisor** — Approve/reject student submissions, preview documents
- **Librarian** — Download submissions, upload plagiarism & AI reports
- **Admin** — Manage users, view statistics, manage files

## Project Working Workflow

1. **Student Registration**: Student creates account → status = pending
2. **Admin Approval**: Admin approves student → status = approved & is_active = true
3. **Student Upload**: Student uploads thesis → status = pending_supervisor
4. **Supervisor Review**: Supervisor approves → status = pending_librarian
5. **Librarian Review**: Librarian downloads thesis, uploads reports (plagiarism + AI) → status = completed
6. **Student Access**: Student can view and download reports

---

## Project Structure

```
cui-vehari-library-portal/
├── frontend/                # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/      # Shared layout components, toast notifications
│   │   ├── pages/           # Dashboard pages for all roles
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── SupervisorDashboard.jsx
│   │   │   ├── LibrarianDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.jsx  # Auth state management
│   │   ├── lib/
│   │   │   └── api.js       # API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── package.json
│   └── .env                 # VITE_API_URL=http://localhost:3001
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js        # MongoDB connection
│   │   │   └── s3.js        # Backblaze B2 S3 client
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── adminController.js
│   │   │   └── submissionController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Submission.js
│   │   │   └── Report.js
│   │   ├── middleware/
│   │   │   └── auth.js      # JWT protection
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── adminRoutes.js
│   │   │   ├── submissionRoutes.js
│   │   │   └── reportRoutes.js
│   │   └── server.js        # Express server entry
│   ├── db/
│   │   └── index.js
│   ├── package.json
│   └── .env                 # PORT, MONGO_URI, JWT_SECRET, B2_*
└── README.md
```

---

## Setup Guide

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Backblaze B2 account (for file storage)

### Step 1 — Backend Setup

```bash
cd backend
npm install

# Create .env file (copy from env.example)
cp ../env.example .env
# Edit .env and fill in your values
```

Required backend .env variables:
```
PORT=3001
MONGO_URI=mongodb://localhost:27017/cui-portal-dev
JWT_SECRET=cui_portal_secure_key_2026

# Admin Seed
SEED_ADMIN_EMAIL=admin@cui.edu.pk
SEED_ADMIN_PASSWORD=Admin@123
SEED_ADMIN_NAME=Portal Admin

# Backblaze B2
B2_KEY_ID=your_b2_key_id
B2_APPLICATION_KEY=your_b2_application_key
B2_BUCKET_NAME=your_bucket_name
B2_ENDPOINT=https://s3.us-east-005.backblazeb2.com
```

Start the backend server:
```bash
node src/server.js
```

---

### Step 2 — Frontend Setup

```bash
cd frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:3001" > .env
```

Start the frontend dev server:
```bash
npm run dev
```

The frontend will be available at http://localhost:5173 (or another port if 5173 is in use)

---

## Default Credentials

After starting the backend, the following accounts are automatically seeded:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@cui.edu.pk | Admin@123 |
| Supervisor | supervisor@cui.edu.pk | Supervisor@123 |
| Librarian | librarian@cui.edu.pk | Librarian@123 |

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Student self-registration
- `POST /api/auth/login` — All roles login
- `GET  /api/auth/me` — Get current user (protected)
- `GET  /api/auth/supervisors` — Get list of active supervisors

### Student
- `POST /api/documents/upload` — Upload thesis (protected, student only)
- `GET  /api/documents/my` — Get my submissions (protected, student only)
- `GET  /api/documents/:id/download` — Download submission (protected)
- `GET  /api/documents/:id/reports` — Get reports for submission (protected)
- `GET  /api/reports/:id/download` — Download report file (protected)

### Supervisor
- `GET  /api/documents/supervisor/pending` — Get pending submissions (protected, supervisor only)
- `PUT  /api/documents/:id/approve-supervisor` — Approve submission (protected, supervisor only)
- `PUT  /api/documents/:id/reject-supervisor` — Reject submission (protected, supervisor only)

### Librarian
- `GET  /api/documents/librarian/pending` — Get pending librarian submissions (protected, librarian only)
- `POST /api/documents/:id/upload-reports` — Upload plagiarism & AI reports (protected, librarian only)
- `PUT  /api/documents/:id/approve-final` — Final approval (protected, librarian only)
- `PUT  /api/documents/:id/reject-final` — Final rejection (protected, librarian only)

### Admin
- `GET  /api/admin/users` — Get users (protected, admin/subadmin only)
- `POST /api/admin/users` — Add supervisor/librarian/admin (protected, admin/subadmin only)
- `POST /api/admin/users/:id/status` — Update user status (protected, admin/subadmin only)
- `DELETE /api/admin/users/:id` — Deactivate user (protected, admin/subadmin only)
- `GET  /api/admin/stats` — Get dashboard stats (protected, admin/subadmin only)
- `GET  /api/documents/all` — Get all submissions (protected, admin/subadmin only)
- `DELETE /api/documents/:id` — Delete submission (protected, admin/subadmin only)

---

## Database Models

### User
```javascript
{
  name: String,
  email: String,
  password_hash: String,
  role: ['student', 'supervisor', 'librarian', 'admin', 'subadmin'],
  department: String,
  reg_number: String,
  phone: String,
  supervisor_id: ObjectId (ref: User),
  is_active: Boolean,
  status: ['pending', 'approved', 'rejected']
}
```

### Submission
```javascript
{
  title: String,
  fileUrl: String,
  file_key: String,
  file_name: String,
  file_size: Number,
  uploadedBy: ObjectId (ref: User),
  supervisorId: ObjectId (ref: User),
  librarianId: ObjectId (ref: User),
  status: ['pending', 'pending_supervisor', 'pending_librarian', 'rejected', 'completed'],
  reject_reason: String,
  approved_at: Date,
  final_decision_at: Date,
  doc_report_url: String,
  doc_report_key: String,
  ai_report_url: String,
  ai_report_key: String
}
```

### Report
```javascript
{
  submission_id: ObjectId (ref: Submission),
  librarian_id: ObjectId (ref: User),
  report_type: ['plagiarism', 'ai'],
  file_key: String,
  file_name: String,
  similarity_score: Number,
  ai_percentage: Number,
  notes: String
}
```
SceenShots
<img width="1340" height="635" alt="Screenshot 2026-05-14 002017" src="https://github.com/user-attachments/assets/90016e66-0abb-4d38-be5c-9e06ee9e4dde" />
<img width="1344" height="624" alt="Screenshot 2026-05-14 001811" src="https://github.com/user-attachments/assets/7de4f590-6cec-4a44-9f48-f9df64657910" />
<img width="1365" height="630" alt="Screenshot 2026-05-14 001836" src="https://github.com/user-attachments/assets/b7c99b1a-ee3e-4778-b6f0-9788eda36a51" />
<img width="1345" height="632" alt="Screenshot 2026-05-14 001738" src="https://github.com/user-attachments/assets/794c4340-de34-44a9-827c-b1fed6118394" />
<img width="1365" height="628" alt="Screenshot 2026-05-14 001910" src="https://github.com/user-attachments/assets/88482545-da2b-40a5-a7b1-2ba6bc6a2dcc" />
<img width="1331" height="635" alt="Screenshot 2026-05-14 001943" src="https://github.com/user-attachments/assets/a2f4eb22-5383-4b6f-86e8-3376cb9cbfd3" />

Frontend
https://cui-plagiarism-portal-frontend.vercel.app/
Backend
https://cui-plagiarism-portal.vercel.app/


