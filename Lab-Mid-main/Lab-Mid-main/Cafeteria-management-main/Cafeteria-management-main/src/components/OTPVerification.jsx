import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ShieldCheck, ArrowRight, RefreshCcw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const OTPVerification = () => {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(0);
  
  const otpRefs = useRef([]);

  // Handle Resend Timer
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle Phone Submit
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setError('Please enter a valid phone number.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/whatsapp/send-otp', {
        phoneNumber: phoneNumber
      });

      if (response.data.success) {
        setStep(2);
        setTimer(30);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Ensure your number is verified in Meta Sandbox.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Input Change
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  // Handle Verification
  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/whatsapp/verify-otp', {
        phoneNumber: phoneNumber,
        otp: otpCode
      });

      if (response.data.success) {
        setSuccess('Verification Successful!');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-4 font-sans">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 mb-4">
                  <Phone className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Phone Verification</h1>
                <p className="text-gray-400 text-sm">Enter your phone number to receive an OTP via WhatsApp</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono">+</span>
                  <input 
                    type="text"
                    placeholder="923XXXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-8 pr-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                  />
                </div>

                {error && (
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-rose-400 text-sm bg-rose-400/10 p-3 rounded-lg border border-rose-400/20">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <button 
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Code <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Enter OTP</h1>
                <p className="text-gray-400 text-sm">We've sent a 6-digit code to <span className="text-white">+{phoneNumber}</span></p>
                <button 
                  onClick={() => setStep(1)}
                  className="text-blue-400 text-xs hover:underline"
                >
                  Change Number
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 bg-black/40 border border-white/10 rounded-xl text-center text-xl font-bold focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                    />
                  ))}
                </div>

                {error && (
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-rose-400 text-sm bg-rose-400/10 p-3 rounded-lg border border-rose-400/20">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-400/10 p-3 rounded-lg border border-emerald-400/20">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{success}</span>
                  </motion.div>
                )}

                <div className="space-y-3">
                  <button 
                    onClick={handleVerify}
                    disabled={loading || !!success}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Now"}
                  </button>

                  <div className="text-center">
                    {timer > 0 ? (
                      <p className="text-gray-500 text-sm italic">Resend available in {timer}s</p>
                    ) : (
                      <button 
                        onClick={handleSendOTP}
                        className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center justify-center gap-2 mx-auto"
                      >
                        <RefreshCcw className="w-4 h-4" /> Resend Code
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">Meta WhatsApp Secure</span>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPVerification;
