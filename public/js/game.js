// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
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

var sessionId;
console.log("Username: "+username);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/Space-stars.jpg";

// spaceship image
var spaceshipReady = false;
var spaceshipImage = new Image();
spaceshipImage.onload = function () {
	spaceshipReady = true;
};
spaceshipImage.src = "images/ship2.png";

// spaceship image for top player
var spaceshiptopReady = false;
var spaceshiptopImage = new Image();
spaceshiptopImage.onload = function () {
	spaceshiptopReady = true;
};
spaceshiptopImage.src = "images/ship3.png";

var shotImage = new Image();
shotImage.onload = function () {
	console.log("This is used for debugging");
};
shotImage.src = "images/shot.png";

var explosionImage = new Image();
explosionImage.onload = function () {
	console.log("This is to see if the explosion loaded");
};
explosionImage.src = "images/explosion.png";

// Game objects
var spaceship = {
	speed: 384 // movement in pixels per second
};

var spaceshiptop = {
	speed: 384 // movement in pixels per second
};

var bottomshots = []
var topshots = []

var userQueue = []

var shot = {};
var shottop = {};

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var vPressed = false;
var spacePressed = false;

// Reset the game 
var reset = function () {
	spaceship.x = canvas.width / 2;
	spaceshiptop.x = canvas.width / 2;
	shot.y = 573;
	shottop.y = 0;
};

socket.on('playerId', function(data) {
	console.log('Received new sessionId: '+data.sessionId);
	sessionId = data.sessionId;
});

socket.on('news',function(data) {
	//console.log(data);
	if (data.top !=null)
		sockettop = data.top;
	if (data.bottom !=null)
		socketbottom = data.bottom;
	if (data.bottomshots!=null)
		bottomshotsocket = data.bottomshots;
	if (data.topshots!=null) {
		topshotsocket = data.topshots;
	}
}); 

/*socket.on('playerId', function(data) {
	sessionId = data;
	socket.emit('userQueue', data);	
});*/

socket.on('userQueuedata',function(data) {
	userQueue = data;
	console.log("This is the user queue: "+ userQueue);
});

// Socket events
socket.emit('newUser', {user: username});	


// Update game objects
var update = function (modifier) {
	if (37 in keysDown&&sessionId==2) { // Top player holding Left
		if((spaceshiptop.x - spaceshiptop.speed * modifier) < 0){
			//Do nothing
		} else {
			spaceshiptop.x -= spaceshiptop.speed * modifier;

			socket.emit('game', {
				"top":spaceshiptop.x
			});
		}
	}
	if (39 in keysDown&&sessionId==2) { // Top player holding Right
		if((spaceshiptop.x + spaceshiptop.speed * modifier) > 1360){
			//Do nothing
		} else {
			spaceshiptop.x += spaceshiptop.speed * modifier;
			socket.emit('game', {
				"top":spaceshiptop.x
			});
		}
	}
	if ((37 in keysDown)&&sessionId==1) { // Bottom player holding Left
		if((spaceship.x - spaceship.speed * modifier) < 0){
			//Do nothing
		} else {
			spaceship.x -= spaceship.speed * modifier;
			socket.emit('game', {
				"bottom":spaceship.x
			});
		}
	}
	if (39 in keysDown&&sessionId==1) { // Bottom player holding Right
		if((spaceship.x + spaceship.speed * modifier) > 1360){
			//Do nothing
		} else {
			spaceship.x += spaceship.speed * modifier;
			socket.emit('game', {
				"bottom":spaceship.x
			});
		}	
	}
	if (32 in keysDown&&sessionId==1){ // Bottom player holding Space
		if (spacePressed == false && bottomshots.length < 3) {
			var shotty = {}
			shotty.y = 573
			shotty.x = spaceship.x
			bottomshots.push(shotty)
			socket.emit('game', {
				"bottomshots":bottomshots
			});
		}
	}
	if (32 in keysDown) {
		spacePressed = false;
	}
	if (32 in keysDown&&sessionId==2){ // Top player holding Space
		if (vPressed == false && topshots.length < 3) {
			var shottytop = {}
			shottytop.y = 0
			shottytop.x = spaceshiptop.x
			topshots.push(shottytop)
			socket.emit('game', {
				"topshots":topshots
			});
		}
	}
	if (86 in keysDown) { // V key pressed
		vPressed = false;
	}
	// For shots coming from the bottom ship
	if (bottomshotsocket!=-99)
		bottomshots = bottomshotsocket;
	var newbottomshots = []; //create new array to remove elemets outside of screen
	bottomshots.forEach(function(shotter) {
		shotter.y-=20;
		if (shotter.y > 0)
			newbottomshots.push(shotter);
	});
	bottomshots = newbottomshots;

    // For shots coming from the top ship
	if (topshotsocket!=-99)
		topshots = topshotsocket;
	var newtopshots = []; //create new array to remove elemets outside of screen
	topshots.forEach(function(shottertop) {
		shottertop.y+=20;
		if (shottertop.y < 650)
			newtopshots.push(shottertop);
	});
	topshots = newtopshots;

	// Bounds check
	if (sockettop !=-99 && sessionId ==2) {
		if (37 in keysDown && sockettop < spaceshiptop.x ){
			spaceshiptop.x = sockettop;
		}
		if (39 in keysDown && sockettop > spaceshiptop.x ){
			spaceshiptop.x = sockettop;
		}
		
	}
	if (sessionId == 1 && sockettop != -99)
		spaceshiptop.x = sockettop;
		

	if (socketbottom !=-99 && sessionId ==1) {
		if (37 in keysDown && socketbottom < spaceship.x ){
			spaceship.x = socketbottom;
		}
		if (39 in keysDown && socketbottom > spaceship.x ){
			spaceship.x = socketbottom;
		}
		
	}
	if (sessionId == 2 && socketbottom != -99)
		spaceship.x = socketbottom;
};

// Draw everything
var render = function () {
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
		ctx.drawImage(shotImage,shotter.x+16, shotter.y);
		if(shotter.y < 30 && shotter.y > -10 && (shotter.x) < (spaceshiptop.x+10) && (shotter.x) > (spaceshiptop.x-10)){
			socket.emit('userHit', 2);	
			ctx.drawImage(explosionImage,spaceshiptop.x,shotter.y);
			alert("Game over Bottom wins");
/*			socket.emit('gameover', {
				"topshots":topshots
			});*/
			console.log("Hit");
		}
	});

	topshots.forEach(function(shottertop) {
		ctx.drawImage(shotImage,shottertop.x+16, shottertop.y+30);
		if(shottertop.y > 560 && shottertop.y < 600 && (shottertop.x) < (spaceship.x+10) && (shottertop.x) > (spaceship.x-10)){ 
			socket.emit('userHit',1);
			ctx.drawImage(explosionImage,spaceship.x,shottertop.y);
			// console.log(shottertop.y);
			// console.log(spaceship.x);
			alert("Game over top wins");
			console.log("Hit");
		}
	});
};

// The main game loop
var main = function () {
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
