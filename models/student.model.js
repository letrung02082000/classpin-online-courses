const mongoose = require('mongoose');
const courseModel = require('./course.model');
const ratingModel = require('./rating.model');

const Schema = mongoose.Schema;

const schema = new Schema({
    namelogin: String,
    fullname: String,
    password: String,
    email: String,
    newEmail: String,
    date_of_birth: String,
    avatar: String,
    verify: { type: Boolean, default: false },
    verify_key: String,
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Course' }], // ObjectId khoa hoc
    isBlock: { type: Boolean, default: false },
});

const Student = mongoose.model('Student', schema, 'Student');

module.exports = {
    insertOne(student) {
        return Student.create(student);
    },

    findByEmail(email) {
        return Student.findOne({ email: email });
    },

    findByNameLogin(username) {
        return Student.findOne({ namelogin: username });
    },

    findByGoogleID(googleID) {
        return Student.findOne({ googleID: googleID });
    },

    findByFacebookID(facebookID) {
        return Student.findOne({ facebookID: facebookID });
    },

    findById(id) {
        return Student.findById(id).lean();
    },

    findOneAndUpdate(filter, update) {
        return Student.findOneAndUpdate(filter, update, {
            new: true,
        });
    },

    findByNameloginOrEmail(value) {
        return Student.findOne({
            $or: [{ namelogin: value }, { email: value }],
        });
    },

    addCourseToWishList(courseID, studentID) {
        return Student.updateOne(
            { _id: studentID },
            { $addToSet: { wishlist: mongoose.Types.ObjectId(courseID) } }
        );
    },

    unWishList(courseID, studentID) {
        return Student.updateOne(
            { _id: studentID },
            { $pull: { wishlist: mongoose.Types.ObjectId(courseID) } }
        );
    },

    findWishList(studentID) {
        return Student.findOne({_id: studentID}, { wishlist: 1, _id: 0 })
            .populate([{ path: 'wishlist', populate: {path: 'teacher'}}])
            .lean();
    },

    checkCourseInWishList(courseID, studentID) {
        return Student.findOne({
            _id: studentID,
            wishlist: { $all: [mongoose.Types.ObjectId(courseID)] },
        }).lean();
    },

    getStudent: async function (perPage, page) {
        return await Student.find({})
            .skip(perPage * (page - 1))
            .limit(perPage)
            .lean();
    },

    countStudent: async function () {
        return await Student.countDocuments({});
    },

    deleteStudent: async function (id) {
        //delete student from courses
        await courseModel.FindAndRemoveStudent(id);

        //delete all rating of this student
        await ratingModel.deleteMany({ student: mongoose.mongo.ObjectId(id) });

        //delete student
        await Student.deleteOne(
            { _id: mongoose.mongo.ObjectId(id) },
            function (err) {
                if (err) throw Error(err);
            }
        );
    },

    findOne(filter) {
        return Student.findOne(filter);
    },

    updateOne(filter, update) {
        return Student.findOneAndUpdate(filter, update);
    },

    loadAllStudents: async function () {
        return await Student.find({}).lean();
    },
};
