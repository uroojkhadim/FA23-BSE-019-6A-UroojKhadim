# Setup Guide

Complete guide to set up and run the HR Management Dashboard locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Firebase CLI** - Install with `npm install -g firebase-tools`
- **Firebase Account** - [Sign up](https://firebase.google.com/)

## Step 1: Clone or Navigate to Project

```bash
cd hr-management-dashboard
```

## Step 2: Firebase Project Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `hr-management-dev`
4. Follow the setup wizard

### Enable Required Services

#### Enable Firestore Database
1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select a location
5. Click "Enable"

#### Enable Authentication
1. Go to **Authentication**
2. Click "Get started"
3. Click on "Email/Password" provider
4. Enable it and save

#### Enable Storage
1. Go to **Storage**
2. Click "Get started"
3. Start in test mode
4. Choose same location as Firestore

### Get Firebase Configuration

1. In Firebase Console, click the gear icon → Project settings
2. Scroll down to "Your apps"
3. Click the web icon (`</>`)
4. Register your app (name: "HR Dashboard")
5. Copy the Firebase config object

## Step 3: Frontend Setup

### Install Dependencies

```bash
cd frontend
npm install
```

### Configure Environment Variables

```bash
cp .env.example .env
```

Edit `frontend/.env` with your Firebase config:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=hr-management-dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hr-management-dev
VITE_FIREBASE_STORAGE_BUCKET=hr-management-dev.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_API_URL=http://localhost:5001/api
```

### Start Frontend Development Server

```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## Step 4: Backend Setup

### Install Dependencies

```bash
cd ../backend
npm install
```

### Get Service Account Key

1. In Firebase Console, go to **Project Settings** → **Service Accounts**
2. Click "Generate new private key"
3. Save the JSON file as `backend/serviceAccountKey.json`
4. **Never commit this file to Git!**

### Configure Environment Variables

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5001
NODE_ENV=development
FIREBASE_PROJECT_ID=hr-management-dev
```

### Initialize Firebase Admin SDK

The backend uses the service account key for authentication. Ensure `serviceAccountKey.json` is in the `backend` directory.

### Start Backend Development Server

```bash
npm run dev
```

Backend API will be available at: `http://localhost:5001`

## Step 5: Deploy Security Rules

### Deploy Firestore Rules

```bash
cd .. # Back to root directory
firebase init firestore
# Select existing project
# Accept default files

firebase deploy --only firestore:rules
```

### Deploy Storage Rules

```bash
firebase deploy --only storage
```

## Step 6: Create Admin User

### Using Firebase Console

1. Go to **Authentication** → **Users**
2. Click "Add user"
3. Email: `admin@hrportal.com`
4. Password: `admin123` (change this!)
5. Click "Add user"

### Add to hrUsers Collection

1. Go to **Firestore Database**
2. Click "Start collection"
3. Collection ID: `hrUsers`
4. Document ID: (copy the UID from Authentication)
5. Add fields:
   ```
   email: "admin@hrportal.com"
   name: "Admin User"
   role: "admin"
   createdAt: [Select timestamp, click "Set to current time"]
   ```

## Step 7: Add Sample Data (Optional)

Use the Firebase Console to add sample jobs and candidates, or use the sample data from `docs/SAMPLE_DATA.md`.

### Quick Sample Job

Firestore → `jobs` collection → Add document:

```
title: "Frontend Developer"
department: "Engineering"
description: "We're hiring a frontend developer"
requirements: ["React", "TypeScript", "3+ years experience"]
status: "open"
postedDate: [timestamp - current time]
```

### Quick Sample Candidate

Firestore → `candidates` collection → Add document:

```
name: "John Doe"
email: "john@example.com"
phone: "+1 555-1234"
jobId: [Copy job document ID from above]
jobTitle: "Frontend Developer"
status: "applied"
resumeURL: ""
appliedDate: [timestamp - current time]
hiredDate: null
```

## Step 8: Test the Application

### Login

1. Open `http://localhost:3000/login`
2. Email: `admin@hrportal.com`
3. Password: `admin123`

### Verify Features

- [ ] Dashboard loads with statistics
- [ ] Jobs page shows sample job
- [ ] Candidates page shows sample candidate
- [ ] Can create new job
- [ ] Can add new candidate
- [ ] Analytics page displays charts
- [ ] Dark mode toggle works
- [ ] Logout works

## Step 9: Development Workflow

### Running Both Servers

Open two terminal windows:

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

### Making Changes

- Frontend code: `frontend/src/`
- Backend code: `backend/src/`
- Hot reload is enabled for both

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
npm run build
```

## Common Issues & Solutions

### Issue: "Firebase app not initialized"
**Solution:** Check that Firebase config in `.env` is correct

### Issue: "CORS error"
**Solution:** Ensure backend CORS is enabled and API_URL is correct

### Issue: "Authentication failed"
**Solution:** 
1. Verify user exists in Firebase Auth
2. Check user is in `hrUsers` collection
3. Verify email/password are correct

### Issue: "Cannot connect to backend"
**Solution:**
1. Ensure backend server is running on port 5001
2. Check `VITE_API_URL` in frontend `.env`
3. Verify firewall isn't blocking the port

### Issue: "Firestore permission denied"
**Solution:**
1. Deploy Firestore rules: `firebase deploy --only firestore:rules`
2. Ensure user is authenticated
3. Check `hrUsers` collection has user with correct role

## Project Structure

```
hr-management-dashboard/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   ├── lib/            # Utilities
│   │   └── config/         # Configuration
│   └── public/
├── backend/                 # Express backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   └── config/         # Configuration
│   └── functions/          # Firebase functions
├── docs/                   # Documentation
├── firebase.json           # Firebase config
├── firestore.rules        # Firestore security rules
└── storage.rules          # Storage security rules
```

## Next Steps

1. **Customize**: Modify colors, branding, and features
2. **Add Features**: Implement additional HR modules
3. **Deploy**: Follow `DEPLOYMENT_GUIDE.md` to deploy to production
4. **Secure**: Change default passwords and strengthen security rules

## Development Tips

### Hot Reload
Both frontend and backend support hot reload. Changes are reflected immediately.

### Debugging
- Frontend: Use React DevTools browser extension
- Backend: Use console.log or debugging tools
- Firestore: Monitor in Firebase Console

### Testing
- Test authentication flows
- Verify CRUD operations
- Check responsive design on mobile
- Test dark mode

## Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Express Documentation](https://expressjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## Need Help?

If you encounter issues:

1. Check the error message in browser console
2. Check backend terminal logs
3. Review Firebase Console logs
4. Verify environment variables
5. Ensure all dependencies are installed

---

**Happy Coding! 🚀**
