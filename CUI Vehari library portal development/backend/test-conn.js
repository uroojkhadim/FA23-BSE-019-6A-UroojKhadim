const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function test() {
  try {
    const url = process.env.DATABASE_URL;
    const password = url.split(':')[2].split('@')[0];
    console.log('Password length:', password.length);
    console.log('First 2 chars:', password.substring(0, 2));
    console.log('Last 2 chars:', password.substring(password.length - 2));
    
    const sql = neon(url);
    const result = await sql`SELECT 1 as connected`;
    console.log('Connection successful:', result);
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

test();
