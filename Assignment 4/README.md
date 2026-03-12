# Online Order Management System REST API

A simple RESTful API for managing customers, products, and orders built with Node.js, Express, and MongoDB.

## Features

- **Customers**: Manage customer information (name, email, phone, address).
- **Products**: Manage product catalog (name, price, stock, description).
- **Orders**: Create and track orders. Automatically calculates total price and manages product stock.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Middleware**: Morgan (logging), CORS, JSON body-parser

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running locally (or a remote URI)

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/order_management
   NODE_ENV=development
   ```
4. Seed the database with sample data:
   ```bash
   node seed.js
   ```
5. Start the server:
   ```bash
   npm start
   ```

## API Documentation

### Customers

- `GET /api/customers`: Get all customers
- `GET /api/customers/:id`: Get a legacy customer by ID
- `POST /api/customers`: Create a new customer
- `PUT /api/customers/:id`: Update a customer
- `DELETE /api/customers/:id`: Delete a customer

### Products

- `GET /api/products`: Get all products
- `GET /api/products/:id`: Get a product by ID
- `POST /api/products`: Create a new product
- `PUT /api/products/:id`: Update a product
- `DELETE /api/products/:id`: Delete a product

### Orders

- `GET /api/orders`: Get all orders
- `GET /api/orders/:id`: Get an order by ID
- `POST /api/orders`: Create a new order (calculates total price and updates stock)
- `PUT /api/orders/:id`: Update an order status
- `DELETE /api/orders/:id`: Delete an order

## Folder Structure

- `config/`: Database configuration
- `controllers/`: Request handling logic
- `models/`: Mongoose schemas
- `routes/`: API endpoint definitions
- `server.js`: Application entry point
