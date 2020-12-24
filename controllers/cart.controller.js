const courseModel = require('../models/course.model');
const mongoose = require('mongoose');

module.exports = {
    getCart: async function (req, res) {
        const cartArr = req.session.cart;
        console.log(cartArr);
        var viewCartArr = [];

        for (ci of cartArr) {
            console.log(ci);
            const id = mongoose.mongo.ObjectId(ci.courseId);
            var course = await courseModel.findById(id);
            viewCartArr = [...viewCartArr, course];
        }
        console.log(viewCartArr);
        res.render('checkout/cart', { viewCartArr: viewCartArr });
    },
    addToCart: function (req, res) {
        const courseId = req.body.courseId;

        const cartArr = req.session.cart;

        for (ci of cartArr) {
            if (ci.courseId === courseId)
                return res.redirect(req.headers.referer);
        }

        req.session.cart = [...req.session.cart, { courseId }];
        res.redirect(req.headers.referer);
        console.log(req.session.cart);
    },

    getCheckout: function (req, res) {
        res.render('checkout/checkout.hbs');
    },
};
