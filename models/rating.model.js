const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  courseId: mongoose.ObjectId,
  studentId: Array,
  description: String,
  rating: Number,
  date_rating: { type: Date, default: Date.now },
});

const Rating = mongoose.model('Rating', schema, 'Rating');

module.exports = {
  insertOne(rating) {
    return Rating.create(rating);
  }
}