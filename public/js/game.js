/**
 * @file Manages the game, including socket calls. Interprets input based on sessionId
 */

// Create the canvas
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 1400;
canvas.height = 650;
document.body.appendChild(canvas);

//Variable declarations
//For if top or bot ship is hit
var hittop = false;
var hitbot = false;
var counter = 0;
var sockettop = -99;
var socketbottom = -99;
var bottomshotsocket = -99;
var topshotsocket = -99;
var botDirection = '';
var topDirection = '';
var gameStatus = 0;

var sessionId;
console.log('Username: ' + username);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {
	bgReady = true;
};
bgImage.src = 'images/Space-stars.jpg';

// spaceship image
var spaceshipReady = false;
var spaceshipImage = new Image();
spaceshipImage.onload = function() {
	spaceshipReady = true;
};
spaceshipImage.src = 'images/ship2.png';

// spaceship image for top player
var spaceshiptopReady = false;
var spaceshiptopImage = new Image();
spaceshiptopImage.onload = function() {
	spaceshiptopReady = true;
};
spaceshiptopImage.src = 'images/ship3.png';

var shotImage = new Image();
shotImage.onload = function() {
	console.log('This is used for debugging');
};
shotImage.src = 'images/shot.png';

var explosionImage = new Image();
explosionImage.onload = function() {
	console.log('This is to see if the explosion loaded');
};
explosionImage.src = 'images/explosion.png';

// Game objects
var spaceship = {
	speed: 384 // movement in pixels per second
};

var spaceshiptop = {
	speed: 384 // movement in pixels per second
};

var bottomshots = [];
var topshots = [];
var shot = {};
var shottop = {};

// Handle keyboard controls
var keysDown = {};

addEventListener('keydown', function(e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener('keyup', function(e) {
	delete keysDown[e.keyCode];
}, false);

var vPressed = false;
var spacePressed = false;

// Reset the game
var reset = function() {
	spaceship.x = canvas.width / 2;
	spaceshiptop.x = canvas.width / 2;
	shot.y = 573;
	shottop.y = 0;
	gameStatus = 1;
	bottomshotsocket = -99;
	topshotsocket = -99;
};

// Socket events
socket.on('playerId', function(data) {
	console.log('Received new sessionId: ' + data.sessionId);
	sessionId = data.sessionId;
});

socket.on('news', function(data) {
	if (data.top != null) {
		sockettop = data.top.x;
		topDirection = data.top.direction;
		if ((sockettop < spaceshiptop.x && topDirection == 'left') || (sockettop > spaceshiptop.x && topDirection == 'right'))
			spaceshiptop.x = sockettop;
	}
	if (data.bottom != null) {
		socketbottom = data.bottom.x;
		botDirection = data.bottom.direction;
		if ((socketbottom < spaceship.x && botDirection == 'left') || (socketbottom > spaceship.x && botDirection == 'right'))
			spaceship.x = socketbottom;
	}
	if (data.bottomshots != null) {
		bottomshotsocket = data.bottomshots;

	}
	if (data.topshots != null) {
		topshotsocket = data.topshots;
	}

	if (data.gameover != null) {
		// Winner
		if (sessionId == data.gameover) {
			swal({
				title: 'You win!',
				timer: 3000
			});
		}
		//Loser
		else if (sessionId == (3 - data.gameover)) {
			// Return to lobby
			socket.disconnect();
			swal({
				title: 'You lose. You are being returned to the lobby'
			}, 2000);
			setTimeout(function() {
				window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1) + 'lobby';
			}, 3000);
		}
		//Everyone else
		else {
			var message = (data.gameover == 1 ? 'Bottom' : 'Top');
			message += ' player wins!\n';
			if (sessionId > 3)
				message += 'You are now in position: ' + (sessionId - 1);
			else if (sessionId === 3)
				message += 'You are now the top player!';
			swal({
				title: message,
				timer: 3000
			});
		}

		//Get new sessionId
		socket.emit('getSessionId', {
			user: username,
			newUser: 0
		});
	}

});

// Announce yourself to the server
socket.emit('getSessionId', {
	user: username,
	newUser: 1
});

// Update game objects
var update = function(modifier) {
	if (37 in keysDown && sessionId == 2) { // Top player holding Left
		spaceshiptop.x = Math.floor(spaceshiptop.x - spaceshiptop.speed * modifier);
		if (spaceshiptop.x < 0) {
			spaceshiptop.x = 0;
		}
		socket.emit('game', {
			'top': {
				'x': spaceshiptop.x,
				'direction': 'left'
			}
		});
	}
	if (39 in keysDown && sessionId == 2) { // Top player holding Right
		spaceshiptop.x = Math.floor(spaceshiptop.x + spaceshiptop.speed * modifier);
		if (spaceshiptop.x > 1360) {
			spaceshiptop.x = 1360;
		}
		socket.emit('game', {
			'top': {
				'x': spaceshiptop.x,
				'direction': 'right'
			}
		});
	}
	if ((37 in keysDown) && sessionId == 1) { // Bottom player holding Left
		spaceship.x = Math.floor(spaceship.x - spaceship.speed * modifier);
		if (spaceship.x < 0) {
			spaceship.x = 0;
		}
		socket.emit('game', {
			'bottom': {
				'x': spaceship.x,
				'direction': 'left'
			}
		});
	}

	if (39 in keysDown && sessionId == 1) { // Bottom player holding Right
		spaceship.x = Math.floor(spaceship.x + spaceship.speed * modifier);
		if (spaceship.x > 1360) {
			spaceship.x = 1360;
		}
		socket.emit('game', {
			'bottom': {
				'x': spaceship.x,
				'direction': 'right'
			}
		});
	}

	if (32 in keysDown && sessionId == 1) { // Bottom player holding Space
		if (spacePressed == false && bottomshots.length < 3) {
			var shotty = {
				'y': 573,
				'x': spaceship.x
			};
			bottomshots.push(shotty);
			socket.emit('game', {
				'bottomshots': bottomshots
			});
		}
	}
	if (32 in keysDown) {
		spacePressed = false;
	}
	if (32 in keysDown && sessionId == 2) { // Top player holding Space
		if (vPressed == false && topshots.length < 3) {
			var shottytop = {
				'y': 0,
				'x': spaceshiptop.x
			};
			topshots.push(shottytop);
			socket.emit('game', {
				'topshots': topshots
			});
		}
	}
	if (86 in keysDown) { // V key pressed
		vPressed = false;
	}
	// For shots coming from the bottom ship
	if (bottomshotsocket != -99)
		bottomshots = bottomshotsocket;

	var newbottomshots = []; //create new array to remove elemets outside of screen
	bottomshots.forEach(function(shotter) {
		shotter.y -= 20;
		if (shotter.y > 0)
			newbottomshots.push(shotter);
	});
	bottomshots = newbottomshots;

    // For shots coming from the top ship
	if (topshotsocket != -99)
		topshots = topshotsocket;

	var newtopshots = []; //create new array to remove elemets outside of screen
	topshots.forEach(function(shottertop) {
		shottertop.y += 20;
		if (shottertop.y < 650)
			newtopshots.push(shottertop);
	});
	topshots = newtopshots;

};

// Draw everything
var render = function() {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}
	if (spaceshipReady) {
		ctx.drawImage(spaceshipImage, spaceship.x, 573);
	}
	if (spaceshiptopReady) {
		ctx.drawImage(spaceshiptopImage, spaceshiptop.x, 0);
	}
	// Draw each shot
	bottomshots.forEach(function(shotter) {
		ctx.drawImage(shotImage, shotter.x + 16, shotter.y);
		if (shotter.y < 30 && shotter.y > -10 && (shotter.x) < (spaceshiptop.x + 10) && (shotter.x) > (spaceshiptop.x - 10)) { // Confirmed kill
			ctx.drawImage(explosionImage, spaceshiptop.x, shotter.y);
			if (gameStatus) {
				//Send gameover, with winner's sessionId
				socket.emit('game', {
					'gameover': 1
				});
				setTimeout(function() {
					console.log('Reseting');
					reset();
				}, 5000);
			}
			gameStatus = 0;
		}
	});

	topshots.forEach(function(shottertop) {
		ctx.drawImage(shotImage, shottertop.x + 16, shottertop.y + 30);
		if (shottertop.y > 560 && shottertop.y < 600 && (shottertop.x) < (spaceship.x + 10) && (shottertop.x) > (spaceship.x - 10)) { // Confirmed kill
			socket.emit('userHit', 1);
			ctx.drawImage(explosionImage, spaceship.x, shottertop.y);
			if (gameStatus) {
				//Send gameover, with winner's sessionId
				socket.emit('game', {
					'gameover': 2
				});
				setTimeout(function() {
					console.log('Reseting');
					reset();
				}, 5000);
			}
		}
	});
};

// The main game loop
var main = function() {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
