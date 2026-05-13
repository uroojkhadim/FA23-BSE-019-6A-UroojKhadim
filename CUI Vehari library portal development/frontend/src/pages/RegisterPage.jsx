import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../hooks/useAuth'
import { BookOpen, AlertCircle, CheckCircle } from 'lucide-react'

const DEPARTMENTS = [
  'BAF', 'BAG', 'BBA', 'BCS', 'BEC', 'BED', 'BEN', 'BES', 'BMD', 'BSE', 'BSM', 'BTY'
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    department: '', 
    reg_number: '', 
    phone: '', 
    supervisor_id: '',
    role: 'student' 
  })
  const [supervisors, setSupervisors] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.getSupervisors()
      .then(res => setSupervisors(res.supervisors))
      .catch(err => console.error('Failed to fetch supervisors', err))
  }, [])

  function set(k) { return e => setForm(f => ({ ...f, [k]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await register(form)
      if (res && res.message && res.message.includes('approval')) {
        setSuccess(true)
        setTimeout(() => navigate('/login'), 5000)
      } else {
        navigate('/')
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-white p-10 rounded-3xl shadow-xl">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h2 className="font-newsreader text-3xl text-primary mb-4">Registration Received!</h2>
          <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
            Your profile has been created successfully. An administrator will review your account soon. 
            You will be able to log in once your account is <strong>Approved</strong>.
          </p>
          <p className="text-primary/50 text-xs italic">Redirecting to login…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Left side info */}
      <div className="md:w-[400px] academic-gradient flex flex-col justify-between p-12 text-white">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary-container rounded-xl flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-primary">school</span>
          </div>
          <span className="font-newsreader font-bold text-xl">CUI Vehari Portal</span>
        </Link>
        <div>
          <h2 className="font-newsreader text-4xl leading-tight mb-4">Join Our <span className="text-secondary-container italic">Academic</span> Community</h2>
          <p className="text-primary-fixed-dim text-sm font-light leading-relaxed">
            Create your student profile to upload thesis documents, track plagiarism checks, and manage supervisor reviews.
          </p>
        </div>
        <p className="text-white/20 text-[10px] tracking-widest uppercase">© 2026 COMSATS University Islamabad</p>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-xl py-12">
          <div className="mb-10">
            <h1 className="font-newsreader text-4xl text-primary mb-2">Create Account</h1>
            <p className="text-on-surface-variant text-sm">Fill in your academic details to register</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-2xl px-5 py-4 mb-8">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-[11px] text-primary/60 font-bold uppercase tracking-widest mb-2 block">Full Name</label>
                <input 
                  className="w-full border border-outline-variant rounded-xl px-4 py-3.5 text-sm focus:ring-4 focus:ring-secondary-container/10 transition-all" 
                  value={form.name} 
                  onChange={set('name')} 
                  placeholder="e.g. Muhammad Abdullah" 
                  required 
                />
              </div>

              <div>
                <label className="text-[11px] text-primary/60 font-bold uppercase tracking-widest mb-2 block">Email Address</label>
                <input 
                  type="email" 
                  className="w-full border border-outline-variant rounded-xl px-4 py-3.5 text-sm focus:ring-4 focus:ring-secondary-container/10 transition-all" 
                  value={form.email} 
                  onChange={set('email')} 
                  placeholder="name@gmail.com" 
                  required 
                />
              </div>

              <div>
                <label className="text-[11px] text-primary/60 font-bold uppercase tracking-widest mb-2 block">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full border border-outline-variant rounded-xl px-4 py-3.5 text-sm focus:ring-4 focus:ring-secondary-container/10 transition-all" 
                  value={form.phone} 
                  onChange={set('phone')} 
                  placeholder="0300 1234567" 
                  required 
                />
              </div>

              <div>
                <label className="text-[11px] text-primary/60 font-bold uppercase tracking-widest mb-2 block">Reg. Number</label>
                <input 
                  className="w-full border border-outline-variant rounded-xl px-4 py-3.5 text-sm focus:ring-4 focus:ring-secondary-container/10 transition-all" 
                  value={form.reg_number} 
                  onChange={set('reg_number')} 
                  placeholder="SP21-BSE-012" 
                  required 
                />
              </div>

              <div>
                <label className="text-[11px] text-primary/60 font-bold uppercase tracking-widest mb-2 block">Department</label>
                <select 
                  className="w-full border border-outline-variant rounded-xl px-4 py-3.5 text-sm focus:ring-4 focus:ring-secondary-container/10 transition-all" 
                  value={form.department} 
                  onChange={set('department')} 
                  required
                >
                  <option value="">Select Dept</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-[11px] text-primary/60 font-bold uppercase tracking-widest mb-2 block">Assigned Supervisor</label>
                <select 
                  className="w-full border border-outline-variant rounded-xl px-4 py-3.5 text-sm focus:ring-4 focus:ring-secondary-container/10 transition-all" 
                  value={form.supervisor_id} 
                  onChange={set('supervisor_id')} 
                  required
                >
                  <option value="">Select Supervisor</option>
                  {supervisors.map(s => <option key={s._id} value={s._id}>{s.name} ({s.department})</option>)}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-[11px] text-primary/60 font-bold uppercase tracking-widest mb-2 block">Password</label>
                <input 
                  type="password" 
                  className="w-full border border-outline-variant rounded-xl px-4 py-3.5 text-sm focus:ring-4 focus:ring-secondary-container/10 transition-all" 
                  value={form.password} 
                  onChange={set('password')} 
                  placeholder="••••••••" 
                  required 
                  minLength={8}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-secondary-container text-on-secondary-container rounded-2xl py-4 font-newsreader font-bold text-lg shadow-xl shadow-secondary-container/10 hover:bg-secondary hover:text-white transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Register as Student'}
            </button>
          </form>

          <p className="text-center text-sm text-on-surface-variant mt-10 font-medium">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
