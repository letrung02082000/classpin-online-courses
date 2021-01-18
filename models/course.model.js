const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const { findRatingById } = require('./rating.model');
const Schema = mongoose.Schema;
//trung
const { getMonday } = require('../utils/getMonday');

const schema = new Schema({
    _id: mongoose.ObjectId,
    name: String,
    description: String,
    short_description: String,
    thumbnail: String,
    price: Number,
    discount: Number,
    done: { type: Boolean, default: false },
    list_student: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    list_rating: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
    list_chapter: [{ type: Schema.Types.ObjectId, ref: 'Chapter' }],
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // id category
    date_created: { type: Date, default: Date.now },
    view_count: { type: Number, default: 0 },
    last_view: { type: Date, default: Date.now },
    week_count: { type: Number, default: 0 },
    last_updated: { type: Date, default: Date.now },
    disable: { type: Boolean, default: false },
});

schema.index({ '$**': 'text' });
schema.plugin(mongoosePaginate);
schema.plugin(aggregatePaginate);

const Course = mongoose.model('Course', schema, 'Course');

module.exports = {
    async count() {
        return await Course.collection.countDocuments();
    },

    async loadAllCourses() {
        return await Course.find({}).populate({ path: 'teacher' }).lean();
    },

    async loadCourses(query) {
        return await Course.find(query);
    },

    async getCourse(query) {
        return await Course.find(query).populate({ path: 'teacher' }).lean();
    },

    async loadLimitedCourses(
        perPage,
        page,
        query = { disable: false },
        option = {}
    ) {
        //return await Course.find().limit(perPage).skip((page - 1) * perPage);
        return await Course.paginate(query, {
            page: page,
            limit: perPage,
            lean: true,
            populate: ['teacher', 'category'],
            ...option,
        });
    },

    async loadAggCourses(query = {}, option = {}) {
        let agg = [
            {
                $lookup: {
                    from: 'Rating',
                    localField: 'list_rating',
                    foreignField: '_id',
                    as: 'list_rating_info',
                },
            },
            {
                $addFields: {
                    rating_average: { $avg: '$list_rating_info.rating' },
                },
            },
        ];
        if (query.category) {
            query.category = mongoose.Types.ObjectId(query.category);
        }
        if (Object.keys(query).length !== 0) {
            agg.unshift({ $match: query });
        }
        // if (query.category) {
        //     agg.unshift({
        //         $match: { category: mongoose.Types.ObjectId(query.category) },
        //     });
        // }
        // if (Object.keys(query).length !== 0) {
        //     agg.unshift({ $match: query });
        // }
        // if (query.category) {
        //     agg.unshift({ $match: { category: mongoose.Types.ObjectId(query.category) } });
        // }
        // if (query.$text) {
        //     agg.unshift({ $match: { $text: query.$text } });
        // }
        console.log('printsomthing');
        //console.log(await Course.aggregate([{ $match: { $text: query.$text } }]));
        var mya = Course.aggregate(agg);
        return Course.aggregatePaginate(mya, option);
    },

    async insertExample() {
        let arr = [
            {
                _id: mongoose.Types.ObjectId,
                name: 'Python Web Development',
                decription: 'Python Web Development',
                price: 10,
            },
            {
                _id: mongoose.Types.ObjectId,
                name: 'Nodejs',
                decription: 'Nodejs',
                price: 10,
            },
            {
                _id: mongoose.Types.ObjectId,
                name: 'Javascript',
                decription: 'Javascript',
                price: 20,
            },
        ];
        Course.collection.insertMany(arr);
    },
    findById(courseId) {
        return Course.findById(courseId).lean();
    },

    findByIdAndMapChapter(courseId) {
        return Course.findById(courseId).populate({path: 'list_chapter'});
    },

    findByIdWithTeacherInfo(courseId) {
        return Course.findOne({ _id: mongoose.mongo.ObjectId(courseId) })
            .populate('teacher', 'fullname')
            .populate('category', 'name')
            .lean();
    },

    // return rating embeded in list_rating of course
    findAllRatingOfCourse(courseID) {
        return Course.findById(courseID)
            .populate([{ path: 'list_rating', options: {sort: {'date_rating': -1}}, populate: { path: 'student'}}])
            .populate({ path: 'teacher' })
            .lean();
    },

    findCoursePurchased(studentID) {
        return Course.find({
            disable: false,
            list_student: { $all: [mongoose.Types.ObjectId(studentID)] },
        })
            .populate({ path: 'teacher' })
            .lean();
    },
    // return a document nested in array have field avgRating, if empty array, avgRating = 0
    computeAvgRating(courseID) {
        return Course.aggregate([
            { $match: { _id: courseID } },
            {
                $lookup: {
                    from: 'Rating',
                    localField: 'list_rating',
                    foreignField: '_id',
                    as: 'list_rating_info',
                },
            },
            { $project: { list_rating_info: 1 } },
            { $unwind: '$list_rating_info' },
            {
                $group: {
                    _id: '$_id',
                    avgRating: { $avg: '$list_rating_info.rating' },
                },
            },
        ]);
    },

    countRatingsByLevel(courseID) {
        return Course.aggregate([
            { $match: { _id: courseID } },
            {
                $lookup: {
                    from: 'Rating',
                    localField: 'list_rating',
                    foreignField: '_id',
                    as: 'list_rating_info',
                },
            },
            // {$project: { list_rating_info: 1}},
            // {$unwind: "$list_rating_info"},
            // {$match: {'list_rating_info.rating': level}},
            // {$count: 'count'}
            { $project: { list_rating_info: 1 } },
            { $unwind: '$list_rating_info' },
            { $group: { _id: '$list_rating_info.rating', count: { $sum: 1 } } },

            // {$group: {_id: "$_id", countRating: {$count: '$list_rating_info'}}}
        ]);
    },

    //return course if exists student
    async checkStudentInCourse(studentId, courseId) {
        return Course.findOne({
            _id: courseId,
            list_student: { $all: [mongoose.Types.ObjectId(studentId)] },
        }).populate({ path: 'list_rating' });
    },
    async addCourse(course) {
        return Course.create(course);
    },
    async LoadTenNewestCourses() {
        return await Course.find({ disable: false })
            .populate('teacher', 'fullname')
            .populate('category', 'name')
            .sort({ date_created: -1 })
            .limit(10)
            .lean();
    },

    //find 5 courses in same category
    async findRelatedCourse(categoryId) {
        return await Course.aggregate(
            [
                {
                    $match: {
                        disable: false,
                        category: mongoose.mongo.ObjectId(categoryId),
                    },
                },
                {
                    $project: {
                        length: { $size: '$list_student' },
                    },
                },
                { $sort: { length: -1 } },
                { $limit: 5 },
            ],
            function (err, doc) {
                if (err) throw Error(err);
            }
        );
    },

    // add ratingID to list_rating
    pushRatingIDToCourse(courseID, ratingID) {
        return Course.updateOne(
            { _id: courseID },
            { $addToSet: { list_rating: ratingID } }
        );
    },

    //trung
    async increaseCourseView(courseId) {
        const course = await Course.findById(courseId, function (err, doc) {
            if (err) return console.log(err);
        });
        course.view_count += 1;
        course.save();
    },

    async loadTenViewCourses() {
        return await Course.find({ disable: false })
            .populate('teacher', 'fullname')
            .populate('category', 'name')
            .sort({ view_count: -1 })
            .limit(10)
            .lean();
    },

    async addStudentCourse(courseId, studentId) {
        const course = await Course.updateOne(
            { _id: mongoose.mongo.ObjectId(courseId) },
            { $addToSet: { list_student: mongoose.mongo.ObjectId(studentId) } },
            function (err, doc) {
                if (err) return console.err(err);
            }
        );
    },

    async FindAndRemoveStudent(studentId) {
        return await Course.updateMany(
            {},
            {
                $pullAll: {
                    list_student: [mongoose.mongo.ObjectId(studentId)],
                },
            },
            function (err) {
                if (err) throw Error(err);
            }
        );
    },

    async findCoursesByStudent(studentId) {
        return await Course.find(
            {
                list_student: mongoose.mongo.ObjectId(studentId),
            },
            function (err, doc) {
                if (err) return console.log(err);
            }
        )
            .populate('teacher', 'fullname')
            .populate('category', 'name')
            .lean();
    },

    async updateWeekView(courseId) {
        const course = await Course.findById(
            mongoose.mongo.ObjectId(courseId),
            function (err) {
                if (err) throw Error(err);
            }
        );

        course.week_count += 1;
        course.last_view = Date.now();
        await course.save();
    },

    async resetWeekView(courseId) {
        const course = await Course.findById(
            mongoose.mongo.ObjectId(courseId),
            function (err) {
                if (err) throw Error(err);
            }
        );

        course.week_count = 0;
        course.last_view = Date.now();
        await course.save();
    },

    async getWeeklyCourse() {
        const mondayDate = getMonday();
        const now = Date.now();
        console.log(mondayDate);
        return await Course.find({
            last_view: { $gte: mondayDate, $lte: now },
            disable: false,
        })
            .populate('teacher', 'fullname')
            .populate('category', 'name')
            .sort({ week_count: -1 })
            .limit(4)
            .lean();
    },

    async findDetailCourseById(courseId) {
        return await Course.findById(mongoose.mongo.ObjectId(courseId))
            .populate('teacher')
            .populate('category')
            .lean();
    },

    async deleteTeacherCourses(teacherId) {
        return await Course.deleteMany({
            teacher: mongoose.mongo.ObjectId(teacherId),
        });
    },

    deleteOneCourse(courseID) {
        return Course.deleteOne({ _id: courseID });
    },

    disableCourseById(courseId) {
        return Course.findOneAndUpdate(
            { _id: mongoose.mongo.ObjectId(courseId) },
            { disable: true }
        );
    },

    enableCourseById(courseId) {
        return Course.findOneAndUpdate(
            { _id: mongoose.mongo.ObjectId(courseId) },
            { disable: false }
        );
    },

    findAllChapterInCourse(courseID) {
        return Course.findById(courseID)
            .populate([
                { path: 'list_chapter', populate: { path: 'list_lesson' } },
            ])
            .lean();
    },

    findCourseOfTeacher(teacherID) {
        return Course.find({
            teacher: mongoose.Types.ObjectId(teacherID),
        }).lean();
    },

    updateOne(filter, update) {
        update.last_updated = Date.now();
        return Course.findOneAndUpdate(filter, update);
    },
};
