const categoryModel = require('../models/category.model');
const mongoose = require('mongoose');

module.exports = {
  addTopCategory(req, res) {
    res.render('admin/addTopCategory');
  },
  async postAddTopCategory(req, res) {
    if (!req.body.name)
      return;
    let newCategory = {
      _id: mongoose.Types.ObjectId(),
      name: req.body.name,
      sub_category: [],
      description: req.body.description
    };
    let sub = {
      _id: mongoose.Types.ObjectId(),
      name: req.body.subName,
      sub_category: [],
      description: req.body.subDescription
    };
    newCategory.sub_category.push(sub._id);
    await categoryModel.addCategory(sub);
    await categoryModel.addCategory(newCategory);
    res.redirect('/admin/category');
  },
  async addSubCategory(req, res) {
    let cat = await categoryModel.loadTopCategory()
    res.render('admin/addSubCategory', {
      categories: cat
    });
  },
  async postAddSubCategory(req, res) {
    if (!req.body.name)
      return;
    let newCategory = {
      _id: mongoose.Types.ObjectId(),
      name: req.body.name,
      sub_category: [],
      description: req.body.description
    };
    await categoryModel.addCategory(newCategory);
    await categoryModel.addSubCategory(newCategory._id, req.body.topCategoryId);
    res.redirect('/admin/category');
  },
  async deleteCategory(req, res) {
    let cat = await categoryModel.selectFromOneId(req.body.categoryId);
    if (!cat)
      return;
    if (cat.sub_category.length === 0) {
      let categories = await categoryModel.loadAllCategories();
      for (let i = 0; i < categories.length; i++) {
        let index = categories[i].sub_category.indexOf(req.body.categoryId)
        if (index >= 0) {
          categories[i].sub_category.splice(index, 1);
          await categories[i].save();
        }
      }
    }
    await categoryModel.deleteOneCategory(req.body.categoryId);
    res.redirect('/admin/category');
  },
  async showCategory(req, res) {
    let cat = await categoryModel.loadAll();
    res.render('admin/category', {
      categories: cat,
      empty: (cat.length === 0)
    });
  }
}