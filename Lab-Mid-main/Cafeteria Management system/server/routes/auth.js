import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role, rollNo, whatsapp } = req.body
  
  await db.read()
  const userExists = db.data.users.find(u => u.email === email)
  
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    role: role || 'student', // student, teacher, admin, staff
    rollNo: rollNo || '',
    whatsapp: whatsapp || '',
    createdAt: new Date().toISOString()
  }

  db.data.users.push(newUser)
  await db.write()

  res.status(201).json({ message: 'User registered successfully' })
})

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  
  await db.read()
  const user = db.data.users.find(u => u.email === email)
  
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' })
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  })
})

export default router
