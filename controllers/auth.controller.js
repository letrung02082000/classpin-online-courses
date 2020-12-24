const mongoose = require('mongoose');
const studentModel = require('../models/student.model');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { email } = require('../config/main.config');
const courseModel = require('../models/course.model');

module.exports = {
    login: function (req, res) {
        if (req.headers.referer && req.headers.referer !== "http://localhost:3000/account/login") {
            req.session.retURL = req.headers.referer;
        }
        console.log(req.session.retURL);
        const status = req.query.status;
        if (req.user) {
            let url = req.session.retURL || '/';
            res.redirect(url);
            return;
        }
        res.render('auth/login', {
            layout: false,
            status: status,
            msg: req.flash(),
        });
    },

    postLogin: async function (req, res) {
        let url = req.session.retURL || '/';
        console.log(url);
        res.redirect(url);
        // const username = req.body.namelogin;
        // const password = req.body.password;
        // const user = await studentModel.findByNameLogin(username);
        // if(!user) {
        //   res.render('auth/login', {
        //     layout: false,
        //     msg: "User does not exist!",
        //   });
        //   return;
        // }
        // if(bcrypt.hashSync(password, user.password)) {
        //   req.session.isAuth = true;
        //   req.session.authUser = user;

        //   console.log(req.session.isAuth);

        //   let url = req.session.retURL || '/';

        //   res.redirect(url);
        //   return;
        // } else {
        //   res.render('auth/login', {
        //     layout: false,
        //     msg: "Wrong password !",
        //   });
        //   return;
        // }
    },

    postSignUp: async function (req, res) {
        const newStudent = {
            //_id: mongoose.Types.ObjectId(),
            namelogin: req.body.namelogin,
            fullname: req.body.fullname,
            password: bcrypt.hashSync(req.body.password, 10),
            email: req.body.email,
            date_of_birth: req.body.date_of_birth,
            avatar: '/public/static/images/unnamed.png',
            wishlist: [],
        };
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: email.account, // generated ethereal user
                pass: email.password, // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"OnlineCourse" <foo@example.com>', // sender address
            to: newStudent.email, // list of receivers
            subject: 'Hello, welcome to OnlineCourse', // Subject line
            text: '', // plain text body
            html: '<b>Hello world?</b>', // html body
        });

        console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        await studentModel.insertOne(newStudent);
        var msg = encodeURIComponent('success');
        res.redirect('/account/login/?status=' + msg);
    },

    isAvailable: async function (req, res) {
        const username = req.query.user;
        const email = req.query.email;
        const checkuser = await studentModel.findByNameLogin(username);
        if (checkuser) {
            res.json({ isvalid: false, msg: 'Username already exist.' });
            return;
        }
        const checkemail = await studentModel.findByEmail(email);
        if (checkemail) {
            res.json({ isvalid: false, msg: 'Email already exist.' });
            return;
        }
        res.json({ isvalid: true });
    },

    postLogout: function (req, res) {
        // req.session.isAuth = false;
        // req.session.user = null;
        req.logout();
        let url = req.headers.referer;
        res.redirect(url);
    },

    profile: async function (req, res) {
        var status = req.query.status;
        const PurchasedCourse = await courseModel.findCoursePurchased(req.user._id);
        console.log(PurchasedCourse);
        res.render('user/profile', {
            status: status,
            PurchasedCourse: PurchasedCourse,
        });
    },

    editProfile: function (req, res) {
        res.render('user/editProfile');
    },

    postEditProfile: async function (req, res) {
        console.log(req.body);
        console.log(req.user);
        const filter = { email: req.user.email };
        const update = {
            fullname: req.body.fullname,
            date_of_birth: req.body.date_of_birth,
        };
        if (req.file) {
            update.avatar = '\\' + req.file.path;
        }
        //console.log(update);
        const newUser = await studentModel.findOneAndUpdate(filter, update);
        req.session.authUser = newUser;
        var msg = encodeURIComponent('updatesuccess');
        res.redirect('/account/profile/?status=' + msg);
    },

    google: function (req, res) {},

    googleRedirect: function (req, res) {
        res.redirect('/');
    },
};
