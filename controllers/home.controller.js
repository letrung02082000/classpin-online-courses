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
            // var menuCategory = [];
            // var subMenuCategoryId = [];

            // for (const category of allCategories) {
            //     if (category.sub_category.length != 0) {
            //         category.hasSub = true;
            //         menuCategory.push(category);
            //     }
            // }

            // for (const category of menuCategory) {
            //     var subCategories = [];
            //     for (const subCategoryId of category.sub_category) {
            //         const subCategory = await categoryModel.findById(
            //             category.sub_category
            //         );
            //         subMenuCategoryId.push(subCategoryId.toString());
            //         subCategories.push(subCategory);
            //     }
            //     category.sub_category = subCategories;
            // }

            // for (const category of allCategories) {
            //     if (category.sub_category.length != 0) {
            //         continue;
            //     }

            //     if (subMenuCategoryId.includes(category._id.toString())) {
            //         continue;
            //     }

            //     menuCategory.push(category);
            // }

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
                const discount = course.discount || 0;
                course.salePrice = course.price * (1 - discount / 100);
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
                const discount = course.discount || 0;
                course.salePrice = course.price * (1 - discount / 100);
            }

            var fourWeeklyCourses = await getWeeklyCourse();
            console.log(fourWeeklyCourses);

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
                const discount = course.discount || 0;
                course.salePrice = course.price * (1 - discount / 100);
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

            for (i of tenViewCourses) {
                const avg = await courseModel.computeAvgRating(i._id);
                let avgRating = 0;
                if (avg[0]) {
                    avgRating = avg[0].avgRating;
                }
                //console.log(avgRating);
                i.avgRating = avgRating;
            }

            for (i of fourWeeklyCourses) {
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
            tenNewestCourses,
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
