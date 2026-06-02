const express = require('express');
const pool = require('../config/database');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { authenticate, authorize } = require('../middleware/auth');
const { reportUpload } = require('../middleware/upload');

const router = express.Router();

router.use(authenticate);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    let sql = 'SELECT * FROM uploaded_reports';
    const params = [];
    if (req.user.role === 'patient') {
      sql += ' WHERE patient_id = (SELECT id FROM patients WHERE user_id = ?)';
      params.push(req.user.id);
    } else if (req.query.patientId) {
      sql += ' WHERE patient_id = ?';
      params.push(req.query.patientId);
    }
    sql += ' ORDER BY created_at DESC';
    const [rows] = await pool.execute(sql, params);
    res.json({ success: true, data: rows });
  })
);

router.post(
  '/upload',
  authorize('patient'),
  reportUpload,
  asyncHandler(async (req, res) => {
    if (!req.file) throw ApiError.badRequest('File required');
    const [patient] = await pool.execute('SELECT id FROM patients WHERE user_id = ?', [
      req.user.id,
    ]);
    const fileUrl = `/uploads/reports/${req.file.filename}`;
    const [result] = await pool.execute(
      `INSERT INTO uploaded_reports (patient_id, appointment_id, title, file_url, file_type, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        patient[0].id,
        req.body.appointmentId || null,
        req.body.title || req.file.originalname,
        fileUrl,
        req.file.mimetype,
        req.user.id,
      ]
    );
    res.status(201).json({ success: true, data: { id: result.insertId, fileUrl } });
  })
);

module.exports = router;
