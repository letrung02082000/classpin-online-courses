const categoryModel = require('../models/category.model');
const mongoose = require('mongoose');
const courseModel = require('../models/course.model');

module.exports = {
  async addCourse(req, res) {
    let categories = await categoryModel.loadTopCategory();
    console.log(categories);
    res.render('teacher/addCourse', {
      categories: categories
    });
  },
  async postAddCourse(req, res) {
    //courseModel.addCourse(req.body);
    let course = {
      _id: mongoose.Types.ObjectId(),
      name: req.body.title,
      short_description: req.body.shortDesciption,
      description: req.body.description,
      thumbnail: req.file.path,
      price: req.body.price,
      category: req.body.category,
    }
    console.log(req.body);
    await courseModel.addCourse(course);
    console.log(course);
    res.redirect('/course');
  }
}