# ⚡ 5-Minute Firebase Setup

## Quick Steps (Copy-Paste Ready)

### 1️⃣ Enable Phone Auth (2 min)

```
1. Go to: https://console.firebase.google.com/
2. Select your project
3. Click "Authentication" → "Sign-in method"
4. Click "Phone" → Toggle "Enable" → Save
```

### 2️⃣ Get Credentials (1 min)

```
1. Click gear icon ⚙️ → Project settings
2. Scroll to "Your apps"
3. Click "</>" (Web app)
4. Copy the firebaseConfig object
```

### 3️⃣ Update .env File (1 min)

Open `.env` and paste your credentials:

```env
VITE_FIREBASE_API_KEY=AIzaSy... (paste from Firebase)
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 4️⃣ Restart Server (30 sec)

```bash
# Press Ctrl+C to stop server
npm run dev
```

---

## ✅ Test It!

1. Go to: http://127.0.0.1:5173/register
2. Enter phone: `+923001234567`
3. Click **"Send SMS Verification Code"**
4. Check phone for code
5. Enter and verify!

---

## 🆘 Common Issues

| Problem | Solution |
|---------|----------|
| No SMS received | Check phone format: +92XXXXXXXXXX |
| reCAPTCHA error | Refresh page, clear cache |
| Invalid API key | Verify .env values are correct |
| Domain not authorized | Add localhost in Firebase Console |

---

## 📖 Need More Help?

See detailed guide: [FIREBASE_COMPLETE_SETUP.md](./FIREBASE_COMPLETE_SETUP.md)
