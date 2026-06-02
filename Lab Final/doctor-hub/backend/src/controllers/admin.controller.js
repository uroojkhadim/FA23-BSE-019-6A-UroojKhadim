const adminService = require('../services/admin.service');
const asyncHandler = require('../utils/asyncHandler');

exports.analytics = asyncHandler(async (req, res) => {
  const data = await adminService.getAnalytics();
  res.json({ success: true, data });
});

exports.listUsers = asyncHandler(async (req, res) => {
  const result = await adminService.listUsers(
    req.query.role,
    parseInt(req.query.page || '1', 10),
    parseInt(req.query.limit || '20', 10)
  );
  res.json({ success: true, ...result });
});

exports.toggleActive = asyncHandler(async (req, res) => {
  const result = await adminService.toggleUserActive(req.params.id, req.body.isActive);
  res.json({ success: true, data: result });
});

exports.activity = asyncHandler(async (req, res) => {
  const data = await adminService.getActivityLogs();
  res.json({ success: true, data });
});

exports.getSettings = asyncHandler(async (req, res) => {
  const data = await adminService.getSystemSettings();
  res.json({ success: true, data });
});

exports.updateSetting = asyncHandler(async (req, res) => {
  const result = await adminService.updateSystemSetting(
    req.body.key,
    req.body.value,
    req.user.id
  );
  res.json({ success: true, data: result });
});

exports.createStaff = asyncHandler(async (req, res) => {
  const role = req.body.role || 'assistant';
  const result = await adminService.createStaffUser(req.body, role);
  res.status(201).json({ success: true, data: result });
});
