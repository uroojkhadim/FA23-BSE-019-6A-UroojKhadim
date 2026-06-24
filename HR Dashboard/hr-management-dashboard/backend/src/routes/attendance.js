import express from 'express';
import { getDb, collections } from '../config/firebase.js';

const router = express.Router();

// Get all attendance
router.get('/', async (req, res, next) => {
  try {
    const db = getDb();
    const { employeeId, date, limit } = req.query;
    let query = db.collection(collections.attendance).orderBy('date', 'desc');
    
    if (employeeId) {
      query = query.where('employeeId', '==', employeeId);
    }
    if (date) {
      query = query.where('date', '==', date);
    }
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const snapshot = await query.get();
    const attendance = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(attendance);
  } catch (error) {
    next(error);
  }
});

// Get single attendance
router.get('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const doc = await db.collection(collections.attendance).doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    next(error);
  }
});

// Create attendance
router.post('/', async (req, res, next) => {
  try {
    const db = getDb();
    const { employeeId, date, checkIn, checkOut, status } = req.body;
    
    if (!employeeId || !date) {
      return res.status(400).json({ error: 'Employee ID and date are required' });
    }

    const attendanceData = {
      employeeId,
      date,
      checkIn: checkIn || null,
      checkOut: checkOut || null,
      status: status || 'pending',
    };

    const docRef = await db.collection(collections.attendance).add(attendanceData);
    res.status(201).json({ id: docRef.id, ...attendanceData });
  } catch (error) {
    next(error);
  }
});

// Update attendance
router.put('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const { checkIn, checkOut, status } = req.body;
    
    const updateData = {
      ...(checkIn !== undefined && { checkIn }),
      ...(checkOut !== undefined && { checkOut }),
      ...(status && { status }),
    };

    await db.collection(collections.attendance).doc(req.params.id).update(updateData);
    res.json({ id: req.params.id, ...updateData });
  } catch (error) {
    next(error);
  }
});

// Delete attendance
router.delete('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    await db.collection(collections.attendance).doc(req.params.id).delete();
    res.json({ message: 'Attendance deleted successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
});

export default router;
