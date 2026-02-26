const { readDb, writeDb } = require('./db');
function create({ name }) {
  const db = readDb();
  const id = `u${db.users.length + 1}`;
  const user = { id, name };
  db.users.push(user);
  writeDb(db);
  return user;
}
module.exports = { create };
