const express = require('express');
const cartController = require('../controllers/cart.controller');
const mdw = require('../middlewares/requireUserLogin.middleware');
const router = express.Router();

router.get('/', cartController.getCart);
router.post('/buynow', mdw.requireUser, cartController.buyNow);
router.post(
    '/buynow/checkout',
    mdw.requireUser,
    cartController.postBuyNowCheckout
);
router.post('/add', cartController.addToCart);
router.get('/checkout', mdw.requireUser, cartController.getCheckout);
router.post('/checkout', mdw.requireUser, cartController.postCheckout);
router.post('/del', cartController.delFromCart);

module.exports = router;
