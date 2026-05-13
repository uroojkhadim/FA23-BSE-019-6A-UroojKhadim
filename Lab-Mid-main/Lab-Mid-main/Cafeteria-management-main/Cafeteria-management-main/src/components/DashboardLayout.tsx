import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingBag, 
  CreditCard, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut, 
  Search, 
  Menu, 
  X,
  ChevronRight,
  User,
  History,
  Coffee,
  Wallet
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { logoutUser } from '@/lib/emailAuth';
import { ScrollToTop } from '@/lib/scroll-to-top';
import { motion, AnimatePresence } from 'framer-motion';
import ComsatsLogo from '@/components/ui/ComsatsLogo';

const DashboardLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const navItems = [
    // Super Admin Nav (System Level)
    { to: '/super-admin/dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['super_admin'] },
    { to: '/admin', label: 'System Management', icon: <Settings className="w-5 h-5" />, roles: ['super_admin'] },
    
    // Admin Nav (Operational & Team Management)
    { to: '/admin/dashboard', label: 'Admin Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['admin'] },
    { to: '/pos', label: 'POS Terminal', icon: <ShoppingBag className="w-5 h-5" />, roles: ['admin', 'staff'] },
    { to: '/admin', label: 'Cafe Management', icon: <Settings className="w-5 h-5" />, roles: ['admin'] },
    
    // Common Operational Nav
    { to: '/menu', label: 'Menu', icon: <Coffee className="w-5 h-5" />, roles: ['student', 'teacher', 'admin', 'super_admin', 'staff', 'university_staff'] },
    { to: '/orders', label: 'Orders', icon: <History className="w-5 h-5" />, roles: ['student', 'teacher', 'admin', 'super_admin', 'staff', 'university_staff'] },
    
    // Finance/Credit Nav
    { to: '/credit', label: 'Credit (Udhar)', icon: <Wallet className="w-5 h-5" />, roles: ['student', 'teacher', 'university_staff'] },
    { to: '/notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, roles: ['student', 'teacher', 'admin', 'super_admin', 'staff', 'university_staff'] },
    { to: '/profile', label: 'Profile', icon: <User className="w-5 h-5" />, roles: ['student', 'teacher', 'admin', 'super_admin', 'staff', 'university_staff'] },
    
    // Portal specific
    { to: '/teacher/dashboard', label: 'Faculty Portal', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['teacher'] },
    { to: '/university-staff/dashboard', label: 'Staff Portal', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['university_staff'] },
    { to: '/staff/dashboard', label: 'Operations Portal', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['staff'] },
  ];




  const filteredNavItems = navItems.filter(item => user && item.roles.includes(user.role));

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo Section */}
      <div className={`flex items-center gap-3 px-6 py-8 border-b border-gray-100 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
        <ComsatsLogo size={isSidebarCollapsed ? "sm" : "md"} />
        {!isSidebarCollapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-[#0ea5e9] leading-none">COMSATS</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Cafeteria Portal</span>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-[#0ea5e9] text-white shadow-md' 
                  : 'text-gray-600 hover:bg-sky-50 hover:text-[#0ea5e9]'
              }`}
            >
              <div className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#0ea5e9]'}`}>
                {item.icon}
              </div>
              {!isSidebarCollapsed && (
                <span className="font-medium text-sm">
                  {item.label}
                </span>
              )}
              {isActive && !isSidebarCollapsed && (
                <ChevronRight className="ml-auto w-4 h-4 opacity-50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-100">
        {!isSidebarCollapsed && (
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-[#0ea5e9] flex items-center justify-center text-white font-bold">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-sm text-gray-900 truncate">{user?.fullName}</span>
                <span className="text-xs text-gray-500 truncate capitalize">{user?.role?.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${isSidebarCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5" />
          {!isSidebarCollapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ScrollToTop />

      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col transition-all duration-300 ease-in-out z-30 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed inset-y-0 left-0 w-72 z-50 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg hidden md:block"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center bg-gray-100 rounded-lg px-3 py-1.5 w-64 md:w-96">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-bold text-gray-900 leading-none">{user?.fullName}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{user?.role}</span>
              </div>
              <div className="h-10 w-10 rounded-full border-2 border-[#0ea5e9]/20 p-0.5">
                <div className="h-full w-full rounded-full bg-[#0ea5e9] flex items-center justify-center text-white font-bold text-sm">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;