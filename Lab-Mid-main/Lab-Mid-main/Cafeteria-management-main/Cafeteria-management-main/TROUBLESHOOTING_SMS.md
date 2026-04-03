# 🔍 Troubleshooting: Not Receiving SMS Verification Code

## ⚠️ Common Issues & Solutions

### Issue 1: Firebase Phone Auth Not Enabled

**Problem:** Phone Authentication might not be fully enabled in Firebase Console.

**Solution:**
1. Go to https://console.firebase.google.com/
2. Select your project: `cafeteria-management-main`
3. Click **Authentication** in left sidebar
4. Click **Sign-in method** tab
5. Find **Phone** authentication
6. Make sure it shows **"Enabled"** (green checkmark)
7. If not enabled, click it and toggle **Enable**

---

### Issue 2: reCAPTCHA Not Configured

**Problem:** Firebase requires reCAPTCHA for phone authentication.

**Solution:**
1. In Firebase Console → Authentication → Settings
2. Scroll to **reCAPTCHA verification** section
3. Make sure reCAPTCHA is configured
4. Add authorized domains:
   - `localhost` (for development)
   - `127.0.0.1` (for development)
5. Click **Save**

---

### Issue 3: Wrong Phone Number Format

**Problem:** Phone number format must be exact.

**Correct Format:**
- ✅ `+923001234567` (no spaces, no dashes)
- ✅ `923001234567` (without +)

**Wrong Formats:**
- ❌ `03001234567` (missing country code)
- ❌ `+92 300 1234567` (spaces)
- ❌ `+92-300-1234567` (dashes)
- ❌ `3001234567` (incomplete)

---

### Issue 4: Firebase Quota Exceeded

**Problem:** Firebase has free tier limits for phone authentication.

**Free Tier Limits:**
- 10 SMS verifications per day (free quota)
- After that, need to upgrade to paid plan

**Check Usage:**
1. Go to Firebase Console
2. Click **Authentication** → **Users**
3. Check how many users have been created today
4. If you've exceeded the limit, wait until tomorrow or upgrade

**Upgrade (if needed):**
1. Firebase Console → Project Settings
2. Click **Usage and billing**
3. Upgrade to Blaze Plan (pay-as-you-go)
4. First 10K verifications/month are still free!

---

### Issue 5: Carrier Blocking Automated SMS

**Problem:** Some mobile carriers block automated SMS messages.

**Solutions:**
1. Try a different phone number (different carrier)
2. Use a real mobile number (not landline)
3. Check if your carrier supports short codes
4. Try Twilio Voice Call option instead (on login page)

---

### Issue 6: Browser Console Errors

**Check for JavaScript errors:**

1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Look for red error messages when you click "Send SMS"

**Common Errors:**

**Error: `auth/operation-not-allowed`**
- Phone Authentication not enabled in Firebase Console
- **Fix:** Enable Phone Auth (see Issue 1)

**Error: `auth/requires-recent-login`**
- Need to re-authenticate
- **Fix:** Clear browser cache and reload

**Error: `auth/network-request-failed`**
- Internet connection issue
- **Fix:** Check your internet connection

**Error: `auth/invalid-api-key`**
- Firebase credentials wrong in `.env`
- **Fix:** Verify all 6 values in `.env` file

---

### Issue 7: .env File Not Loaded

**Problem:** Vite might not be loading environment variables.

**Check:**
1. Open browser console (F12)
2. Type: `import.meta.env.VITE_FIREBASE_API_KEY`
3. Should show your API key
4. If shows `undefined`, restart the server:
   ```bash
   # Stop current server: Ctrl+C
   npm run dev
   ```

---

## 🧪 Step-by-Step Testing

### Test 1: Verify Firebase Configuration

Open browser console (F12) and run:

```javascript
console.log(import.meta.env)
```

You should see all your Firebase variables:
- ✅ VITE_FIREBASE_API_KEY
- ✅ VITE_FIREBASE_AUTH_DOMAIN
- ✅ VITE_FIREBASE_PROJECT_ID
- ✅ VITE_FIREBASE_STORAGE_BUCKET
- ✅ VITE_FIREBASE_MESSAGING_SENDER_ID
- ✅ VITE_FIREBASE_APP_ID

If any are missing or undefined:
1. Check `.env` file has correct values
2. Restart development server
3. Hard refresh browser (Ctrl+Shift+R)

---

### Test 2: Check Firebase Initialization

Open browser console and run:

```javascript
import { auth } from './src/lib/firebase-config'
console.log('Firebase initialized:', auth.app.name)
```

Should show: `"Firebase initialized: [DEFAULT]"`

If shows error:
- Check Firebase credentials are correct
- Verify Firebase project exists

---

### Test 3: Manual Phone Auth Test

In browser console, try manual Firebase test:

```javascript
// Import Firebase functions (paste in console)
const { getAuth, signInWithPhoneNumber, RecaptchaVerifier } = require('firebase/auth');

// Initialize
const auth = getAuth();
console.log('Auth ready:', !!auth);

// Test phone number format
const phoneNumber = '+923001234567'; // Replace with your actual phone
console.log('Testing with:', phoneNumber);
```

---

## 🔧 Quick Fixes to Try

### Fix 1: Clear Browser Cache

1. Press **Ctrl + Shift + Delete**
2. Select **Cached images and files**
3. Click **Clear data**
4. Refresh page (F5)

### Fix 2: Hard Refresh

Press **Ctrl + Shift + R** (Windows/Linux) or **Cmd + Shift + R** (Mac)

### Fix 3: Restart Everything

```bash
# Stop backend server (if running)
# Press Ctrl+C in backend terminal

# Stop frontend server
# Press Ctrl+C in frontend terminal

# Restart backend
cd backend
npm run dev

# In new terminal, restart frontend
npm run dev
```

### Fix 4: Use Incognito/Private Mode

Open browser incognito/private window:
- Chrome: Ctrl+Shift+N
- Firefox: Ctrl+Shift+P
- Edge: Ctrl+Shift+N

Then go to: http://127.0.0.1:5173/register

---

## 📱 Alternative: Test with Login Page

If registration doesn't work, try the login page which also uses Firebase SMS:

1. Go to: http://127.0.0.1:5173/login
2. Click **Phone** tab
3. Enter phone: `+923001234567`
4. Select **SMS** option
5. Click **SEND OTP VIA SMS**

This uses the same Firebase authentication but with a simpler flow.

---

## 🆘 Still Not Working?

### Check These Final Items:

1. **Firebase Project Active?**
   - Go to Firebase Console
   - Make sure project is not disabled

2. **Phone Numbers Authorized?**
   - Some countries require additional setup
   - Pakistan (+92) should work by default

3. **Test with Different Phone?**
   - Try another person's phone number
   - Different carrier might work

4. **Backend Running?**
   - Check http://localhost:5000/api/health
   - Should show: `{"status": "OK"}`

---

## 🎯 Most Likely Issue

Based on your setup, the most common issue is:

**Phone Authentication not fully enabled in Firebase Console**

**Quick Fix:**
1. Go to: https://console.firebase.google.com/project/cafeteria-management-main/authentication/providers
2. Click **Phone** authentication
3. Make absolutely sure it shows **"Enabled"**
4. Check **reCAPTCHA** is configured
5. Save any changes
6. **Wait 1-2 minutes** for changes to propagate
7. Hard refresh browser (Ctrl+Shift+R)
8. Try again

---

## 📞 Next Steps

If none of these solutions work:

1. **Share the browser console errors** (screenshot or copy-paste)
2. **Check Firebase Console usage** to see if requests are being made
3. **Try Twilio Voice Call** option on login page as alternative

---

## ✅ Success Indicators

When it works correctly, you should see:

1. ✅ Browser console: No red errors
2. ✅ reCAPTCHA badge appears (bottom right of form)
3. ✅ Toast notification: "OTP sent successfully via SMS!"
4. ✅ SMS received within 10-30 seconds
5. ✅ 6-digit code in message

---

**Keep trying! Phone authentication setup can sometimes take a few attempts.** 🎉
