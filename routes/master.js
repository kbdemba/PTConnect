var express = require('express');
var router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Parent = require("../models/parent");
const Teacher = require("../models/teacher");
const Classroom = require("../models/classroom");
const {isLoggedIn, isTeacherLoggedIn, isMasterLoggedIn} = require("../middleware")

//this has to be included or there will be no strategy
//try to move it to controllers and see
passport.use(User.createStrategy());

//add the classes
//createTheInitialClassrooms()

// GET home-page/index for master/Principal have a link to show all the Parents, students, and classes
// You can only see them but not communicate with them
router.get('/', (req, res, next)=> {
  res.render('master/index');
});

//get all parents, here you can view either parents or students
router.get('/all-parents', (req, res, next)=> {
  //maybe do a pagination in it
  console.log("all parent")
  Parent.find({}, (err, found_parents)=>{
    if(err){
      console.log(err)
      //do something better
    }else{
      res.render("master/all-parents", {parents:found_parents})
    }
  })
});

//get all teachers
router.get('/all-teachers', (req, res, next)=> {
  //maybe do a pagination in it
  Teacher.find({}, (err, found_teachers)=>{
    if(err){
      console.log(err)
      //do something better
    }else{
      res.render("master/all-teachers", {teachers:found_teachers})
    }
  })
});

//get all classrooms
router.get('/all-classrooms', (req, res, next)=> {
  //maybe do a pagination in it
  Classroom.find({}, (err, classrooms)=>{
    if(err){
      console.log(err)
      //do something better
    }else{
      res.render("master/all-classrooms", {classrooms})
    }
  })
});

// show an individual parent
router.get('/:id/show-parent', (req, res, next)=> {
  const id = req.params.id
  Parent.findById(id, (err, parent)=>{
    //handle the error
    //if the found parent is null, dont allow it to get to the edit page V2
    if(err || parent.length < 1){
      console.log(err)
      req.flash("error", "cannot find to view the parent");// i doubt this will ever happen unless u intentionally do it
      return res.redirect("/..")
    }else{
        console.log(parent)
        //render the show page with the found parent
        res.render("master/show-parent", {parent})
      }
    })
});

// show an individual teacher
router.get('/:id/show-teacher', (req, res, next)=> {
  const id = req.params.id
  Teacher.findById(id, (err, teacher)=>{
    //handle the error
    //if the found teacher is null, dont allow it to get to the edit page V2
    if(err || teacher.length < 1){
      console.log(err)
      req.flash("error", "cannot find to show teacher");// i doubt this will ever happen unless u intentionally do it
      return res.redirect("/..")
    }else{
        console.log(teacher)
        //render the show page with the found teacher
        res.render("master/show-teacher", {teacher})
      }
    })
});

// show an individual classroom
router.get('/:id/show-classroom', (req, res, next)=> {
  const id = req.params.id
  Classroom.findById(id, (err, classroom)=>{ // populate them by their last name
    //handle the error
    //if the found classroom is null, dont allow it to get to the edit page V2
    if(err || classroom.length < 1){
      console.log(err)
      req.flash("error", "cannot find classroom");// i doubt this will ever happen unless u intentionally do it
      return res.redirect("/..")
    }else{
        console.log(classroom)
        //render the show page with the found classroom
        res.render("master/show-classroom", {classroom})
      }
    })//end of the first find
});


//get the form to create a new teacher
router.get('/new-teacher', (req, res, next)=> {
  res.render('master/new-teacher');
});

//get the form to create a new parent
router.get('/new-parent', (req, res, next)=> {
  res.render('master/new-parent');
});


//create a new parent
router.post('/new-parent', (req, res, next)=> {

  //do a server side validation here also incase they use postman IN V2

  const parent_to_be_created = {
      parent_name: {first_name: req.body.parent_first_name,
                    last_name: req.body.parent_last_name},
      student_name: {first_name: req.body.student_first_name,
                    last_name: req.body.student_last_name},
      email: req.body.email,
      class_name: req.body.class_name
   }
   console.log(parent_to_be_created.parent_name.first_name)

  //make a temporary password (parents first_name + students first_name)
  const password = req.body.parent_first_name + req.body.student_first_name;
  //username will be email IN V2
  //change the way you do it here, below is not realistic
  const new_user = new User({
    username: req.body.email, // i should not username here, i will just tell passport to use email
    email:req.body.email,
    role: "parent"
  })

  User.register(new_user, password , (err,created_user) => {
      if(err){
          console.log('error while user register!', err);
          req.flash("error", err.message);
          return res.redirect("/master/newParent");
          //return next(err);
      }
      console.log(`user registered! ${created_user.username}`);
      //after registration, create a parent and add the created user to it
      Parent.create(parent_to_be_created, (err, created_parent)=>{
        if(err){
          console.log('error while user register!', err);
          req.flash("error", err.message);
          //but delete the created user first then redirect back V2
          return res.redirect("/master/newParent");
        }else{
            console.log("Parent was created")
            //add the user-id and user name to this parents user
            created_parent.user.id = created_user._id;
            created_parent.user.name_to_display = created_parent.parent_name.first_name; // i dont think i need this
            created_parent.save()
            console.log(created_parent);
            //find the class that this parent is in
            //then add this parent to this class and save..
            Classroom.findOne({class_name: created_parent.class_name}, function(err, classroom){
              if(err){
                //do a better error handling here V2
                console.log(err)
              }else{
                classroom.students.push(created_parent);
                classroom.save()
                //with a flash
                req.flash("success", `you have successfully created a new parent into the dtabase`)
                res.redirect('/master');
              }
            })
        }
      })
  })
  //res.send(req.body)
});

//createTheInitialClassrooms()
//create a new teacher
router.post('/new-teacher', (req, res, next)=> {
  //check the security you do in creating a parent and do the same for teacher V2;)
  const teacher_to_be_created = {
    name: {first_name: req.body.name_first_name,
                  last_name: req.body.name_last_name},
    email: req.body.email,
    class_name: req.body.class_name
  }

  //then create a User for the Parent
  //tempoary password is the first_name + last_name no spaces
  const password = req.body.name_first_name + req.body.name_first_name ;
  const new_user = new User({
    username: req.body.email, //this might change to email V2
    email: req.body.email,
    role: "teacher"
  })
  User.register(new_user, password , (err,created_user) => {
      if(err){
          console.log('error while user register!', err);
          req.flash("error", err.message);
          return res.redirect("/master/new-teacher");
          //return next(err);
      }
      console.log('user registered!');
        //after registration, create a teacher and add the created user to the teacher
      Teacher.create(teacher_to_be_created, (err, created_teacher)=>{
        if(err){
          console.log('error while user register!', err);
          req.flash("error", err.message);
          //but delete the created user first then redirect back
          return res.redirect("/master/newParent");
        }else{
            console.log(created_teacher);
            created_teacher.user.id = created_user._id;
            // created_parent.user.name_to_display = created_parent.parent_name.first_name;
            created_teacher.user.name_to_display = created_teacher.name.first_name;
            created_teacher.save();

            //find the class that this teacher is in
            //then add this teacher to this class as the teacher and save..
            Classroom.findOne({class_name: created_teacher.class_name}, function(err, classroom){
              if(err){
                //do a better error handling here V2
                console.log("class lenght")
                console.log(err)
              }else{
                console.log(classroom)
                classroom.teacher.id = created_teacher.id;
                classroom.teacher.name = created_teacher.name;// this should have both first and last name
                classroom.save()
                console.log(classroom)
                //with a flash

                req.flash("success", `you have successfully created a new Teacher into the database`)
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
      res.render("master/edit-teacher", {teacher})
    }
    })

});
router.get('/:id/edit-parent', (req, res, next)=> {
  const id = req.params.id
  Parent.findById(id, (err, parent)=>{
    //handle the error
    //if the found parent is null, dont allow it to get to the edit page V2
    if(err || parent.length < 1){
      console.log(err)
      req.flash("error", "cannot find the edit parent");// i doubt this will ever happen unless u intentionally do it
      return res.redirect("/..")
    }else{
        console.log(parent)
        //render the edit page with the found parent
        res.render("master/edit-parent", {parent})
      }
    })
});


//update teacher
router.put("/:id/teacher",function(req,res){
    const update_teacher = {
      name: {first_name: req.body.name_first_name,
            last_name: req.body.name_last_name},
      email: req.body.email, // still will have to log-in with the old email for now
      class_name: req.body.class_name
    }
    Teacher.findByIdAndUpdate(req.params.id, update_teacher, function(err,teacher){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/..")
        }else{
          console.log(teacher); // this does not show the updated teacher, but who cares V3
            req.flash("success", "you have successfully updated the teacher");
            res.redirect("/master");
        }
    });
});

//update parent
router.put("/:id/parent",function(req,res){
  const update_parent = {
    parent_name: {first_name: req.body.parent_first_name,
                  last_name: req.body.parent_last_name},
    student_name: {first_name: req.body.student_first_name,
                  last_name: req.body.student_last_name},
    email: req.body.email, // this will not change the username to use to log in
    class_name: req.body.class_name
  }
    Parent.findByIdAndUpdate(req.params.id, update_parent, function(err,parent){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/..");
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
  Classroom.create({class_name: "grade1"});
  Classroom.create({class_name: "grade2"})
  Classroom.create({class_name: "grade3"})
  Classroom.create({class_name: "grade4"})
  Classroom.create({class_name: "grade5"})
  Classroom.create({class_name: "grade6"})
  console.log("classrooms created 1111111111111111111111111111")
}
//createTheInitialClassrooms()
module.exports = router;



//-----------------------------------------------------END------------------------------------------------------

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
// module.exports = router;
