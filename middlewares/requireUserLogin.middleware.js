module.exports.requireUser = async function(req, res, next) {
  if(req.session.isAuth === false) {
    req.session.retURL = req.originalUrl;
    res.redirect('/account/login');
  } else {
    next();
  }
}