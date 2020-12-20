const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const LocalStrategy = require('passport-local');
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
    //console.log(profile);
    // check user exist
    const user = await studentModel.findByGoogleID(profile.id);
    if(user) {
      console.log('user already exist');
      done(null, user);
    } else {
      const newStudent = {
        googleID: profile.id,
        fullname: profile.displayName,
        avatar: profile.photos.value,
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
    const user = await studentModel.findByNameLogin(namelogin);
    if(!user) {
      return done(null, false, {message: 'Incorrect username.'});
    }
    if(!bcrypt.compareSync(password, user.password)) {
      return done(null, false, {message: 'Incorrect password.'});
    }

    return done(null, user);
  })
);

