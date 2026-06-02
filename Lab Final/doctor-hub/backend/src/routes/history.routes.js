const express = require('express');
const historyController = require('../controllers/history.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', historyController.list);
router.post('/', authorize('doctor'), historyController.create);
router.delete('/:id', historyController.delete);

module.exports = router;
