const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Authentication required');
  }

  const token = header.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw ApiError.unauthorized('Invalid or expired token');
  }

  const [rows] = await pool.execute(
    `SELECT id, email, role, first_name, last_name, phone, avatar_url, is_active
     FROM users WHERE id = ? AND deleted_at IS NULL`,
    [decoded.userId]
  );

  if (!rows.length || !rows[0].is_active) {
    throw ApiError.unauthorized('User not found or inactive');
  }

  req.user = rows[0];
  next();
});

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(ApiError.forbidden('You do not have permission to perform this action'));
  }
  next();
};

module.exports = { authenticate, authorize };
