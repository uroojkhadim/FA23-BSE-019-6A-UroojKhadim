// logger.js - Custom logger middleware
//
// Restaurant Analogy:
// - Middleware = The Waiter checking the order
// - The waiter notes what the customer asked (method + URL)
// - Then passes the order to the kitchen (next middleware/controller)

function logger(req, res, next) {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
}

module.exports = logger;

