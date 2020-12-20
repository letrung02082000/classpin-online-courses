const mongoose = require('mongoose');
const studentModel = require('../models/student.model');
const bcrypt = require('bcryptjs');


module.exports = {
  login: function(req, res) {
    if(req.headers.referer && req.headers.referer !== "http://localhost:3000/account/login") {
      req.session.retURL = req.headers.referer;
    }
    console.log(req.session.retURL);
    const status = req.query.status;
    if(req.user) {
      let url = req.session.retURL || '/';
      res.redirect(url);
      return;
    }
    res.render('auth/login', {
      layout: false,
      status: status,
    });
  },

  postLogin: async function(req, res) { 
    const username = req.body.namelogin;
    const password = req.body.password;
    const user = await studentModel.findByNameLogin(username);
    if(!user) {
      res.render('auth/login', {
        layout: false,
        msg: "User does not exist!",
      });
      return;
    }
    if(bcrypt.hashSync(password, user.password)) {
      req.session.isAuth = true;
      req.session.authUser = user;

      console.log(req.session.isAuth);
      
      let url = req.session.retURL || '/';

      res.redirect(url);
      return;
    } else {
      res.render('auth/login', {
        layout: false,
        msg: "Wrong password !",
      });
      return;
    }
  },

  postSignUp: async function(req, res) {
    const newStudent = {
      //_id: mongoose.Types.ObjectId(),
      namelogin: req.body.namelogin,
      fullname: req.body.fullname,
      password: bcrypt.hashSync(req.body.password, 10),
      email: req.body.email,
      date_of_birth: req.body.date_of_birth,
      avatar: '/public/static/images/unnamed.png',
      wishlist: [], 
    }
   
    await studentModel.insertOne(newStudent);
    var msg = encodeURIComponent('success');
    res.redirect('/account/login/?status=' + msg);
  },

  isAvailable: async function(req, res) {
    const username = req.query.user;
    const user = await studentModel.findByNameLogin(username);
    if(user === null) {
      res.json(true);
    } else {
      res.json(false);
    }
  },

  postLogout: function(req, res) {
    // req.session.isAuth = false;
    // req.session.user = null;
    req.logout();
    let url = req.headers.referer;
    res.redirect(url);
  },

  profile: function(req, res) {
    var status = req.query.status;
    res.render('user/profile', {
      status: status,
    });
  },

  editProfile: function(req, res) {
    res.render('user/editProfile');
  },

  postEditProfile: async function(req, res) {
    console.log(req.body);
    console.log(req.session.authUser.namelogin);
    const filter = { namelogin: req.session.authUser.namelogin };
    const update = {
      fullname: req.body.fullname,
      email: req.body.email,
      date_of_birth: req.body.date_of_birth,
    }
    if(req.file) {
      update.avatar = '\\' + req.file.path;
    }
    console.log(update);
    const newUser = await studentModel.findOneAndUpdate(filter, update);
    req.session.authUser = newUser;
    var msg = encodeURIComponent('updatesuccess');
    res.redirect('/account/profile/?status=' + msg);
  },

  google: function(req, res) {
  
  },

  googleRedirect: function(req, res) {
    res.redirect('/');
  }
}

