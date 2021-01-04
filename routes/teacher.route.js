const express = require('express');
const controller = require('../controllers/teacher.controller');
const multer = require('multer');
const passport = require('passport');
const requireTeacher = require('../middlewares/requireTeacher.mdw');

var upload = multer({ dest: 'public/uploads/courses/' })


const router = express.Router();

//router.get('/', controller.dashboard);
router.get('/addCourse', controller.addCourse);
router.post('/addCourse', upload.single('thumbnail'), controller.postAddCourse);

router.get('/login', controller.getLogin);
router.post('/login', passport.authenticate('teacher-local', {failureRedirect: '/teacher/login', failureFlash: true}), controller.postLogin);

router.post('/logout', requireTeacher.isTeacher, controller.postLogout);

router.get('/dashboard', requireTeacher.isTeacher, controller.getDashboard);

module.exports = router;