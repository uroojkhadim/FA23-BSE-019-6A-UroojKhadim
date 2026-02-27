// userController.js - Business logic for users
//
// Restaurant Analogy:
// - Controller = The Chef preparing the "dish" (response)
// - Receives orders from the router and crafts the final plate (JSON)

const userModel = require('../models/user');

function getUserById(req, res) {
  const { id } = req.params;
  const user = userModel.getById(Number(id)) || { id, name: `User ${id}` };
  res.json(user);
}

function createUser(req, res) {
  const data = req.body;
  const created = userModel.create({ name: data.name });
  res.status(201).json({ message: 'User created', user: created });
}

module.exports = { getUserById, createUser };
