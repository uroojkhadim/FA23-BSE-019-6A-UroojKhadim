/**
 * SeedPage — CUI Vehari Plagiarism Portal
 * One-time setup page to create the first admin user
 */
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useToast } from '../components/layout/Toast'
import { Building2 } from 'lucide-react'

export default function SeedPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [alreadyExists, setAlreadyExists] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSeed = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.seedAdmin({ name, email, password })
      toast.success('Admin created! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      if (err.message.includes('already exists')) {
        setAlreadyExists(true)
      } else {
        toast.error(err.message || 'Setup failed')
      }
    } finally {
      setLoading(false)
    }
  }

  if (alreadyExists) {
    return (
      <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center p-4">
        <div className="card max-w-md w-full p-8 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-[#0B1F3A] rounded-full flex items-center justify-center mx-auto text-[#C8922A] mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-display text-[#0B1F3A]">Setup already completed</h2>
          <p className="text-slate-600">The first admin account has already been created. You cannot run this setup again.</p>
          <Link to="/login" className="btn-primary w-full block mt-6">Go to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center p-4">
      <div className="card max-w-md w-full p-8 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-display text-[#0B1F3A]">Initial Setup</h2>
          <p className="text-slate-500 mt-2">Create the first administrator account</p>
        </div>
        
        <form onSubmit={handleSeed} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" 
              required 
              className="input w-full"
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              required 
              className="input w-full"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required 
              minLength="6"
              className="input w-full"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
            {loading ? 'Creating...' : 'Create Admin Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
