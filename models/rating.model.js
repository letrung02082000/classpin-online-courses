const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  student: {type: Schema.Types.ObjectId, ref: 'Student'},
  description: String,
  rating: Number,
  date_rating: { type: Date, default: Date.now },
});

const Rating = mongoose.model('Rating', schema, 'Rating');

module.exports = {
  insertOne(rating) {
    return Rating.create(rating);
  },
  findMany(filter) {
    return Rating.find(filter);
  }
}