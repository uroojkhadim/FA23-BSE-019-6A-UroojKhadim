import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const roleParam = searchParams.get('role') || 'student'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const roleConfig = {
    student: {
      icon: 'school',
      title: 'Student Portal',
      desc: 'Submit your thesis and track plagiarism reports',
      label: 'STUDENT'
    },
    supervisor: {
      icon: 'supervisor_account',
      title: 'Supervisor Portal',
      desc: 'Review and approve student thesis submissions',
      label: 'SUPERVISOR'
    },
    librarian: {
      icon: 'local_library',
      title: 'Librarian Portal',
      desc: 'Run plagiarism checks and issue certifications',
      label: 'LIBRARIAN'
    },
    admin: {
      icon: 'admin_panel_settings',
      title: 'Admin Portal',
      desc: 'Manage system settings and user accounts',
      label: 'ADMIN'
    }
  }

  const currentRole = roleConfig[roleParam] || roleConfig.student

  // Update email/password fields when role changes
  useEffect(() => {
    setEmail('')
    setPassword('')
  }, [roleParam])

  async function handleSignIn() {
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      console.log('[LoginPage] Login successful, user role:', user.role)
      const routes = { 
        student: '/student-dashboard', 
        supervisor: '/supervisor-dashboard', 
        librarian: '/librarian-dashboard', 
        admin: '/admin-dashboard',
        subadmin: '/admin-dashboard'
      }
      const target = routes[user.role] || '/'
      console.log('[LoginPage] Navigating to:', target)
      navigate(target)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row font-sans">
      {/* LEFT SIDE */}
      <div className="hidden md:flex md:w-1/2 academic-gradient flex-col justify-between p-16 relative overflow-hidden">
        {/* Logo and Name */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/10 shadow-xl">
            <span className="material-symbols-outlined text-secondary-container text-3xl">school</span>
          </div>
          <h2 className="font-newsreader text-white text-2xl font-bold leading-tight">
            CUI Vehari Plagiarism<br />Detection Portal
          </h2>
        </div>

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-start">
          <span className="material-symbols-outlined text-white text-[80px] mb-6 select-none" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>
            {currentRole.icon}
          </span>
          <h1 className="font-newsreader text-white text-5xl font-bold mb-4">
            {currentRole.title}
          </h1>
          <p className="text-white/70 text-lg max-w-md leading-relaxed">
            {currentRole.desc}
          </p>
        </div>

        {/* Bottom Text */}
        <div className="relative z-10">
          <p className="text-white/30 italic text-sm">Maintaining Academic Integrity</p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-5%] left-[-5%] w-48 h-48 bg-white/5 rounded-full blur-2xl" />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-surface relative">
        {/* Back Link */}
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-secondary text-sm font-semibold hover:gap-3 transition-all">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to Home
        </Link>

        <div className="w-full max-w-md">
          {/* Role Badge */}
          <div className="inline-block bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold tracking-widest mb-6">
            {currentRole.label}
          </div>

          <h3 className="font-newsreader text-primary text-4xl font-bold mb-2">Welcome back</h3>
          <p className="text-on-surface-variant text-sm mb-10">Sign in to your portal account</p>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3 mb-8 animate-shake">
              <span className="material-symbols-outlined text-lg">error</span>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="text-[11px] text-primary/60 font-bold uppercase tracking-widest mb-2 block">Email Address</label>
              <input 
                type="email" 
                className="w-full border border-outline-variant rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-secondary-container focus:ring-4 focus:ring-secondary-container/10 transition-all placeholder:text-on-surface-variant/30"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="your@email.com" 
              />
            </div>
            
            <div>
              <label className="text-[11px] text-primary/60 font-bold uppercase tracking-widest mb-2 block">Password</label>
              <div className="relative">
                <input 
                  type={showPw ? 'text' : 'password'} 
                  className="w-full border border-outline-variant rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-secondary-container focus:ring-4 focus:ring-secondary-container/10 transition-all placeholder:text-on-surface-variant/30"
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                />
                <button 
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary transition-colors flex items-center"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPw ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
            <button 
              onClick={handleSignIn} 
              disabled={loading}
              className="w-full bg-secondary-container text-on-secondary-container rounded-2xl py-4 font-newsreader font-bold text-lg shadow-xl shadow-secondary-container/10 hover:bg-secondary hover:text-white transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Sign In'}
            </button>

            {roleParam === 'student' && (
              <div className="pt-4 border-t border-outline-variant/10">
                <p className="text-center text-sm text-on-surface-variant mb-4">New to the portal?</p>
                <Link 
                  to="/register" 
                  className="w-full flex items-center justify-center gap-2 bg-white text-primary border-2 border-primary/10 rounded-2xl py-3.5 font-bold text-sm hover:bg-primary hover:text-white transition-all active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-lg">person_add</span>
                  Create Student Account
                </Link>
              </div>
            )}
          </div>

            <p className="text-center text-[11px] text-on-surface-variant font-medium">
              Forgot your password? <span className="text-primary cursor-pointer hover:underline">Contact admin</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
