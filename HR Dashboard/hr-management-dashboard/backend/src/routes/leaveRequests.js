import express from 'express';
import { getDb, collections } from '../config/firebase.js';

const router = express.Router();

// Get all leave requests
router.get('/', async (req, res, next) => {
  try {
    const db = getDb();
    const { employeeId, status, limit } = req.query;
    let query = db.collection(collections.leaveRequests).orderBy('startDate', 'desc');
    
    if (employeeId) {
      query = query.where('employeeId', '==', employeeId);
    }
    if (status) {
      query = query.where('status', '==', status);
    }
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const snapshot = await query.get();
    const leaveRequests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(leaveRequests);
  } catch (error) {
    next(error);
  }
});

// Get single leave request
router.get('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const doc = await db.collection(collections.leaveRequests).doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Leave request not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    next(error);
  }
});

// Create leave request
router.post('/', async (req, res, next) => {
  try {
    const db = getDb();
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;
    
    if (!employeeId || !leaveType || !startDate || !endDate) {
      return res.status(400).json({ error: 'Employee ID, leave type, start date, and end date are required' });
    }

    const leaveData = {
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason: reason || '',
      status: 'pending',
    };

    const docRef = await db.collection(collections.leaveRequests).add(leaveData);
    res.status(201).json({ id: docRef.id, ...leaveData });
  } catch (error) {
    next(error);
  }
});

// Update leave request
router.put('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const { leaveType, startDate, endDate, reason, status } = req.body;
    
    const updateData = {
      ...(leaveType && { leaveType }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(reason !== undefined && { reason }),
      ...(status && { status }),
    };

    await db.collection(collections.leaveRequests).doc(req.params.id).update(updateData);
    res.json({ id: req.params.id, ...updateData });
  } catch (error) {
    next(error);
  }
});

// Delete leave request
router.delete('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    await db.collection(collections.leaveRequests).doc(req.params.id).delete();
    res.json({ message: 'Leave request deleted successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
});

export default router;
