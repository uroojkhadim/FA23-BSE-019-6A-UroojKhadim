import twilio from 'twilio';

// In-memory OTP store (Use Redis for production)
// Structure: Map<phoneNumber, { otp, expiry, attempts, method }>
const otpStore = new Map();

/**
 * Format phone number to +92XXXXXXXXXX format
 */
const formatPhoneNumber = (number) => {
  // Remove all non-digits
  let cleaned = number.replace(/\D/g, '');
  
  // Handle different formats
  if (cleaned.startsWith('0')) {
    cleaned = '92' + cleaned.substring(1);
  } else if (!cleaned.startsWith('92')) {
    cleaned = '92' + cleaned;
  }
  
  return '+' + cleaned;
};

/**
 * Generate 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Store OTP with expiry (5 minutes)
 */
const storeOTP = (phoneNumber, otp, method) => {
  const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes
  
  otpStore.set(phoneNumber, {
    otp,
    expiry,
    attempts: 0,
    method, // 'sms' or 'call'
    verified: false
  });
  
  // Auto-cleanup after expiry
  setTimeout(() => {
    const stored = otpStore.get(phoneNumber);
    if (stored && !stored.verified) {
      otpStore.delete(phoneNumber);
    }
  }, 5 * 60 * 1000);
};

/**
 * Send OTP via Twilio Voice Call (Text-to-Speech)
 */
export const sendCallOTP = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ 
      success: false, 
      message: 'Phone number is required.' 
    });
  }

  try {
    // Format and validate phone number
    const formattedNumber = formatPhoneNumber(phoneNumber);
    
    // Check rate limiting (max 3 requests per hour per number)
    const existingOTP = otpStore.get(formattedNumber);
    if (existingOTP && !existingOTP.verified) {
      const timeSinceLastRequest = Date.now() - (existingOTP.lastRequest || 0);
      if (timeSinceLastRequest < 60 * 1000) { // 1 minute cooldown
        return res.status(429).json({ 
          success: false, 
          message: 'Please wait at least 1 minute before requesting another OTP.' 
        });
      }
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP
    storeOTP(formattedNumber, otp, 'call');
    
    // Initialize Twilio client
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioNumber) {
      console.error('Twilio credentials not configured in .env file');
      return res.status(500).json({ 
        success: false, 
        message: 'Twilio configuration error. Please contact support.' 
      });
    }

    const client = twilio(accountSid, authToken);

    // Make outbound call with text-to-speech OTP
    await client.calls.create({
      to: formattedNumber,
      from: twilioNumber,
      twiml: `
        <Response>
          <Say voice="alice" language="en-US">
            Hello! Your verification code is: ${otp.split('').join(', ')}. 
            I repeat, your verification code is: ${otp.split('').join(', ')}.
            This code will expire in 5 minutes.
          </Say>
        </Response>
      `
    });

    console.log(`Call OTP sent to ${formattedNumber}`);
    
    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully via voice call. Please answer the call.',
    });

  } catch (error) {
    console.error('Twilio Call Error:', error.message);
    
    let errorMessage = 'Failed to send OTP via call.';
    if (error.code === 21211) {
      errorMessage = 'Invalid phone number format. Please use +92 format.';
    } else if (error.code === 21608) {
      errorMessage = 'Unable to call this number. Please try SMS instead.';
    }
    
    return res.status(error.status || 500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Verify OTP (common endpoint for both SMS and Call)
 */
export const verifyOTP = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ 
      success: false, 
      message: 'Phone number and OTP are required.' 
    });
  }

  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    const storedData = otpStore.get(formattedNumber);

    // Check if OTP exists
    if (!storedData) {
      return res.status(404).json({ 
        success: false, 
        message: 'OTP not found. Please request a new one.' 
      });
    }

    // Check if already verified
    if (storedData.verified) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP already verified. Please proceed with login.' 
      });
    }

    // Check expiry
    if (Date.now() > storedData.expiry) {
      otpStore.delete(formattedNumber);
      return res.status(400).json({ 
        success: false, 
        message: 'OTP has expired. Please request a new one.' 
      });
    }

    // Increment attempt counter
    storedData.attempts += 1;
    
    // Max 5 attempts
    if (storedData.attempts > 5) {
      otpStore.delete(formattedNumber);
      return res.status(400).json({ 
        success: false, 
        message: 'Maximum verification attempts exceeded. Please request a new OTP.' 
      });
    }

    // Match OTP
    if (storedData.otp !== otp) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid OTP. ${5 - storedData.attempts} attempts remaining.` 
      });
    }

    // Success - Mark as verified but keep in store temporarily
    storedData.verified = true;
    
    // Clean up after successful verification (after 1 minute)
    setTimeout(() => {
      otpStore.delete(formattedNumber);
    }, 60 * 1000);

    return res.status(200).json({
      success: true,
      message: 'Phone number verified successfully!',
    });

  } catch (error) {
    console.error('Verification Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during verification.' 
    });
  }
};

/**
 * Resend OTP (with rate limiting)
 */
export const resendOTP = async (req, res) => {
  const { phoneNumber, method } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ 
      success: false, 
      message: 'Phone number is required.' 
    });
  }

  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    const existingOTP = otpStore.get(formattedNumber);

    // Check if can resend (30 seconds cooldown)
    if (existingOTP && !existingOTP.verified) {
      const timeSinceLastRequest = Date.now() - (existingOTP.lastRequest || 0);
      if (timeSinceLastRequest < 30 * 1000) {
        const remainingTime = Math.ceil((30000 - timeSinceLastRequest) / 1000);
        return res.status(429).json({ 
          success: false, 
          message: `Please wait ${remainingTime} seconds before resending OTP.` 
        });
      }
    }

    // For call method, generate new OTP
    if (method === 'call') {
      const otp = generateOTP();
      storeOTP(formattedNumber, otp, 'call');
      
      // Initialize Twilio client
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

      if (!accountSid || !authToken || !twilioNumber) {
        return res.status(500).json({ 
          success: false, 
          message: 'Twilio configuration error.' 
        });
      }

      const client = twilio(accountSid, authToken);

      // Make outbound call
      await client.calls.create({
        to: formattedNumber,
        from: twilioNumber,
        twiml: `
          <Response>
            <Say voice="alice" language="en-US">
              Your new verification code is: ${otp.split('').join(', ')}. 
              I repeat, your verification code is: ${otp.split('').join(', ')}.
            </Say>
          </Response>
        `
      });

      console.log(`Resent call OTP to ${formattedNumber}`);
      
      return res.status(200).json({
        success: true,
        message: 'OTP resent successfully via voice call.',
      });
    }

    // For SMS method, just acknowledge (Firebase handles on frontend)
    return res.status(200).json({
      success: true,
      message: 'You can now request OTP via Firebase on the frontend.',
    });

  } catch (error) {
    console.error('Resend Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while resending OTP.' 
    });
  }
};

/**
 * Check OTP status (for debugging/testing)
 */
export const checkOTPStatus = async (req, res) => {
  const { phoneNumber } = req.query;
  
  if (!phoneNumber) {
    return res.status(400).json({ 
      success: false, 
      message: 'Phone number is required.' 
    });
  }

  const formattedNumber = formatPhoneNumber(phoneNumber);
  const storedData = otpStore.get(formattedNumber);

  if (!storedData) {
    return res.status(404).json({ 
      success: false, 
      message: 'No OTP found for this number.' 
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      exists: true,
      verified: storedData.verified,
      expiresAt: new Date(storedData.expiry).toISOString(),
      attempts: storedData.attempts,
      method: storedData.method
    }
  });
};

export default { sendCallOTP, verifyOTP, resendOTP, checkOTPStatus };
