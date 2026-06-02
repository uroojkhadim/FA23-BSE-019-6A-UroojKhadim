const express = require('express');
const clinicController = require('../controllers/clinic.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, authorize('doctor'));

router.get('/', clinicController.list);
router.post('/', clinicController.create);
router.post('/:clinicId/schedules', clinicController.addSchedule);

module.exports = router;
