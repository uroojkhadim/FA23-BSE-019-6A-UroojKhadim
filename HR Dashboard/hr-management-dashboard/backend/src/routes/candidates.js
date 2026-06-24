import express from 'express';
import { getDb, collections } from '../config/firebase.js';

const router = express.Router();

// Get all candidates with filters
router.get('/', async (req, res, next) => {
  try {
    const db = getDb();
    const { status, jobId, limit } = req.query;

    let query = db.collection(collections.candidates).orderBy('appliedDate', 'desc');

    if (status) {
      query = query.where('status', '==', status);
    }

    if (jobId) {
      query = query.where('jobId', '==', jobId);
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const snapshot = await query.get();

    const candidates = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(candidates);
  } catch (error) {
    next(error);
  }
});

// Get single candidate
router.get('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const doc = await db.collection(collections.candidates).doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    next(error);
  }
});

// Create candidate
router.post('/', async (req, res, next) => {
  try {
    const db = getDb();
    const { name, email, phone, jobId, jobTitle, status, resumeURL } = req.body;

    if (!name || !email || !jobId) {
      return res.status(400).json({ error: 'Name, email, and jobId are required' });
    }

    const candidateData = {
      name,
      email,
      phone: phone || '',
      jobId,
      jobTitle: jobTitle || '',
      status: status || 'applied',
      resumeURL: resumeURL || '',
      appliedDate: new Date(),
      hiredDate: null,
      createdBy: req.user.uid,
    };

    const docRef = await db.collection(collections.candidates).add(candidateData);

    res.status(201).json({ id: docRef.id, ...candidateData });
  } catch (error) {
    next(error);
  }
});

// Update candidate
router.put('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const { name, email, phone, jobId, jobTitle, status, resumeURL } = req.body;

    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(phone !== undefined && { phone }),
      ...(jobId && { jobId }),
      ...(jobTitle !== undefined && { jobTitle }),
      ...(resumeURL !== undefined && { resumeURL }),
      updatedAt: new Date(),
    };

    // If status is changing to hired, set hiredDate
    if (status) {
      updateData.status = status;
      if (status === 'hired') {
        updateData.hiredDate = new Date();
      }
    }

    await db.collection(collections.candidates).doc(req.params.id).update(updateData);

    res.json({ id: req.params.id, ...updateData });
  } catch (error) {
    next(error);
  }
});

// Delete candidate
router.delete('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    await db.collection(collections.candidates).doc(req.params.id).delete();
    res.json({ message: 'Candidate deleted successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
});

export default router;
