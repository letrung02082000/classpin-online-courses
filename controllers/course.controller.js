const courseModel = require('../models/course.model');

module.exports = {
  course: async function(req, res) {
    const matchedCourse = await courseModel.findById(req.params.id);
    console.log(matchedCourse.name);
    res.render('course/index', {
      course: matchedCourse
    })
  }
}