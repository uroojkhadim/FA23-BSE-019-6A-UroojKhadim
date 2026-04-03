@echo off
echo ========================================
echo   Electron Installation Monitor
echo ========================================
echo.
echo Waiting for npm install to complete...
echo.

:loop
timeout /t 5 /nobreak >nul
tasklist | findstr "npm.exe" >nul 2>&1
if %errorlevel% equ 0 (
    echo Still installing... checking again in 5 seconds
    goto loop
)

echo.
echo ========================================
echo   Installation Complete! ✓
echo ========================================
echo.
echo Next steps:
echo 1. Update package.json with Electron config
echo 2. Run: npm run electron:dev
echo 3. Build .exe: npm run electron:build:win
echo.
echo Check release/ folder for your .exe file!
echo.
pause
