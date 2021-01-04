const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  title: String,
  description: String,
  thumbnail: String,
  video: String,
  isFree: {type: Boolean, default: false},
})

const Lesson = mongoose.model('Lesson', schema, 'Lesson');

module.exports = {

}