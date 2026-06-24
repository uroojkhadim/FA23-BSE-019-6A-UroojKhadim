# Architecture Documentation

Technical architecture of the HR Management Dashboard.

## System Overview

```
┌─────────────────┐
│   Client        │
│  (React SPA)    │
└────────┬────────┘
         │
         │ HTTPS
         │
┌────────▼────────────────────────┐
│   Firebase Hosting              │
│   (Static Assets)               │
└────────┬────────────────────────┘
         │
         │
┌────────▼────────────────────────┐
│   Firebase Functions            │
│   (Express API)                 │
└────────┬────────────────────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───────┐  ┌──────────┐
│ Auth │  │Firestore │  │ Storage  │
└──────┘  └──────────┘  └──────────┘
```

## Tech Stack

### Frontend

**Core:**
- React 18.2 - UI library
- Vite 5 - Build tool
- React Router 6 - Routing

**UI & Styling:**
- Tailwind CSS 3 - Utility-first CSS
- shadcn/ui - Component library
- Framer Motion - Animations
- Lucide React - Icons

**State Management:**
- React Query (TanStack Query) - Server state
- Context API - Global state
- Local Storage - Preferences

**Data Visualization:**
- Recharts - Charts and graphs

**HTTP Client:**
- Axios - API requests

### Backend

**Core:**
- Node.js 18 - Runtime
- Express 4 - Web framework
- Firebase Admin SDK - Firebase integration

**Deployment:**
- Firebase Functions - Serverless compute

### Database & Services

**Firebase Services:**
- Firestore - NoSQL database
- Authentication - User management
- Storage - File storage
- Hosting - Static site hosting
- Functions - Serverless backend

## Frontend Architecture

### Component Hierarchy

```
App
├── Router
│   ├── AuthProvider
│   │   ├── Login
│   │   ├── ForgotPassword
│   │   └── ProtectedRoute
│   │       └── Layout
│   │           ├── Sidebar
│   │           ├── Navbar
│   │           └── Pages
│   │               ├── Dashboard
│   │               ├── Jobs
│   │               ├── Candidates
│   │               ├── Analytics
│   │               ├── Reports
│   │               └── Settings
│   └── ThemeProvider
└── QueryClientProvider
```

### State Management Strategy

**Server State (React Query):**
- API data caching
- Background refetching
- Optimistic updates
- Error handling

**Client State (Context API):**
- Authentication state
- Theme preferences
- User settings

**Local State (useState):**
- Form inputs
- UI state (modals, dropdowns)
- Temporary data

### Routing Strategy

```
/ → redirect → /dashboard
/login
/forgot-password
/dashboard (protected)
/jobs (protected)
/candidates (protected)
/analytics (protected)
/reports (protected)
/settings (protected)
```

## Backend Architecture

### API Structure

```
backend/
├── src/
│   ├── config/
│   │   └── firebase.js       # Firebase initialization
│   ├── middleware/
│   │   ├── auth.js          # JWT verification
│   │   └── errorHandler.js  # Error handling
│   ├── routes/
│   │   ├── stats.js         # Statistics endpoints
│   │   ├── jobs.js          # Jobs CRUD
│   │   └── candidates.js    # Candidates CRUD
│   └── index.js             # Express app
└── functions/
    └── index.js             # Firebase function export
```

### Request Flow

```
1. Client Request
   ↓
2. CORS Middleware
   ↓
3. Auth Middleware (verify JWT)
   ↓
4. Route Handler
   ↓
5. Firestore Query
   ↓
6. Response / Error Handler
```

### Authentication Flow

```
┌──────────┐
│ Client   │
└────┬─────┘
     │ 1. Login (email/password)
     ▼
┌────────────────┐
│ Firebase Auth  │
└────┬───────────┘
     │ 2. Returns ID Token
     ▼
┌──────────┐
│ Client   │ 3. Store token
└────┬─────┘
     │ 4. API Request + Bearer Token
     ▼
┌───────────────┐
│ API Middleware│ 5. Verify token
└────┬──────────┘
     │ 6. Add user to req.user
     ▼
┌────────────┐
│Route Handler│
└────────────┘
```

## Database Schema

### Firestore Collections

#### jobs
```javascript
{
  id: string (auto),
  title: string,
  department: string,
  description: string,
  requirements: string[],
  status: 'open' | 'closed',
  postedDate: timestamp,
  createdBy: string (uid),
  updatedAt: timestamp
}
```

#### candidates
```javascript
{
  id: string (auto),
  name: string,
  email: string,
  phone: string,
  jobId: string (reference to jobs),
  jobTitle: string,
  status: 'applied' | 'screened' | 'interview' | 'offer' | 'hired' | 'rejected',
  resumeURL: string,
  appliedDate: timestamp,
  hiredDate: timestamp | null,
  createdBy: string (uid),
  updatedAt: timestamp
}
```

#### hrUsers
```javascript
{
  id: string (uid from auth),
  email: string,
  name: string,
  role: 'admin' | 'recruiter',
  createdAt: timestamp
}
```

### Indexes

Required Firestore indexes:
1. candidates: `(status, appliedDate DESC)`
2. candidates: `(jobId, appliedDate DESC)`
3. jobs: `(status, postedDate DESC)`

## Security

### Frontend Security

- Environment variables for config
- No secrets in client code
- XSS prevention (React escaping)
- CSRF protection
- Secure routing (protected routes)

### Backend Security

- JWT token validation
- Firebase Admin SDK verification
- CORS configuration
- Input validation
- Error message sanitization
- Rate limiting (Firebase built-in)

### Firestore Security Rules

```javascript
// Authenticated users only
// Role-based write access (admin/recruiter)
// Read access for authenticated users
// No direct write from client
```

## Performance Optimizations

### Frontend

- **Code Splitting:** Route-based splitting
- **Lazy Loading:** Components loaded on demand
- **Memoization:** React.memo, useMemo, useCallback
- **Bundle Optimization:** Vite tree-shaking
- **Image Optimization:** WebP format, lazy loading
- **Caching:** React Query cache strategy

### Backend

- **Firestore Indexes:** Optimized queries
- **Connection Pooling:** Firebase SDK handles
- **Caching:** Query result caching
- **Pagination:** Limit query results
- **Batch Operations:** Reduce write operations

### Database

- **Denormalization:** candidateCount on jobs
- **Indexed Queries:** All filtered queries indexed
- **Compound Indexes:** Multi-field queries
- **Query Optimization:** Limit results, use cursors

## Scalability

### Horizontal Scaling

- **Firebase Functions:** Auto-scales based on load
- **Firestore:** Scales automatically
- **Hosting:** CDN distribution globally

### Vertical Scaling

- **Function Memory:** Configurable (512MB - 4GB)
- **Function Timeout:** Configurable (60s - 540s)
- **Database Reads/Writes:** Unlimited scaling

## Monitoring & Logging

### Frontend Monitoring

- Error Boundary for React errors
- Console logging (dev only)
- User analytics (optional)

### Backend Monitoring

- Firebase Functions logs
- Error tracking
- Performance metrics
- Custom logging

### Database Monitoring

- Firestore usage metrics
- Read/write operations
- Index usage
- Query performance

## Deployment Pipeline

```
1. Code Changes
   ↓
2. Git Push
   ↓
3. CI/CD (optional)
   ↓
4. Build Frontend
   ↓
5. Deploy Functions
   ↓
6. Deploy Hosting
   ↓
7. Deploy Rules
   ↓
8. Production Live
```

## Disaster Recovery

### Backup Strategy

- Firestore: Daily automated backups
- Code: Git repository
- Config: Environment variables documented

### Recovery Procedure

1. Restore from Firebase backup
2. Redeploy from Git
3. Reconfigure environment variables
4. Verify functionality

## Future Enhancements

### Architecture Improvements

- [ ] Implement caching layer (Redis)
- [ ] Add GraphQL API option
- [ ] Microservices architecture
- [ ] Message queue for async operations
- [ ] Real-time WebSocket connections
- [ ] Enhanced monitoring (Sentry, LogRocket)
- [ ] Load testing and optimization
- [ ] Multi-region deployment

### Feature Additions

- [ ] Mobile app (React Native)
- [ ] Offline-first architecture
- [ ] Advanced search (Algolia)
- [ ] Machine learning integration
- [ ] Video interview platform
- [ ] Calendar integration
- [ ] Email automation
- [ ] Slack/Teams integration

---

This architecture supports:
- ✅ Thousands of concurrent users
- ✅ Millions of database records
- ✅ Global distribution
- ✅ 99.9% uptime
- ✅ Automatic scaling
- ✅ Security best practices
