import React, { useState } from 'react';
import axios from 'axios';
import { Send, Phone, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const WhatsAppSender = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const validatePhoneNumber = (number) => {
    // Basic E.164 validation (digits only, 10-15 chars)
    const regex = /^\d{10,15}$/;
    return regex.test(number);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!validatePhoneNumber(phoneNumber)) {
      setStatus({ 
        type: 'error', 
        message: 'Please enter a valid phone number (10-15 digits, no "+" or spaces).' 
      });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await axios.post('http://localhost:5000/api/whatsapp/send', {
        phoneNumber: phoneNumber,
        templateName: 'hello_world', // You can change this to your approved template
        languageCode: 'en_US'
      });

      if (response.data.success) {
        setStatus({ 
          type: 'success', 
          message: 'WhatsApp notification sent successfully!' 
        });
        setPhoneNumber('');
      }
    } catch (error) {
      console.error('Frontend Error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to send notification. Check console for details.';
      setStatus({ 
        type: 'error', 
        message: errorMsg 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="w-full max-w-md">
        {/* Glassmorphism Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                <Send className="text-white w-8 h-8" />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-white tracking-tight">WhatsApp Notify</h2>
              <p className="mt-2 text-blue-200/70 text-sm text-center">
                Send instant notifications via Meta Cloud API
              </p>
            </div>

            <form onSubmit={handleSend} className="space-y-6">
              <div className="relative">
                <label className="block text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2 ml-1">
                  Recipient Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 15550001234"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
                <p className="mt-2 text-[10px] text-blue-300/50 italic ml-1">
                  * Format: Country Code + Number (e.g., 14155552671)
                </p>
              </div>

              {status.message && (
                <div className={`flex items-start p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300 ${
                  status.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                }`}>
                  {status.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 mr-3 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                  )}
                  <p className="text-sm font-medium">{status.message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full relative group/btn overflow-hidden rounded-xl p-[2px] focus:outline-none disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl" />
                <div className="relative px-6 py-4 bg-slate-900 rounded-[10px] group-hover/btn:bg-transparent transition-all duration-300">
                  <div className="flex items-center justify-center space-x-2">
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                    ) : (
                      <>
                        <span className="text-white font-bold tracking-wide">SEND NOTIFICATION</span>
                        <Send className="w-4 h-4 text-white group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </div>
                </div>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex items-center justify-center space-x-2 text-[10px] text-blue-300/40 uppercase tracking-[0.2em] font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Meta API v21.0 Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppSender;
