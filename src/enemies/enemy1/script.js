/** @type {HTMPCanvasElement} */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 1000;

const numberOfEnemies = 100;
const enemiesArray = [];
let gameFrame = 0;

class Enemy {
	constructor (image) {
		this.image = image;
		// this.speed = Math.random() * 4 - 2;
		this.spriteWidth = 293;
		this.spriteHeight = 155;
		this.width = this.spriteWidth / 2.5;
		this.height = this.spriteHeight / 2.5;
		this.x = Math.random() * (canvas.width - this.width);
		this.y = Math.random() * (canvas.height - this.height);

		this.frame = 0;
		this.flapSpeed = Math.floor(Math.random() * 3 + 1);

	}
	update () {
		this.x += Math.random() * 15 - 7.5;
		this.y += Math.random() * 10 - 5;

		if (gameFrame % this.flapSpeed === 0) {
			this.frame > 4 ? this.frame = 0 : this.frame++;
		}
	}
	draw () {
		ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
	}
}

for (let i = 0; i <= numberOfEnemies; i++) {
	const enemyImage = new Image();
	enemyImage.src = "/assets/enemy1.png";

	enemiesArray.push(new Enemy(enemyImage));
}

function animation () {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	enemiesArray.forEach(e => {
		e.update();
		e.draw();
	});

	gameFrame++;

	requestAnimationFrame(animation);
}

animation();
