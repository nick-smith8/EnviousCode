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
	speed: 256 // movement in pixels per second
};
var spaceshiptop = {
	speed: 256 // movement in pixels per second
};

var topshots = []
var botshots = []

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



// Update game objects
var update = function (modifier) {


	
	if (38 in keysDown) { // Player holding up
		if((spaceshiptop.x - spaceshiptop.speed * modifier) < 0){
		}
		else{
		spaceshiptop.x -= spaceshiptop.speed * modifier;
		}
	}
	if (40 in keysDown) { // Player holding down
		if((spaceshiptop.x + spaceshiptop.speed * modifier) > 1360){

		}
		else{
		spaceshiptop.x += spaceshiptop.speed * modifier;
		}
	}
	if (37 in keysDown) { // Player holding left
		if((spaceship.x - spaceship.speed * modifier) < 0){

		}
		else{
		spaceship.x -= spaceship.speed * modifier;
		}
	}
	if (39 in keysDown) { // Player holding right
		
		if((spaceship.x + spaceship.speed * modifier) > 1360){

		}
		else{
		spaceship.x += spaceship.speed * modifier;
		}	
	}
	if (32 in keysDown){

		if (spacePressed == false && topshots.length < 3) {
			var shotty = {}
			shotty.y = 573
			shotty.x = spaceship.x
			topshots.push(shotty)
		}
	}

	if (32 in keysDown) {
		spacePressed = false;
	}
	if (86 in keysDown){

		if (vPressed == false && botshots.length < 3) {
			
			var shottytop = {}
			shottytop.y = 0
			shottytop.x = spaceshiptop.x
			botshots.push(shottytop)
			
		}
		
	}
	if (86 in keysDown) {
		vPressed = false;
	}

	// For shots coming from the bottom ship

	var newtopshots = []; //create new array to remove elemets outside of screen

	topshots.forEach(function(shotter) {

		shotter.y-=20;

		if (shotter.y > 0)
			//console.log(shotter.y);
			newtopshots.push(shotter)
	})

	topshots = newtopshots


    // For shots coming from the top ship

	var newbotshots = []; //create new array to remove elemets outside of screen

	botshots.forEach(function(shottertop) {

		shottertop.y+=20;

		if (shottertop.y < 650)
			//console.log(shotter.y);
			newbotshots.push(shottertop)
	})

	botshots = newbotshots

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
	//for each loop to draw each shot
	topshots.forEach(function(shotter) {
		//console.log(shotter.x);
		//console.log(spaceshiptop.x);
		ctx.drawImage(shotImage,shotter.x+16, shotter.y);

		if(shotter.y < 30 && shotter.y > -10 && (shotter.x) < (spaceshiptop.x+10) && (shotter.x) > (spaceshiptop.x-10)){

			ctx.drawImage(explosionImage,spaceshiptop.x,shotter.y);
			alert("Game over Bottom wins")
			console.log("Hit");
		}
	});

	botshots.forEach(function(shottertop) {
		
		ctx.drawImage(shotImage,shottertop.x+16, shottertop.y);
		if(shottertop.y > 560 && shottertop.y < 600 && (shottertop.x) < (spaceship.x+10) && (shottertop.x) > (spaceship.x-10)){ 

			ctx.drawImage(explosionImage,spaceship.x,shottertop.y);
			console.log(shottertop.y);
			console.log(spaceship.x)
			alert("Game over top wins")
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
