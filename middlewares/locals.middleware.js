module.exports.localsUser = function (req, res, next) {
    if (typeof req.user === 'undefined') {
        res.locals.isAuth = false;
    } else {
        res.locals.isAuth = true;
        res.locals.authUser = req.user;
    }
    next();
};
