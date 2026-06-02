const pool = require('../config/database');
const ApiError = require('../utils/ApiError');

const getAnalytics = async () => {
  const [[users]] = await pool.execute(
    `SELECT 
      SUM(role='patient') as patients,
      SUM(role='doctor') as doctors,
      SUM(role='assistant') as assistants,
      SUM(role='admin') as admins
     FROM users WHERE deleted_at IS NULL`
  );
  const [[appts]] = await pool.execute(
    `SELECT 
      COUNT(*) as total,
      SUM(status='pending') as pending,
      SUM(status='payment_uploaded') as payment_uploaded,
      SUM(status='verified') as verified,
      SUM(status='confirmed') as confirmed,
      SUM(status='completed') as completed,
      SUM(status='cancelled') as cancelled
     FROM appointments`
  );
  const [[revenue]] = await pool.execute(
    `SELECT COALESCE(SUM(amount),0) as total FROM payments WHERE status='verified'`
  );

  const [monthly] = await pool.execute(
    `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count
     FROM appointments WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
     GROUP BY month ORDER BY month`
  );

  return { users, appointments: appts, revenue: revenue.total, monthlyAppointments: monthly };
};

const listUsers = async (role, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  let where = 'deleted_at IS NULL';
  const params = [];
  if (role) {
    where += ' AND role = ?';
    params.push(role);
  }
  const [rows] = await pool.query(
    `SELECT id, email, role, first_name, last_name, phone, is_active, created_at
     FROM users WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  const [count] = await pool.execute(`SELECT COUNT(*) as total FROM users WHERE ${where}`, params);
  return { data: rows, pagination: { page, limit, total: count[0].total } };
};

const toggleUserActive = async (userId, isActive) => {
  await pool.execute('UPDATE users SET is_active = ? WHERE id = ?', [isActive ? 1 : 0, userId]);
  return { message: 'User status updated' };
};

const logActivity = async (userId, action, entityType, entityId, details, ip) => {
  await pool.execute(
    `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, action, entityType, entityId, JSON.stringify(details || {}), ip]
  );
};

const getActivityLogs = async (limit = 50) => {
  const [rows] = await pool.execute(
    `SELECT al.*, u.email, u.first_name, u.last_name
     FROM activity_logs al LEFT JOIN users u ON u.id = al.user_id
     ORDER BY al.created_at DESC LIMIT ?`,
    [limit]
  );
  return rows;
};

const getSystemSettings = async () => {
  const [rows] = await pool.execute('SELECT * FROM system_settings');
  return rows.reduce((acc, r) => ({ ...acc, [r.setting_key]: r.setting_value }), {});
};

const updateSystemSetting = async (key, value, userId) => {
  await pool.execute(
    `INSERT INTO system_settings (setting_key, setting_value, updated_by) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_by = VALUES(updated_by)`,
    [key, value, userId]
  );
  return { message: 'Setting updated' };
};

const createStaffUser = async (data, role) => {
  const bcrypt = require('bcrypt');
  const allowed = ['assistant', 'admin'];
  if (!allowed.includes(role)) throw ApiError.badRequest('Invalid staff role');

  const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [data.email]);
  if (existing.length) throw ApiError.badRequest('Email exists');

  const hash = await bcrypt.hash(data.password, 10);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [r] = await conn.execute(
      `INSERT INTO users (email, password_hash, role, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)`,
      [data.email, hash, role, data.firstName, data.lastName, data.phone || null]
    );
    const table = role === 'assistant' ? 'assistants' : 'admins';
    await conn.execute(`INSERT INTO ${table} (user_id, department) VALUES (?, ?)`, [
      r.insertId,
      data.department || null,
    ]);
    await conn.commit();
    return { id: r.insertId, message: `${role} created` };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
};

module.exports = {
  getAnalytics,
  listUsers,
  toggleUserActive,
  logActivity,
  getActivityLogs,
  getSystemSettings,
  updateSystemSetting,
  createStaffUser,
};
