var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");



//////// INDEX //////// BUT IT SHOULD NOT BE
router.get("/", function(req, res) {
    res.render("index");
    
});
//// REGISTRATION  
router.get("/register", function(req,res){
    res.render("register");
    //res.send("registration page")
});
router.post("/register", function(req,res){
    var code = req.body.code;
    var newUser = new User({
            username: req.body.username,
            biography: req.body.biography,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            avatar: req.body.avatar
        })
    var password = req.body.password;
    
    if(code === "iamthecode"){
        newUser.isAdmin = true;
    }
    User.register(newUser, password , function(err,createdUser){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res, function(){
            req.flash("success", "welcome " + createdUser.username + "!! you have successfully registered")
            res.redirect("/campground")
        })
    })
});

////// LOGIN //////
router.get("/login", function(req,res){
    res.render("login");
    //res.send("logging in")
});

router.post("/login", passport.authenticate("local", {
        successRedirect: "/campground",
        failureRedirect: "/login",
        successFlash: "Successfully logged in",
        failureFlash: "Invalid username or password"
    }), function(req,res){}
 );

/////logging OUT////
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "successfully loged out");
    res.redirect("/");
});

module.exports = router;
