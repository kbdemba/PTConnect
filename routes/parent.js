var express = require('express');
var router = express.Router();
const passport = require("Passport");
const User = require("../models/user");
const Classroom = require("../models/classroom");
const Parent = require("../models/parent");
const Teacher = require("../models/teacher");
const {isParentLoggedIn} = require("../middleware");

//parent dashboard show all the students for now v1
router.get('/', isParentLoggedIn , (req, res, next)=> {
  // MIDDLEWARE
  const userId= req.user._id
  Parent.findOne({user: userId }, (err, parent)=>{
     if(err){console.log(err)}else{
       //render the page and send along the parent
       res.render('parent/index', {parent:parent});// the ejs will do the rest
     }//else
  });
});

//if parents update or send a message
//maybe this can be a post instead of put
//let this be a POST not Put
//MAKE SURE THE USER == PARENT
// version 2 will have a better MESSAGING sYSTEM V2
router.post("/:parentid/message", isParentLoggedIn, function(req,res){
  //you can use id uptop or use the user thats looged in
  const parentId = req.params.parentid
  //this migh be a teacher
  //const userId= req.user._id

  //use the message property and add the message in there
  //find the parent
  //then add the message from the body to the message property
  //then save it
  //then redirect back to the parents dashboard to show the message

  //find the class teacher as well and show him

    Parent.findById(parentId, (err, parent)=>{
        if(err){
            console.log(err);
            req.flash("error", err.message);
        }else{
          //this message will have a user id, do you want that?
          const message = {};
          message.author = "parent"; //so that if its the teacher that writes the message
          message.message = req.body.message;
          parent.messages.push(message);
          parent.save();
            //req.flash("success", "successfully updated the Parent");
            //console.log(req.body.message, "message")
          req.flash("success", ` Message successfully sent to parent`);
          res.redirect(`/parent`);
        }
    });
});


module.exports = router;
