/**
 * Run after seed.sql to set demo passwords to Password@123
 * Usage: node src/scripts/seed-passwords.js
 */
const bcrypt = require('bcrypt');
const pool = require('../config/database');

const DEMO_PASSWORD = 'Password@123';

async function run() {
  const hash = await bcrypt.hash(DEMO_PASSWORD, 10);
  await pool.execute('UPDATE users SET password_hash = ?', [hash]);
  console.log('All user passwords set to:', DEMO_PASSWORD);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
