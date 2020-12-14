const { insertExample } = require('../models/course.model');
const Course = require('../models/course.model');
const toObject = require('../utils/toobject');

module.exports = {
    async allCourse(req, res) {
        //let allCourses = await Course.loadAllCourses();
        let page = +req.query.page || 1;
        let perPage = 4; //16
        let allCourses = await Course.loadLimitedCourses(perPage, page);
        let totalPage = allCourses.totalPages;
        // let begin = (page - 1) * perPage;
        // let end = (page * perPage);
        let pageBegin = (page >= 5?page - 4:1);
        let pageEnd = ((totalPage - page) >= 5?page + 4:totalPage);
        //allCourses = allCourses.slice(begin, end);
        console.log('-----------------------');
        let pageArr = [];
        for(let i = pageBegin; i <= pageEnd; i++)
        {
            pageArr.push(i);
        }
        res.render('course', {
            courses: toObject.multipleMongooseToObj(allCourses.docs),
            empty: (allCourses.length === 0),
            current: allCourses.page,
            pageArr: pageArr
        });
    },
    async insertExample(req, res) {
        await Course.insertExample();
        res.render('home');
    }
}