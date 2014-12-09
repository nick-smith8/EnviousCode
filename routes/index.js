/**
 * @file This file routes pages to Jade
 */

var express = require('express');
var router = express.Router();

/**
 * Shows homepage
 */
router.get('/', function(req, res) {
  res.clearCookie('username');
  res.render('index', {});
});

/**
 * Shows create account screen
 */
router.get('/create', function(req, res) {
  res.render('create_account', {});
});

/**
 * Shows lobby screen
 */
router.get('/lobby', function(req, res) {
  res.render('lobby', {});
});

/**
 * Shows game screen
 */
router.get('/game', function(req, res) {
  var username = req.cookies.username;
  res.render('game', { username: username });
});

module.exports = router;
