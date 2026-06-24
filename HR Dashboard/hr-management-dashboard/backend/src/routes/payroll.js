import express from 'express';
import { getDb, collections } from '../config/firebase.js';

const router = express.Router();

// Get all payroll records
router.get('/', async (req, res, next) => {
  try {
    const db = getDb();
    const { employeeId, month, limit } = req.query;
    let query = db.collection(collections.payroll).orderBy('month', 'desc');
    
    if (employeeId) {
      query = query.where('employeeId', '==', employeeId);
    }
    if (month) {
      query = query.where('month', '==', month);
    }
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const snapshot = await query.get();
    const payroll = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(payroll);
  } catch (error) {
    next(error);
  }
});

// Get single payroll
router.get('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const doc = await db.collection(collections.payroll).doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Payroll record not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    next(error);
  }
});

// Create payroll record
router.post('/', async (req, res, next) => {
  try {
    const db = getDb();
    const { employeeId, basicSalary, bonus, deductions, month } = req.body;
    
    if (!employeeId || !basicSalary || !month) {
      return res.status(400).json({ error: 'Employee ID, basic salary, and month are required' });
    }

    const payrollData = {
      employeeId,
      basicSalary,
      bonus: bonus || 0,
      deductions: deductions || 0,
      month,
    };

    const docRef = await db.collection(collections.payroll).add(payrollData);
    res.status(201).json({ id: docRef.id, ...payrollData });
  } catch (error) {
    next(error);
  }
});

// Update payroll
router.put('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const { basicSalary, bonus, deductions } = req.body;
    
    const updateData = {
      ...(basicSalary !== undefined && { basicSalary }),
      ...(bonus !== undefined && { bonus }),
      ...(deductions !== undefined && { deductions }),
    };

    await db.collection(collections.payroll).doc(req.params.id).update(updateData);
    res.json({ id: req.params.id, ...updateData });
  } catch (error) {
    next(error);
  }
});

// Delete payroll
router.delete('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    await db.collection(collections.payroll).doc(req.params.id).delete();
    res.json({ message: 'Payroll deleted successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
});

export default router;
