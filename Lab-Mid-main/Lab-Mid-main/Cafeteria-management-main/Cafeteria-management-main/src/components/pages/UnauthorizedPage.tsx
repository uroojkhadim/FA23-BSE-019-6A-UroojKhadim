import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-200 text-center"
      >
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-8">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to="/dashboard"
            className="w-full py-3 bg-[#0ea5e9] text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[#0284c7] transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/login"
            className="w-full py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}