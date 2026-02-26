// Mini Online Store API - Express.js Lab Project
// Scalable Application Architecture (MVC) with express.Router
//
// Restaurant Analogy:
// - Express App = The Restaurant building
// - Middleware = The Waiter checking the order and guiding flow
// - Controllers = The Chef preparing business logic (responses)
// - Routers = The Menu sections leading orders to the right chef
// This analogy helps understand how requests move through the system.
//
// Why express.Router()? Clean & Scalable Code:
// - Keeps app.js small and focused on bootstrapping
// - Allows modular route files per domain (products/users)
// - Encourages separation of concerns, easier testing and maintenance
// - Scales better as features grow

const express = require('express');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');

const app = express();

// Built-in middleware to parse JSON bodies
app.use(express.json());

// Apply logger globally: every request goes through the "waiter"
app.use(logger);

// Mount routers
// Products routes are public
app.use('/products', productsRouter);

// Users routes protected by auth middleware (router-level protection)
// Only /users routes require the "auth check"
app.use('/users', auth, usersRouter);

// Root
app.get('/', (req, res) => {
  res.json({ message: 'Mini Online Store API is running' });
});

// 404 Not Found handler (placed at the end)
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Server listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

