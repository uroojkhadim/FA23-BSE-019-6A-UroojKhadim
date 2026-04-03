# 🖥️ Build Windows .exe File - Complete Guide

## ✅ What's Being Set Up

Converting your React web app into a standalone Windows desktop application using **Electron**.

---

## 📦 Installation (In Progress)

The following packages are being installed:

```bash
npm install --save-dev electron electron-builder concurrently wait-on cross-env
```

### Packages Installed:

- **electron** - Framework to build desktop apps
- **electron-builder** - Tool to package and distribute apps
- **concurrently** - Run multiple commands at once
- **wait-on** - Wait for files/services to be ready
- **cross-env** - Set environment variables across platforms

---

## 🔧 Configuration Files Created

### 1. Electron Main Process (`electron/main.js`)

This file controls the Electron application:
- Creates the browser window
- Sets up application menu
- Handles app lifecycle events
- Configures window size and behavior

**Window Settings:**
- Default size: 1400x900px
- Minimum size: 800x600px
- Secure settings enabled
- Custom app icon support

---

## ⚙️ Setup Instructions

### Step 1: Update package.json

After installation completes, add these scripts to `package.json`:

```json
{
  "main": "electron/main.js",
  "scripts": {
    "electron:dev": "concurrently \"cross-env BROWSER=none npm run dev\" \"wait-on http://localhost:5173 && electron .\"",
    "electron:build": "npm run build && electron-builder",
    "electron:build:win": "npm run build && electron-builder --win",
    "electron:start": "electron ."
  },
  "build": {
    "appId": "com.cafeteria.management",
    "productName": "Cafeteria Management System",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "electron/**/*",
      "package.json"
    ],
    "win": {
      "target": [
        "nsis"
      ],
      "icon": "public/icon.png"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  }
}
```

---

## 🚀 Usage Commands

### Development Mode (Test Before Building)

```bash
# Run app in development with hot reload
npm run electron:dev
```

This will:
1. Start your Vite dev server
2. Wait for it to be ready
3. Launch Electron window
4. Hot reload works as you code

### Build .exe File

```bash
# Build for Windows
npm run electron:build:win
```

This will:
1. Build your React app (`vite build`)
2. Package everything with Electron
3. Create `.exe` installer in `release/` folder

### Output Location

After building, find your files in:
```
release/
└── Cafeteria Management System Setup 1.0.0.exe
```

---

## 📋 Build Options

### Single Executable (Recommended)

Creates a standard Windows installer:

```bash
npm run electron:build:win
```

Result: `Cafeteria Management System Setup 1.0.0.exe`

### Portable Version

Creates a portable .exe (no installation needed):

Update `package.json`:
```json
"win": {
  "target": ["portable"]
}
```

Then build:
```bash
npm run electron:build:win
```

Result: `Cafeteria Management System 1.0.0.exe` (portable)

### Both Versions

Build both installer and portable:

```bash
npm run electron:build:win -- --win portable
```

---

## 🎨 Customization

### App Icon

1. Create a 256x256 PNG icon
2. Save as `public/icon.png`
3. Rebuild

### Window Title

Edit `electron/main.js`:
```javascript
mainWindow = new BrowserWindow({
  title: 'My Custom Title',
  // ... other settings
});
```

### Window Size

Edit `electron/main.js`:
```javascript
mainWindow = new BrowserWindow({
  width: 1600,  // Change width
  height: 1000, // Change height
  // ... other settings
});
```

---

## 🔐 Security Considerations

Your app is configured securely:

```javascript
webPreferences: {
  nodeIntegration: false,     // No Node.js in renderer
  contextIsolation: true,     // Isolate contexts
  enableRemoteModule: false,  // Disable remote module
}
```

**Important:** Keep these settings for security!

---

## 📊 File Structure After Setup

```
cafeteria-management-main/
├── electron/
│   └── main.js           # Electron main process
├── dist/                  # Built React app (after build)
├── release/               # Built .exe files (after build)
├── public/
│   └── icon.png          # App icon (optional)
├── src/                   # Your React source
├── package.json          # Updated with Electron config
└── BUILD_EXE_GUIDE.md    # This file
```

---

## 🛠️ Troubleshooting

### Issue 1: Installation Fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue 2: Build Fails

**Common Causes:**
- Missing dependencies
- Incorrect paths
- Build directory doesn't exist

**Solution:**
```bash
# Make sure app builds first
npm run build

# Check dist/ folder exists
# Should contain index.html, assets, etc.

# Then try Electron build
npm run electron:build:win
```

### Issue 3: App Opens But Shows Blank Screen

**Causes:**
- Wrong path to built files
- Vite base path issue

**Solution:**
Check `electron/main.js`:
```javascript
const startUrl = process.env.ELECTRON_START_URL || 
  `file://${path.join(__dirname, '../dist/index.html')}`;
```

Make sure `dist/` folder exists and has `index.html`.

### Issue 4: CORS Errors

If your app makes API calls:

**Solution:** Add to `electron/main.js`:
```javascript
app.on('ready', () => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Access-Control-Allow-Origin': ['*']
      }
    });
  });
});
```

---

## 📦 Distribution

### Share Your .exe

After building, share:
```
release/Cafeteria Management System Setup 1.0.0.exe
```

Users can:
1. Double-click to install
2. App appears in Start Menu
3. Desktop shortcut created
4. Runs like any native app

### System Requirements

Your app requires:
- Windows 7 or later
- 200MB disk space
- No additional dependencies needed!

### Code Signing (Optional)

For professional distribution, consider code signing:
- Removes "Unknown Publisher" warning
- Increases trust
- Costs ~$50-200/year

Not required for internal/personal use!

---

## 🎯 Quick Start Commands

### Test Development:
```bash
npm run electron:dev
```

### Build .exe:
```bash
npm run electron:build:win
```

### Find Output:
```
release/Cafeteria Management System Setup 1.0.0.exe
```

### Install & Test:
1. Double-click the .exe
2. Follow installation wizard
3. Launch from Start Menu or Desktop
4. Enjoy your desktop app! 🎉

---

## 📝 Additional Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-builder Docs](https://www.electron.build/)
- [Electron Quick Start](https://www.electronjs.org/docs/latest/tutorial/quick-start)

---

## ✅ Next Steps

1. ✅ Wait for npm installation to complete
2. ✅ Update package.json with Electron config
3. ✅ Test with `npm run electron:dev`
4. ✅ Build with `npm run electron:build:win`
5. ✅ Share your .exe file!

---

**Your React app is about to become a Windows desktop application!** 🚀✨
