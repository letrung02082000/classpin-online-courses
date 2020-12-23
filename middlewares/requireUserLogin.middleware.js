module.exports.requireUser = async function(req, res, next) {
  if(!req.user) {
    req.session.retURL = req.originalUrl;
    res.redirect('/account/login');
  } else {
    next();
  }
}

