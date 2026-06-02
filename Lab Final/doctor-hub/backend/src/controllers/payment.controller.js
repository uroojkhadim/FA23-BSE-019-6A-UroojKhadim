const paymentService = require('../services/payment.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.upload = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('Screenshot file required');
  const appointmentId = req.body.appointmentId;
  if (!appointmentId) throw ApiError.badRequest('appointmentId required');

  const result = await paymentService.uploadPayment(
    req.user.id,
    appointmentId,
    req.file,
    req.body.transactionRef
  );
  res.json({ success: true, data: result });
});

exports.verify = asyncHandler(async (req, res) => {
  const { paymentId, approved, rejectionReason } = req.body;
  const result = await paymentService.verifyPayment(
    req.user.id,
    paymentId,
    approved !== false,
    rejectionReason
  );
  res.json({ success: true, data: result });
});

exports.listPending = asyncHandler(async (req, res) => {
  const data = await paymentService.listPendingPayments();
  res.json({ success: true, data });
});
