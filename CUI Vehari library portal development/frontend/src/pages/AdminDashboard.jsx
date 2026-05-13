/**
 * AdminDashboard — CUI Vehari Plagiarism Portal
 * Manage users, view stats, manage files and storage
 */
import { useState, useEffect } from 'react'
import { Link, useLocation, Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { api, formatBytes, formatDate } from '../lib/api'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/layout/Toast'
import {
  Users,
  FileText,
  Settings,
  LayoutDashboard,
  Search,
  Filter,
  ChevronRight,
  LogOut,
  UserPlus,
  CheckCircle,
  XCircle,
  MoreVertical,
  Trash2,
  Download,
  User,
  Mail,
  Lock,
  Phone,
  UserCheck,
  Building2,
  Eye,
  EyeOff,
  RotateCcw,
  Loader2
} from 'lucide-react'

// Shared Sidebar Component
const Sidebar = ({ role, navItems, user }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 w-64 h-full academic-gradient flex flex-col z-50 border-r border-white/10">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center border border-white/10">
            <span className="material-symbols-outlined text-secondary-container">shield_person</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-newsreader font-bold text-lg leading-tight">CUI Vehari</span>
            <span className="text-white/50 text-[10px] uppercase tracking-widest">Plagiarism Portal</span>
          </div>
        </div>
        <div className="h-[1px] bg-white/10 w-full my-6" />
        <div className="inline-block bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold tracking-widest">
          {role.toUpperCase()}
        </div>
      </div>

      <nav className="flex-1 px-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive ? 'bg-white/10 text-white font-semibold' : 'text-white/70 hover:bg-white/5'
              }`
            }
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4 flex flex-col gap-4">
        <div className="h-[1px] bg-white/10 w-full" />
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-9 h-9 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container font-newsreader font-bold text-sm">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white text-xs font-semibold truncate">{user?.name || 'Admin User'}</span>
            <span className="text-white/50 text-[10px]">{user?.role === 'admin' ? 'Administrator' : (user?.role === 'subadmin' ? 'Sub-Admin' : user?.role)}</span>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  )
}

// Shared TopHeader Component
const TopHeader = ({ title, user }) => {
  return (
    <header className="bg-white px-8 py-5 custom-shadow flex justify-between items-center sticky top-0 z-40">
      <h2 className="font-newsreader text-primary text-3xl font-bold">{title}</h2>
      <div className="flex items-center gap-6">
        <div className="text-on-surface-variant text-sm font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
        <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-secondary-container rounded-full border-2 border-white" />
        </button>
        <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container font-newsreader font-bold">
          {user?.name?.[0] || 'A'}
        </div>
      </div>
    </header>
  )
}

const navItems = [
  { to: '/admin-dashboard', icon: 'dashboard', label: 'Overview', end: true },
  { to: '/admin-dashboard/users', icon: 'group', label: 'Manage Users' },
  { to: '/admin-dashboard/files', icon: 'folder_open', label: 'Manage Files' },
  { to: '/admin-dashboard/settings', icon: 'settings', label: 'Settings' }
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const location = useLocation()
  
  const getPageTitle = () => {
    if (location.pathname === '/admin-dashboard/users') return 'Manage Users'
    if (location.pathname === '/admin-dashboard/files') return 'Manage Files'
    if (location.pathname === '/admin-dashboard/settings') return 'System Settings'
    return 'Dashboard Overview'
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      <Sidebar role="Admin" navItems={navItems} user={user} />
      
      <div className="flex-1 ml-64 min-w-0">
        <TopHeader title={getPageTitle()} user={user} />
        
        <main className="p-8">
          <Routes>
            <Route path="/" element={<OverviewTab />} />
            <Route path="users" element={<UsersTab />} />
            <Route path="files" element={<FilesTab />} />
            <Route path="settings" element={<SettingsTab />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function OverviewTab() {
  const [data, setData] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    api.getAllDocuments()
      .then(setData)
      .catch(err => toast.error('Failed to load data: ' + err.message))
  }, [toast])

  if (!data) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white rounded-xl animate-pulse custom-shadow" />)}
    </div>
  )

  const stats = data.stats;
  const statCards = [
    { label: 'Total Uploads', value: stats.total, icon: 'upload_file', color: 'text-blue-600' },
    { label: 'Approved Final', value: stats.approved, icon: 'verified', color: 'text-green-600' },
    { label: 'Rejected', value: stats.rejected, icon: 'cancel', color: 'text-red-600' },
    { label: 'Pending Review', value: stats.pending, icon: 'pending', color: 'text-amber-600' },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl custom-shadow p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-full bg-surface-container-low ${stat.color} flex items-center justify-center mb-4`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-newsreader font-bold text-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl custom-shadow p-8">
        <h3 className="font-newsreader text-xl font-bold text-primary mb-6">Recent Submissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-outline-variant/10">
                <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Title</th>
                <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Student</th>
                <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Status</th>
                <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {data.documents.slice(0, 5).map(doc => (
                <tr key={doc._id}>
                  <td className="py-4 text-sm font-semibold text-primary">{doc.title}</td>
                  <td className="py-4 text-xs text-on-surface-variant">{doc.uploadedBy?.name}</td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                      doc.status.includes('approved') ? 'bg-green-50 text-green-600' :
                      doc.status.includes('rejected') ? 'bg-red-50 text-red-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {doc.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-4 text-xs text-on-surface-variant">{formatDate(doc.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const DEPARTMENTS = [
  'BAF', 'BAG', 'BBA', 'BCS', 'BEC', 'BED', 'BEN', 'BES', 'BMD', 'BSE', 'BSM', 'BTY'
]

function UsersTab() {
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'supervisor', 
    department: '', 
    phone: '' 
  })
  const { toast } = useToast()

  const loadUsers = () => {
    api.getUsers({ role: filter !== 'all' ? filter : undefined })
      .then(res => setUsers(res.users))
      .catch(err => toast.error('Failed to load users: ' + err.message))
  }

  useEffect(() => { loadUsers() }, [filter])

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.updateUserStatus(id, status)
      toast.success(`User ${status} successfully`)
      loadUsers()
    } catch(e) { toast.error(e.message) }
  }

  const validateForm = () => {
    const isLibrarian = formData.role === 'librarian'
    const isSubAdmin = formData.role === 'subadmin'
    
    // For Librarian, department is optional. For SubAdmin and others, it is compulsory.
    if (!formData.name || !formData.email || !formData.password || !formData.role || (!isLibrarian && !formData.department)) {
      if (isSubAdmin) {
        toast.error('Name, Email, Password, and Department are compulsory for SubAdmins')
      } else {
        toast.error(isLibrarian ? 'All fields except department and phone are required' : 'All fields except phone are required')
      }
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return false
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return false
    }
    return true
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      await api.addFaculty(formData)
      toast.success('Faculty account created successfully')
      setShowAdd(false)
      handleReset()
      loadUsers()
    } catch(e) { 
      toast.error(e.message || 'Failed to create faculty account') 
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({ 
      name: '', 
      email: '', 
      password: '', 
      role: 'supervisor', 
      department: '', 
      phone: '' 
    })
    setShowPassword(false)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-orange-100">
          {['all', 'student', 'supervisor', 'librarian', 'subadmin'].map(r => (
            <button 
              key={r} 
              onClick={() => setFilter(r)} 
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                filter === r 
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' 
                : 'text-slate-500 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)} 
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg ${
            showAdd 
            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
            : 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-200'
          }`}
        >
          {showAdd ? <XCircle size={18} /> : <UserPlus size={18} />}
          {showAdd ? 'Close Form' : 'Add Faculty'}
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-3xl shadow-xl shadow-orange-100 border border-orange-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-orange-500 p-8 text-white">
            <h2 className="font-newsreader text-3xl font-bold">Onboard New Faculty</h2>
            <p className="text-orange-100 text-sm mt-1">Create an approved account for supervisors or librarians</p>
          </div>
          
          <form onSubmit={handleAdd} className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Full Name */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none" 
                    placeholder="Enter full name" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none" 
                    placeholder="name@gmail.com" 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
              </div>

              {/* Initial Password */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Initial Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none" 
                    placeholder="Min. 6 characters" 
                    type={showPassword ? 'text' : 'password'} 
                    required 
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* System Role */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">System Role</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none">
                    <UserCheck size={18} />
                  </div>
                  <select 
                    className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none appearance-none" 
                    value={formData.role} 
                    onChange={e => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="supervisor">Supervisor</option>
                    <option value="librarian">Librarian</option>
                    <option value="subadmin">Sub-Admin</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <ChevronRight size={16} className="rotate-90" />
                  </div>
                </div>
              </div>

              {/* Department */}
              {formData.role !== 'librarian' && (
                <div className="space-y-2.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Department</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none">
                      <Building2 size={18} />
                    </div>
                    <select 
                      className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none appearance-none" 
                      required 
                      value={formData.department} 
                      onChange={e => setFormData({...formData, department: e.target.value})}
                    >
                      <option value="">Select Department</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <ChevronRight size={16} className="rotate-90" />
                    </div>
                  </div>
                </div>
              )}

              {/* Phone Number */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                    <Phone size={18} />
                  </div>
                  <input 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none" 
                    placeholder="Optional" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4 pt-8 border-t border-slate-50">
              <button 
                type="button" 
                onClick={handleReset} 
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all border border-slate-100"
              >
                <RotateCcw size={18} />
                Reset Form
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex items-center justify-center gap-2 px-12 py-3.5 rounded-2xl font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/50 border border-orange-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-orange-50/30 border-b border-orange-50">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">User Identity</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Portal Role</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Academic Dept</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50">
              {users.map((u, idx) => (
                <tr key={u._id || idx} className="hover:bg-orange-50/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-newsreader font-bold text-lg shadow-inner group-hover:scale-110 transition-transform duration-300">
                        {u.name?.[0]}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-slate-800 font-bold truncate">{u.name}</span>
                        <span className="text-slate-400 text-xs truncate">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest ${
                      u.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-100' : 
                      u.role === 'subadmin' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 
                      u.role === 'librarian' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                      u.role === 'supervisor' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 
                      'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                      <Building2 size={14} className="text-slate-300" />
                      {u.department}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest ${
                      u.status === 'approved' ? 'bg-green-50 text-green-600 border border-green-100' : 
                      u.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                      'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        u.status === 'approved' ? 'bg-green-500' : u.status === 'pending' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
                      }`} />
                      {u.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      {u.role === 'student' && u.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(u._id, 'approved')} 
                            className="p-2.5 text-green-600 hover:bg-green-50 rounded-xl transition-all shadow-sm hover:shadow-green-100"
                            title="Approve Student"
                          >
                            <CheckCircle size={20} />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(u._id, 'rejected')} 
                            className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm hover:shadow-red-100"
                            title="Reject Student"
                          >
                            <XCircle size={20} />
                          </button>
                        </>
                      )}
                      {u.role !== 'admin' && (
                        <button 
                          className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function FilesTab() {
  const [files, setFiles] = useState([])
  const [selected, setSelected] = useState(new Set())
  const { toast } = useToast()

  const loadFiles = () => {
    api.getAllDocuments()
      .then(res => setFiles(res.documents || []))
      .catch(err => toast.error('Failed to load files: ' + err.message))
  }

  useEffect(() => { loadFiles() }, [])

  const handleDownload = async (id) => {
    try {
      const res = await api.getDownloadUrl(id);
      window.open(res.url, '_blank');
    } catch (err) {
      toast.error('Download failed: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will permanently delete the file!')) return;
    try {
      await api.deleteDocument(id);
      toast.success('File deleted successfully');
      loadFiles();
    } catch (err) {
      toast.error('Delete failed: ' + err.message);
    }
  };

  const toggleSelect = (id) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selected.size} selected files?`)) return
    
    let successCount = 0
    for (const id of selected) {
      try {
        await api.deleteDocument(id)
        successCount++
      } catch(e) { console.error(e) }
    }
    
    if (successCount > 0) {
      toast.success(`Deleted ${successCount} files.`)
      setSelected(new Set())
      loadFiles()
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="bg-white px-6 py-3 rounded-xl custom-shadow border border-outline-variant/10 flex items-center gap-4">
          <span className="material-symbols-outlined text-on-surface-variant/40">search</span>
          <input className="bg-transparent border-none focus:ring-0 text-sm font-medium w-64" placeholder="Search research files..." />
        </div>
        {selected.size > 0 && (
          <button onClick={handleBulkDelete} className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-100 transition-all">
            <span className="material-symbols-outlined text-xl">delete_sweep</span>
            Delete {selected.size} Selected
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl custom-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/10">
                <th className="px-8 py-5 w-10">
                  <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary" onChange={(e) => {
                    if (e.target.checked) setSelected(new Set(files.map(f => f._id)))
                    else setSelected(new Set())
                  }} />
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">Research Document</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">Student</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {files.map((f) => (
                <tr key={f._id} className={`transition-colors ${selected.has(f._id) ? 'bg-secondary-container/5' : 'hover:bg-surface-container-low/50'}`}>
                  <td className="px-8 py-6">
                    <input type="checkbox" checked={selected.has(f._id)} onChange={() => toggleSelect(f._id)} className="rounded border-outline-variant text-primary focus:ring-primary" />
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-surface-container-low rounded-xl flex items-center justify-center text-primary/40">
                        <span className="material-symbols-outlined">description</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-primary font-semibold truncate">{f.title}</span>
                        <span className="text-on-surface-variant text-[10px] uppercase tracking-wider font-bold">{f.file_name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-primary font-medium text-sm">{f.uploadedBy?.name}</span>
                      <span className="text-on-surface-variant text-xs">{f.uploadedBy?.reg_number}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                      f.status.includes('approved') ? 'bg-green-50 text-green-600' :
                      f.status.includes('rejected') ? 'bg-red-50 text-red-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {f.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDownload(f._id)} className="p-2 text-on-surface-variant/40 hover:text-primary hover:bg-surface-container-low rounded-lg transition-all">
                        <span className="material-symbols-outlined text-xl">download</span>
                      </button>
                      <button onClick={() => handleDelete(f._id)} className="p-2 text-on-surface-variant/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function SettingsTab() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-white rounded-xl custom-shadow p-8">
        <h3 className="font-newsreader text-2xl font-bold text-primary mb-6">Portal Configuration</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Institution Name</label>
              <input className="input" defaultValue="COMSATS University Islamabad" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Campus Location</label>
              <input className="input" defaultValue="Vehari Campus" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Maximum File Size (MB)</label>
              <input className="input" type="number" defaultValue="10" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Allowed File Formats</label>
              <input className="input" defaultValue=".pdf, .docx" />
            </div>
          </div>
          <div className="pt-6 border-t border-outline-variant/10 flex justify-end">
            <button className="btn-primary px-12">Save Configuration</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl custom-shadow p-8 border-l-4 border-red-500">
        <h3 className="font-newsreader text-xl font-bold text-red-600 mb-4">System Maintenance</h3>
        <p className="text-on-surface-variant text-sm mb-6">Perform critical system operations. These actions are irreversible and will affect all users.</p>
        <div className="flex flex-wrap gap-4">
          <button className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-all">Flush Storage Cache</button>
          <button className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-all">Re-index Submissions</button>
        </div>
      </div>
    </div>
  )
}
