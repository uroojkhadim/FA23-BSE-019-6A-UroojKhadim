const Joi = require('joi');

const register = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/[A-Z]/).pattern(/[0-9]/).required()
    .messages({ 'string.pattern.base': 'Password must contain uppercase and number' }),
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().max(20).optional(),
  role: Joi.string().valid('patient', 'doctor').default('patient'),
  city: Joi.string().max(100).when('role', { is: 'patient', then: Joi.optional() }),
  treatmentTypeId: Joi.number().integer().when('role', { is: 'doctor', then: Joi.required() }),
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const forgotPassword = Joi.object({
  email: Joi.string().email().required(),
});

const resetPassword = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).pattern(/[A-Z]/).pattern(/[0-9]/).required(),
});

module.exports = { register, login, forgotPassword, resetPassword };
