const pool = require('../config/database');
const ApiError = require('../utils/ApiError');

const getDoctorId = async (userId) => {
  const [rows] = await pool.execute(
    'SELECT id FROM doctors WHERE user_id = ? AND deleted_at IS NULL',
    [userId]
  );
  if (!rows.length) throw ApiError.notFound('Doctor profile not found');
  return rows[0].id;
};

const listClinics = async (doctorUserId) => {
  const doctorId = await getDoctorId(doctorUserId);
  const [clinics] = await pool.execute(
    `SELECT * FROM clinics WHERE doctor_id = ? AND deleted_at IS NULL ORDER BY name`,
    [doctorId]
  );
  for (const clinic of clinics) {
    const [schedules] = await pool.execute('SELECT * FROM schedules WHERE clinic_id = ?', [
      clinic.id,
    ]);
    clinic.schedules = schedules;
  }
  return clinics;
};

const createClinic = async (doctorUserId, data) => {
  const doctorId = await getDoctorId(doctorUserId);
  const [result] = await pool.execute(
    `INSERT INTO clinics (doctor_id, name, address, city, phone) VALUES (?, ?, ?, ?, ?)`,
    [doctorId, data.name, data.address, data.city, data.phone || null]
  );
  const [rows] = await pool.execute('SELECT * FROM clinics WHERE id = ?', [result.insertId]);
  return rows[0];
};

const addSchedule = async (doctorUserId, clinicId, data) => {
  const doctorId = await getDoctorId(doctorUserId);
  const [clinic] = await pool.execute('SELECT id FROM clinics WHERE id = ? AND doctor_id = ?', [
    clinicId,
    doctorId,
  ]);
  if (!clinic.length) throw ApiError.notFound('Clinic not found');

  const [result] = await pool.execute(
    `INSERT INTO schedules (clinic_id, day_of_week, start_time, end_time, slot_duration_minutes, max_patients)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      clinicId,
      data.dayOfWeek,
      data.startTime,
      data.endTime,
      data.slotDurationMinutes || 30,
      data.maxPatients || 10,
    ]
  );
  const [rows] = await pool.execute('SELECT * FROM schedules WHERE id = ?', [result.insertId]);
  return rows[0];
};

module.exports = { listClinics, createClinic, addSchedule };
