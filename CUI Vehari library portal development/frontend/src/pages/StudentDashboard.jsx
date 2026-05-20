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
            <span className="text-white text-xs font-semibold truncate">{user?.name || 'Student'}</span>
            <span className="text-white/50 text-[10px]">Student — {user?.reg_number || 'FA23-BCS-001'}</span>
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
          COMSATS Academic Repository
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
  { to: '/student-dashboard', icon: 'dashboard', label: 'Overview', end: true },
  { to: '/student-dashboard/upload', icon: 'upload_file', label: 'Submit Thesis' },
  { to: '/student-dashboard/reports', icon: 'plagiarism', label: 'My Reports' },
  { to: '/student-dashboard/history', icon: 'history', label: 'Submission History' }
]

export default function StudentDashboard() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await api.getMyDocuments()
      setDocuments(res.documents || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const getPageTitle = () => {
    if (location.pathname === '/student-dashboard/upload') return 'Submit Thesis'
    if (location.pathname === '/student-dashboard/reports') return 'My Reports'
    if (location.pathname === '/student-dashboard/history') return 'Submission History'
    return 'Dashboard Overview'
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      <Sidebar role="STUDENT" navItems={navItems} user={user} />
      
      <div className="flex-1 ml-64 min-w-0">
        <TopHeader title={getPageTitle()} user={user} />
        
        <main className="p-8">
          <Routes>
            <Route path="/" element={<Overview documents={documents} loading={loading} onUpload={loadData} />} />
            <Route path="upload" element={<UploadSection onUpload={loadData} />} />
            <Route path="reports" element={<ReportsSection documents={documents} />} />
            <Route path="history" element={<HistoryPage documents={documents} />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function Overview({ documents, loading, onUpload }) {
  const latest = documents[0]
  
  const stats = [
    { label: 'Submissions Made', value: documents.length, icon: 'upload_file', color: 'text-blue-600' },
    { 
      label: 'Supervisor Status', 
      value: latest?.status === 'pending_supervisor' ? 'Pending' : 
             (latest?.status?.startsWith('approved') ? 'Approved' : 
             (latest?.status?.startsWith('rejected') ? 'Rejected' : 'N/A')), 
      icon: 'rate_review', 
      color: 'text-amber-600' 
    },
    { 
      label: 'Final Status', 
      value: latest?.status === 'approved_final' ? 'Approved' : 
             (latest?.status === 'rejected_final' ? 'Rejected' : 'Pending'), 
      icon: 'verified', 
      color: 'text-teal-600' 
    },
    { 
      label: 'Workflow', 
      value: latest?.status === 'approved_final' ? 'Completed' : 'In Progress', 
      icon: 'step', 
      color: 'text-slate-400' 
    },
  ]

  const getStepStatus = (step) => {
    if (!latest) return { status: 'Locked', color: 'text-on-surface-variant/30', bg: 'bg-surface-container-low', icon: 'lock' }
    
    const workflow = ['pending_supervisor', 'pending_librarian', 'completed']
    const currentIdx = workflow.indexOf(latest.status)
    const stepIdx = workflow.indexOf(step)

    // Handle rejections
    if (latest.status === 'rejected' && (step === 'pending_librarian' || step === 'pending_supervisor')) {
      return { status: 'Rejected', color: 'text-red-600', bg: 'bg-red-50', icon: 'cancel' }
    }

    if (stepIdx < currentIdx || latest.status === 'completed') {
      return { status: 'Completed', color: 'text-green-600', bg: 'bg-green-50', icon: 'check_circle' }
    }
    if (stepIdx === currentIdx || (latest.status === 'rejected' && stepIdx === 0)) {
      return { status: latest.status === 'rejected' ? 'Rejected' : (latest.status.includes('pending') ? 'In Progress' : 'Completed'), 
               color: latest.status === 'rejected' ? 'text-red-600' : (latest.status.includes('pending') ? 'text-amber-600' : 'text-green-600'),
               bg: latest.status === 'rejected' ? 'bg-red-50' : (latest.status.includes('pending') ? 'bg-amber-50' : 'bg-green-50'),
               icon: latest.status === 'rejected' ? 'cancel' : (latest.status.includes('pending') ? 'pending' : 'check_circle'),
               active: latest.status.includes('pending') }
    }
    return { status: 'Locked', color: 'text-on-surface-variant/30', bg: 'bg-surface-container-low', icon: 'lock' }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl custom-shadow p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-full bg-surface-container-low ${stat.color} flex items-center justify-center mb-4`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`font-newsreader font-bold text-primary ${String(stat.value).length > 8 ? 'text-lg' : 'text-2xl'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {latest && (
        <div className="bg-white rounded-xl custom-shadow p-10 flex flex-col md:flex-row gap-12 border-t-4 border-secondary-container">
          <div className="flex-1 space-y-6">
            <div>
              <h3 className="font-newsreader text-2xl font-bold text-primary">Latest Submission</h3>
              <p className="text-primary font-semibold text-lg mt-2">{latest.title}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-on-surface-variant text-sm font-medium">Submitted {formatDate(latest.createdAt)}</span>
                <span className="w-1 h-1 bg-outline-variant rounded-full" />
                <span className="bg-secondary-container/20 text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{latest.status.replace(/_/g, ' ')}</span>
              </div>
            </div>
            <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/10">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {latest.status === 'pending_supervisor' && "Your document is currently being reviewed by your assigned supervisor."}
                {latest.status === 'pending_librarian' && "Supervisor has approved your document. It is now with the Librarian for final decision."}
                {latest.status === 'completed' && "Your document has received final approval from the Librarian. Workflow complete."}
                {latest.status === 'rejected' && `Your submission was rejected. Reason: ${latest.reject_reason || 'No reason provided.'}`}
              </p>
            </div>
          </div>

          <div className="w-full md:w-80 space-y-8 relative">
            <div className="absolute left-[15px] top-4 bottom-4 w-[2px] border-l-2 border-dashed border-outline-variant/30" />
            
            <Step {...getStepStatus('pending_supervisor')} title="Supervisor Review" />
            <Step {...getStepStatus('pending_librarian')} title="Librarian Review" />
            <Step {...getStepStatus('completed')} title="Final Approval" />
          </div>
        </div>
      )}

      {!latest && <UploadSection onUpload={onUpload} />}
    </div>
  )
}

function Step({ icon, title, status, color, bg, active }) {
  return (
    <div className="flex items-center gap-4 relative z-10">
      <div className={`w-8 h-8 rounded-full ${bg} ${color} flex items-center justify-center shadow-sm ${active ? 'ring-4 ring-secondary-container/20 animate-pulse' : ''}`}>
        <span className="material-symbols-outlined text-lg">{icon}</span>
      </div>
      <div>
        <p className={`text-xs font-bold uppercase tracking-wider ${active ? 'text-primary' : 'text-on-surface-variant/60'}`}>{title}</p>
        <p className="text-[10px] text-on-surface-variant/40 font-medium">{status}</p>
      </div>
    </div>
  )
}

function UploadSection({ onUpload }) {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.size > 20 * 1024 * 1024) {
      toast.error('File size must be under 20MB')
      return
    }
    setFile(selectedFile)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !title) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('description', desc)

    try {
      await api.uploadDocument(formData)
      toast.success('Document uploaded successfully!')
      onUpload()
      setFile(null); setTitle(''); setDesc('')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl custom-shadow p-10 mt-12">
      <h3 className="font-newsreader text-2xl font-bold text-primary mb-8">Submit New Thesis</h3>
      <form onSubmit={handleUpload} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Thesis Title</label>
            <input className="input" placeholder="Enter complete title" required value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Brief Description</label>
            <input className="input" placeholder="Optional description" value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
        </div>

        <div className="dashed-border bg-surface-container-low rounded-2xl p-12 flex flex-col items-center text-center group hover:bg-white hover:border-secondary-container transition-all cursor-pointer relative">
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept=".pdf,.docx" />
          <div className="w-16 h-16 bg-secondary-container/10 rounded-full flex items-center justify-center mb-4 text-secondary-container group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[40px]">upload_file</span>
          </div>
          <h4 className="text-primary font-bold">{file ? file.name : 'Click to select or drag & drop'}</h4>
          <p className="text-on-surface-variant text-xs mt-1">PDF or DOCX (Max 20MB)</p>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={uploading || !file || !title} className="btn-primary px-12 py-4 shadow-xl shadow-secondary-container/10 disabled:opacity-50">
            {uploading ? 'Uploading...' : 'Submit for Review'}
          </button>
        </div>
      </form>
    </div>
  )
}

function ReportsSection({ documents }) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const loadAllReports = async () => {
    setLoading(true)
    const allReports = []
    for (const doc of documents) {
      try {
        const res = await api.getReports(doc._id || doc.id)
        if (res.reports && res.reports.length > 0) {
          res.reports.forEach(r => allReports.push({ ...r, document_title: doc.title, document_id: doc._id || doc.id }))
        }
      } catch (e) {
        console.error(e)
      }
    }
    setReports(allReports)
    setLoading(false)
  }

  useEffect(() => {
    loadAllReports()
  }, [documents])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary-container border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-20 flex flex-col items-center text-center custom-shadow">
        <span className="material-symbols-outlined text-[80px] text-outline-variant/30 mb-6">summarize</span>
        <h3 className="font-newsreader text-2xl font-bold text-primary mb-2">No Reports Yet</h3>
        <p className="text-on-surface-variant max-w-sm mx-auto">Reports will appear here once the Librarian completes the plagiarism check.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {reports.map((report, idx) => (
        <ReportCard key={report._id || idx} report={report} />
      ))}
    </div>
  )
}

function ReportCard({ report }) {
  const { toast } = useToast()

  const handleDownloadReport = async () => {
    try {
      const res = await api.getReportDownloadUrl(report._id)
      window.open(res.url, '_blank')
    } catch (e) { toast.error(e.message) }
  }

  return (
    <div className="bg-white rounded-xl custom-shadow p-8 border-l-4 border-teal-500">
      <h4 className="font-newsreader text-xl font-bold text-primary mb-2 truncate">{report.document_title}</h4>
      <p className="text-on-surface-variant text-xs mb-4">Report Type: <span className="font-bold">{report.report_type.replace(/\b\w/g, l => l.toUpperCase())}</span></p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {report.similarity_score !== null && report.similarity_score !== undefined && (
          <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1">Similarity</p>
            <p className="text-2xl font-bold text-teal-700">{report.similarity_score}%</p>
          </div>
        )}
        {report.ai_percentage !== null && report.ai_percentage !== undefined && (
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
            <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-1">AI Score</p>
            <p className="text-2xl font-bold text-purple-700">{report.ai_percentage}%</p>
          </div>
        )}
      </div>

      {report.notes && (
        <div className="mb-6 p-4 bg-surface-container-low rounded-xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Librarian Notes</p>
          <p className="text-sm text-on-surface">{report.notes}</p>
        </div>
      )}

      <button onClick={handleDownloadReport} className="w-full bg-secondary-container text-white rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 hover:bg-secondary-container/90 transition-colors">
        <span className="material-symbols-outlined text-lg">download</span>
        Download Report
      </button>
    </div>
  )
}

function HistoryPage({ documents }) {
  const [editingDoc, setEditingDoc] = useState(null)
  const [previewDoc, setPreviewDoc] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const { toast } = useToast()

  const handlePreview = async (id) => {
    try {
      const res = await api.getDownloadUrl(id)
      setPreviewUrl(res.url)
      const doc = documents.find(d => d._id === id)
      setPreviewDoc(doc)
    } catch (e) { toast.error(e.message) }
  }

  const handleEdit = (doc) => {
    setEditingDoc(doc)
    setEditTitle(doc.title)
    setEditDesc(doc.description || '')
  }

  const handleSaveEdit = async () => {
    if (!editingDoc || !editTitle) return
    try {
      toast.success('Document updated successfully!')
      setEditingDoc(null)
    } catch (e) { toast.error(e.message) }
  }

  return (
    <>
      <div className="bg-white rounded-xl custom-shadow overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/10">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Document Title</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 hidden sm:table-cell">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 hidden md:table-cell">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {documents.map(doc => (
              <tr key={doc._id} className="hover:bg-surface-container-low/50">
                <td className="px-6 py-4 text-primary font-semibold text-sm">{doc.title}</td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    doc.status === 'approved_final' || doc.status === 'completed' ? 'bg-green-50 text-green-600 border border-green-100' :
                    doc.status.includes('rejected') ? 'bg-red-50 text-red-600 border border-red-100' :
                    'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {doc.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-on-surface-variant text-xs hidden md:table-cell">{formatDate(doc.createdAt)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handlePreview(doc._id)} className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-all" title="Preview">
                      <span className="material-symbols-outlined text-lg">visibility</span>
                    </button>
                    {(doc.status === 'pending_supervisor') && (
                      <button onClick={() => handleEdit(doc)} className="p-2 text-on-surface-variant hover:text-secondary-container hover:bg-surface-container-low rounded-lg transition-all" title="Edit">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Preview Modal */}
      {previewDoc && previewUrl && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-0 max-w-5xl w-full max-h-[90vh] custom-shadow overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-secondary-container to-amber-400 p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="font-newsreader text-xl font-bold">{previewDoc.title}</h3>
                <p className="text-white/90 text-sm mt-1">Preview Document</p>
              </div>
              <button 
                onClick={() => { setPreviewDoc(null); setPreviewUrl(null); }} 
                className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe 
                src={previewUrl} 
                className="w-full h-full border-0"
                title="Document Preview"
              />
            </div>
            <div className="p-4 border-t border-outline-variant/10 flex justify-end">
              <a 
                href={previewUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-2 bg-secondary-container text-white rounded-xl text-sm font-bold hover:bg-amber-500 transition-all"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingDoc && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-0 max-w-xl w-full custom-shadow overflow-hidden">
            <div className="bg-gradient-to-r from-secondary-container to-amber-400 p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-newsreader text-2xl font-bold">Edit Document</h3>
                  <p className="text-white/90 text-sm mt-1">Update your submission details</p>
                </div>
                <button 
                  onClick={() => setEditingDoc(null)} 
                  className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Document Title</label>
                <input className="input" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Description</label>
                <textarea className="input" rows={3} value={editDesc} onChange={e => setEditDesc(e.target.value)} />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setEditingDoc(null)} className="flex-1 px-8 py-4 rounded-2xl border-2 border-outline-variant text-on-surface-variant font-bold text-sm hover:bg-surface-container-low transition-all">
                  Cancel
                </button>
                <button onClick={handleSaveEdit} className="flex-1 px-8 py-4 rounded-2xl bg-secondary-container text-white font-bold text-sm hover:bg-amber-500 shadow-lg shadow-secondary-container/20 transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
