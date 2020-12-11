require('dotenv').config();
// async-error-handler
require('express-async-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
var session = require('express-session');
var express_handlebars_sections = require('express-handlebars-sections');
const authRoutes = require('./routes/auth.route');


const key = require('./config/main.config');
const {port, mongo_url, secret_session} = key;

const db = require('./db');
const app = express();

// express sessions
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

// static file
app.use('/public', express.static('public'))

app.engine('hbs', exphbs({
  defaultLayout: 'main.hbs',
  extname: '.hbs',
  layoutsDir: 'views/_layouts',
  partialsDir: 'views/_partials',
  helpers: {
    section: express_handlebars_sections(),
  }
}));
app.set('view engine', '.hbs');


// cookies
app.use(cookieParser(secret_session));


// req.body
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


// connect mongoDB
db.connectMongoDB(mongo_url);


app.use('/login', authRoutes);

app.get('/', (req, res)=> {
  res.render('home');
});

//app.use('/admin')

// request not found
app.use(function(req, res) {
  res.render('404');
})

// default error handler
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.render('500', {
    layout: false
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});


