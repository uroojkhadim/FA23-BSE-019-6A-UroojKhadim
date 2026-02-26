// userController.js - Business logic for users
//
// Restaurant Analogy:
// - Controller = The Chef preparing the "dish" (response)
// - Receives orders from the router and crafts the final plate (JSON)

function getUserById(req, res) {
  const { id } = req.params; // Demonstrates route parameters
  res.json({ id, name: `User ${id}` });
}

function createUser(req, res) {
  const data = req.body; // Demonstrates JSON body parsing
  const created = {
    id: Math.floor(Math.random() * 10000),
    ...data,
  };
  res.status(201).json({ message: 'User created', user: created });
}

module.exports = { getUserById, createUser };

