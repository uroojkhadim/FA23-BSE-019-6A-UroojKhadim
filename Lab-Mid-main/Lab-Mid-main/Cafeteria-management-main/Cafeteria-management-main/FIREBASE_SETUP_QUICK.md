# 🔥 Firebase Setup Guide - Quick Start

## Problem Solved! ✅

The registration page was still using the old WhatsApp API. I've updated it to use **Firebase SMS authentication**.

---

## ⚠️ IMPORTANT: You Need Firebase Credentials

The verification code won't work until you configure Firebase. Follow these steps:

### Step 1: Create Firebase Project (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select existing project
3. Follow the wizard:
   - Enter project name (e.g., "Cafeteria Management")
   - Enable Google Analytics (optional)
   - Click **Create project**

### Step 2: Enable Phone Authentication

1. In Firebase Console, click on **Authentication** in left sidebar
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Click on **Phone** authentication
5. Toggle **Enable** phone authentication
6. Add your domain:
   - For development: `localhost`
   - For production: your domain
7. Click **Save**

### Step 3: Register Web App

1. Go to **Project Overview** (click gear icon ⚙️)
2. Click **Add app** → **Web** (`</>`)
3. Register app with nickname: "Cafeteria Frontend"
4. **Copy the Firebase config object** - you'll need this!

### Step 4: Configure Your Environment File

Open `.env` file in the root directory and replace the placeholder values:

```env
VITE_FIREBASE_API_KEY=AIzaSy... (from Firebase console)
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Step 5: Restart Development Server

After updating `.env`, restart the frontend:

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

---

## 🧪 Testing Registration

Once Firebase is configured:

1. Go to registration page
2. Fill in your details
3. Enter phone number: `+923136576128`
4. Click **"Send SMS Verification Code"**
5. Complete reCAPTCHA (if shown)
6. Check your phone for 6-digit code
7. Enter the code
8. Click **Verify**
9. Complete registration!

---

## 🔍 Troubleshooting

### "Invalid phone number format"
- Use format: `+923XXXXXXXXXX`
- No spaces or dashes
- Country code must be +92

### "reCAPTCHA verification failed"
- Make sure localhost is added to Firebase authorized domains
- Refresh the page and try again
- Clear browser cache

### "Too many requests"
- Wait a few minutes before trying again
- Firebase has rate limits

### Still not receiving code?

Check browser console for errors:
1. Press F12 to open DevTools
2. Go to Console tab
3. Look for Firebase errors

Common issues:
- Firebase credentials not configured correctly
- Phone number format incorrect
- reCAPTCHA not loaded

---

## 📞 Alternative: Use Login Page

While setting up Firebase, you can test with the **phone login page** which also uses Firebase SMS.

---

## 📖 Full Documentation

For complete setup instructions, see:
- [PHONE_AUTH_SETUP.md](./PHONE_AUTH_SETUP.md) - Complete Firebase + Twilio guide
- [QUICK_START.md](./QUICK_START.md) - Quick reference

---

**Need help?** Check the browser console and backend logs for detailed error messages!
