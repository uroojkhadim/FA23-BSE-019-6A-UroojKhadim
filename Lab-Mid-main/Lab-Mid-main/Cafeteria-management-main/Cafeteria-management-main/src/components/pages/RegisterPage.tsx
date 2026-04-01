import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, AlertCircle, CheckCircle2, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Students, Teachers, Administrators } from '@/entities';
import axios from 'axios';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    whatsappNumber: '',
    registrationNumber: '',
    cnicNumber: '',
    department: '',
    adminRole: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

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
    if (name === 'phoneNumber') {
      setPhoneVerified(false);
      setCodeSent(false);
      setVerificationCode('');
    }
  };

  const handleSendVerificationCode = async () => {
    setError('');
    setSuccess('');

    if (!formData.phoneNumber) {
      setError('Enter a valid phone number before requesting verification.');
      return;
    }

    setIsSendingCode(true);
    try {
      // Use backend WhatsApp API
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/whatsapp/send-otp`, {
        phoneNumber: formData.phoneNumber,
        role: role.toUpperCase()
      });
      
      if (response.data.success) {
        setCodeSent(true);
        setPhoneVerified(false);
        setSuccess('Verification code sent to your WhatsApp number!');
      }
    } catch (sendError: any) {
      console.error('Send OTP Error:', sendError);
      const errorMessage = sendError.response?.data?.message || sendError.message || 'Failed to send verification code.';
      setError(errorMessage);
      
      // Fallback: For testing, allow manual bypass
      if (import.meta.env.DEV) {
        console.log('DEV MODE: Check backend console for OTP');
        setCodeSent(true);
        setSuccess('DEV MODE: Check backend server console for OTP code');
      }
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyPhone = async () => {
    setError('');
    setSuccess('');

    if (!codeSent) {
      setError('Request a verification code first.');
      return;
    }

    if (!verificationCode.trim()) {
      setError('Enter the verification code.');
      return;
    }

    setIsVerifyingCode(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/whatsapp/verify-otp`, {
        phoneNumber: formData.phoneNumber,
        otp: verificationCode.trim()
      });
      
      if (response.data.success) {
        setPhoneVerified(true);
        setSuccess('Phone number verified successfully!');
      }
    } catch (verifyError: any) {
      console.error('Verify Error:', verifyError);
      const errorMessage = verifyError.response?.data?.message || verifyError.message || 'Failed to verify code.';
      setError(errorMessage);
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validation
      if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.whatsappNumber) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
      }

      if (!phoneVerified) {
        setError('Please verify your phone number before creating the account.');
        setLoading(false);
        return;
      }

      if (role === 'student' && !formData.registrationNumber) {
        setError('Registration number is required for students.');
        setLoading(false);
        return;
      }

      if ((role === 'teacher' || role === 'admin') && !formData.cnicNumber) {
        setError('CNIC number is required for teachers and admins.');
        setLoading(false);
        return;
      }

      const collectionId = role === 'student' ? 'students' : role === 'teacher' ? 'teachers' : 'admins';
      const emailTaken = await isEmailAlreadyRegistered(collectionId, formData.email);
      if (emailTaken) {
        setError('An account with this email already exists for the selected role.');
        setLoading(false);
        return;
      }

      if (role === 'student') {
        const studentData: Students = {
          _id: crypto.randomUUID(),
          fullName: formData.fullName,
          email: formData.email,
          role: 'student',
          registrationNumber: formData.registrationNumber,
          contactNumber: formData.phoneNumber,
          universityName: 'Comsats University',
        };
        await BaseCrudService.create('students', studentData);
      } else if (role === 'teacher') {
        const teacherData: Teachers = {
          _id: crypto.randomUUID(),
          fullName: formData.fullName,
          email: formData.email,
          role: 'teacher',
          cnicNumber: formData.cnicNumber,
          department: formData.department || undefined,
          phoneNumber: formData.phoneNumber,
        };
        await BaseCrudService.create('teachers', teacherData);
      } else {
        const adminData: Administrators = {
          _id: crypto.randomUUID(),
          fullName: formData.fullName,
          email: formData.email,
          cnicNumber: formData.cnicNumber,
          adminRole: formData.adminRole || undefined,
          phoneNumber: formData.phoneNumber,
          universityName: 'Comsats University',
        };
        await BaseCrudService.create('admins', adminData);
      }

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-foreground">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 pt-20 pb-12">
        <div className="w-full max-w-2xl">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="font-heading text-4xl uppercase tracking-tight mb-2">
              COMSATS Cafeteria
            </h1>
            <p className="font-paragraph text-secondary-foreground">
              Create a Campus Account
            </p>
          </div>

          {/* Register Card */}
          <div className="bg-background rounded-lg shadow-lg p-8 border border-secondary">
            <h2 className="font-heading text-2xl uppercase tracking-wide mb-6 text-center">
              Register
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="font-paragraph text-sm text-destructive">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="font-paragraph text-sm text-green-700">{success}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="font-paragraph text-sm uppercase tracking-wide text-secondary-foreground mb-3 block">
                  Select Your Role
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['student', 'teacher', 'admin'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r as 'student' | 'teacher' | 'admin')}
                      className={`py-3 px-4 rounded-lg font-paragraph text-sm uppercase tracking-wide transition-all ${
                        role === r
                          ? 'bg-primary text-primary-foreground border-2 border-primary'
                          : 'bg-secondary/20 text-foreground border-2 border-secondary hover:border-primary'
                      }`}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="font-paragraph text-sm uppercase tracking-wide text-secondary-foreground mb-2 block">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-foreground" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Your Full Name"
                    className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="font-paragraph text-sm uppercase tracking-wide text-secondary-foreground mb-2 block">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-foreground" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@comsats.edu.pk"
                    className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="font-paragraph text-sm uppercase tracking-wide text-secondary-foreground mb-2 block">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-foreground" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+92 300 1234567"
                    className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="font-paragraph text-sm uppercase tracking-wide text-secondary-foreground mb-2 block">
                  WhatsApp Number *
                </label>
                <div className="relative">
                  <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-foreground" />
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    placeholder="+92 300 1234567"
                    className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    disabled={isSendingCode}
                    className="px-4 py-3 bg-transparent border border-secondary rounded-lg font-paragraph text-sm uppercase tracking-wide hover:border-primary transition-colors disabled:opacity-50"
                  >
                    {isSendingCode ? 'Sending...' : 'Send Verification Code'}
                  </button>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="flex-1 px-4 py-3 border border-secondary rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    disabled={!codeSent}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyPhone}
                    disabled={isVerifyingCode || !codeSent}
                    className="px-4 py-3 bg-primary text-primary-foreground rounded-lg font-paragraph text-sm uppercase tracking-wide hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    {isVerifyingCode ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
                <p className={`font-paragraph text-xs ${phoneVerified ? 'text-green-700' : 'text-secondary-foreground'}`}>
                  {phoneVerified ? '✓ Phone verified via WhatsApp' : 'We will send a verification code to your WhatsApp number'}
                </p>
              </div>

              {/* Role-Specific Fields */}
              {role === 'student' && (
                <div>
                  <label className="font-paragraph text-sm uppercase tracking-wide text-secondary-foreground mb-2 block">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., COMSATS-2024-001"
                    className="w-full px-4 py-3 border border-secondary rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              )}

              {role === 'teacher' && (
                <>
                  <div>
                    <label className="font-paragraph text-sm uppercase tracking-wide text-secondary-foreground mb-2 block">
                      CNIC Number *
                    </label>
                    <input
                      type="text"
                      name="cnicNumber"
                      value={formData.cnicNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., 12345-6789012-3"
                      className="w-full px-4 py-3 border border-secondary rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-paragraph text-sm uppercase tracking-wide text-secondary-foreground mb-2 block">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="e.g., Computer Science"
                      className="w-full px-4 py-3 border border-secondary rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </>
              )}

              {role === 'admin' && (
                <>
                  <div>
                    <label className="font-paragraph text-sm uppercase tracking-wide text-secondary-foreground mb-2 block">
                      CNIC Number *
                    </label>
                    <input
                      type="text"
                      name="cnicNumber"
                      value={formData.cnicNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., 12345-6789012-3"
                      className="w-full px-4 py-3 border border-secondary rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-paragraph text-sm uppercase tracking-wide text-secondary-foreground mb-2 block">
                      Admin Role
                    </label>
                    <select
                      name="adminRole"
                      value={formData.adminRole}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-secondary rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option value="">Select Admin Role</option>
                      <option value="cafeteria-manager">Cafeteria Manager</option>
                      <option value="inventory-manager">Inventory Manager</option>
                      <option value="finance-manager">Finance Manager</option>
                      <option value="super-admin">Super Admin</option>
                    </select>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-primary text-primary-foreground font-paragraph text-sm uppercase tracking-widest rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-[1px] bg-secondary" />
              <span className="font-paragraph text-xs text-secondary-foreground uppercase">Or</span>
              <div className="flex-1 h-[1px] bg-secondary" />
            </div>

            {/* Login Link */}
            <p className="font-paragraph text-sm text-center text-secondary-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-blue-700 font-semibold transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
