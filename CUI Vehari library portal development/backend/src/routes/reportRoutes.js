const express = require('express');
const { protect } = require('../middleware/auth');
const { getReportDownloadUrl } = require('../controllers/submissionController');

const router = express.Router();

router.get('/:id/download', protect, getReportDownloadUrl);

module.exports = router;
