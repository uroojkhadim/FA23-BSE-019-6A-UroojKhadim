// Import the Product model
const Product = require('../models/Product');

/**
 * @desc    Fetch all product listings from the database
 * @route   GET /api/products
 */
exports.getProducts = async (req, res, next) => {
    try {
        // Query the Product collection for all documents
        const products = await Product.find();
        // Return success with product list and total count
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (err) {
        // Return error details if query fails
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Fetch a specific product by its ID
 * @route   GET /api/products/:id
 */
exports.getProduct = async (req, res, next) => {
    try {
        // Find product by primary key from URL parameters
        const product = await Product.findById(req.params.id);
        // If product is missing, return 404 error
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        // Return the product data
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        // Handle invalid ID format errors
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Add a new product to the catalog
 * @route   POST /api/products
 */
exports.createProduct = async (req, res, next) => {
    try {
        // Save a new product document using data from the request body
        const product = await Product.create(req.body);
        // Return 201 Created with the new product object
        res.status(201).json({ success: true, data: product });
    } catch (err) {
        // Handle validation or persistence errors
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Modify existing product details
 * @route   PUT /api/products/:id
 */
exports.updateProduct = async (req, res, next) => {
    try {
        // Perform an atomic find and update operation
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Get the updated record back
            runValidators: true // Validate new values against schema
        });
        // Error handling if ID is not found
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        // Return the fresh data
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        // Return update error details
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Permanently remove a product from the database
 * @route   DELETE /api/products/:id
 */
exports.deleteProduct = async (req, res, next) => {
    try {
        // Find and delete based on URL ID
        const product = await Product.findByIdAndDelete(req.params.id);
        // Error handling if ID is not found
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        // Send success indicator with empty data
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        // Handle deletion errors
        res.status(400).json({ success: false, message: err.message });
    }
};
