import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Phone, 
  ShieldCheck, 
  MessageSquare, 
  PhoneCall, 
  ArrowRight, 
  RefreshCcw, 
  Loader2, 
  AlertCircle, 
  CircleCheck 
} from 'lucide-react';
import { usePhoneAuth } from '@/hooks/use-phone-auth';
import { validatePakistaniPhone, formatPhoneNumber } from '@/lib/phoneValidator';

const PhoneLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, loading: isPhoneLoading } = usePhoneAuth();
  
  const [step, setStep] = useState(1); // 1: Phone & Method, 2: OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpMethod, setOtpMethod] = useState<'sms' | 'call'>('sms');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(0);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer logic for Resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle Phone Number Submit
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePakistaniPhone(phoneNumber)) {
      setError('Please enter a valid phone number (e.g. +923XXXXXXXXXX).');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      if (otpMethod === 'sms') {
        // Use Firebase for SMS OTP
        const success = await sendOtp(formatPhoneNumber(phoneNumber), 'recaptcha-container');
        if (success) {
          setStep(2);
          setTimer(30);
        } else {
          setError('Failed to send SMS. Please try Call option or check your connection.');
        }
      } else {
        // Use Twilio for Call OTP
        const formattedNumber = formatPhoneNumber(phoneNumber);
        const response = await axios.post('http://localhost:5000/api/phone-auth/send-call-otp', {
          phoneNumber: formattedNumber
        });

        if (response.data.success) {
          setStep(2);
          setTimer(30);
        }
      }
    } catch (err: any) {
      console.error('Send OTP Error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to send OTP. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // OTP Input Handlers
  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Final Verification
  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (otpMethod === 'sms') {
        // Firebase verification
        const fbUser = await verifyOtp(otpCode);
        if (fbUser) {
          setSuccess('Verification Successful! Redirecting...');
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          setError('Invalid or expired OTP.');
        }
      } else {
        // Twilio call verification
        const formattedNumber = formatPhoneNumber(phoneNumber);
        const response = await axios.post('http://localhost:5000/api/phone-auth/verify-otp', {
          phoneNumber: formattedNumber,
          otp: otpCode
        });

        if (response.data.success) {
          setSuccess('Verification Successful! Redirecting...');
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        }
      }
    } catch (err: any) {
      console.error('Verification Error:', err);
      const errorMessage = err.response?.data?.message || 'Invalid or expired OTP.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    
    try {
      const formattedNumber = formatPhoneNumber(phoneNumber);
      
      if (otpMethod === 'sms') {
        // For SMS, just trigger Firebase again
        const success = await sendOtp(formattedNumber, 'recaptcha-container');
        if (success) {
          setTimer(30);
        }
      } else {
        // For Call, use backend resend endpoint
        const response = await axios.post('http://localhost:5000/api/phone-auth/resend-otp', {
          phoneNumber: formattedNumber,
          method: 'call'
        });

        if (response.data.success) {
          setTimer(30);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-slate-100 p-6 selection:bg-blue-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-emerald-600/10 blur-[100px] rounded-full delay-700 animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-10 shadow-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                className="space-y-8"
              >
                <header className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-500/10 text-blue-400 mb-2 relative">
                    <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20" />
                    <Phone className="w-10 h-10 relative z-10" />
                  </div>
                  <h1 className="text-4xl font-extrabold tracking-tight">Phone Verification</h1>
                  <p className="text-slate-400 font-medium">Choose how you want to receive OTP</p>
                </header>

                <div className="space-y-6">
                  {/* Phone Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-mono transition-colors group-focus-within:text-blue-400 font-bold">+</div>
                      <input 
                        type="text"
                        placeholder="923XXXXXXXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-5 pl-10 pr-6 focus:ring-2 focus:ring-blue-500/40 outline-none transition-all placeholder:text-slate-700 font-mono text-lg tracking-wider"
                      />
                    </div>
                  </div>

                  {/* OTP Method Selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Receive OTP Via</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setOtpMethod('sms')}
                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 ${
                          otpMethod === 'sms'
                            ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-lg shadow-blue-500/20'
                            : 'bg-slate-900/30 border-white/5 text-slate-400 hover:border-white/10'
                        }`}
                      >
                        <MessageSquare className="w-8 h-8" />
                        <span className="text-sm font-bold uppercase tracking-wider">SMS</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOtpMethod('call')}
                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 ${
                          otpMethod === 'call'
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-lg shadow-emerald-500/20'
                            : 'bg-slate-900/30 border-white/5 text-slate-400 hover:border-white/10'
                        }`}
                      >
                        <PhoneCall className="w-8 h-8" />
                        <span className="text-sm font-bold uppercase tracking-wider">Voice Call</span>
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex items-start gap-3 text-rose-400 text-sm bg-rose-400/10 p-4 rounded-2xl border border-rose-400/20">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <span className="font-medium leading-relaxed">{error}</span>
                    </motion.div>
                  )}

                  <button 
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 text-white font-bold h-16 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/20 group"
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <span className="tracking-wide">SEND OTP VIA {otpMethod.toUpperCase()}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  
                  <div id="recaptcha-container" className="flex justify-center"></div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="space-y-8"
              >
                <header className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-400 mb-2 relative">
                    <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-20" />
                    <ShieldCheck className="w-10 h-10 relative z-10" />
                  </div>
                  <h1 className="text-4xl font-extrabold tracking-tight">Enter OTP</h1>
                  <p className="text-slate-400 font-medium">
                    {otpMethod === 'sms' ? 'SMS' : 'Call'} sent to <span className="text-slate-100 font-bold">+{phoneNumber}</span>
                  </p>
                  <button onClick={() => setStep(1)} className="text-blue-400 text-xs font-bold hover:underline underline-offset-4">Change Number</button>
                </header>

                <div className="space-y-8">
                  {/* OTP Boxes */}
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-16 sm:w-14 sm:h-20 bg-slate-900/50 border border-white/10 rounded-2xl text-center text-3xl font-black focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all shadow-inner"
                      />
                    ))}
                  </div>

                  <div className="space-y-4">
                    {error && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3 text-rose-400 text-sm bg-rose-400/10 p-4 rounded-2xl border border-rose-400/20">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <span className="font-medium">{error}</span>
                      </motion.div>
                    )}

                    {success && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3 text-emerald-400 text-sm bg-emerald-400/10 p-4 rounded-2xl border border-emerald-400/20">
                        <CircleCheck className="w-5 h-5 shrink-0 mt-0.5" />
                        <span className="font-bold">{success}</span>
                      </motion.div>
                    )}

                    <div className="space-y-4">
                      <button 
                        onClick={handleVerify}
                        disabled={loading || !!success}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 text-white font-bold h-16 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-900/20"
                      >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "VERIFY NOW"}
                      </button>

                      <div className="text-center">
                        {timer > 0 ? (
                          <p className="text-slate-500 text-sm font-medium">Resend available in <span className="text-slate-300 font-mono tracking-tighter">{timer}s</span></p>
                        ) : (
                          <button 
                            onClick={handleResendOTP}
                            disabled={loading}
                            className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-2 mx-auto focus:outline-none disabled:opacity-50"
                          >
                            <RefreshCcw className="w-4 h-4" /> RESEND OTP
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="mt-12 flex items-center justify-center gap-2 border-t border-white/5 pt-8">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500">Secure Authentication</span>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};

export default PhoneLoginPage;
