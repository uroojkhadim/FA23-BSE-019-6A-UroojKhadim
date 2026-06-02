# Doctor Hub – Entity Relationship Model

## Core Entities

```
users (1) ──┬── (0..1) patients
            ├── (0..1) doctors
            ├── (0..1) assistants
            ├── (0..1) admins
            └── (0..1) super_admins

doctors (1) ── (*) clinics
clinics (1) ── (*) schedules
doctors (*) ── (*) diseases (doctor_diseases)
doctors (*) ── (*) specializations (doctor_specializations)

patients (1) ── (*) appointments ── (1) doctors
appointments (1) ── (0..1) payments
appointments (1) ── (*) prescriptions (immutable)
appointments (1) ── (*) medical_history (append-only)

users (1) ── (*) messages (sender/receiver)
users (1) ── (*) notifications
patients (1) ── (*) uploaded_reports
```

## Key Relationships

| Parent | Child | Cardinality | Notes |
|--------|-------|-------------|-------|
| users | role profiles | 1:1 | One role per user at registration |
| doctors | clinics | 1:N | Doctor may operate multiple clinics |
| clinics | schedules | 1:N | Weekly availability slots |
| appointments | payments | 1:1 | Screenshot verification by assistant |
| appointments | prescriptions | 1:N | Insert-only, linked to consultation |
| doctors | treatment_types | N:1 | Allopathic / Homeopathic / Herbal |

## Indexes

- `users(email)` UNIQUE
- `doctors(treatment_type_id, city, rating)`
- `appointments(patient_id, status, appointment_date)`
- `messages(sender_id, receiver_id, created_at)`

## Soft Delete

Applied to: `users`, `doctors`, `clinics` via `deleted_at` column.

## Audit

- `activity_logs` for admin monitoring
- `created_at` / `updated_at` on all transactional tables
