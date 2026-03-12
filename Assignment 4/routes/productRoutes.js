// Import express to use the Router functionality
const express = require('express');
// Import the product controller functions for business logic
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// Initialize the express Router
const router = express.Router();

/**
 * Handle routes for the base URL /api/products
 */
router.route('/')
    // Map GET request to list all products
    .get(getProducts)
    // Map POST request to add a new product
    .post(createProduct);

/**
 * Handle routes for a specific product /api/products/:id
 */
router.route('/:id')
    // Map GET request to fetch product details
    .get(getProduct)
    // Map PUT request to update product information
    .put(updateProduct)
    // Map DELETE request to delete a product listing
    .delete(deleteProduct);

// Export the router to be used by the main application
module.exports = router;
