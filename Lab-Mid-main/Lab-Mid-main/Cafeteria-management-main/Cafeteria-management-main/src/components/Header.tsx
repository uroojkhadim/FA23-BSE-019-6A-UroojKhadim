import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
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
      <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur border-b border-secondary z-50 shadow-sm">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="font-heading text-lg md:text-xl text-foreground uppercase tracking-tight">
              <span className="hidden sm:inline">Comsats Cafeteria</span>
              <span className="sm:hidden">Cafeteria</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-paragraph text-sm uppercase tracking-wide transition-colors ${
                    isActive(link.path)
                      ? 'text-accent'
                      : 'text-foreground hover:text-accent'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* User Section */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-lg">
                    <User className="w-4 h-4 text-foreground" />
                    <div className="flex flex-col">
                      <span className="font-paragraph text-xs uppercase tracking-wide text-secondary-foreground">
                        {user.role}
                      </span>
                      <span className="font-paragraph text-sm font-semibold text-foreground">
                        {user.fullName}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-destructive text-primary-foreground rounded-lg font-paragraph text-sm uppercase tracking-wide hover:bg-red-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-paragraph text-sm uppercase tracking-wide hover:bg-slate-800 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground"
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
            <nav className="md:hidden py-4 border-t border-secondary">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-paragraph text-base uppercase tracking-wide transition-colors ${
                      isActive(link.path)
                        ? 'text-accent'
                        : 'text-foreground hover:text-accent'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {user ? (
                  <>
                    <div className="px-4 py-2 bg-secondary/10 rounded-lg flex items-center gap-2">
                      <User className="w-4 h-4 text-foreground" />
                      <div className="flex flex-col">
                        <span className="font-paragraph text-xs uppercase tracking-wide text-secondary-foreground">
                          {user.role}
                        </span>
                        <span className="font-paragraph text-sm font-semibold text-foreground">
                          {user.fullName}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 bg-destructive text-primary-foreground rounded-lg font-paragraph text-sm uppercase tracking-wide hover:bg-red-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-paragraph text-sm uppercase tracking-wide hover:bg-slate-800 transition-colors mt-4 text-center"
                  >
                    Login
                  </Link>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>
      {(user?.role === 'student' || !user) && <Cart />}
    </>
  );
}
