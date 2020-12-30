require('dotenv').config();
// async-error-handler
require('express-async-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
var session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const connectFlash = require('connect-flash');
const mongoose = require('mongoose');
const moment = require('moment');
const passportSetup = require('./config/passport-setup');
var express_handlebars_sections = require('express-handlebars-sections');
const passport = require('passport');
const authRoutes = require('./routes/auth.route');
const courseRoutes = require('./routes/course.route');
const homeRoutes = require('./routes/home.route');
const adminRoutes = require('./routes/admin.route');
const cartRoutes = require('./routes/cart.route');
const adminRoutes = require('./routes/admin.route');

const teacherRoutes = require('./routes/teacher.route');
const categoryRoutes = require('./routes/category.route');

const localmdw = require('./middlewares/locals.middleware');
const courseModel = require('./models/course.model');
const key = require('./config/main.config');

const { port, mongo_url, secret_session } = key;
const db = require('./db');
const { requireUser } = require('./middlewares/requireUserLogin.middleware');
const app = express();

// express sessions
app.set('trust proxy', 1); // trust first proxy
app.use(
    session({
        secret: 'SECRET_KEY',
        resave: false,
        saveUninitialized: true,
        cookie: {
            //secure: true
        },
        //store: new mongoStore({ mongooseConnection: mongoose.connection }),
    })
);
app.use(connectFlash());

// initial passport
app.use(passport.initialize());
app.use(passport.session());

// static file
app.use('/public', express.static('public'));

app.engine(
    'hbs',
    exphbs({
        defaultLayout: 'main.hbs',
        extname: '.hbs',
        layoutsDir: 'views/_layouts',
        partialsDir: 'views/_partials',
        helpers: {
            section: express_handlebars_sections(),
<<<<<<< HEAD
            ifCond: require('./helpers/ifCond.helper').ifCond,
=======
            fromNow: function(date) {
                return moment(date).fromNow();
            },
>>>>>>> cf7e7fdc004c2e6317d08cb1085ca0b0bcdf3a56
        },
    })
);
app.set('view engine', '.hbs');

// cookies
app.use(cookieParser(secret_session));
// req.body
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// connect mongoDB
db.connectMongoDB(mongo_url);

app.use(localmdw.localsUser);

app.use('/account', authRoutes);

app.use('/course', courseRoutes);

app.use('/teacher', teacherRoutes);

app.use('/category', categoryRoutes);

app.use('/cart', cartRoutes);

app.use('/admin', adminRoutes);

app.use('/', homeRoutes);

//app.use('/admin')

// request not found
app.use(function (req, res) {
    res.render('404');
});

// default error handler
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.render('500', {
        layout: false,
    });
});

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
