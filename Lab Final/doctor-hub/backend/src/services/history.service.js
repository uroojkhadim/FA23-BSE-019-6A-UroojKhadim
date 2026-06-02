const pool = require('../config/database');
const ApiError = require('../utils/ApiError');

const addMedicalRecord = async (doctorUserId, data) => {
  const [doctor] = await pool.execute('SELECT id FROM doctors WHERE user_id = ?', [doctorUserId]);
  if (!doctor.length) throw ApiError.forbidden('Only doctors can add medical records');

  const [result] = await pool.execute(
    `INSERT INTO medical_history (patient_id, doctor_id, appointment_id, record_type, title, description, vitals)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.patientId,
      doctor[0].id,
      data.appointmentId || null,
      data.recordType || 'consultation',
      data.title,
      data.description,
      data.vitals ? JSON.stringify(data.vitals) : null,
    ]
  );

  const [rows] = await pool.execute('SELECT * FROM medical_history WHERE id = ?', [result.insertId]);
  return mapRecord(rows[0]);
};

const listHistory = async (userId, role, patientIdFilter) => {
  let sql = `SELECT mh.*, du.first_name as doctor_first, du.last_name as doctor_last
             FROM medical_history mh
             JOIN doctors d ON d.id = mh.doctor_id
             JOIN users du ON du.id = d.user_id`;
  const params = [];

  if (role === 'patient') {
    sql += ' JOIN patients p ON p.id = mh.patient_id WHERE p.user_id = ?';
    params.push(userId);
  } else if (role === 'doctor') {
    sql += ' WHERE mh.doctor_id = (SELECT id FROM doctors WHERE user_id = ?)';
    params.push(userId);
    if (patientIdFilter) {
      sql += ' AND mh.patient_id = ?';
      params.push(patientIdFilter);
    }
  } else if (['admin', 'super_admin', 'assistant'].includes(role)) {
    if (patientIdFilter) {
      sql += ' WHERE mh.patient_id = ?';
      params.push(patientIdFilter);
    }
  }

  sql += ' ORDER BY mh.created_at DESC';
  const [rows] = await pool.execute(sql, params);
  return rows.map(mapRecord);
};

const mapRecord = (r) => ({
  id: r.id,
  patientId: r.patient_id,
  doctorId: r.doctor_id,
  appointmentId: r.appointment_id,
  recordType: r.record_type,
  title: r.title,
  description: r.description,
  vitals: r.vitals ? (typeof r.vitals === 'string' ? JSON.parse(r.vitals) : r.vitals) : null,
  doctorName: r.doctor_first ? `${r.doctor_first} ${r.doctor_last}` : undefined,
  createdAt: r.created_at,
});

const deleteHistory = () => {
  throw ApiError.forbidden('Medical history records cannot be deleted');
};

module.exports = { addMedicalRecord, listHistory, deleteHistory };
