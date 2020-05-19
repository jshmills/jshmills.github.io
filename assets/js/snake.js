"use strict";
		
	var Game = function(timeInterval){
		this.timeInterval = timeInterval;
		this.points = 0;
		this.rounds;

		this.start = function(){
			snake.startPoint();
			food.setCoordinates((Math.floor(Math.random() * (board.size/board.getIncrement()) )) * board.getIncrement(), (Math.floor(Math.random() * (board.size/board.getIncrement()) )) * board.getIncrement());
			food.fill(board.ctx, board.getIncrement());
			run();
		};

		this.addPoints = function(){
			this.points ++;
			return this.points;
		};

		this.clearPoints = function(){
			this.points = 0;
			return this.points;
		}

		this.getTimeInterval = function(){
			return this.timeInterval;
		};

		this.end = function(){
			snake.clear();
			food.erase(board.ctx, board.getIncrement());
			message.clear();

		};
	};

	var Board = function(board){
		this.el = board;
		this.size = this.el.width;
		this.ctx = this.el.getContext("2d");

		this.getIncrement = function(){
			//must be a multiple of 500
			return this.size / 20;
		};
	};

	var Message = function(notice){
		this.notice = notice;

		this.writeMessage = function (message){
			this.notice.innerHTML = message;
		};

		this.clear = function(){
			this.notice.innerHTML = "";
		};
	};

	var Player = function(){
		this.key;

		this.setKey = function(key){
			this.key = key;
		};

		this.getKey = function(){
			return this.key;
		};
	};

	var Snake = function(ctx, increment, xPos, yPos){
		this.xPos = xPos;
		this.yPos = yPos;

		this.coordinates = [
			{x: this.xPos, y: this.yPos}
		];

		this.direction = 39;
		var ctx = ctx;
		this.fillColor = "#2ece1b";
		var increment = increment;

		this.move =  function(){

			switch(this.direction){
				case 39:
				this.right();
				break;
				case 37:
				this.left();
				break;
				case 38:
				this.up();
				break;
				case 40:
				this.down();
				break;
				default:
				message.writeMessage("error");
			}

			return;
		};


		this.startPoint = function(){
			this.xPos += increment;
			this.coordinates.push({x: this.xPos, y: this.yPos});
			this.xPos += increment;
			this.coordinates.push({x: this.xPos, y: this.yPos});

			for(var x = 0; x < this.coordinates.length; x++){
				ctx.fillStyle = this.fillColor;
				ctx.fillRect(this.coordinates[x].x, this.coordinates[x].y, increment, increment);
				
			}
		};

		this.right = function(){
			ctx.clearRect(this.coordinates[0].x, this.coordinates[0].y, increment, increment);
			this.coordinates.shift();
			this.xPos += increment;
			this.coordinates.push({x:this.xPos, y: this.yPos});
			ctx.fillStyle = this.fillColor;
			ctx.fillRect(this.xPos, this.yPos, increment, increment);
			

		};

		this.left = function(){
			ctx.clearRect(this.coordinates[0].x, this.coordinates[0].y, increment, increment);
			this.coordinates.shift();
			this.xPos -= increment;
			this.coordinates.push({x:this.xPos, y: this.yPos});
			ctx.fillStyle = this.fillColor;
			ctx.fillRect(this.xPos, this.yPos, increment, increment);
			
		};

		this.up = function(){
			ctx.clearRect(this.coordinates[0].x, this.coordinates[0].y, increment, increment);
			this.coordinates.shift();
			this.yPos -= increment;
			this.coordinates.push({x:this.xPos, y: this.yPos});
			ctx.fillStyle = this.fillColor;
			ctx.fillRect(this.xPos, this.yPos, increment, increment);
			
		};

		this.down = function(){
			ctx.clearRect(this.coordinates[0].x, this.coordinates[0].y, increment, increment);
			this.coordinates.shift();
			this.yPos += increment;
			this.coordinates.push({x:this.xPos, y: this.yPos});
			ctx.fillStyle = this.fillColor;
			ctx.fillRect(this.xPos, this.yPos, increment, increment);
			
		};

		this.grow = function(snake){

			switch (this.direction) {
				case 39:
				this.coordinates.unshift(this.xPos - (increment * 2), this.yPos);
				break;
				case 37:
				this.coordinates.unshift(this.xPos + (increment * 2), this.yPos);
				break;
				case 38:
				this.coordinates.unshift(this.xPos, this.yPos -  (increment * 2));
				break;
				case 40:
				this.coordinates.unshift(this.xPos, this.yPos + (increment * 2));
				break;
				default:
				message.writeMessage("error");
			}
		};

		this.clear = function(){

			for(var i = 0; i < this.coordinates.length; i++){
				ctx.clearRect(this.coordinates[i].x, this.coordinates[i].y, increment, increment);
			}
			this.coordinates = [];
		}
		
	};

	var Food = function(){

		this.x;
		this.y;
		this.fillColor = "#FF0000";


		this.setCoordinates = function(x,y){
			this.x = x;
			this.y = y;
		};

		this.getX = function(){
			return this.x;
		};

		this.getY = function(){
			return this.y;
		};

		this.fill = function(ctx, increment){
			ctx.fillStyle = this.fillColor;
			ctx.fillRect(this.x, this.y, increment, increment);
		};

		this.erase = function(ctx, increment){
			ctx.clearRect(this.x, this.y, increment, increment);
		};

	};

	var boardElement = document.getElementById("board");
	var startButton = document.getElementById("start");
	var restartButton = document.getElementById("restart");
	var notice =  document.getElementById("notice");
	var timeInterval = 200;
	var pointsElement = document.getElementById("points");

		var game;
		var board;
		var message;
		var player;
		var snake;
		var food;

	function instances(){
		game = new Game(timeInterval);
		board = new Board(boardElement);
		message =  new Message(notice);
		player = new Player();
		snake = new Snake(board.ctx, board.getIncrement(), board.size/2, board.size/2);
		food = new Food();
	}



	function run(){

		function placeFood(){
			food.setCoordinates((Math.floor(Math.random() * (board.size/board.getIncrement()) )) * board.getIncrement(), (Math.floor(Math.random() * (board.size/board.getIncrement()) )) * board.getIncrement());
			food.fill(board.ctx, board.getIncrement());
		}

		var snakeFunctions = function(){

			/* if snake is within board boundaries */
			if(snake.xPos >= 0 && snake.xPos <= board.size - board.getIncrement() && snake.yPos >= 0 && snake.yPos <= board.size - board.getIncrement()){

					/* if snakehead eats food, grow, replace food, add a point */
					if(snake.coordinates[snake.coordinates.length - 1].x == food.getX() && snake.coordinates[snake.coordinates.length - 1].y == food.getY()){
						snake.grow();
						placeFood();
						pointsElement.innerHTML = game.addPoints();

						/* speed up snake every 5 points */
						if(game.points % 5 === 0){
							clearInterval(gameInterval);
							game.timeInterval -= Math.floor(game.timeInterval * 0.15);
							gameInterval = setInterval(snakeFunctions, game.getTimeInterval());
						}
					}

					snake.move();

					for(let i = 0; i < snake.coordinates.length - 1; i++){
						/* if snake runs into itself, stop interval, write error */
						if(snake.coordinates[snake.coordinates.length - 1].x === snake.coordinates[i].x && snake.coordinates[snake.coordinates.length - 1].y === snake.coordinates[i].y){
							message.writeMessage("conflict");
							clearInterval(gameInterval);
						}
						/* if food lands on snake, replace it */
						if(food.getX() === snake.coordinates[i].x && food.getY() === snake.coordinates[i].y){
							food.erase(board.ctx,board.getIncrement());
							placeFood();
						}
					}
					

			}else{
				message.writeMessage("loser!");
				clearInterval(gameInterval);

			}
		
		};

		var gameInterval = setInterval(snakeFunctions, game.getTimeInterval());

	}


	window.onkeydown = function(e){
		var key = e.keyCode ? e.keyCode : e.which;
		player.setKey(key);

		switch(key) {
			case 39:
			if(snake.direction !== 37){
				snake.direction = player.getKey();
			}
			break;
			case 37:
			if(snake.direction !== 39){
				snake.direction = player.getKey();
			}
			break;
			case 38:
			if(snake.direction !== 40){
				snake.direction = player.getKey();
			}
			break;
			case 40:
			if(snake.direction !== 38){
				snake.direction = player.getKey();
			}
			break;
			default:
			message.writeMessage("error");
		}
		
	}

	startButton.addEventListener("click", function(){
		boardElement.style.display = "block";
		startButton.style.display = "none";
		restartButton.style.display = "block";
		instances();
		game.start();
	});

	restartButton.addEventListener("click", function(){
		game.end();
		pointsElement.innerHTML = game.clearPoints();
		instances();
		game.start();

	});

		