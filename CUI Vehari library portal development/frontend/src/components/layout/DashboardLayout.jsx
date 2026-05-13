import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LogOut, BookOpen } from 'lucide-react'

const roleColors = {
  student:    'from-navy to-navy-800',
  supervisor: 'from-navy to-navy-900',
  librarian:  'from-navy to-navy-700',
  admin:      'from-navy to-navy-900',
}

const roleBadgeColors = {
  student:    'bg-gold/10 text-gold border border-gold/20',
  supervisor: 'bg-gold/10 text-gold border border-gold/20',
  librarian:  'bg-gold/10 text-gold border border-gold/20',
  admin:      'bg-gold/10 text-gold border border-gold/20',
}

export default function DashboardLayout({ children, navItems, title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-cream font-body pb-16 md:pb-0 selection:bg-gold/10 selection:text-navy">
      {/* Sidebar (Desktop) */}
      <aside className={`hidden md:flex w-64 h-screen shrink-0 bg-navy flex-col z-40 sticky top-0 border-r border-white/5 shadow-2xl shadow-navy/20`}>
        {/* Logo */}
        <div className="px-6 py-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-secondary-container rounded-xl flex items-center justify-center shadow-lg shadow-gold/20">
              <span className="material-symbols-outlined text-primary">school</span>
            </div>
            <div>
              <p className="text-[10px] text-secondary-container/60 uppercase tracking-[0.2em] font-bold leading-none mb-1.5">CUI Vehari</p>
              <p className="text-sm text-white font-newsreader tracking-tight leading-none uppercase">Integrity Portal</p>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
             <p className="text-white text-sm font-medium truncate mb-1">{user?.name}</p>
             <span className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest ${roleBadgeColors[user?.role]}`}>
               {user?.role}
             </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} className={({ isActive }) => isActive ? 'text-gold' : 'text-white/40'} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-8">
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-white/40 hover:text-red-400 hover:bg-red-400/5"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar (Mobile) */}
        <header className="md:hidden bg-navy px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary-container rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg">school</span>
            </div>
            <p className="text-white font-newsreader text-sm uppercase tracking-tight">CUI Portal</p>
          </div>
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest ${roleBadgeColors[user?.role]}`}>
            {user?.role}
          </span>
        </header>

        <main className="flex-1 overflow-auto p-6 md:p-10 lg:p-12">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Nav (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-navy/5 flex justify-around p-2 z-50 safe-area-bottom">
        {navItems.slice(0, 4).map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `flex flex-col items-center justify-center p-2 rounded-xl min-w-[64px] transition-all ${isActive ? 'text-gold bg-gold/5' : 'text-navy/40'}`}
          >
            <Icon size={20} className="mb-1" />
            <span className="text-[10px] font-bold leading-none tracking-tight">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
