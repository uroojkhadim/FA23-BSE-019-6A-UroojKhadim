// Import the Customer model
const Customer = require('../models/Customer');

/**
 * @desc    Get all customers from the database
 * @route   GET /api/customers
 */
exports.getCustomers = async (req, res, next) => {
    try {
        // Find all records in the Customer collection
        const customers = await Customer.find();
        // Send a success response with the list of customers and the count
        res.status(200).json({ success: true, count: customers.length, data: customers });
    } catch (err) {
        // Handle database or server errors and send a 400 response
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Get a single customer by their database ID
 * @route   GET /api/customers/:id
 */
exports.getCustomer = async (req, res, next) => {
    try {
        // Search for a specific customer using the ID from the URL parameters
        const customer = await Customer.findById(req.params.id);
        // If no customer is found, return a 404 error
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        // Send a success response with the customer data
        res.status(200).json({ success: true, data: customer });
    } catch (err) {
        // Handle errors like invalid ID format
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Add a new customer to the database
 * @route   POST /api/customers
 */
exports.createCustomer = async (req, res, next) => {
    try {
        // Create a new record using data from the request body
        const customer = await Customer.create(req.body);
        // Return a 201 Created status with the new customer object
        res.status(201).json({ success: true, data: customer });
    } catch (err) {
        // Handle validation errors or duplicate data
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Update an existing customer's details
 * @route   PUT /api/customers/:id
 */
exports.updateCustomer = async (req, res, next) => {
    try {
        // Find by ID and update with body data, returning the updated document
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the modified document rather than the original
            runValidators: true // Ensure the update follows schema rules
        });
        // If ID doesn't exist, return 404
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        // Send the updated customer data
        res.status(200).json({ success: true, data: customer });
    } catch (err) {
        // Handle errors during update
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Remove a customer from the database
 * @route   DELETE /api/customers/:id
 */
exports.deleteCustomer = async (req, res, next) => {
    try {
        // Locate and remove the document by its unique ID
        const customer = await Customer.findByIdAndDelete(req.params.id);
        // If ID doesn't exist, return 404
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        // Return success with an empty data object
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        // Handle errors during deletion
        res.status(400).json({ success: false, message: err.message });
    }
};
