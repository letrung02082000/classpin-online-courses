const express = require('express');
const controller = require('../controllers/auth.controller');
const requireUser = require('../middlewares/requireUserLogin.middleware');
const passport = require('passport');

const router = express.Router();
const multer = require('multer');
var upload = multer({ dest: 'public/uploads/' })


router.get('/login', controller.login);
// router.post('/login', passport.authenticate('local', {failureRedirect: '/account/login', failureFlash: true}), controller.postLogin);

router.post('/login', function(req, res, next) {
  passport.authenticate('student-local', function(err, user, info) {
    console.log(info);
    if(err) {
      return next(err);
    }
    if(info && info.message === 'check your email for verification!') {
      //console.log(info.email, info.userID);
      return res.render('resend', {
        layout: false,
        email: info.email,
        userID: info.userID,
      });
    }
    if(!user) {
      return res.render('auth/login', {
        layout: false,
        msg : info
      });
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      let url = req.session.retURL || '/';
      return res.redirect(url);
    });
  })(req, res, next);
});

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
  scope : ['email'] 
}));

router.get('/facebook/redirect', passport.authenticate('facebook', {successRedirect: '/', failureRedirect: '/account/login'}));
//login with github
router.get('/github/login', passport.authenticate('github', {
  scope: [ 'user:email' ]
}))

router.get('/github/redirect', passport.authenticate('github', {failureRedirect: '/account/login', successRedirect: '/'}));


router.post('/postSignUp', controller.postSignUp);
router.get('/is-available', controller.isAvailable);
router.get('/is-emailAvb', controller.isEmailAvailable);
router.post('/logout', controller.postLogout);
router.get('/profile', requireUser.requireUser, controller.profile);
router.get('/editprofile', requireUser.requireUser, controller.editProfile);
router.post('/editprofile', requireUser.requireUser, upload.single('avatar'), controller.postEditProfile);
router.get('/changepass', requireUser.requireUser, controller.changePass);
router.post('/changepass', requireUser.requireUser, controller.postChangePass);
router.get('/changeEmail', requireUser.requireUser, controller.changeEmail);
router.post('/changeEmail', requireUser.requireUser, controller.postChangeEmail);

module.exports = router;
