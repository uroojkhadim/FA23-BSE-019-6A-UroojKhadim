import axios from 'axios';
import { auth } from '../config/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      auth.signOut();
    }
    return Promise.reject(error);
  }
);

// Stats
export const getStats = () => api.get('/stats');

// Jobs
export const getJobs = () => api.get('/jobs');
export const getJob = (id) => api.get(`/jobs/${id}`);
export const createJob = (data) => api.post('/jobs', data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);

// Candidates
export const getCandidates = (params) => api.get('/candidates', { params });
export const getCandidate = (id) => api.get(`/candidates/${id}`);
export const createCandidate = (data) => api.post('/candidates', data);
export const updateCandidate = (id, data) => api.put(`/candidates/${id}`, data);
export const deleteCandidate = (id) => api.delete(`/candidates/${id}`);

// Employees
export const getEmployees = () => api.get('/employees');
export const getEmployee = (id) => api.get(`/employees/${id}`);
export const createEmployee = (data) => api.post('/employees', data);
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

// Attendance
export const getAttendance = (params) => api.get('/attendance', { params });
export const getAttendanceRecord = (id) => api.get(`/attendance/${id}`);
export const createAttendance = (data) => api.post('/attendance', data);
export const updateAttendance = (id, data) => api.put(`/attendance/${id}`, data);
export const deleteAttendance = (id) => api.delete(`/attendance/${id}`);

// Leave Requests
export const getLeaveRequests = (params) => api.get('/leaveRequests', { params });
export const getLeaveRequest = (id) => api.get(`/leaveRequests/${id}`);
export const createLeaveRequest = (data) => api.post('/leaveRequests', data);
export const updateLeaveRequest = (id, data) => api.put(`/leaveRequests/${id}`, data);
export const deleteLeaveRequest = (id) => api.delete(`/leaveRequests/${id}`);

// Payroll
export const getPayroll = (params) => api.get('/payroll', { params });
export const getPayrollRecord = (id) => api.get(`/payroll/${id}`);
export const createPayroll = (data) => api.post('/payroll', data);
export const updatePayroll = (id, data) => api.put(`/payroll/${id}`, data);
export const deletePayroll = (id) => api.delete(`/payroll/${id}`);

export default api;
