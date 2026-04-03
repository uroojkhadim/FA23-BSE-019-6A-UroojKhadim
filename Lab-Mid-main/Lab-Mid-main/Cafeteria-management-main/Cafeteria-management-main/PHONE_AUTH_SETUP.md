# Phone Authentication Setup Guide

This guide will help you set up Firebase SMS authentication and Twilio voice call OTP for your cafeteria management system.

## Table of Contents

1. [Firebase Setup](#firebase-setup)
2. [Twilio Setup](#twilio-setup)
3. [Environment Configuration](#environment-configuration)
4. [Installation](#installation)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

### Step 2: Enable Phone Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Phone** authentication
3. Toggle **Enable** phone authentication
4. Configure reCAPTCHA:
   - Add your domain (localhost for development)
   - Complete the reCAPTCHA setup

### Step 3: Get Firebase Credentials

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click on **Web** (`</>` icon)
4. Register your app with a nickname
5. Copy the Firebase configuration object

### Step 4: Configure Frontend Environment

Create or update `src/.env` file in the frontend directory:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

**Important:** Replace the placeholder values with your actual Firebase credentials.

---

## Twilio Setup

### Step 1: Create Twilio Account

1. Go to [Twilio Console](https://www.twilio.com/console)
2. Sign up for a new account or log in
3. Verify your email address

### Step 2: Get Twilio Credentials

1. From the Twilio Console Dashboard, copy:
   - **Account SID**
   - **Auth Token** (click "Show" to reveal)

### Step 3: Purchase a Twilio Phone Number

1. Go to **Phone Numbers** → **Buy a Number**
2. Choose a number with Voice capabilities
3. Purchase the number

### Step 4: Configure Twilio for Voice Calls

1. Go to **Phone Numbers** → **Manage** → **Active Numbers**
2. Click on your purchased number
3. Under **Voice & Fax** configuration:
   - Set "A Call Comes In" to **Webhook**
   - URL: `https://demo.twilio.com/welcome/voice` (for testing)
4. Save configuration

### Step 5: Configure Backend Environment

Update `backend/.env` file:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

**Important:** 
- Replace with your actual Twilio credentials
- Use E.164 format for phone number (e.g., +1234567890)

---

## Environment Configuration

### Frontend (.env)

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Backend (backend/.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cafeteria-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development

# Twilio Configuration (Required for Call OTP)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

---

## Installation

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- `twilio` - For voice call OTP
- All other required dependencies

### 2. Install Frontend Dependencies

```bash
cd ../
npm install
```

Firebase should already be installed from the existing dependencies.

### 3. Start Development Servers

**Backend:**
```bash
cd backend
npm run dev
```

Server will start on `http://localhost:5000`

**Frontend:**
```bash
npm run dev
```

App will start on `http://localhost:5173`

---

## Testing

### Test SMS OTP (Firebase)

1. Navigate to the phone login page
2. Enter a phone number in format: `+923XXXXXXXXXX`
3. Select **SMS** option
4. Click "SEND OTP VIA SMS"
5. Complete reCAPTCHA verification (if prompted)
6. Check your phone for SMS with 6-digit code
7. Enter the OTP code
8. Click "VERIFY NOW"

### Test Voice Call OTP (Twilio)

1. Navigate to the phone login page
2. Enter a phone number in format: `+923XXXXXXXXXX`
3. Select **Voice Call** option
4. Click "SEND OTP VIA CALL"
5. Answer the incoming call
6. Listen to the automated voice reading the 6-digit code
7. Enter the OTP code
8. Click "VERIFY NOW"

### Test Resend OTP

1. After requesting OTP, wait for 30 seconds
2. Click "RESEND OTP" button
3. Receive new code via selected method

---

## API Endpoints

### Send Call OTP
```
POST /api/phone-auth/send-call-otp
Content-Type: application/json

{
  "phoneNumber": "+923001234567"
}
```

### Verify OTP (works for both SMS and Call)
```
POST /api/phone-auth/verify-otp
Content-Type: application/json

{
  "phoneNumber": "+923001234567",
  "otp": "123456"
}
```

### Resend OTP
```
POST /api/phone-auth/resend-otp
Content-Type: application/json

{
  "phoneNumber": "+923001234567",
  "method": "call"
}
```

---

## Troubleshooting

### Firebase Issues

**Problem: "reCAPTCHA verification failed"**
- Solution: Ensure reCAPTCHA is properly configured in Firebase Console
- Add localhost:5173 to authorized domains
- Clear browser cache and reload

**Problem: "Invalid phone number format"**
- Solution: Use E.164 format: `+923XXXXXXXXXX`
- Remove spaces, dashes, or parentheses
- Ensure country code is correct

**Problem: "Too many requests"**
- Solution: Wait a few minutes before trying again
- Firebase has rate limits for phone authentication

### Twilio Issues

**Problem: "Twilio configuration error"**
- Solution: Check that all three Twilio environment variables are set correctly
- Verify Account SID and Auth Token from Twilio Console
- Restart the backend server after changing .env

**Problem: "Unable to call this number"**
- Solution: Verify your Twilio number has voice capabilities enabled
- Check if the destination number can receive international calls
- Try using a different phone number

**Problem: Call not received**
- Solution: Check Twilio Console for call logs
- Verify phone number format is correct
- Ensure sufficient Twilio account balance

### General Issues

**Problem: OTP expires too quickly**
- Solution: OTP validity is 5 minutes by default
- Request a new OTP if expired
- Check system time synchronization

**Problem: Rate limit exceeded**
- Solution: Maximum 3 OTP requests per hour per phone number
- Wait 1 hour before trying again
- Use a different phone number for testing

---

## Security Best Practices

1. **Never commit .env files** to version control
2. **Use strong JWT secrets** (minimum 32 characters)
3. **Enable production mode** when deploying
4. **Monitor API usage** to detect abuse
5. **Implement additional rate limiting** if needed
6. **Use HTTPS** in production
7. **Regularly rotate API keys** and credentials

---

## Production Deployment

### Firebase Production Setup

1. Add your production domain to Firebase authorized domains
2. Update reCAPTCHA settings for production
3. Consider upgrading Firebase plan for higher quotas

### Twilio Production Setup

1. Upgrade Twilio account from trial to paid
2. Purchase a production phone number
3. Configure caller ID properly
4. Set up proper webhook URLs for production

### Environment Variables

Ensure all environment variables are set in your production environment:
- Use environment variable management tools
- Never hardcode credentials
- Use secrets management services (AWS Secrets Manager, etc.)

---

## Support

For issues or questions:
- Check Firebase documentation: https://firebase.google.com/docs/auth
- Check Twilio documentation: https://www.twilio.com/docs/voice
- Review backend logs for detailed error messages
- Contact support team for assistance

---

## Quick Reference

### Valid Phone Number Formats
- ✅ `+923001234567`
- ✅ `923001234567`
- ✅ `03001234567`

### Invalid Phone Number Formats
- ❌ `+92 300 1234567` (spaces)
- ❌ `0300-1234567` (dash)
- ❌ `3001234567` (missing country code)

### Default Configuration
- OTP Length: 6 digits
- OTP Expiry: 5 minutes
- Resend Cooldown: 30 seconds
- Max Attempts: 5 per OTP
- Rate Limit: 3 requests per hour

---

**Last Updated:** April 2026  
**Version:** 1.0.0
