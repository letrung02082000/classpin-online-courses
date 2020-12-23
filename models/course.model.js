const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const schema = new Schema({
  _id: mongoose.ObjectId,
  name: String,
  short_description: String,
  description: String,
  thumbnail: String,
  price: Number,
  discount: Number,
  list_student: Array,
  teacher: mongoose.ObjectId,
  category: mongoose.ObjectId,  // id category
  date_created: { type: Date, default: Date.now },
});
schema.index({ '$**': 'text' });
schema.plugin(mongoosePaginate);

const Course = mongoose.model('Course', schema, 'Course');

module.exports = {
  async count() {
    return await Course.collection.countDocuments();
  },
  async loadCourses(query) {
    return await Course.find(query);
  },
  async loadLimitedCourses(perPage, page, query = {}, option = {}) {
    //return await Course.find().limit(perPage).skip((page - 1) * perPage);
    return await Course.paginate(query, { page: page, limit: perPage, lean: true, ...option });
  },
  async insertExample() {
    let arr = [{
      _id: mongoose.Types.ObjectId,
      name: 'Python Web Development',
      decription: 'Python Web Development',
      price: 10
    }, {
      _id: mongoose.Types.ObjectId,
      name: 'Nodejs',
      decription: 'Nodejs',
      price: 10
    }, {
      _id: mongoose.Types.ObjectId,
      name: 'Javascript',
      decription: 'Javascript',
      price: 20
    }];
    Course.collection.insertMany(arr);
  },
  findById(courseId) {
    return Course.findById(courseId).lean();
  },

  async checkStudentInCourse(studentId, courseId) {
    return Course.findOne({ _id: courseId, list_student: { $all: [mongoose.Types.ObjectId(studentId)] } });
  },
  async addCourse(course) {
    return Course.create(course);
  }
}