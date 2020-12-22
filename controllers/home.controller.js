const { LoadTenNewestCourses } = require('../models/course.model');
const { multipleMongooseToObj } = require('../utils/toobject');

module.exports = {
    home: async function (req, res) {
        const tenNewestCourses = await LoadTenNewestCourses();
        res.render('home', {
            tenNewestCourses: multipleMongooseToObj(tenNewestCourses),
        });
    },
};
