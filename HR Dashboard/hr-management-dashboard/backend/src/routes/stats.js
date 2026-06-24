import express from 'express';
import { getDb, collections } from '../config/firebase.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const db = getDb();
    const [jobsSnapshot, candidatesSnapshot] = await Promise.all([
      db.collection(collections.jobs).get(),
      db.collection(collections.candidates).get(),
    ]);

    const jobs = jobsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const candidates = candidatesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Calculate statistics
    const totalApplications = candidates.length;
    const totalHired = candidates.filter((c) => c.status === 'hired').length;
    const openJobs = jobs.filter((j) => j.status === 'open').length;

    // Calculate average time to hire (in days)
    const hiredCandidates = candidates.filter(
      (c) => c.status === 'hired' && c.hiredDate && c.appliedDate
    );
    const avgTimeToHire =
      hiredCandidates.length > 0
        ? Math.round(
            hiredCandidates.reduce((sum, c) => {
              const applied = c.appliedDate.toDate();
              const hired = c.hiredDate.toDate();
              const days = Math.floor((hired - applied) / (1000 * 60 * 60 * 24));
              return sum + days;
            }, 0) / hiredCandidates.length
          )
        : 0;

    res.json({
      totalApplications,
      totalHired,
      openJobs,
      avgTimeToHire,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
