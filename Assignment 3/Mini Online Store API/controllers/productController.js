// productController.js - Business logic for products
//
// Restaurant Analogy:
// - Controller = The Chef preparing the "dish" (response)
// - Receives orders from the router and crafts the final plate (JSON)

const productModel = require('../models/product');

function getAllProducts(req, res) {
  const items = productModel.getAll();
  res.json({ items });
}

module.exports = { getAllProducts };
