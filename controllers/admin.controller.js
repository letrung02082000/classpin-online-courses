const bcrypt = require('bcryptjs');
const adminModel = require('../models/admin.model');

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
    getUsers: function (req, res) {
        res.render('admin/users', { layout: false });
    },
    getCategories: function (req, res) {
        res.render('admin/categories', { layout: false });
    },
};
