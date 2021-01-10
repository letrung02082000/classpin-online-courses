const studentModel = require('../models/student.model');
const lessonModel = require('../models/lesson.model');

module.exports.checkInCourse = async function(req, res, next) {
  const lessonId = req.params.lessonId;
  let lesson = await lessonModel.findById(lessonId);
  if(lesson.isFree) {
    next();
    return;
  }
  const student = await studentModel.findById(req.user._id);
  if(!student) {
    req.session.retURL = req.originalUrl;
    res.redirect('/account/login');
  } else {
    next();
  }
}

