import express from 'express';
import {
  registerStudent,
  registerTeacher,
  registerAdmin,
  loginUser,
  getProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register/student', registerStudent);
router.post('/register/teacher', registerTeacher);
router.post('/register/admin', registerAdmin);
router.post('/login', loginUser);

// Protected route to get profile
router.get('/profile', protect, getProfile);

export default router;
