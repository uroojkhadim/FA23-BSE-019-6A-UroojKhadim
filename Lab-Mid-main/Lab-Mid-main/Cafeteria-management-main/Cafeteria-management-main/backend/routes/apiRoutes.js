import express from 'express';
import { 
  registerUser, 
  loginUser, 
  updateOrderStatus,
  getUserByEmail 
} from '../controllers/authController.js';
import { 
  createItem, 
  getAllItems, 
  getItemById, 
  updateItem, 
  deleteItem 
} from '../controllers/crudController.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Payment from '../models/Payment.js';

const router = express.Router();

// ==================== Authentication Routes ====================
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user/:email', getUserByEmail);

// ==================== Order Management Routes ====================
router.put('/orders/:orderId/status', updateOrderStatus);

// ==================== Generic CRUD Routes (Mongoose) ====================

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

// Order Items
router.post('/order-items', createItem(OrderItem));
router.get('/order-items', getAllItems(OrderItem));

// Payments
router.post('/payments', createItem(Payment));
router.get('/payments', getAllItems(Payment));

export default router;
