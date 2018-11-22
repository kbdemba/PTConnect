const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
  user: {
          id:{
              type: mongoose.Schema.Types.ObjectId,
              ref: "User"
          },
        name_to_display: String // i dont think i need this
  },
  name: {first_name: String,
         last_name: String},
  email: String,
  class_name: String
});
module.exports = mongoose.model("Teacher", TeacherSchema);
