// Import necessary models for database operations
const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * @desc    Retrieve all customer orders with related details
 * @route   GET /api/orders
 */
exports.getOrders = async (req, res, next) => {
    try {
        // Find all orders and populate customer and product details from their respective collections
        const orders = await Order.find().populate('customer').populate('product');
        // Return response with orders list
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        // Catch any errors during retrieval
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Get a specific order's information
 * @route   GET /api/orders/:id
 */
exports.getOrder = async (req, res, next) => {
    try {
        // Search for an order by its ID and include linked customer and product data
        const order = await Order.findById(req.params.id).populate('customer').populate('product');
        // If order missing, stop and return 404
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        // Deliver the order info
        res.status(200).json({ success: true, data: order });
    } catch (err) {
        // Handle ID errors
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Process and create a new order with stock validation
 * @route   POST /api/orders
 */
exports.createOrder = async (req, res, next) => {
    try {
        // Extract necessary data from the request body
        const { customer, product, quantity } = req.body;

        // Retrieve the product record to verify existence and check stock
        const productDoc = await Product.findById(product);
        if (!productDoc) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Check if enough stock is available for the requested quantity
        if (productDoc.stock < quantity) {
            return res.status(400).json({ success: false, message: 'Insufficient stock' });
        }

        // Calculate the total cost by multiplying quantity by current product price
        const totalPrice = productDoc.price * quantity;

        // Save the new order record to the Order collection
        const order = await Order.create({
            customer,
            product,
            quantity,
            totalPrice
        });

        // Decrement the physical stock count for the ordered product
        productDoc.stock -= quantity;
        // Persist the stock change back to the database
        await productDoc.save();

        // Respond with the completed order details
        res.status(201).json({ success: true, data: order });
    } catch (err) {
        // Catch logic or database errors
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Update order properties (e.g., status)
 * @route   PUT /api/orders/:id
 */
exports.updateOrder = async (req, res, next) => {
    try {
        // Update order using body data
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return updated object
            runValidators: true // Validate changes
        });
        // Check if ID was found
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        // Deliver updated order
        res.status(200).json({ success: true, data: order });
    } catch (err) {
        // Handle update errors
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Cancel/Delete an order record
 * @route   DELETE /api/orders/:id
 */
exports.deleteOrder = async (req, res, next) => {
    try {
        // Remove document by ID
        const order = await Order.findByIdAndDelete(req.params.id);
        // Trigger 404 if order not found
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        // Send success indicator
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        // Handle deletion errors
        res.status(400).json({ success: false, message: err.message });
    }
};
