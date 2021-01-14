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
        var totalSalePrice = 0;

        if (!req.user) {
            for (ci of cartArr) {
                const id = mongoose.mongo.ObjectId(ci.courseId);
                var course = await courseModel.findDetailCourseById(id);

                const discount = course.discount || 0;
                course.salePrice = course.price * (1 - discount / 100);
                totalSalePrice += course.salePrice;
                totalPrice += course.price;

                viewCartArr = [...viewCartArr, course];
            }

            res.render('cart/cart', {
                viewCartArr: viewCartArr,
                isEmpty: viewCartArr.length == 0 ? true : false,
                totalPrice,
                totalSalePrice,
                cartQuantity: viewCartArr.length,
                greaterThanOne: viewCartArr.length > 1 ? true : false,
            });
        } else {
            var studentCourse = await courseModel.findCoursesByStudent(
                req.user._id
            );

            var studentIdArr = studentCourse.map((doc) => doc._id.toString());

            for (const ci of cartArr) {
                if (!studentIdArr.includes(ci.courseId)) {
                    const courseId = mongoose.mongo.ObjectId(ci.courseId);
                    var cartCourse = await courseModel.findDetailCourseById(
                        courseId
                    );

                    totalPrice += cartCourse.price;
                    const discount = cartCourse.discount || 0;
                    cartCourse.salePrice =
                        cartCourse.price * (1 - discount / 100);
                    totalSalePrice += cartCourse.salePrice;

                    viewCartArr = [...viewCartArr, cartCourse];
                }
            }
            res.locals.cartCount = viewCartArr.length;
            res.render('cart/cart', {
                viewCartArr: viewCartArr,
                isEmpty: false,
                totalPrice,
                totalSalePrice,
                cartQuantity: viewCartArr.length,
                greaterThanOne: viewCartArr.length > 1 ? true : false,
            });
        }
    },
    addToCart: async function (req, res) {
        const courseId = req.body.courseId.toString();

        if (!req.user) {
            const course = await courseModel.findById(
                mongoose.mongo.ObjectId(courseId)
            );

            var cartArr = req.session.cart;

            for (ci of cartArr) {
                if (ci.courseId === courseId) {
                    var msg = encodeURIComponent('exist');
                    var url =
                        req.headers.referer.toString().split('?')[0] +
                        '?status=' +
                        msg;
                    return res.redirect(url);
                }
            }

            req.session.cart = [...req.session.cart, { courseId }];
            var msg = encodeURIComponent('addsuccess');
            var url =
                req.headers.referer.toString().split('?')[0] + '?status=' + msg;
            return res.redirect(url);
        } else {
            var studentCourse = await courseModel.findCoursesByStudent(
                req.user._id
            );

            var studentCourseId = studentCourse.map((doc) =>
                doc._id.toString()
            );

            if (studentCourseId.includes(courseId)) {
                var msg = encodeURIComponent('incourse');
                var url =
                    req.headers.referer.toString().split('?')[0] +
                    '?status=' +
                    msg;
                return res.redirect(url);
            }

            var cartArr = req.session.cart;

            for (ci of cartArr) {
                if (ci.courseId === courseId) {
                    var msg = encodeURIComponent('exist');
                    var url =
                        req.headers.referer.toString().split('?')[0] +
                        '?status=' +
                        msg;
                    return res.redirect(url);
                }
            }

            req.session.cart = [...req.session.cart, { courseId }];
            var msg = encodeURIComponent('addsuccess');
            var url =
                req.headers.referer.toString().split('?')[0] + '?status=' + msg;
            return res.redirect(url);
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
            student: req.user,
        });
    },

    postCheckout: async function (req, res) {
        var isSuccessful = false;

        const cartArr = req.session.cart;

        if (!req.user) {
            return res.redirect('/account/login');
        }

        var course;

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

                course = await courseModel.findById(
                    mongoose.mongo.ObjectId(ci.courseId)
                );

                const categoryId = course.category;

                const category = await categoryModel.findById(
                    mongoose.mongo.ObjectId(categoryId)
                );

                if (!category.last_count) {
                    await categoryModel.resetLastCount(categoryId);
                    await categoryModel.increaseStudentCount(categoryId);
                } else {
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
        }

        return res.render('cart/successCheckout', {
            isSuccessful: true,
            course,
        });
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

    buyNow: async function (req, res) {
        const courseId = req.body.courseId;
        const course = await courseModel.findById(
            mongoose.mongo.ObjectId(courseId)
        );

        res.render('cart/buynow', { course });
    },

    postBuyNowCheckout: async function (req, res) {
        const courseId = req.body.courseId;

        try {
            await courseModel.addStudentCourse(courseId, req.user._id);
        } catch (error) {
            res.render('cart/successCheckout', { isSuccessful: false });
        }

        const course = await courseModel.findById(
            mongoose.mongo.ObjectId(courseId)
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

        res.render('cart/successCheckout', { isSuccessful: true, course });
    },
};
