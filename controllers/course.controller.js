const { insertExample } = require('../models/course.model');
const toObject = require('../utils/toobject');
const courseModel = require('../models/course.model');
const studentModel = require('../models/student.model');
const ratingModel = require('../models/rating.model');
const paging = require('../utils/pagingOption');

module.exports = {
  async allCourse(req, res) {
    //let allCourses = await Course.loadAllCourses();
    let page = +req.query.page || 1;
    let perPage = 4; //16
    let allCourses = await courseModel.loadLimitedCourses(perPage, page);
    let totalPage = allCourses.totalPages;
    let pageArr = paging(page, totalPage);
    res.render('course', {
      //courses: toObject.multipleMongooseToObj(allCourses.docs),
      courses: allCourses.docs,
      empty: (allCourses.length === 0),
      pagingOption: {
        page: allCourses.page,
        pageArr: pageArr,
        next: allCourses.nextPage,
        pre: allCourses.prevPage
      },
      path: req.path
    });
  },
  async insertExample(req, res) {
    await courseModel.insertExample();
    res.render('home');
  },
  course: async function (req, res) {
    const matchedCourse = await courseModel.findById(req.params.id);
    console.log(matchedCourse.name);
    res.render('course/index', {
      course: matchedCourse
    })
  },
  rating: function (req, res) {
    res.render('course/rating', {
      layout: false,
    })
  },

  postRating: async function (req, res) {
    console.log(req.body);
    //const course = await courseModel.findById(req.params.id);
    var isvalid = await courseModel.checkStudentInCourse(req.session.authUser._id, req.params.id);
    console.log(isvalid);
  },
  async search(req, res) {
    let query = req.query.q || '';
    let sort = req.query.sort;
    let category = req.query.category;
    let page = +req.query.page || 1;
    let perPage = 4; //16
    console.log('Query: ' + req.query.q);
    let searchCourses = await courseModel.loadLimitedCourses(perPage, page, { $text: { $search: query } });
    let totalPage = searchCourses.totalPages;
    let pageArr = paging(page, totalPage);
    res.render('course', {
      courses: toObject.multipleMongooseToObj(searchCourses.docs),
      empty: (searchCourses.length === 0),
      pagingOption: {
        page: searchCourses.page,
        pageArr: pageArr,
        next: searchCourses.nextPage,
        pre: searchCourses.prevPage
      },
      path: req.path,
      query: `q=${req.query.q}`
    });
  }
}