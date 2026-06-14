import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Stethoscope, BarChart3, Users, Stethoscope as Doctor, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function AdminLayout({ children }) {
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
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-primary">
            <BarChart3 size={20} />
            <span>Analytics</span>
          </Link>
          <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-gray-100">
            <Users size={20} />
            <span>Users</span>
          </Link>
          <Link to="/admin/doctors" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-gray-100">
            <Doctor size={20} />
            <span>Doctors</span>
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
            Hello, Admin!
          </h1>
        </div>
        {children}
      </main>
    </div>
  );
}
