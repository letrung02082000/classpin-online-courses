const mongoose = require('mongoose');


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
  date_created: {Date, default: Date.now()},
});

const Student = mongoose.model('Student', schema, 'Student');

module.exports = {
  all() {
    return Student.find({});
  }     
}