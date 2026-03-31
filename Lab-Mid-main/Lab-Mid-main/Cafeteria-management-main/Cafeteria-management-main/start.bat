@echo off
echo ========================================
echo   COMSATS Cafeteria Management System
echo   Quick Start Script
echo ========================================
echo.

:: Check if MongoDB is running
echo [1/4] Checking MongoDB status...
net start | find "MongoDB" > nul
if %errorlevel% neq 0 (
    echo MongoDB is not running. Starting MongoDB...
    net start MongoDB
    if %errorlevel% neq 0 (
        echo WARNING: Could not start MongoDB automatically.
        echo Please start MongoDB manually and run this script again.
        pause
        exit /b 1
    )
) else (
    echo MongoDB is already running!
)
echo.

:: Seed database if needed
echo [2/4] Database seeding...
cd backend
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo Please edit backend\.env and configure your MongoDB URI
    echo Then run this script again
    cd ..
    pause
    exit /b 1
)

echo Backend server starting...
start cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul

echo Frontend server starting...
start cmd /k "npm run dev"

echo.
echo ========================================
echo   Servers Started Successfully!
echo ========================================
echo.
echo Backend API: http://localhost:5000/api
echo Frontend App: http://localhost:5173
echo.
echo Press any key to exit this window...
pause > nul
