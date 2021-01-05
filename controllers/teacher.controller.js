const categoryModel = require('../models/category.model');
const mongoose = require('mongoose');
const courseModel = require('../models/course.model');
const multer = require('multer');
const teacherModel = require('../models/teacher.model');
const chapterModel = require('../models/chapter.model');


module.exports = {
  async addCourse(req, res) {
    let categories = await categoryModel.loadTopCategory();
    console.log(categories);
    res.render('teacher/addCourse', {
      categories: categories,
      layout: 'teacher',
    });
  },
  async postAddCourse(req, res) {
    //courseModel.addCourse(req.body);
    let course = {
      _id: mongoose.Types.ObjectId(),
      name: req.body.title,
      short_description: req.body.shortDesciption,
      description: req.body.description,
      price: req.body.price,
      discount: req.body.discount,
      category: req.body.category,
      teacher: req.user._id,
    }
    if (req.file) {
      course.thumbnail = '\\' + req.file.path;
    }
    console.log(req.body);
    await courseModel.addCourse(course);
    console.log(course);
    res.redirect('/teacher/courses');
  },

  getLogin: function (req, res) {
    if (req.isAuthenticated() && req.user.type === 2) { // check if teacher already login
      res.redirect('/teacher/dashboard');
      return;
    }

    res.render('teacher/login', {
      layout: false,
      msg: req.flash(),
    });
  },

  postLogin: function (req, res) {
    res.redirect('/teacher/dashboard');
  },

  getProfile: function (req, res) {
    res.render('teacher/profile', {
      layout: 'teacher',
      authUser: req.user,
    });
  },

  postProfile: async function (req, res) {
    const filter = { _id: req.user._id };
    const update = {
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      about: req.body.about
    }
    console.log(update);
    if (req.file) {
      update.avatar = '\\' + req.file.path;
    }
    await teacherModel.updateOne(filter, update);
    res.redirect('/teacher/profile');
  },

  postLogout: function (req, res) {
    req.logout();
    res.redirect('/teacher/login');
  },

  getDashboard: function (req, res) {
    res.render('teacher/dashboard', {
      layout: 'teacher'
    });
  },
  allCourse: async function (req, res) {
    const courseList = await courseModel.findCourseOfTeacher(req.user._id);
    res.render('teacher/allCourse', {
      layout: 'teacher',
      courseList: courseList,
    });
  },
  courseDetail: async function (req, res) {
    const course = await courseModel.findAllChapterInCourse(req.params.id);
    if (!course) return;
    res.render('teacher/courseView', {
      layout: 'teacher',
      course: course,
    });
  },
  editCourse: async function (req, res) {
    const categories = await categoryModel.loadTopCategory();
    const course = await courseModel.findById(req.params.id);
    if (!course) return;
    res.render('teacher/configCourse', {
      layout: 'teacher',
      course: course,
      categories: categories
    });
  },
  postEditCourse: async function (req, res) {
    let edit = {
      name: req.body.title,
      short_description: req.body.shortDesciption,
      description: req.body.description,
      price: req.body.price,
      discount: req.body.discount,
      done: (req.body.done === 'true' ? true : false)
    };
    if (req.file) {
      edit.thumbnail = '\\' + req.file.path;
    }
    await courseModel.updateOne({ _id: req.params.id }, edit);
    res.redirect(`/teacher/courses/${req.params.id}`);
  },
  addChapter: async function (req, res) {
    let course = await courseModel.findById(req.params.id);
    if (!course) return;
    res.render('teacher/addChapter', {
      layout: 'teacher',
      courseId: req.params.id,
    });
  },
  postAddChapter: async function (req, res) {
    let course = await courseModel.findById(req.params.id);
    if (!course) return;
    let chapter = {
      _id: mongoose.Types.ObjectId(),
      title: req.body.title,
      description: req.body.description,
      list_lesson: [],
    };
    await chapterModel.addChapter(chapter);
    await courseModel.updateOne({ _id: course._id }, { $addToSet: { list_chapter: chapter._id } });
    res.redirect(`/teacher/courses/${course._id}`);
  }
}