import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import statsRoutes from './routes/stats.js';
import jobsRoutes from './routes/jobs.js';
import candidatesRoutes from './routes/candidates.js';
import employeesRoutes from './routes/employees.js';
import attendanceRoutes from './routes/attendance.js';
import leaveRequestsRoutes from './routes/leaveRequests.js';
import payrollRoutes from './routes/payroll.js';
import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'HR Management API is running' });
});

// Protected routes
app.use('/api/stats', authMiddleware, statsRoutes);
app.use('/api/jobs', authMiddleware, jobsRoutes);
app.use('/api/candidates', authMiddleware, candidatesRoutes);
app.use('/api/employees', authMiddleware, employeesRoutes);
app.use('/api/attendance', authMiddleware, attendanceRoutes);
app.use('/api/leaveRequests', authMiddleware, leaveRequestsRoutes);
app.use('/api/payroll', authMiddleware, payrollRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}`);
});

export default app;
