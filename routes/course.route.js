const express = require('express');
const controller = require('../controllers/course.controller');
const requireUser = require('../middlewares/requireUserLogin.middleware');


const router = express.Router();

router.get('/', controller.allCourse);
router.get('/insertEx', controller.insertExample);
router.get('/:id', controller.course);
router.get('/:id/rating',requireUser.requireUser, controller.rating);
router.post('/:id/rating', requireUser.requireUser, controller.postRating);

module.exports = router;