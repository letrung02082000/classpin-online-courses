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
    last_updated: { type: Date, default: Date.now}
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
    return Course.findById(courseID)
      .populate([{ path: 'list_rating', populate: {path: 'student'}}])
      .populate({path: 'teacher'})
      .lean();
  },
  
  findCoursePurchased(studentID) {
    return Course.find({list_student: {$all : [mongoose.Types.ObjectId(studentID)]}}).lean();
  },
  // return a document nested in array have field avgRating, if empty array, avgRating = 0
  computeAvgRating(courseID) {
    return Course.aggregate([
      {$match: {_id: courseID}},
      {
        $lookup: {
          from: "Rating",
          localField: "list_rating",
          foreignField: "_id",
          as: "list_rating_info"
        }
      },
      {$project: { list_rating_info: 1}},
      {$unwind: "$list_rating_info"},
      {$group: {_id: "$_id", avgRating: {$avg: '$list_rating_info.rating'}}}
    ]);
  },

  // add ratingID to list_rating
  pushRatingIDToCourse(courseID, ratingID) {
    return Course.updateOne({_id: courseID}, {$addToSet : {list_rating : ratingID}});
  },
  
  countRatingsByLevel(courseID) {
    return Course.aggregate([
      {$match: {_id: courseID}},
      {
        $lookup: {
          from: "Rating",
          localField: "list_rating",
          foreignField: "_id",
          as: "list_rating_info"
        }
      },
      // {$project: { list_rating_info: 1}},
      // {$unwind: "$list_rating_info"},
      // {$match: {'list_rating_info.rating': level}},
      // {$count: 'count'}
      {$project: { list_rating_info: 1}},
      {$unwind: "$list_rating_info"},
      {$group: {_id: "$list_rating_info.rating", count: {$sum: 1}}}

      // {$group: {_id: "$_id", countRating: {$count: '$list_rating_info'}}}
    ])
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
          .limit(10).lean();
  },
}

