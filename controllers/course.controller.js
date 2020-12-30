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
    var msg = "";
    if(req.query.status) {
      msg = req.query.status;
    }
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
    
    // check course in wishlist
    let isInWishList = false;
    if(req.user) {
      const checkwishlist = await studentModel.checkCourseInWishList(courseID, req.user._id);
      if(checkwishlist) {
        isInWishList = true;
      }
    }

    // rating list
    const ratingListQuery = await courseModel.countRatingsByLevel(matchedCourse._id);
    //console.log(ratingListQuery);
    const ratingObj = {
      level_1: 0,
      level_2: 0,
      level_3: 0,
      level_4: 0,
      level_5: 0,
      level_0: 0
    };
    for(i of ratingListQuery) {
      if(i._id === 5) {
        ratingObj.level_5 = i.count;
      }
      if(i._id === 4) {
        ratingObj.level_4 = i.count;
      }
      if(i._id === 3) {
        ratingObj.level_3 = i.count;
      }
      if(i._id === 2) {
        ratingObj.level_2 = i.count;
      }
      if(i._id === 1) {
        ratingObj.level_1 = i.count;
      }
      if(i._id === 0) {
        ratingObj.level_0 = i.count;
      }
    }

    

    //console.log(ratingObj);
    
    // compute avg rating
    const avg = await courseModel.computeAvgRating(matchedCourse._id);

    let avgRating = 0;
    if(avg[0]) {
      avgRating = avg[0].avgRating;
    }
    
    // total ratings
    let totalRating = 0;
    if(matchedCourse.list_rating) {
      totalRating = matchedCourse.list_rating.length;
    }

    // percent score
    const percent = {
      level_1: ratingObj.level_1*100/totalRating || 0,
      level_2: ratingObj.level_2*100/totalRating || 0,
      level_3: ratingObj.level_3*100/totalRating || 0,
      level_4: ratingObj.level_4*100/totalRating || 0,
      level_5: ratingObj.level_5*100/totalRating || 0,
      level_0: ratingObj.level_0*100/totalRating || 0,
    }

    //console.log(percent); 
    res.render('course/index', {
      course: matchedCourse,
      isMember: isMember,
      avgRating: Math.round(avgRating * 100) / 100, // value of avgRating
      totalRating: totalRating,
      amountStudent: matchedCourse.list_student.length,
      msg: msg,
      isInWishList: isInWishList,
      ratingList: ratingObj,
      percent: percent,
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
    let r = 0;
    if(req.body.rating) {
      r = req.body.rating;
    }
    if(!matchedCourse) {
      throw Error("No permission");
    } else {
      const newRating = {
        student: req.user._id,
        description: req.body.description,
        rating: +r,
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
  },

  addToWishList: async function(req, res) {
    const courseID = req.body.courseID;

    // add idcourse to wish list
    await studentModel.addCourseToWishList(courseID, req.user._id);
    console.log(req.header.referer);
    var msg = encodeURIComponent('addtowishlist');
    res.redirect('/course/' + courseID + '/?status=' + msg);
  },

  unWishList: async function(req, res) {
    const courseID = req.body.courseID;
    await studentModel.unWishList(courseID, req.user._id);
    var msg = encodeURIComponent('unwishlist');
    res.redirect('/course/' + courseID + '/?status=' + msg);
  }
}