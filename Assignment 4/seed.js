const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

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

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Cleaning database...');
        await Customer.deleteMany();
        await Product.deleteMany();
        await Order.deleteMany();

        console.log('Seeding customers...');
        const createdCustomers = await Customer.create(customers);

        console.log('Seeding products...');
        const createdProducts = await Product.create(products);

        console.log('Creating a sample order...');
        await Order.create({
            customer: createdCustomers[0]._id,
            product: createdProducts[0]._id,
            quantity: 1,
            totalPrice: createdProducts[0].price
        });

        console.log('Data Seeded Successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
