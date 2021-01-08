const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  student: Schema.Types.ObjectId,
  list_lesson: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
})

const Progress = mongoose.model('Progress', schema, 'Progress');

module.exports = {
  find(query) {
    return Progress.find(query);
  },
  add(progress) {
    return Progress.create(progress);
  }
}