var dbConfig = require('./db.js');
var mongoose = require('mongoose');
var passport = require('passport');
var expressSession = require('express-session');
var express = require('express');
var User = require('./user.js');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();                             //Init express 

mongoose.connect(dbConfig.url);

app.use(expressSession({secret: 'myKey'}));      //To encrypt the session object
app.use(passport.initialize());                  //To init the passport to act as middleware
app.use(passport.session());                     //To activate passport session
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

passport.serializeUser(function(user,done) {
	console.log('Serializing User: ');
	console.log(user);
	done(null,user._id);
} );

passport.deserializeUser(function(id,done) {
	User.findById(id,function(err,user) {
		done(err,user);
	});
});

//For login function
passport.use('login',new LocalStrategy({passReqToCallback: true},function(req,username,password,done) {
	console.log("Reached Login");
	User.findOne({ 'username': username },
		function(err,user) {
			// In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false);                 
                    }
                    // User exists but wrong password, log the error 
                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        return done(null, false); // redirect back to login page
                    }
                    // User and password both match, return user from done method
                    // which will be treated like success
                    return done(null, user);
		}
	);
} ));

var isValidPassword = function(user, password){
  return password === user.password;
}

//For Register of user
passport.use('signup', new LocalStrategy({
    passReqToCallback : true
  },function(req, username, password, done) {
    findOrCreateUser = function(){
      // find a user in Mongo with provided username
      User.findOne({'username':username},function(err, user) {
        // In case of any error return
        if (err){
          console.log('Error in SignUp: '+err);
          return done(err);
        }
        // already exists
        if (user) {
          console.log('User already exists');
          return done(null, false);
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new User();
          // set the user's local credentials
          newUser.username = username;
          newUser.password = password;
          newUser.email = req.param('email');
          
          newUser.save(function(err) {
            if (err){
              console.log('Error in Saving user: '+err);  
              throw err;  
            }
            console.log('User Registration succesful');    
            return done(null, newUser);
          });
        }
      });
    };
    
    process.nextTick(findOrCreateUser);
  })
);

var routes = require('./router.js')(passport);
app.use('/',routes);

var server = app.listen(8089,function() {
	var host = server.address().address;
	var port = server.address().port;
	
	console.log("Listening on "+host + " on port: "+port);
})


