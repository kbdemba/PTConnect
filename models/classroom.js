const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassroomSchema = new Schema({
    class_name: String,
    students: [{
              type: Schema.Types.ObjectId,
              ref: "Parent"}],
    teacher:{
            id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            name: {first_name: String,
                   last_name: String} // THIS one could have been just embeded in here
    }
});
module.exports = mongoose.model("Classroom", ClassroomSchema);
