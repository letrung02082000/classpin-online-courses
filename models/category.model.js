const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const schema = new Schema({
  _id: mongoose.ObjectId,
  sub_category: Array, // id cac category con
  name: String,
  description: String,
});

const Category = mongoose.model('Category', schema, 'Category');

module.exports = {
  load() {
    
  }     
}