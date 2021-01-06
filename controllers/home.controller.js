const {
    LoadTenNewestCourses,
    loadTenViewCourses,
    getWeeklyCourse,
} = require('../models/course.model');

const { Mongoose } = require('mongoose');
const mongoose = require('mongoose');
const { insertExample, loadAllTeachers } = require('../models/teacher.model');
const categoryModel = require('../models/category.model');
const { loadAllCategories } = require('../models/category.model');
const { findRatingById } = require('../models/rating.model');
const courseModel = require('../models/course.model');

module.exports = {
    home: async function (req, res) {
        //await insertExample();
        try {
            var allCategories = await loadAllCategories();

            var tenNewestCourses = await LoadTenNewestCourses();

            for (var course of tenNewestCourses) {
                if (req.user) {
                    const result = await courseModel.checkStudentInCourse(
                        req.user._id,
                        course._id
                    );

                    if (result) {
                        if (result._id.toString() === course._id.toString()) {
                            course.isStudent = true;
                        }
                    }
                }
            }

            var tenViewCourses = await loadTenViewCourses();

            for (var course of tenViewCourses) {
                if (req.user) {
                    const result = await courseModel.checkStudentInCourse(
                        req.user._id,
                        course._id
                    );

                    if (result) {
                        if (result._id.toString() === course._id.toString()) {
                            course.isStudent = true;
                        }
                    }
                }
            }

            var fourWeeklyCourses = await getWeeklyCourse();

            for (var course of fourWeeklyCourses) {
                if (req.user) {
                    const result = await courseModel.checkStudentInCourse(
                        req.user._id,
                        course._id
                    );

                    if (result) {
                        if (result._id.toString() === course._id.toString()) {
                            course.isStudent = true;
                        }
                    }
                }
            }

            var tenWeeklyCategories = await categoryModel.loadTenWeeklyCategories();

            for (i of tenNewestCourses) {
                const avg = await courseModel.computeAvgRating(i._id);
                let avgRating = 0;
                if (avg[0]) {
                    avgRating = avg[0].avgRating;
                }
                //console.log(avgRating);
                i.avgRating = avgRating;
            }
        } catch (error) {
            throw Error(error);
        }

        res.render('home', {
            tenNewestCourses: tenNewestCourses,
            allCategories,
            tenViewCourses,
            fourWeeklyCourses,
            tenWeeklyCategories,
            layout: 'main2',
        });
    },
    videoTest: function (req, res) {
        res.render('videotest');
    },
};
