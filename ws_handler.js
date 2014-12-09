/**
 * @module ws_handler.js
 * @file This file manages server-side web-socket requests through socket.io
 */

var io;
var gameSocket;
var db;

var sessionId;
var players = [];
var userQueue = [];
var clients = {};
var gameStatus = 0;

exports.init = function(sio, socket, mongodb) {
	io = sio;
	gameSocket = socket;
	db = mongodb;

	gameSocket.on('disconnect', disconnect);
	gameSocket.on('getSessionId', getSessionId);
	gameSocket.on('game', game);
	gameSocket.on('gameOver', gameOver);
	gameSocket.on('getUsers', getUsers);
};

/**
 * @function disconnect
 * Removes user id and calls removeUser upon user disconect
 */
function disconnect() {
	console.log('Disconnect: ' + this.id);
	var id = this.id;
	if (clients[id]) {
		removeUser(clients[id]);
		delete clients[id];
	}
}

/**
 * @function game
 * Forward game change event to other users. Initiates game end if data includes a gameover
 */
function game(data) {
	if (gameStatus) {
		if (data.gameover != null) {
			console.log('Game has ended');
			gameOver({ sessionId: (3 - data.gameover)});
			gameStatus = 0;
		}
		io.sockets.emit('news', data);
	}
}

/**
 * @function insertUser
 * @return User's sessionId
 * Add new user to the game, if available, and the queue otherwise
 */
function insertUser(user) {
	console.log('Current players: ' + players.slice(1));
	console.log('Inserting user: ' + user);
	var sessionId;
	if (!players[1]) {
		console.log('Adding player 1');
		players[1] = user;
		sessionId = 1;
	} else if (!players[2]) {
		console.log('Adding player 2');
		players[2] = user;
		sessionId = 2;
	} else {
		console.log('Adding player to queue');
		var sessionId = userQueue.push(user) + 2;
	}
	return sessionId;
}

/**
 * @function removeUser
 * @return User's sessionId
 * Remove user from list of players or from queue
 */
function removeUser(user) {
	console.log('Removing user: ' + user);
	sessionId = -1;
	if (players.indexOf(user) >= 0) {
		var sessionId = players.indexOf(user);
		delete players[sessionId];
	}
	else if (userQueue.indexOf(user) >= 0) {
		var sessionId = userQueue.indexOf(user);
		userQueue.splice(sessionId, sessionId);
	}
	return sessionId;
}

/**
 * @function getSessionId
 * Find a user's sessionId based on username. Emit's sessionId
 */
function getSessionId(data) {
	var user = data.user;
	var newUser = data.newUser;
	if (newUser) {
		sessionId = insertUser(user);
	} else {
		sessionId = (players.indexOf(user) != -1 ? players.indexOf(user) : userQueue.indexOf(user));
	}
	clients[this.id] = user;
	console.log('User: ' + user + ' has sessionId: ' + sessionId);
	gameStatus = 1;
	this.emit('playerId', { sessionId: sessionId});
}

/**
 * @function gameOver
 * Removes losing player and adds new player from the queue
 */
function gameOver(data) {
	var loserId = data.sessionId;
	if (players[loserId]) {
		removeUser(players[loserId]);
	}
	var newPlayer = userQueue.shift();
	insertUser(newPlayer);

	var winner = players[3 - loserId];
	updateWinner(winner);
}

/**
 * @function disconnect
 * Increment the winner's score in the DB
 */
function updateWinner(user) {
	var collection = db.get('highscores');
	collection.update({ username: user }, { $inc: { score: 1}});
	console.log('Updated winner score');
}

/**
 * @function disconnect
 * Shows active users, for testing perposes
 */
function getUsers() {
	console.log('players: ' + players);
	console.log('Queue: ' + userQueue);
}
