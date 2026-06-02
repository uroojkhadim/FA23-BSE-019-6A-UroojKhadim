module.exports = {
  ROLES: ['patient', 'doctor', 'assistant', 'admin', 'super_admin'],
  APPOINTMENT_STATUSES: [
    'pending',
    'payment_uploaded',
    'verified',
    'confirmed',
    'completed',
    'cancelled',
  ],
  STATUS_TRANSITIONS: {
    pending: ['payment_uploaded', 'cancelled'],
    payment_uploaded: ['verified', 'cancelled'],
    verified: ['confirmed', 'cancelled'],
    confirmed: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
  },
  PAYMENT_STATUSES: ['pending', 'verified', 'rejected'],
};
