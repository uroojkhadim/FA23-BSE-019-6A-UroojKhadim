import express from 'express';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Payment from '../models/Payment.js';
import Discount from '../models/Discount.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Administrator from '../models/Administrator.js';
import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
} from '../controllers/crudController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Menu Items routes (Public - students can view)
router.get('/menuitems', getAllItems(MenuItem));
router.get('/menuitems/:id', getItemById(MenuItem));
router.post('/menuitems', protect, authorize('admin'), createItem(MenuItem));
router.put('/menuitems/:id', protect, authorize('admin'), updateItem(MenuItem));
router.delete('/menuitems/:id', protect, authorize('admin'), deleteItem(MenuItem));

// Orders routes
router.get('/orders', protect, getAllItems(Order));
router.get('/orders/:id', protect, getItemById(Order));
router.post('/orders', protect, createItem(Order));
router.put('/orders/:id', protect, authorize('admin'), updateItem(Order));
router.delete('/orders/:id', protect, authorize('admin'), deleteItem(Order));

// Order Items routes
router.get('/orderitems', protect, getAllItems(OrderItem));
router.get('/orderitems/:id', protect, getItemById(OrderItem));
router.post('/orderitems', protect, createItem(OrderItem));
router.put('/orderitems/:id', protect, updateItem(OrderItem));
router.delete('/orderitems/:id', protect, deleteItem(OrderItem));

// Payments routes
router.get('/payments', protect, getAllItems(Payment));
router.get('/payments/:id', protect, getItemById(Payment));
router.post('/payments', protect, createItem(Payment));
router.put('/payments/:id', protect, authorize('admin'), updateItem(Payment));
router.delete('/payments/:id', protect, authorize('admin'), deleteItem(Payment));

// Discounts routes
router.get('/discounts', getAllItems(Discount));
router.get('/discounts/:id', getItemById(Discount));
router.post('/discounts', protect, authorize('admin'), createItem(Discount));
router.put('/discounts/:id', protect, authorize('admin'), updateItem(Discount));
router.delete('/discounts/:id', protect, authorize('admin'), deleteItem(Discount));

// Students routes (Admin only)
router.get('/students', protect, authorize('admin'), getAllItems(Student));
router.get('/students/:id', protect, authorize('admin'), getItemById(Student));
router.put('/students/:id', protect, authorize('admin'), updateItem(Student));
router.delete('/students/:id', protect, authorize('admin'), deleteItem(Student));

// Teachers routes (Admin only)
router.get('/teachers', protect, authorize('admin'), getAllItems(Teacher));
router.get('/teachers/:id', protect, authorize('admin'), getItemById(Teacher));
router.put('/teachers/:id', protect, authorize('admin'), updateItem(Teacher));
router.delete('/teachers/:id', protect, authorize('admin'), deleteItem(Teacher));

// Administrators routes (Admin only)
router.get('/admins', protect, authorize('admin'), getAllItems(Administrator));
router.get('/admins/:id', protect, authorize('admin'), getItemById(Administrator));
router.put('/admins/:id', protect, authorize('admin'), updateItem(Administrator));
router.delete('/admins/:id', protect, authorize('admin'), deleteItem(Administrator));

export default router;
