const appointmentService = require('../services/appointment.service');
const asyncHandler = require('../utils/asyncHandler');

exports.create = asyncHandler(async (req, res) => {
  const appt = await appointmentService.createAppointment(req.user.id, req.body);
  res.status(201).json({ success: true, data: appt });
});

exports.list = asyncHandler(async (req, res) => {
  const result = await appointmentService.listAppointments(req.user.id, req.user.role, req.query);
  res.json({ success: true, ...result });
});

exports.getById = asyncHandler(async (req, res) => {
  const appt = await appointmentService.getAppointmentById(
    req.params.id,
    req.user.id,
    req.user.role
  );
  res.json({ success: true, data: appt });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const appt = await appointmentService.updateStatus(
    req.params.id,
    req.body.status,
    req.user,
    req.body
  );
  res.json({ success: true, data: appt });
});
