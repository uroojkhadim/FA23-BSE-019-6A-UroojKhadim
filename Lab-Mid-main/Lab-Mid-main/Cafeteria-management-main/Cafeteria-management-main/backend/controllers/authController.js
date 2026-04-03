import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Administrator from '../models/Administrator.js';
import { sendPendingPaymentEmail, sendOrderStatusUpdateEmail } from '../services/emailService.js';

/**
 * Register user based on role
 */
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role, registrationNumber, cnicNumber, department, adminRole } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check which collection to use based on role
    let UserCollection;
    let userData = { fullName, email, password };

    switch (role) {
      case 'student':
        if (!registrationNumber) {
          return res.status(400).json({ message: 'Registration number is required for students' });
        }
        UserCollection = Student;
        userData.registrationNumber = registrationNumber;
        userData.role = 'student';
        break;

      case 'teacher':
        if (!cnicNumber) {
          return res.status(400).json({ message: 'CNIC number is required for teachers' });
        }
        UserCollection = Teacher;
        userData.cnicNumber = cnicNumber;
        userData.department = department || '';
        userData.role = 'teacher';
        break;

      case 'admin':
        UserCollection = Administrator;
        userData.adminRole = adminRole || 'manager';
        userData.role = 'admin';
        break;

      default:
        return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Check if email already exists in the respective collection
    const existingUser = await UserCollection.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Create user in appropriate collection
    const user = await UserCollection.create(userData);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    res.status(500).json({ 
      message: 'Failed to register user', 
      error: error.message 
    });
  }
};

/**
 * Login user and return role-based access
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required' });
    }

    // Select appropriate model based on role
    let UserCollection;
    switch (role) {
      case 'student':
        UserCollection = Student;
        break;
      case 'teacher':
        UserCollection = Teacher;
        break;
      case 'admin':
        UserCollection = Administrator;
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    // Find user with password field
    const user = await UserCollection.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Prepare user data without sensitive information
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: 'Login successful',
      user: userResponse,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Failed to login', 
      error: error.message 
    });
  }
};

/**
 * Update order status and trigger email notification
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const Order = (await import('../models/Order.js')).default;
    const MenuItem = (await import('../models/MenuItem.js')).default;
    
    const { orderId } = req.params;
    const { status } = req.body;

    // Find and update order
    const order = await Order.findById(orderId).populate('items.menuItem');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update status
    order.status = status;
    await order.save();

    // Get user email based on role
    let userEmail;
    let userName;
    
    if (order.userModel === 'Student') {
      const student = await Student.findById(order.userId);
      userEmail = student?.email;
      userName = student?.fullName;
    } else if (order.userModel === 'Teacher') {
      const teacher = await Teacher.findById(order.userId);
      userEmail = teacher?.email;
      userName = teacher?.fullName;
    } else if (order.userModel === 'Administrator') {
      const admin = await Administrator.findById(order.userId);
      userEmail = admin?.email;
      userName = admin?.fullName;
    }

    if (!userEmail) {
      console.warn('Could not find user email for order:', orderId);
      return res.json({ message: 'Order status updated', order });
    }

    // Send email based on status
    const orderDetails = {
      orderId: order._id,
      createdAt: order.createdAt,
      totalAmount: order.totalAmount,
      items: order.items.map(item => ({
        name: item.menuItem?.name || 'Unknown Item',
        quantity: item.quantity,
        price: item.price,
      })),
    };

    if (status === 'pending_payment') {
      // Send pending payment email
      await sendPendingPaymentEmail(userEmail, orderDetails);
    } else {
      // Send status update email
      await sendOrderStatusUpdateEmail(userEmail, orderDetails, status);
    }

    res.json({
      message: 'Order status updated successfully',
      order,
      emailSent: true,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ 
      message: 'Failed to update order status', 
      error: error.message 
    });
  }
};

/**
 * Get user by email across all collections
 */
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const normalizedEmail = email.toLowerCase();

    // Search in all collections
    const [student, teacher, administrator] = await Promise.all([
      Student.findOne({ email: normalizedEmail }),
      Teacher.findOne({ email: normalizedEmail }),
      Administrator.findOne({ email: normalizedEmail }),
    ]);

    const user = student || teacher || administrator;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ user: userResponse });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user', 
      error: error.message 
    });
  }
};
