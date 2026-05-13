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
            {user?.name?.[0] || 'L'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white text-xs font-semibold truncate">{user?.name || 'Librarian'}</span>
            <span className="text-white/50 text-[10px]">Verification Officer</span>
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
          Verification Service Active
        </div>
        <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-secondary-container rounded-full border-2 border-white" />
        </button>
        <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container font-newsreader font-bold">
          {user?.name?.[0] || 'L'}
        </div>
      </div>
    </header>
  )
}

const navItems = [
  { to: '/librarian-dashboard', icon: 'dashboard', label: 'Overview', end: true },
  { to: '/librarian-dashboard/queue', icon: 'folder_open', label: 'Check Queue' },
  { to: '/librarian-dashboard/completed', icon: 'check_circle', label: 'Completed' }
]

export default function LibrarianDashboard() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState([])
  const [allDocs, setAllDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [reportData, setReportData] = useState({ plagiarism_notes: '', similarity_score: '', ai_notes: '', ai_percentage: '' })
  const [plagiarismFile, setPlagiarismFile] = useState(null)
  const [aiFile, setAiFile] = useState(null)
  const location = useLocation()
  const { toast } = useToast()

  const loadData = async () => {
    setLoading(true)
    try {
      const pRes = await api.getLibrarianPending()
      setDocuments(pRes.documents || [])
      setAllDocs([]) // For Librarian, we don't need all docs
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') {
        await api.approveFinal(id)
        toast.success('Final approval granted')
      } else {
        const reason = window.prompt('Enter rejection reason:')
        if (!reason) return
        await api.rejectFinal(id, reason)
        toast.success('Final rejection issued')
      }
      loadData()
    } catch (e) { toast.error(e.message) }
  }

  const handleDownload = async (id) => {
    try {
      const res = await api.getDownloadUrl(id)
      window.open(res.url, '_blank')
    } catch (e) { toast.error(e.message) }
  }

  const handleReportUpload = async () => {
    if (!selectedSubmission || (!plagiarismFile && !aiFile)) return
    
    try {
      const formData = new FormData()
      if (plagiarismFile) formData.append('plagiarism_report', plagiarismFile)
      if (aiFile) formData.append('ai_report', aiFile)
      if (reportData.similarity_score) formData.append('similarity_score', reportData.similarity_score)
      if (reportData.ai_percentage) formData.append('ai_percentage', reportData.ai_percentage)
      if (reportData.plagiarism_notes) formData.append('plagiarism_notes', reportData.plagiarism_notes)
      if (reportData.ai_notes) formData.append('ai_notes', reportData.ai_notes)
      
      await api.uploadReports(selectedSubmission._id, formData)
      
      toast.success('Reports uploaded successfully!')
      setReportModalOpen(false)
      setReportData({ plagiarism_notes: '', similarity_score: '', ai_notes: '', ai_percentage: '' })
      setPlagiarismFile(null)
      setAiFile(null)
      loadData()
    } catch (e) { toast.error(e.message) }
  }

  const getPageTitle = () => {
    if (location.pathname === '/librarian-dashboard/queue') return 'Check Queue'
    if (location.pathname === '/librarian-dashboard/completed') return 'Completed Checks'
    return 'Dashboard Overview'
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      <Sidebar role="LIBRARIAN" navItems={navItems} user={user} />
      
      <div className="flex-1 ml-64 min-w-0">
        <TopHeader title={getPageTitle()} user={user} />
        
        <main className="p-8">
          <Routes>
            <Route path="/" element={<Overview pending={documents.length} completed={allDocs.filter(d => d.status.includes('final')).length} />} />
            <Route path="queue" element={<QueuePage documents={documents} onAction={handleAction} onDownload={handleDownload} onUploadReport={(sub) => { setSelectedSubmission(sub); setReportModalOpen(true); }} />} />
            <Route path="completed" element={<CompletedPage documents={allDocs.filter(d => d.status.includes('final'))} />} />
          </Routes>
        </main>
      </div>

      {/* Report Upload Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full custom-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-newsreader text-2xl font-bold text-primary">Upload Verification Report</h3>
              <button onClick={() => setReportModalOpen(false)} className="text-on-surface-variant hover:text-primary p-2">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-surface-container-low p-4 rounded-xl mb-4">
                <p className="text-sm font-medium text-primary">Document: {selectedSubmission?.title}</p>
                <p className="text-xs text-on-surface-variant">Student: {selectedSubmission?.uploadedBy?.name}</p>
              </div>

              {/* Plagiarism Report Section */}
              <div className="p-4 border border-green-200 rounded-xl bg-green-50/30">
                <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600">plagiarism</span> Plagiarism Report
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-on-surface mb-2">Similarity Score (%)</label>
                    <input
                      type="number"
                      value={reportData.similarity_score}
                      onChange={(e) => setReportData({ ...reportData, similarity_score: e.target.value })}
                      placeholder="e.g. 15"
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-on-surface mb-2">Notes (Optional)</label>
                  <textarea
                    value={reportData.plagiarism_notes}
                    onChange={(e) => setReportData({ ...reportData, plagiarism_notes: e.target.value })}
                    placeholder="Add notes for plagiarism report..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2">Report File</label>
                  <div className="border-2 border-dashed border-green-300 rounded-xl p-6 text-center cursor-pointer hover:border-green-500 transition-colors bg-white">
                    <input
                      type="file"
                      id="plagiarism-report-file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => setPlagiarismFile(e.target.files[0])}
                      className="hidden"
                    />
                    <label htmlFor="plagiarism-report-file" className="cursor-pointer">
                      <span className="material-symbols-outlined text-4xl text-green-400 mb-2 block">upload_file</span>
                      {plagiarismFile ? (
                        <span className="text-sm font-medium text-green-700">{plagiarismFile.name}</span>
                      ) : (
                        <span className="text-sm text-on-surface-variant">Click to upload plagiarism report (PDF, DOC, DOCX, TXT)</span>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* AI Detection Report Section */}
              <div className="p-4 border border-purple-200 rounded-xl bg-purple-50/30">
                <h4 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600">psychology</span> AI Detection Report
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-on-surface mb-2">AI Percentage (%)</label>
                    <input
                      type="number"
                      value={reportData.ai_percentage}
                      onChange={(e) => setReportData({ ...reportData, ai_percentage: e.target.value })}
                      placeholder="e.g. 5"
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-on-surface mb-2">Notes (Optional)</label>
                  <textarea
                    value={reportData.ai_notes}
                    onChange={(e) => setReportData({ ...reportData, ai_notes: e.target.value })}
                    placeholder="Add notes for AI detection report..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2">Report File</label>
                  <div className="border-2 border-dashed border-purple-300 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500 transition-colors bg-white">
                    <input
                      type="file"
                      id="ai-report-file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => setAiFile(e.target.files[0])}
                      className="hidden"
                    />
                    <label htmlFor="ai-report-file" className="cursor-pointer">
                      <span className="material-symbols-outlined text-4xl text-purple-400 mb-2 block">upload_file</span>
                      {aiFile ? (
                        <span className="text-sm font-medium text-purple-700">{aiFile.name}</span>
                      ) : (
                        <span className="text-sm text-on-surface-variant">Click to upload AI detection report (PDF, DOC, DOCX, TXT)</span>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setReportModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-semibold hover:bg-surface-container-low transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReportUpload}
                  disabled={!plagiarismFile && !aiFile}
                  className="flex-1 px-6 py-3 rounded-xl bg-secondary-container text-white font-semibold hover:bg-secondary-container/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Upload Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Overview({ pending, completed }) {
  const stats = [
    { label: 'Waiting for Final Review', value: pending, icon: 'folder_open', color: 'text-amber-600' },
    { label: 'Total Processed', value: completed, icon: 'check_circle', color: 'text-green-600' },
  ]

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl custom-shadow p-8 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="p-3 rounded-xl bg-surface-container-low text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
              </div>
              <p className={`text-4xl font-newsreader font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <p className="text-[11px] text-on-surface-variant/40 font-bold uppercase tracking-widest mt-8">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function QueuePage({ documents, onAction, onDownload, onUploadReport }) {
  return (
    <div className="space-y-6">
      {documents.length === 0 ? (
        <div className="bg-white rounded-2xl p-20 flex flex-col items-center text-center custom-shadow">
          <span className="material-symbols-outlined text-[80px] text-green-100 mb-6">task_alt</span>
          <h3 className="font-newsreader text-2xl font-bold text-primary mb-2">Queue is Empty</h3>
          <p className="text-on-surface-variant max-w-xs mx-auto">No documents pending librarian review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map(s => (
            <div key={s._id} className="bg-white rounded-xl custom-shadow px-8 py-6 flex items-center justify-between border-l-4 border-secondary-container">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-2">
                  <h4 className="text-primary font-bold text-lg truncate">{s.title}</h4>
                  <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100">Pending Final Review</span>
                </div>
                <div className="flex items-center gap-6 text-[11px] font-medium text-on-surface-variant/60 uppercase tracking-wider">
                  <span>Student: {s.uploadedBy?.name}</span>
                  <span>Supervisor: {s.supervisorId?.name}</span>
                  <span>Dept: {s.uploadedBy?.department}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => onDownload(s._id)} className="p-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-xl transition-all" title="Download Document">
                  <span className="material-symbols-outlined">download</span>
                </button>
                <button onClick={() => onUploadReport(s)} className="p-3 text-on-surface-variant hover:text-secondary-container hover:bg-surface-container-low rounded-xl transition-all" title="Upload Report">
                  <span className="material-symbols-outlined">upload_file</span>
                </button>
                <div className="flex gap-2">
                  <button onClick={() => onAction(s._id, 'approve')} className="bg-green-50 text-green-700 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-green-100 transition-all">
                    Approve
                  </button>
                  <button onClick={() => onAction(s._id, 'reject')} className="bg-red-50 text-red-700 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-all">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CompletedPage({ documents }) {
  return (
    <div className="bg-white rounded-xl custom-shadow overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant/10">
            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Submission Title</th>
            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Student</th>
            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Final Date</th>
            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/10">
          {documents.map(s => (
            <tr key={s._id} className="hover:bg-surface-container-low/50">
              <td className="px-8 py-6 text-primary font-semibold text-sm">{s.title}</td>
              <td className="px-8 py-6 text-on-surface-variant text-xs">{s.uploadedBy?.name}</td>
              <td className="px-8 py-6 text-on-surface-variant text-xs">{formatDate(s.final_decision_at || s.updatedAt)}</td>
              <td className="px-8 py-6">
                 <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                   s.status === 'approved_final' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                 }`}>
                   {s.status.replace(/_/g, ' ')}
                 </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
