const controller = require('../controllers/course.controller');
const express = require('express');
const router = express.Router();

router.get('/', controller.allCourse);
router.get('/insertEx', controller.insertExample);

module.exports = router;