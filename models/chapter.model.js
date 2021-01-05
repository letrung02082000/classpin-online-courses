const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  title: String,
  description: String,
  list_lesson: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
})

const Chapter = mongoose.model('Chapter', schema, 'Chapter');

module.exports = {
  deleteManyByListID(list_chapterID) {
    return Chapter.deleteMany({ _id: { $in: list_chapterID } });
  },
  addChapter(chapter) {
    return Chapter.create(chapter);
  },
  findById(chapterId) {
    return Chapter.findById(chapterId).populate('list_lesson').lean();
  },
  updateOne(filter, update) {
    return Chapter.findOneAndUpdate(filter, update);
  },
  deleteOne(id) {
    return Chapter.deleteOne({ _id: id });
  }
}