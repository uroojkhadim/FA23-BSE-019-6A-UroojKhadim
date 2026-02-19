const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'crud_app',
  port: process.env.DB_PORT || 3306
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    console.log('Please make sure MySQL server is running and credentials are correct.');
    console.log('Default credentials: host=localhost, user=root, password=(empty), database=crud_app');
    // In a production environment, you might want to exit here
    // process.exit(1);
  } else {
    console.log('Connected to MySQL database');
    initializeTable();
  }
});

// Initialize table if it doesn't exist
function initializeTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      phone VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Users table ready');
    }
  });
}

// Routes

// Home page - Show all users
app.get('/', (req, res) => {
  const query = 'SELECT * FROM users ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).send('Error fetching users');
    } else {
      res.sendFile(path.join(__dirname, 'public/index.html'));
    }
  });
});

// Get all users (API endpoint)
app.get('/api/users', (req, res) => {
  const query = 'SELECT * FROM users ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Error fetching users' });
    } else {
      res.json(results);
    }
  });
});

// Get user by ID (API endpoint)
app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      res.status(500).json({ error: 'Error fetching user' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(results[0]);
    }
  });
});

// Create new user
app.post('/api/users', (req, res) => {
  const { name, email, phone } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const query = 'INSERT INTO users (name, email, phone) VALUES (?, ?, ?)';
  db.query(query, [name, email, phone], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        console.error('Error inserting user:', err);
        res.status(500).json({ error: 'Error creating user' });
      }
    } else {
      res.json({ id: result.insertId, name, email, phone });
    }
  });
});

// Update user
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const query = 'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?';
  db.query(query, [name, email, phone, id], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Error updating user' });
      }
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json({ id, name, email, phone });
    }
  });
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ error: 'Error deleting user' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json({ message: 'User deleted successfully' });
    }
  });
});

// Serve HTML pages
app.get('/users', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});