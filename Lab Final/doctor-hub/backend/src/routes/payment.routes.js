const express = require('express');
const paymentController = require('../controllers/payment.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { paymentUpload } = require('../middleware/upload');

const router = express.Router();

router.post(
  '/upload',
  authenticate,
  authorize('patient'),
  paymentUpload,
  paymentController.upload
);
router.put('/verify', authenticate, authorize('assistant'), paymentController.verify);
router.get('/pending', authenticate, authorize('assistant'), paymentController.listPending);

module.exports = router;
