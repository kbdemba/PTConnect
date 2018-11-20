var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    // role: {
    //   type: String,
    //   enum: ['Member', 'Client', 'Owner', 'Admin'],
    //   default: 'Member'
    // }
    role: String
    // firstName: String,
    // lastName: String,
    // avatar: String,
    //biography: String,
    //code: String,
    //isTeacher: {type:Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
