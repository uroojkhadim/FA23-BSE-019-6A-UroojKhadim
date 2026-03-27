import express from 'express';
import { query } from '../db.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get current user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, role, wallet_balance FROM users WHERE id = $1', [req.user.id]);
    const user = result.rows[0];
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ ...user, walletBalance: user.wallet_balance });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Top up wallet balance (Admin only)
router.post('/wallet/topup', verifyToken, isAdmin, async (req, res) => {
  const { userId, amount } = req.body;
  try {
    const result = await query(
      'UPDATE users SET wallet_balance = wallet_balance + $1 WHERE id = $2 RETURNING wallet_balance',
      [amount, userId]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Wallet topped up successfully', newBalance: result.rows[0].wallet_balance });
  } catch (err) {
    res.status(500).json({ message: 'Top-up failed: ' + err.message });
  }
});

// Get all users (Admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, role, wallet_balance FROM users ORDER BY name');
    const users = result.rows.map(u => ({ ...u, walletBalance: u.wallet_balance }));
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

export default router;
