var express = require("express");
var router = express.Router();
var ProfileModel = require("../models/profile");
var GitstampModel = require("../models/gitstamp");

function error(response, message){
  response.status(500);
  response.json({error: message})
}
