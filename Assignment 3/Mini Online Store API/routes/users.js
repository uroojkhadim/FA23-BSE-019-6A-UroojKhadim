// users.js - Users Router
//
// Restaurant Analogy:
// - Router = Menu section for "Users"
// - It directs user-related orders to the right controller (chef)
//
// Why express.Router()? Clean & Scalable Code:
// - Keeps user routes isolated from other domains
// - Easier to maintain and test, reduces app.js complexity

const express = require('express');
const { getUserById, createUser } = require('../controllers/userController');

const router = express.Router();

// GET /users/:id
router.get('/:id', getUserById);

// POST /users
router.post('/', createUser);

module.exports = router;

