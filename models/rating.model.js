const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  _id: mongoose.ObjectId,
  courseId: mongoose.ObjectId,
  studentId: Array,
  rating: Number,
  date_rating: {Date, default: Date.now()},
});

const Rating = mongoose.model('Rating', schema, 'Rating');

module.exports = {
    
}