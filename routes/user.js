const express = require("express"), router = express.Router(), passport = require("passport"), User = require("../models/user");
const admin = 5, recruiter = 4, officer = 3, nco = 2, enlisted = 1, guest = 0;

router.get("/user/:id", isLoggedIn, function(req,res){
    User.findById(req.params.id, function(err, foundUser){
        if(err) {
            console.log(err);
        } else {
            res.render("userpage", {user: foundUser});
        }
    });
});

router.get("/user/edit/:id", isLoggedIn, function(req,res){
    User.findById(req.params.id, function(err, foundUser){
        if(err) {
            console.log(err);
        } else {
            res.render("edit", {user: foundUser});
        }
    });
});

router.post("/user/edit", isLoggedIn, function(req,res){
    if(req.user.role !== admin) return res.redirect("/");
    User.find({_id: req.body.id}, function(err, user){
        if(err) {
            console.log(err);
        }
        const newUnit = {company: req.body.company, platoon: req.body.platoon, squad: req.body.squad};
        User.findOneAndUpdate({_id: req.body.id}, {$set:{rank:req.body.rank, status:req.body.status, position:req.body.position, unit:newUnit}}, function(err,doc){
            if(err) {
                console.log(err);
            }
        });
    });
    res.redirect("/listusers");
});

router.post("/user/delete/:id", isLoggedIn, (req, res) => {
    if(req.user.role !== admin) return res.redirect("/");
    User.findByIdAndDelete(req.params.id, err => {
        if(err) {
            res.redirect("/");
        } else {
            res.redirect("/listusers");
        }
    });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

 module.exports = router;