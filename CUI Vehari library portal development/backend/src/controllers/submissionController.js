const Submission = require('../models/Submission');
const Report = require('../models/Report');
const User = require('../models/User');
const s3 = require('../config/s3');
const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const ALLOWED_THESIS_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const SIGNED_URL_EXPIRY_SECONDS = 600;

const sanitizeFileName = (name = 'file') => name.replace(/[^a-zA-Z0-9.\-_]/g, '_');

// Helper: Upload file to B2
const uploadToB2 = async (file, keyPrefix) => {
  const fileKey = `${keyPrefix}/${Date.now()}_${sanitizeFileName(file.originalname)}`;
  await s3.send(new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));
  return fileKey;
};

// --- Student Endpoints ---

// POST /api/documents/upload
exports.createSubmissionRecord = async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.file || !title) {
      return res.status(400).json({ error: 'File and title are required' });
    }

    if (!ALLOWED_THESIS_MIME_TYPES.has(req.file.mimetype)) {
      return res.status(400).json({ error: 'Only PDF, DOC, and DOCX files are allowed' });
    }

    const fileKey = await uploadToB2(req.file, `submissions/${req.user._id}`);
    const fileUrl = `${process.env.B2_ENDPOINT}/${process.env.B2_BUCKET_NAME}/${fileKey}`;

    const sub = await Submission.create({
      title,
      fileUrl,
      file_key: fileKey,
      file_name: req.file.originalname,
      file_size: req.file.size,
      uploadedBy: req.user._id,
      supervisorId: req.user.supervisor_id, // Assigned supervisor
      status: 'pending_supervisor'
    });

    res.status(201).json({ success: true, message: 'Submission uploaded successfully', id: sub._id });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: `Upload failed: ${err.message}` });
  }
};

// GET /api/documents/my
exports.getMySubmissions = async (req, res) => {
  try {
    const subs = await Submission.find({ uploadedBy: req.user._id })
      .populate('supervisorId', 'name email')
      .populate('librarianId', 'name email')
      .sort('-createdAt')
      .lean();

    res.status(200).json({ 
      success: true, 
      documents: subs.map(s => ({ ...s, id: s._id })) 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Supervisor Endpoints ---

// GET /api/documents/supervisor/pending
exports.getSupervisorPending = async (req, res) => {
  try {
    const subs = await Submission.find({ 
      status: 'pending_supervisor',
      supervisorId: req.user._id
    })
      .populate('uploadedBy', 'name reg_number department')
      .sort('-createdAt')
      .lean();

    res.status(200).json({ 
      success: true, 
      documents: subs.map(s => ({ ...s, id: s._id })) 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/documents/:id/approve-supervisor
exports.approveBySupervisor = async (req, res) => {
  try {
    const sub = await Submission.findOne({ 
      _id: req.params.id, 
      supervisorId: req.user._id,
      status: 'pending_supervisor'
    });

    if (!sub) {
      return res.status(404).json({ error: 'Document not found or not in pending status' });
    }

    sub.status = 'pending_librarian';
    sub.approved_at = new Date();
    await sub.save();

    res.status(200).json({ success: true, message: 'Approved by supervisor' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/documents/:id/reject-supervisor
exports.rejectBySupervisor = async (req, res) => {
  try {
    const sub = await Submission.findOne({ 
      _id: req.params.id, 
      supervisorId: req.user._id,
      status: 'pending_supervisor'
    });

    if (!sub) {
      return res.status(404).json({ error: 'Document not found or not in pending status' });
    }

    sub.status = 'rejected';
    sub.reject_reason = req.body.reason || 'Rejected by supervisor';
    await sub.save();

    res.status(200).json({ success: true, message: 'Rejected by supervisor' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Librarian Endpoints ---

// GET /api/documents/librarian/pending
exports.getLibrarianPending = async (req, res) => {
  try {
    const subs = await Submission.find({ status: 'pending_librarian' })
      .populate('uploadedBy', 'name reg_number department')
      .populate('supervisorId', 'name')
      .sort('-createdAt')
      .lean();

    res.status(200).json({ 
      success: true, 
      documents: subs.map(s => ({ ...s, id: s._id })) 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/documents/:id/approve-final
exports.approveFinal = async (req, res) => {
  try {
    const sub = await Submission.findOne({ 
      _id: req.params.id, 
      status: 'pending_librarian' 
    });

    if (!sub) {
      return res.status(404).json({ error: 'Document not found or not approved by supervisor' });
    }

    sub.status = 'completed';
    sub.librarianId = req.user._id;
    sub.final_decision_at = new Date();
    await sub.save();

    res.status(200).json({ success: true, message: 'Final approval granted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/documents/:id/reject-final
exports.rejectFinal = async (req, res) => {
  try {
    const sub = await Submission.findOne({ 
      _id: req.params.id, 
      status: 'pending_librarian' 
    });

    if (!sub) {
      return res.status(404).json({ error: 'Document not found or not approved by supervisor' });
    }

    sub.status = 'rejected';
    sub.librarianId = req.user._id;
    sub.reject_reason = req.body.reason || 'Rejected by librarian';
    sub.final_decision_at = new Date();
    await sub.save();

    res.status(200).json({ success: true, message: 'Final rejection issued' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/documents/:id/upload-reports (Librarian only) - accepts both reports
exports.uploadReports = async (req, res) => {
  try {
    const submissionId = req.params.id;
    const { similarity_score, ai_percentage, plagiarism_notes, ai_notes } = req.body;
    const plagiarismFile = req.files?.plagiarism_report?.[0];
    const aiFile = req.files?.ai_report?.[0];
    
    if (!plagiarismFile && !aiFile) {
      return res.status(400).json({ error: 'At least one report file is required' });
    }
    
    const sub = await Submission.findById(submissionId);
    if (!sub) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    // Upload Plagiarism Report if provided
    if (plagiarismFile) {
      const fileKey = await uploadToB2(plagiarismFile, `reports/${submissionId}`);
      const fileUrl = `${process.env.B2_ENDPOINT}/${process.env.B2_BUCKET_NAME}/${fileKey}`;
      sub.doc_report_url = fileUrl;
      sub.doc_report_key = fileKey;
      
      await Report.create({
        submission_id: submissionId,
        librarian_id: req.user._id,
        report_type: 'plagiarism',
        file_key: fileKey,
        file_name: plagiarismFile.originalname,
        similarity_score: similarity_score ? Number(similarity_score) : null,
        notes: plagiarism_notes
      });
    }
    
    // Upload AI Detection Report if provided
    if (aiFile) {
      const fileKey = await uploadToB2(aiFile, `reports/${submissionId}`);
      const fileUrl = `${process.env.B2_ENDPOINT}/${process.env.B2_BUCKET_NAME}/${fileKey}`;
      sub.ai_report_url = fileUrl;
      sub.ai_report_key = fileKey;
      
      await Report.create({
        submission_id: submissionId,
        librarian_id: req.user._id,
        report_type: 'ai',
        file_key: fileKey,
        file_name: aiFile.originalname,
        ai_percentage: ai_percentage ? Number(ai_percentage) : null,
        notes: ai_notes
      });
    }
    
    // If both reports are uploaded, mark as completed
    if (sub.doc_report_url && sub.ai_report_url) {
      sub.status = 'completed';
      sub.librarianId = req.user._id;
      sub.final_decision_at = new Date();
    }
    
    await sub.save();
    res.status(201).json({ success: true, message: 'Reports uploaded successfully', submission: sub });
  } catch (err) {
    console.error('Reports Upload Error:', err);
    res.status(500).json({ error: `Reports upload failed: ${err.message}` });
  }
};

// --- Admin Endpoints ---

// GET /api/documents/all
exports.getAllSubmissions = async (req, res) => {
  try {
    const subs = await Submission.find()
      .populate('uploadedBy', 'name reg_number department')
      .populate('supervisorId', 'name')
      .populate('librarianId', 'name')
      .sort('-createdAt')
      .lean();

    const stats = {
      total: subs.length,
      completed: subs.filter(s => s.status === 'completed').length,
      rejected: subs.filter(s => s.status === 'rejected').length,
      pending: subs.filter(s => ['pending_supervisor', 'pending_librarian'].includes(s.status)).length,
    };

    res.status(200).json({ 
      success: true, 
      documents: subs.map(s => ({ ...s, id: s._id })),
      stats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Common Endpoints ---

// GET /api/documents/:id/download
exports.getDownloadUrl = async (req, res) => {
  try {
    const sub = await Submission.findById(req.params.id);
    if (!sub) return res.status(404).json({ error: 'Document not found' });
    
    // Access control check
    const isOwner = String(sub.uploadedBy) === String(req.user._id);
    const isSupervisor = String(sub.supervisorId) === String(req.user._id);
    const isAdminOrLibrarian = ['admin', 'librarian'].includes(req.user.role);

    if (!isOwner && !isSupervisor && !isAdminOrLibrarian) {
      return res.status(403).json({ error: 'Not authorized to download this document' });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: sub.file_key,
      ResponseContentDisposition: `attachment; filename="${sanitizeFileName(sub.file_name)}"`,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: SIGNED_URL_EXPIRY_SECONDS });
    return res.json({ success: true, url });
  } catch (err) {
    console.error('Download URL error:', err);
    res.status(500).json({ error: `Download failed: ${err.message}` });
  }
};

// DELETE /api/documents/:id (Admin only)
exports.adminDeleteFile = async (req, res) => {
  try {
    const sub = await Submission.findById(req.params.id);
    if (!sub) return res.status(404).json({ error: 'Document not found' });

    // Delete from storage
    try {
      await s3.send(new DeleteObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME,
        Key: sub.file_key,
      }));
      if (sub.doc_report_key) {
        await s3.send(new DeleteObjectCommand({
          Bucket: process.env.B2_BUCKET_NAME,
          Key: sub.doc_report_key,
        }));
      }
      if (sub.ai_report_key) {
        await s3.send(new DeleteObjectCommand({
          Bucket: process.env.B2_BUCKET_NAME,
          Key: sub.ai_report_key,
        }));
      }
    } catch (err) {
      console.warn('Storage deletion failed:', err.message);
    }

    await Submission.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Document deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/documents/:id/upload-report (Librarian only) - keep for backward compatibility
exports.uploadReport = async (req, res) => {
  try {
    const submissionId = req.params.id;
    const { report_type, similarity_score, ai_percentage, notes } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Report file is required' });
    }
    
    const sub = await Submission.findById(submissionId);
    if (!sub) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    const fileKey = await uploadToB2(req.file, `reports/${submissionId}`);
    const report = await Report.create({
      submission_id: submissionId,
      librarian_id: req.user._id,
      report_type,
      file_key: fileKey,
      file_name: req.file.originalname,
      similarity_score: similarity_score ? Number(similarity_score) : null,
      ai_percentage: ai_percentage ? Number(ai_percentage) : null,
      notes
    });
    
    res.status(201).json({ success: true, message: 'Report uploaded successfully', report });
  } catch (err) {
    console.error('Report Upload Error:', err);
    res.status(500).json({ error: `Report upload failed: ${err.message}` });
  }
};

// GET /api/documents/:id/reports (Student, Librarian, Supervisor, Admin)
exports.getReports = async (req, res) => {
  try {
    const submissionId = req.params.id;
    
    const sub = await Submission.findById(submissionId);
    if (!sub) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    // Check access
    const isOwner = String(sub.uploadedBy) === String(req.user._id);
    const isSupervisor = String(sub.supervisorId) === String(req.user._id);
    const isLibrarian = req.user.role === 'librarian';
    const isAdmin = ['admin', 'subadmin'].includes(req.user.role);
    
    if (!isOwner && !isSupervisor && !isLibrarian && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to view these reports' });
    }
    
    const reports = await Report.find({ submission_id: submissionId })
      .populate('librarian_id', 'name email')
      .sort('-created_at')
      .lean();
      
    res.status(200).json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/reports/:id/download
exports.getReportDownloadUrl = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    const command = new GetObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: report.file_key,
      ResponseContentDisposition: `attachment; filename="${sanitizeFileName(report.file_name)}"`,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: SIGNED_URL_EXPIRY_SECONDS });
    return res.json({ success: true, url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
