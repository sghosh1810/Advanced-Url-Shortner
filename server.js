//Importing all libs
const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser')
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const { compile } = require('morgan');

//Dev dependency
require('dotenv').config();


//Start Express
const app = express();

//Passport config
require('./config/passport')(passport);

//Mongoose connection
mongoose
  .connect(
    process.env.DATABASE_URI,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


//Routes Handler
urlRouter = require('./route/url');
userRouter = require('./route/users');
dashboardRouter = require('./route/dashboard');
indexRouter = require('./route/index');


//Middlewares
app.use(expressLayouts);
app.set('view engine','ejs');
app.set('layout','layouts/dashboard/layout')
app.set('views', path.join(__dirname, 'views'));
app.use(helmet());
//app.use(morgan('common'));
app.use(bodyParser.urlencoded({limit:'10mb', extended:true}))
app.use(express.json());
app.use('/',express.static(path.join(__dirname, 'public')));
app.use('/users',express.static(path.join(__dirname, 'public')));
app.use('/dashboard',express.static(path.join(__dirname, 'public')));

//Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
  
// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes Handler
app.use('/url',urlRouter);
app.use('/users', userRouter);
app.use('/dashboard', dashboardRouter);
app.use('/',indexRouter);

//404 redirects
app.use((req, res, next) => {
    res.status(404).sendFile('public/static/404.html', {root: path.join(__dirname)});
});

//Ports for usage
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on ${process.env.HOST}:${port}`);
})
