var express = require('express');
var app = express();

app.get('/',function(request,response) {
	console.log("Got into Get gfunction on the home page");
	response.send("Hello User");
	
})

var server = app.listen(8089,function() {
	var host = server.address().address;
	var port = server.address().port;
	
	console.log("Listening on "+host + " on port: "+port);
})