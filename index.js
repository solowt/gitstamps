var express = require('express');
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());

// var path = require("path");
// app.use(express.static(path.join(__dirname, "/public")));

// app.get("/", function(req, res){
//   res.render("index.html");
// });

app.set('view engine', 'hbs');
app.use("/api", require("./controllers/apiController"));

app.listen(3000, function(){
  console.log("app listening on port 3000");
});
