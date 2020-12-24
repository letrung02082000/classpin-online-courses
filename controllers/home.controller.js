const {
    LoadTenNewestCourses,
    loadTenViewCourses,
} = require('../models/course.model');
const { multipleMongooseToObj, mongooseToObj } = require('../utils/toobject');
const { Mongoose } = require('mongoose');
const mongoose = require('mongoose');
const { insertExample, loadAllTeachers } = require('../models/teacher.model');
const categoryModel = require('../models/teacher.model');
const { loadAllCategories } = require('../models/category.model');
const { findRatingById } = require('../models/rating.model');

module.exports = {
    home: async function (req, res) {
        //await insertExample();
        try {
            var allCategories = await loadAllCategories();

            allCategories = multipleMongooseToObj(allCategories);

            var tenNewestCourses = await LoadTenNewestCourses();

            tenNewestCourses = multipleMongooseToObj(tenNewestCourses);

            var tenViewCourses = await loadTenViewCourses();

            tenViewCourses = multipleMongooseToObj(tenViewCourses);
        } catch (error) {
            console.log(error);
        }

        res.render('home', {
            tenNewestCourses: tenNewestCourses,
            allCategories,
            tenViewCourses,
        });
    },
};
