const teacherModel = require('../models/teacher.model');

module.exports.isTeacher = async function(req, res, next) {
  if(!req.user) {
    res.redirect('/teacher/login');
    return;
  }
  const teacher = await teacherModel.findById(req.user._id)
  if(!teacher) {
    req.session.retURL = req.originalUrl;
    res.redirect('/teacher/login');
  } else {
    next();
  }
}

