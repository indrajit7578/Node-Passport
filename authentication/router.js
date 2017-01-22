var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.sendFile(__dirname + '/views/index.html');
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/'
		 
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.sendFile(__dirname + '/views/register.html');
		//res.sendFile('register.html');
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup'
		 
	}));
	/* To see if the User object is created and stored in the session. Just for demonstration purpose. */ 
	router.get('/loggedin', function(req,res) {
		res.send(isAuthenticated ? req.user : '0');
	});

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		res.sendFile(__dirname + '/views/home.html', { user: req.user });
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}