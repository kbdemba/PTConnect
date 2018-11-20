const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassroomSchema = new Schema({
    className: String,
    students: [{
              type: Schema.Types.ObjectId,
              ref: "Parent" // this should be parents or students
          }],
    teacher:{
              type: Schema.Types.ObjectId,
              ref: "Teacher" // this should be parents or students
          }
});
module.exports = mongoose.model("Classroom", ClassroomSchema);
