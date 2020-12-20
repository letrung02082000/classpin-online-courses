const categoryModel = require('../models/category.model');
const courseModel = require('../models/course.model');
const paging = require('../utils/pagingOption');
const toObject = require('../utils/toobject');
const { course } = require('./course.controller');

module.exports = {
    async category(req, res) {
        let id = req.params.id;
        let page = req.query.page;
        let perPage = 14;
        let matchedCategory = await categoryModel.selectFromOneId(id);
        if (matchedCategory === null) {
            console.log('Category do not exist');
            res.redirect('/category');
        }
        let matchCourses = await courseModel.loadLimitedCourses(perPage, page, { category: matchedCategory._id });
        let pageArr = paging(page, matchCourses.totalPages);
        res.render('course', {
            course: toObject.multipleMongooseToObj(matchCourses),
            empty: course.length === 0,
            pagingOption: {
                page: page,
                pageArr: pageArr,
                next: matchCourses.nextPage,
                pre: matchCourses.prevPage
            },
            path: req.path
        })
    },
    allCategory(req, res) {

    }
}