var express = require("express");
var router = express.Router();
var Profile = require("../models/profile")
var Stamp = require("../models/stamp")
var Functions = require("../db/schemaMethods")
var User = require("../models/user")


function error(response, message){
  response.status(500);
  response.json({error: message})
}

function followProfile(userId,profile,res){
  User.findById(userId, function(err,docs){
    if(err) return err;
    if (docs.follows.indexOf(profile._id)==-1){
      docs.follows.push(profile._id);
      docs.save(function(error){
        console.log(profile.username+ " followed by "+docs.github.username)
        if(!error){
          res.json(profile)
        }
      });
    }else{
      console.log(docs.github.username+" already follows "+profile.username)
      res.json({success:false})
    }
  });
}

var profilesController = {
  getProfiles: function(req,res){
    User.findById(req.user._id, function(err, user){
      var userProfiles = user.follows
      if (req.params.format){
        Profile.find({'_id': {$in: userProfiles}}).populate("stamps").then(function(profiles){
          res.json(profiles);//response renders json of profiles
        });
      }else{
        Profile.find({'_id': {$in: userProfiles}}).populate("stamps").then(function(profiles){
          res.render("index")
        })
      }
    })
  },
  getProfile: function(req,res){
    Profile.findById(req.params.id).populate("stamps").then(function(profile){
      res.json(profile);
    });
  },
  checkProfile:function(req,res){
    var token = req.user.github.token;
    var git = Functions.setUp(token);
    Functions.checkGHUser(git,req.query.username,res)
  },
  addProfile:function(req,res){
    Profile.findOne({'username':req.body.username}, function(err, profile){
      if(err) return err;

      if (profile){
        console.log(req.body.username + " already in the database")
        followProfile(req.user._id,profile,res)
      }else{
        var profileObject = {
          createdAt: Date(),
          username: req.body.username
        }
        var newProfile = new Profile(profileObject).save(function(err){
          if(!err){
            console.log(req.body.username + " saved in the database")
            return newProfile
          }
        }).then(function(newProfile){followProfile(req.user._id,newProfile,res)});
      }
    })
  },
  updateProfile:function(req,res){
    Profile.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}).then(function(profile){
      res.json(profile);
    });
  },
  deleteProfile:function(req,res){
    Profile.findByIdAndRemove(req.params.id).then(function(profile){
      console.log("removing "+profile.username+" from the db...")
      res.json({success: true});
    });
  },
  getStamps:function(req,res){
    Profile.findById(req.params.id).populate("stamps").then(function(profile){
      res.json(profile.stamps);
    });
  },
  addStamp:function(req,res){
    var token = req.user.github.token;
    Profile.findById(req.params.id,function(err, profile){
      var stamp = new Stamp(req.body);
      var git = Functions.setUp(token);
      Functions.getRepoNamesChain(profile.username, git).then(function(repoNames){
        Functions.checkAuthors(profile.username, git, repoNames).then(function(refinedNames){
          Functions.getCommitMessages(profile.username, git, refinedNames).then(function(responseObject){
            stamp.data.commitMessages = responseObject.nameMsgMap;
            Functions.getLangs(profile.username, git, responseObject.names).then(function(nameLangMap){
              stamp.data.languages = nameLangMap; // add object to stamp
              stamp.data.langTotals = Functions.parseLangs(nameLangMap); // see this function below
              stamp.data.langAverages = Functions.langAverages(stamp.data.langTotals) // see this function below
              stamp.data.averageMessageLength = Functions.msgAverages(stamp.data.commitMessages) // see this function below
              stamp.createdAt = Date(); // add time stamp
              profile.stamps.push(stamp); // push the stamp onto the owner profile's array of stamps
              res.json(stamp) // repsond with json
              profile.save(function(err, docs){ // save the profile
                if (err){
                  console.log("Failed to save stamp: "+err)
                } else {
                  console.log("Saved stamp to DB under "+profile.username+"'s profile.")
                  return;
                }
              })
            })
          })
        })
      })
    });
  }
}

module.exports = profilesController;
