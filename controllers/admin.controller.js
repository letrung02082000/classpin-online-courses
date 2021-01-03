const bcrypt = require('bcryptjs');
const adminModel = require('../models/admin.model');
const studentModel = require('../models/student.model');
const categoryModel = require('../models/category.model');
const teacherModel = require('../models/teacher.model');
const mongoose = require('mongoose');
const courseModel = require('../models/course.model');

function isAdmin(id) {}

module.exports = {
    getLogin: function (req, res) {
        //console.log(req.user);
        if (req.isAuthenticated() && req.user.type === 1) {
            // check if admin already login
            res.redirect('/admin/dashboard');
            return;
        }
        res.render('admin/login', {
            layout: false,
            msg: req.flash(),
        });
    },

    postLogin: function (req, res) {
        res.redirect('/admin/dashboard');
    },

    getDashboard: function (req, res) {
        res.render('admin/dashboard', { layout: false });
    },

    getCourses: async function (req, res) {
        const courses = await courseModel.loadAllCourses();
        res.render('admin/courses', { layout: false, courses });
    },

    getStudents: async function (req, res) {
        const perPage = 10;
        const page = req.params.page || 1;

        const students = await studentModel.getStudent(perPage, page);
        const studentCount = await studentModel.countStudent();

        res.render('admin/student', {
            layout: false,
            studentList: students,
            current: page,
            pages: Math.ceil(studentCount / perPage),
        });
    },

    getTeachers: async function (req, res) {
        const teachers = await teacherModel.loadAllTeachers();

        res.render('admin/teacher', {
            layout: false,
            teacherList: teachers,
        });
    },

    getCreateTeacher: function (req, res) {
        res.render('admin/createTeacher', { layout: false });
    },

    postCreateTeacher: async function (req, res) {
        const teacher = {
            namelogin: req.body.username,
            fullname: req.body.fullname,
            password: bcrypt.hashSync(req.body.password, 10),
        };

        await teacherModel.addTeacher(teacher);
        res.redirect('/admin/teachers');
    },

    getCategories: function (req, res) {
        res.render('admin/categories', { layout: false });
    },

    addTopCategory(req, res) {
        res.render('admin/addTopCategory');
    },

    async postAddTopCategory(req, res) {
        if (!req.body.name) return;
        let newCategory = {
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            sub_category: [],
            description: req.body.description,
        };
        let sub = {
            _id: mongoose.Types.ObjectId(),
            name: req.body.subName,
            sub_category: [],
            description: req.body.subDescription,
        };
        newCategory.sub_category.push(sub._id);
        await categoryModel.addCategory(sub);
        await categoryModel.addCategory(newCategory);
        res.redirect('/admin/category');
    },

    async addSubCategory(req, res) {
        let cat = await categoryModel.loadTopCategory();
        res.render('admin/addSubCategory', {
            categories: cat,
        });
    },

    async postAddSubCategory(req, res) {
        if (!req.body.name) return;
        let newCategory = {
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            sub_category: [],
            description: req.body.description,
        };
        await categoryModel.addCategory(newCategory);
        await categoryModel.addSubCategory(
            newCategory._id,
            req.body.topCategoryId
        );
        res.redirect('/admin/category');
    },

    async deleteCategory(req, res) {
        let cat = await categoryModel.selectFromOneId(req.body.categoryId);
        if (!cat) return;
        if (cat.sub_category.length === 0) {
            let categories = await categoryModel.loadAllCategories();
            for (let i = 0; i < categories.length; i++) {
                let index = categories[i].sub_category.indexOf(
                    req.body.categoryId
                );
                if (index >= 0) {
                    categories[i].sub_category.splice(index, 1);
                    await categories[i].save();
                }
            }
        }
        await categoryModel.deleteOneCategory(req.body.categoryId);
        res.redirect('/admin/category');
    },

    async showCategory(req, res) {
        let cat = await categoryModel.loadAll();
        res.render('admin/category', {
            categories: cat,
            empty: cat.length === 0,
        });
    },
};
