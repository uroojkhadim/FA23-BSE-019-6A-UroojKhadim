const historyService = require('../services/history.service');
const asyncHandler = require('../utils/asyncHandler');

exports.create = asyncHandler(async (req, res) => {
  const record = await historyService.addMedicalRecord(req.user.id, req.body);
  res.status(201).json({ success: true, data: record });
});

exports.list = asyncHandler(async (req, res) => {
  const data = await historyService.listHistory(
    req.user.id,
    req.user.role,
    req.query.patientId
  );
  res.json({ success: true, data });
});

exports.delete = asyncHandler(async () => {
  historyService.deleteHistory();
});
