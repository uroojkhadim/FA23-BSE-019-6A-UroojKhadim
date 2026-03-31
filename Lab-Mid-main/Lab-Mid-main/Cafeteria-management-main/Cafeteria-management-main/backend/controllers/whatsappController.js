import axios from 'axios';

// In-memory OTP store (Use Redis for production)
// key: phoneNumber, value: { otp, expiry }
const otpStore = {};

/**
 * @desc    Format phone number to 92XXXXXXXXXX
 */
const formatPhoneNumber = (number) => {
  // Remove all non-digits
  let cleaned = number.replace(/\D/g, '');
  // Ensure it starts with 92 or the country code provided
  // If it starts with 0, replace with 92
  if (cleaned.startsWith('0')) {
    cleaned = '92' + cleaned.substring(1);
  }
  return cleaned;
};

/**
 * @desc    Send OTP via WhatsApp using Meta Cloud API
 * @route   POST /api/whatsapp/send-otp
 */
export const sendOTP = async (req, res) => {
  const { phoneNumber, role } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'Phone number is required.' });
  }

  // Basic validation for role (Student, Teacher, Admin)
  if (!role) {
    return res.status(400).json({ success: false, message: 'User role is required (Student, Teacher, or Admin).' });
  }

  const formattedNumber = formatPhoneNumber(phoneNumber);
  
  // 1. Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

  // 2. Store OTP and Role
  otpStore[formattedNumber] = { otp, expiry, role };

  // 3. Meta API Configuration
  const accessToken = process.env.META_ACCESS_TOKEN;
  const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
  const apiVersion = process.env.META_API_VERSION || 'v21.0';

  if (!accessToken || !phoneNumberId) {
    return res.status(500).json({ success: false, message: 'WhatsApp API credentials missing in .env' });
  }

  const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

  // 4. Construct TEMPLATE Payload (MANDATORY)
  const payload = {
    messaging_product: 'whatsapp',
    to: formattedNumber,
    type: 'template',
    template: {
      name: 'hello_world', // Use default sandbox template for testing
      language: {
        code: 'en_US'
      }
    }
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`OTP sent to ${formattedNumber}: ${otp}`);
    
    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully!',
    });

  } catch (error) {
    console.error('Meta API Error:', error.response ? error.response.data : error.message);
    
    // In Sandbox mode, if number isn't verified, Meta returns 400
    const errorDetails = error.response ? error.response.data : 'Internal Server Error';

    return res.status(error.response?.status || 500).json({
      success: false,
      message: 'Failed to send WhatsApp message.',
      error: errorDetails
    });
  }
};

/**
 * @desc    Verify OTP
 * @route   POST /api/whatsapp/verify-otp
 */
export const verifyOTP = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ success: false, message: 'Phone number and OTP are required.' });
  }

  const formattedNumber = formatPhoneNumber(phoneNumber);
  const storedData = otpStore[formattedNumber];

  // 1. Check if OTP exists
  if (!storedData) {
    return res.status(404).json({ success: false, message: 'OTP not found or already verified.' });
  }

  // 2. Check Expiry
  if (Date.now() > storedData.expiry) {
    delete otpStore[formattedNumber];
    return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
  }

  // 3. Match OTP
  if (storedData.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP code.' });
  }

  // 4. Success - Clear stored OTP
  const userRole = storedData.role;
  delete otpStore[formattedNumber];

  return res.status(200).json({
    success: true,
    message: 'Phone number verified successfully!',
    role: userRole
  });
};

/**
 * @desc    Legacy Hello World test (maintained for testing)
 */
export const sendWhatsAppMessage = async (req, res) => {
    // ... existing implementation if needed ...
    // We'll focus on the OTP logic above
};
