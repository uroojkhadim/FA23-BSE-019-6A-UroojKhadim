# ⚡ Quick Start: Email Verification Setup

## 🔥 3-Minute Firebase Setup

### Step 1: Enable Email/Password (1 minute)

1. Go to: https://console.firebase.google.com/project/cafeteria-management-main/authentication/providers
2. Click **"Email/Password"**
3. Toggle **Enable** → Click **Save**
4. ✅ Done!

---

### Step 2: Test Registration (1 minute)

1. Open: http://127.0.0.1:5173/register
2. Fill in:
   - Name: `Test User`
   - Email: `your-email@gmail.com`
   - Password: `test123456`
   - Confirm Password: `test123456`
   - Role: Student
3. Click **Register**
4. ✅ See: "Verification email sent!"

---

### Step 3: Verify Email (30 seconds)

1. Open your email inbox
2. Find email from Firebase
3. Click verification link
4. ✅ Email verified!

---

### Step 4: Test Login (30 seconds)

1. Go to: http://127.0.0.1:5173/login
2. Enter same email and password
3. Select role: Student
4. Click **Login**
5. ✅ Success! Redirects to dashboard

---

## 🎯 Complete Flow Diagram

```
REGISTER → EMAIL SENT → VERIFY → LOGIN → DASHBOARD
   ↓          ↓           ↓        ↓         ↓
 Form     Inbox      Click    Check     Success
          Email     Link    Verified   ✅
```

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| No email received | Check spam folder, wait 2 min |
| Can't login after verify | Refresh page, try again |
| Resend not working | Check browser console (F12) |
| Email already exists | Use different email or login |

---

## 📧 Resend Verification Email

If you didn't receive the email:

1. Go to login page
2. Try to login with unverified email
3. You'll see error: "Please verify your email"
4. Click **"Resend Verification Email"** button
5. Check inbox again ✅

---

## ✅ What's Working Now

- ✅ Register with email/password
- ✅ Automatic verification email sent
- ✅ Login blocked until email verified
- ✅ Resend verification email option
- ✅ Clean glassmorphic UI
- ✅ Error handling
- ✅ Success messages
- ✅ Loading states

---

## 🔐 Security Features

- ✅ Email verification required
- ✅ Password minimum 6 characters
- ✅ Duplicate email prevention
- ✅ Auto logout after registration
- ✅ Secure error messages

---

## 📖 Full Documentation

See detailed guide: [EMAIL_VERIFICATION_GUIDE.md](./EMAIL_VERIFICATION_GUIDE.md)

---

**🎉 That's it! Your email verification system is ready!**

Just enable Email/Password in Firebase Console and test it out!
