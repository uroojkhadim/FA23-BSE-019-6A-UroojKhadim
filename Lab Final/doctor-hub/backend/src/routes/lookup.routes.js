const express = require('express');
const doctorService = require('../services/doctor.service');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const data = await doctorService.getLookupData();
    res.json({ success: true, data });
  })
);

module.exports = router;
