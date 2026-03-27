import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/elite_cafe',
});

// Helper for SQL Queries
export const query = (text, params) => pool.query(text, params);

// Legacy LowDB Support (to be phased out during migration)
import { JSONFilePreset } from 'lowdb/node';
const defaultData = { users: [], menu: [], orders: [] };
const db = await JSONFilePreset('db.json', defaultData);

export default db; 
