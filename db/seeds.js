require("./schema");
var mongoose = require("mongoose");
var db = mongoose.connection;
var profileNames = [
                    {"name":"bobby"},
                    {"name":"james"},
                    {"name":"christine"},
                    {"name":"todd"}
                  ];
var gitstampStuff = {
                      "bobby": [
                        {
                          "data": "data1"
                        },
                        {"data": "data 2"
                        }
                      ],
                      "james": [
                        {
                          "data": "data3"
                        },
                        {"data": "data 4"
                        }
                      ],
                      "christine": [
                        {
                          "data": "data5"
                        },
                        {"data": "data6"
                        }
                      ],
                      "todd": [
                        {
                          "data": "data7"
                        },
                        {"data": "data 8"
                        }
                      ]
                    }

db.on("error", function(err){
  console.log("Oops! Mongo threw an error. Is `mongod` running?");
  console.log(err.message);
  process.exit();
});

db.once("open", function(){
  console.log("Connected to the database.");
  var Profile = require("../models/profile");
  var Gitstamp = require("../models/gitstamp");

  Gitstamp.remove({}).then(function(){
    Profile.remove({}).then(function(){
      forEach(profileNames, function(profileName){
        return new Profile(profileName).save().then(function(profile){
          return forEach(gitstampStuff[profile.name], function(gitstampData){
            gitstamp = new Gitstamp(gitstampData);
            console.log(profile.name + " owns " + gitstamp.data);
            gitstamp.profile = profile;
            return gitstamp.save().then(function(gitstamp){
              profile.gitstamps.push(gitstamp);
              profile.save();
            });
          })
        });
      }).then(function(){
        process.exit();
      });
    });
  });

});

function forEach(collection, callback, index){
  if(!index) index = 0;
  return callback(collection[index]).then(function(){
    if(collection[index + 1]) return forEach(collection, callback, index + 1);
  });
}
