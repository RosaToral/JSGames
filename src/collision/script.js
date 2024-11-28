const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const canvasPosition = canvas.getBoundingClientRect();

const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 700;
const explosions = [];

class Explosion {
	constructor (x, y) {
		this.x = x;
		this.y = y;
		this.spriteWidth = 200;
		this.spriteHeight = 179;
		this.width = this.spriteWidth/2;
		this.height = this.spriteHeight/2;
		this.timer = 0;
		this.frame = 0;
		this.angle = Math.random() * 6.2;
		this.image = new Image();
		this.image.src = "/assets/boom.png";
		// this.sound = new Audio();
		// this.sound.src = "/assets/boom.wav";
	}

	update () {
		this.timer++;
		// if (this.frame === 0) this.sound.play();
		if (this.timer % 10 === 0)
			this.frame++;
	}
	draw () {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, 0 - this.width/2, 0 - this.height/2, this.width, this.height);
		ctx.restore();
	}
}

window.addEventListener('click', clickEvent);

function clickEvent (e) {
	let x = e.x - canvasPosition.left;
	let y = e.y - canvasPosition.top;
	explosions.push(new Explosion(x, y));
}

function animation () {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	for (let i = 0; i < explosions.length; i++) {
		const e = explosions[i];
		e.update();
		e.draw();
		if (e.frame > 5) {
			explosions.splice(i, 1);
			i--;
		}

	}

	requestAnimationFrame(animation);
}

animation();
