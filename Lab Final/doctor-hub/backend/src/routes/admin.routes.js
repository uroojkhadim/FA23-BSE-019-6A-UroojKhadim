const express = require('express');
const adminController = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/analytics', authorize('admin', 'super_admin'), adminController.analytics);
router.get('/users', authorize('admin', 'super_admin'), adminController.listUsers);
router.patch('/users/:id/active', authorize('admin', 'super_admin'), adminController.toggleActive);
router.get('/activity', authorize('admin', 'super_admin'), adminController.activity);
router.get('/settings', authorize('super_admin'), adminController.getSettings);
router.put('/settings', authorize('super_admin'), adminController.updateSetting);
router.post('/staff', authorize('super_admin', 'admin'), adminController.createStaff);

module.exports = router;
