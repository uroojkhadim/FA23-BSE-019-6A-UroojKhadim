import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, Utensils } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Cart from '@/components/Cart';
import { useAuthStore } from '@/store/authStore';
import { getNavItemsForRole } from '@/lib/access';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const navLinks = getNavItemsForRole(user?.role);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-slate-50/95 via-white/90 to-slate-50/95 backdrop-blur-xl border-b border-slate-200/50 z-50 shadow-sm transition-all duration-300">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="group flex items-center gap-2 font-heading text-lg md:text-xl text-foreground uppercase tracking-tight hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={1.5} />
              </div>
              <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900">Comsats Cafeteria</span>
              <span className="sm:hidden bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900">Cafeteria</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2 lg:gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative font-paragraph text-xs sm:text-sm uppercase tracking-wide px-4 py-2 rounded-lg transition-all ${
                    isActive(link.path)
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-blue-50 rounded-lg -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* User Section */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl border border-slate-200/50 shadow-sm">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-paragraph text-[10px] uppercase tracking-wide text-slate-500">
                        {user.role}
                      </span>
                      <span className="font-paragraph text-xs font-bold text-slate-900">
                        {user.fullName}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-paragraph text-xs uppercase tracking-wide hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="group px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-paragraph text-xs uppercase tracking-wide hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-semibold"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" strokeWidth={1.5} />
              ) : (
                <Menu className="w-6 h-6" strokeWidth={1.5} />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.nav 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden py-4 border-t border-slate-200/50"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-paragraph text-sm uppercase tracking-wide px-4 py-3 rounded-lg transition-all ${
                      isActive(link.path)
                        ? 'text-blue-600 bg-blue-50 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {user ? (
                  <>
                    <div className="mx-4 mt-2 p-4 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl border border-slate-200/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-paragraph text-xs uppercase tracking-wide text-slate-500">
                            {user.role}
                          </span>
                          <span className="font-paragraph text-sm font-bold text-slate-900">
                            {user.fullName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="mx-4 mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-paragraph text-sm uppercase tracking-wide hover:from-red-600 hover:to-red-700 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mx-4 mt-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-paragraph text-sm uppercase tracking-wide hover:from-blue-700 hover:to-blue-800 transition-all text-center font-semibold"
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.nav>
          )}
        </div>
      </header>
      {(user?.role === 'student' || !user) && <Cart />}
    </>
  );
}
