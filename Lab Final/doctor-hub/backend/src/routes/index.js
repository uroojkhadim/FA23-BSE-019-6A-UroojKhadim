const express = require('express');
const authRoutes = require('./auth.routes');
const doctorRoutes = require('./doctor.routes');
const appointmentRoutes = require('./appointment.routes');
const paymentRoutes = require('./payment.routes');
const prescriptionRoutes = require('./prescription.routes');
const historyRoutes = require('./history.routes');
const messageRoutes = require('./message.routes');
const clinicRoutes = require('./clinic.routes');
const adminRoutes = require('./admin.routes');
const reportRoutes = require('./report.routes');
const lookupRoutes = require('./lookup.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/payments', paymentRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/history', historyRoutes);
router.use('/messages', messageRoutes);
router.use('/clinics', clinicRoutes);
router.use('/admin', adminRoutes);
router.use('/reports', reportRoutes);
router.use('/lookup', lookupRoutes);

router.get('/health', (_req, res) => res.json({ success: true, message: 'Doctor Hub API is running' }));

module.exports = router;
