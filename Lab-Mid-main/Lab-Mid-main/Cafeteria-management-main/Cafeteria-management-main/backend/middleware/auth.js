import jwt from 'jsonwebtoken';
import { getDB } from '../config/db-sqlite.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      const db = getDB();
      const user = await db.get('SELECT * FROM users WHERE id = ?', [decoded.id]);

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
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

