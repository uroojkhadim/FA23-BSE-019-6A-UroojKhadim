// products.js - Products Router
//
// Restaurant Analogy:
// - Router = Menu section for "Products"
// - It directs product-related orders to the right controller (chef)
//
// Why express.Router()? Clean & Scalable Code:
// - Keeps product routes isolated from other domains
// - Easier to maintain and test, reduces app.js complexity

const express = require('express');
const { getAllProducts } = require('../controllers/productController');

const router = express.Router();

// GET /products
router.get('/', getAllProducts);

module.exports = router;

