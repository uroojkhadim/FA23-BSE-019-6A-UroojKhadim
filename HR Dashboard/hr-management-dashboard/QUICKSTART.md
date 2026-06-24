# 🚀 Quick Start Guide

Get your HR Management Dashboard up and running in 10 minutes!

## Prerequisites

- Node.js 18+ installed
- Firebase account (free tier works!)
- Terminal/Command prompt

## Step 1: Firebase Setup (3 minutes)

1. **Go to** [Firebase Console](https://console.firebase.google.com/)
2. **Click** "Add project" → Name it → Create
3. **Enable Firestore:** Firestore Database → Create database → Start in test mode
4. **Enable Auth:** Authentication → Get started → Email/Password → Enable
5. **Get Config:** Project Settings → Add web app → Copy config

## Step 2: Install Dependencies (2 minutes)

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

## Step 3: Configure Environment (2 minutes)

### Frontend `.env`

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env` with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5001/api
```

### Backend Service Account

1. Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Save as `backend/serviceAccountKey.json`

## Step 4: Create Admin User (1 minute)

1. Firebase Console → Authentication → Add user
2. Email: `admin@hrportal.com`, Password: `admin123`
3. Copy the UID
4. Firestore → Create collection `hrUsers` → Add document:
   - Document ID: [paste UID]
   - Fields:
     ```
     email: "admin@hrportal.com"
     name: "Admin User"
     role: "admin"
     createdAt: [timestamp - current time]
     ```

## Step 5: Run the App (1 minute)

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

## Step 6: Login & Enjoy! (1 minute)

1. Open http://localhost:3000/login
2. Email: `admin@hrportal.com`
3. Password: `admin123`
4. Explore the dashboard! 🎉

## What's Next?

- ✅ Add sample jobs and candidates
- ✅ Customize colors and branding
- ✅ Deploy to production (see DEPLOYMENT_GUIDE.md)
- ✅ Add your team members

## Need Help?

- 📖 Full setup guide: `docs/SETUP_GUIDE.md`
- 🔧 API docs: `docs/API_DOCUMENTATION.md`
- 🚀 Deploy guide: `docs/DEPLOYMENT_GUIDE.md`
- 📊 Features list: `docs/FEATURES.md`

## Common Issues

**Can't login?** → Verify user exists in both Authentication AND hrUsers collection

**CORS error?** → Check VITE_API_URL is `http://localhost:5001/api`

**Build error?** → Delete `node_modules` and run `npm install` again

---

**Congratulations! Your HR Dashboard is ready! 🎊**
