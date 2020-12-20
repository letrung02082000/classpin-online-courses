const categoryModel = require('../models/category.model');
const mongoose = require('mongoose');

module.exports = {
  async addCourse(req, res) {
    let categories = await categoryModel.loadAll();

    console.log(categories);
    res.render('teacher/addCourse');
  }
}