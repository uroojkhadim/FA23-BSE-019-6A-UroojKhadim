// productController.js - Business logic for products
//
// Restaurant Analogy:
// - Controller = The Chef preparing the "dish" (response)
// - Receives orders from the router and crafts the final plate (JSON)

function getAllProducts(req, res) {
  const products = [
    { id: 1, name: 'Laptop', price: 1200 },
    { id: 2, name: 'Headphones', price: 150 },
    { id: 3, name: 'Keyboard', price: 80 },
  ];
  res.json({ items: products });
}

module.exports = { getAllProducts };

