import express from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const result = await query(
      'INSERT INTO users (name, email, password, role, wallet_balance) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, wallet_balance',
      [name, email, password, role || 'student', 0]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret');
    res.status(201).json({ token, user: { ...user, walletBalance: user.wallet_balance } });
  } catch (err) {
    res.status(400).json({ message: 'Registration failed: ' + err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret');
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        walletBalance: user.wallet_balance 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
