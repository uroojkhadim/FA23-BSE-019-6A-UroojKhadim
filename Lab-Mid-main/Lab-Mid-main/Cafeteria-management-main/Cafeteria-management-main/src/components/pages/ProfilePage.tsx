import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Shield, Camera, Save, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase-config';
import { updatePassword, updateProfile } from 'firebase/auth';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [registrationNumber, setRegistrationNumber] = useState(user?.registrationNumber || '');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdatingProfile(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        fullName,
        phoneNumber,
        department,
        registrationNumber
      });
      
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: fullName });
      }
      
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        toast.success('Password changed successfully!');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password. You may need to re-login.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground uppercase tracking-tight">
          Account Settings
        </h1>
        <p className="text-secondary-foreground font-paragraph text-sm mt-1">
          Manage your personal information and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="h-24 bg-primary relative">
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-xl bg-sky-50 flex items-center justify-center text-primary font-bold text-3xl relative group cursor-pointer">
                  {fullName.charAt(0)}
                  <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-16 p-8 text-center space-y-2">
              <h2 className="text-xl font-bold text-slate-900">{fullName}</h2>
              <p className="text-xs text-primary font-bold uppercase tracking-widest">{user?.role?.replace('_', ' ')}</p>
              <div className="flex items-center justify-center gap-2 text-slate-400 text-xs pt-4">
                <Shield className="w-3 h-3 text-sky-500" />
                <span>COMSATS Verified Student</span>
              </div>
            </div>
          </div>

          <div className="bg-sky-50 rounded-3xl border border-sky-100 p-6 space-y-4">
            <div className="flex items-center gap-3 text-sky-700">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold text-sm">Account Status</h3>
            </div>
            <p className="text-xs text-sky-600 leading-relaxed">
              Your account is active and in good standing. You can place orders using cash, online payment, or credit.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Form */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <h3 className="font-heading text-lg font-bold text-slate-900 uppercase">Personal Information</h3>
              </div>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-primary focus:ring-0 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="email" 
                      value={user?.email || ''} 
                      disabled
                      className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="tel" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+92 3XX XXXXXXX"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-primary focus:ring-0 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-1">Registration #</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="text" 
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      placeholder="CIIT/FA20-BSE-XXX/ISB"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-primary focus:ring-0 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-1">Department</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="text" 
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Computer Science, Management, etc."
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-primary focus:ring-0 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:shadow-lg shadow-primary/20 transition-all disabled:bg-slate-300"
                >
                  {isUpdatingProfile ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Password Form */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-primary" />
                <h3 className="font-heading text-lg font-bold text-slate-900 uppercase">Change Password</h3>
              </div>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-1">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-primary focus:ring-0 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-primary focus:ring-0 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:shadow-lg transition-all disabled:bg-slate-300"
                >
                  {isUpdatingPassword ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
