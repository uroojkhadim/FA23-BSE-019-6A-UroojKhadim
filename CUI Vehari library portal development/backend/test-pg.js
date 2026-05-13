const { Client } = require('pg');
require('dotenv').config();

async function test() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Testing connection with pg library...');
    await client.connect();
    console.log('Connection successful!');
    const res = await client.query('SELECT 1 as connected');
    console.log('Result:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Connection failed with pg:', err.message);
  }
}

test();
