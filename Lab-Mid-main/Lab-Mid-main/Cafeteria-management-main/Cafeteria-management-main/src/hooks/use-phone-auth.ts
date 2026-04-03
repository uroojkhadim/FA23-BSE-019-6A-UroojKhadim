import { useState, useCallback } from 'react';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult
} from 'firebase/auth';
import { auth } from '@/lib/firebase-config';
import { toast } from 'sonner';
import { formatPhoneNumber, validatePakistaniPhone } from '@/lib/phoneValidator';

export const usePhoneAuth = () => {
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const setupRecaptcha = useCallback((containerId: string) => {
    // Clear existing reCAPTCHA if present
    if ((window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      } catch (e) {
        console.warn('Error clearing previous reCAPTCHA:', e);
      }
    }

    try {
      // Get container element
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`reCAPTCHA container not found: ${containerId}`);
        return;
      }

      // Clear container content to prevent duplicate rendering
      container.innerHTML = '';

      // Create new reCAPTCHA verifier
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'normal', // Changed to 'normal' to make it visible and debuggable
        callback: (response: any) => {
          console.log('reCAPTCHA solved successfully');
        },
        'expired-callback': () => {
          console.warn('reCAPTCHA expired');
          toast.error('reCAPTCHA expired. Please try again.');
        },
        'error-callback': (error: any) => {
          console.error('reCAPTCHA error:', error);
          toast.error('reCAPTCHA verification failed. Please refresh the page.');
        }
      });
      
      console.log('reCAPTCHA initialized successfully');
    } catch (error: any) {
      console.error('Error setting up reCAPTCHA:', error);
      if (error.message?.includes('already been rendered')) {
        toast.error('reCAPTCHA is already loading. Please wait...');
      } else {
        toast.error('Failed to initialize reCAPTCHA. Please refresh the page.');
      }
    }
  }, []);

  const sendOtp = async (phone: string, containerId: string) => {
    setLoading(true);
    setPhoneNumber(phone);

    try {
      // Validate and format phone number
      if (!validatePakistaniPhone(phone)) {
        toast.error('Invalid phone number format. Use +92XXXXXXXXXX');
        return false;
      }

      const formattedNumber = formatPhoneNumber(phone);
      setupRecaptcha(containerId);
      const appVerifier = (window as any).recaptchaVerifier;
      
      const result = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
      setConfirmationResult(result);
      setVerificationId(result.verificationId);
      toast.success('OTP sent successfully via SMS!');
      return true;
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      let message = 'Failed to send OTP. Please check the phone number format.';
      if (error.code === 'auth/invalid-phone-number') {
        message = 'Invalid phone number format. Please use +92XXXXXXXXXX.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many requests. Please wait a few minutes before trying again.';
      } else if (error.code === 'auth/captcha-check-failed') {
        message = 'reCAPTCHA verification failed. Please refresh and try again.';
      }
      
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (code: string) => {
    if (!confirmationResult) {
      toast.error('No verification in progress. Please request a new OTP.');
      return null;
    }

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(code);
      toast.success('Phone verified successfully!');
      return result.user;
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      let message = 'Invalid verification code.';
      if (error.code === 'auth/code-expired') {
        message = 'Verification code expired. Please request a new one.';
      } else if (error.code === 'auth/invalid-verification-code') {
        message = 'Invalid verification code. Please try again.';
      }
      
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setConfirmationResult(null);
    setVerificationId(null);
    setPhoneNumber('');
  };

  return {
    sendOtp,
    verifyOtp,
    loading,
    verificationId,
    phoneNumber,
    reset
  };
};
