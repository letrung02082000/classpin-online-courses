const mongoose = require('mongoose');
const fs = require('fs');

const Schema = mongoose.Schema;

const schema = new Schema({
  title: String,
  description: String,
  thumbnail: String,
  video: String,
  isFree: { type: Boolean, default: false },
})

const Lesson = mongoose.model('Lesson', schema, 'Lesson');

module.exports = {
  addLesson(lesson) {
    return Lesson.create(lesson);
  },
  findById(id) {
    return Lesson.findById(id).lean();
  },
  updateOne(filter, update) {
    return Lesson.findOneAndUpdate(filter, update);
  },
  async delete(id) {
    let lesson = await Lesson.findById(id);
    fs.unlink('.\\' + lesson.thumbnail, (e) => {
      console.log(e);
      return;
    });
    fs.unlink('.\\' + lesson.video, (e) => {
      console.log(e);
      return;
    });
    return Lesson.deleteOne({ _id: id });
  }
}