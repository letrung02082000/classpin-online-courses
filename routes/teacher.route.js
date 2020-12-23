const express = require('express');
const controller = require('../controllers/teacher.controller');
const multer = require('multer');
var upload = multer({ dest: 'public/uploads/courses/' })


const router = express.Router();

//router.get('/', controller.dashboard);
router.get('/addCourse', controller.addCourse);
router.post('/addCourse', upload.single('thumbnail'), controller.postAddCourse);



module.exports = router;