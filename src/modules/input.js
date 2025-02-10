import { keys, inputs } from "./variables.js";

export default class InputHandler {
	constructor () {
		this.lastKey = "";
		this.touchTreshold = 30;
		this.touchX = 0;
		this.touchY = 0;

		window.addEventListener('keydown', e => {
			switch (e.key) {
				case keys.ARROW_LEFT:
					this.lastKey = inputs.PRESS_LEFT;
					break;
				case keys.ARROW_RIGHT:
					this.lastKey = inputs.PRESS_RIGHT;
					break;
				case keys.ARROW_DOWN:
					this.lastKey = inputs.PRESS_DOWN;
					break;
				case keys.ARROW_UP:
					this.lastKey = inputs.PRESS_UP;
					break;
			}
		});
		window.addEventListener('keyup', e => {
			switch (e.key) {
				case keys.ARROW_LEFT:
					this.lastKey = inputs.RELEASE_LEFT;
					break;
				case keys.ARROW_RIGHT:
					this.lastKey = inputs.RELEASE_RIGHT;
					break;
				case keys.ARROW_DOWN:
					this.lastKey = inputs.RELEASE_DOWN;
					break;
				case keys.ARROW_UP:
					this.lastKey = inputs.RELEASE_UP;
					break;
			}
		});
		window.addEventListener('touchstart', (e) => {
			this.touchX = e.changedTouches[0].pageX;
			this.touchY = e.changedTouches[0].pageY;
		});
		window.addEventListener('touchmove', (e) => {
			const swipeDistance = e.changedTouches[0].pageX - this.touchX;
			const swipeDistanceY = e.changedTouches[0].pageY - this.touchY;

			if (swipeDistance < -this.touchTreshold && this.lastKey !== inputs.PRESS_LEFT) {
				this.lastKey = inputs.PRESS_LEFT;
			} else if (swipeDistance > this.touchTreshold && this.lastKey !== inputs.PRESS_RIGHT) {
				this.lastKey = inputs.PRESS_RIGHT;
			}

			if (swipeDistanceY < -this.touchTreshold && this.lastKey !== inputs.PRESS_DOWN) {
				this.lastKey = inputs.PRESS_DOWN;
			} else if (swipeDistanceY > this.touchTreshold && this.lastKey !== inputs.PRESS_UP) {
				this.lastKey = inputs.PRESS_UP;
			}
		});
		window.addEventListener('touchend', (e) => {
			this.touchX = 0;
			switch (this.lastKey) {
				case inputs.PRESS_LEFT:
					this.lastKey = inputs.RELEASE_LEFT;
					break;
				case inputs.PRESS_RIGHT:
					this.lastKey = inputs.RELEASE_RIGHT;
					break;
			}
		});

	}
}
