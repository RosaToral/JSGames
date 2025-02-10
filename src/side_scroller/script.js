window.addEventListener('load', function(event) {

	const canvas = document.getElementById("canvas");
	const screenWidth = window.innerWidth;
	const screenHeight = window.innerHeight;
	const rect = canvas.getBoundingClientRect()
	const ctx = canvas.getContext('2d');
	const DOWN = "ArrowDown";
	const UP = "ArrowUp";
	const LEFT = "ArrowLeft";
	const RIGHT = "ArrowRight";
	/**
	const UP = "SwipeUp";
	const DOWN = "SwipeDown";
	const LEFT = "SwipeLeft";
	const RIGHT = "SwipeRight";
	*/

	// const playerImage = document.getElementById('playerImage');

	canvas.width = 800;
	canvas.height = 720;
	let enemies = [];
	let score = 0;
	let gameOver = false;

	class InputHandler {
		constructor () {
			this.keys = [];
			/**
			This keys array is used to optumize the movements not to keep a track of each button
			the user presses. This array helps the game prevent a move from rwpeating a lot of times
			when a kay is being pressed for so long. When the key is released, is removed form the array
			indicating thst the movement needs to stop now.
			It's used because is simple to manage one array instead of 8 diferent events (up, down, left
			and right when the key is pressesd and when is released)
			*/
			window.addEventListener('keydown', (e) => {
				if ( e.key === DOWN
					|| e.key === UP
					|| e.key === LEFT
					|| e.key === RIGHT
					&& !this.keys.includes(e.key) )//this.keys.indexOf(e.key) === -1
					this.keys.push(e.key);
			});
			window.addEventListener('keyup', (e) => {
				if ( e.key === DOWN
					|| e.key === UP
					|| e.key === LEFT
					|| e.key === RIGHT)
					this.keys.splice(this.keys.indexOf(e.key), 1);
			});

			// Detectar eventos táctiles para simular los movimientos de flechas
			window.addEventListener('touchstart', (e) => this.handleTouchStart(e), {
			  passive: false,
			});
			window.addEventListener('touchend', (e) => this.handleTouchEnd(e), {
			  passive: false,
			});
			window.addEventListener('touchmove', (e) => this.handleTouchMove(e), {
				passive: false,
			});

			
		}

		handleTouchStart(e) {
			const touch = e.touches[0];
			const x = touch.clientX;
			const y = touch.clientY;

			// alert("top: "+rect.top+", bottom: "+rect.bottom+". x: "+x+", y: "+y);

			// Definir zonas de la pantalla para detectar el deslizamiento
			if (y < rect.top) {
				if (!this.keys.includes(UP)) this.keys.push(UP); // Arriba
					this.activeTouch = UP;  // Guardar la dirección activa
			} else if (x > screenWidth / 2 && y > rect.top && y < rect.bottom) {
				if (!this.keys.includes(RIGHT)) this.keys.push(RIGHT); // Derecha
					this.activeTouch = RIGHT;
			} else if (y > rect.bottom) {
				if (!this.keys.includes(DOWN)) this.keys.push(DOWN); // Abajo
					this.activeTouch = DOWN;
			} else if (x < screenWidth / 2 && y > rect.top && y < rect.bottom) {
				if (!this.keys.includes(LEFT)) this.keys.push(LEFT); // Izquierda
					this.activeTouch = LEFT;
			}
		}

		handleTouchEnd(e) {
			// Cuando el toque termina, solo eliminar la dirección asociada a ese toque
			if (this.activeTouch && this.keys.includes(this.activeTouch)) {
				this.keys.splice(this.keys.indexOf(this.activeTouch), 1);
				this.activeTouch = null;  // Resetear la dirección activa
			}
		}

		// Prevenir el comportamiento predeterminado durante el movimiento (touchmove)
		handleTouchMove(e) {
			e.preventDefault();
		}

		
/**
This function could be used just if the game is goingo to grow,
so the events can keep simple and scalable.
But this time is not necesary because the game is so simple that
calling this function over and over could produce a little lag in
the game, almost imperceptible, but keeping this game as simple as
possible is a better aproach
	#isMovementEvent (key) {
		const isDown = key === 'ArrowDown';
		const isUp = key === 'ArrowUp';
		const isLeft = key === 'ArrowLeft';
		const isRight = key === 'ArrowRight';

		return isDown || isUp || isLeft || isRight;
	}
	*/
	}

	class Player {
		constructor (gameWidth, gameHeight) {
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.width = 200;
			this.height = 200;
			this.x = 0;
			this.y = this.gameHeight - this.height;
			this.image = playerImage;
			this.frameX = 0;
			this.frameY = 0;
			this.speed = 0;
			this.vy = 0;
			this.weight = 1;
			this.maxFrames = 8;
			this.fps = 20;
			this.frameTimer = 0;
			this.frameInterval = 1000/this.fps;
		}

		draw (context) {
			context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
		}

		update (input, deltaTime, enemies) {
			// Collision detection
			enemies.forEach(e => {
				const dx = (e.x + e.width/2) - (this.x + this.width/2);
				const dy = (e.y + e.height/2) - (this.y + this.height/2);
				const distance = Math.sqrt(dx*dx + dy*dy);
				if (distance < e.width/2 + this.width/2) {
					gameOver = true;
				}
			});

			// Sprite animation
			if (this.frameTimer > this.frameInterval) {
				if (this.frameX >= this.maxFrames) this.frameX = 0;
				else this.frameX++;
				this.frameTimer = 0;
			} else this.frameTimer += deltaTime;

			// Controllers
			if (input.keys.includes(RIGHT))
				this.speed = 5;
			else if (input.keys.includes(LEFT))
				this.speed = -5;
			else if (input.keys.includes(UP) && this.onGround())
				this.vy -= 32;
			else
				this.speed = 0;

			this.x += this.speed;
			if (this.x < 0) this.x = 0;
			else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;

			this.y += this.vy;
			if (!this.onGround()) {
				this.vy += this.weight;
				this.frameY = 1;
				this.maxFrames = 5;
			} else {
				this.vy = 0;
				this.frameY = 0;
				this.maxFrames = 8;
			}

			if (this.y > this.gameHeight - this.height)
				this.y = this.gameHeight - this.height;
		}

		onGround () {
			return this.y >= this.gameHeight - this.height;
		}
	}

	class Enemy {
		constructor (gameWidth, gameHeight) {
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.width = 160;
			this.height = 119;
			this.image = enemyImage;
			this.x = this.gameWidth;
			this.y = this.gameHeight - this.height;
			this.frameX = 0;
			this.maxFrames = 5;
			this.fps = 20;
			this.frameTimer = 0;
			this.frameInterval = 1000/this.fps;
			this.speed = 8;
			this.markedForDeletion = false;
		}

		draw (context) {
			context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
		}

		update (deltaTime) {
			if (this.frameTimer > this.frameInterval) {
				if (this.frameX >= this.maxFrames) this.frameX = 0;
				else this.frameX++;
				this.frameTimer = 0;
			} else this.frameTimer += deltaTime;
			this.x -= this.speed;

			if (this.x < 0 - this.width) {
				this.markedForDeletion = true;
				score++;
			}
		}
	}

	class Background {
		constructor (gameWidth, gameHeight) {
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.image = backgroundImage;
			this.x = 0;
			this.y = 0;
			this.width = 2400;
			this.height = 720;
			this.speed = 7;
		}

		draw (context) {
			context.drawImage(this.image, this.x, this.y, this.width, this.height);
			context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
		}

		update () {
			this.x -= this.speed;
			if (this.x < 0 - this.width) this.x = 0;
		}
		
	}

	function handleEnemies (deltaTime) {
		if (enemyTimer > enemyInterval+ randomEnemyInterval) {
			enemies.push(new Enemy(canvas.width, canvas.height));
			randomEnemyInterval = Math.random() * 5000 + 3500;
			enemyTimer = 0;
		} else
			enemyTimer += deltaTime;

		enemies.forEach(e => {
			e.draw(ctx);
			e.update(deltaTime);
		});

		enemies = enemies.filter(e => !e.markedForDeletion);
	}

	function displayStatusText (context) {
		context.font = "700 50px 'Courier New'";
		context.fillStyle = "black";
		context.fillText("Score: " + score, 20, 50);
		context.fillStyle = "white";
		context.fillText("Score: " + score, 22, 52);
		if (gameOver) {
			context.textAlign = "center";
			context.fillStyle = "black";
			context.fillText("GAME OVER", canvas.width/2, 200);
			context.fillStyle = "white";
			context.fillText("GAME OVER", canvas.width/2 + 2, 202);

			
		}
	}

	const inputH = new InputHandler();
	const player = new Player(canvas.width, canvas.height);
	const background = new Background(canvas.width, canvas.height);
	let lastTime = 0;
	let randomEnemyInterval = Math.random() * 2000 + 1500;
	let enemyInterval = 1000;
	let enemyTimer = 0;

	function animation (timeStamp) {
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		background.draw(ctx);
		background.update();
		player.draw(ctx);
		player.update(inputH, deltaTime, enemies);
		handleEnemies(deltaTime);
		displayStatusText(ctx);

		if (!gameOver) requestAnimationFrame(animation);
	}

	animation(0);

});
