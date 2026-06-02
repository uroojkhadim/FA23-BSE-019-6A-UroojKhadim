const express = require('express');
const appointmentController = require('../controllers/appointment.controller');
const validate = require('../middleware/validate');
const appointmentValidator = require('../validators/appointment.validator');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  authorize('patient'),
  validate(appointmentValidator.create),
  appointmentController.create
);
router.get('/', appointmentController.list);
router.get('/:id', appointmentController.getById);
router.put(
  '/:id/status',
  authorize('patient', 'doctor', 'assistant', 'admin', 'super_admin'),
  validate(appointmentValidator.updateStatus),
  appointmentController.updateStatus
);

module.exports = router;
