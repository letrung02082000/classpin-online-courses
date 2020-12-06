const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  _id: mongoose.ObjectId,
});

const Class = mongoose.model('Class', schema, 'class');

module.exports = Class;