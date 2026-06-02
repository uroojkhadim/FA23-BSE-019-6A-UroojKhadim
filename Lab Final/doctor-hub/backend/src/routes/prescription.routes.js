const express = require('express');
const prescriptionController = require('../controllers/prescription.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', prescriptionController.list);
router.post('/', authorize('doctor'), prescriptionController.create);
router.put('/:id', authorize('doctor'), prescriptionController.update);
router.delete('/:id', prescriptionController.delete);

module.exports = router;
