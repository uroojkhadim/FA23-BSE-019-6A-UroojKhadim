const prescriptionService = require('../services/prescription.service');
const asyncHandler = require('../utils/asyncHandler');

exports.create = asyncHandler(async (req, res) => {
  const rx = await prescriptionService.createPrescription(req.user.id, req.body);
  res.status(201).json({ success: true, data: rx });
});

exports.list = asyncHandler(async (req, res) => {
  const data = await prescriptionService.listPrescriptions(req.user.id, req.user.role);
  res.json({ success: true, data });
});

exports.update = asyncHandler(async () => {
  prescriptionService.updatePrescription();
});

exports.delete = asyncHandler(async () => {
  prescriptionService.deletePrescription();
});
