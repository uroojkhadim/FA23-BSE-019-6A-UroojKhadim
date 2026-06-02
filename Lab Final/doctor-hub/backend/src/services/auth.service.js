const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/database');
const ApiError = require('../utils/ApiError');

const signToken = (userId, role) =>
  jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const formatUser = (row) => ({
  id: row.id,
  email: row.email,
  role: row.role,
  firstName: row.first_name,
  lastName: row.last_name,
  phone: row.phone,
  avatarUrl: row.avatar_url,
});

const register = async (data) => {
  const { email, password, firstName, lastName, phone, role, city, treatmentTypeId } = data;

  const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length) throw ApiError.badRequest('Email already registered');

  const passwordHash = await bcrypt.hash(password, 10);
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [userResult] = await conn.execute(
      `INSERT INTO users (email, password_hash, role, first_name, last_name, phone)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, passwordHash, role, firstName, lastName, phone || null]
    );
    const userId = userResult.insertId;

    if (role === 'patient') {
      await conn.execute(
        'INSERT INTO patients (user_id, city) VALUES (?, ?)',
        [userId, city || null]
      );
    } else if (role === 'doctor') {
      await conn.execute(
        `INSERT INTO doctors (user_id, treatment_type_id, city) VALUES (?, ?, ?)`,
        [userId, treatmentTypeId, city || null]
      );
    }

    await conn.commit();

    const token = signToken(userId, role);
    return {
      token,
      user: { id: userId, email, role, firstName, lastName, phone },
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

const login = async (email, password) => {
  const [rows] = await pool.execute(
    `SELECT * FROM users WHERE email = ? AND deleted_at IS NULL`,
    [email]
  );
  if (!rows.length) throw ApiError.unauthorized('Invalid credentials');

  const user = rows[0];
  if (!user.is_active) throw ApiError.unauthorized('Account is deactivated');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw ApiError.unauthorized('Invalid credentials');

  const token = signToken(user.id, user.role);
  return { token, user: formatUser(user) };
};

const forgotPassword = async (email) => {
  const [rows] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
  if (!rows.length) {
    return { message: 'If the email exists, a reset link has been sent' };
  }

  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const hours = parseInt(process.env.RESET_TOKEN_EXPIRY_HOURS || '1', 10);
  const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

  await pool.execute(
    'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
    [rows[0].id, tokenHash, expiresAt]
  );

  // In production: send email. For dev, return token in response when NODE_ENV=development
  const payload = { message: 'If the email exists, a reset link has been sent' };
  if (process.env.NODE_ENV === 'development') {
    payload.resetToken = token;
  }
  return payload;
};

const resetPassword = async (token, newPassword) => {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const [rows] = await pool.execute(
    `SELECT prt.*, u.id as user_id FROM password_reset_tokens prt
     JOIN users u ON prt.user_id = u.id
     WHERE prt.token_hash = ? AND prt.used = 0 AND prt.expires_at > NOW()`,
    [tokenHash]
  );

  if (!rows.length) throw ApiError.badRequest('Invalid or expired reset token');

  const passwordHash = await bcrypt.hash(newPassword, 10);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute('UPDATE users SET password_hash = ? WHERE id = ?', [
      passwordHash,
      rows[0].user_id,
    ]);
    await conn.execute('UPDATE password_reset_tokens SET used = 1 WHERE id = ?', [rows[0].id]);
    await conn.commit();
    return { message: 'Password reset successful' };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

const getProfile = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT u.*, p.id as patient_profile_id, p.city as patient_city,
            d.id as doctor_profile_id, d.consultation_fee, d.bio, d.rating
     FROM users u
     LEFT JOIN patients p ON p.user_id = u.id
     LEFT JOIN doctors d ON d.user_id = u.id AND d.deleted_at IS NULL
     WHERE u.id = ?`,
    [userId]
  );
  if (!rows.length) throw ApiError.notFound('User not found');
  const u = rows[0];
  return {
    ...formatUser(u),
    patientProfileId: u.patient_profile_id,
    patientCity: u.patient_city,
    doctorProfileId: u.doctor_profile_id,
    consultationFee: u.consultation_fee,
    bio: u.bio,
    rating: u.rating,
  };
};

module.exports = { register, login, forgotPassword, resetPassword, getProfile, signToken };
