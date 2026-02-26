const { v4: uuidv4 } = require('uuid');
const { readDb, writeDb } = require('./db');
function create({ customerName, address, restaurantId, items }) {
  const db = readDb();
  const order = {
    id: uuidv4(),
    customerName,
    address,
    restaurantId,
    items,
    total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    status: 'placed',
    createdAt: new Date().toISOString()
  };
  db.orders.push(order);
  writeDb(db);
  return order;
}
function findById(id) {
  const db = readDb();
  return db.orders.find(o => o.id === id) || null;
}
module.exports = { create, findById };
