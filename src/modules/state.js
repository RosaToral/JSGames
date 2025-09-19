import { states, inputs } from "./variables.js";

class State {
	constructor (state) {
		this.state = state;
	}
}

export class StandingLeft extends State {
	constructor (player) {
		super("STANDING LEFT");
		this.player = player;
	}
	enter () {
		this.player.frameY = 1;
	}
	handleInput (input) {
		if (input === inputs.PRESS_RIGHT)
			this.player.setState(states.STANDING_RIGHT);
		else if (input === inputs.PRESS_LEFT)
			this.player.setState(states.RUNNING_LEFT)
		else if (input === inputs.PRESS_DOWN)
			this.player.setState(states.SITTING_LEFT);
	}
}

export class StandingRight extends State {
	constructor (player) {
		super("STANDING RIGHT");
		this.player = player;
	}
	enter () {
		this.player.frameY = 0;
		this.player.speed = 0;
	}
	handleInput (input) {
		if (input === inputs.PRESS_LEFT)
			this.player.setState(states.STANDING_LEFT);
		else if (input === inputs.PRESS_RIGHT)
			this.player.setState(states.RUNNING_RIGHT)
		else if (input === inputs.PRESS_DOWN)
			this.player.setState(states.SITTING_RIGHT);
	}
}

export class SittingLeft extends State {
	constructor (player) {
		super("SITTING LEFT");
		this.player = player;
	}
	enter () {
		this.player.frameY = 9;
		this.player.speed = 0;
	}
	handleInput (input) {
		if (input === inputs.PRESS_RIGHT)
			this.player.setState(states.SITTING_RIGHT);
		else if (input === inputs.PRESS_UP)
			this.player.setState(states.STANDING_LEFT);
		else if (input === inputs.RELEASE_DOWN)
			this.player.setState(states.STANDING_LEFT);
	}
}

export class SittingRight extends State {
	constructor (player) {
		super("SITTING RIGHT");
		this.player = player;
	}
	enter () {
		this.player.frameY = 9;
	}
	handleInput (input) {
		if (input === inputs.PRESS_LEFT)
			this.player.setState(states.SITTING_LEFT);
		else if (input === inputs.PRESS_UP)
			this.player.setState(states.STANDING_RIGHT);
		else if (input === inputs.RELEASE_DOWN)
			this.player.setState(states.STANDING_RIGHT);
	}
}


export class RunningLeft extends State {
	constructor (player) {
		super("RUNNING LEFT");
		
		this.player = player;
	}
	enter () {
		this.player.frameY = 7;
		this.player.speed = -this.player.maxSpeed; 
	}
	handleInput (input) {
		if (input === inputs.PRESS_RIGHT)
			this.player.setState(states.RUNNING_RIGHT);
		else if (input === inputs.RELEASE_LEFT) 
			this.player.setState(states.STANDING_LEFT);
		else if (input === inputs.PRESS_DOWN)
			this.player.setState(states.SITTING_LEFT);
	}
}

export class RunningRight extends State {
	constructor (player) {
		super("RUNNING RIGHT");
		this.player = player;
	}
	enter () {
		this.player.frameY = 6;
		this.player.speed = this.player.maxSpeed; 
	}
	handleInput (input) {
		if (input === inputs.PRESS_LEFT)
			this.player.setState(states.RUNNING_LEFT);
		else if (input === inputs.RELEASE_RIGHT)
			this.player.setState(states.STANDING_RIGHT);
		else if (input === inputs.PRESS_DOWN)
			this.player.setState(states.SITTING_RIGHT);
	}
}

