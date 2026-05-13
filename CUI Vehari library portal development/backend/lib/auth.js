const jwt = require('jsonwebtoken');
const { sql } = require('../db/index');

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key';

const requireRole = (roles) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: No token provided' 
      });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Check user in Neon DB
      const [user] = await sql`SELECT * FROM users WHERE id = ${decoded.id} AND is_active = TRUE`;
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found or deactivated' 
        });
      }

      if (roles && !roles.includes(user.role)) {
        return res.status(403).json({ 
          success: false, 
          message: `Forbidden: Required role ${roles.join(' or ')}` 
        });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error('Auth Error:', err);
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: Invalid token' 
      });
    }
  };
};

module.exports = { requireRole };
