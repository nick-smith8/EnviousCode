#!/usr/bin/env nodejs

var io;
var gameSocket;

var sessionId;
var players = [];
var userQueue = [];
var clients = [];

exports.init = function(sio, socket) {
	io = sio;
	gameSocket = socket;

	gameSocket.on('greeting', function() {
		console.log("GREETING RECEIVED");
	});


	gameSocket.on('newUser', insertUser);
	gameSocket.on('getSessionId', getSessionId);
	gameSocket.on('gameOver', endGame);

	gameSocket.on('disconnect', disconnect);
	gameSocket.on('game', game);
	//gameSocket.on('userQueue',getuserQueue);
	gameSocket.on('userHit',userHit);
};

function disconnect() {
	console.log("Disconnect: " + this.id)
	var id = this.id;
	if (clients[id]) {
		removeUser(clients[id]);
	}
}

// Forward game change events to all users 
function game (data) {
    io.sockets.emit('news', data);
}

function userHit (data) {
	
	console.log("This is the data from user hit: " + data)
	
  if(data == 2 ){
  	userQueue.splice(1,1);
  }
  if(data == 1 ){
  	userQueue.splice(0,1);
  }

}

// Add new user to game, if available, or queue
function insertUser(user) {
	console.log("Current players: "+players.slice(1));
	console.log("Inserting user: "+user);
	var sessionId;
	if (!players[1]) {
		console.log("Adding player 1");
		players[1] = user;
		sessionId = 1;
	} else if (!players[2]) {
		console.log("Adding player 2");
		players[2] = user;
		sessionId = 2;
	} else {
		console.log("Adding player to queue");
		var sessionId = userQueue.push(user) + 2;
	}
	return sessionId;
}
// Remove user from list of players
function removeUser(user) {
	console.log("Removing user: "+user);
	if (players.indexOf(user) > 0) {
		var sessionId = players.indexOf(user);
		delete players[sessionId];
	}
	else if (userQueue.indexOf(user) > 0) {
		var sessionId = userQueue.indexOf(user);
		userQueue.splice(sessionId, sessionId);
	}
	return sessionId;
}
// Finds a user's updated sessionKey 
function getSessionId(data) {
	var user = data.user;
	var newUser = data.newUser;
	if (newUser) {
		sessionId = insertUser(user);
	} else {
		sessionId = (players.indexOf(user) != -1 ? players.indexOf(user) : userQueue.indexOf(user));
	}
	clients[this.id] = user;
	this.emit('playerId', { sessionId: sessionId});
}

// Removes losing player and adds the top of the queue
function endGame(data) {
	var loserId = data.sessionId;
	var username = players[loserId];
	removeUser(username); 
	var newPlayer = userQueue.shift();
	insertUser(newPlayer);
}

