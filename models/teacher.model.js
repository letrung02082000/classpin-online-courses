const mongoose = require('mongoose');
const { findById, insertExample } = require('./course.model');

const Schema = mongoose.Schema;

const schema = new Schema({
    _id: mongoose.ObjectId,
    namelogin: { type: String, required: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    email: String,
    phone: String,
    avatar: String,
    date_created: { type: Date, default: Date.now },
});

const Teacher = mongoose.model('Teacher', schema, 'Teacher');

module.exports = {
    async loadAllTeachers() {
        return await Teacher.find({});
    },

    findById(teacherId) {
        return Teacher.findById(teacherId).lean();
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
