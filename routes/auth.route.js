const express = require('express');
const controller = require('../controllers/auth.controller');
const requireUser = require('../middlewares/requireUserLogin.middleware');
const passport = require('passport');

const router = express.Router();
const multer = require('multer');
var upload = multer({ dest: 'public/uploads/' })


router.get('/login', controller.login);
router.post('/login', passport.authenticate('local', {failureRedirect: '/account/login', failureFlash: true}), controller.postLogin);

//login with google
router.get('/google/login', passport.authenticate('google', {
  //scope: ['profile', 'email']
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
}));

router.get('/google/redirect', passport.authenticate('google', {successRedirect: '/', failureRedirect: '/account/login'}));

//login with facebook
router.get('/facebook/login', passport.authenticate('facebook', {
  scope : ['user_friends', 'email'] 
}));

router.get('/facebook/redirect', passport.authenticate('facebook', {successRedirect: '/', failureRedirect: '/account/login'}));


router.post('/postSignUp', controller.postSignUp);
router.get('/is-available', controller.isAvailable);
router.post('/logout', controller.postLogout);
router.get('/profile', requireUser.requireUser, controller.profile);
router.get('/editprofile', requireUser.requireUser, controller.editProfile);
router.post('/editprofile', requireUser.requireUser, upload.single('avatar'), controller.postEditProfile);


module.exports = router;
