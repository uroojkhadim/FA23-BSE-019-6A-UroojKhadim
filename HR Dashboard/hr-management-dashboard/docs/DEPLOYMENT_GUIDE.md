# Deployment Guide

Complete guide to deploy your HR Management Dashboard to production.

## Prerequisites

- Node.js 18 or higher
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created
- Git repository (optional but recommended)

## 1. Firebase Project Setup

### Create Firebase Project
```bash
# Login to Firebase
firebase login

# Create new project (or use existing)
firebase projects:create hr-management-prod

# Select project
firebase use hr-management-prod
```

### Initialize Firebase
```bash
cd hr-management-dashboard
firebase init

# Select:
# - Firestore
# - Functions
# - Hosting
# - Storage
```

## 2. Configure Environment Variables

### Frontend (.env)
```bash
cd frontend
cp .env.example .env
```

Edit `.env` with your Firebase config:
```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_API_URL=https://us-central1-your-project.cloudfunctions.net/api
```

### Backend (.env)
```bash
cd ../backend
cp .env.example .env
```

## 3. Install Dependencies

### Frontend
```bash
cd frontend
npm install
```

### Backend
```bash
cd ../backend
npm install
```

## 4. Build Frontend

```bash
cd frontend
npm run build
```

This creates an optimized production build in `frontend/dist`

## 5. Deploy to Firebase

### Deploy Everything
```bash
# From root directory
firebase deploy
```

### Deploy Specific Services

```bash
# Deploy only hosting (frontend)
firebase deploy --only hosting

# Deploy only functions (backend)
firebase deploy --only functions

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy only Storage rules
firebase deploy --only storage
```

## 6. Set up Authentication

### Enable Email/Password Authentication
1. Go to Firebase Console
2. Navigate to Authentication → Sign-in method
3. Enable "Email/Password"

### Create Admin User
```bash
# Using Firebase Console
# Authentication → Users → Add user

# Or using Firebase CLI
firebase auth:import users.json
```

Create `users.json`:
```json
{
  "users": [
    {
      "email": "admin@hrportal.com",
      "emailVerified": true,
      "password": "your-secure-password",
      "displayName": "Admin User",
      "disabled": false
    }
  ]
}
```

### Add to hrUsers Collection
After creating auth user, add to Firestore:
```javascript
{
  uid: "firebase-auth-uid",
  email: "admin@hrportal.com",
  name: "Admin User",
  role: "admin",
  createdAt: Timestamp.now()
}
```

## 7. Configure Firestore Security Rules

The `firestore.rules` file is automatically deployed. Verify it's active:

```bash
firebase deploy --only firestore:rules
```

## 8. Set Up Storage

### Create Storage Buckets
```bash
# Buckets are created automatically
# Verify in Firebase Console → Storage
```

### Deploy Storage Rules
```bash
firebase deploy --only storage
```

## 9. Seed Sample Data (Optional)

Use the sample data from `docs/SAMPLE_DATA.md` to populate your database.

## 10. Test Deployment

### Test Frontend
```
https://your-project.web.app
```

### Test Backend API
```bash
curl https://us-central1-your-project.cloudfunctions.net/api/health
```

### Test with Authentication
```bash
# Get auth token from Firebase
# Then test protected endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://us-central1-your-project.cloudfunctions.net/api/stats
```

## 11. Custom Domain (Optional)

### Add Custom Domain
```bash
firebase hosting:channel:deploy production
```

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow DNS setup instructions
4. Wait for SSL certificate provisioning (24-48 hours)

## 12. Monitoring & Logging

### View Function Logs
```bash
firebase functions:log
```

### View Hosting Analytics
Go to Firebase Console → Hosting → Usage

### Set Up Alerts
Go to Firebase Console → Alerts

Recommended alerts:
- Function execution errors
- High latency
- Authentication failures

## 13. CI/CD Setup (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Frontend Dependencies
        working-directory: ./frontend
        run: npm ci
      
      - name: Build Frontend
        working-directory: ./frontend
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
          VITE_API_URL: ${{ secrets.API_URL }}
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

## 14. Production Checklist

- [ ] Environment variables configured
- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore indexes created
- [ ] Security rules deployed
- [ ] Storage rules deployed
- [ ] Admin user created
- [ ] Sample data imported
- [ ] Frontend built and deployed
- [ ] Backend functions deployed
- [ ] Custom domain configured (if applicable)
- [ ] Monitoring and alerts set up
- [ ] SSL certificate active
- [ ] API endpoints tested
- [ ] Authentication flow tested
- [ ] Error tracking configured

## 15. Rollback Procedure

```bash
# View deployment history
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL DESTINATION_SITE_ID:live

# Rollback functions
firebase functions:delete functionName
firebase deploy --only functions

# Rollback hosting
firebase hosting:channel:deploy CHANNEL_ID
```

## Troubleshooting

### Functions Not Deploying
```bash
# Check Node version
node --version  # Should be 18

# Clear node modules and reinstall
cd backend
rm -rf node_modules
npm install
```

### CORS Issues
Ensure functions include CORS:
```javascript
import cors from 'cors';
app.use(cors({ origin: true }));
```

### Authentication Errors
- Verify Firebase config in frontend
- Check API URL is correct
- Ensure auth token is being sent

### Build Errors
```bash
cd frontend
rm -rf node_modules dist
npm install
npm run build
```

## Support

For issues:
1. Check Firebase Console → Functions → Logs
2. Review Firestore rules
3. Verify environment variables
4. Check Firebase status page

---

**Your HR Management Dashboard is now live! 🚀**
