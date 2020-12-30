const { LoadTenNewestCourses } = require('../models/course.model');
const { multipleMongooseToObj, mongooseToObj } = require('../utils/toobject');
const { Mongoose } = require('mongoose');
const { insertExample, loadAllTeachers } = require('../models/teacher.model');
const categoryModel = require('../models/teacher.model');
const { loadAllCategories } = require('../models/category.model');
const courseModel = require('../models/course.model');


module.exports = {
    home: async function (req, res) {
        //await insertExample();
        var allCategories = await loadAllCategories();

        allCategories = multipleMongooseToObj(allCategories);

        var tenNewestCourses = await LoadTenNewestCourses();
        //console.log(tenNewestCourses);
        //tenNewestCourses = multipleMongooseToObj(tenNewestCourses);
        for( i of tenNewestCourses) {
            const avg = await courseModel.computeAvgRating(i._id);
            let avgRating = 0;
                if(avg[0]) {
                avgRating = avg[0].avgRating;
            }
            //console.log(avgRating);
            i.avgRating = avgRating;
        }
        //console.log(tenNewestCourses);

        res.render('home', {
            tenNewestCourses: tenNewestCourses,
            allCategories,
        });
    },
};
