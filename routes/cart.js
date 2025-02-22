const express = require('express');
const {
  addCart,
  getCart,
  removeCart
} = require('../controllers/cartController')

const router = express.Router()

router.get('/fetch/:id', getCart);

router.post('/add/', addCart);

router.post('/remove/', removeCart);


module.exports = router