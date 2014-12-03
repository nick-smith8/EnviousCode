var express = require('express');
var router = express.Router();

/**
  This file manages HTTP GET requests for database requests
*/

router.use(function(req, res, next) {
  console.log(req.method, req.url, res.body);
  next();
});

router.get('/get_highscores', function(req, res) {
  var db = req.db;
  var collection = db.get('highscores');
  collection.find({}, {sort : {score : -1}}, function (e, items) {
    res.json(items);
  });
});

// Validate new account values and insert if valid
router.post('/create_account', function(req, res) {
  var user = req.body.user;
  var pass1 = req.body.pass;
  var pass2 = req.body.confirmpass;

  if (pass1 && pass2 && pass1 == pass2){
	  var db = req.db;
	  var collection = db.get('highscores');
	  if (user) {
		  collection.count({ username: user }, function (error, count) {
		  	if (count === 0) {
		  		console.log("Inserting username: "+user);
		  		collection.insert({username: user, password: pass1, score: 0}, function (err, result) {
		  			if(err) 
		  				res.send(err)
		  			else
		  				res.send('0');
		  		});
		  	}
		  	else {
		  		res.send("Username already exists");
		   }
		  });
	  }
	  else
	  	res.send("Username can not be blank");
  }
  else
  	res.send("Invalid passwords received");
});

//Validate user login
router.post('/login', function(req, res) {
	var user = req.body.user;
	var pass = req.body.pass;
	var db = req.db;
	var collection = db.get('highscores');
	if (user && pass) {
		collection.count({ username: user , password: pass}, function (error, count) {
		  if (count !== 0) {
		  	res.send('0');
		  }
		  else
		  	res.send("Invalid username or password received");
		});
	}
	else
		res.send("No password or username received");
});

module.exports = router;
