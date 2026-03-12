// Import core Node.js and third-party libraries
const express = require('express'); // Web framework for handling HTTP requests
const dotenv = require('dotenv');    // Tool for loading environment variables
const morgan = require('morgan');    // Logging middleware for development
const cors = require('cors');        // Middleware for Cross-Origin Resource Sharing
const connectDB = require('./config/db'); // Database connection logic

// Initialize environment variables from the .env file
dotenv.config();

// Establish connection to the MongoDB database
connectDB();

// Import route definitions for each resource
const customers = require('./routes/customerRoutes');
const products = require('./routes/productRoutes');
const orders = require('./routes/orderRoutes');

// Initialize the Express application
const app = express();

// Middleware to parse incoming JSON data from request bodies
app.use(express.json());

// Enable CORS to allow the API to be called from different domains
app.use(cors());

// Use Morgan logger in development mode to see request logs in terminal
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount the resource-specific routers to their respective API paths
app.use('/api/customers', customers);
app.use('/api/products', products);
app.use('/api/orders', orders);

// Define a default "Root" route to verify the API is running
app.get('/', (req, res) => {
    // Return a simple text confirmation
    res.send('Online Order Management API is running...');
});

// Global error handler for catching and responding to server errors
app.use((err, req, res, next) => {
    // Print the error stack trace to the console
    console.error(err.stack);
    // Return a generic 500 server error response
    res.status(500).json({ success: false, error: 'Server Error' });
});

// Determine the port number from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming connections
const server = app.listen(PORT, () => {
    // Log that the server is active and note the mode and port
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Global handler for promise rejections that aren't specifically caught
process.on('unhandledRejection', (err, promise) => {
    // Log the error message
    console.log(`Error: ${err.message}`);
    // Safely shut down the server and exit the process
    server.close(() => process.exit(1));
});
