#!/usr/bin/env nodejs

var io;
var gameSocket;

exports.init = function(sio, socket) {
	io = sio;
	gameSocket = socket;

	gameSocket.on('greeting', function() {
		console.log("GREETING RECEIVED");
	});

	gameSocket.on('connect', connect);
	gameSocket.on('disconnect', connect);
	gameSocket.on('game', game);
};

var sessionId;
var connectCounter;

function connect() {
	connectCounter = connectCounter+1; 
	console.log(connectCounter);
};

function disconnect() {
	connectCounter = connectCounter-1;
	console.log(connectCounter) ;
};

function game (data) {
  	console.log(connectCounter)
    io.sockets.emit('news', data);
};

