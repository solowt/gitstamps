var express = require('express');
var app = express();
var mongoose = require('mongoose');
// var ProfileModel = require("./models/profile");
// var GitstampModel = require("./models/gitstamp");
// var bodyParser = require("body-parser");
// app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/gitstamps');

app.get("/", function(req, res){
  res.send("hello");
});

app.listen(3000, function(){
  console.log("app listening on port 3000");
});
