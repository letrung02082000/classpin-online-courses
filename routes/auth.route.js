const express = require('express');
const controller = require('../controllers/auth.controller');
const requireUser = require('../middlewares/requireUserLogin.middleware');
const router = express.Router();
const multer = require('multer');
var upload = multer({ dest: 'public/uploads/' })


router.get('/login', controller.login);
router.post('/login', controller.postLogin);
router.post('/postSignUp', controller.postSignUp);
router.get('/is-available', controller.isAvailable);
router.post('/logout', controller.postLogout);
router.get('/profile', requireUser.requireUser, controller.profile);
router.get('/editprofile', requireUser.requireUser, controller.editProfile);
router.post('/editprofile', requireUser.requireUser, upload.single('avatar'), controller.postEditProfile);


module.exports = router;
