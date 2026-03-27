import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api.js';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Smartphone, Hash, UserPlus, Coffee, ArrowRight, Github } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    rollNo: '',
    whatsapp: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed: ' + err.message);
    }
  };

  return (
    <div className="auth-split">
      {/* Visual Side */}
      <div className="auth-visual">
        <div className="absolute inset-0 bg-secondary/10 mix-blend-overlay z-10"></div>
        <img 
          src="/cafe-bg.png" 
          alt="Cafe Interior" 
          className="auth-visual-image"
        />
        <div className="auth-visual-overlay"></div>
        <div className="absolute inset-0 flex flex-col justify-center p-24 z-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-8xl font-black text-white leading-[0.9]">
              Join the <br /> 
              <span className="gradient-text">Elite.</span>
            </h1>
            <p className="text-text-secondary text-2xl mt-8 max-w-lg leading-relaxed font-medium">
              Begin your journey with the most advanced cafeteria digital ecosystem.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl space-y-10"
        >
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-[20px] flex items-center justify-center mb-8 shadow-2xl shadow-primary/20">
              <Coffee size={32} className="text-white" />
            </div>
            <h2 className="text-5xl font-black tracking-tight mb-2">Create <span className="gradient-text">Account</span></h2>
            <p className="text-text-secondary font-semibold">Join the future of cafeteria services</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-text-secondary ml-1">Full Name</label>
              <div className="relative group">
                <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" className="modern-input pl-14" placeholder="John Doe"
                  onChange={(e) => setFormData({...formData, name: e.target.value})} required
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-text-secondary ml-1">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" className="modern-input pl-14" placeholder="john@example.com"
                  onChange={(e) => setFormData({...formData, email: e.target.value})} required
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-text-secondary ml-1">Access Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" className="modern-input pl-14" placeholder="••••••••"
                  onChange={(e) => setFormData({...formData, password: e.target.value})} required
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-text-secondary ml-1">Selection Role</label>
              <div className="relative group">
                <UserPlus size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                <select 
                  className="modern-input pl-14 bg-bg-deep appearance-none cursor-pointer"
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="staff">Cafe Staff</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-text-secondary ml-1">
                {formData.role === 'staff' ? 'Identification ID' : 'Institutional Roll No'}
              </label>
              <div className="relative group">
                <Hash size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" className="modern-input pl-14" placeholder={formData.role === 'staff' ? 'STAFF-001' : 'ROLL-2023'}
                  onChange={(e) => setFormData({...formData, rollNo: e.target.value})} required
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-text-secondary ml-1">WhatsApp Connect</label>
              <div className="relative group">
                <Smartphone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" className="modern-input pl-14" placeholder="+92 3XX XXXXXXX"
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                />
              </div>
            </div>

            <div className="md:col-span-2 pt-8">
              <button type="submit" className="btn-vibrant w-full py-6 text-xl group shadow-2xl shadow-primary/20">
                 Initialize Account <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          <p className="text-center lg:text-left text-text-secondary font-medium mt-10">
            Already registered? <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">Sign into portal</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
