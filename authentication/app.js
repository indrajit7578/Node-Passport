var dbConfig = require('./db.js');
var mongoose = require('mongoose');
var passport = require('passport');
var expressSession = require('express-session');
var express = require('express');
var User = require('./user.js');
//var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();                             //Init express 

mongoose.connect(dbConfig.url);

app.use(expressSession({secret: 'myKey'}));      //To encrypt the session object
app.use(passport.initialize());                  //To init the passport to act as middleware
app.use(passport.session());                     //To activate passport session
app.use(express.static(__dirname + '/views'));   // For accessing static content like views
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

require('./auth-strat/strategy.js')(passport);
var routes = require('./router.js')(passport);
app.use('/',routes);

var server = app.listen(8089,function() {
	var host = server.address().address;
	var port = server.address().port;
	
	console.log("Listening on "+host + " on port: "+port);
})


