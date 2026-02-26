const { readDb } = require('./db');
function findByRestaurant(restaurantId) {
  const db = readDb();
  return db.menuItems.filter(m => m.restaurantId === restaurantId);
}
function findByIds(ids) {
  const db = readDb();
  return db.menuItems.filter(m => ids.includes(m.id));
}
module.exports = { findByRestaurant, findByIds };
