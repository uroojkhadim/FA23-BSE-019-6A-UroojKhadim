// Import express to use the Router functionality
const express = require('express');
// Import the customer controller functions for logic handling
const {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer
} = require('../controllers/customerController');

// Initialize the express Router
const router = express.Router();

/**
 * Handle routes for the base URL /api/customers
 */
router.route('/')
    // Map GET request to the getCustomers function
    .get(getCustomers)
    // Map POST request to the createCustomer function
    .post(createCustomer);

/**
 * Handle routes that require a specific ID /api/customers/:id
 */
router.route('/:id')
    // Map GET request to get a single customer
    .get(getCustomer)
    // Map PUT request to update customer details
    .put(updateCustomer)
    // Map DELETE request to remove a customer
    .delete(deleteCustomer);

// Export the router to be mounted in server.js
module.exports = router;
