const { readDb } = require('./db');
function all() {
  const db = readDb();
  return db.restaurants;
}
function findById(id) {
  const db = readDb();
  return db.restaurants.find(r => r.id === id) || null;
}
module.exports = { all, findById };
