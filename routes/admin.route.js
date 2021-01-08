const express = require('express');
const passport = require('passport');

const controller = require('../controllers/admin.controller');
const requireAdmin = require('../middlewares/requireAdmin.mdw');
const router = express.Router();

router.get('/login', controller.getLogin);
router.post(
    '/login',
    passport.authenticate('admin-local', {
        failureRedirect: '/admin/login',
        failureMessage: true,
    }),
    controller.postLogin
);

router.post('/logout', requireAdmin.isAdmin, controller.postLogout);

router.get('/dashboard', requireAdmin.isAdmin, controller.getDashboard);

router.get('/students/:id', requireAdmin.isAdmin, controller.getDetailStudent);
router.get('/students', requireAdmin.isAdmin, controller.getStudents);
router.post('/students/del', requireAdmin.isAdmin, controller.deleteStudent);

router.get(
    '/teachers/create',
    requireAdmin.isAdmin,
    controller.getCreateTeacher
);
router.post(
    '/teachers/create',
    requireAdmin.isAdmin,
    controller.postCreateTeacher
);

router.post(
    '/teachers/del',
    requireAdmin.isAdmin,
    controller.postDeleteTeacher
);

router.get('/teachers', requireAdmin.isAdmin, controller.getTeachers);

router.get('/courses', requireAdmin.isAdmin, controller.getCourses);
router.post('/courses/del', requireAdmin.isAdmin, controller.postDeleteCourse);
router.get('/courses/:id', requireAdmin.isAdmin, controller.getDetailCourse);

router.get(
    '/category/AddTopCategory',
    requireAdmin.isAdmin,
    controller.addTopCategory
);
router.get(
    '/category/AddSubCategory',
    requireAdmin.isAdmin,
    controller.addSubCategory
);
router.post(
    '/category/AddTopCategory',
    requireAdmin.isAdmin,
    controller.postAddTopCategory
);
router.post(
    '/category/AddSubCategory',
    requireAdmin.isAdmin,
    controller.postAddSubCategory
);
router.post(
    '/category/delete',
    requireAdmin.isAdmin,
    controller.deleteCategory
);
router.get('/category', requireAdmin.isAdmin, controller.showCategory);
router.get(
    '/category/ChangeTopCategory/:id',
    requireAdmin.isAdmin,
    controller.changeTopCategory
);
router.get(
    '/category/ChangeSubCategory/:id',
    requireAdmin.isAdmin,
    controller.changeSubCategory
);
router.post(
    '/category/ChangeTopCategory/:id',
    requireAdmin.isAdmin,
    controller.postChangeTopCategory
);
router.post(
    '/category/ChangeSubCategory/:id',
    requireAdmin.isAdmin,
    controller.postChangeSubCategory
);

module.exports = router;
