# Node.js + MongoDB CRUD Application

A simple, beginner-friendly CRUD application built with Node.js, Express, Mongoose, and basic HTML pages.

## Features
- **Create**: Add new users with name, email, and age.
- **Read**: View a list of all users and individual user details.
- **Update**: Edit existing user information.
- **Delete**: Remove users from the database.

## Prerequisites
- [Node.js](https://nodejs.org/) installed.
- [MongoDB](https://www.mongodb.com/) installed and running locally.

## Setup Instructions
1.  **Clone/Extract**: Ensure you are in the project root directory.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Ensure MongoDB is Running**: The app connects to `mongodb://127.0.0.1:27017/crud_app` by default.
4.  **Start the Server**:
    ```bash
    npm start
    ```
5.  **Access the App**: Open your browser and navigate to `http://localhost:3000`.

## Screenshots

| User List Page | Add New User |
| :---: | :---: |
| ![User List](image-2.png) | ![Add User](image.png) |

| Empty User List |
| :---: |
| ![Empty List](image-1.png) |

## Project Structure

```text
nodejs+Mongodb/
├── models/
│   └── User.js          # Mongoose schema for User
├── public/              # Static HTML files
│   ├── index.html       # User list page
│   ├── create.html      # Add user page
│   ├── edit.html        # Edit user page
│   └── view.html        # View individual user page
├── routes/
│   └── userRoutes.js    # API endpoints for CRUD
├── server.js            # Main Express server and DB connection
├── package.json         # Project dependencies
└── README.md            # Documentation
```


## Troubleshooting
If you see a "Database not connected" message in the UI:
1. Ensure your local MongoDB service is running.
2. If using MongoDB Atlas, check your connection string in `server.js`.
