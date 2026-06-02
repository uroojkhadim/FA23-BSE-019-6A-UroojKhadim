# Doctor Hub – Setup Guide

## Environment Variables (Backend)

Copy `backend/.env.example` to `backend/.env`:

| Variable | Description |
|----------|-------------|
| `DB_HOST` | MySQL host (default localhost) |
| `DB_USER` | MySQL user |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | `doctor_hub` |
| `JWT_SECRET` | Long random string for production |
| `CLIENT_URL` | `http://localhost:4200` |

## Database Setup

1. Start MySQL service
2. Run schema:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
3. Run seed data:
   ```bash
   mysql -u root -p < database/seed.sql
   ```
4. Set demo passwords:
   ```bash
   cd backend && npm run seed
   ```

## Running in Development

**Terminal 1 – API:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 – Angular:**
```bash
cd frontend
npm install
npm start
```

## Production Build

```bash
cd frontend && npm run build
cd backend && npm start
```

Serve `frontend/dist/frontend/browser` via Nginx and proxy `/api` to Node.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ECONNREFUSED` MySQL | Check MySQL is running and `.env` credentials |
| CORS errors | Set `CLIENT_URL` to your Angular origin |
| 401 on API | Login again; check JWT_SECRET matches |
| Triggers fail on seed | Run full `schema.sql` before `seed.sql` |

## Appointment Flow Testing

1. Login as **patient** → Search doctors → Book appointment (note doctor ID)
2. Upload payment screenshot on Payments page
3. Login as **assistant** → Verify payment
4. Login as **doctor** → Confirm → Complete appointment
5. Doctor adds prescription → Check patient Prescriptions & History
