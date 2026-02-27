// Mini Online Store API - Express.js Lab Project
// Scalable Application Architecture (MVC) with express.Router
//
// Restaurant Analogy:
// - Express App = The Restaurant building
// - Middleware = The Waiter checking the order and guiding flow
// - Controllers = The Chef preparing business logic (responses)
// - Routers = The Menu sections leading orders to the right chef
//
// Why express.Router()? Clean & Scalable Code:
// - Keeps app.js focused on bootstrapping
// - Modular route files per domain (products/users)
// - Separation of concerns, easier testing and maintenance
// - Scales better as features grow

const express = require('express');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');

const app = express();

// Built-in middleware to parse JSON bodies
app.use(express.json());

// Apply logger globally
app.use(logger);

// Mount routers
app.use('/products', productsRouter);
app.use('/users', auth, usersRouter);

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Server listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

