const courseModel = require('../models/course.model');
const mongoose = require('mongoose');
const { mongooseToObj } = require('../utils/toobject');

module.exports = {
    getCart: async function (req, res) {
        const cartArr = req.session.cart;

        var viewCartArr = [];

        for (ci of cartArr) {
            var id = mongoose.mongo.ObjectId(ci.courseId);
            var course = await courseModel.findById(id);
            viewCartArr = [...viewCartArr, course];
        }

        res.render('cart', { viewCartArr: viewCartArr });
    },
    addToCart: function (req, res) {
        const courseId = req.body.courseId;

        const cartArr = req.session.cart;

        for (ci of cartArr) {
            if (ci.courseId === courseId)
                return res.redirect(req.headers.referer);
        }

        req.session.cart = [...req.session.cart, { courseId }];
        console.log(req.session.cart);
        res.redirect(req.headers.referer);
    },
};
