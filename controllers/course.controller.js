const courseModel = require('../models/course.model');
const studentModel = require('../models/student.model');
const ratingModel = require('../models/rating.model');

module.exports = {
  course: async function(req, res) {
    const matchedCourse = await courseModel.findById(req.params.id);
    console.log(matchedCourse.name);
    res.render('course/index', {
      course: matchedCourse
    })
  },
  rating: function(req, res) {
    res.render('course/rating', {
      layout: false,
    })
  },

  postRating: async function(req, res) {
    console.log(req.body);
    //const course = await courseModel.findById(req.params.id);
    var isvalid = await courseModel.checkStudentInCourse(req.session.authUser._id, req.params.id);
    console.log(isvalid);
  }
}