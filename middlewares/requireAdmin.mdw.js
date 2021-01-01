const adminModel = require('../models/admin.model');

module.exports.isAdmin = async function(req, res, next) {
  const admin = await adminModel.findOne({_id: req.user._id});
  if(!admin) {
    req.session.retURL = req.originalUrl;
    res.redirect('/account/login');
  } else {
    next();
  }
}

