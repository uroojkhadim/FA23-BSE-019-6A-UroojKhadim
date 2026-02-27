const data = [
  { id: 1, name: 'Laptop', price: 1200 },
  { id: 2, name: 'Headphones', price: 150 },
  { id: 3, name: 'Keyboard', price: 80 },
];
let nextId = 4;

function getAll() {
  return data;
}
function getById(id) {
  return data.find(p => p.id === id) || null;
}
function create({ name, price }) {
  const p = { id: nextId++, name, price };
  data.push(p);
  return p;
}
function update(id, { name, price }) {
  const idx = data.findIndex(p => p.id === id);
  if (idx === -1) return null;
  if (name !== undefined) data[idx].name = name;
  if (price !== undefined) data[idx].price = price;
  return data[idx];
}
function remove(id) {
  const idx = data.findIndex(p => p.id === id);
  if (idx === -1) return null;
  return data.splice(idx, 1)[0];
}

module.exports = { getAll, getById, create, update, remove };
