const express = require('express');
const cartController = require('../controllers/cart.controller');
const router = express.Router();

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.get('/checkout', cartController.getCheckout);
router.post('/checkout', cartController.postCheckout);
router.post('/del', cartController.delFromCart);

module.exports = router;
