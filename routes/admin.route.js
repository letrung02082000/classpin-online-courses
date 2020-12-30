const express = require('express');
const controller = require('../controllers/admin.controller');
const router = express.Router();

router.get('/login', controller.getLogin);

router.post('/login', controller.postLogin);

router.get('/dashboard', controller.getDashboard);

router.get('/users', controller.getUsers);
router.get('/users/:page', controller.getUsers);

router.get('/courses', controller.getCourses);

router.get('/category/AddTopCategory', controller.addTopCategory);
router.get('/category/AddSubCategory', controller.addSubCategory);
router.post('/category/AddTopCategory', controller.postAddTopCategory);
router.post('/category/AddSubCategory', controller.postAddSubCategory);
router.post('/category/delete', controller.deleteCategory);
router.get('/category', controller.showCategory);

module.exports = router;

module.exports = router;
