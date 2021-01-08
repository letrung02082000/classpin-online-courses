const express = require('express');
const controller = require('../controllers/course.controller');
const requireUser = require('../middlewares/requireUserLogin.middleware');


const router = express.Router();

router.get('/', controller.allCourse);
router.get('/insertEx', controller.insertExample);
router.get('/search', controller.search);
router.get('/:id', controller.course);
router.get('/:id/rating', requireUser.requireUser, controller.rating);
router.post('/:id/rating', requireUser.requireUser, controller.postRating);
router.get('/:id/:lessonId', requireUser.requireUser, controller.viewLesson);
router.post('/wishlist', requireUser.requireUser, controller.addToWishList);
router.post('/unwishlist', requireUser.requireUser, controller.unWishList);

module.exports = router;