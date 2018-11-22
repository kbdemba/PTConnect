var express = require('express');
var router = express.Router();
const passport = require("Passport");
const User = require("../models/user");
const Classroom = require("../models/classroom");
const Parent = require("../models/parent");
const Teacher = require("../models/teacher");
const {isTeacherLoggedIn, isClassTeacher} = require("../middleware");


//teacher dashboard show all the students for now v1
//router.get('/', isTeacherLoggedIn, (req, res, next)=> {
router.get('/', isTeacherLoggedIn, (req, res, next)=> {
  // if no teacher is logged in, send them back
  // if the one logged in is a parent, send them to parent homepage -MIDDLEWARE
  const userId= req.user._id
  //find the classroom that the teacher is in
  //get all the students from that classroom and render them all
  Teacher.findOne({user: userId }, (err, teacher)=>{
     if(err){console.log(err)}else{
       //the teacher can have a property that will lead to the classroom that she teaches V3
       const className = teacher.className;
       Classroom.findOne({className}).populate("students").exec((err,classroom)=>{
         if(err){console.log(err)}else{
            const students = classroom.students
           console.log(classroom.students, "students")
            res.render('teacher/index', {students, teacher});// the ejs will do the rest
         }//second else
       })
     }//else
  });
});

//show the individual student or parent to edit then redirect back to the teachers home
//only allowed if the teacher is the classTeaacher for the class that this parent is in MIDDLEWARE
//router.get('/:parentId/show', isTeacherLoggedIn, isClassTeacher, (req, res, next)=> {
// router.get('/:parentId/show', isClassTeacher, (req, res, next)=> {
router.get('/:parentId/show', isTeacherLoggedIn, (req, res, next)=> {
  //find the parent and render
  //make it a way that it will be easy to retrieve a parent from a teacher or a teacher from a parent
  Parent.findById(req.params.parentId, (err, parent)=>{
    if(err){console.log(err)}else{
      // render the show page of the student
      // the teacher can now edit the good Or Bad behavior here
      //console.log(typeof(req.user._id))
      //const teacherName= req.user.username
      //res.render("teacher/showStudent", {student:parent})
      res.render("teacher/student-show", {student:parent})

    }//else
  })
});

//update the behavior and be able to send a message
//is this possible not now check below on how i wanted to do it
//this should JUST be a POST, NAA cus its already been saved, its the default
router.put('/:parentId', isTeacherLoggedIn, (req, res, next)=> {
  //make sure the behavior can only be 3 things, if not, send them back V2
  const behavior = {behavior: req.body.behavior}
  Parent.findByIdAndUpdate(req.params.parentId, behavior, (err, parent)=>{
    if(err){
      //better error handling V2
      console.log(err)
    }else{
      req.flash("success", ` YOU HAVE UPDATED THE BEHAVIOR: ${req.body.behavior}`);
      res.redirect(`/teacher/${req.params.parentId}/show`)
    }//else
  })
});

// Send a message to the parent
// Who can send a message to the Parent MIDDLEWARE
router.post('/:parentId/message', isTeacherLoggedIn, (req, res, next)=> {
  //find the parent and render
  Parent.findById(req.params.parentId, (err, parent)=>{
    if(err){
      //BETTER ERROR handling
      console.log(err)
    }else{
      //this message will have a user id, do you want that?
      const message = {};
      message.author = "teacher"; //
      message.message = req.body.message;
      parent.messages.push(message);
      parent.save();
      //or redurect to teacher/parentid/show
      req.flash("success", ` Message successfully sent to: ${parent.parentName}`);
      res.redirect(`/teacher/${req.params.parentId}/show`)
    }//else
  })
});

//make the delete for teachers




///////////////////////////////////////////////////////////////////////

// // make user available to all the views
// // get the students in the class if the teacher logs in
// //the id in the rouutes will be from the user or someting to do with the user
// // or teachr/:id/dashboard
// //if a teacher has many classes, then it asks you which class do you want to login as
// router.get('/:id/dashboard', (req, res, next)=> {
//   Teacher.findById(req.params.id, (err, teacher)=>{
//     if(err){console.log(err)}else{
//       // the teacher can have a property that will lead to the classroom that she teaches
//       const className = teacher.className
//       Classroom.find({className: className}, (err,classroom)=>{
//         if(err){console.log(err)}else{
//           //render the page and send along the students array where the parents are
//           //const students = classroom.students
//           //res.render('teacher/index', {students:students});// the ejs will do the rest
//           //bbostrap to show the llist
// //           <div class="list-group">
// //   <a href="#" class="list-group-item">First item</a>
// //   <a href="#" class="list-group-item">Second item</a>
// //   <a href="#" class="list-group-item">Third item</a>
// // </div>
//         }//second else
//       })
//     }//else
//   })
//   res.send('teacher/index');
// });
//
// //teacher to show a student and see the messages and edit students behavior
// router.get('/parent/:parentid', (req, res, next)=> {
//   Parent.findById(req.params.parentid, (err, parent)=>{
//     if(err){console.log(err)}else{
//       // render the show page of the student
//       // the teacher can now edit the good Or Bad behavior here
//       // res.render("teacher/showStudent", {parent:parent})
//     }//else
//   })
//   //res.render('registerTeacher');
// });
//
// //teacher to update the behavior and be able to send a message
// router.put("/parent/:parentid",function(req,res){
//   //use the behavior property and update
//   const updateParent = {
//     parentName: req.body.parentName,
//     studentName: req.body.studentName,
//     className: req.body.className
//   }
//     Parent.findByIdAndUpdate(req.params.id, updateParent, function(err,foundComment){
//         if(err){
//             console.log(err);
//             req.flash("error", err.message);
//         }else{
//             req.flash("success", "successfully updated the Parent");
//             res.redirect("/master");
//         }
//     });
// });

///////////////////////////////////////////////////////////////////////

module.exports = router;


//-------------------------How it used to Loook--------------------------//

// router.post('/teacher/register', (req, res, next)=> {
//   const newUser = new User({
//     username: req.body.username
//   })
//   if (req.body.code = "iamthecode") {
//     newUser.isTeacher = true;
//   } //
//   //try and see if yoou can use async and await here
//   User.register(newUser, req.body.password , (err,createdUser) => {
//       if(err){
//           console.log('error while user register!', err);
//           req.flash("error", err.message);
//           return res.redirect("/register");
//           //return next(err);
//       }
//       console.log('user registered!');
//
//       res.redirect('/');
//
//   })
//   //res.send('registerTeacher');
// });

// router.get('/teacher/addNew', (req, res, next)=> {
//   res.render('registerStudent');
// });

// router.post('/teacher/addNewStudent', (req, res, next)=> {
//   //create a new user
//   console.log(req.body)
//   let password = req.body.studentName + req.body.ssn;
//   let username = req.body.studentName + req.body.ParentName
//
//   const newUser = new User({
//     username: username
//   })
//   User.register(newUser, password , (err,createdUser) => {
//       if(err){
//           console.log('error while user register!', err);
//           req.flash("error", err.message);
//           return res.redirect("/register");
//           //return next(err);
//       }
//       console.log('user registered!');
//       res.redirect('/');
//   })
//
//
// });


// router.get('/teacher/xxxx', (req, res, next)=> {
//   // class is already created
//   //Class.find({name:})
// });

//module.exports = router;
