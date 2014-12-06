#!/usr/bin/env nodejs

var io;
var gameSocket;
var sessionId;
var connectCounter=0;

exports.init = function(sio, socket) {
	io = sio;
	gameSocket = socket;

	gameSocket.on('greeting', function() {
		console.log("GREETING RECEIVED");
	});

	
	connect();
	gameSocket.on('disconnect', disconnect);
	gameSocket.on('game', game);
	socket.emit('playerId', connectCounter);
};

function connect() {
	connectCounter = connectCounter+1; 
	console.log("Connect: ")
	console.log(connectCounter);
};

function disconnect() {
	connectCounter = connectCounter-1;
	console.log("Disconnect: ")
	console.log(connectCounter) ;
};

function game (data) {
  	console.log(connectCounter)
    io.sockets.emit('news', data);
};

