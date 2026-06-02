const pool = require('../config/database');
const ApiError = require('../utils/ApiError');
const { STATUS_TRANSITIONS } = require('../config/constants');

const getPatientId = async (userId) => {
  const [rows] = await pool.execute('SELECT id FROM patients WHERE user_id = ?', [userId]);
  if (!rows.length) throw ApiError.notFound('Patient profile not found');
  return rows[0].id;
};

const getDoctorId = async (userId) => {
  const [rows] = await pool.execute(
    'SELECT id FROM doctors WHERE user_id = ? AND deleted_at IS NULL',
    [userId]
  );
  if (!rows.length) throw ApiError.notFound('Doctor profile not found');
  return rows[0].id;
};

const createAppointment = async (userId, data) => {
  const patientId = await getPatientId(userId);
  const [doctor] = await pool.execute(
    'SELECT id, consultation_fee FROM doctors WHERE id = ? AND deleted_at IS NULL',
    [data.doctorId]
  );
  if (!doctor.length) throw ApiError.notFound('Doctor not found');

  const [result] = await pool.execute(
    `INSERT INTO appointments (patient_id, doctor_id, clinic_id, disease_id, appointment_date, appointment_time, reason, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [
      patientId,
      data.doctorId,
      data.clinicId || null,
      data.diseaseId || null,
      data.appointmentDate,
      data.appointmentTime,
      data.reason || null,
    ]
  );

  const appointmentId = result.insertId;
  await pool.execute(
    `INSERT INTO payments (appointment_id, amount, status) VALUES (?, ?, 'pending')`,
    [appointmentId, doctor[0].consultation_fee]
  );

  await pool.execute(
    `INSERT INTO notifications (user_id, title, message, type, link)
     SELECT user_id, 'New Appointment Request', ?, 'appointment', ?
     FROM doctors WHERE id = ?`,
    [
      `A patient booked an appointment for ${data.appointmentDate}`,
      `/doctor/appointments/${appointmentId}`,
      data.doctorId,
    ]
  );

  return getAppointmentById(appointmentId, userId, 'patient');
};

const validateStatusTransition = (current, next) => {
  const allowed = STATUS_TRANSITIONS[current] || [];
  if (!allowed.includes(next)) {
    throw ApiError.badRequest(`Cannot transition from ${current} to ${next}`);
  }
};

const updateStatus = async (appointmentId, status, user, extras = {}) => {
  const [rows] = await pool.execute('SELECT * FROM appointments WHERE id = ?', [appointmentId]);
  if (!rows.length) throw ApiError.notFound('Appointment not found');
  const appt = rows[0];

  validateStatusTransition(appt.status, status);

  if (user.role === 'patient' && !['payment_uploaded', 'cancelled'].includes(status)) {
    throw ApiError.forbidden('Patients can only upload payment or cancel');
  }
  if (user.role === 'assistant' && !['verified', 'cancelled'].includes(status)) {
    throw ApiError.forbidden('Assistants can verify payments');
  }
  if (user.role === 'doctor') {
    if (extras.doctorResponse) {
      await pool.execute('UPDATE appointments SET doctor_response = ? WHERE id = ?', [
        extras.doctorResponse,
        appointmentId,
      ]);
    }
    if (!['confirmed', 'completed', 'cancelled'].includes(status) && !extras.doctorResponse) {
      throw ApiError.forbidden('Invalid doctor action');
    }
  }

  const updates = ['status = ?'];
  const values = [status];
  if (extras.notes) {
    updates.push('notes = ?');
    values.push(extras.notes);
  }
  values.push(appointmentId);

  await pool.execute(`UPDATE appointments SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`, values);

  if (status === 'completed') {
    const [patient] = await pool.execute('SELECT user_id FROM patients WHERE id = ?', [appt.patient_id]);
    if (patient.length) {
      await pool.execute(
        `INSERT INTO notifications (user_id, title, message, type) VALUES (?, 'Consultation Completed', 'Your appointment has been marked completed.', 'appointment')`,
        [patient[0].user_id]
      );
    }
  }

  return getAppointmentById(appointmentId, user.id, user.role);
};

const getAppointmentById = async (id, userId, role) => {
  const [rows] = await pool.execute(
    `SELECT a.*, 
            pu.first_name as patient_first_name, pu.last_name as patient_last_name,
            du.first_name as doctor_first_name, du.last_name as doctor_last_name,
            c.name as clinic_name, dis.name as disease_name,
            pay.id as payment_id, pay.amount, pay.status as payment_status, pay.screenshot_url
     FROM appointments a
     JOIN patients p ON p.id = a.patient_id
     JOIN users pu ON pu.id = p.user_id
     JOIN doctors d ON d.id = a.doctor_id
     JOIN users du ON du.id = d.user_id
     LEFT JOIN clinics c ON c.id = a.clinic_id
     LEFT JOIN diseases dis ON dis.id = a.disease_id
     LEFT JOIN payments pay ON pay.appointment_id = a.id
     WHERE a.id = ?`,
    [id]
  );
  if (!rows.length) throw ApiError.notFound('Appointment not found');
  return mapAppointment(rows[0]);
};

const listAppointments = async (userId, role, filters = {}) => {
  let where = '1=1';
  const params = [];

  if (role === 'patient') {
    const patientId = await getPatientId(userId);
    where += ' AND a.patient_id = ?';
    params.push(patientId);
  } else if (role === 'doctor') {
    const doctorId = await getDoctorId(userId);
    where += ' AND a.doctor_id = ?';
    params.push(doctorId);
  }

  if (filters.status) {
    where += ' AND a.status = ?';
    params.push(filters.status);
  }

  const page = Math.max(1, parseInt(filters.page || '1', 10));
  const limit = Math.min(50, parseInt(filters.limit || '20', 10));
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT a.*, pu.first_name as patient_first_name, pu.last_name as patient_last_name,
            du.first_name as doctor_first_name, du.last_name as doctor_last_name,
            pay.status as payment_status, pay.screenshot_url
     FROM appointments a
     JOIN patients p ON p.id = a.patient_id
     JOIN users pu ON pu.id = p.user_id
     JOIN doctors d ON d.id = a.doctor_id
     JOIN users du ON du.id = d.user_id
     LEFT JOIN payments pay ON pay.appointment_id = a.id
     WHERE ${where}
     ORDER BY a.appointment_date DESC, a.appointment_time DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [count] = await pool.execute(
    `SELECT COUNT(*) as total FROM appointments a WHERE ${where}`,
    params
  );

  return {
    data: rows.map(mapAppointment),
    pagination: {
      page,
      limit,
      total: count[0].total,
      totalPages: Math.ceil(count[0].total / limit),
    },
  };
};

const mapAppointment = (row) => ({
  id: row.id,
  patientId: row.patient_id,
  doctorId: row.doctor_id,
  clinicId: row.clinic_id,
  diseaseId: row.disease_id,
  appointmentDate: row.appointment_date,
  appointmentTime: row.appointment_time,
  status: row.status,
  reason: row.reason,
  notes: row.notes,
  doctorResponse: row.doctor_response,
  patientName: `${row.patient_first_name} ${row.patient_last_name}`,
  doctorName: `${row.doctor_first_name} ${row.doctor_last_name}`,
  clinicName: row.clinic_name,
  diseaseName: row.disease_name,
  payment: row.payment_id
    ? {
        id: row.payment_id,
        amount: parseFloat(row.amount),
        status: row.payment_status,
        screenshotUrl: row.screenshot_url,
      }
    : null,
  createdAt: row.created_at,
});

module.exports = {
  createAppointment,
  updateStatus,
  getAppointmentById,
  listAppointments,
  getPatientId,
  getDoctorId,
};
