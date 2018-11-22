const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//this should be called Students
const ParentSchema = new Schema({
    user: {
            id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
          name_to_display: String // i dont think i need this
    },
    parent_name: {first_name: String,
                 last_name: String},
    student_name: {first_name: String,
                 last_name: String},
    //dateOfBirth: in the version 2
    email: String,
    class_name: String,
    behavior: {type: String,
              default:"good"},
    messages:[{
      author:String,
      message:String,
      date: {
        type: Date,
        default: Date.now
      }
    }]

});// you can get the teacher from the classroom or i will add in v2


module.exports = mongoose.model("Parent", ParentSchema);
// thats how messages used to look like
// messages:[{
//   author:{
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User"
//           },
