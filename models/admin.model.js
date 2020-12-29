const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    namelogin: { type: String, required: true },
    fullname: { String },
    password: { type: String, required: true },
    email: String,
    phone: String,
    avatar: String,
    date_created: { type: Date, default: Date.now },
});

const Admin = mongoose.model('Admin', schema, 'Admin');

module.exports = {
    addAdmin: async function (admin) {
        return await Admin.create(admin, function (err, doc) {
            if (err) throw Error(err);
        });
    },
};
