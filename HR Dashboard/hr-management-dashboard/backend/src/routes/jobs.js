import express from 'express';
import { getDb, collections } from '../config/firebase.js';

const router = express.Router();

// Get all jobs
router.get('/', async (req, res, next) => {
  try {
    const db = getDb();
    const snapshot = await db.collection(collections.jobs).orderBy('postedDate', 'desc').get();
    
    const jobs = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const jobData = { id: doc.id, ...doc.data() };
        
        // Get candidate count for this job
        const candidatesSnapshot = await db
          .collection(collections.candidates)
          .where('jobId', '==', doc.id)
          .get();
        
        jobData.candidateCount = candidatesSnapshot.size;
        
        return jobData;
      })
    );

    res.json(jobs);
  } catch (error) {
    next(error);
  }
});

// Get single job
router.get('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const doc = await db.collection(collections.jobs).doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    next(error);
  }
});

// Create job
router.post('/', async (req, res, next) => {
  try {
    const db = getDb();
    const { title, department, description, requirements, status } = req.body;

    if (!title || !department) {
      return res.status(400).json({ error: 'Title and department are required' });
    }

    const jobData = {
      title,
      department,
      description: description || '',
      requirements: requirements || [],
      status: status || 'open',
      postedDate: new Date(),
      createdBy: req.user.uid,
    };

    const docRef = await db.collection(collections.jobs).add(jobData);

    res.status(201).json({ id: docRef.id, ...jobData });
  } catch (error) {
    next(error);
  }
});

// Update job
router.put('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const { title, department, description, requirements, status } = req.body;

    const updateData = {
      ...(title && { title }),
      ...(department && { department }),
      ...(description !== undefined && { description }),
      ...(requirements !== undefined && { requirements }),
      ...(status && { status }),
      updatedAt: new Date(),
    };

    await db.collection(collections.jobs).doc(req.params.id).update(updateData);

    res.json({ id: req.params.id, ...updateData });
  } catch (error) {
    next(error);
  }
});

// Delete job
router.delete('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    await db.collection(collections.jobs).doc(req.params.id).delete();
    res.json({ message: 'Job deleted successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
});

export default router;
