const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const schema = new Schema({
    _id: mongoose.ObjectId,
    name: String,
    description: String,
    short_description: String,
    thumbnail: String,
    price: Number,
    discount: Number,
    list_student: [{type: Schema.Types.ObjectId, ref: 'Student'}],
    list_rating: [{type: Schema.Types.ObjectId, ref: 'Rating'}],
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // id category
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

  // return rating embeded in list_rating of course
  findAllRatingOfCourse(courseID) {
    return Course.findById(courseID).populate([{ path: 'list_rating', populate: {path: 'student'}}]).lean();
  },

  // add ratingID to list_rating
  pushRatingIDToCourse(courseID, ratingID) {
    return Course.updateOne({_id: courseID}, {$addToSet : {list_rating : ratingID}});
  },

  //return course if exists student
  async checkStudentInCourse(studentId, courseId) {
    return Course.findOne({ _id: courseId, list_student: { $all: [mongoose.Types.ObjectId(studentId)] } });
  },
  async addCourse(course) {
    return Course.create(course);
  },
  async LoadTenNewestCourses() {
      return await Course.find({})
          .populate('teacher', 'fullname')
          .populate('category', 'name')
          .sort({ date_created: 1 })
          .limit(10);
  },
}

