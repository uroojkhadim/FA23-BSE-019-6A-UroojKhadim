const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const MONGODB_URI = 'mongodb://127.0.0.1:27017/crud_app';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('-------------------------------');
    console.log('MongoDB Connected Successfully!');
    console.log('-------------------------------');
  })
  .catch(err => {
    console.log('-------------------------------');
    console.error('CRITICAL: MongoDB Connection Error!');
    console.error('Make sure MongoDB is installed and running.');
    console.error('Error Details:', err.message);
    console.log('-------------------------------');
  });

// Check DB Connection Middleware
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1 && req.path.startsWith('/api')) {
    return res.status(503).json({
      message: 'Database not connected. Please ensure MongoDB is running.'
    });
  }
  next();
});

// Import Routes
const userRoutes = require('./routes/userRoutes');

// Use Routes
app.use('/api/users', userRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'create.html'));
});

app.get('/edit/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'edit.html'));
});

app.get('/view/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'view.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
