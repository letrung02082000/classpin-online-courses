const mongoose = require('mongoose');
const studentModel = require('../models/student.model');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { email } = require('../config/main.config');
const courseModel = require('../models/course.model');


function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


module.exports = {
    login: function (req, res) {
        if (req.headers.referer && req.headers.referer !== "http://localhost:3000/account/login" && req.headers.referer !== "http://localhost:3000/account/login/?status=success") {
            req.session.retURL = req.headers.referer;
        }
        console.log(req.session.retURL);
        const status = req.query.status;
        if (req.user && req.user.type !== 1 && req.user.type !== 2) {
            let url = req.session.retURL || '/';
            res.redirect(url);
            return;
        }
        var msg = req.flash().error;
        console.log(msg);
        res.render('auth/login', {
            layout: false,
            status: status,
            msg: msg,
        });
    },

    postLogin: async function (req, res) {
        let url = req.session.retURL || '/';
        console.log(req.flash());
        res.redirect(url);
    },

    postSignUp: async function (req, res) {
        const verify_key = makeid(50);
        const newStudent = {
            //_id: mongoose.Types.ObjectId(),
            namelogin: req.body.namelogin,
            fullname: req.body.fullname,
            password: bcrypt.hashSync(req.body.password, 10),
            email: req.body.email,
            date_of_birth: req.body.date_of_birth,
            avatar: '/public/static/images/unnamed.png',
            wishlist: [],
            verify_key: verify_key, //key verify email
        };

        const createdStudent = await studentModel.insertOne(newStudent);



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
            from: '"ClassPin" <foo@example.com>', // sender address
            to: newStudent.email, // list of receivers
            subject: 'Verify your email', // Subject line
            text: '', // plain text body
            html: `<b>Click this link to verify your email! </b><a href="http://localhost:3000/verify/?clientId=${createdStudent._id}&key=${verify_key}">verify</a>`, // html body
        });

        console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...


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
        if (checkemail /*&& checkemail.verify === true*/) {
            res.json({ isvalid: false, msg: 'Email already exist.' });
            return;
        }
        res.json({ isvalid: true });
    },

    isEmailAvailable: async function (req, res) {
        const email = req.query.email;
        const checkemail = await studentModel.findByEmail(email);
        if (checkemail /*&& checkemail.verify === true*/) {
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
        const ObjWl = await studentModel.findWishList(req.user._id);
        res.render('user/profile', {
            status: status,
            PurchasedCourse: PurchasedCourse,
            wishList: ObjWl.wishlist,
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

    google: function (req, res) { },

    googleRedirect: function (req, res) {
        res.redirect('/');
    },

    changePass: function (req, res) {
        res.render('user/changePass', {
        });
    },

    postChangePass: async function (req, res) {
        const password = req.body.password;
        const newPassword = req.body.newPassword;

        if (bcrypt.compareSync(password, req.user.password)) {
            const filter = { _id: req.user._id };
            const update = { password: bcrypt.hashSync(newPassword, 10) };
            await studentModel.findOneAndUpdate(filter, update);
            console.log('success');
            res.redirect('/account/profile');
        } else {
            res.render('user/changePass', {
                msg: 'Wrong password'
            })
        }
    },

    changeEmail: function (req, res) {
        res.render('user/changeEmail', {

        })
    },

    postChangeEmail: async function (req, res) {
        const password = req.body.password;
        const newEmail = req.body.email;
        

        if (bcrypt.compareSync(password, req.user.password)) {
            const verify_key = makeid(50);
            const filter = { _id: req.user._id };
            const update = { newEmail: newEmail, verify_key: verify_key };
            const createdStudent = await studentModel.findOneAndUpdate(filter, update);
            

            //send email
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
                from: '"ClassPin" <foo@example.com>', // sender address
                to: req.body.email, // list of receivers
                subject: 'Verify your email', // Subject line
                text: '', // plain text body
                html: `<b>Click this link to verify your email! </b><a href="http://localhost:3000/verify/?clientId=${createdStudent._id}&key=${verify_key}">verify</a>`, // html body
            });

            console.log('Message sent: %s', info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            
            console.log('success');
            res.render('notify', {
                layout: false,
            })
        } else {
            res.render('user/changeEmail', {
                msg: 'Wrong password'
            })
        }
    }
};
