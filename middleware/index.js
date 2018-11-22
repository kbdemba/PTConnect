const User = require("../models/user");
const Classroom = require("../models/classroom");
const Parent = require("../models/parent");
const Teacher = require("../models/teacher");

const middlewares = {
  isLoggedIn: function(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }else{
      res.send("Needs to be logged in")
      //res.redirect("/teacher/login")
    }
  },
  isMasterLoggedIn: function(req,res,next){
    if(req.isAuthenticated()){
      if(req.user.role === "master"){
        return next()
      }else{
        req.flash("error", `you do not have permission to do that, you need to be signed in as a master`)
        res.redirect(`/${req.user.role}`)
      }
    }else{
      res.send("Needs to be logged in")
      res.redirect("/master/login")
    }
  },
  isTeacherLoggedIn: function(req,res,next){
    if(req.isAuthenticated()){
      if(req.user.role === "teacher"){
        return next()
      }else{
        //send them back to /master or /parent
        //flash them that they do not have the permission to get here
        //infact, no normal user will ever get here
        //res.send(`you do not have permission to do that need to login as a Teacher /n redirect to ${req.user.role}`)
        req.flash("error", `you do not have permission to do that, you need to be signed in as a Teacher`)
        res.redirect(`/${req.user.role}`)
      }

    }else{
      //tell them nicely to please login
      req.flash("error", `please Signin first`)
      res.redirect(`/teacher/login`)
    }
  },
  isParentLoggedIn: function(req,res,next){
    if(req.isAuthenticated()){
      if(req.user.role === "parent"){
        return next()
      }else{
        //send them back to /master or /teacher
        //flash them that they do not have the permission to get here
        //infact, no normal user will ever get here
        req.flash("error", `you do not have permission to do that, you need to be signed in as a Parent`)
        res.redirect(`${req.user.role}`)
      }

    }else{
      //flash tell them nicely to please login
      console.log("hsdbcd");
      req.flash("error", "you need to be looged in as a parent first");
      res.redirect("/parent/login")
    }
  },
  //why class teacher - so other teachers cant send a message to other parents
  isClassTeacher: function(req,res,next){
    //first see if the user is a teacher,
    //then see if he is the teacher of the parent
    //find the classroom that the parent is in and see if the user/teacher is the
    Parent.findById(req.params.parentId, (err, parent)=>{
      if(err || !parent){
        //sorry teacher, cant find this studennt in your classroom
        //there was no parent found or error, cant locate the child
        console.log(err)
        //res.redirect("back")
        res.send("Error, Try again Later");
      }else{
        Classroom.findOne({className:parent.className}, (err, classroom)=>{
          if(err || !classroom){ //means there is no classroom
            //redirect with a message
            console.log(err)
            res.send("No classroom found or Error")
            //res.redirect("back")
          }else{
            if(classroom.teacher._id.equals(req.user._id)){
              return next()
            }else{
              //redirect saying sommething like you are not the teacher
              //do somethng better bro
              //res.redirect("back")
              res.send("you are not the teacher")

            }
          }
        })
      }
    })
  }//is class teacher
}


module.exports = middlewares
