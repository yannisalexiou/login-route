// server.js

// set up ======================================================================
// get all the tools we need
const express  = require('express');
const path = require('path');
const app      = express();
const port     = process.env.PORT || 3000;
const mongoose = require('mongoose'); //Mongoose is object modeling for our MongoDB database.
const passport = require('passport'); //Passport stuff will help us authenticating with different methods.
const flash    = require('connect-flash'); //Connect-flash allows for passing session flashdata messages.
const exphbs = require('express-handlebars');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');

const configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.Promise = global.Promise;
mongoose.connect(configDB.url, { useMongoClient: true }); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars'); // set up ejs for templating

// required for passport
 // session secret
app.use(session({
    secret: 'ilovegio',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
