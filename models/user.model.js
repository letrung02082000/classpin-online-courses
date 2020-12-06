const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  _id: mongoose.ObjectId,
  nameLogin: String,
  name: String,
  password: String,
  email: String,
  phone: String,
  avatar: String,
});

const User = mongoose.model('User', schema, 'user');

module.exports = User;