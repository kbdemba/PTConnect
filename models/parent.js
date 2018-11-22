const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ParentSchema = new Schema({
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
    parentName: String,
    studentName: String,
    //dateOfBirth: in the version 2
    email: String,
    className: String,
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

});

module.exports = mongoose.model("Parent", ParentSchema);
// thats how messages used to look like
// messages:[{
//   author:{
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User"
//           },
