const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  namelogin: String,
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

  findByEmail(email) {
    return Student.findOne({email : email});
  },

  findByNameLogin(username) {
    return Student.findOne({namelogin: username});
  },

  findByGoogleID(googleID) {
    return Student.findOne({googleID: googleID});
  },

  findByFacebookID(facebookID) {
    return Student.findOne({facebookID: facebookID});
  },

  findById(id) {
    return Student.findById(id).lean();
  },

  findOneAndUpdate(filter, update) {
    return Student.findOneAndUpdate(filter, update, {
      new: true,
    })
  },

  findByNameloginOrEmail(value) {
    return Student.findOne({$or: [{namelogin: value}, {email: value}]});
  }
  ///
}