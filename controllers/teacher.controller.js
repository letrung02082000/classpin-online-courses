const categoryModel = require('../models/category.model');
const mongoose = require('mongoose');
const courseModel = require('../models/course.model');
const multer = require('multer');
const teacherModel = require('../models/teacher.model');
const chapterModel = require('../models/chapter.model');
const lessonModel = require('../models/lesson.model');
const studentModel = require('../models/student.model');

module.exports = {
    async addCourse(req, res) {
        let categories = await categoryModel.loadTopCategory();
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
        };
        if (req.file) {
            course.thumbnail = '\\' + req.file.path;
        }
        await courseModel.addCourse(course);
        res.redirect('/teacher/courses');
    },

    getLogin: function (req, res) {
        if (req.isAuthenticated() && req.user.type === 2) {
            // check if teacher already login
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
            about: req.body.about,
        };
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
  
  getDashboard: async function (req, res) {
        const totalCourse = await courseModel.findCourseOfTeacher(req.user._id);
        let totalStudent = 0;

        for (const course of totalCourse) {
            totalStudent += course.list_student.length;
        }

        res.render('teacher/dashboard', {
            layout: 'teacher',
            totalCourse: totalCourse.length,
            totalStudent,
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
      category: req.body.category,
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
  },
  chapterView: async function (req, res) {
    let chapter = await chapterModel.findById(req.params.chapter);
    if (!chapter) return;
    res.render('teacher/chapterView', {
      layout: 'teacher',
      chapter: chapter,
      courseId: req.params.id,
    });
  },
  addLesson: async function (req, res) {
    let chapter = await chapterModel.findById(req.params.chapter);
    if (!chapter) return;
    res.render('teacher/addLesson', {
      layout: 'teacher',
      chapterId: req.params.chapter,
      courseId: req.params.id,
    });
  },
  postAddLesson: async function (req, res) {
    let chapter = await chapterModel.findById(req.params.chapter);
    let course = await courseModel.findById(req.params.id);
    if (!chapter) return;
    let lesson = {
      _id: mongoose.Types.ObjectId(),
      title: req.body.title,
      description: req.body.description,
      thumbnail: course.thumbnail,
      isFree: req.body.isFree,
    };
    if (req.files['video']) {
      lesson.video = '\\' + req.files['video'][0].path;
    }
    if (req.files['thumbnail']) {
      lesson.thumbnail = '\\' + req.files['thumbnail'][0].path;
    }
    await lessonModel.addLesson(lesson);
    await chapterModel.updateOne({ _id: chapter._id }, { $addToSet: { list_lesson: lesson._id } });
    await courseModel.updateOne({ _id: req.params.id }, {});
    res.redirect(`/teacher/courses/${req.params.id}/${req.params.chapter}`);
  },
  editLesson: async function (req, res) {
    let lesson = await lessonModel.findById(req.params.lesson);
    if (!lesson) return;
    res.render('teacher/editLesson', {
      layout: 'teacher',
      lesson: lesson,
      courseId: req.params.id,
      chapterId: req.params.chapter,
    });
  },
  postEditLesson: async function (req, res) {
    let lesson = await lessonModel.findById(req.params.lesson);
    if (!lesson) return;
    let update = {
      title: req.body.title,
      description: req.body.description,
      isFree: (req.body.isFree === 'true' ? true : false),
    }
    if (req.files['video']) {
      update.video = '\\' + req.files['video'][0].path;
    }
    if (req.files['thumbnail']) {
      update.thumbnail = '\\' + req.files['thumbnail'][0].path;
    }
    await lessonModel.updateOne({ _id: lesson._id }, update);
    if (req.params.id) {
      await courseModel.updateOne({ _id: req.params.id }, {});
    }
    res.redirect(`/teacher/courses/${req.params.id}/${req.params.chapter}`);
  },
  postDeleteLesson: async function (req, res) {
    let lesson = await lessonModel.findById(req.body.id);
    if (!lesson) return;
    await lessonModel.delete(lesson._id);
    if (req.body.courseId) {
      await courseModel.updateOne({ _id: req.body.courseId }, {});
    }
    res.redirect(`/teacher/courses/${req.body.courseId}/${req.body.chapterId}`);
  },
  editChapter: async function (req, res) {
    let chapter = await chapterModel.findById(req.params.chapter);
    if (!chapter) return;
    res.render('teacher/editChapter', {
      layout: 'teacher',
      chapter: chapter,
      courseId: req.params.id,
    });
  },
  postEditChapter: async function (req, res) {
    let chapter = await chapterModel.findById(req.params.chapter);
    if (!chapter) return;
    let update = {
      title: req.body.title,
      description: req.body.description,
    }
    await chapterModel.updateOne({ _id: chapter._id }, update);
    if (req.params.id) {
      await courseModel.updateOne({ _id: req.params.id }, {});
    }
    res.redirect(`/teacher/courses/${req.params.id}`);
  },
  postDeleteChapter: async function (req, res) {
    let chapter = await chapterModel.findById(req.body.id);
    if (!chapter) return;
    for (i of chapter.list_lesson) {
      await lessonModel.delete(i._id);
    }
    await chapterModel.deleteOne(chapter._id);
    //res.redirect(`/teacher/courses/${req.params.id}`);
    res.redirect(req.headers.referrer || req.headers.referer);
  },
  toDashboard: function (req, res) {
    res.redirect('/teacher/dashboard');
  },
  previewVideo: async function (req, res) {
    let lesson = await lessonModel.findById(req.params.lesson);
    if (!lesson) return;
    res.render('teacher/previewVideo', {
      layout: 'teacher',
      lesson: lesson,
    });
  }
}
