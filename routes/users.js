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
  res.send("Text");
  return;

  var db = req.db;
  var collection = db.get('highscores');
  collection.find({}, {sort : {score : -1}}, function (e, items) {
    res.json(items);
  });
});

router.post('/create_account', function(req, res) {
  res.send(req.body.name);
});


module.exports = router;
