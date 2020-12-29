const courseModel = require('../models/course.model');

module.exports.localsUser = async function (req, res, next) {
    if (typeof req.session.cart === 'undefined') {
        req.session.cart = [];
    }

    if (req.session.cart.length == 0) {
        res.locals.isEmptyCart = true;
        res.locals.cartCount = 0;
    } else {
        res.locals.isEmptyCart = false;
        res.locals.cartCount = req.session.cart.length;
    }

    if (req.user) {
        var studentCourse = await courseModel.findCoursesByStudent(
            req.user._id
        );
        var studentIdArr = studentCourse.map((doc) => doc._id.toString());
        const cartArr = req.session.cart;
        newCartArr = [];
        totalPrice = 0;

        for (const ci of cartArr) {
            if (!studentIdArr.includes(ci.courseId)) {
                newCartArr = [...newCartArr, ci];
            }
        }

        req.session.cart = newCartArr;
        res.locals.cartCount = newCartArr.length;
    }

    if (typeof req.user === 'undefined') {
        res.locals.isAuth = false;
    } else {
        res.locals.isAuth = true;
        res.locals.authUser = req.user;
    }
    next();
};
