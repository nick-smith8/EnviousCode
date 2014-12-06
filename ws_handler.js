#!/usr/bin/env nodejs

var io;
var gameSocket;
var sessionId;
var connectCounter=0;
var userQueue = [];

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
	gameSocket.on('userQueue',getuserQueue);
	gameSocket.on('userHit',userHit);
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

function getuserQueue (data) {
	if(userQueue.length != data-1){

		}
		else{
			userQueue.push(data);
		}
    io.sockets.emit('userQueuedata', userQueue);
};

function userHit (data) {
	
	console.log("This is the data from user hit: " + data)
	
  if(data == 2 ){
  	userQueue.splice(1,1);
  }
  if(data == 1 ){
  	userQueue.splice(0,1);
  }

 io.sockets.emit('userQueuedata', userQueue);
};



