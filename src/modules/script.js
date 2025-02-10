import Player from "./player.js"
import InputHandler from './input.js';
import { drawStatusText } from './utils.js';

window.addEventListener('load', function () {
	const loading = loadingTag;
	const canvas = canvas1;
	const ctx = canvas.getContext('2d');
	const btn = btnFullScreen;

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	loading.style.display = 'none';

	const player = new Player(canvas.width, canvas.height);
	const inputHandler = new InputHandler();

	function toggleFullScreen (e) {
		if (!document.fullscreenelement) {
			canvas.requestFullscreen().catch(err => alert(err));
		} else {
			document.exitFullscreen();
		}
	}
	btn.addEventListener('click', toggleFullScreen);

	function animation () {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		player.update(inputHandler.lastKey);
		player.draw(ctx);
		drawStatusText(ctx, inputHandler.lastKey);
		requestAnimationFrame(animation);
	}
	animation();
	

});





