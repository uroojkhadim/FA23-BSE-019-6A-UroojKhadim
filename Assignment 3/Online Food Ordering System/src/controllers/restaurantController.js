const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
function list(req, res) {
  const restaurants = Restaurant.all();
  res.render('index', { restaurants });
}
function show(req, res) {
  const restaurant = Restaurant.findById(req.params.id);
  if (!restaurant) return res.status(404).send('Not found');
  const items = MenuItem.findByRestaurant(restaurant.id);
  res.render('restaurant', { restaurant, items });
}
function apiList(req, res) {
  res.json(Restaurant.all());
}
function apiShow(req, res) {
  const r = Restaurant.findById(req.params.id);
  if (!r) return res.status(404).json({ error: 'not_found' });
  const items = MenuItem.findByRestaurant(r.id);
  res.json({ restaurant: r, items });
}
module.exports = { list, show, apiList, apiShow };
