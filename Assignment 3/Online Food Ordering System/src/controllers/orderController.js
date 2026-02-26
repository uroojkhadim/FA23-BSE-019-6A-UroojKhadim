const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
function create(req, res) {
  const { customerName, address, restaurantId } = req.body;
  const items = [];
  Object.keys(req.body).forEach(k => {
    if (k.startsWith('qty_')) {
      const id = k.slice(4);
      const qty = parseInt(req.body[k], 10);
      if (qty > 0) {
        const item = MenuItem.findByIds([id])[0];
        if (item) items.push({ id: item.id, name: item.name, price: item.price, quantity: qty });
      }
    }
  });
  if (!items.length) return res.status(400).send('Select at least one item');
  const order = Order.create({ customerName, address, restaurantId, items });
  res.render('order-success', { order });
}
function apiCreate(req, res) {
  const { customerName, address, restaurantId, items } = req.body;
  if (!items || !Array.isArray(items) || !items.length) return res.status(400).json({ error: 'invalid_items' });
  const enriched = items.map(i => {
    const found = MenuItem.findByIds([i.id])[0];
    if (!found) return null;
    return { id: found.id, name: found.name, price: found.price, quantity: i.quantity || 1 };
  }).filter(Boolean);
  if (!enriched.length) return res.status(400).json({ error: 'invalid_items' });
  const order = Order.create({ customerName, address, restaurantId, items: enriched });
  res.status(201).json(order);
}
function apiFind(req, res) {
  const order = Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'not_found' });
  res.json(order);
}
module.exports = { create, apiCreate, apiFind };
