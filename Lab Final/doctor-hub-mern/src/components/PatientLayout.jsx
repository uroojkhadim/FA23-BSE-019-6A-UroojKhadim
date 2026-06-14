import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Stethoscope, Home, Calendar, CreditCard, FileText, Pill, User, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function PatientLayout({ children }) {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navItems = [
    { path: '/patient', icon: Home, label: 'Overview' },
    { path: '/patient/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/patient/payments', icon: CreditCard, label: 'Payments' },
    { path: '/patient/history', icon: FileText, label: 'Medical History' },
    { path: '/patient/prescriptions', icon: Pill, label: 'Prescriptions' },
    { path: '/patient/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r p-6 flex flex-col">
        <div className="flex items-center gap-2 text-xl font-bold text-primary mb-8">
          <Stethoscope size={28} />
          Doctor Hub
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                location.pathname === item.path ? 'bg-blue-50 text-primary' : 'text-muted hover:bg-gray-100'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
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
            Hello, {userData?.name || 'Patient'}!
          </h1>
          <p className="text-muted">Welcome back to your dashboard</p>
        </div>
        {children}
      </main>
    </div>
  );
}
