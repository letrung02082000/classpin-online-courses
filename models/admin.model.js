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
  date_created: {Date, default: Date.now()},
});

const Admin = mongoose.model('Admin', schema, 'Admin');

module.exports = {
  load() {
    
  }     
}