require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql } = require('./db/index');
const { requireRole } = require('./lib/auth');
const { uploadFile, getDownloadUrl, deleteFile } = require('./lib/storage');

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key';

const app = express();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit as requested
});

app.use(cors());
app.use(express.json());

// --- AUTH ROUTES ---

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phone, department, supervisor_id, role } = req.body;
  
  if (!email || !password || !name || !role) {
    return res.status(400).json({ 
      success: false, 
      message: 'All required fields must be filled' 
    });
  }

  try {
    const [existing] = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing) return res.status(409).json({ 
      success: false, 
      message: 'User with this email already exists' 
    });

    const password_hash = await bcrypt.hash(password, 10);
    
    // Students start as 'pending', others as 'approved' (admins/librarians/supervisors added by admin)
    const status = (role === 'student') ? 'pending' : 'approved';

    const [user] = await sql`
      INSERT INTO users (name, email, password_hash, role, department, phone, supervisor_id, status)
      VALUES (${name}, ${email}, ${password_hash}, ${role}, ${department}, ${phone}, ${supervisor_id}, ${status})
      RETURNING id, name, email, role, status
    `;

    // For non-students, return a token immediately. For students, they must wait for approval.
    if (status === 'pending') {
      return res.status(201).json({ 
        success: true,
        message: 'Registration successful. Please wait for admin approval before logging in.',
        data: { user }
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ 
      success: true, 
      message: 'Registration successful',
      data: { token, user } 
    });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error during registration' 
    });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await sql`SELECT * FROM users WHERE email = ${email} AND is_active = TRUE`;
    if (!user) return res.status(401).json({ 
      success: false, 
      message: 'Invalid email or password' 
    });

    // Check student approval status
    if (user.role === 'student' && user.status !== 'approved') {
      const msg = user.status === 'pending' 
        ? 'Your account is pending approval by the administrator.' 
        : 'Your account registration was rejected.';
      return res.status(403).json({ 
        success: false, 
        message: msg 
      });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return res.status(401).json({ 
      success: false, 
      message: 'Invalid email or password' 
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    delete user.password_hash;

    res.json({ 
      success: true, 
      message: 'Login successful',
      data: { token, user } 
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error during login' 
    });
  }
});

app.get('/api/auth/me', requireRole(['student', 'supervisor', 'librarian', 'admin']), (req, res) => {
  res.json({ 
    success: true, 
    data: { user: req.user } 
  });
});

app.get('/api/auth/supervisors', async (req, res) => {
  try {
    const supervisors = await sql`SELECT id, name, department FROM users WHERE role = 'supervisor' AND is_active = TRUE`;
    res.json({ 
      success: true, 
      data: { supervisors } 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// --- DOCUMENT ROUTES ---

// POST /api/documents (Student Only)
app.post('/api/documents', requireRole(['student']), upload.single('file'), async (req, res) => {
  const { title, description } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ 
    success: false, 
    message: 'No file uploaded' 
  });

  try {
    const timestamp = Date.now();
    const fileKey = `documents/${req.user.id}/${timestamp}_${file.originalname}`;
    
    // Debug logging for storage integration
    console.log('Attempting upload to B2:', fileKey);
    
    await uploadFile(fileKey, file.buffer, file.mimetype);

    await sql`
      INSERT INTO documents (student_id, supervisor_id, title, description, file_key, file_name, file_size, status)
      VALUES (${req.user.id}, ${req.user.supervisor_id}, ${title}, ${description}, ${fileKey}, ${file.originalname}, ${file.size}, 'uploaded')
    `;

    res.status(201).json({ 
      success: true, 
      message: 'Document uploaded successfully' 
    });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ 
      success: false, 
      message: `Failed to upload document: ${err.message}` 
    });
  }
});

app.get('/api/documents/my', requireRole(['student']), async (req, res) => {
  try {
    const documents = await sql`SELECT * FROM documents WHERE student_id = ${req.user.id} ORDER BY submitted_at DESC`;
    res.json({ 
      success: true, 
      data: { documents } 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// GET /api/documents/assigned (Supervisor Only)
app.get('/api/documents/assigned', requireRole(['supervisor']), async (req, res) => {
  try {
    const documents = await sql`
      SELECT d.*, u.name as student_name, u.reg_number, u.department 
      FROM documents d 
      JOIN users u ON d.student_id = u.id 
      WHERE d.supervisor_id = ${req.user.id} AND d.status = 'uploaded' 
      ORDER BY d.submitted_at ASC
    `;
    res.json({ 
      success: true, 
      data: { documents } 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// POST /api/documents/:id/approve (Supervisor Only)
app.post('/api/documents/:id/approve', requireRole(['supervisor']), async (req, res) => {
  try {
    await sql`
      UPDATE documents 
      SET status = 'approved', approved_at = CURRENT_TIMESTAMP 
      WHERE id = ${req.params.id} AND supervisor_id = ${req.user.id} AND status = 'uploaded'
    `;
    res.json({ 
      success: true, 
      message: 'Document approved and sent to librarian' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// POST /api/documents/:id/reject (Supervisor Only)
app.post('/api/documents/:id/reject', requireRole(['supervisor']), async (req, res) => {
  const { reason } = req.body;
  try {
    await sql`
      UPDATE documents 
      SET status = 'rejected', reject_reason = ${reason} 
      WHERE id = ${req.params.id} AND supervisor_id = ${req.user.id} AND status = 'uploaded'
    `;
    res.json({ 
      success: true, 
      message: 'Document rejected' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// GET /api/documents/approved (Librarian Only)
app.get('/api/documents/approved', requireRole(['librarian']), async (req, res) => {
  try {
    const documents = await sql`
      SELECT d.*, u.name as student_name, u.reg_number, u.department 
      FROM documents d 
      JOIN users u ON d.student_id = u.id 
      WHERE d.status IN ('approved', 'checking', 'completed') 
      ORDER BY d.approved_at ASC
    `;
    res.json({ 
      success: true, 
      data: { documents } 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// --- REPORT ROUTES ---

// POST /api/documents/:id/reports (Librarian Only)
app.post('/api/documents/:id/reports', requireRole(['librarian']), upload.fields([
  { name: 'doc_report', maxCount: 1 },
  { name: 'ai_report', maxCount: 1 }
]), async (req, res) => {
  const { similarity_score, ai_percentage, notes } = req.body;
  const docFile = req.files['doc_report']?.[0];
  const aiFile = req.files['ai_report']?.[0];

  if (!docFile || !aiFile) return res.status(400).json({ 
    success: false, 
    message: 'Both plagiarism and AI reports are required' 
  });

  try {
    const timestamp = Date.now();
    const docKey = `reports/${req.params.id}/plagiarism_${timestamp}.pdf`;
    const aiKey = `reports/${req.params.id}/ai_${timestamp}.pdf`;
    
    await Promise.all([
      uploadFile(docKey, docFile.buffer, docFile.mimetype),
      uploadFile(aiKey, aiFile.buffer, aiFile.mimetype)
    ]);

    await sql`
      INSERT INTO reports (document_id, librarian_id, doc_report_key, ai_report_key, similarity_score, ai_percentage, notes)
      VALUES (${req.params.id}, ${req.user.id}, ${docKey}, ${aiKey}, ${similarity_score || 0}, ${ai_percentage || 0}, ${notes})
    `;

    await sql`UPDATE documents SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ${req.params.id}`;

    res.status(201).json({ 
      success: true, 
      message: 'Reports uploaded successfully' 
    });
  } catch (err) {
    console.error('Report Upload Error:', err);
    res.status(500).json({ 
      success: false, 
      message: `Failed to upload reports: ${err.message}` 
    });
  }
});

// GET /api/documents/:id/reports (Role Protected)
app.get('/api/documents/:id/reports', requireRole(['student', 'supervisor', 'librarian', 'admin']), async (req, res) => {
  try {
    const [reports] = await sql`SELECT * FROM reports WHERE document_id = ${req.params.id}`;
    if (!reports) return res.json({ 
      success: true, 
      data: { reports: null } 
    });

    // Generate signed URLs for both reports
    const [docUrl, aiUrl] = await Promise.all([
      getDownloadUrl(reports.doc_report_key),
      getDownloadUrl(reports.ai_report_key)
    ]);

    res.json({ 
      success: true, 
      data: {
        reports: {
          ...reports,
          doc_report_url: docUrl,
          ai_report_url: aiUrl
        }
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// GET /api/documents/:id/download (Signed URL)
app.get('/api/documents/:id/download', requireRole(['student', 'supervisor', 'librarian', 'admin']), async (req, res) => {
  try {
    const [doc] = await sql`SELECT file_key, student_id FROM documents WHERE id = ${req.params.id}`;
    if (!doc) return res.status(404).json({ 
      success: false, 
      message: 'Document not found' 
    });
    
    // Students can only download their own
    if (req.user.role === 'student' && doc.student_id !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden' 
      });
    }

    const url = await getDownloadUrl(doc.file_key);
    res.json({ 
      success: true, 
      data: { url } 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// --- ADMIN ROUTES ---

app.get('/api/admin/stats', requireRole(['admin']), async (req, res) => {
  try {
    const [stats] = await sql`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'student') as students,
        (SELECT COUNT(*) FROM users WHERE role = 'supervisor') as supervisors,
        (SELECT COUNT(*) FROM users WHERE role = 'librarian') as librarians,
        (SELECT COUNT(*) FROM documents) as total_documents,
        (SELECT COUNT(*) FROM documents WHERE status = 'completed') as completed_checks
    `;
    res.json({ 
      success: true, 
      data: stats 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// GET /api/admin/users
app.get('/api/admin/users', requireRole(['admin']), async (req, res) => {
  const { role, status, page = 1, limit = 100 } = req.query; // Increased limit for easier management
  const offset = (page - 1) * limit;
  try {
    // Pagination and filtering - Fixed role logic
    const users = await sql`
      SELECT id, name, email, role, department, phone, status, is_active 
      FROM users 
      WHERE (${role}::text IS NULL OR ${role} = 'all' OR role = ${role})
      AND (${status}::text IS NULL OR status = ${status})
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    res.json({ 
      success: true, 
      data: { users } 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// POST /api/admin/users/approve (Approve/Reject students)
app.post('/api/admin/users/:id/status', requireRole(['admin']), async (req, res) => {
  const { status } = req.body; // approved, rejected
  try {
    await sql`UPDATE users SET status = ${status} WHERE id = ${req.params.id} AND role = 'student'`;
    res.json({ 
      success: true, 
      message: `Student ${status}` 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// POST /api/admin/add-faculty
app.post('/api/admin/add-faculty', requireRole(['admin']), async (req, res) => {
  const { name, email, password, role, department, phone } = req.body;

  // 1. Validation
  const isLibrarian = role === 'librarian';
  if (!name || !email || !password || !role || (!isLibrarian && !department)) {
    return res.status(400).json({ 
      success: false, 
      message: isLibrarian ? 'Name, email, password, and role are required' : 'All fields except phone are required' 
    });
  }

  if (!['supervisor', 'librarian'].includes(role)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid role. Must be supervisor or librarian' 
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid email format' 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: 'Password must be at least 6 characters' 
    });
  }

  try {
    // 2. Check for duplicate email
    const [existing] = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing) {
      return res.status(409).json({ 
        success: false, 
        message: 'A user with this email already exists' 
      });
    }

    // 3. Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // 4. Save to DB
    await sql`
      INSERT INTO users (name, email, password_hash, role, department, phone, status)
      VALUES (${name}, ${email}, ${password_hash}, ${role}, ${isLibrarian ? null : department}, ${phone || null}, 'approved')
    `;

    res.status(201).json({ 
      success: true, 
      message: 'Faculty account created successfully' 
    });
  } catch (err) {
    console.error('Add Faculty Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create faculty account' 
    });
  }
});

app.get('/api/admin/files', requireRole(['admin']), async (req, res) => {
  try {
    const files = await sql`
      SELECT d.*, u.name as student_name 
      FROM documents d 
      JOIN users u ON d.student_id = u.id 
      ORDER BY d.submitted_at DESC
    `;
    res.json({ 
      success: true, 
      data: { files } 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

app.delete('/api/admin/files/:id', requireRole(['admin']), async (req, res) => {
  try {
    const [doc] = await sql`SELECT file_key FROM documents WHERE id = ${req.params.id}`;
    if (!doc) return res.status(404).json({ 
      success: false, 
      message: 'Document not found' 
    });

    await deleteFile(doc.file_key);
    const reports = await sql`SELECT doc_report_key, ai_report_key FROM reports WHERE document_id = ${req.params.id}`;
    for (const r of reports) {
      if (r.doc_report_key) await deleteFile(r.doc_report_key);
      if (r.ai_report_key) await deleteFile(r.ai_report_key);
    }

    await sql`DELETE FROM documents WHERE id = ${req.params.id}`;
    res.json({ 
      success: true, 
      message: 'Document and related reports deleted' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

app.post('/api/admin/seed', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [existing] = await sql`SELECT COUNT(*) FROM users WHERE role = 'admin'`;
    if (parseInt(existing.count) > 0) return res.status(403).json({ 
      success: false, 
      message: 'Setup already completed' 
    });

    const password_hash = await bcrypt.hash(password, 10);
    await sql`
      INSERT INTO users (name, email, password_hash, role, department, status)
      VALUES (${name}, ${email}, ${password_hash}, 'admin', 'Administration', 'approved')
    `;
    res.status(201).json({ 
      success: true, 
      message: 'Admin seeded successfully' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    data: { status: 'ok', time: new Date().toISOString() } 
  });
});

app.get('/', (req, res) => res.json({ message: 'CUI Vehari API v2 Running' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
