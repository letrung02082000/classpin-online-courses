const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const schema = new Schema({
  _id: mongoose.ObjectId,
  name: String,
  description: String,
  thumbnail: String,
  price: Number,
  discount: Number,
  list_student: Array,
  teacher: mongoose.ObjectId,
  category: mongoose.ObjectId,  // id category
  date_created: { type: Date, default: Date.now },
});

const Course = mongoose.model('Course', schema, 'Course');

module.exports = {
  findById(courseId) {
    return Course.findById(courseId).lean();
  },

  async checkStudentInCourse(studentId, courseId) {
    return Course.findOne({_id: courseId, list_student: {$all: [mongoose.Types.ObjectId(studentId)]}});
  }
}