const categoryModel = require('../models/category.model');
const courseModel = require('../models/course.model');
const paging = require('../utils/pagingOption');
const toObject = require('../utils/toobject');
const { course } = require('./course.controller');

module.exports = {
    async category(req, res) {
        let id = req.params.id;
        let page = req.query.page;
        let perPage = 8;
        let matchedCategory = await categoryModel.selectFromOneId(id);
        const categoryTitle = matchedCategory.name;
        if (matchedCategory === null) {
            console.log('Category do not exist');
            res.redirect('/category');
        }
        let matchCourses = await courseModel.loadLimitedCourses(perPage, page, {
            category: matchedCategory._id,
            disable: false,
        });

        let pageArr = paging(page, matchCourses.totalPages);

        for (i of matchCourses.docs) {
            const avg = await courseModel.computeAvgRating(i._id);
            let avgRating = 0;
            if (avg[0]) {
                avgRating = avg[0].avgRating;
            }
            //console.log(avgRating);
            i.avgRating = avgRating;

            if (req.user) {
                const result = await courseModel.checkStudentInCourse(
                    req.user._id,
                    i._id
                );

                if (result) {
                    if (result._id.toString() === i._id.toString()) {
                        i.isStudent = true;
                    }
                }
            }
        }

        for (const course of matchCourses.docs) {
            if (course.discount && course.discount > 0) {
                const discount = course.discount;
                course.salePrice = course.price * (1 - discount / 100);
                course.salePrice = +course.salePrice.toFixed(2);
                course.isDiscount = true;
            }
            console.log(course);
        }

        const mostViewCourses = await courseModel.loadTenViewCourses();

        const mostViewCoursesId = mostViewCourses.map((child) => {
            return child._id.toString();
        });

        const tenNewestCourses = await courseModel.LoadTenNewestCourses();
        const tenNewestCoursesId = tenNewestCourses.map((child) => {
            return child._id.toString();
        });

        const fourWeeklyCourses = await courseModel.getWeeklyCourse();
        const fourWeeklyCoursesId = fourWeeklyCourses.map((child) => {
            return child._id.toString();
        });

        for (const child of matchCourses.docs) {
            if (mostViewCoursesId.includes(child._id.toString())) {
                child.isMostView = true;
            }

            if (fourWeeklyCoursesId.includes(child._id.toString())) {
                child.isWeekly = true;
            }

            if (tenNewestCoursesId.includes(child._id.toString())) {
                child.isNew = true;
            }
        }

        res.render('course', {
            courses: matchCourses.docs,
            empty: matchCourses.docs.length === 0,
            pagingOption: {
                page: page,
                pageArr: pageArr,
                next: matchCourses.nextPage,
                pre: matchCourses.prevPage,
            },
            path: req.baseUrl + req.path,
            categoryTitle,
        });
    },
    async allCategory(req, res) {
        let categories = await categoryModel.loadTopCategory();
        console.log(categories);
        res.render('category/index', {
            categories: categories,
        });
    },
};
