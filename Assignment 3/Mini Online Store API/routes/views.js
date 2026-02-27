const express = require('express');
const auth = require('../middleware/auth');
const productModel = require('../models/product');
const userModel = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/products', (req, res) => {
  res.render('products', { items: productModel.getAll() });
});

router.get('/users', auth, (req, res) => {
  res.render('users', { items: userModel.getAll() });
});

router.get('/users/:id', auth, (req, res) => {
  const id = Number(req.params.id);
  const user = userModel.getById(id);
  if (!user) return res.status(404).render('error', { message: 'Not Found' });
  res.render('user_detail', { user });
});

module.exports = router;

