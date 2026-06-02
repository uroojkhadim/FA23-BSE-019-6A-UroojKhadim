const pool = require('../config/database');
const ApiError = require('../utils/ApiError');

const createPrescription = async (doctorUserId, data) => {
  const [doctor] = await pool.execute(
    'SELECT id FROM doctors WHERE user_id = ? AND deleted_at IS NULL',
    [doctorUserId]
  );
  if (!doctor.length) throw ApiError.forbidden('Only doctors can create prescriptions');

  const [appt] = await pool.execute(
    'SELECT * FROM appointments WHERE id = ? AND doctor_id = ?',
    [data.appointmentId, doctor[0].id]
  );
  if (!appt.length) throw ApiError.notFound('Appointment not found');
  if (!['confirmed', 'completed'].includes(appt[0].status)) {
    throw ApiError.badRequest('Appointment must be confirmed or completed');
  }

  const medicines =
    typeof data.medicines === 'string' ? data.medicines : JSON.stringify(data.medicines);

  const [result] = await pool.execute(
    `INSERT INTO prescriptions (appointment_id, doctor_id, patient_id, diagnosis, medicines, instructions, attachment_url)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.appointmentId,
      doctor[0].id,
      appt[0].patient_id,
      data.diagnosis,
      medicines,
      data.instructions || null,
      data.attachmentUrl || null,
    ]
  );

  await pool.execute(
    `INSERT INTO medical_history (patient_id, doctor_id, appointment_id, record_type, title, description)
     VALUES (?, ?, ?, 'consultation', ?, ?)`,
    [
      appt[0].patient_id,
      doctor[0].id,
      data.appointmentId,
      `Prescription: ${data.diagnosis}`,
      data.instructions || 'Prescription issued',
    ]
  );

  const [patient] = await pool.execute('SELECT user_id FROM patients WHERE id = ?', [
    appt[0].patient_id,
  ]);
  if (patient.length) {
    await pool.execute(
      `INSERT INTO notifications (user_id, title, message, type) VALUES (?, 'New Prescription', 'A new prescription has been added to your record.', 'prescription')`,
      [patient[0].user_id]
    );
  }

  return getPrescriptionById(result.insertId);
};

const getPrescriptionById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT pr.*, du.first_name as doctor_first, du.last_name as doctor_last
     FROM prescriptions pr
     JOIN doctors d ON d.id = pr.doctor_id
     JOIN users du ON du.id = d.user_id
     WHERE pr.id = ?`,
    [id]
  );
  if (!rows.length) throw ApiError.notFound('Prescription not found');
  const r = rows[0];
  return {
    id: r.id,
    appointmentId: r.appointment_id,
    diagnosis: r.diagnosis,
    medicines: typeof r.medicines === 'string' ? JSON.parse(r.medicines) : r.medicines,
    instructions: r.instructions,
    attachmentUrl: r.attachment_url,
    doctorName: `${r.doctor_first} ${r.doctor_last}`,
    createdAt: r.created_at,
  };
};

const listPrescriptions = async (userId, role) => {
  let sql = `SELECT pr.*, du.first_name as doctor_first, du.last_name as doctor_last
             FROM prescriptions pr
             JOIN doctors d ON d.id = pr.doctor_id
             JOIN users du ON du.id = d.user_id`;
  const params = [];

  if (role === 'patient') {
    sql += ' JOIN patients p ON p.id = pr.patient_id WHERE p.user_id = ?';
    params.push(userId);
  } else if (role === 'doctor') {
    sql += ' WHERE d.user_id = ?';
    params.push(userId);
  }

  sql += ' ORDER BY pr.created_at DESC';
  const [rows] = await pool.execute(sql, params);

  return rows.map((r) => ({
    id: r.id,
    appointmentId: r.appointment_id,
    diagnosis: r.diagnosis,
    medicines: typeof r.medicines === 'string' ? JSON.parse(r.medicines) : r.medicines,
    instructions: r.instructions,
    doctorName: `${r.doctor_first} ${r.doctor_last}`,
    createdAt: r.created_at,
  }));
};

// Explicitly block update/delete at service layer
const updatePrescription = () => {
  throw ApiError.forbidden('Prescriptions cannot be modified after creation');
};

const deletePrescription = () => {
  throw ApiError.forbidden('Prescriptions cannot be deleted');
};

module.exports = {
  createPrescription,
  getPrescriptionById,
  listPrescriptions,
  updatePrescription,
  deletePrescription,
};
