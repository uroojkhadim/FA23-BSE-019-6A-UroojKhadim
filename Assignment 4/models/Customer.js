// Import the mongoose library
const mongoose = require('mongoose');

// Define the blueprint (Schema) for the Customer resource
const customerSchema = new mongoose.Schema({
    // Name field: must be a string and is mandatory
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true // Remove unnecessary whitespace from start and end
    },
    // Email field: must be unique and follow a specific regex pattern
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true, // Prevent duplicate emails in the database
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    // Phone field: must be a string and has a maximum length limit
    phone: {
        type: String,
        required: [true, 'Please add a phone number'],
        maxlength: [20, 'Phone number can not be longer than 20 characters']
    },
    // Address field: must be a string and is mandatory
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    // CreatedAt field: defaults to the current date and time
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export the Customer model created from the schema
module.exports = mongoose.model('Customer', customerSchema);
