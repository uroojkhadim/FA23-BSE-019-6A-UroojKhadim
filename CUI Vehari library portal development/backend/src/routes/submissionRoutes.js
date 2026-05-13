const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  createSubmissionRecord,
  getMySubmissions,
  getSupervisorPending,
  approveBySupervisor,
  rejectBySupervisor,
  getLibrarianPending,
  approveFinal,
  rejectFinal,
  getAllSubmissions,
  getDownloadUrl,
  adminDeleteFile,
  uploadReport,
  uploadReports,
  getReports,
  getReportDownloadUrl
} = require('../controllers/submissionController');

const router = express.Router();

const multer = require('multer');
const allowedMimes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
// Also allow other common report types
const reportAllowedMimes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!allowedMimes.has(file.mimetype)) {
      return cb(new Error('Invalid file type. Only PDF, DOC, and DOCX are allowed.'));
    }
    return cb(null, true);
  },
});

const reportUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!reportAllowedMimes.has(file.mimetype)) {
      return cb(new Error('Invalid file type for report. Only PDF, DOC, DOCX, and TXT are allowed.'));
    }
    return cb(null, true);
  },
});

const reportsUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!reportAllowedMimes.has(file.mimetype)) {
      return cb(new Error('Invalid file type for report. Only PDF, DOC, DOCX, and TXT are allowed.'));
    }
    return cb(null, true);
  },
});

// Student
router.post('/upload', protect, authorize('student'), upload.single('file'), createSubmissionRecord);
router.get('/my', protect, authorize('student'), getMySubmissions);

// Supervisor
router.get('/supervisor/pending', protect, authorize('supervisor'), getSupervisorPending);
router.put('/:id/approve-supervisor', protect, authorize('supervisor'), approveBySupervisor);
router.put('/:id/reject-supervisor', protect, authorize('supervisor'), rejectBySupervisor);

// Librarian
router.get('/librarian/pending', protect, authorize('librarian'), getLibrarianPending);
router.put('/:id/approve-final', protect, authorize('librarian'), approveFinal);
router.put('/:id/reject-final', protect, authorize('librarian'), rejectFinal);
router.post('/:id/upload-report', protect, authorize('librarian'), reportUpload.single('file'), uploadReport);
router.post('/:id/upload-reports', protect, authorize('librarian'), reportsUpload.fields([
  { name: 'plagiarism_report', maxCount: 1 },
  { name: 'ai_report', maxCount: 1 }
]), uploadReports);

// Admin
router.get('/all', protect, authorize('admin', 'subadmin'), getAllSubmissions);
router.delete('/:id', protect, authorize('admin', 'subadmin'), adminDeleteFile);

// Common
router.get('/:id/download', protect, getDownloadUrl);
router.get('/:id/reports', protect, getReports);
router.get('/reports/:id/download', protect, getReportDownloadUrl);

module.exports = router;
