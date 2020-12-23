module.exports.localsUser = function (req, res, next) {
    if (typeof req.session.isAuth === 'undefined') {
        req.session.isAuth = false;
        req.session.cart = [];
    }

    res.locals.isAuth = req.session.isAuth;
    res.locals.authUser = req.session.authUser;
    next();
};
