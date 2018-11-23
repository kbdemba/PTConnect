var express = require('express');
var router = express.Router();
const passport = require("Passport");
const User = require("../models/user");
const {isLoggedIn, isTeacherLoggedIn} = require("../middleware")
const async = require("async"),
      nodemailer = require("nodemailer"),
      crypto = require("crypto");

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

/* forget passport */
router.get('/forgot', (req, res, next)=> {
  res.render('forgot');
});

/* forget passport */
router.post('/forgot', (req, res, next)=> {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          console.log(req.body.email)
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'kbdemba@gmail.com',
          pass: process.env.GMAILPW
          //pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'kbdemba@gmail.com',
        subject: 'PTConnect Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ],function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

/* reset passport */
router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

// after reseting, send them an email
router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        // Also should do client side validation
        if(req.body.password ===req.body.confirm){
          user.setPassword(req.body.password, function(err){
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          });
        }else{
          req.flash('error', 'Passwords do not match. ');
          return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'kbdemba@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed at PTConnect: ',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) { //error handling here
    //res.redirect(`/${req.user.role}`);
    res.redirect(`/`);
  });
});

// // after reseting, send them an email
// router.post('/reset/:token', function(req, res) {
//   async.waterfall([
//     function(done) {
//       User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
//         if (!user) {
//           req.flash('error', 'Password reset token is invalid or has expired.');
//           return res.redirect('back');
//         }
//
//         user.password = req.body.password;
//         user.resetPasswordToken = undefined;
//         user.resetPasswordExpires = undefined;
//
//         user.save(function(err) {
//           req.logIn(user, function(err) {
//             done(err, user);
//           });
//         });
//       });
//     },
//     function(user, done) {
//       var smtpTransport = nodemailer.createTransport('SMTP', {
//         service: 'SendGrid',
//         auth: {
//           user: '!!! YOUR SENDGRID USERNAME !!!',
//           pass: '!!! YOUR SENDGRID PASSWORD !!!'
//         }
//       });
//       var mailOptions = {
//         to: user.email,
//         from: 'passwordreset@demo.com',
//         subject: 'Your password has been changed',
//         text: 'Hello,\n\n' +
//           'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
//       };
//       smtpTransport.sendMail(mailOptions, function(err) {
//         req.flash('success', 'Success! Your password has been changed.');
//         done(err);
//       });
//     }
//   ], function(err) {
//     res.redirect('/');
//   });
// });




module.exports = router;
