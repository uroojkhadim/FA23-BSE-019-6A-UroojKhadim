# Doctor Hub - Healthcare Consultation Platform (MERN + Firebase)

A complete healthcare consultation and patient history management platform built with React, Firebase, Tailwind CSS, and Vite.

## Features

- Multi-role authentication (Patient, Doctor, Assistant, Admin, Super Admin)
- Doctor search and filtering
- Appointment booking and management
- Payment verification system
- Immutable medical history and prescriptions
- Real-time messaging
- Analytics dashboard
- Responsive UI

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router
- **Backend & Database**: Firebase (Auth, Firestore, Storage, Hosting)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

1. Node.js 20+
2. Firebase account
3. Firebase CLI (`npm install -g firebase-tools`)

### Setup

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com) and create a new project
   - Enable **Email/Password authentication** (Firebase Auth → Sign-in method)
   - Enable **Firestore Database** (Create database in Test Mode first)
   - Enable **Firebase Storage** (Start in Test Mode first)
   - Register a web app (Firebase Console → Project Settings → Add App → Web App)
   - Copy your Firebase config object

2. **Update Firebase Configuration**:
   - Open `src/lib/firebase.js`
   - Replace the `firebaseConfig` object with your Firebase project credentials

3. **Update Project ID**:
   - Open `.firebaserc`
   - Replace `"your-firebase-project-id"` with your actual Firebase project ID

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Run locally**:
   ```bash
   npm run dev
   ```

6. **Build for Production**:
   ```bash
   npm run build
   ```

7. **Login to Firebase**:
   ```bash
   firebase login
   ```

8. **Deploy to Firebase**:
   ```bash
   firebase deploy
   ```

## Project Structure

```
doctor-hub-mern/
├── src/
│   ├── components/
│   │   ├── patient/
│   │   ├── doctor/
│   │   ├── assistant/
│   │   ├── admin/
│   │   └── superadmin/
│   ├── contexts/
│   ├── lib/
│   ├── pages/
│   └── index.css
├── firebase.json
├── firestore.rules
└── storage.rules
```

## License

Academic project
