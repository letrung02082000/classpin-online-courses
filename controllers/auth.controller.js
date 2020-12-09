const { mongo } = require("mongoose");

const mongoose = require('mongoose');

module.exports = {
  login(req, res) {
    res.render('auth/login', {
      layout: false
    });
  },

  postLogin(req, res) {
    
  }
}

