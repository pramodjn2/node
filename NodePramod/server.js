var http = require('http');
var app = module.exports = require('express')();
var bodyParser = require("body-parser");



var port = process.env.PORT || 8080;


app.get('/', function (req, res) {
   res.send('Hello World');
})


http.createServer(app)
    .listen((port), function() {
    console.log("Listening on localhost:" + port);
});