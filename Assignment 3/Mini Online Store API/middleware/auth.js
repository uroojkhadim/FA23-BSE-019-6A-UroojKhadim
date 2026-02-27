// auth.js - Simulated auth middleware for /users routes
//
// Restaurant Analogy:
// - Middleware = The Waiter verifying you have a reservation (token)
// - If you have a valid token, you proceed to your table (controller)
// - If not, access is denied (401)
//
// Simulation details:
// - Expects an Authorization header: "Bearer demo-token"

function auth(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const isValid = authHeader.startsWith('Bearer ') && authHeader.split(' ')[1] === 'demo-token';

  if (!isValid) {
    return res.status(401).json({ error: 'Unauthorized: missing or invalid token' });
  }

  req.user = { id: 42, role: 'student' };
  next();
}

module.exports = auth;

