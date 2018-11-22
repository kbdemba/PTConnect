var express = require('express');
var router = express.Router();
const passport = require("Passport");
const User = require("../models/user");
const {isLoggedIn, isTeacherLoggedIn} = require("../middleware")


//this has to be included or there will be no strategy
//try to move it to controllers and see
passport.use(User.createStrategy());


/* GET home page. */
router.get('/', (req, res, next)=> {
  res.render('index');
});

/* GET Register the master*/
// onle the DEVELOPER CAN GET HERE
// The form input should ask a lot of question if you get to here to verify
router.get('/register/register-admin', (req, res, next) => {
  res.render('register-admin');
});


//this below is to be able register or add the master
/* create a user. */
//this role have to be a master to be able to create this
// router.post("/register", (req, res, next) => {
//     const code = req.body.code;
//     // this might not be the best
//     const newUser = new User({
//       username: req.body.username,
//       biography: req.body.biography,
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       avatar: req.body.avatar
//         })
//     const password = req.body.password;
//
//     if(code === "iamthecode"){
//         newUser.isAdmin = true;
//     }
//     console.log(" its registering");
//     //try and see if yoou can use async and await here
//     User.register(newUser, password , (err,createdUser) => {
//         if(err){
//             console.log(err);
//             req.flash("error", err.message);
//             return res.redirect("/register");
//         }
//         console.log(" its registering");
//         passport.authenticate("local"),(req,res,next) =>{
//             req.flash("success", "welcome " + createdUser.username + "!! you have successfully registered")
//             console.log(" its registering final");
//             res.redirect("/")
//         }
//     })
// });

/* get login for All*/
router.get('/master/login', (req, res, next) => {
  res.render('master/login');
});
router.get('/teacher/login', (req, res, next) => {
  res.render('teacher/login');
});
router.get('/parent/login', (req, res, next) => {
  res.render('parent/login');
});


/* post login */
            //master Login
router.post("/login/master", passport.authenticate("local", {
        successRedirect: "/master",
        failureRedirect: "/login",
        successFlash: "Successfully logged in",
        failureFlash: "Invalid username or password"
    }), function(req,res){}
 );
                  //teacher Login
 router.post("/teacher/login", passport.authenticate("local", {
         successRedirect: "/teacher",
         failureRedirect: "/teacher/login",
         successFlash: "Successfully logged in", //the welcome should be here
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
    req.flash("success", "you have successfully loged out!!");
    res.redirect("/");
});

module.exports = router;
