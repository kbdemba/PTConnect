const createError = require('http-errors'),
      express = require("express"),
      path = require('path'),
      cookieParser = require('cookie-parser'),
      logger = require('morgan'),
      session = require('express-session'),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),  
      flash = require("connect-flash"),
      //middleware = require("./middleware"), //dont need the /index
      methodOverride = require("method-override"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      passportLocalMongoose = require("passport-local-mongoose"),
      ////Models
      User = require("./models/user");
      //Camp = require("./models/camp"),
      //Comment = require("./models/comment");



    // REQUIRING ROUTES
const indexRouter = require("./routes/index");
const masterRouter = require("./routes/master");
const teacher = require("./routes/teacher");
const parent = require("./routes/parent");


// this is the new one to do
//mongoose.connect('mongodb://localhost:27017/blackboard', { useNewUrlParser: true });
const app = express();
mongoose.connect('mongodb://localhost:27017/ptconnect', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=> {
  console.log("we're connected!")
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // change one
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(methodOverride("_method"));
app.use(flash());

//session configure
app.use(session({
  secret: 'anything ah anything',
  resave: false,
  saveUninitialized: true
}))

// configure Passport"
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//passport.use(User.createStrategy()); or use this one
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//mount routes
app.use('/', indexRouter);
app.use('/master', masterRouter);
app.use("/teacher", teacher);
app.use("/parent", parent);


// app.use('/post', postRouter);
// app.use('/review', reviewRouter);
// app.use('/users', usersRouter);
//
//
// app.use(indexRoutes);
// app.use(campgroundRoutes);
// app.use(commentRoutes);
// app.use(userRoutes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(3000, function(){
    console.log("Server is running");
});

////////////////////////////////////NEW NEW NEW ///////////////////
// const createError = require('http-errors');
// const express = require('express');
// const path = require('path');
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
// const bodyParser = require('body-parser');
// const session = require('express-session');
// const passport = require('passport');
// //const LocalStrategy = require('passport-local').Strategy;
// const mongoose = require('mongoose')
// const User = require("./models/user")
//
// const indexRouter = require('./routes/index');
// const postRouter = require('./routes/post');
// const reviewRouter = require('./routes/review');
// const usersRouter = require('./routes/users'); // this is not important
//
// const app = express();
// // connect to the database
// mongoose.connect('mongodb://localhost:27017/bitiko', { useNewUrlParser: true });
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', ()=> {
//   console.log("we're connected!")
// });
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
//
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// //session configure
// app.use(session({
//   secret: 'anything ah anything',
//   resave: false,
//   saveUninitialized: true
// }))
//
// // configure Passport"
// passport.use(User.createStrategy());
// app.use(passport.initialize());
// app.use(passport.session());
//
// //passport.use(new LocalStrategy(User.authenticate()));
//
//
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
//
// //mount routes
// app.use('/', indexRouter);
// app.use('/post', postRouter);
// app.use('/review', reviewRouter);
// app.use('/users', usersRouter);
//
// // app.post('/login',
// //   passport.authenticate('local', {
// //     successRedirect: '/',
// //     failureRedirect: '/login' }
// //   ));
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
//
// module.exports = app;
