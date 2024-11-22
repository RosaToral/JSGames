/** @type {HTMPCanvasElement} */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image;
playerImage.src = "/assets/shadow_dog.png";

function animation () {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	ctx.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);

	requestAnimationFrame(animation);
}

animation();
