import express from 'express';
import { sendOTP, verifyOTP, sendWhatsAppMessage } from '../controllers/whatsappController.js';

const router = express.Router();

/**
 * @route   POST /api/whatsapp/send-otp
 * @desc    Generate and send a 6-digit OTP
 */
router.post('/send-otp', sendOTP);

/**
 * @route   POST /api/whatsapp/verify-otp
 * @desc    Validate the 6-digit OTP
 */
router.post('/verify-otp', verifyOTP);

/**
 * @route   POST /api/whatsapp/send
 * @desc    Legacy Hello World test
 */
router.post('/send', sendWhatsAppMessage);

export default router;
