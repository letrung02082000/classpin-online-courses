const {
    updateWeekView,
    increaseCourseView,
} = require('../models/course.model');
const { getMonday } = require('../utils/getMonday');
const courseModel = require('../models/course.model');
const studentModel = require('../models/student.model');
const chapterModel = require('../models/chapter.model');
const LessonModel = require('../models/lesson.model');
const ratingModel = require('../models/rating.model');
const paging = require('../utils/pagingOption');
const categoryModel = require('../models/category.model');
const lessonModel = require('../models/lesson.model');
const progressModel = require('../models/progress.model');

module.exports = {
    async allCourse(req, res) {
        //let allCourses = await Course.loadAllCourses();
        let page = +req.query.page || 1;
        let perPage = 4; //16
        let allCourses = await courseModel.loadLimitedCourses(perPage, page);
        let totalPage = allCourses.totalPages;
        let pageArr = paging(page, totalPage);
        for (const course of allCourses.docs) {
            const discount = course.discount || 0;
            course.salePrice = course.price * (1 - discount / 100);
        }
        res.render('course', {
            //courses: toObject.multipleMongooseToObj(allCourses.docs),
            courses: allCourses.docs,
            empty: allCourses.length === 0,
            pagingOption: {
                page: allCourses.page,
                pageArr: pageArr,
                next: allCourses.nextPage,
                pre: allCourses.prevPage,
            },
            path: req.baseUrl,
            query: req.query,
            categoryTitle: 'All Categories',
        });
    },
    async insertExample(req, res) {
        await courseModel.insertExample();
        res.render('home');
    },

    course: async function (req, res) {
        let msg = '';
        if (req.query.status) {
            msg = req.query.status;
        }
        const courseID = req.params.id;

        //trung calculate view
        await increaseCourseView(courseID);
        const course = await courseModel.findById(courseID);
        var lastView = new Date(course.last_view);
        const mondayDate = getMonday();

        if (lastView < mondayDate) {
            await courseModel.resetWeekView(courseID);
            await updateWeekView(courseID);
        } else {
            await updateWeekView(courseID);
        }

        //trung find 5 courses in same category
        var fiveRelatedCourses = [];
        if (course.category) {
            const relatedCourses = await courseModel.findRelatedCourse(
                course.category
            );

            for (const course of relatedCourses) {
                var relatedCourse = await courseModel.findById(course._id);
                if (course._id.toString() === courseID.toString()) continue;
                const discount = relatedCourse.discount || 0;
                relatedCourse.salePrice =
                    relatedCourse.price * (1 - discount / 100);
                fiveRelatedCourses.push(relatedCourse);
            }
        }

        for (const course of fiveRelatedCourses) {
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

        const matchedCourse = await courseModel.findAllRatingOfCourse(courseID);
        const discount = matchedCourse.discount || 0;
        matchedCourse.salePrice = matchedCourse.price * (1 - discount / 100);

        //checkout user was a member in course
        let isMember = false;
        if (req.user) {
            const check = await courseModel.checkStudentInCourse(
                req.user._id,
                courseID
            );
            if (check) {
                isMember = true;
            }
        }
        
        // check user rating this course before
        // check student had feedback before
        let isRating = false;
        if(req.user) {
            for(i of matchedCourse.list_rating) {
                if(i.student._id.toString() === req.user._id.toString()) {
                    isRating = true;
                }
            }
        }
        

        // check course in wishlist
        let isInWishList = false;
        if (req.user) {
            const checkwishlist = await studentModel.checkCourseInWishList(
                courseID,
                req.user._id
            );
            if (checkwishlist) {
                isInWishList = true;
            }
        }

        // rating list
        const ratingListQuery = await courseModel.countRatingsByLevel(
            matchedCourse._id
        );
        //console.log(ratingListQuery);
        const ratingObj = {
            level_1: 0,
            level_2: 0,
            level_3: 0,
            level_4: 0,
            level_5: 0,
            level_0: 0,
        };
        for (i of ratingListQuery) {
            if (i._id === 5) {
                ratingObj.level_5 = i.count;
            }
            if (i._id === 4) {
                ratingObj.level_4 = i.count;
            }
            if (i._id === 3) {
                ratingObj.level_3 = i.count;
            }
            if (i._id === 2) {
                ratingObj.level_2 = i.count;
            }
            if (i._id === 1) {
                ratingObj.level_1 = i.count;
            }
            if (i._id === 0) {
                ratingObj.level_0 = i.count;
            }
        }

        //console.log(ratingObj);

        // compute avg rating
        const avg = await courseModel.computeAvgRating(matchedCourse._id);
        let avgRating = 0;
        if (avg[0]) {
            avgRating = avg[0].avgRating;
        }

        // total ratings
        let totalRating = 0;
        if (matchedCourse.list_rating) {
            totalRating = matchedCourse.list_rating.length;
        }

        // percent score
        const percent = {
            level_1: (ratingObj.level_1 * 100) / totalRating || 0,
            level_2: (ratingObj.level_2 * 100) / totalRating || 0,
            level_3: (ratingObj.level_3 * 100) / totalRating || 0,
            level_4: (ratingObj.level_4 * 100) / totalRating || 0,
            level_5: (ratingObj.level_5 * 100) / totalRating || 0,
            level_0: (ratingObj.level_0 * 100) / totalRating || 0,
        };

        //console.log(percent);
        // list chapter in course
        const returnCourse = await courseModel.findAllChapterInCourse(
            matchedCourse._id
        );
        //console.log(returnCourse.list_chapter);

        // check lesson in progress
        if(req.user) {
            progress = await progressModel.findOne({student: req.user._id});
            if(process) {
                for(chapter of returnCourse.list_chapter) {
                    for(lesson of chapter.list_lesson) {
                        for(i of progress.list_lesson) {
                            if(lesson._id.toString() === i._id.toString()) {
                                lesson.inProgress = true;
                            }
                        }
                    }
                }
            }
            
        }

        //find all course of teacher
        const courseOfTeacher = await courseModel.findCourseOfTeacher(
            matchedCourse.teacher._id
        );
        // count students of teacher
        let studentsOfTeacher = 0;
        let countReviewTeacher = 0;
        let avgRatingTeacher = 0;
        var c;
        for (i of courseOfTeacher) {
            studentsOfTeacher += i.list_student.length;
            countReviewTeacher += i.list_rating.length;
            c = await courseModel.computeAvgRating(i._id);
            if (c[0]) {
                avgRatingTeacher += c[0].avgRating;
            }
        }

        //console.log(avgRatingTeacher);

        // compute avg rating start of 5 related course
        for (i of fiveRelatedCourses) {
            const avg = await courseModel.computeAvgRating(i._id);
            let avgRating = 0;
            if (avg[0]) {
                avgRating = avg[0].avgRating;
            }
            //console.log(avgRating);
            i.avgRating = avgRating;
        }

        console.log(isRating);
        res.render('course/index', {
            _id: courseID,
            course: matchedCourse,
            isMember: isMember,
            avgRating: Math.round(avgRating * 100) / 100, // value of avgRating
            totalRating: totalRating,
            amountStudent: matchedCourse.list_student.length,
            msg: msg,
            isInWishList: isInWishList,
            ratingList: ratingObj,
            percent: percent,
            chapterList: returnCourse.list_chapter,
            courseOfTeacher: courseOfTeacher,
            studentsOfTeacher: studentsOfTeacher,
            countReviewTeacher: countReviewTeacher,
            avgRatingTeacher:
                Math.round((avgRatingTeacher / countReviewTeacher) * 100) / 100,
            fiveRelatedCourses,
            isRating: isRating
        });
    },
    rating: function (req, res) {
        res.render('course/rating', {
            layout: false,
        });
    },

    postRating: async function (req, res) {
        //console.log(req.body);
        //const course = await courseModel.findById(req.params.id);
        const idCourse = req.params.id;
        // check student in course
        var matchedCourse = await courseModel.checkStudentInCourse(
            req.user._id,
            idCourse
        );
        //console.log(matchedCourse);
        let r = 0;
        if (req.body.rating) {
            r = req.body.rating;
        }
        if (!matchedCourse) {
            throw Error('No permission');
        } else {
            // check student had feedback before
            for(i of matchedCourse.list_rating) {
                if(i.student.toString() === req.user._id.toString()) {
                    let msg = encodeURIComponent('ratingExist')
                    res.redirect('/course/' + matchedCourse._id + '/status=' + msg);
                    return;
                }
            }
            
            const newRating = {
                student: req.user._id,
                description: req.body.description,
                rating: +r,
            };

            // insert new rating to MONGODB
            const rating = await ratingModel.insertOne(newRating);

            // add ratingID to course
            await courseModel.pushRatingIDToCourse(
                matchedCourse._id,
                rating._id
            );
            console.log(rating);
            res.redirect('/course/' + idCourse);
        }
    },
    async search(req, res) {
        let query = req.query.q;
        let sort = req.query.sort || "";
        let category = req.query.category || "";
        let page = +req.query.page || 1;
        let perPage = 4; //16
        console.log('Query: ' + req.query.q);
        let option = {};
        if (sort === 'price') {
            option.sort = {
                price: 'asc',
            };
        }
        let cond = {};
        if (query !== "") {
            cond.$text = { $search: query };
        }
        if (category !== "" && category !== "all") {
            cond.category = category;
        }
        var searchCourses = await courseModel.loadLimitedCourses(
            perPage,
            page,
            cond,
            option
        );
        let totalPage = searchCourses.totalPages;
        let pageArr = paging(page, totalPage);
        res.render('course', {
            courses: searchCourses.docs,
            empty: searchCourses.docs.length === 0,
            pagingOption: {
                page: searchCourses.page,
                pageArr: pageArr,
                next: searchCourses.nextPage,
                pre: searchCourses.prevPage,
            },
            path: req.path,
            q: req.query,
            query: `q=${req.query.q}&category=${req.query.category}&sort=${req.query.sort}`,
        });
    },

    addToWishList: async function (req, res) {
        const courseID = req.body.courseID;

        // add idcourse to wish list
        await studentModel.addCourseToWishList(courseID, req.user._id);
        console.log(req.header.referer);
        var msg = encodeURIComponent('addtowishlist');
        res.redirect('/course/' + courseID + '/?status=' + msg);
    },

    unWishList: async function (req, res) {
        const courseID = req.body.courseID;
        await studentModel.unWishList(courseID, req.user._id);
        var msg = encodeURIComponent('unwishlist');
        res.redirect('/course/' + courseID + '/?status=' + msg);
    },
    viewLesson: async function (req, res) {
        let lesson = await lessonModel.findById(req.params.lessonId);
        if (!lesson) return;
        if(lesson.isFree === false) {
          // check student in course
            let isMember = false;
            const check = await courseModel.checkStudentInCourse(
                req.user._id,
                req.params.id
            );
            if (check) {
                isMember = true;
            }
            if(isMember === false) {
                var msg = encodeURIComponent('noPermission')
                res.redirect('/course/' + req.params.id + '/?status=' + msg);
                return;
            }
        }
        let course = await courseModel.findById(req.params.id);
        if(req.user) {
            let progress = await progressModel.find({ student: req.user._id });
            //console.log(progress);
            if (progress.length === 0) {
                let newProgress = {
                    student: req.user._id,
                    list_lesson: [lesson._id],
                };
                await progressModel.add(newProgress);
            } else {
                //console.log(lesson._id);
                let isExisted = false;
                for(i of progress[0].list_lesson) {
                    if(i.toString() === lesson._id.toString()) {
                        isExisted = true;
                    }
                }
                //console.log(isExisted);
                if(!isExisted) {
                    progress[0].list_lesson.push(lesson._id);
                    progress[0].save();
                }
            }
        }
        

        // list chapter in course
        const returnCourse = await courseModel.findAllChapterInCourse(course._id);

        res.render('course/viewLesson', {
            course: course,
            lesson: lesson,
            chapterList: returnCourse.list_chapter,
        });
    }
};
