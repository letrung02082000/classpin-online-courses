const mongoose = require('mongoose');
const { findById, insertExample } = require('./course.model');

const Schema = mongoose.Schema;

const schema = new Schema({
    namelogin: { type: String, required: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    email: String,
    phone: String,
    about: String,
    avatar: { type: String, default: '/public/static/images/unnamed.png'},
    type: {type: Number, default: 2},
    date_created: { type: Date, default: Date.now },
    isBlock: {type: Boolean, default: false}
});

const Teacher = mongoose.model('Teacher', schema, 'Teacher');

module.exports = {
    async loadAllTeachers() {
        return await Teacher.find({}).lean();
    },

    async addTeacher(teacher) {
        return await Teacher.create(teacher).catch(function (err) {
            throw Error(err);
        });
    },

    async deleteTeacher(id) {
        return await Teacher.findByIdAndRemove(
            mongoose.mongo.ObjectId(id),
            (err) => {
                if (err) throw Error(err);
            }
        );
    },

    findById(teacherId) {
        return Teacher.findById(teacherId).lean();
    },

    findByNameloginOrEmail(value) {
        return Teacher.findOne({
            $or: [{ namelogin: value }, { email: value }],
        });
    },

    updateOne(filter, update) {
        return Teacher.findOneAndUpdate(filter, update, {
            new: true,
        });
    },

    async insertExample() {
        let arr = [
            {
                _id: mongoose.Types.ObjectId,
                namelogin: 'teacher1',
                fullname: 'giáo viên 1',
                password: 'teacher1',
            },
            {
                _id: mongoose.Types.ObjectId,
                namelogin: 'teacher2',
                fullname: 'giáo viên 2',
                password: 'teacher2',
            },
            {
                _id: mongoose.Types.ObjectId,
                namelogin: 'teacher3',
                fullname: 'giáo viên 3',
                password: 'teacher3',
            },
            {
                _id: mongoose.Types.ObjectId,
                namelogin: 'teacher4',
                fullname: 'giáo viên 4',
                password: 'teacher4',
            },
            {
                _id: mongoose.Types.ObjectId,
                namelogin: 'teacher5',
                fullname: 'giáo viên 5',
                password: 'teacher5',
            },
        ];

        Teacher.collection.insertMany(arr, function (err, docs) {
            if (err) {
                console.log(err);
            }
        });
    },
};
