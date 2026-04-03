# 📍 Where to Find Each Firebase Credential

## Step-by-Step Screenshot Guide

### 1️⃣ Go to Firebase Console
```
https://console.firebase.google.com/
```

### 2️⃣ Select Your Project
Click on your project name from the list

### 3️⃣ Open Project Settings
- Click the **gear icon ⚙️** (top left, next to "Project Overview")
- Select **"Project settings"**

### 4️⃣ Find Your Credentials

Scroll down to **"Your apps"** section

#### If You Already Have a Web App:
- You'll see your app listed
- Click on it to see the configuration
- Look for the `firebaseConfig` object

#### If You Don't Have a Web App Yet:
1. Click the **web icon `</>`** button
2. App nickname: `Cafeteria Frontend`
3. Check "Also set up Firebase Hosting" (optional)
4. Click **Register app**

---

## 📋 Copy These Values

You'll see something like this in Firebase Console:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxxx",
  authDomain: "cafeteria-management.firebaseapp.com",
  projectId: "cafeteria-management-123",
  storageBucket: "cafeteria-management-123.appspot.com",
  messagingSenderId: "987654321012",
  appId: "1:987654321012:web:xyz123abc"
};
```

---

## 🔢 Map to Your .env File

### 1. VITE_FIREBASE_API_KEY
**Firebase shows:** `apiKey: "AIzaSyDxxxxxxxxxxxxxx"`  
**You copy:** `AIzaSyDxxxxxxxxxxxxxx`  
**Paste in .env:**
```env
VITE_FIREBASE_API_KEY=AIzaSyDxxxxxxxxxxxxxx
```

### 2. VITE_FIREBASE_AUTH_DOMAIN
**Firebase shows:** `authDomain: "cafeteria-management.firebaseapp.com"`  
**You copy:** `cafeteria-management.firebaseapp.com`  
**Paste in .env:**
```env
VITE_FIREBASE_AUTH_DOMAIN=cafeteria-management.firebaseapp.com
```

### 3. VITE_FIREBASE_PROJECT_ID
**Firebase shows:** `projectId: "cafeteria-management-123"`  
**You copy:** `cafeteria-management-123`  
**Paste in .env:**
```env
VITE_FIREBASE_PROJECT_ID=cafeteria-management-123
```

### 4. VITE_FIREBASE_STORAGE_BUCKET
**Firebase shows:** `storageBucket: "cafeteria-management-123.appspot.com"`  
**You copy:** `cafeteria-management-123.appspot.com`  
**Paste in .env:**
```env
VITE_FIREBASE_STORAGE_BUCKET=cafeteria-management-123.appspot.com
```

### 5. VITE_FIREBASE_MESSAGING_SENDER_ID
**Firebase shows:** `messagingSenderId: "987654321012"`  
**You copy:** `987654321012`  
**Paste in .env:**
```env
VITE_FIREBASE_MESSAGING_SENDER_ID=987654321012
```

### 6. VITE_FIREBASE_APP_ID
**Firebase shows:** `appId: "1:987654321012:web:xyz123abc"`  
**You copy:** `1:987654321012:web:xyz123abc`  
**Paste in .env:**
```env
VITE_FIREBASE_APP_ID=1:987654321012:web:xyz123abc
```

---

## ✅ Final .env Example

After copying all values, your `.env` should look like:

```env
# Firebase Configuration for Phone Authentication
VITE_FIREBASE_API_KEY=AIzaSyBvQxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=cafeteria-management.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cafeteria-management-123
VITE_FIREBASE_STORAGE_BUCKET=cafeteria-management-123.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=987654321012
VITE_FIREBASE_APP_ID=1:987654321012:web:xyz123abc

# API URL (optional)
VITE_API_URL=http://localhost:5000/api
```

---

## ⚠️ Common Mistakes to Avoid

❌ **Don't include quotes:**
```env
# WRONG
VITE_FIREBASE_API_KEY="AIzaSy..."
```

✅ **Do use without quotes:**
```env
# CORRECT
VITE_FIREBASE_API_KEY=AIzaSy...
```

❌ **Don't copy the JavaScript variable names:**
```env
# WRONG
VITE_FIREBASE_API_KEY=apiKey: "AIzaSy..."
```

✅ **Do copy only the value:**
```env
# CORRECT
VITE_FIREBASE_API_KEY=AIzaSy...
```

❌ **Don't leave placeholders:**
```env
# WRONG
VITE_FIREBASE_API_KEY=your_api_key_here
```

✅ **Do replace with actual values:**
```env
# CORRECT
VITE_FIREBASE_API_KEY=AIzaSyBvQxxxxxxxxxxxxx
```

---

## 🧪 Verify It's Correct

After updating `.env`, check:

1. ✅ All 6 values are filled in (no `your_...` placeholders)
2. ✅ No quotes around any values
3. ✅ `VITE_` prefix is present on all lines
4. ✅ No extra spaces before or after `=`
5. ✅ `VITE_API_URL` is also set (usually `http://localhost:5000/api`)

---

## 🔄 Next Step After Updating .env

Once you've filled in all credentials:

1. **Save the .env file**
2. **Restart the development server:**
   ```bash
   # Press Ctrl+C to stop current server
   npm run dev
   ```
3. **Test registration** with phone verification!

---

## 🆘 Still Confused?

If you're having trouble finding the credentials:

1. Open Firebase Console: https://console.firebase.google.com/
2. Select your project
3. Click gear icon ⚙️ → Project settings
4. Scroll to "Your apps" section
5. The configuration will be displayed there

**The configuration object contains ALL the values you need!** Just copy each value (not the key names) into your `.env` file.

---

## 📞 Need More Help?

If you see an error after restarting:
- Check browser console (F12) for specific Firebase errors
- Verify all 6 values are correctly copied
- Make sure there are no typos
- Restart the server again after any changes

Good luck! 🎉
