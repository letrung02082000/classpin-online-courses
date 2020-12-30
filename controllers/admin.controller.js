const bcrypt = require('bcryptjs');
const adminModel = require('../models/admin.model');
const studentModel = require('../models/student.model');

module.exports = {
    getLogin: function (req, res) {
        res.render('admin/login', { layout: false });
    },

    postLogin: async function (req, res) {
        const username = req.body.username;
        const password = req.body.password;
    },

    getDashboard: function (req, res) {
        res.render('admin/dashboard', { layout: false });
    },
    getCourses: function (req, res) {
        res.render('admin/courses', { layout: false });
    },
    getUsers: async function (req, res) {
        const perPage = 10;
        const page = req.params.page || 1;

        const students = await studentModel.getStudent(perPage, page);
        console.log(students);
        const studentCount = await studentModel.countStudent();

        res.render('admin/student', {
            layout: false,
            studentList: students,
            current: page,
            pages: Math.ceil(studentCount / perPage),
        });
    },
    getCategories: function (req, res) {
        res.render('admin/categories', { layout: false });
    },
};
