// Import express to access routing features
const express = require('express');
// Import the order controller methods
const {
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder
} = require('../controllers/orderController');

// Initialize the express Router
const router = express.Router();

/**
 * Handle routes for the base URL /api/orders
 */
router.route('/')
    // Map GET to retrieve all orders
    .get(getOrders)
    // Map POST to submit a new order
    .post(createOrder);

/**
 * Handle routes for individual orders /api/orders/:id
 */
router.route('/:id')
    // Map GET to view specific order details
    .get(getOrder)
    // Map PUT to update order status or details
    .put(updateOrder)
    // Map DELETE to remove an order record
    .delete(deleteOrder);

// Export the router for use in server.js
module.exports = router;
