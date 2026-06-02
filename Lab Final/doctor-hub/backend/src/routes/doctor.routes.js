const express = require('express');
const doctorController = require('../controllers/doctor.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', doctorController.search);
router.get('/:id', doctorController.getById);
router.put('/:id', authenticate, authorize('doctor'), doctorController.update);

module.exports = router;
