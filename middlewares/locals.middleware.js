module.exports.localsUser = function(req, res, next) {
  if(typeof req.user === 'undefined') {
    res.locals.isAuth = false;
    req.session.cart = [];
  }
  else {
    res.locals.isAuth = true;
    res.locals.authUser = req.user;
  }
  next();
}

