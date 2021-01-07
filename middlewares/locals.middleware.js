const { loadAllCategories } = require('../models/category.model');
const courseModel = require('../models/course.model');
const categoryModel = require('../models/category.model');

module.exports.localsUser = async function (req, res, next) {
    //Get category for navbar
    var allCategories = await loadAllCategories();
    var menuCategory = [];
    var subMenuCategoryId = [];

    for (const category of allCategories) {
        if (category.sub_category.length != 0) {
            category.hasSub = true;
            menuCategory.push(category);
        }
    }

    for (const category of menuCategory) {
        var subCategories = [];
        for (const subCategoryId of category.sub_category) {
            const subCategory = await categoryModel.findById(
                category.sub_category
            );
            subMenuCategoryId.push(subCategoryId.toString());
            subCategories.push(subCategory);
        }
        category.sub_category = subCategories;
    }

    for (const category of allCategories) {
        if (category.sub_category.length != 0) {
            continue;
        }

        if (subMenuCategoryId.includes(category._id.toString())) {
            continue;
        }

        menuCategory.push(category);
    }

    res.locals.menuCategory = menuCategory;

    //handle Cart
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

    if (
        typeof req.user === 'undefined' ||
        req.user.type === 1 ||
        req.user.type === 2
    ) {
        res.locals.isAuth = false;
    } else {
        res.locals.isAuth = true;
        res.locals.authUser = req.user;
    }
    next();
};
