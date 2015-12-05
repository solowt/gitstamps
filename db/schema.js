// requiring mongoose dependency
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/gitstamps');


// instantiate a name space for our Schema constructor defined by mongoose.
// var Schema = mongoose.Schema,
//     ObjectId = Schema.ObjectId
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

// defining schema for authors.
var ProfileSchema = new Schema(
  {
    name: String,
    gitstamps: [{type: ObjectId, ref: "Gitstamp"}]
  },
  {
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
  }
);

// defining schema for reminders
var GitstampSchema = new Schema({
  data: String,
  profile: {type: ObjectId, ref: "Profile"}
});


// setting models in mongoose utilizing schemas defined above
var ProfileModel = mongoose.model("Profile", ProfileSchema)
var GitstampModel = mongoose.model("Gitstamp", GitstampSchema)
