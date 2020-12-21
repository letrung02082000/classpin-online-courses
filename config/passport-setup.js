const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const LinkedInStrategy  = require('passport-linkedin-oauth2').Strategy;


const bcrypt = require('bcryptjs');
const keys = require('./main.config');
const studentModel = require('../models/student.model');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await studentModel.findById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy({
    //option for the googleStrategy
    callbackURL: '/account/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
  }, async (accessToken, refreshToken, profile, done) => {
    //passport callback function
    console.log(profile);
    //console.log(email);
    // check user exist
    const user = await studentModel.findByEmail(profile.emails[0].value);
    if(user) {
      console.log('user already exist');
      done(null, user);
    } else {
      const newStudent = {
        fullname: profile.displayName,
        avatar: profile.photos[0].value,
        email: profile.emails[0].value,
        wishlist: [],
      }
      const result = await studentModel.insertOne(newStudent);
      done(null, result);
    }
  })
);

passport.use(
  new LocalStrategy({
    usernameField: 'namelogin',
    passwordField: 'password'
  }, async (namelogin, password, done) => {
    const user = await studentModel.findByNameloginOrEmail(namelogin);
    console.log(user);
    if(!user) {
      return done(null, false, {message: 'Incorrect username.'});
    }
    if(!bcrypt.compareSync(password, user.password)) {
      return done(null, false, {message: 'Incorrect password.'});
    }

    return done(null, user);
  })
);


passport.use(
  new FacebookStrategy({
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    callbackURL: '/account/facebook/redirect',
    profileFields: ['id', 'displayName', 'photos', 'email'],
  }, async (accessToken, refreshToken, profile, done) => {
    //passport callback function
    console.log(profile);
    //console.log(email);
    // check user exist
    const user = await studentModel.findByEmail(profile.emails[0].value);
    if(user) {
      console.log('user already exist');
      done(null, user);
    } else {
      const newStudent = {
        fullname: profile.displayName,
        avatar: profile.photos[0].value,
        email: profile.emails[0].value,
        wishlist: [],
      }
      const result = await studentModel.insertOne(newStudent);
      done(null, result);
    }
  })
);


// passport.use(
//   new LinkedInStrategy({
//     clientID: keys.linkedin.clientID,
//     clientSecret: keys.linkedin.clientSecret,
//     callbackURL: "/account/linkedin/redirect",
//     scope: ['r_emailaddress', 'r_liteprofile'],
//   }, async(accessToken, refreshToken, profile, done) => {
//     //passport callback function
//     console.log(profile);
//     //console.log(email);
//     // check user exist
//     const user = await studentModel.findByEmail(profile.emails[0].value);
//     if(user) {
//       console.log('user already exist');
//       done(null, user);
//     } else {
//       const newStudent = {
//         fullname: profile.displayName,
//         avatar: profile.photos[0].value,
//         email: profile.emails[0].value,
//         wishlist: [],
//       }
//       const result = await studentModel.insertOne(newStudent);
//       done(null, result);
//     }
//   })
// )

// passport.use(
//   new TwitterStrategy({
//     consumerKey:
//     consumerSecret:
//     callbackURL: '/account/twitter/redirect',
//   }, async (accessToken, refreshToken, profile, done) => {
//     console.log(profile);
//   })
// )
