const pool = require('../config/database');
const ApiError = require('../utils/ApiError');

const uploadPayment = async (userId, appointmentId, file, transactionRef) => {
  const [patient] = await pool.execute('SELECT id FROM patients WHERE user_id = ?', [userId]);
  if (!patient.length) throw ApiError.forbidden('Only patients can upload payments');

  const [appt] = await pool.execute(
    'SELECT * FROM appointments WHERE id = ? AND patient_id = ?',
    [appointmentId, patient[0].id]
  );
  if (!appt.length) throw ApiError.notFound('Appointment not found');
  if (!['pending', 'payment_uploaded'].includes(appt[0].status)) {
    throw ApiError.badRequest('Payment cannot be uploaded for this appointment status');
  }

  const screenshotUrl = `/uploads/payments/${file.filename}`;

  await pool.execute(
    `UPDATE payments SET screenshot_url = ?, transaction_ref = ?, status = 'pending', updated_at = NOW()
     WHERE appointment_id = ?`,
    [screenshotUrl, transactionRef || null, appointmentId]
  );

  if (appt[0].status === 'pending') {
    await pool.execute(
      `UPDATE appointments SET status = 'payment_uploaded' WHERE id = ?`,
      [appointmentId]
    );
  }

  return { message: 'Payment screenshot uploaded', screenshotUrl };
};

const verifyPayment = async (assistantUserId, paymentId, approved, rejectionReason) => {
  const [assistant] = await pool.execute('SELECT id FROM assistants WHERE user_id = ?', [
    assistantUserId,
  ]);
  if (!assistant.length) throw ApiError.forbidden('Assistant profile required');

  const [payment] = await pool.execute(
    `SELECT p.*, a.id as appointment_id, a.status as appointment_status
     FROM payments p JOIN appointments a ON a.id = p.appointment_id WHERE p.id = ?`,
    [paymentId]
  );
  if (!payment.length) throw ApiError.notFound('Payment not found');
  if (payment[0].appointment_status !== 'payment_uploaded') {
    throw ApiError.badRequest('Appointment must be in payment_uploaded status');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    if (approved) {
      await conn.execute(
        `UPDATE payments SET status = 'verified', verified_by = ?, verified_at = NOW() WHERE id = ?`,
        [assistant[0].id, paymentId]
      );
      await conn.execute(`UPDATE appointments SET status = 'verified' WHERE id = ?`, [
        payment[0].appointment_id,
      ]);
    } else {
      await conn.execute(
        `UPDATE payments SET status = 'rejected', verified_by = ?, verified_at = NOW(), rejection_reason = ? WHERE id = ?`,
        [assistant[0].id, rejectionReason || 'Payment rejected', paymentId]
      );
      await conn.execute(`UPDATE appointments SET status = 'pending' WHERE id = ?`, [
        payment[0].appointment_id,
      ]);
    }

    await conn.commit();
    return { message: approved ? 'Payment verified' : 'Payment rejected' };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

const listPendingPayments = async () => {
  const [rows] = await pool.execute(
    `SELECT pay.*, a.appointment_date, a.appointment_time, a.status as appointment_status,
            pu.first_name, pu.last_name, du.first_name as doctor_first, du.last_name as doctor_last
     FROM payments pay
     JOIN appointments a ON a.id = pay.appointment_id
     JOIN patients p ON p.id = a.patient_id
     JOIN users pu ON pu.id = p.user_id
     JOIN doctors d ON d.id = a.doctor_id
     JOIN users du ON du.id = d.user_id
     WHERE a.status = 'payment_uploaded' AND pay.status = 'pending'
     ORDER BY pay.created_at ASC`
  );
  return rows;
};

module.exports = { uploadPayment, verifyPayment, listPendingPayments };
