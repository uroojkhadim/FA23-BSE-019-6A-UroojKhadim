# MySQL CRUD Application with Node.js

## Project Overview

I have successfully implemented a complete CRUD (Create, Read, Update, Delete) application using Node.js and MySQL with basic HTML pages. The application provides a user-friendly interface for managing user records.

## Features Implemented

### Backend (Node.js/Express)
- **Express.js server** for handling HTTP requests
- **MySQL integration** using mysql2 package
- **RESTful API endpoints** for all CRUD operations:
  - `GET /api/users` - Retrieve all users
  - `GET /api/users/:id` - Retrieve specific user
  - `POST /api/users` - Create new user
  - `PUT /api/users/:id` - Update existing user
  - `DELETE /api/users/:id` - Delete user
- **Database connection management** with error handling
- **Environment configuration** using .env file
- **Automatic database/table creation** script

### Frontend (HTML/CSS/JavaScript)
- **Responsive HTML interface** with clean styling
- **Complete CRUD functionality**:
  - Create new user records
  - Read/display all users in a table
  - Update existing user information
  - Delete user records
- **Form validation** and user feedback
- **Real-time updates** without page refresh
- **Confirmation dialogs** for delete operations

### Database Schema
- **users table** with columns:
  - `id` (Primary Key, Auto Increment)
  - `name` (VARCHAR 100, NOT NULL)
  - `email` (VARCHAR 100, NOT NULL, UNIQUE)
  - `phone` (VARCHAR 20)
  - `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

## Project Files Created

1. **server.js** - Main application server
2. **db_setup.js** - Database initialization script
3. **package.json** - Project dependencies and scripts
4. **.env** - Environment configuration
5. **public/index.html** - Main HTML interface with JavaScript CRUD operations
6. **README.md** - Documentation
7. **verify_project.js** - Verification script

## How to Run the Application

1. **Prerequisites**:
   - Node.js (v14 or higher)
   - MySQL Server

2. **Setup**:
   ```bash
   npm install
   ```

3. **Configure Database** (in .env file):
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=crud_app
   DB_PORT=3306
   ```

4. **Initialize Database**:
   ```bash
   npm run setup-db
   ```

5. **Start the Application**:
   ```bash
   npm start
   ```

6. **Access the Application**:
   - Open your browser and go to `http://localhost:3000`

## Key Functionality

- **Create**: Add new users with name, email, and phone number
- **Read**: View all users in a sortable table with creation timestamps
- **Update**: Modify existing user information with inline editing
- **Delete**: Remove users with confirmation dialog
- **Validation**: Email uniqueness and required field validation
- **Error Handling**: Proper error messages for various scenarios
- **Responsive Design**: Works well on different screen sizes

## Security Features

- Input validation on both frontend and backend
- SQL injection prevention using parameterized queries
- Unique email constraint to prevent duplicates

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Package Manager**: npm
- **Environment Management**: dotenv

This implementation provides a complete, production-ready foundation for a CRUD application with MySQL and Node.js, featuring a clean, intuitive HTML interface.