const express = require('express');
const passport = require('passport');

const controller = require('../controllers/admin.controller');
const requireAdmin = require('../middlewares/requireAdmin.mdw');
const router = express.Router();

router.get('/login', controller.getLogin);

router.post('/login', passport.authenticate('admin-local', { failureRedirect: '/admin/login', failureFlash: true }), controller.postLogin);

router.get('/dashboard', requireAdmin.isAdmin, controller.getDashboard);

router.get('/users', requireAdmin.isAdmin, controller.getUsers);
router.get('/users/:page', requireAdmin.isAdmin, controller.getUsers);

router.get('/courses', requireAdmin.isAdmin, controller.getCourses);

router.get('/category/AddTopCategory', requireAdmin.isAdmin, controller.addTopCategory);
router.get('/category/AddSubCategory', requireAdmin.isAdmin, controller.addSubCategory);
router.post('/category/AddTopCategory', requireAdmin.isAdmin, controller.postAddTopCategory);
router.post('/category/AddSubCategory', requireAdmin.isAdmin, controller.postAddSubCategory);
router.post('/category/delete', requireAdmin.isAdmin, controller.deleteCategory);
router.get('/category', requireAdmin.isAdmin, controller.showCategory);
router.get('/category/ChangeTopCategory/:id', requireAdmin.isAdmin, controller.changeTopCategory);
router.get('/category/ChangeSubCategory/:id', requireAdmin.isAdmin, controller.changeSubCategory);
router.post('/category/ChangeTopCategory/:id', requireAdmin.isAdmin, controller.postChangeTopCategory);
router.post('/category/ChangeSubCategory/:id', requireAdmin.isAdmin, controller.postChangeSubCategory);

module.exports = router;

