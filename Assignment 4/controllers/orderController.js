const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate('customer').populate('product');
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Public
exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('customer').populate('product');
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, data: order });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res, next) => {
    try {
        const { customer, product, quantity } = req.body;

        // Check product stock
        const productDoc = await Product.findById(product);
        if (!productDoc) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (productDoc.stock < quantity) {
            return res.status(400).json({ success: false, message: 'Insufficient stock' });
        }

        // Calculate total price
        const totalPrice = productDoc.price * quantity;

        // Create order
        const order = await Order.create({
            customer,
            product,
            quantity,
            totalPrice
        });

        // Update product stock
        productDoc.stock -= quantity;
        await productDoc.save();

        res.status(201).json({ success: true, data: order });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Public
exports.updateOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, data: order });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Public
exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
