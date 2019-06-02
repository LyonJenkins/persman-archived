const express = require("express"), router = express.Router(), passport = require("passport"), Calendar = require("../models/calendar"), User = require("../models/user"), flash = require("connect-flash");

router.get("/", function(req, res){
    Calendar.find({}, function(err, allEvents){
        if(err) {
            console.log(err);
        }
        let newEvents = [];
        let place = allEvents.length;
        while(place > allEvents.length-4) {
            if(allEvents[place] !== undefined) newEvents.push(allEvents[place]);
            place--;
        }
        res.render("landing", {events: newEvents});
    });
 });

 
 router.get("/register", function(req,res){
     res.render("register", {error: ""});
 });
 
 router.post("/register", function(req, res){
     let role = {name:"Guest", num:0};
     if(req.body.username === "admin") role = {name: "Admin", num:5};
     const newUser = new User({username: req.body.username, role: role, registrationDate: Date.now()});
     User.register(newUser, req.body.password, function(err,user){
         if(err) {
             console.log(err.name);
             return res.render("register", {error: err.name});
         }
         passport.authenticate("local")(req,res,function(){
             res.redirect("/");
         })
     });
 });
 
 router.get("/login", function(req, res){
     res.render("login");
 });
 
 router.post("/login", passport.authenticate("local", 
     {
         successRedirect:"/", 
         failureRedirect:"/login"
     }), function(req, res){
 });
 
 router.get("/logout", function(req, res){
     req.logout();
     res.redirect("/");
 });

 module.exports = router;