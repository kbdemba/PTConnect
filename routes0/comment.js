var express = require("express");
var router = express.Router();
var middleware = require("../middleware");
var Camp = require("../models/camp");
var Comment = require("../models/comment");

//all the routes start with /campground/:id/comment so I will delete them later 
// express.Router({mergeParams: true}); require router with this

///new comment
router.get("/campground/:id/comment/new", middleware.isLoggedIn, function(req,res){
    Camp.findById(req.params.id, function(err, foundCamp){
        if(err){
            console.log(err);
        }else{
            res.render("comment/newComment", {data: foundCamp});
        }
    });
});

// create a new comment
router.post("/campground/:id/comment", middleware.isLoggedIn, function(req,res){
    Camp.findById(req.params.id, function(err, foundCamp){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.camp, function(err, createdComm){
                if(err){
                    console.log(err);
                }else{
            console.log(createdComm);
            createdComm.author.id = req.user._id;
            createdComm.author.username = req.user.username;
            createdComm.save();
            console.log(createdComm);
            foundCamp.comments.push(createdComm);
            foundCamp.save();
            
            req.flash("success", "you have successfully added a comment");
            res.redirect("/campground/" + foundCamp._id);
            
                }
            });
        }
    });
});

//edit Comment
router.get("/campground/:id/comment/:commentId/edit", middleware.isTheCommentOwner, function(req,res){
    Comment.findById(req.params.commentId, function(err,foundComment){
        if(err){
            console.log(err);
            res.render("back");
        }else{
            res.render("comment/edit", {campId: req.params.id, comment: foundComment});
        }
    });
});
//update Comment
router.put("/campground/:id/comment/:commentId", middleware.isTheCommentOwner,function(req,res){
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err,foundComment){
        if(err){
            console.log(err);
            req.flash("error", err.message);
        }else{
            req.flash("success", "successfully updated the comment");
            res.redirect("/campground/"+req.params.id);
        }
    });
});

//delete Comment
router.delete("/campground/:id/comment/:commentId/delete", middleware.isTheCommentOwner ,function(req,res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if(err){ // its already handled in the middleware
            console.log(err);
            req.flash("error", err.message);
        }else{
            req.flash("success", "successfully deleted the comment");
            res.redirect("/campground/"+ req.params.id);
        }
    });
});

module.exports = router;
