var express = require("express");
var router = express.Router();

var Profile = require("../models/profile");
var Gitstamp = require("../models/gitstamp");

function error(response, message){
  response.status(500);
  response.json({error: message})
}

// renders help page for the api
router.get("/", function(req, res){
  res.render("apihelp")
})

// renders all profiles in json format
router.get("/profiles", function(req, res){
  Profile.find({}).populate("gitstamps").then(function(profiles){
     res.json(profiles);
  });
});

// renders a specific profile in json
router.get("/profiles/:id", function(req, res){
  Profile.findById(req.params.id).populate("gitstamps").then(function(profile){
     res.json(profile);
  });
});

// renders all the gitstamps of a specific profile in json
router.get("/profiles/:id/gitstamps", function(req, res){
  Profile.findById(req.params.id).populate("gitstamps").then(function(profile){
    res.json(profile.gitstamps);
  });
});

//renders all gitstamps
router.get("/gitstamps", function(req, res){
  Gitstamp.find({}).populate("profile", "name").then(function(gitstamps){
    res.json(gitstamps);
  });
});

//renders a specific gitstamp
router.get("/gitstamps/:id", function(req, res){
  Gitstamp.findById(req.params.id).populate("profile", "name").then(function(gitstamp){
    res.json(gitstamp);
  });
});

module.exports = router;
