var express = require('express');
var router = express.Router();
const passport = require("Passport");
const User = require("../models/user");
const Parent = require("../models/parent");
const Teacher = require("../models/teacher");

passport.use(User.createStrategy());

//-------------THIS CREATED THE INITIAL CLASSROOMS---------
const Classroom = require("../models/classroom");
// function createTheInitialClass(){
//   Classroom.create({className: "grade1"});
//   Classroom.create({className: "grade2"})
//   Classroom.create({className: "grade3"})
//   Classroom.create({className: "grade4"})
//   Classroom.create({className: "grade5"})
//   Classroom.create({className: "grade6"})
//   // this one is to add the student to a particular class
//   // find the class name
//   // then add the student to the class
// }
// createTheInitialClass()
//------------------END----------------------------------------

// User.find({}, function(err, classroom){
//   if(err){}else{
//     console.log(classroom.length)
//     // classroom.students.push(createdParent);
//     // classroom.save()
//   }
// })
// index of master
router.get('/', (req, res, next)=> {
  res.render('master/index');
});


//edit the individual student to add good or bad or need to talk
// add this prperty to the students.or parents model
//put the classrooom in the route so u know who the teacher is for the middleware maybe classId
//I think yu should just use user.role.
router.get('/:id/editStudent', (req, res, next)=> {
  Parent.findById(req.params.id, (err,student)=>{
    if(){console.log(err)}else{
      //render the page and fill the form with wether he is doing good or not
      //and a form to write something
      //res.render('teacher/editStudent', {student:student.behavior})
    }
  })
  res.send('teacher/editStudent');
});
// update it here and send the teacher back
router.put('/:id/editStudent', (req, res, next)=> {
  Parent.findByIdAndUpdate(req.params.id, req.body.comment, (err,student)=>{
    if(err){console.log(err)}else{
      //make a flash and redirect somewhere
    }
  })
  res.send('teacher/editStudent');
});

//Now if parents log in
router.get('/:id/parent', (req, res, next)=> {
  Parent.findById(req.params.id, (err,parent)=>{
    if(err){console.log(err)}else{
      //parent should have a refernce to a student
      //render a page giving parent
    }
  });
  res.render('master/index');
});



//this might be for the later version
//all teachers
router.get('/teacher', (req, res, next)=> {
  //find all the teachers and render it
  res.render('master/teachers');
});
//all parents
router.get('/parents', (req, res, next)=> {
  //find all the parents and render it
  res.render('master/parents');
});

//get the form to create a new teacher
router.get('/newTeacher', (req, res, next)=> {
  res.render('master/newTeacher');
});
//get the form to create a new Parent
router.get('/newParent', (req, res, next)=> {
  res.render('master/newParent');
});


//create a new parent
router.post('/newParent', (req, res, next)=> {
  //if the code is secretCode is wrong, send them back to the index master
  // get the information and save it on a variable
  // create a ParentName
  // then create a User for the Parent// this one first then create a parent then add to class.
  //or create a parent and a user at the same time
  // then redirect back to master

  // if(req.body.code != "parentCode"){
  //   res.redirect("/master")//with a flash
  // }
  // get the information and save it on a variable
  //console.log(req.body)
  const ptobecreated = {
    parentName: req.body.parentName,
    studentName: req.body.studentName,
    className: req.body.className
  }
  // create a Parent
  // Parent.create(ptobecreated, (err, createdParent)=>{
  //   if(err){
  //       console.log("there was and error")
  //   }else{
  //       console.log(createdParent);
  //   }
  // })
  // then create a User for the Parent
  let password = req.body.studentName + req.body.ssn;
  const newUser = new User({
    username: req.body.parentName
  })
  User.register(newUser, password , (err,createdUser) => {
      if(err){
          console.log('error while user register!', err);
          req.flash("error", err.message);
          return res.redirect("/register");
          //return next(err);
      }
      console.log('user registered!');
      Parent.create(ptobecreated, (err, createdParent)=>{
        if(err){
            console.log("there was and error")
        }else{
            console.log("Parent was created")
            console.log(createdParent);
            //find the class that this parent is in
            //then add this parent to this class and save..
            Classroom.findOne({className: createdParent.className}, function(err, classroom){
              if(err){console.log(err)}else{
                console.log(classroom)
                console.log(classroom.students)
                classroom.students.push(createdParent);
                classroom.save()
                res.redirect('/master');
              }
            })
        }
      })

  })
});


//create a new teacher
router.post('/newTeacher', (req, res, next)=> {
  const teacherToBeCreated = {
    name: req.body.name,
    className: req.body.className
  }
//console.log(teacherToBeCreated)
  // then create a User for the Parent
  const password = req.body.name + req.body.ssn;
  const newUser = new User({
    username: req.body.name //this might change to email
  })
  User.register(newUser, password , (err,createdUser) => {
      if(err){
          console.log('error while user register!', err);
          req.flash("error", err.message);
          return res.redirect("/register");
          //return next(err);
      }
      console.log('user registered!');
        // create a teacher
      Teacher.create(teacherToBeCreated, (err, teacher)=>{
        if(err){
            console.log("there was and error")
        }else{
            console.log(teacher);
            //find the class that this parent is in
            //then add this parent to this class and save..
            Classroom.findOne({className: teacher.className}, function(err, classroom){
              if(err){console.log(err)}else{
                console.log(classroom)
                //find a way to tell the master that the teacher is already been created
                // let teacher have an id then a Name at the model like the comment
                classroom.teacher = teacher;
                classroom.save()
                console.log(classroom)
                res.redirect('/master');
              }
            })

        }
      })
  })
  // then redirect back to master

  // console.log("this")
  // console.log(req.body)
  //res.redirect('/master'); // with a flash message
});



//Edit a teacher or a student
router.get('/:id/edit-teacher', (req, res, next)=> {
  const id = req.params.id

    Teacher.findById(id, (err, teacher)=>{
      if(err){
        console.log(err)
      }else{
      //render the edit page with the found teacher
      res.render("master/editTeacher", {teacher})
    }
    })

});
router.get('/:id/edit-parent', (req, res, next)=> {
  const id = req.params.id
  if(err){
    console.log(err)
  }else{
    Teacher.findById(id, (err, parent)=>{
      //render the edit page with the found parent
      res.render("master/editParent", {parent})
    })
  }
});


//update teacher
//router.put("/campground/:id/comment/:commentId", middleware.isTheCommentOwner,function(req,res){
router.put("/:id/teacher",function(req,res){
    const updateTeacher = {
      name: req.body.name,
      className: req.body.className
    }
    Teacher.findByIdAndUpdate(req.params.id, updateTeacher, function(err,foundComment){
        if(err){
            console.log(err);
            req.flash("error", err.message);
        }else{
            req.flash("success", "successfully updated the comment");
            res.redirect("/master");
        }
    });
});

//update parent
router.put("/:id/parent",function(req,res){
  const updateParent = {
    parentName: req.body.parentName,
    studentName: req.body.studentName,
    className: req.body.className
  }
    Parent.findByIdAndUpdate(req.params.id, updateParent, function(err,foundComment){
        if(err){
            console.log(err);
            req.flash("error", err.message);
        }else{
            req.flash("success", "successfully updated the Parent");
            res.redirect("/master");
        }
    });
});

//delete teacher dnt forget the middleware
//router.delete("/campground/:id/comment/:commentId/delete", middleware.isTheCommentOwner ,function(req,res){
router.delete("/:id/teacher/delete", function(req,res){
    Teacher.findByIdAndRemove(req.params.id, function(err){
        if(err){ // its already handled in the middleware
            console.log(err);
            req.flash("error", err.message);
        }else{
            req.flash("success", "successfully deleted the comment");
            res.redirect("/master");
        }
    });
});
//delete parent
router.delete("/:id/parent/delete", function(req,res){
    Comment.findByIdAndRemove(req.params.id, function(err){
        if(err){ // its already handled in the middleware
            console.log(err);
            req.flash("error", err.message);
        }else{
            req.flash("success", "successfully deleted the comment");
            res.redirect("/master/");
        }
    });
});

module.exports = router;
