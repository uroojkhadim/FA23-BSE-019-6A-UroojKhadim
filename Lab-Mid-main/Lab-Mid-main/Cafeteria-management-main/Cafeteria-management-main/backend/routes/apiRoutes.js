import express from 'express';
import { 
  registerUser, 
  loginUser, 
  updateOrderStatus,
  getUserByEmail 
} from '../controllers/authController.js';
import { createItem, getAllItems, getItemById, updateItem, deleteItem } from '../controllers/crudController.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Administrator from '../models/Administrator.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import Discount from '../models/Discount.js';

const router = express.Router();

// ==================== Authentication Routes ====================

// Register user with role
router.post('/register', registerUser);

// Login user with role
router.post('/login', loginUser);

// Get user by email (across all collections)
router.get('/user/:email', getUserByEmail);

// ==================== Order Management Routes ====================

// Update order status (triggers email notification)
router.put('/orders/:orderId/status', updateOrderStatus);

// ==================== Generic CRUD Routes ====================

// Students
router.post('/students', createItem(Student));
router.get('/students', getAllItems(Student));
router.get('/students/:id', getItemById(Student));
router.put('/students/:id', updateItem(Student));
router.delete('/students/:id', deleteItem(Student));

// Teachers
router.post('/teachers', createItem(Teacher));
router.get('/teachers', getAllItems(Teacher));
router.get('/teachers/:id', getItemById(Teacher));
router.put('/teachers/:id', updateItem(Teacher));
router.delete('/teachers/:id', deleteItem(Teacher));

// Administrators
router.post('/admins', createItem(Administrator));
router.get('/admins', getAllItems(Administrator));
router.get('/admins/:id', getItemById(Administrator));
router.put('/admins/:id', updateItem(Administrator));
router.delete('/admins/:id', deleteItem(Administrator));

// Menu Items
router.post('/menu-items', createItem(MenuItem));
router.get('/menu-items', getAllItems(MenuItem));
router.get('/menu-items/:id', getItemById(MenuItem));
router.put('/menu-items/:id', updateItem(MenuItem));
router.delete('/menu-items/:id', deleteItem(MenuItem));

// Orders
router.post('/orders', createItem(Order));
router.get('/orders', getAllItems(Order));
router.get('/orders/:id', getItemById(Order));
router.put('/orders/:id', updateItem(Order));
router.delete('/orders/:id', deleteItem(Order));

// Discounts
router.post('/discounts', createItem(Discount));
router.get('/discounts', getAllItems(Discount));
router.get('/discounts/:id', getItemById(Discount));
router.put('/discounts/:id', updateItem(Discount));
router.delete('/discounts/:id', deleteItem(Discount));

export default router;
