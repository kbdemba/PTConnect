var express = require("express");
var router = express.Router();
var User = require("../models/user")

router.get("/user/:id", function(req,res){
    console.log("im here")
    User.findById(req.params.id, function(err, foundUser){
        if(err || !foundUser){
            req.flash("error", "no match found");
            res.redirect("back")
        }else{
            res.render("user/show", {user: foundUser})
        }
    })
    
    
})



module.exports = router;