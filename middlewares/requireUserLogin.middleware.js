const studentModel = require('../models/student.model');

module.exports.requireUser = async function(req, res, next) {
  if(!req.user) {
    res.redirect('/account/login');
    return
  }
  const student = await studentModel.findById(req.user._id);
  if(!student) {
    req.session.retURL = req.originalUrl;
    res.redirect('/account/login');
  } else {
    next();
  }
}

