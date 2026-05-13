const express = require('express');
const { getUsers, addUser, deactivateUser, getStats, seedAdmin, updateUserStatus } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/seed', seedAdmin);

router.use(protect);
router.use(authorize('admin', 'subadmin'));

router.get('/users', getUsers);
router.post('/users', addUser);
router.post('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deactivateUser);
router.delete('/files/:id', require('../controllers/adminController').deleteFile);
router.get('/stats', getStats);

module.exports = router;
