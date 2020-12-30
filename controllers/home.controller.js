const {
    LoadTenNewestCourses,
    loadTenViewCourses,
    getWeeklyCourse,
} = require('../models/course.model');
const { multipleMongooseToObj, mongooseToObj } = require('../utils/toobject');
const { Mongoose } = require('mongoose');
const mongoose = require('mongoose');
const { insertExample, loadAllTeachers } = require('../models/teacher.model');
const categoryModel = require('../models/teacher.model');
const { loadAllCategories } = require('../models/category.model');
const { findRatingById } = require('../models/rating.model');
const courseModel = require('../models/course.model');

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

            var fourWeeklyCourses = await getWeeklyCourse();

            fourWeeklyCourses = multipleMongooseToObj(fourWeeklyCourses);

            for (i of tenNewestCourses) {
                const avg = await courseModel.computeAvgRating(i._id);
                let avgRating = 0;
                if (avg[0]) {
                    avgRating = avg[0].avgRating;
                }
                //console.log(avgRating);
                i.avgRating = avgRating;
            }
            //console.log(tenNewestCourses);
        } catch (error) {
            throw Error(error);
        }

        res.render('home', {
            tenNewestCourses: tenNewestCourses,
            allCategories,
            tenViewCourses,
            fourWeeklyCourses,
            avgRating,
        });
    },
};
