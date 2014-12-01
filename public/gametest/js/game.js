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

var shot = false;
var shottop = false;

var shotImage = new Image();
shotImage.onload = function () {
	console.log("This is used for debugging");
};
shotImage.src = "images/shot.png";


// Game objects
var spaceship = {
	speed: 256 // movement in pixels per second
};
var spaceshiptop = {
	speed: 256 // movement in pixels per second
};
var shot1 = {
};
var shottop1 = {
};
// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game 
var reset = function () {
	spaceship.x = canvas.width / 2;
	spaceshiptop.x = canvas.width / 2;
};

// Update game objects
var update = function (modifier) {
	
	if (38 in keysDown) { // Player holding up
		spaceshiptop.x -= spaceshiptop.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		spaceshiptop.x += spaceshiptop.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		spaceship.x -= spaceship.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		spaceship.x += spaceship.speed * modifier;
	}
	if (32 in keysDown){
		counter = 0;
		shot = true;
		for(i = 0;i < 400; i++){
			counter+=1;}
	}
	if (86 in keysDown){
		counter = 0;
		shottop = true;
		counter += 100;
	}

	
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
	if (shot){
		for(i = 550;i > 0; i--){
		ctx.drawImage(shotImage,spaceship.x+16, i);
		}
	}
	if (shottop){
		for(i = 80;i < 573; i++){
		ctx.drawImage(shotImage,spaceshiptop.x+16, i);
		}
		console.log(shot1.y);
		if(shot1.y == 573){
			alert("Hit");
		}
	}


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
