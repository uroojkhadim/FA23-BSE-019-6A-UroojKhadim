# 🎯 HR Management Dashboard

### Enterprise-Level Recruitment Management System

A **production-ready, full-stack** HR Management Dashboard with premium UI/UX, built with React, Firebase, and Node.js. Perfect for final year projects, portfolios, and real-world recruitment management.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![Firebase](https://img.shields.io/badge/Firebase-10.7-orange)
![Node](https://img.shields.io/badge/Node-18+-green)

---

## ✨ Key Features at a Glance

| Feature | Description |
|---------|-------------|
| 🎨 **Premium UI** | Modern SaaS-style interface with glassmorphism effects |
| 📊 **Rich Analytics** | Interactive charts and real-time statistics |
| 🔐 **Secure Auth** | Firebase Authentication with role-based access |
| 📱 **Responsive** | Fully responsive on mobile, tablet, and desktop |
| 🌙 **Dark Mode** | Complete dark theme support |
| ⚡ **Real-time** | Live data updates with Firestore |
| 🚀 **Deploy Ready** | One-command Firebase deployment |
| 📄 **Export Data** | CSV export functionality |

---

## � Screenshots

### Dashboard
- Real-time statistics with animated counters
- Interactive charts (Bar, Line, Pie, Funnel)
- Recent candidates overview
- Quick action buttons

### Jobs Management
- Grid view with job cards
- Create/Edit/Delete operations
- Open/Close job status
- Candidate count per job

### Candidates Management
- Comprehensive data table
- Status workflow management
- Advanced search and filtering
- Candidate profile modals
- CSV export

### Analytics
- KPI dashboard
- Multi-dimensional charts
- Performance metrics
- Diversity insights

---

## �🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite 5** - Lightning-fast build tool
- **Tailwind CSS 3** - Utility-first styling
- **shadcn/ui** - Premium component library
- **Recharts** - Data visualization
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **React Query** - Server state management
- **Axios** - HTTP client
- **React Router 6** - Client-side routing

### Backend
- **Node.js 18** - JavaScript runtime
- **Express 4** - Web framework
- **Firebase Functions** - Serverless compute
- **Firebase Firestore** - NoSQL database
- **Firebase Auth** - User authentication
- **Firebase Storage** - File storage
- **Firebase Hosting** - Static hosting

## 🎨 Design System

**Color Palette:**
- Primary: `#2563EB` (Professional Blue)
- Secondary: `#0F172A` (Dark Navy)
- Accent: `#14B8A6` (Teal)
- Success: `#22C55E` • Warning: `#F59E0B` • Danger: `#EF4444`

**Visual Features:**
- ✨ Glassmorphism effects
- 🎭 Smooth Framer Motion animations
- 🌙 Complete dark mode
- 📐 16px border radius
- 🎯 Elegant shadows
- 🌊 Gradient buttons
- 💫 Animated counters

## 📦 Project Structure

```
hr-management-dashboard/
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities
│   │   ├── services/       # API services
│   │   └── config/         # Configuration
│   └── public/
├── backend/                 # Express backend
│   ├── functions/          # Firebase functions
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Data models
│   │   └── routes/         # API routes
│   └── config/
└── docs/                   # Documentation
```

## � Quick Start (10 Minutes)

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- Firebase account ([Sign up free](https://firebase.google.com/))
- Firebase CLI: `npm install -g firebase-tools`

### 1. Clone Repository
```bash
cd hr-management-dashboard
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Add your Firebase config to .env
npm run dev
```

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Add your Firebase config to .env
npm run dev
```

### 4. Firebase Setup
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init

# Deploy functions
firebase deploy --only functions

# Deploy hosting
firebase deploy --only hosting
```

## 🔥 Firebase Configuration

### Collections Structure

#### `jobs`
```javascript
{
  id: string,
  title: string,
  department: string,
  status: 'open' | 'closed',
  postedDate: timestamp,
  description: string,
  requirements: string[]
}
```

#### `candidates`
```javascript
{
  id: string,
  name: string,
  email: string,
  phone: string,
  resumeURL: string,
  jobId: string,
  status: 'applied' | 'screened' | 'interview' | 'offer' | 'hired' | 'rejected',
  appliedDate: timestamp,
  hiredDate: timestamp | null
}
```

#### `hrUsers`
```javascript
{
  uid: string,
  email: string,
  role: 'admin' | 'recruiter',
  name: string,
  createdAt: timestamp
}
```

## 🌐 API Endpoints

### Statistics
- `GET /api/stats` - Dashboard statistics

### Jobs
- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Candidates
- `GET /api/candidates` - List candidates (with filters)
- `GET /api/candidates/:id` - Get candidate details
- `POST /api/candidates` - Add candidate
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Delete candidate

## 🎯 Features

### Dashboard
- ✅ Real-time statistics
- ✅ Interactive charts
- ✅ Recent candidates table
- ✅ Quick actions

### Jobs Management
- ✅ Create/Edit/Delete jobs
- ✅ Open/Close positions
- ✅ Department assignment
- ✅ Candidate tracking per job

### Candidate Management
- ✅ Full CRUD operations
- ✅ Status workflow management
- ✅ Resume upload
- ✅ Advanced filtering
- ✅ CSV export
- ✅ Profile modal

### Authentication
- ✅ Email/Password login
- ✅ Forgot password
- ✅ Protected routes
- ✅ Role-based access

### UI/UX
- ✅ Dark mode
- ✅ Responsive design
- ✅ Loading states
- ✅ Error boundaries
- ✅ Toast notifications
- ✅ Smooth animations

## 🚀 Deployment

### Frontend (Firebase Hosting)
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

### Backend (Firebase Functions)
```bash
cd backend
npm run deploy
```

## 📱 Screenshots

(Add screenshots here after deployment)

## 👨‍💻 Development

### Run Development Servers
```bash
# Frontend
cd frontend && npm run dev

# Backend
cd backend && npm run dev
```

### Build for Production
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm run build
```

## 🔐 Environment Variables

### Frontend `.env`
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5001/your-project/us-central1/api
```

### Backend `.env`
```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
```

## 📄 License

MIT License - Feel free to use for your portfolio and projects

## 🤝 Contributing

Contributions welcome! Please follow standard PR process.

## 📞 Support

For issues or questions, please open a GitHub issue.

---

Built with ❤️ for enterprise HR management
