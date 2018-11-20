var mongoose = require("mongoose");
var User = require("./user")
var Comment = require("./comment")
var campSchema = new mongoose.Schema({
        name: String,
        price: Number,
        url: String,
        description: String,   // this should be description
        comments: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }],
        author: {
                id:{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User"
                },
              username: String  
        }
        
    });

module.exports = mongoose.model("Camp", campSchema);