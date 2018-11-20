const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ParentSchema = new Schema({
    Name: String,
    class: String
    // studentName: [{
    //           type: Schema.Types.ObjectId,
    //           ref: "user" // this should be parents or students
    //       }]

});
//module.exports = mongoose.model("Parent", ParentSchema);
