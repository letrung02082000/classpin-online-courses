const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const schema = new Schema({
  _id: mongoose.ObjectId,
  sub_category: Array, // id cac category con
  name: String,
  description: String,
});

schema.plugin(paginate);

const Category = mongoose.model('Category', schema, 'Category');

module.exports = {
  async selectFromOneId(id) {
    return await Category.findById(id);
  },
  async loadAll(name) {
    return await Category.find().populate('sub_category');
  }
}