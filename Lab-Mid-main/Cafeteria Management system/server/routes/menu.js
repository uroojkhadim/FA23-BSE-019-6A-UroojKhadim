import express from 'express';
import { query } from '../db.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM products ORDER BY category, name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching menu: ' + err.message });
  }
});

// Add menu item (Admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  const { name, price, category, stock, image } = req.body;
  try {
    const result = await query(
      'INSERT INTO products (name, price, category, stock, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, price, category, stock || 0, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: 'Error adding item: ' + err.message });
  }
});

// Delete item
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed: ' + err.message });
  }
});

export default router;
