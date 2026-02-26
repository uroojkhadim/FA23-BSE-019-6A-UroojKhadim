const fs = require('fs');
const path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');
function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    const seed = {
      users: [],
      restaurants: [
        { id: 'r1', name: 'Spice Hub', cuisine: 'Indian' },
        { id: 'r2', name: 'Pasta Palace', cuisine: 'Italian' }
      ],
      menuItems: [
        { id: 'm1', restaurantId: 'r1', name: 'Chicken Biryani', price: 6.99 },
        { id: 'm2', restaurantId: 'r1', name: 'Paneer Tikka', price: 5.49 },
        { id: 'm3', restaurantId: 'r2', name: 'Spaghetti Carbonara', price: 7.99 },
        { id: 'm4', restaurantId: 'r2', name: 'Margherita Pizza', price: 8.49 }
      ],
      orders: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2));
  }
}
function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}
function writeDb(data) {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
module.exports = { readDb, writeDb };
