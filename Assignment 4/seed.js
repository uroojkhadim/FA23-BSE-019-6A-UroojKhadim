// Import mongoose to interact with the database
const mongoose = require('mongoose');
// Import dotenv to use variables from the .env file
const dotenv = require('dotenv');
// Import the data models for Customers, Products, and Orders
const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Order = require('./models/Order');

// Load environment variables (like the MongoDB URI)
dotenv.config();

// Array of sample customer objects to be seeded
const customers = [
    {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        address: '123 Main St, New York, NY'
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '987-654-3210',
        address: '456 Oak Ave, Los Angeles, CA'
    }
];

// Array of sample product objects to be seeded
const products = [
    {
        name: 'Laptop',
        price: 999.99,
        description: 'High-performance laptop for developers',
        stock: 50
    },
    {
        name: 'Smartphone',
        price: 499.99,
        description: 'Latest model with dual cameras',
        stock: 100
    },
    {
        name: 'Headphones',
        price: 79.99,
        description: 'Noise-cancelling wireless headphones',
        stock: 200
    }
];

/**
 * Main function to clean the existing data and populate the database with fresh samples
 */
const seedData = async () => {
    try {
        // Connect to the database using the URI from environment variables
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Cleaning database...');
        // Clear all existing documents from Customer, Product, and Order collections
        await Customer.deleteMany();
        await Product.deleteMany();
        await Order.deleteMany();

        console.log('Seeding customers...');
        // Batch insert the sample customer data
        const createdCustomers = await Customer.create(customers);

        console.log('Seeding products...');
        // Batch insert the sample product data
        const createdProducts = await Product.create(products);

        console.log('Creating a sample order...');
        // Create an initial sample order linking a customer and a product
        await Order.create({
            customer: createdCustomers[0]._id, // Use the ID of the first created customer
            product: createdProducts[0]._id,   // Use the ID of the first created product
            quantity: 1,
            totalPrice: createdProducts[0].price
        });

        console.log('Data Seeded Successfully!');
        // Terminate the script successfully
        process.exit();
    } catch (err) {
        // Handle any errors that occur during the seeding process
        console.error(err);
        // Terminate the script with an error code
        process.exit(1);
    }
};

// Execute the seeding function
seedData();
