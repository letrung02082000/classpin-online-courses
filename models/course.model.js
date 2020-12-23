const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const schema = new Schema({
    _id: mongoose.ObjectId,
    name: String,
    description: String,
    thumbnail: String,
    price: Number,
    discount: Number,
    list_student: Array,
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // id category
    date_created: { type: Date, default: Date.now },
});

schema.plugin(mongoosePaginate);

const Course = mongoose.model('Course', schema, 'Course');

module.exports = {
    async count() {
        return await Course.collection.countDocuments();
    },

    async loadAllCourses() {
        return await Course.find({});
    },
    async loadLimitedCourses(perPage, page) {
        //return await Course.find().limit(perPage).skip((page - 1) * perPage);
        return await Course.paginate({}, { page: page, limit: perPage });
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
    async findById(courseId) {
        return await Course.findById(courseId).lean();
    },

    async checkStudentInCourse(studentId, courseId) {
        return Course.findOne({
            _id: courseId,
            list_student: { $all: [mongoose.Types.ObjectId(studentId)] },
        });
    },

    async LoadTenNewestCourses() {
        return await Course.find({})
            .populate('teacher', 'fullname')
            .populate('category', 'name')
            .sort({ date_created: 1 })
            .limit(10);
    },
};
