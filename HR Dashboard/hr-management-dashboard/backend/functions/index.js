import functions from 'firebase-functions';
import admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import statsRoutes from '../src/routes/stats.js';
import jobsRoutes from '../src/routes/jobs.js';
import candidatesRoutes from '../src/routes/candidates.js';
import employeesRoutes from '../src/routes/employees.js';
import attendanceRoutes from '../src/routes/attendance.js';
import leaveRequestsRoutes from '../src/routes/leaveRequests.js';
import payrollRoutes from '../src/routes/payroll.js';
import { authMiddleware } from '../src/middleware/auth.js';
import { errorHandler } from '../src/middleware/errorHandler.js';

// Initialize Firebase Admin
admin.initializeApp();

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

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

// Export the Express app as a Firebase Cloud Function
export const api = functions.https.onRequest(app);
