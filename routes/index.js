var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {});
});

router.get('/create', function(req, res) {
  res.render('create_account', {});
});

router.get('/table', function(req, res) {
  res.render('table', { title: 'Envious Online' });
});

router.get('/game', function(req, res) {
  res.render('game', {});
});

router.get('/lobby', function(req, res) {
  res.render('lobby', {});
});



router.get('/test', function(req, res) {
  res.render('test', { title: 'Hello World' });
});

router.get('/userlist', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({},{},function(e,docs){
    res.render('userlist', {
      "userlist" : docs
    });
  });
});

router.get('/adduser', function(req, res) {
  res.render('adduser', { title: 'Add New User' });
});

router.get('/EnviousOnline', function(req, res) {
  res.render('game.jade');
});

router.post('/addusersubmit', function(req, res) {
    var db = req.db;
    var userName = req.body.username;
    var userEmail = req.body.useremail;
    var collection = db.get('usercollection');

    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        }
        else {
            res.location("userlist");
            res.redirect("userlist");
        }
    });
});

module.exports = router;
