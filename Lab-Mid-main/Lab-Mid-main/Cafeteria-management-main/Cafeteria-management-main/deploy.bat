# ⚡ Quick Deploy Script

Automated deployment script for Firebase Hosting.

## 🚀 One-Command Deploy

```bash
npm run build && firebase deploy --only hosting
```

## 📝 Manual Steps

### **Step 1: Build**
```bash
npm run build
```

### **Step 2: Deploy**
```bash
firebase deploy --only hosting
```

## 🔧 Troubleshooting

### If build fails:
```bash
npm install
npm run build
```

### If deploy fails:
```bash
firebase login
firebase deploy --only hosting
```

### Force deploy:
```bash
firebase deploy --only hosting --force
```

## 🎯 What This Does

1. ✅ Builds production bundle (Vite)
2. ✅ Outputs to `build/` directory
3. ✅ Deploys to Firebase Hosting
4. ✅ Updates live website
5. ✅ Invalidates CDN cache

## 📊 Expected Output

**Build:**
```
✓ built in ~20s
build/index.html
build/assets/*.js
build/assets/*.css
```

**Deploy:**
```
=== Deploying to 'cafeteria-management-main'...
+  Deploy complete!
Hosting URL: https://cafeteria-management-main.web.app
```

## 🔐 Requirements

- Firebase CLI installed (`npm install -g firebase-tools`)
- Logged in to Firebase (`firebase login`)
- Project configured (`.firebaserc` exists)

## 💡 Tips

- Always test locally first: `npm run dev`
- Clear browser cache after deploy
- Check Firebase Console for deployment history
- Use hard refresh: `Ctrl + Shift + R`
