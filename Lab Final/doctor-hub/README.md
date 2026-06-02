# Doctor Hub

**Healthcare Consultation & Patient History Management System**

Final Semester Project — Angular 21 + Node.js/Express + MySQL

## Features

- **5 Roles**: Patient, Doctor, Assistant, Admin, Super Admin (full RBAC)
- **Doctor Search**: Filter by disease, treatment type (Allopathic/Homeopathic/Herbal), specialization, city, rating, availability
- **Appointment Workflow**: `pending → payment_uploaded → verified → confirmed → completed → cancelled`
- **Payment Verification**: Assistants verify uploaded screenshots
- **Immutable Medical Records**: No delete/edit on prescriptions or medical history (DB triggers + API)
- **Messaging**, file uploads, analytics dashboards

## Project Structure

```
doctor-hub/
├── backend/          # Express REST API
├── frontend/         # Angular SPA
├── database/         # schema.sql, seed.sql
├── docs/             # Architecture & ER diagram
└── postman/          # API collection
```

## Quick Start

### Prerequisites

- Node.js 20+
- MySQL 8.x
- npm

### 1. Database

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
cd backend && npm run seed
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # edit DB credentials
npm install
npm run dev
```

API: `http://localhost:3000/api`

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

App: `http://localhost:4200`

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@doctorhub.com | Password@123 |
| Admin | admin@doctorhub.com | Password@123 |
| Assistant | assistant@doctorhub.com | Password@123 |
| Doctor | doctor1@doctorhub.com | Password@123 |
| Patient | patient1@doctorhub.com | Password@123 |

Run `npm run seed` in backend after importing `seed.sql` to set passwords.

## API Overview

| Module | Endpoints |
|--------|-----------|
| Auth | POST `/api/auth/register`, `/login`, `/forgot-password`, `/reset-password` |
| Doctors | GET `/api/doctors`, `/api/doctors/:id` |
| Appointments | POST/GET `/api/appointments`, PUT `/api/appointments/:id/status` |
| Payments | POST `/api/payments/upload`, PUT `/api/payments/verify` |
| History | GET/POST `/api/history` (no DELETE) |
| Prescriptions | GET/POST `/api/prescriptions` (no PUT/DELETE) |

See [docs/SETUP.md](docs/SETUP.md) and `postman/Doctor-Hub.postman_collection.json`.

## Security

- JWT authentication, bcrypt passwords
- Helmet, CORS, rate limiting, Joi validation
- Parameterized SQL queries (mysql2)
- Role-based middleware on all protected routes

## License

Academic project — FA23-BSE-019
