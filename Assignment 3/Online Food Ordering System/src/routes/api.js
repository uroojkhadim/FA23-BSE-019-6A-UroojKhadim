const express = require('express');
const router = express.Router();
const restaurant = require('../controllers/restaurantController');
const order = require('../controllers/orderController');
router.get('/restaurants', restaurant.apiList);
router.get('/restaurants/:id', restaurant.apiShow);
router.post('/orders', order.apiCreate);
router.get('/orders/:id', order.apiFind);
module.exports = router;
