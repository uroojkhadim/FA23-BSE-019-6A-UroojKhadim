# Troubleshooting Guide

This guide addresses common issues you might encounter with the Node.js CRUD application.

## Common Issues and Solutions

### 1. "Error creating user" or "Database connection failed"

**Problem**: The application cannot connect to the MySQL database.

**Solutions**:
- **Option A - Use file-based storage (no database required)**:
  ```bash
  npm run start-file
  ```
  This runs the application using JSON file storage instead of MySQL.

- **Option B - Fix MySQL connection**:
  1. Ensure MySQL server is installed and running
  2. Check that your MySQL service is active:
     - Windows: Open Services (services.msc) and look for MySQL service
     - macOS/Linux: Run `sudo systemctl status mysql` or `brew services list | grep mysql`
  3. Verify credentials in `.env` file match your MySQL setup
  4. Run the setup script: `npm run setup-db`

### 2. EADDRINUSE Error (Port already in use)

**Problem**: Another process is using the port the application tries to bind to.

**Solution**:
- Stop other Node.js processes:
  - Windows: `taskkill /f /im node.exe`
  - macOS/Linux: `lsof -i :3000` (or :4000) and `kill -9 <PID>`
- Use a different port: `PORT=5000 npm start`

### 3. Cannot find module errors

**Problem**: Missing dependencies.

**Solution**:
```bash
npm install
```

### 4. Permission errors

**Problem**: Insufficient permissions to write to data directory.

**Solution**:
- Ensure the `./data/` directory exists and is writable
- On Unix systems: `chmod 755 data/`

### 5. CORS or API errors

**Problem**: Browser blocks API requests.

**Solution**:
- Ensure both frontend and backend are served from the same origin
- Check that the server is running when accessing the frontend

## Quick Start Without MySQL

If you want to run the application without setting up MySQL:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the file-based version:
   ```bash
   npm run start-file
   ```

3. Visit `http://localhost:4000` in your browser

## MySQL Setup Steps

If you prefer to use MySQL:

1. Install MySQL Server
2. Start the MySQL service
3. Update your `.env` file with correct credentials
4. Run the setup script:
   ```bash
   npm run setup-db
   ```
5. Start the application:
   ```bash
   npm start
   ```

## Checking Application Status

To verify your application is working:

1. Check if the server is running: `curl http://localhost:4000/api/users` (for file-based) or `curl http://localhost:3000/api/users` (for MySQL)
2. Verify data storage by checking the `./data/users.json` file (for file-based version)
3. Look at server console logs for any error messages

## Getting Help

If you continue to experience issues:

1. Check the server console for specific error messages
2. Ensure all required software (Node.js, MySQL if using) is installed and running
3. Verify all file permissions
4. Confirm that no firewall or security software is blocking connections