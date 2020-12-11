const mongoose = require('mongoose');
const {mongo_url} = require('../config/main.config');

const Schema = mongoose.Schema;

const schema = new Schema({
  _id: mongoose.ObjectId,
  namelogin: {String , required},
  fullname: {String, required},
  password: {String, required},
  email: String,
  phone: String,
  avatar: String,
  wishlist: Array, // ObjectId khoa hoc
});

const Student = mongoose.model('Student', schema, 'Student');

module.exports = {
  load() {
  }     

  ///
}