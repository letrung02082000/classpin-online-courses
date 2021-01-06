const courseModel = require('../models/course.model');
const mongoose = require('mongoose');
const categoryModel = require('../models/category.model');
const { getMonday } = require('../utils/getMonday');
const { resetLastCount } = require('../models/category.model');

module.exports = {
    getCart: async function (req, res) {
        const cartArr = req.session.cart;

        if (typeof cartArr == 'undefined' || cartArr.length === 0) {
            return res.render('cart/cart', { isEmpty: true });
        }

        var viewCartArr = [];
        var totalPrice = 0;

        if (!req.user) {
            for (ci of cartArr) {
                const id = mongoose.mongo.ObjectId(ci.courseId);
                var course = await courseModel.findById(id);
                viewCartArr = [...viewCartArr, course];
                totalPrice += course.price;
            }

            res.render('cart/cart', {
                viewCartArr: viewCartArr,
                isEmpty: viewCartArr.length == 0 ? true : false,
                totalPrice,
            });
        } else {
            var studentCourse = await courseModel.findCoursesByStudent(
                req.user._id
            );

            var studentIdArr = studentCourse.map((doc) => doc._id.toString());

            for (const ci of cartArr) {
                if (!studentIdArr.includes(ci.courseId)) {
                    const courseId = mongoose.mongo.ObjectId(ci.courseId);
                    var cartCourse = await courseModel.findById(courseId);
                    viewCartArr = [...viewCartArr, cartCourse];
                    totalPrice += cartCourse.price;
                }
            }
            res.locals.cartCount = viewCartArr.length;
            res.render('cart/cart', {
                viewCartArr: viewCartArr,
                isEmpty: false,
                totalPrice,
            });
        }
    },
    addToCart: async function (req, res) {
        const courseId = req.body.courseId;

        if (!req.user) {
            const course = await courseModel.findById(
                mongoose.mongo.ObjectId(courseId)
            );

            var cartArr = req.session.cart;

            for (ci of cartArr) {
                if (ci.courseId === courseId)
                    return res.redirect(req.headers.referer);
            }

            req.session.cart = [...req.session.cart, { courseId }];
            return res.redirect(req.headers.referer);
        } else {
            var studentCourse = await courseModel.findCoursesByStudent(
                req.user._id
            );

            var studentCourseId = studentCourse.map((doc) =>
                doc._id.toString()
            );

            if (studentCourseId.includes(courseId)) {
                return res.redirect(req.headers.referer);
            }

            var cartArr = req.session.cart;

            for (ci of cartArr) {
                if (ci.courseId === courseId)
                    return res.redirect(req.headers.referer);
            }

            req.session.cart = [...req.session.cart, { courseId }];
            return res.redirect(req.headers.referer);
        }
    },

    getCheckout: async function (req, res) {
        // if (!req.user) {
        //     return res.redirect('/account/login');
        // }

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
            for (ci of cartArr) {
                try {
                    await courseModel.addStudentCourse(
                        ci.courseId,
                        req.user._id
                    );
                } catch (error) {
                    continue;
                }

                const course = await courseModel.findById(
                    mongoose.mongo.ObjectId(ci.courseId)
                );

                const categoryId = course.category;

                const category = await categoryModel.findById(
                    mongoose.mongo.ObjectId(categoryId)
                );

                const lastCount = new Date(category.last_count);

                const mondayDate = getMonday();

                if (lastCount < mondayDate) {
                    await categoryModel.resetLastCount(categoryId);
                    await categoryModel.increaseStudentCount(categoryId);
                } else {
                    await categoryModel.increaseStudentCount(categoryId);
                }
            }
        }

        return res.render('cart/successCheckout', { isSuccessful: true });
    },
    delFromCart: function (req, res) {
        const courseId = req.body.courseId;

        if (req.session.cart) {
            req.session.cart = req.session.cart.filter(
                (course) => course.courseId != courseId
            );
        }

        res.redirect('/cart');
    },
};
