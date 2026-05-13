import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Administrator from '../models/Administrator.js';
import Order from '../models/Order.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role, ...extraFields } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let Model;
    if (role === 'student') Model = Student;
    else if (role === 'teacher') Model = Teacher;
    else if (role === 'admin') Model = Administrator;
    else return res.status(400).json({ message: 'Invalid role' });

    // Check if user exists in any collection
    const existingStudent = await Student.findOne({ email: email.toLowerCase() });
    const existingTeacher = await Teacher.findOne({ email: email.toLowerCase() });
    const existingAdmin = await Administrator.findOne({ email: email.toLowerCase() });

    if (existingStudent || existingTeacher || existingAdmin) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const newUser = new Model({
      fullName,
      email: email.toLowerCase(),
      password,
      role,
      ...extraFields
    });

    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token: generateToken(newUser._id, role)
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Failed to register user', error: error.message });
  }
};

export const registerStudent = (req, res) => {
  req.body.role = 'student';
  return registerUser(req, res);
};

export const registerTeacher = (req, res) => {
  req.body.role = 'teacher';
  return registerUser(req, res);
};

export const registerAdmin = (req, res) => {
  req.body.role = 'admin';
  return registerUser(req, res);
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let user = null;
    
    // If role is provided, search in specific collection, else search all
    if (role) {
      let Model;
      if (role === 'student') Model = Student;
      else if (role === 'teacher') Model = Teacher;
      else if (role === 'admin') Model = Administrator;
      
      if (Model) {
        user = await Model.findOne({ email: email.toLowerCase() }).select('+password');
      }
    } else {
      // Search all
      user = await Student.findOne({ email: email.toLowerCase() }).select('+password') ||
             await Teacher.findOne({ email: email.toLowerCase() }).select('+password') ||
             await Administrator.findOne({ email: email.toLowerCase() }).select('+password');
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: 'Login successful',
      user: userResponse,
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Failed to login', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    let user = await Student.findById(req.user.id) ||
               await Teacher.findById(req.user.id) ||
               await Administrator.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await Student.findOne({ email: email.toLowerCase() }) ||
                 await Teacher.findOne({ email: email.toLowerCase() }) ||
                 await Administrator.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};

