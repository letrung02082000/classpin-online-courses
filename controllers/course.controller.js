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
    const courseID = req.params.id;
    const matchedCourse = await courseModel.findAllRatingOfCourse(courseID);
    //checkout user was a member in course
    let isMember = false;
    if(req.user) {
      const check = await courseModel.checkStudentInCourse(req.user._id, courseID);
      if(check) {
        isMember = true;
      }
    }
    
    res.render('course/index', {
      course: matchedCourse,
      isMember: isMember,
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
    const idCourse = req.params.id;
    // check student in course
    var matchedCourse = await courseModel.checkStudentInCourse(req.user._id, idCourse);
    console.log(matchedCourse);

    if(!matchedCourse) {
      throw Error("No permission");
    } else {
      const newRating = {
        student: req.user._id,
        description: req.body.description,
        rating: +req.body.rating,
      }

      // insert new rating to MONGODB
      const rating = await ratingModel.insertOne(newRating);
      
      // add ratingID to course
      await courseModel.pushRatingIDToCourse(matchedCourse._id, rating._id);
      console.log(rating);
      res.redirect('/course/' + idCourse);
    }
  },
  async search(req, res) {
    let query = req.query.q || '';
    let sort = req.query.sort;
    let category = req.query.category;
    let page = +req.query.page || 1;
    let perPage = 4; //16
    console.log('Query: ' + req.query.q);
    let option = {};
    if (sort === 'price') {
      option.sort = {
        price: 'asc'
      };
    }
    let searchCourses = await courseModel.loadLimitedCourses(perPage, page, { $text: { $search: query } }, option);
    let totalPage = searchCourses.totalPages;
    let pageArr = paging(page, totalPage);
    res.render('course', {
      courses: searchCourses.docs,
      empty: (searchCourses.docs.length === 0),
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