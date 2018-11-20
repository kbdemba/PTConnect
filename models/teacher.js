const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
  // user: {
  //             id: {
  //                     type: mongoose.Schema.Types.ObjectId,
  //                     ref: "User"
  //             },
  //             username: String
  //     },
  user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
          },
  name: String,
  email: String,
  className: String
    // studentName: [{
    //           type: Schema.Types.ObjectId,
    //           ref: "user" // this should be parents or students
    //       }]

});
module.exports = mongoose.model("Teacher", TeacherSchema);
