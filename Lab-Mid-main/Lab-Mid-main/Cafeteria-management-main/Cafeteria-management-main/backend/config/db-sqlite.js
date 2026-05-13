import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../database.sqlite');

let db = null;

export async function initDB() {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  console.log('Connected to SQLite database.');

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS menuitems (
      id TEXT PRIMARY KEY,
      _id TEXT,
      itemName TEXT,
      itemPrice REAL,
      itemImage TEXT,
      itemDescription TEXT,
      isAvailable INTEGER,
      category TEXT,
      dietaryRestrictions TEXT,
      stockQuantity INTEGER,
      createdDate TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      _id TEXT,
      orderNumber TEXT,
      userId TEXT,
      status TEXT,
      totalPrice REAL,
      orderTime TEXT,
      isPaid INTEGER,
      paymentMethod TEXT,
      notes TEXT,
      createdDate TEXT
    );

    CREATE TABLE IF NOT EXISTS orderitems (
      id TEXT PRIMARY KEY,
      _id TEXT,
      orderId TEXT,
      menuItemId TEXT,
      quantity INTEGER,
      unitPrice REAL,
      lineItemTotal REAL,
      createdDate TEXT
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      _id TEXT,
      transactionId TEXT,
      orderReference TEXT,
      paymentMethod TEXT,
      amountPaid REAL,
      paymentStatus TEXT,
      paymentDateTime TEXT,
      createdDate TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      _id TEXT,
      email TEXT UNIQUE,
      password TEXT,
      fullName TEXT,
      role TEXT,
      createdDate TEXT
    );

  `);

  return db;
}

export function getDB() {
  if (!db) throw new Error('Database not initialized');
  return db;
}
