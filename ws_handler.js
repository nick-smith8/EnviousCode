#!/usr/bin/env nodejs
var app = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var sessionId;
var connectCounter;

io.on('connect', function() { 
	connectCounter = connectCounter+1; 
	console.log(connectCounter);
});

io.on('disconnect', function() { 
	connectCounter = connectCounter-1;
	console.log(connectCounter) ;
});

io.sockets.on('connection', function (socket) {
  socket.emit('playerId', connectCounter);
  socket.on('my other event', function (data) {
    console.log(data);
});

socket.on('game', function (data) {
  	console.log(connectCounter)
    io.sockets.emit('news', data);
  });

});

// var sessionId;
// var socket = io('104.131.30.31:3000');
// socket.on('connection', function(socket){
//   console.log('a user connected');
// });
// socket.on('playerId', function(data) {console.log('hi');sessionId = data})