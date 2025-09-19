import { StandingLeft, StandingRight, SittingLeft, SittingRight, RunningLeft, RunningRight } from "./state.js";

export default class Player {
	constructor(gameWidth, gameHeight) {
		this.gameWidth = gameWidth;
		this.gameHeight = gameHeight;
		this.states = [
			new StandingLeft(this),
			new StandingRight(this),
			new SittingLeft(this),
			new SittingRight(this),
			new RunningLeft(this),
			new RunningRight(this)
		];
		this.currentState = this.states[0];
		this.image = whiteDog;
		this.width = 200;
		this.height = 181.83;
		this.x = this.gameWidth/2 - this.width/2;
		this.y = this.gameHeight/2 - this.height/2;
		this.frameX = 0;
		this.frameY = 0;
		this.speed = 0;
		this.maxSpeed = 10;
	}
	draw(context) {

		context.drawImage(this.image, this.width * this.frameX, this.height * this.frameY,
											this.width, this.height, this.x, this.y , this.width, this.height);
	}
	update (input) {
		this.currentState.handleInput(input);
		this.x += this.speed;
	}
	setState (state) {
		this.currentState = this.states[state];
		this.currentState.enter();
	}
}
