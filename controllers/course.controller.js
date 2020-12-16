const { insertExample } = require('../models/course.model');
const toObject = require('../utils/toobject');
const courseModel = require('../models/course.model');
const studentModel = require('../models/student.model');
const ratingModel = require('../models/rating.model');

module.exports = {
    async allCourse(req, res) {
        //let allCourses = await Course.loadAllCourses();
        let page = +req.query.page || 1;
        let perPage = 4; //16
        let allCourses = await courseModel.loadLimitedCourses(perPage, page);
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
        await courseModel.insertExample();
        res.render('home');
    },
  course: async function(req, res) {
    const matchedCourse = await courseModel.findById(req.params.id);
    console.log(matchedCourse.name);
    res.render('course/index', {
      course: matchedCourse
    })
  },
  rating: function(req, res) {
    res.render('course/rating', {
      layout: false,
    })
  },

  postRating: async function(req, res) {
    console.log(req.body);
    //const course = await courseModel.findById(req.params.id);
    var isvalid = await courseModel.checkStudentInCourse(req.session.authUser._id, req.params.id);
    console.log(isvalid);
  }
}