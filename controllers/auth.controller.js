const mongoose = require('mongoose');
const studentModel = require('../models/student.model');
const bcrypt = require('bcryptjs');

module.exports = {
  login: function(req, res) {
    req.session.retURL = req.headers.referer;
    const status = req.query.status;
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
      _id: mongoose.Types.ObjectId(),
      namelogin: req.body.namelogin,
      fullname: req.body.fullname,
      password: bcrypt.hashSync(req.body.password, 10),
      email: req.body.email,
      date_of_birth: Date(req.body.date_of_birth),
      wishlist: [], 
    }
   
    await studentModel.insertOne(newStudent);
    res.redirect('/account/login/?status=success');
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
    req.session.isAuth = false;
    req.session.user = null;
    let url = req.headers.referer;
    res.redirect(url);
  },

  profile: function(req, res) {
    res.render('user/profile');
  }
}

