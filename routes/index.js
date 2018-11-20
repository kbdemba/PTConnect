var express = require('express');
var router = express.Router();
const passport = require("Passport");
const User = require("../models/user");
const {isLoggedIn, isTeacherLoggedIn} = require("../middleware")
// const {postRegister, postLogin, getLogout} = require("../controllers/index");
// const {errorHandler} = require("../middleware/index")

//this has to be included or there will be no strategy
//try to move it to controllers and see
passport.use(User.createStrategy());

//once a teacher is logged in, he/she comes here directly
// router.get('/teacherSucessFullyloggedIn', (req, res, next)=> {
//   res.send(`successfully loged in ${req.user}`);
// });

//once a parent is logged in, he/she comes here directly
// router.get('/parentSucessFullyloggedIn', (req, res, next)=> {
//   res.send(`successfully loged in ${req.user}`);
// });

// /* Testing for authentication */
// router.get('/1', isLoggedIn, (req, res, next)=> {
//   res.send('logged in');
// });
// ///is a teacher logged in
// router.get('/2', isTeacherLoggedIn, (req, res, next)=> {
//   res.send('a Teacher is logged in');
// });
// ///is a parent logged in
// router.get('/3', isTeacherLoggedIn, (req, res, next)=> {
//   res.send('a Parent is logged in');
// });


/* GET home page. */
router.get('/', (req, res, next)=> {
  res.render('index');
});
/* GET testing page. */
router.get('/showastudentfordevelopment', (req, res, next)=> {
  res.render('teacher/showStudent');
});

/* GET Register form */
router.get('/register', (req, res, next) => {
  res.render('register');
});

/* create a user. */
//this role have to be a master to be able to create this
router.post("/register", (req, res, next) => {
    const code = req.body.code;
    // this might not be the best
    const newUser = new User({
      username: req.body.username,
      biography: req.body.biography,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      avatar: req.body.avatar
        })
    const password = req.body.password;

    if(code === "iamthecode"){
        newUser.isAdmin = true;
    }
    console.log(" its registering");
    //try and see if yoou can use async and await here
    User.register(newUser, password , (err,createdUser) => {
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        console.log(" its registering");
        passport.authenticate("local"),(req,res,next) =>{
            req.flash("success", "welcome " + createdUser.username + "!! you have successfully registered")
            console.log(" its registering final");
            res.redirect("/")
        }
    })
});

/* get login not neccesary*/
router.get('/login', (req, res, next) => {
  res.render('login');
});
router.get('/teacher/login', (req, res, next) => {
  res.render('teacher/login');
});
router.get('/parent/login', (req, res, next) => {
  res.render('parent/login');
});


/* post login */
            //default
router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        successFlash: "Successfully logged in",
        failureFlash: "Invalid username or password"
    }), function(req,res){}
 );
                  //teacher Login
 router.post("/teacher/login", passport.authenticate("local", {
         successRedirect: "/teacher",
         failureRedirect: "/teacher/login",
         successFlash: "Successfully logged in",
         failureFlash: "Invalid username or password"
     }), function(req,res){}
  );
                  //Parent Login
router.post("/parent/login", passport.authenticate("local", {
        successRedirect: "/parent",
        failureRedirect: "/parent/login",
        successFlash: "Successfully logged in",
        failureFlash: "Invalid username or password"
    }), function(req,res){}
);


/* get logout */
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "successfully loged out");
    res.redirect("/");
});

/* get profile */
router.get('/profile', (req, res, next) => {
  res.send('edit a post');
});

/* edit profile */
router.post('/profile/:user-id', (req, res, next) => {
  res.send('loggin in');
});

module.exports = router;
