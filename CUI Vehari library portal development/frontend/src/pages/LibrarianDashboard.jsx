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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-0 max-w-3xl w-full custom-shadow overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-secondary-container to-amber-400 p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-newsreader text-2xl font-bold">Upload Verification Report</h3>
                  <p className="text-white/90 text-sm mt-1">Complete the plagiarism and AI detection checks</p>
                </div>
                <button 
                  onClick={() => setReportModalOpen(false)} 
                  className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Document Info Card */}
              <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary-container/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-secondary-container">description</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-primary text-lg truncate">{selectedSubmission?.title}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      <span className="inline-flex items-center gap-2 text-on-surface-variant text-sm">
                        <span className="material-symbols-outlined text-base">person</span>
                        {selectedSubmission?.uploadedBy?.name}
                      </span>
                      {selectedSubmission?.uploadedBy?.department && (
                        <span className="inline-flex items-center gap-2 text-on-surface-variant text-sm">
                          <span className="material-symbols-outlined text-base">apartment</span>
                          {selectedSubmission?.uploadedBy?.department}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Plagiarism Report Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-outline-variant/10">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-600">plagiarism</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-green-800">Plagiarism Report</h4>
                    <p className="text-green-600/70 text-xs">Check document originality</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Similarity Score (%)</label>
                    <input
                      type="number"
                      value={reportData.similarity_score}
                      onChange={(e) => setReportData({ ...reportData, similarity_score: e.target.value })}
                      placeholder="e.g. 15"
                      className="w-full px-4 py-3.5 rounded-2xl border border-outline-variant bg-white focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 transition-all text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Notes (Optional)</label>
                    <textarea
                      value={reportData.plagiarism_notes}
                      onChange={(e) => setReportData({ ...reportData, plagiarism_notes: e.target.value })}
                      placeholder="Add any relevant notes about the plagiarism check..."
                      rows={1}
                      className="w-full px-4 py-3.5 rounded-2xl border border-outline-variant bg-white focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 transition-all text-sm resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Report File</label>
                  {plagiarismFile ? (
                    <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-green-600">picture_as_pdf</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-green-800 truncate">{plagiarismFile.name}</p>
                        <p className="text-green-600/70 text-xs">{formatBytes(plagiarismFile.size)}</p>
                      </div>
                      <button 
                        onClick={() => setPlagiarismFile(null)}
                        className="p-2 text-green-600/60 hover:text-green-800 hover:bg-green-100 rounded-lg transition-all"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  ) : (
                    <label className="block">
                      <div className="border-2 border-dashed border-green-300 rounded-2xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50/30 transition-all bg-white">
                        <input
                          type="file"
                          id="plagiarism-report-file"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) => setPlagiarismFile(e.target.files[0])}
                          className="hidden"
                        />
                        <span className="material-symbols-outlined text-5xl text-green-400 mb-4 block">cloud_upload</span>
                        <p className="text-sm font-semibold text-green-700 mb-1">Click to upload or drag &amp; drop</p>
                        <p className="text-xs text-green-600/60">PDF, DOC, DOCX, or TXT (Max 25MB)</p>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* AI Detection Report Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-outline-variant/10">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-purple-600">psychology</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-800">AI Detection Report</h4>
                    <p className="text-purple-600/70 text-xs">Analyze AI-generated content</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">AI Percentage (%)</label>
                    <input
                      type="number"
                      value={reportData.ai_percentage}
                      onChange={(e) => setReportData({ ...reportData, ai_percentage: e.target.value })}
                      placeholder="e.g. 5"
                      className="w-full px-4 py-3.5 rounded-2xl border border-outline-variant bg-white focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Notes (Optional)</label>
                    <textarea
                      value={reportData.ai_notes}
                      onChange={(e) => setReportData({ ...reportData, ai_notes: e.target.value })}
                      placeholder="Add any relevant notes about the AI detection..."
                      rows={1}
                      className="w-full px-4 py-3.5 rounded-2xl border border-outline-variant bg-white focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all text-sm resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Report File</label>
                  {aiFile ? (
                    <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-5 flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-purple-600">picture_as_pdf</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-purple-800 truncate">{aiFile.name}</p>
                        <p className="text-purple-600/70 text-xs">{formatBytes(aiFile.size)}</p>
                      </div>
                      <button 
                        onClick={() => setAiFile(null)}
                        className="p-2 text-purple-600/60 hover:text-purple-800 hover:bg-purple-100 rounded-lg transition-all"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  ) : (
                    <label className="block">
                      <div className="border-2 border-dashed border-purple-300 rounded-2xl p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50/30 transition-all bg-white">
                        <input
                          type="file"
                          id="ai-report-file"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) => setAiFile(e.target.files[0])}
                          className="hidden"
                        />
                        <span className="material-symbols-outlined text-5xl text-purple-400 mb-4 block">cloud_upload</span>
                        <p className="text-sm font-semibold text-purple-700 mb-1">Click to upload or drag &amp; drop</p>
                        <p className="text-xs text-purple-600/60">PDF, DOC, DOCX, or TXT (Max 25MB)</p>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-outline-variant/10">
                <button
                  onClick={() => setReportModalOpen(false)}
                  className="flex-1 px-8 py-4 rounded-2xl border-2 border-outline-variant text-on-surface-variant font-bold text-sm hover:bg-surface-container-low hover:border-outline-variant/40 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReportUpload}
                  disabled={!plagiarismFile && !aiFile}
                  className="flex-1 px-8 py-4 rounded-2xl bg-secondary-container text-white font-bold text-sm hover:bg-amber-500 shadow-lg shadow-secondary-container/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
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
            <div key={s._id} className="bg-white rounded-xl custom-shadow p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between border-l-4 border-secondary-container gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h4 className="text-primary font-bold text-lg truncate">{s.title}</h4>
                  <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100">Pending Final Review</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium text-on-surface-variant/60 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">person</span>
                    Student: {s.uploadedBy?.name}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">supervisor_account</span>
                    Supervisor: {s.supervisorId?.name}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">apartment</span>
                    Dept: {s.uploadedBy?.department}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                <div className="flex gap-2 w-full lg:w-auto">
                  <button onClick={() => onDownload(s._id)} className="flex-1 lg:flex-none p-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-xl transition-all" title="Download Document">
                    <span className="material-symbols-outlined">download</span>
                  </button>
                  <button onClick={() => onUploadReport(s)} className="flex-1 lg:flex-none p-3 text-on-surface-variant hover:text-secondary-container hover:bg-surface-container-low rounded-xl transition-all" title="Upload Report">
                    <span className="material-symbols-outlined">upload_file</span>
                  </button>
                </div>
                <div className="flex gap-2 w-full lg:w-auto">
                  <button onClick={() => onAction(s._id, 'approve')} className="flex-1 lg:flex-none bg-green-50 text-green-700 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-green-100 transition-all">
                    Approve
                  </button>
                  <button onClick={() => onAction(s._id, 'reject')} className="flex-1 lg:flex-none bg-red-50 text-red-700 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-all">
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
    <div className="bg-white rounded-xl custom-shadow overflow-hidden overflow-x-auto">
      <table className="w-full text-left min-w-[600px]">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant/10">
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Submission Title</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 hidden sm:table-cell">Student</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 hidden md:table-cell">Final Date</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/10">
          {documents.map(s => (
            <tr key={s._id} className="hover:bg-surface-container-low/50">
              <td className="px-6 py-4 text-primary font-semibold text-sm">{s.title}</td>
              <td className="px-6 py-4 text-on-surface-variant text-xs hidden sm:table-cell">{s.uploadedBy?.name}</td>
              <td className="px-6 py-4 text-on-surface-variant text-xs hidden md:table-cell">{formatDate(s.final_decision_at || s.updatedAt)}</td>
              <td className="px-6 py-4">
                 <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                   s.status === 'approved_final' || s.status === 'completed' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
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
