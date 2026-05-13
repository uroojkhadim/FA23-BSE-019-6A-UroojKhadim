import { useState, useEffect } from 'react'
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/layout/Toast'
import { api, formatBytes, formatDate } from '../lib/api'

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
            <span className="material-symbols-outlined text-secondary-container">school</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-newsreader font-bold text-lg leading-tight">CUI Vehari</span>
            <span className="text-white/50 text-[10px] uppercase tracking-widest">Plagiarism Portal</span>
          </div>
        </div>
        <div className="h-[1px] bg-white/10 w-full my-6" />
        <div className="inline-block bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
          {role}
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
            {user?.name?.[0] || 'S'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white text-xs font-semibold truncate">{user?.name || 'Supervisor'}</span>
            <span className="text-white/50 text-[10px]">Supervisor</span>
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
        <div className="text-on-surface-variant text-sm font-medium italic">
          Maintaining Academic Integrity
        </div>
        <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-secondary-container rounded-full border-2 border-white" />
        </button>
        <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container font-newsreader font-bold">
          {user?.name?.[0] || 'S'}
        </div>
      </div>
    </header>
  )
}

const navItems = [
  { to: '/supervisor-dashboard', icon: 'dashboard', label: 'Overview', end: true },
  { to: '/supervisor-dashboard/pending', icon: 'rate_review', label: 'Pending Approvals' },
  { to: '/supervisor-dashboard/students', icon: 'group', label: 'My Students' },
  { to: '/supervisor-dashboard/history', icon: 'history', label: 'Submission History' }
]

export default function SupervisorDashboard() {
  const { user } = useAuth()
  const [pending, setPending] = useState([])
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const { toast } = useToast()

  const loadData = async () => {
    setLoading(true)
    try {
      const pRes = await api.getSupervisorPending()
      setPending(pRes.documents || [])
      // Supervisors don't have "my documents" in this workflow
      setAll([]) 
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') {
        await api.approveBySupervisor(id)
        toast.success('Document approved and sent to Librarian')
      } else {
        const reason = window.prompt('Enter rejection reason:')
        if (!reason) return
        await api.rejectBySupervisor(id, reason)
        toast.success('Document rejected')
      }
      loadData()
    } catch (e) { toast.error(e.message) }
  }

  const handlePreview = async (id) => {
    try {
      const res = await api.getDownloadUrl(id)
      window.open(res.url, '_blank')
    } catch (e) { toast.error(e.message) }
  }

  const getPageTitle = () => {
    if (location.pathname === '/supervisor-dashboard/pending') return 'Pending Approvals'
    if (location.pathname === '/supervisor-dashboard/students') return 'My Students'
    if (location.pathname === '/supervisor-dashboard/history') return 'Submission History'
    return 'Dashboard Overview'
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      <Sidebar role="SUPERVISOR" navItems={navItems} user={user} />
      
      <div className="flex-1 ml-64 min-w-0">
        <TopHeader title={getPageTitle()} user={user} />
        
        <main className="p-8">
          <Routes>
            <Route path="/" element={<Overview pending={pending} all={all} loading={loading} onAction={handleAction} onPreview={handlePreview} />} />
            <Route path="pending" element={<PendingPage documents={pending} onAction={handleAction} onPreview={handlePreview} loading={loading} />} />
            <Route path="students" element={<StudentsPage all={all} loading={loading} />} />
            <Route path="history" element={<HistoryPage all={all} loading={loading} />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function Overview({ pending, all, loading, onAction, onPreview }) {
  const stats = [
    { label: 'Pending Approvals', value: pending.length, icon: 'pending_actions', color: 'text-amber-600' },
    { label: 'Total Reviewed', value: all.length, icon: 'task_alt', color: 'text-green-600' },
    { label: 'Approved', value: all.filter(d => d.status === 'approved_by_supervisor' || d.status === 'approved_final').length, icon: 'check_circle', color: 'text-blue-600' },
    { label: 'Rejected', value: all.filter(d => d.status === 'rejected_by_supervisor' || d.status === 'rejected_final').length, icon: 'cancel', color: 'text-red-600' },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl custom-shadow p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-full bg-surface-container-low ${stat.color} flex items-center justify-center mb-4`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-newsreader font-bold text-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <h3 className="font-newsreader text-2xl font-bold text-primary">Recent Tasks</h3>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-white rounded-xl animate-pulse custom-shadow" />)}
          </div>
        ) : pending.length > 0 ? (
          <div className="space-y-3">
            {pending.slice(0, 3).map(s => (
              <div key={s._id} className="bg-white rounded-xl custom-shadow px-8 py-5 flex items-center justify-between border-l-4 border-amber-400">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-primary-container text-white rounded-full flex items-center justify-center font-newsreader font-bold">
                    {s.uploadedBy?.name?.[0]}
                  </div>
                  <div>
                    <h4 className="text-primary font-bold">{s.uploadedBy?.name}</h4>
                    <p className="text-on-surface-variant text-sm font-medium">{s.title}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/40">Submitted {formatDate(s.createdAt)}</span>
                  <button onClick={() => onPreview(s._id)} className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">visibility</span> Preview
                  </button>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => onAction(s._id, 'approve')} className="bg-green-50 text-green-700 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-green-100 transition-all">Approve</button>
                  <button onClick={() => onAction(s._id, 'reject')} className="bg-red-50 text-red-700 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-all">Reject</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl custom-shadow p-12 text-center text-on-surface-variant/30 italic">
            No pending submissions found.
          </div>
        )}
      </div>
    </div>
  )
}

function PendingPage({ documents, onAction, onPreview, loading }) {
  return (
    <div className="space-y-6">
      {documents.map(s => (
        <div key={s._id} className="bg-white rounded-xl custom-shadow px-8 py-6 flex items-center justify-between border-l-4 border-amber-400">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-primary-container text-white rounded-full flex items-center justify-center font-newsreader font-bold">
              {s.uploadedBy?.name?.[0]}
            </div>
            <div>
              <h4 className="text-primary font-bold text-lg">{s.uploadedBy?.name}</h4>
              <p className="text-on-surface-variant text-sm font-medium mb-1">{s.title}</p>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Submitted {formatDate(s.createdAt)}</span>
                <span className="w-1 h-1 bg-outline-variant rounded-full" />
                <button onClick={() => onPreview(s._id)} className="text-xs text-primary font-bold hover:underline">View File</button>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => onAction(s._id, 'approve')} className="bg-green-50 text-green-700 px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-green-100 transition-all shadow-sm">Approve</button>
            <button onClick={() => onAction(s._id, 'reject')} className="bg-red-50 text-red-700 px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-all shadow-sm">Reject</button>
          </div>
        </div>
      ))}
      {documents.length === 0 && !loading && (
        <div className="bg-white rounded-2xl p-20 flex flex-col items-center text-center custom-shadow">
          <span className="material-symbols-outlined text-[80px] text-outline-variant/30 mb-6">task_alt</span>
          <h3 className="font-newsreader text-2xl font-bold text-primary mb-2">No Pending Tasks</h3>
          <p className="text-on-surface-variant max-w-xs mx-auto">All assigned student submissions have been processed.</p>
        </div>
      )}
    </div>
  )
}

function StudentsPage() { return <div className="p-12 text-center text-on-surface-variant italic">Faculty student management module loading...</div> }
function HistoryPage() { return <div className="p-12 text-center text-on-surface-variant italic">Academic history records loading...</div> }

