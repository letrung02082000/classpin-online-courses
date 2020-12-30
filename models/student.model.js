const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    namelogin: String,
    fullname: String,
    password: String,
    email: String,
    date_of_birth: String,
    avatar: String,
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Course' }], // ObjectId khoa hoc
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
        return Student.findOne({ _id: studentID }, { wishlist: 1, _id: 0 })
            .populate('wishlist')
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
};
