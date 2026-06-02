const Joi = require('joi');

const create = Joi.object({
  doctorId: Joi.number().integer().required(),
  clinicId: Joi.number().integer().optional(),
  diseaseId: Joi.number().integer().optional(),
  appointmentDate: Joi.date().iso().required(),
  appointmentTime: Joi.string().pattern(/^\d{2}:\d{2}(:\d{2})?$/).required(),
  reason: Joi.string().max(1000).optional(),
});

const updateStatus = Joi.object({
  status: Joi.string()
    .valid('pending', 'payment_uploaded', 'verified', 'confirmed', 'completed', 'cancelled')
    .required(),
  notes: Joi.string().max(1000).optional(),
  doctorResponse: Joi.string().valid('pending', 'accepted', 'rejected').optional(),
});

module.exports = { create, updateStatus };
