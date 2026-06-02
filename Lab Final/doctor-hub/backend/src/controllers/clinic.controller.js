const clinicService = require('../services/clinic.service');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  const data = await clinicService.listClinics(req.user.id);
  res.json({ success: true, data });
});

exports.create = asyncHandler(async (req, res) => {
  const clinic = await clinicService.createClinic(req.user.id, req.body);
  res.status(201).json({ success: true, data: clinic });
});

exports.addSchedule = asyncHandler(async (req, res) => {
  const schedule = await clinicService.addSchedule(req.user.id, req.params.clinicId, req.body);
  res.status(201).json({ success: true, data: schedule });
});
