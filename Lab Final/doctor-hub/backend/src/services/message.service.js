const pool = require('../config/database');
const ApiError = require('../utils/ApiError');

const sendMessage = async (senderId, data) => {
  if (senderId === data.receiverId) throw ApiError.badRequest('Cannot message yourself');

  const [result] = await pool.execute(
    `INSERT INTO messages (sender_id, receiver_id, appointment_id, body) VALUES (?, ?, ?, ?)`,
    [senderId, data.receiverId, data.appointmentId || null, data.body]
  );

  await pool.execute(
    `INSERT INTO notifications (user_id, title, message, type) VALUES (?, 'New Message', ?, 'message')`,
    [data.receiverId, data.body.substring(0, 100)]
  );

  const [rows] = await pool.execute('SELECT * FROM messages WHERE id = ?', [result.insertId]);
  return rows[0];
};

const getConversation = async (userId, otherUserId) => {
  const [rows] = await pool.execute(
    `SELECT m.*, su.first_name as sender_first, su.last_name as sender_last
     FROM messages m
     JOIN users su ON su.id = m.sender_id
     WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
     ORDER BY m.created_at ASC`,
    [userId, otherUserId, otherUserId, userId]
  );

  await pool.execute(
    `UPDATE messages SET is_read = 1 WHERE receiver_id = ? AND sender_id = ?`,
    [userId, otherUserId]
  );

  return rows.map((m) => ({
    id: m.id,
    senderId: m.sender_id,
    receiverId: m.receiver_id,
    body: m.body,
    isRead: !!m.is_read,
    senderName: `${m.sender_first} ${m.sender_last}`,
    createdAt: m.created_at,
  }));
};

const listContacts = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT DISTINCT u.id, u.first_name, u.last_name, u.role, u.avatar_url,
            (SELECT body FROM messages WHERE (sender_id = u.id AND receiver_id = ?) OR (sender_id = ? AND receiver_id = u.id) ORDER BY created_at DESC LIMIT 1) as last_message
     FROM users u
     WHERE u.id IN (
       SELECT sender_id FROM messages WHERE receiver_id = ?
       UNION SELECT receiver_id FROM messages WHERE sender_id = ?
     )`,
    [userId, userId, userId, userId]
  );
  return rows;
};

module.exports = { sendMessage, getConversation, listContacts };
