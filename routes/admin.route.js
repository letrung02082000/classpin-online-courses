const express = require('express');
const controller = require('../controllers/admin.controller');
const router = express.Router();

router.get('/login', controller.getLogin);
router.post('/login', controller.postLogin);
router.get('/dashboard', controller.getDashboard);
router.get('/users', controller.getUsers);
router.get('/courses', controller.getCourses);
router.get('/categories', controller.getCategories);

module.exports = router;
