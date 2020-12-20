const express = require('express');
const controller = require('../controllers/teacher.controller');



const router = express.Router();

//router.get('/', controller.dashboard);
router.get('/addCourse', controller.addCourse);



module.exports = router;