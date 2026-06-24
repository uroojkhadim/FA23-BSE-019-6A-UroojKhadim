import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';

// Mock data
const MOCK_DATA = {
  employees: [
    { id: 'emp-1', name: 'John Smith', email: 'john.smith@company.com', department: 'Engineering', designation: 'Senior Engineer', salary: 95000, joiningDate: '2022-03-15', status: 'active' },
    { id: 'emp-2', name: 'Emily Davis', email: 'emily.davis@company.com', department: 'Design', designation: 'Lead Designer', salary: 85000, joiningDate: '2021-08-20', status: 'active' },
    { id: 'emp-3', name: 'Michael Brown', email: 'michael.brown@company.com', department: 'Engineering', designation: 'Backend Developer', salary: 80000, joiningDate: '2023-01-10', status: 'active' },
    { id: 'emp-4', name: 'Sarah Wilson', email: 'sarah.wilson@company.com', department: 'HR', designation: 'HR Manager', salary: 75000, joiningDate: '2020-11-05', status: 'active' },
    { id: 'emp-5', name: 'David Lee', email: 'david.lee@company.com', department: 'Marketing', designation: 'Marketing Lead', salary: 70000, joiningDate: '2022-06-18', status: 'active' },
  ],
  jobs: [
    { id: 'job-1', title: 'Senior Frontend Developer', department: 'Engineering', description: 'We\'re looking for an experienced frontend developer to join our team.', requirements: ['5+ years of React experience', 'Strong TypeScript skills'], status: 'open', postedDate: '2024-05-15' },
    { id: 'job-2', title: 'UX/UI Designer', department: 'Design', description: 'Join our design team to create beautiful user experiences.', requirements: ['3+ years of UI/UX design', 'Proficiency in Figma'], status: 'open', postedDate: '2024-05-20' },
    { id: 'job-3', title: 'Backend Engineer', department: 'Engineering', description: 'Build scalable backend systems for our platform.', requirements: ['4+ years Node.js experience', 'Database design expertise'], status: 'open', postedDate: '2024-05-25' },
  ],
  candidates: [
    { id: 'cand-1', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1 (555) 123-4567', jobId: 'job-1', jobTitle: 'Senior Frontend Developer', status: 'interview', appliedDate: '2024-05-20', resumeURL: '' },
    { id: 'cand-2', name: 'Michael Chen', email: 'm.chen@email.com', phone: '+1 (555) 234-5678', jobId: 'job-1', jobTitle: 'Senior Frontend Developer', status: 'screened', appliedDate: '2024-05-22', resumeURL: '' },
    { id: 'cand-3', name: 'Emily Rodriguez', email: 'e.rodriguez@email.com', phone: '+1 (555) 345-6789', jobId: 'job-2', jobTitle: 'UX/UI Designer', status: 'offer', appliedDate: '2024-05-23', resumeURL: '' },
  ],
  attendance: [
    { id: 'att-1', employeeId: 'emp-1', date: '2024-06-20', checkIn: '09:15', checkOut: '17:45', status: 'present' },
    { id: 'att-2', employeeId: 'emp-2', date: '2024-06-20', checkIn: '09:30', checkOut: '18:00', status: 'present' },
    { id: 'att-3', employeeId: 'emp-3', date: '2024-06-20', checkIn: null, checkOut: null, status: 'absent' },
  ],
  leaveRequests: [
    { id: 'leave-1', employeeId: 'emp-1', leaveType: 'annual', startDate: '2024-07-01', endDate: '2024-07-05', reason: 'Summer vacation', status: 'approved' },
    { id: 'leave-2', employeeId: 'emp-2', leaveType: 'sick', startDate: '2024-06-25', endDate: '2024-06-26', reason: 'Flu symptoms', status: 'pending' },
  ],
  payroll: [
    { id: 'pay-1', employeeId: 'emp-1', basicSalary: 95000, bonus: 5000, deductions: 2000, month: '2024-05' },
    { id: 'pay-2', employeeId: 'emp-2', basicSalary: 85000, bonus: 3000, deductions: 1500, month: '2024-05' },
  ]
};

let demoDataStorage = {};

export const useFirestore = (collectionName, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(`🔥 [useFirestore] Setting up listener for ${collectionName}`);
    
    // Check if we're in demo mode
    const isDemo = !import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === 'your_api_key_here';
    
    if (isDemo) {
      console.log(`🎮 [useFirestore] Using demo mode for ${collectionName}`);
      // Load mock data after short delay
      const timer = setTimeout(() => {
        setData(MOCK_DATA[collectionName] || []);
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
    
    // Safety timeout to ensure loading stops after 5 seconds no matter what!
    const safetyTimeout = setTimeout(() => {
      console.warn(`⚠️ [useFirestore] Safety timeout triggered for ${collectionName}`);
      setLoading(false);
    }, 5000);
    
    let q;
    try {
      q = query(collection(db, collectionName));
      
      if (options.orderBy) {
        q = query(q, orderBy(options.orderBy.field, options.orderBy.direction || 'desc'));
      }
      
      if (options.where && Array.isArray(options.where)) {
        options.where.forEach(w => {
          if (w.field && w.operator && w.value !== undefined) {
            q = query(q, where(w.field, w.operator, w.value));
          }
        });
      }
    } catch (err) {
      console.error('❌ [useFirestore] Failed to create query:', err);
      setError(err);
      setLoading(false);
      clearTimeout(safetyTimeout);
      return;
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setData(docs);
          setLoading(false);
          setError(null);
          console.log(`✅ [useFirestore] Fetched ${docs.length} docs from ${collectionName}`);
          clearTimeout(safetyTimeout);
        } catch (err) {
          console.error('❌ [useFirestore] Failed to process snapshot:', err);
          setError(err);
          setLoading(false);
          clearTimeout(safetyTimeout);
        }
      },
      (err) => {
        console.error(`❌ [useFirestore] Listener error for ${collectionName}:`, err);
        setError(err);
        setLoading(false);
        clearTimeout(safetyTimeout);
      }
    );

    return () => {
      console.log(`🔇 [useFirestore] Unsubscribing from ${collectionName}`);
      unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, [collectionName, options.orderBy?.field, options.orderBy?.direction]);

  return { data, loading, error };
};

// Helper functions for demo mode CRUD (will be used by pages)
export const getDemoData = (collectionName) => {
  return demoDataStorage[collectionName] || MOCK_DATA[collectionName] || [];
};

export const setDemoData = (collectionName, newData) => {
  demoDataStorage[collectionName] = newData;
  // For now, we don't have real-time updates in demo mode, but this is a placeholder
};
