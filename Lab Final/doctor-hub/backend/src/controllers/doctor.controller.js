const doctorService = require('../services/doctor.service');
const asyncHandler = require('../utils/asyncHandler');

exports.search = asyncHandler(async (req, res) => {
  const result = await doctorService.searchDoctors(req.query);
  res.json({ success: true, ...result });
});

exports.getById = asyncHandler(async (req, res) => {
  const doctor = await doctorService.getDoctorById(req.params.id);
  res.json({ success: true, data: doctor });
});

exports.update = asyncHandler(async (req, res) => {
  const doctor = await doctorService.updateDoctorProfile(req.user.id, req.body);
  res.json({ success: true, data: doctor });
});
