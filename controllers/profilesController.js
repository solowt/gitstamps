var express = require("express");
var router = express.Router();

var ProfileModel = require("../models/profile");
var GitstampModel = require("../models/gitstamp");

function error(response, message){
  response.status(500);
  response.json({error: message})
}

router.get("/", function(req, res){
  ProfileModel.find({}).then(function(profiles){
     res.json(profiles);
  });
});

module.exports = router;
