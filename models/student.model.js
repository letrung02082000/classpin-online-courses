const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  namelogin: String,
  googleID: String,
  fullname: String,
  password: String,
  email: String,
  date_of_birth: String,
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

  findByGoogleID(googleID) {
    return Student.findOne({googleID: googleID});
  },

  findById(id) {
    return Student.findById(id).lean();
  },

  findOneAndUpdate(filter, update) {
    return Student.findOneAndUpdate(filter, update, {
      new: true,
    })
  }
  ///
}