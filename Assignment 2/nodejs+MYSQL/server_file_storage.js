const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// File-based storage
const DATA_FILE = './data/users.json';

// Ensure data file exists
async function initializeDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
  }
}

// Helper function to read users
async function readUsers() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write users
async function writeUsers(users) {
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2));
}

// Initialize data file
initializeDataFile();

// Routes

// Home page - Show all users
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Get all users (API endpoint)
app.get('/api/users', async (req, res) => {
  try {
    const users = await readUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Get user by ID (API endpoint)
app.get('/api/users/:id', async (req, res) => {
  try {
    const users = await readUsers();
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// Create new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const users = await readUsers();
    
    // Check if email already exists
    const emailExists = users.some(u => u.email === email);
    if (emailExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    const newUser = {
      id: Date.now(), // Using timestamp as ID
      name,
      email,
      phone: phone || null,
      created_at: new Date().toISOString()
    };
    
    users.push(newUser);
    await writeUsers(users);
    
    res.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === parseInt(id));
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if new email already exists for another user
    const emailExists = users.some((u, index) => u.email === email && index !== userIndex);
    if (emailExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    users[userIndex] = {
      ...users[userIndex],
      name,
      email,
      phone: phone || null
    };
    
    await writeUsers(users);
    res.json(users[userIndex]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === parseInt(id));
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    await writeUsers(users);
    
    res.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Using file-based storage instead of MySQL');
  console.log('Data is stored in ./data/users.json');
});