const mongoose = require('mongoose');
const { findById } = require('./course.model');


const Schema = mongoose.Schema;

const schema = new Schema({
  _id: mongoose.ObjectId,
  sub_category: Array, // id cac category con
  name: String,
  description: String,
});

const Category = mongoose.model('Category', schema, 'Category');

module.exports = {
  loadAllCategories() {
    return await Category.find({});
  },

  findById(categoryId){
    return Category.findById(categoryId).lean();
  }
}