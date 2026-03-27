import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/elite_cafe',
});

const migrate = async () => {
  try {
    console.log('🚀 Initiating Strategic Database Migration...');
    
    // Read schema from root artifacts
    const schemaPath = 'C:/Users/Administrator/.gemini/antigravity/brain/f9ca8785-721c-4bc7-8295-10d13aa10566/schema.sql';
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await pool.query(schema);

    console.log('✅ Database Schema Authorized & Synchronized.');

    // Seed initial admin user if not exists
    const adminEmail = 'admin@elite.com';
    const checkAdmin = await pool.query('SELECT * FROM users WHERE email = $1', [adminEmail]);
    
    if (checkAdmin.rowCount === 0) {
      await pool.query(
        "INSERT INTO users (name, email, password, role, wallet_balance) VALUES ($1, $2, $3, $4, $5)",
        ['Elite Admin', adminEmail, 'admin123', 'admin', 10000]
      );
      console.log('👤 Default Executive User Created: admin@elite.com / admin123');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Migration Critical Failure:', err);
    process.exit(1);
  }
};

migrate();
