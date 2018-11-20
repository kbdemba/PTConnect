var mongoose = require("mongoose");
// var User = require("./user") whydont you have to require this one
var commentSchema = new mongoose.Schema({
        //author: String,
        author: {
                id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User"
                },
                username: String
        },
        text: String
    });
    

module.exports = mongoose.model("Comment", commentSchema);