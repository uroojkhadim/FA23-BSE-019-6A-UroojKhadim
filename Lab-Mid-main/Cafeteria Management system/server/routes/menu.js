import express from 'express'
import db from '../db.js'

const router = express.Router()

// Get all menu items
router.get('/', async (req, res) => {
  await db.read()
  res.json(db.data.menu)
})

// Add menu item (Admin only)
router.post('/', async (req, res) => {
  const { name, price, category } = req.body
  
  await db.read()
  const newItem = {
    id: Date.now(),
    name,
    price: Number(price),
    category
  }
  
  db.data.menu.push(newItem)
  await db.write()
  
  res.status(201).json(newItem)
})

// Update menu item
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { name, price, category } = req.body
  
  await db.read()
  const index = db.data.menu.findIndex(item => item.id == id)
  
  if (index !== -1) {
    db.data.menu[index] = { ...db.data.menu[index], name, price: Number(price), category }
    await db.write()
    res.json(db.data.menu[index])
  } else {
    res.status(404).json({ message: 'Item not found' })
  }
})

// Delete menu item
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  
  await db.read()
  db.data.menu = db.data.menu.filter(item => item.id != id)
  await db.write()
  
  res.json({ message: 'Item deleted' })
})

export default router
