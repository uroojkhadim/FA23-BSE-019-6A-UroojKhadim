const data = [];

function getAll() {
  return data;
}
function getById(id) {
  return data.find(u => u.id === id) || null;
}
function create({ name }) {
  const u = { id: Math.floor(Math.random() * 10000), name };
  data.push(u);
  return u;
}

module.exports = { getAll, getById, create };
