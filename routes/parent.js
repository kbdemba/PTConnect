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
  //db.inventory.find( { "size.uom": "in" } )
  Parent.findOne({"user.id" : userId,  }, (err, parent)=>{
     if(err){
       console.log(err)
     }else{
       // find the teachers classroom and get the teachers name
       //or add the techer to the parents model to know their teachers name VVVV2222
       Classroom.findOne({class_name: parent.class_name}, function(err, classroom){
         if(err){
           //do a better error handling here V2
           console.log(err)
         }else{

           const class_teacher = classroom.teacher.name;
           //req.flash("success", `Welcome ${parent.parent_name.first_name} ${parent.parent_name.last_name}`)
           //this flash up,  sholud be where the user is authenticated
           //render the page and send along the parent and the teacher
           res.render('parent/index', {parent, class_teacher});// the ejs will do the rest
         }
       })
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
          req.flash("success", ` Your Message successfully sent to parent`);
          res.redirect(`/parent`); //v2 this might be a message link or v3 like a socket io
        }
    });
});


module.exports = router;
