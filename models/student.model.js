const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  _id: mongoose.ObjectId,
  namelogin: String,
  fullname: String,
  password: String,
  email: String,
  date_of_birth: Date,
  avatar: String,
  wishlist: Array, // ObjectId khoa hoc
});

const Student = mongoose.model('Student', schema, 'Student');

module.exports = {
  insertOne(student) {
    return Student.create(student);
  },

  findByNameLogin(username) {
    return Student.findOne({namelogin: username});
  },

  findById(id) {
    return Student.findById(id);
  }
  ///
}