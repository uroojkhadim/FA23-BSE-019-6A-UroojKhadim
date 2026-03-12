// Import the mongoose library
const mongoose = require('mongoose');

// Define the blueprint (Schema) for the Product resource
const productSchema = new mongoose.Schema({
    // Name field: must be a string and is mandatory
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true // Remove unnecessary whitespace
    },
    // Price field: must be a number and is mandatory
    price: {
        type: Number,
        required: [true, 'Please add a product price']
    },
    // Description field: must be a string and is mandatory
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    // Stock field: must be a number, defaults to 0
    stock: {
        type: Number,
        required: [true, 'Please add stock quantity'],
        default: 0
    },
    // CreatedAt field: defaults to the current date and time
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export the Product model created from the schema
module.exports = mongoose.model('Product', productSchema);
