import express from 'express';
import { query } from '../db.js';
import { verifyToken, isAdmin, isStaff } from '../middleware/auth.js';

const router = express.Router();

// Create order
router.post('/', verifyToken, async (req, res) => {
  const { items, total, discount, finalAmount, paymentMethod, paymentDetails, status } = req.body;
  const userId = req.user.id;

  try {
    // Transactional logic
    await query('BEGIN');

    // 1. Insert order
    const orderResult = await query(
      'INSERT INTO orders (user_id, items, total, discount, final_amount, payment_method, payment_details, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [userId, JSON.stringify(items), total, discount, finalAmount, paymentMethod, JSON.stringify(paymentDetails), status || 'pending']
    );

    // 2. Deduct wallet if applicable
    if (paymentMethod === 'wallet') {
      const userRes = await query('SELECT wallet_balance FROM users WHERE id = $1 FOR UPDATE', [userId]);
      const currentBalance = Number(userRes.rows[0].wallet_balance);
      
      if (currentBalance < finalAmount) {
        throw new Error('Insufficient wallet balance');
      }

      await query('UPDATE users SET wallet_balance = wallet_balance - $1 WHERE id = $2', [finalAmount, userId]);
    }

    // 3. Update stock
    for (const item of items) {
       const prodRes = await query('SELECT stock FROM products WHERE id = $1 FOR UPDATE', [item.id]);
       if (!prodRes.rows[0] || prodRes.rows[0].stock < item.quantity) {
           throw new Error(`Insufficient stock for ${item.name}`);
       }
       await query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.id]);
    }

    await query('COMMIT');

    // Emit socket event (to be integrated in main index.js)
    if (req.app.get('io')) {
      req.app.get('io').emit('new_order', orderResult.rows[0]);
    }

    res.status(201).json(orderResult.rows[0]);
  } catch (err) {
    await query('ROLLBACK');
    res.status(400).json({ message: 'Order failed: ' + err.message });
  }
});

// Update order status (Admin/Staff only)
router.patch('/:id', verifyToken, async (req, res) => {
  const { status } = req.body;
  try {
    const result = await query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    
    // Notify client via Signal (Socket.io)
    if (req.app.get('io')) {
      req.app.get('io').emit('order_status_updated', result.rows[0]);
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: 'Update failed: ' + err.message });
  }
});

// Get all orders (Admin/Staff see all, Student sees their own)
router.get('/', verifyToken, async (req, res) => {
  try {
    let result;
    if (req.user.role === 'admin' || req.user.role === 'staff') {
      result = await query('SELECT orders.*, users.name as user_name FROM orders JOIN users ON orders.user_id = users.id ORDER BY created_at DESC');
    } else {
      result = await query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

export default router;
