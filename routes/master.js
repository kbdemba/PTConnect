var express = require('express');
var router = express.Router();
const passport = require("Passport");
const User = require("../models/user");
const Parent = require("../models/parent");
const Teacher = require("../models/teacher");
const Classroom = require("../models/classroom");

passport.use(User.createStrategy());


//seed//
//parent function createParents(pw, userName, parentToBeCreated)


// index of master/Principal
router.get('/', (req, res, next)=> {
  res.render('master/index');
});

//get the form to create a new Parent
router.get('/newParent', (req, res, next)=> {
  res.render('master/newParent');
});
//get the form to create a new teacher
router.get('/newTeacher', (req, res, next)=> {
  res.render('master/newTeacher');
});


//create a new parent
router.post('/newParent', (req, res, next)=> {

  //do a server side validation here also incase they use postman IN V2
  const parentToBeCreated = {
    parentName: req.body.parentName,
    studentName: req.body.studentName,
    email: req.body.email,
    className: req.body.className
  }

  const password = req.body.parentName;
  //username will be email IN V2
  const newUser = new User({
    username: req.body.parentName,
    role: "parent"
  })
  User.register(newUser, password , (err,createdUser) => {
      if(err){
          console.log('error while user register!', err);
          req.flash("error", err.message);
          return res.redirect("/master/newParent");
          //return next(err);
      }
      console.log(`user registered! ${createdUser.username}`);
      //after registration, create a parent and add the created user to it
      Parent.create(parentToBeCreated, (err, createdParent)=>{
        if(err){
          console.log('error while user register!', err);
          req.flash("error", err.message);
          //but delete the created user first then redirect back V2
          return res.redirect("/master/newParent");
        }else{
            console.log("Parent was created")

            //add the user-id to this parent
            createdParent.user = createdUser._id;
            createdParent.save()
            console.log(createdParent);

            //find the class that this parent is in
            //then add this parent to this class and save..
            Classroom.findOne({className: createdParent.className}, function(err, classroom){
              if(err){
                //do a better error handling here V2
                console.log(err)
              }else{
                classroom.students.push(createdParent);
                classroom.save()
                //with a flash
                res.redirect('/master');
              }
            })
        }
      })

  })
});


//create a new teacher
router.post('/newTeacher', (req, res, next)=> {
  //check the security you do in creating a parent and do the same for teacher V2;)
  const teacherToBeCreated = {
    name: req.body.name,
    email: req.body.email,
    className: req.body.className
  }

  // then create a User for the Parent
  const password = req.body.name ;
  const newUser = new User({
    username: req.body.name, //this might change to email V2
    role: "teacher"
  })
  User.register(newUser, password , (err,createdUser) => {
      if(err){
          console.log('error while user register!', err);
          req.flash("error", err.message);
          return res.redirect("/register");
          //return next(err);
      }
      console.log('user registered!');
        //after registration, create a teacher and add the created user to the teacher
      Teacher.create(teacherToBeCreated, (err, teacher)=>{
        if(err){
          console.log('error while user register!', err);
          req.flash("error", err.message);
          //but delete the created user first then redirect back
          return res.redirect("/master/newParent");
        }else{
            console.log(teacher);
            teacher.user = createdUser._id;
            teacher.save();

            //find the class that this teacher is in
            //then add this teacher to this class as the teacher and save..
            Classroom.findOne({className: teacher.className}, function(err, classroom){
              if(err){
                //do a better error handling here V2
                console.log(err)
              }else{
                console.log(classroom)
                classroom.teacher = teacher;
                classroom.save()
                console.log(classroom)
                //with a flash
                res.redirect('/master');
              }
            })

        }
      })
  })
});



//Edit a teacher or a student
router.get('/:id/edit-teacher', (req, res, next)=> {
  console.log("teacher-edit")
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
  Parent.findById(id, (err, parent)=>{
    //handle the error
    //if the found parent is null, dont allow it to get to the edit page V2
    if(err){
      console.log(err)
    }else{
        console.log(parent)
        //render the edit page with the found parent
        res.render("master/editParent", {parent})
      }
    })
});


//update teacher
router.put("/:id/teacher",function(req,res){
    const updateTeacher = {
      name: req.body.name,
      email: req.body.email,
      className: req.body.className
    }
    Teacher.findByIdAndUpdate(req.params.id, updateTeacher, function(err,teacher){
        if(err){
            console.log(err);
            req.flash("error", err.message);
        }else{
          console.log(teacher); // this does not show the updated teacher, but who cares V3
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
    email: req.body.email,
    className: req.body.className
  }
    Parent.findByIdAndUpdate(req.params.id, updateParent, function(err,parent){
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
//dont forget to delete it from a class as well V3

router.delete("/:id/teacher/delete", function(req,res){
    Teacher.findByIdAndRemove(req.params.id, function(err){
        if(err){ // its already handled in the middleware
            console.log(err);
            req.flash("error", err.message);
        }else{
            req.flash("success", "successfully deleted the teacher");
            res.redirect("/master");
        }
    });
});
//delete parent
router.delete("/:id/parent/delete", function(req,res){
    Parent.findByIdAndRemove(req.params.id, function(err){
        if(err){ // its already handled in the middleware
            console.log(err);
            req.flash("error", err.message);
        }else{
            req.flash("success", "successfully deleted the comment");
            res.redirect("/master/");
        }
    });
});

//also a function to create a Master User for MRS SHANON
// //-------------THIS CREATED THE INITIAL CLASSROOMS---------
function createTheInitialClassrooms(){
  Classroom.create({className: "grade1"});
  Classroom.create({className: "grade2"})
  Classroom.create({className: "grade3"})
  Classroom.create({className: "grade4"})
  Classroom.create({className: "grade5"})
  Classroom.create({className: "grade6"})
  console.log("classrooms created 1111111111111111111111111111")
}
//createTheInitialClassrooms()
//------------------END----------------------------------------

function createAParent(pw, userName, parentToBeCreated){
  const password = pw
  const newUser = new User({
    username: userName,
    role: "parent"
  })
  User.register(newUser, password , (err,createdUser) => {
      if(err){
          console.log(err);
      }
      console.log(`user registered! ${createdUser.username}`);
      //after registration, create a parent and add the created user to it
      Parent.create(parentToBeCreated, (err, createdParent)=>{
        if(err){
          console.log(err);
        }else{
            //add the user-id to this parent
            createdParent.user = createdUser._id;
            createdParent.save()
            console.log(createdParent);
            //find the class that this parent is in
            //then add this parent to this class and save..
            Classroom.findOne({className: createdParent.className}, function(err, classroom){
              if(err){
                console.log(err)
              }else{
                classroom.students.push(createdParent);
                classroom.save()
                console.log(classroom)
              }
            })
        }
      })

  })

}//end of create parents

function createATeacher(pw, userName, teacherToBeCreated){
  const password = pw
  const newUser = new User({
    username: userName,
    role: "teacher"
  })
  User.register(newUser, password , (err,createdUser) => {
      if(err){
          console.log('error while user register!', err);
      }
      console.log('user registered!');
        //after registration, create a teacher and add the created user to the teacher
      Teacher.create(teacherToBeCreated, (err, teacher)=>{
        if(err){
          console.log('error while user register!', err);
        }else{
            console.log(teacher);
            teacher.user = createdUser._id;
            teacher.save();

            //find the class that this teacher is in
            //then add this teacher to this class as the teacher and save..
            Classroom.findOne({className: teacher.className}, function(err, classroom){
              if(err){
                //do a better error handling here V2
                console.log(err)
              }else{
                classroom.teacher = teacher;
                classroom.save()
                console.log(classroom)
              }
            })

        }
      })
  })
}//create Teacher

function seedDB(callback){
  Teacher.deleteMany({}).then((ee)=>{console.log("teachers deleted")})
  Parent.deleteMany({}).then((ee)=>{console.log("Parents Deleted")})
  User.deleteMany({}).then((ee)=>{console.log("Users Deleted")})
  Classroom.deleteMany({}).then((ee)=>{createTheInitialClassrooms()})
  callback();
  //<========SEE HOW THE .THEN WORKS HERE =========>
//   Teacher.deleteMany({}).then((ee)=>{console.log("xxxcxc")})
//   Parent.deleteMany({})
//   .then((uu)=>{Teacher.deleteMany({})}).then((ee)=>{console.log("xxxcxc")})
//   .then((ee)=>{console.log("xxxcxc1111111")
//   Teacher.deleteMany({})
// }).then((ee)=>{console.log("xxxcxc00000")})
//   User.deleteMany({})
//   .then((uu)=>{Parent.deleteMany({})})
//   .then((xx)=>{Teacher.deleteMany({})})
//   .then((uu)=>{Classroom.deleteMany({})}).then((ee)=>{console.log("xxxcxc")})
}
//seedDB();

//parents
const parent1 = {
  parentName: "parent1",
  studentName: "student1",
  email: "1gg@gmail.com",
  className: "grade1",
  behavior: "good"
}
const parent2 = {
  parentName: "parent2",
  studentName: "student2",
  email: "2gg@gmail.com",
  className: "grade1",
  behavior: "naughty"
}
const parent3 = {
  parentName: "parent3",
  studentName: "student3",
  email: "3gg@gmail.com",
  className: "grade1",
  behavior: "good"
}
const parent4 = {
  parentName: "parent4",
  studentName: "student4",
  email: "4gg@gmail.com",
  className: "grade1",
  behavior: "good"
}
const parent5 = {
  parentName: "parent5",
  studentName: "student5",
  email: "5gg@gmail.com",
  className: "grade1",
  behavior: "good"
}
const parent6 = {
  parentName: "parent6",
  studentName: "student6",
  email: "6gg@gmail.com",
  className: "grade1",
  behavior: "good"
}

//Teachers
const teacher1 = {
  name: "teacher1",
  email: "1gg@gmail.com",
  className: "grade1"
}
const teacher2 = {
  name: "teacher2",
  email: "2gg@gmail.com",
  className: "grade2"
}
const teacher3 = {
  name: "teacher3",
  email: "3gg@gmail.com",
  className: "grade3"
}
const teacher4 = {
  name: "teacher4",
  email: "4gg@gmail.com",
  className: "grade4"
}
const teacher5 = {
  name: "teacher5",
  email: "5gg@gmail.com",
  className: "grade5"
}
const teacher6 = {
  name: "teacher6",
  email: "6gg@gmail.com",
  className: "grade6"
}
//createATeacher(pw , userName, teacher1)
//createAParent("hbdjhb", "hhaa", parent1)

function callbackfunc(){
  //               pw     username
  createATeacher("kebz" , "Kebz", teacher1);
  createATeacher("omar" , "Omar", teacher2);
  createATeacher("safla" , "Safla", teacher3);
  createATeacher("ali" , "Ali", teacher4);
  createATeacher("daddy" , "Daddy", teacher5);
  createATeacher("pajobe" , "PaJobe", teacher6);

  //              pw     username
  createAParent("lamin", "Lamin", parent1);
  createAParent("buba", "Buba", parent2);
  createAParent("binta", "Binta", parent3);
  createAParent("rohey", "Rohey", parent4);
  createAParent("yai", "Yai", parent5);
  createAParent("abou", "Abou", parent6);
}

//its still not working properly
//seedDB(callbackfunc);


//add messages to the Parent Messages
function xxx(id){
  Parent.findById(id, (err, parent)=>{
    if(err){
      //BETTER ERROR handling
      console.log(err)
    }else{
      //this message will have a user id, do you want that?
      const message = {};
      message.author = "student"; //so that if its the teacher that writes the message and this iss the teacher :)
      message.message = "habv hhh ahbsvahbv ah";
      parent.messages.push(message);
      parent.save();
      console.log("anah");
    }//else
  })
}

//teacher 3 5beb9081d926754137da7af3
const teacher3ID = "5beb9081d926754137da7af1";
const teacher2ID = "5beb9081d926754137da7af3";
const teacher1ID = "5beb9082d926754137da7af4";
const teacher4ID = "5beb9082d926754137da7af6";
const teacher5ID = "5beb9082d926754137da7af5";

//xxx(teacher3ID)
module.exports = router;
