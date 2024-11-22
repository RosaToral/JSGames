const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image;
playerImage.src = "/assets/shadow_dog.png";
const spriteWidth = 575;
const spriteHeight = 523;

let gameFrame = 0;

const staggerFrames = 5;
const spriteAnimations = [];
const animationStates = [
	{ name: "idle", frames: 7 },
	{ name: "jump", frames: 7 },
	{ name: "fall", frames: 7 },
	{ name: "run", frames: 9 },
	{ name: "dizzy", frames: 11 },
	{ name: "sit", frames: 5 },
	{ name: "roll", frames: 7 },
	{ name: "bite", frames: 7 },
	{ name: "ko", frames: 12 },
	{ name: "getHit", frames: 4 },
];

let selectedAnimation = "idle";

animationStates.forEach((state, i) => {
	let frames = { loc: [] };
	for (let j = 0; j < state.frames; j++) {
		let px = j*spriteWidth;
		let py = i*spriteHeight;

		frames.loc.push({ x: px, y: py });
	}
	spriteAnimations[state.name] = frames;
});

function animation () {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	let position = Math.floor(gameFrame/staggerFrames)%spriteAnimations[selectedAnimation].loc.length;
	let frameX = spriteWidth * position;
	let frameY = spriteAnimations[selectedAnimation].loc[position].y;

	ctx.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);

	gameFrame++;
	requestAnimationFrame(animation);
}

animation();


const changeSelect = document.getElementById("animation");

changeSelect.addEventListener("change", changeAnimation);

function changeAnimation (e) {
	selectedAnimation = event.target.value;
}
