const mongoose = require('mongoose');
const { findById } = require('./course.model');

const Schema = mongoose.Schema;

const schema = new Schema({
  _id: mongoose.ObjectId,
  namelogin: {String , required},
  fullname: {String, required},
  password: {String, required},
  email: String,
  phone: String,
  avatar: String,
  date_created: { type: Date, default: Date.now },
});

const Teacher = mongoose.model('Teacher', schema, 'Teacher');

module.exports = {
  loadAllTeachers() {
    return await Teacher.find({});
  },
  
  findById(teacherId){
    return Teacher.findById(teacherId).lean();
  }
}