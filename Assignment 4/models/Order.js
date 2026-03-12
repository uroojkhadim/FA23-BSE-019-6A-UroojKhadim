// Import the mongoose library
const mongoose = require('mongoose');

// Define the blueprint (Schema) for the Order resource
const orderSchema = new mongoose.Schema({
    // Store the ID of the customer who made the order
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // Create a relationship with the Customer model
        required: [true, 'Please add a customer ID']
    },
    // Store the ID of the product being ordered
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Create a relationship with the Product model
        required: [true, 'Please add a product ID']
    },
    // Quantity field: must be at least 1
    quantity: {
        type: Number,
        required: [true, 'Please add quantity'],
        min: [1, 'Quantity must be at least 1']
    },
    // TotalPrice: calculated based on product price and quantity
    totalPrice: {
        type: Number,
        required: true
    },
    // OrderDate: defaults to current date
    orderDate: {
        type: Date,
        default: Date.now
    },
    // OrderStatus: restricted to specific string values
    orderStatus: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
});

// Export the Order model created from the schema
module.exports = mongoose.model('Order', orderSchema);
