var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.clearCookie('username');
  res.render('index', {});
});

router.get('/create', function(req, res) {
  res.render('create_account', {});
});

router.get('/game', function(req, res) {
  var username = req.cookies.username;
  res.render('game', { username : username });
});

router.get('/lobby', function(req, res) {
  res.render('lobby', {});
});

module.exports = router;
