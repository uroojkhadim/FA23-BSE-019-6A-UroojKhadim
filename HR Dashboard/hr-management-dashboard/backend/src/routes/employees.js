import express from 'express';
import { getDb, collections } from '../config/firebase.js';

const router = express.Router();

// Get all employees
router.get('/', async (req, res, next) => {
  try {
    const db = getDb();
    const snapshot = await db.collection(collections.employees).orderBy('joiningDate', 'desc').get();
    const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(employees);
  } catch (error) {
    next(error);
  }
});

// Get single employee
router.get('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const doc = await db.collection(collections.employees).doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    next(error);
  }
});

// Create employee
router.post('/', async (req, res, next) => {
  try {
    const db = getDb();
    const { name, email, department, designation, salary, joiningDate, status, profileImage } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const employeeData = {
      name,
      email,
      department: department || '',
      designation: designation || '',
      salary: salary || 0,
      joiningDate: joiningDate || new Date(),
      status: status || 'active',
      profileImage: profileImage || '',
    };

    const docRef = await db.collection(collections.employees).add(employeeData);
    res.status(201).json({ id: docRef.id, ...employeeData });
  } catch (error) {
    next(error);
  }
});

// Update employee
router.put('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const { name, email, department, designation, salary, joiningDate, status, profileImage } = req.body;
    
    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(department !== undefined && { department }),
      ...(designation !== undefined && { designation }),
      ...(salary !== undefined && { salary }),
      ...(joiningDate && { joiningDate }),
      ...(status && { status }),
      ...(profileImage !== undefined && { profileImage }),
    };

    await db.collection(collections.employees).doc(req.params.id).update(updateData);
    res.json({ id: req.params.id, ...updateData });
  } catch (error) {
    next(error);
  }
});

// Delete employee
router.delete('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    await db.collection(collections.employees).doc(req.params.id).delete();
    res.json({ message: 'Employee deleted successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
});

export default router;
