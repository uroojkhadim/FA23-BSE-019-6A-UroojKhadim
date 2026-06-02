# Doctor Hub – System Architecture

## Overview

Doctor Hub is a three-tier healthcare platform:

```
┌─────────────────────────────────────────────────────────────┐
│                    Angular SPA (Port 4200)                   │
│  Public │ Patient │ Doctor │ Assistant │ Admin │ SuperAdmin │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS / REST + JWT
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Express.js API (Port 3000)                      │
│  Auth │ RBAC │ Validation │ Rate Limit │ File Upload        │
└──────────────────────────┬──────────────────────────────────┘
                           │ mysql2 (prepared statements)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    MySQL 8.x (doctor_hub)                  │
└─────────────────────────────────────────────────────────────┘
```

## Layers

| Layer | Responsibility |
|-------|----------------|
| **Presentation** | Angular Material UI, reactive forms, role guards, HTTP interceptors |
| **API** | REST controllers, Joi validation, JWT + RBAC middleware |
| **Domain** | Services encapsulating business rules (immutable history, appointment flow) |
| **Data** | MySQL with FK constraints, triggers for immutability, soft deletes |

## Security

- **Authentication**: JWT (access token), bcrypt password hashing
- **Authorization**: Role-based middleware (`patient`, `doctor`, `assistant`, `admin`, `super_admin`)
- **Transport**: CORS whitelist, Helmet headers, rate limiting on `/api/auth`
- **Input**: Joi validators, parameterized SQL (mysql2)
- **Files**: Multer with MIME/size checks, stored outside web root

## Appointment State Machine

```
pending → payment_uploaded → verified → confirmed → completed
                              ↘ cancelled (any stage before completed)
```

## Medical History Immutability

- No `DELETE` on `medical_history` or `prescriptions` (DB triggers + API 403)
- No `UPDATE` on `prescriptions` after insert
- Patients: read-only on prescriptions/history
- Doctors: `INSERT` only for new records

## Deployment Topology (Production)

- Frontend: static build behind Nginx/CDN
- Backend: Node PM2 cluster behind reverse proxy
- Database: MySQL with backups, connection pooling
- Uploads: local volume or S3-compatible storage
