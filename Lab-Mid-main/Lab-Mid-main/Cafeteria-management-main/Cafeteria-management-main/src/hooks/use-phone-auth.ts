import { useState, useEffect, useCallback } from 'react';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  Auth
} from 'firebase/auth';
import { auth } from '@/lib/firebase-config';
import { toast } from 'sonner';

export const usePhoneAuth = () => {
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);

  const setupRecaptcha = useCallback((containerId: string) => {
    if ((window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier.clear();
    }

    try {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          toast.error('reCAPTCHA expired. Please try again.');
        }
      });
    } catch (error) {
      console.error('Error setting up reCAPTCHA:', error);
      toast.error('Failed to initialize reCAPTCHA.');
    }
  }, []);

  const sendOtp = async (phoneNumber: string, containerId: string) => {
    setLoading(true);

    try {
      setupRecaptcha(containerId);
      const appVerifier = (window as any).recaptchaVerifier;
      
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setVerificationId(result.verificationId);
      toast.success('OTP sent successfully!');
      return true;
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      let message = 'Failed to send OTP. Please check the phone number format.';
      if (error.code === 'auth/invalid-phone-number') message = 'Invalid phone number format.';
      if (error.code === 'auth/too-many-requests') message = 'Too many requests. Try again later.';
      
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (code: string) => {
    if (!confirmationResult) {
      toast.error('No verification in progress.');
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
      if (error.code === 'auth/code-expired') message = 'Verification code expired.';
      
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendOtp,
    verifyOtp,
    loading,
    verificationId
  };
};
