const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function getToken() {
  return localStorage.getItem('cui_token')
}

async function apiFetch(path, options = {}) {
  try {
    const token = await getToken()
    const isFormData = options.body instanceof FormData
    const headers = {
      ...options.headers
    }
    if (token) headers['Authorization'] = `Bearer ${token}`
    if (!isFormData) headers['Content-Type'] = 'application/json'

    const res = await fetch(
      `${BASE}${path}`,
      { ...options, headers }
    )

    let data
    try {
      data = await res.json()
    } catch {
      throw new Error(`Server returned ${res.status} — check if backend is running on port 3001`)
    }

    if (!res.ok) {
      const errorMessage = data.message || data.error || `Request failed with status ${res.status}`
      const error = new Error(errorMessage)
      error.status = res.status
      error.data = data
      throw error
    }

    return data
  } catch (e) {
    console.error(`API Error [${path}]:`, e.message)
    throw e
  }
}

export const api = {
  me: () => apiFetch('/api/auth/me'),
  login: (data) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getSupervisors: () => apiFetch('/api/auth/supervisors'),
  
  // Student
  uploadDocument: (formData) => apiFetch('/api/documents/upload', {
    method: 'POST',
    body: formData
  }),
  getMyDocuments: () => apiFetch('/api/documents/my'),

  // Supervisor
  getSupervisorPending: () => apiFetch('/api/documents/supervisor/pending'),
  getSupervisorAll: () => apiFetch('/api/documents/supervisor/all'),
  getSupervisorStudents: () => apiFetch('/api/documents/supervisor/students'),
  approveBySupervisor: (id) => apiFetch(`/api/documents/${id}/approve-supervisor`, { method: 'PUT' }),
  rejectBySupervisor: (id, reason) => apiFetch(`/api/documents/${id}/reject-supervisor`, { 
    method: 'PUT', 
    body: JSON.stringify({ reason }) 
  }),

  // Librarian
  getLibrarianPending: () => apiFetch('/api/documents/librarian/pending'),
  approveFinal: (id) => apiFetch(`/api/documents/${id}/approve-final`, { method: 'PUT' }),
  rejectFinal: (id, reason) => apiFetch(`/api/documents/${id}/reject-final`, { 
    method: 'PUT', 
    body: JSON.stringify({ reason }) 
  }),
  uploadReport: (id, formData) => apiFetch(`/api/documents/${id}/upload-report`, {
    method: 'POST',
    body: formData
  }),
  uploadReports: (id, formData) => apiFetch(`/api/documents/${id}/upload-reports`, {
    method: 'POST',
    body: formData
  }),

  // Admin
  getAllDocuments: () => apiFetch('/api/documents/all'),
  deleteDocument: (id) => apiFetch(`/api/documents/${id}`, { method: 'DELETE' }),
  
  // Auth/Admin Utils
  getUsers: (params) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/api/admin/users?${query}`);
  },
  addFaculty: (data) => apiFetch('/api/admin/users', { method: 'POST', body: JSON.stringify(data) }),
  createUser: (data) => apiFetch('/api/admin/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUserStatus: (id, status) => apiFetch(`/api/admin/users/${id}/status`, { 
    method: 'POST', 
    body: JSON.stringify({ status }) 
  }),
  
  // Common
  getDownloadUrl: (id) => apiFetch(`/api/documents/${id}/download`),
  getReports: (id) => apiFetch(`/api/documents/${id}/reports`),
  getReportDownloadUrl: (id) => apiFetch(`/api/documents/reports/${id}/download`)
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
