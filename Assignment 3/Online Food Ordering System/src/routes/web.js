const express = require('express');
const router = express.Router();
const restaurant = require('../controllers/restaurantController');
const order = require('../controllers/orderController');
router.get('/', restaurant.list);
router.get('/restaurants/:id', restaurant.show);
router.post('/orders', order.create);
module.exports = router;
