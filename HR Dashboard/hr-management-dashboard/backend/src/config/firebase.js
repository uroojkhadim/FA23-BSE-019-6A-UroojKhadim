import admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

// Firestore collections
const collections = {
  jobs: 'jobs',
  candidates: 'candidates',
  hrUsers: 'hrUsers',
  employees: 'employees',
  attendance: 'attendance',
  leaveRequests: 'leaveRequests',
  payroll: 'payroll',
};

// Get services lazily after app is initialized
const getDb = () => admin.firestore();
const getAuth = () => admin.auth();
const getStorage = () => admin.storage();

export { getDb, getAuth, getStorage, collections };
