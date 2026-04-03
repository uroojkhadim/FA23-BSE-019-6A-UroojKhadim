import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, CheckCircle2, Send } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Students, Teachers, Administrators } from '@/entities';
import { registerUser } from '@/lib/emailAuth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    registrationNumber: '',
    cnicNumber: '',
    department: '',
    adminRole: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const isEmailAlreadyRegistered = async (
    collectionId: 'students' | 'teachers' | 'admins',
    emailToCheck: string,
  ) => {
    let skip = 0;
    const normalizedEmail = emailToCheck.trim().toLowerCase();

    while (true) {
      const result = await BaseCrudService.getAll<Students | Teachers | Administrators>(
        collectionId,
        undefined,
        { limit: 1000, skip },
      );

      const found = result.items.some((item) => item.email?.toLowerCase() === normalizedEmail);
      if (found) return true;
      if (!result.hasNext || result.nextSkip === null) return false;

      skip = result.nextSkip;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Check if email already exists in database
    const roleToCollection = {
      student: 'students',
      teacher: 'teachers',
      admin: 'admins',
    } as const;

    const collectionId = roleToCollection[role];
    const emailExistsInDB = await isEmailAlreadyRegistered(
      collectionId,
      formData.email
    );

    if (emailExistsInDB) {
      setError('This email is already registered with another account.');
      return;
    }

    setLoading(true);
    try {
      // Register user with Firebase
      const result = await registerUser(
        formData.email,
        formData.password,
        formData.fullName
      );

      if (result && result.user) {
        // Save user to database based on role
        const roleToCollection = {
          student: 'students',
          teacher: 'teachers',
          admin: 'admins',
        } as const;

        const collectionId = roleToCollection[role];
        
        // Prepare user data for database
        const userData: any = {
          id: result.user.uid,
          email: formData.email.toLowerCase(),
          fullName: formData.fullName,
          phoneNumber: '', // Optional, can be added later
          emailVerified: false, // Will be updated when user verifies email
          createdAt: new Date().toISOString(),
        };

        // Add role-specific fields
        if (role === 'student') {
          userData.registrationNumber = formData.registrationNumber;
          userData.department = 'CS'; // Default or from form
        } else if (role === 'teacher') {
          userData.department = formData.department;
        } else if (role === 'admin') {
          userData.adminRole = formData.adminRole;
        }

        // Save to database using BaseCrudService
        try {
          await BaseCrudService.create(collectionId, userData);
          console.log(`User saved to ${collectionId} collection`);
        } catch (dbError: any) {
          console.error('Database error:', dbError);
          // Don't fail registration if DB save fails
          // User can still login and profile can be updated later
        }

        setSuccess('✅ Registration successful! Verification email sent to your inbox.');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Please check your email and verify your account before logging in.',
              email: formData.email 
            } 
          });
        }, 3000);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Additional validation based on role
    if (role === 'student' && !formData.registrationNumber) {
      setError('Registration number is required for students');
      return;
    }

    if (role === 'teacher' && !formData.department) {
      setError('Department is required for teachers');
      return;
    }

    if (role === 'admin' && !formData.adminRole) {
      setError('Admin role is required');
      return;
    }

    // Call the main registration handler
    await handleRegister(e);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Glassmorphic Card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <h1 className="font-bold text-3xl mb-2 text-black">Create Your Account</h1>
              <p className="font-paragraph text-sm text-black/80">
                Join our cafeteria management system
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/50 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="font-paragraph text-sm text-black">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-500/20 backdrop-blur-sm border border-green-500/50 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="font-paragraph text-sm text-black">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-3">
                <label className="font-paragraph text-sm uppercase tracking-wide text-black mb-2 block">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-300 rounded-lg font-paragraph text-base text-black placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-3">
                <label className="font-paragraph text-sm uppercase tracking-wide text-black mb-2 block">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-300 rounded-lg font-paragraph text-base text-black placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-3">
                <label className="font-paragraph text-sm uppercase tracking-wide text-black mb-2 block">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="At least 6 characters"
                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-300 rounded-lg font-paragraph text-base text-black placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-3">
                <label className="font-paragraph text-sm uppercase tracking-wide text-black mb-2 block">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter your password"
                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-300 rounded-lg font-paragraph text-base text-black placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="font-paragraph text-sm uppercase tracking-wide text-black mb-2 block">
                  Select Role *
                </label>
                <select
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'student' | 'teacher' | 'admin')}
                  className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-lg font-paragraph text-base text-black focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Select your role</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {/* Role-Specific Fields */}
              {role === 'student' && (
                <div className="space-y-3">
                  <label className="font-paragraph text-sm uppercase tracking-wide text-black mb-2 block">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., FA23-BSE-001"
                    className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-lg font-paragraph text-base text-black placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              )}

              {role === 'teacher' && (
                <div className="space-y-3">
                  <label className="font-paragraph text-sm uppercase tracking-wide text-black mb-2 block">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-lg font-paragraph text-base text-black focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="CS">Computer Science</option>
                    <option value="SE">Software Engineering</option>
                    <option value="IT">Information Technology</option>
                    <option value="EE">Electrical Engineering</option>
                  </select>
                </div>
              )}

              {role === 'admin' && (
                <div className="space-y-3">
                  <label className="font-paragraph text-sm uppercase tracking-wide text-black mb-2 block">
                    Admin Role *
                  </label>
                  <select
                    name="adminRole"
                    value={formData.adminRole}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-lg font-paragraph text-base text-black focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  >
                    <option value="">Select Admin Role</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-white rounded-lg font-paragraph text-base uppercase tracking-wide hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>

              {/* Login Link */}
              <p className="font-paragraph text-sm text-center text-black/70">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
