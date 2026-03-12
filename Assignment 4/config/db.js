// Import the mongoose library to interact with MongoDB
const mongoose = require('mongoose');
// Import the dotenv library to load environment variables from a .env file
const dotenv = require('dotenv');

// Load environment variables from the .env file into process.env
dotenv.config();

/**
 * Function to connect to the MongoDB database
 */
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the URI from environment variables
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        // Log a success message with the host name if connected
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Log the error message if the connection fails
        console.error(`Error: ${error.message}`);
        // Exit the process with failure code 1
        process.exit(1);
    }
};

// Export the connectDB function to be used in server.js
module.exports = connectDB;
