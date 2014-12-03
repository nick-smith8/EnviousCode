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
  console.log(user);
  if (!pass1 || !pass2 || pass1 !== pass2){
  	console.log(pass1 + " " + pass2);
  	res.send("Invalid passwords received");
  	return;
  }
  var db = req.db;
  var collection = db.get('highscores');
  collection.count({ username: user }, function(error, count) {
  	if (count === 0) {
  		console.log("Inserting username: "+user);
  		collection.insert({username: user, pass: pass1, score: 0}, function(err, result) {
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
});


module.exports = router;
