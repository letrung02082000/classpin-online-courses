const bcrypt = require('bcryptjs');
const adminModel = require('../models/admin.model');

module.exports = {
    getLogin: function (req, res) {
        res.render('admin/login', { layout: false });
    },

    postLogin: async function (req, res) {
        const username = req.body.username;
        const password = req.body.password;

        // const admin = {
        //     namelogin: username,
        //     password: bcrypt.hashSync(password, 10),
        // };
        // await adminModel.addAdmin(admin);
    },
};
