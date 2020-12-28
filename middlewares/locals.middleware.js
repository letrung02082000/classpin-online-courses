module.exports.localsUser = function (req, res, next) {
    if (typeof req.session.cart === 'undefined') {
        req.session.cart = [];
    }

    if (
        typeof req.session.cart === 'undefined' ||
        req.session.cart.length == 0
    ) {
        res.locals.isEmptyCart = true;
        res.locals.cartCount = 0;
    } else {
        res.locals.isEmptyCart = false;
        res.locals.cartCount = req.session.cart.length;
    }

    if (typeof req.user === 'undefined') {
        res.locals.isAuth = false;
    } else {
        res.locals.isAuth = true;
        res.locals.authUser = req.user;
    }
    next();
};
