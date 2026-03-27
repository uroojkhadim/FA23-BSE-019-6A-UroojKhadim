import express from 'express'
import db from '../db.js'

const router = express.Router()

// Get all orders (Admin/Staff)
router.get('/', async (req, res) => {
  await db.read()
  res.json(db.data.orders)
})

// Create new order
router.post('/', async (req, res) => {
  const { 
    userId, 
    items, 
    total, 
    discount, 
    finalAmount, 
    paymentMethod, 
    paymentDetails,
    status 
  } = req.body
  
  await db.read()
  const newOrder = {
    id: 'ORD-' + Date.now(),
    userId,
    items,
    total,
    discount,
    finalAmount,
    paymentMethod, // cash, jazzcash, easypaisa, card
    paymentDetails: paymentDetails || {},
    status: status || 'pending',
    createdAt: new Date().toISOString()
  }
  
  db.data.orders.push(newOrder)
  await db.write()
  
  res.status(201).json(newOrder)
})

// Update order status
router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const { status } = req.body
  
  await db.read()
  const index = db.data.orders.findIndex(ord => ord.id === id)
  
  if (index !== -1) {
    db.data.orders[index].status = status
    await db.write()
    res.json(db.data.orders[index])
  } else {
    res.status(404).json({ message: 'Order not found' })
  }
})

export default router
