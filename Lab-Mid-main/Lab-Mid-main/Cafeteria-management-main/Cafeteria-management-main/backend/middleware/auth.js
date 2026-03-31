import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Administrator from '../models/Administrator.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by id
      let user;
      
      switch (decoded.role) {
        case 'student':
          user = await Student.findById(decoded.id).select('-password');
          break;
        case 'teacher':
          user = await Teacher.findById(decoded.id).select('-password');
          break;
        case 'admin':
          user = await Administrator.findById(decoded.id).select('-password');
          break;
        default:
          return res.status(401).json({ message: 'Invalid user role' });
      }

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = {
        id: user._id,
        email: user.email,
        role: decoded.role,
        fullName: user.fullName,
      };

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check user roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};
