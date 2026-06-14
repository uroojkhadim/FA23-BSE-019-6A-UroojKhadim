import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Stethoscope, Home, Calendar, Pill, FileText, User, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function DoctorLayout({ children }) {
  const { userData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r p-6 flex flex-col">
        <div className="flex items-center gap-2 text-xl font-bold text-primary mb-8">
          <Stethoscope size={28} />
          Doctor Hub
        </div>
        <nav className="flex-1 space-y-2">
          <Link to="/doctor" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-primary">
            <Home size={20} />
            <span>Overview</span>
          </Link>
          <Link to="/doctor/clinics" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-gray-100">
            <Home size={20} />
            <span>Clinics</span>
          </Link>
          <Link to="/doctor/schedule" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-gray-100">
            <Calendar size={20} />
            <span>Schedule</span>
          </Link>
          <Link to="/doctor/appointments" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-gray-100">
            <Calendar size={20} />
            <span>Appointments</span>
          </Link>
          <Link to="/doctor/records" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-gray-100">
            <FileText size={20} />
            <span>Records</span>
          </Link>
          <Link to="/doctor/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-gray-100">
            <User size={20} />
            <span>Profile</span>
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-accent">
            Hello, Dr. {userData?.name || 'Doctor'}!
          </h1>
        </div>
        {children}
      </main>
    </div>
  );
}
