const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const authValidator = require('../validators/auth.validator');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '20', 10),
  message: { success: false, message: 'Too many attempts, try again later' },
});

router.post('/register', authLimiter, validate(authValidator.register), authController.register);
router.post('/login', authLimiter, validate(authValidator.login), authController.login);
router.post('/forgot-password', authLimiter, validate(authValidator.forgotPassword), authController.forgotPassword);
router.post('/reset-password', authLimiter, validate(authValidator.resetPassword), authController.resetPassword);
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
