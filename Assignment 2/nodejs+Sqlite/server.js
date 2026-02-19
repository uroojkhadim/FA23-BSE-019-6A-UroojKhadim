const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize SQLite database
const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to SQLite database');
        
        // Create a sample table for demonstration
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            age INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Users table ready');
            }
        });
    }
});

// Routes

// Home page - show all users
app.get('/', (req, res) => {
    db.all('SELECT * FROM users ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Database error');
        } else {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        }
    });
});

// API route to get all users
app.get('/api/users', (req, res) => {
    db.all('SELECT * FROM users ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// API route to get a specific user
app.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(row);
        }
    });
});

// API route to create a new user
app.post('/api/users', (req, res) => {
    const { name, email, age } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }
    
    db.run('INSERT INTO users (name, email, age) VALUES (?, ?, ?)', [name, email, age], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({
                id: this.lastID,
                name,
                email,
                age
            });
        }
    });
});

// API route to update a user
app.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const { name, email, age } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }
    
    db.run('UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?', [name, email, age, id], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json({ id, name, email, age });
        }
    });
});

// API route to delete a user
app.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'User not found' });
        } else {
            db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ error: err.message });
                } else {
                    res.json({ message: 'User deleted successfully' });
                }
            });
        }
    });
});

// Serve the users page
app.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'users.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});