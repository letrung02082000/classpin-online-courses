const express = require('express');
const controller = require('../controllers/teacher.controller');
const multer = require('multer');
const passport = require('passport');
const requireTeacher = require('../middlewares/requireTeacher.mdw');

var upload = multer({ dest: 'public/uploads/teacher/' });


const router = express.Router();

//router.get('/', controller.dashboard);
router.get('/addCourse', requireTeacher.isTeacher, controller.addCourse);
router.post('/addCourse', requireTeacher.isTeacher, upload.single('thumbnail'), controller.postAddCourse);

router.get('/login', controller.getLogin);
router.post('/login', passport.authenticate('teacher-local', { failureRedirect: '/teacher/login', failureFlash: true }), controller.postLogin);

router.post('/logout', requireTeacher.isTeacher, controller.postLogout);

router.get('/dashboard', requireTeacher.isTeacher, controller.getDashboard);
router.get('/profile', requireTeacher.isTeacher, controller.getProfile);

router.post('/profile', requireTeacher.isTeacher, upload.single('avatar'), controller.postProfile);
router.get('/courses', requireTeacher.isTeacher, controller.allCourse);
router.get('/courses/:id', requireTeacher.isTeacher, controller.courseDetail);
router.get('/courses/:id/config', requireTeacher.isTeacher, controller.editCourse);
router.post('/courses/:id/config', requireTeacher.isTeacher, upload.single('thumbnail'), controller.postEditCourse);
router.get('/courses/:id/NewChapter', requireTeacher.isTeacher, controller.addChapter);
router.post('/courses/:id/NewChapter', requireTeacher.isTeacher, controller.postAddChapter);
router.get('/courses/:id/:chapter', requireTeacher.isTeacher, controller.chapterView);
router.get('/courses/:id/:chapter/AddLesson', requireTeacher.isTeacher, controller.addLesson);
var cpUpload = upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]);
router.post('/courses/:id/:chapter/AddLesson', requireTeacher.isTeacher, cpUpload, controller.postAddLesson);

module.exports = router;