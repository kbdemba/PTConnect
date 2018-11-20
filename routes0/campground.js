var express = require("express");
var router = express.Router();
var middleware = require("../middleware");
var Camp = require("../models/camp");
//var Comment = require("../models/comment");

router.get("/campground", function(req, res) {
    var noMatch;
    console.log(noMatch)
    if(req.query.search){
        var regex = new RegExp(escapeRegExp(req.query.search), "gi");
        
        Camp.find({name: regex},function(err,camp){
            if(err){
                console.log("there was an Error");
                req.flash("error", "try Again")
                res.redirect("/cam")
            }
            else if(camp.length < 1){
                    noMatch = "No Query matches your search in the database matches"; //+regex to shoe the word they searched
                res.render("campground/campgrounds", {camps: camp, noMatch: noMatch});
            }else{
                res.render("campground/campgrounds", {camps: camp, noMatch: noMatch});
            }
        }

    );
    }else{
        Camp.find({},function(err,camp){
                if(err){
                    console.log("there was an Error");
                }
                else{
                    res.render("campground/campgrounds", {camps: camp, noMatch: noMatch});
                }
            }
    
        );
    }
});

//////////// NEW /////////
router.get("/campground/addnew", middleware.isLoggedIn, function(req, res) {
    
    res.render("campground/addNew");
});


//////////// CREATE //////////
router.post("/campground", middleware.isLoggedIn, function(req, res) {
    
    var campToBeCreated = req.body.camp;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    campToBeCreated.author = author;
    Camp.create(campToBeCreated , function(err, newlyCreatedCamp){
        if(err){
            console.log("there was and error")
        }else{
            // newlyCreatedCamp.author.id = req.user._id;
            // newlyCreatedCamp.author.username = req.user.username;
            // newlyCreatedCamp.save();
            console.log(newlyCreatedCamp);
            res.redirect("/campground");
        }
    }
    
    )
    
});


/////////     SHOW    /////////
router.get("/campground/:id", function(req, res) {
    Camp.findById(req.params.id).populate("comments").exec(function(err,camp){
            if(err || !camp){
                req.flash("error", "campgeound not found")
                console.log("nag mutaleh1");
                return res.redirect("back")
            }
            else{
                res.render("campground/show", {camps: camp});
            }
        }

    );
    
});

/// Edit campground///

router.get("/campground/:id/edit", middleware.isTheCampgroundOwner, function(req,res){
    Camp.findById(req.params.id, function(err, foundCamp){
        res.render("campground/edit",{camp:foundCamp});
    });
})

//UPDATE THE CAMPGROUND
router.put("/campground/:id", middleware.isTheCampgroundOwner, function(req,res){
    Camp.findByIdAndUpdate(req.params.id, req.body.camp, function(err,foundCamp){
        req.flash("success", "successfully updated the campground");
        res.redirect("/campground/"+req.params.id);
    });
});

//DELETE THE CAMPGROUND
router.delete("/campground/:id/delete", middleware.isTheCampgroundOwner, function(req,res){
   Camp.findByIdAndRemove(req.params.id, function(err){
       if(err){
           console.log(err);
           req.flash("error", err.message);
           res.redirect("/campground");
       }else {
           req.flash("success", "successfully deleted the campground");
           res.redirect("/campground");
       }
   }) ;
});

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

module.exports = router;
