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
        });

        let pageArr = paging(page, matchCourses.totalPages);

        for (i of matchCourses.docs) {
            var discount = i.discount || 0;
            var salePrice = i.price * (1 - discount / 100);
            i.salePrice = salePrice;
            const avg = await courseModel.computeAvgRating(i._id);
            let avgRating = 0;
            if (avg[0]) {
                avgRating = avg[0].avgRating;
            }
            //console.log(avgRating);
            i.avgRating = avgRating;
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
