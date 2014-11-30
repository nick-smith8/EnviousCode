var express = require('express');
var router = express.Router();

/**
  This file manages HTTP GET requests for database requests
*/

router.get('/get_highscores', function(req, res) {
  var db = req.db;
  var collection = db.get('highscores');
  collection.find({}, {sort : {score : -1}}, function (e, items) {
    res.json(items);
  });
});

module.exports = router;
