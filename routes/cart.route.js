const express = require('express');
const cartController = require('../controllers/cart.controller');
const router = express.Router();

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);

module.exports = router;
