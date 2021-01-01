const adminModel = require('../models/admin.model');

module.exports.isAdmin = async function(req, res, next) {
  if(!req.user) {
    res.redirect('/admin/login');
    return;
  }
  const admin = await adminModel.findById(req.user._id)
  if(!admin) {
    req.session.retURL = req.originalUrl;
    res.redirect('/admin/login');
  } else {
    next();
  }
}

