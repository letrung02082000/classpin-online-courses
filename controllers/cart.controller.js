const courseModel = require('../models/course.model');
const mongoose = require('mongoose');

module.exports = {
    getCart: async function (req, res) {
        const cartArr = req.session.cart;

        if (typeof cartArr == 'undefined') {
            return res.render('cart/cart', { isEmpty: true });
        }

        var viewCartArr = [];
        var totalPrice = 0;

        for (ci of cartArr) {
            const id = mongoose.mongo.ObjectId(ci.courseId);
            var course = await courseModel.findById(id);
            viewCartArr = [...viewCartArr, course];
            totalPrice += course.price;
        }
        res.render('cart/cart', {
            viewCartArr: viewCartArr,
            isEmpty: false,
            totalPrice,
        });
    },
    addToCart: async function (req, res) {
        const courseId = req.body.courseId;
        const studentId = mongoose.mongo.ObjectId(req.user._id);

        const course = await courseModel.findById(
            mongoose.mongo.ObjectId(courseId)
        );

        console.log(course.list_student);

        for (student of course.list_student) {
            if (student == studentId) {
                return res.redirect(req.headers.referer);
            }
        }

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

    getCheckout: async function (req, res) {
        const cartArr = req.session.cart;

        if (typeof cartArr == 'undefined') {
            return res.render('cart/cart', { isEmpty: true });
        }

        var viewCartArr = [];
        var totalPrice = 0;

        for (ci of cartArr) {
            console.log(ci);
            const id = mongoose.mongo.ObjectId(ci.courseId);
            var course = await courseModel.findById(id);
            viewCartArr = [...viewCartArr, course];
            totalPrice += course.price;
        }
        res.render('cart/checkout', {
            viewCartArr: viewCartArr,
            isEmpty: false,
            totalPrice,
        });
    },

    postCheckout: async function (req, res) {
        var isSuccessful = false;

        const cartArr = req.session.cart;

        if (!req.user) {
            return res.redirect('/account/login');
        }

        if (typeof cartArr != 'undefined' && cartArr.length > 0) {
            const userId = mongoose.mongo.ObjectId(req.user._id);
            var courseArr = [];

            for (ci of cartArr) {
                courseArr.push(mongoose.mongo.ObjectId(ci.courseId));
            }

            courseModel.addStudentToManyCourses(courseArr, userId);
        }

        return res.render('cart/successCheckout', { isSuccessful: true });
    },
    delFromCart: function (req, res) {
        const courseId = req.body.courseId;
        console.log(courseId);
        if (req.session.cart) {
            console.log(req.session.cart);
            req.session.cart = req.session.cart.filter(
                (course) => course.courseId != courseId
            );
        }
        return res.redirect('/cart');
    },
};
