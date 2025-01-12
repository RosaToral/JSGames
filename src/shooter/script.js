const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

const MAX_PARTICLES = 3;
let ravens = [];
let explosions = [];
let particles = [];
/**
This array makes the ilussion of that every rsven has a trail, but actually every time
the raven moves then a circle is created in that posirion were the raven moved.
So if the raven moves in a special speed, a lot of circles (three) are being created for
every moving raven.

*/
let timeToNextRaven = 0;
let ravenInterval = 300;
let lastTime = 0;
let score = 0;
ctx.font = "50px Impact";

class Raven {
	constructor () {
		this.spriteWidth = 271;
		this.spriteHeight = 194;
		this.sizeModifier = Math.random() * 0.4 + 0.1;
		this.width = this.spriteWidth * this.sizeModifier;
		this.height = this.spriteHeight * this.sizeModifier;
		this.x = canvas.width;
		this.y = Math.random() * (canvas.height - this.height);
		this.dX = Math.random() * 1 + 1;
		this.dY = Math.random() * 5 - 2.5;
		this.markedForDeletion = false;
		this.image = new Image();
		this.image.src = "/assets/raven.png";
		this.timeSinceFlap = 0;
		this.flapInterval = Math.random() * 50 + 50;
		this.frame = 0;
		this.maxFrame = 4;
		this.randomColors = [Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255)];
		this.color = 'rgb('+this.randomColors.join(',')+')';
		this.hasTrail = Math.random() > 0.5;
	}

	update (deltaTime) {
		if (this.y < 0 || this.y > canvas.height - this.height)
			this.dY = this.dY * -1;
		this.x -= this.dX;
		this.y += this.dY;
		if (this.x < 0 - this.width) this.markedForDeletion = true;
		this.timeSinceFlap += deltaTime;
		if (this.timeSinceFlap > this.flapInterval) {
			if (this.frame > this.maxFrame) this.frame = 0;
			else this.frame++;
			this.timeSinceFlap = 0;
			if (this.hasTrail) {
				for (let i = 0; i < MAX_PARTICLES; i++) {
					particles.push(new Particle(this.x, this.y, this.width, this.color));
				}
			}
		}
	}

	draw () {
		collisionCtx.fillStyle = this.color;
		collisionCtx.fillRect(this.x, this.y, this.width, this.height);
		ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
		// ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

class Explosion {
	constructor (x, y, size) {
		this.image = new Image();
		this.image.src = '/assets/boom.png';
		this.spriteWidth = 200;
		this.spriteHeight = 179;
		this.size = size;
		this.x = x;
		this.y = y;
		this.frame = 0;
		this.timeSinceLastFrame = 0;
		this.frameInterval = 100;
		this.markedForDeletion = false;
		
	}

	update (deltatime) {
		this.timeSinceLastFrame += deltatime;
		if (this.timeSinceLastFrame > this.frameInterval) {
			this.frame++;
			this.timeSinceLastFrame = 0;
			if (this.frame > 5) this.markedForDeletion = true;
		}
	}

	draw () {
		ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size/4, this.size, this.size);
	}
}

class Particle {
	constructor (x, y, size, color) {
		this.size = size;
		this.x = x + this.size/2;
		this.y = y + this.size/3;
		this.radius = Math.random() * this.size/10;
		this.maxRadius = Math.random() * 20 + 35;
		this.markedForDeletion = false;
		this.speedX = Math.random() * 1 + 0.5;
		this.color = color;
	}
	update () {
		this.x += this.speedX;
		this.radius += 0.3;
		if (this.radius > this.maxRadius - 5)
			this.markedForDeletion = true;
	}
	draw () {
		ctx.save();
		ctx.globalAlpha = 1 - this.radius/this.maxRadius;
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}
}

function drawScore () {
	ctx.fillStyle = "gray";
	ctx.fillText("Score: " + score, 50, 75);
	ctx.fillStyle = "pink";
	ctx.fillText("Score: " + score, 53, 78);
}

window.addEventListener("touchstart", shoot);

window.addEventListener("click", shoot);

function shoot (ev) {
// alert("shoot!");
	const detectPixelColor = collisionCtx.getImageData(ev.x, ev.y, 1, 1);
	const pc = detectPixelColor.data;
	ravens.forEach(e => {
		if (e.randomColors[0] === pc[0] && e.randomColors[1] === pc[1] && e.randomColors[2] === pc[2]) {
			e.markedForDeletion = true;
			score ++;

			explosions.push(new Explosion(e.x, e.y, e.width));
			
		}
	});
};

function animation (timestamp) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
	let deltaTime = timestamp - lastTime;
	lastTime = timestamp;
	timeToNextRaven += deltaTime;
	if (timeToNextRaven > ravenInterval) {
		ravens.push(new Raven());
		ravens.sort((a, b) => a.width - b.width);
		timeToNextRaven = 0;
	}

	[...particles, ...ravens, ...explosions].forEach(e => e.update(deltaTime));
	[...particles, ...ravens, ...explosions].forEach(e => e.draw());
	ravens = ravens.filter(e => !e.markedForDeletion);
	explosions = explosions.filter(e => !e.markedForDeletion);
	particles = particles.filter(e => !e.markedForDeletion);

	drawScore();
	requestAnimationFrame(animation);
}

animation(0);

//Timestamp is used to make sure that the game runs in old and new computers.
// Just when there is reached a certain amount of milliseconds the next frsme is shown.
// Everything thst is drawn in canvas is layered, this means that an object in canvad will
// be over snother object following the flow of the code. For example, if you draw a rectangle
// first and in the next vode line you draw a circle, the circle will be on top of the rectangle
// ctx.getImageData(x, y, width, height) returns aan object with the information of the area (width and height)
// we pass in the position (x, y). This function return data of one part of the canvas, and we select that part
// of the canvas by passing the arguments (x, y, width, height)
