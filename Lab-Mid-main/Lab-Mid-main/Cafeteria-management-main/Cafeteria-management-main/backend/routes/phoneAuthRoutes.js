import express from 'express';
import { sendCallOTP, verifyOTP, resendOTP } from '../controllers/phoneAuthController.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

/**
 * Rate limiter for OTP sending endpoints
 * Max 3 requests per hour per phone number
 */
const otpSendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: 'Too many OTP requests. Please try again after 1 hour.',
  keyGenerator: (req) => req.body.phoneNumber || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for OTP verification
 * Max 5 attempts per 15 minutes
 */
const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many verification attempts. Please request a new OTP.',
  keyGenerator: (req) => req.body.phoneNumber || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @route   POST /api/phone-auth/send-call-otp
 * @desc    Send OTP via Twilio voice call
 * @access  Public
 */
router.post('/send-call-otp', otpSendLimiter, sendCallOTP);

/**
 * @route   POST /api/phone-auth/resend-otp
 * @desc    Resend OTP (SMS or Call)
 * @access  Public
 */
router.post('/resend-otp', otpSendLimiter, resendOTP);

/**
 * @route   POST /api/phone-auth/verify-otp
 * @desc    Verify OTP code
 * @access  Public
 */
router.post('/verify-otp', otpVerifyLimiter, verifyOTP);

export default router;
