const courseModel = require('../models/course.model');
const mongoose = require('mongoose');

module.exports = {
    getCart: async function (req, res) {
        const cartArr = req.session.cart;

        if (typeof cartArr == 'undefined') {
            return res.render('cart/cart', { isEmpty: true });
        }

        var viewCartArr = [];

        for (ci of cartArr) {
            console.log(ci);
            const id = mongoose.mongo.ObjectId(ci.courseId);
            var course = await courseModel.findById(id);
            viewCartArr = [...viewCartArr, course];
        }
        res.render('cart/cart', { viewCartArr: viewCartArr, isEmpty: false });
    },
    addToCart: function (req, res) {
        const courseId = req.body.courseId;

        var cartArr = req.session.cart;

        if (typeof cartArr == 'undefined') {
            req.session.cart = [];
            cartArr = req.session.cart;
        }

        for (ci of cartArr) {
            if (ci.courseId === courseId)
                return res.redirect(req.headers.referer);
        }

        req.session.cart = [...req.session.cart, { courseId }];
        res.redirect(req.headers.referer);
    },

    getCheckout: function (req, res) {
        res.render('cart/checkout.hbs');
    },
};
