(function (Document, Node, animator, keymap) {
	"use strict";

	var FPS = 24;

	var CANVAS_WIDTH = 600;
	var CANVAS_HEIGHT = 500;
	var PADDING = 10;

	var ROOM_SIZE = 400;
	var ROOM_FILL_COLOR = "#00ff00";
	var ROOM_BORDER_COLOR = "#000";
	var ROOM_BORDER_WIDTH = 2;
	var ROOM_VERTICAL_SHIFT = CANVAS_HEIGHT - PADDING - ROOM_SIZE;

	var SCORE_HEIGHT = ROOM_VERTICAL_SHIFT - 2 * PADDING;
	var SCORE_WIDTH = ROOM_SIZE;
	var SCORE_FILL_COLOR = "#fff";
	var SCORE_BORDER_COLOR = "#000";
	var SCORE_BORDER_WIDTH = 2;
	var SCORE_BORDER_RADIUS = 10;

	var LOOT_WIDTH = CANVAS_WIDTH - SCORE_WIDTH - 3 * PADDING;
	var LOOT_HEIGHT = SCORE_HEIGHT;
	var LOOT_FILL_COLOR = "#fff";
	var LOOT_BORDER_COLOR = "#000";
	var LOOT_BORDER_WIDTH = 2;
	var LOOT_BORDER_RADIUS = 10;
	var LOOT_STRING_DISTANSE = 30;

	var STAT_WIDTH = LOOT_WIDTH;
	var STAT_HEIGHT = ROOM_SIZE;
	var STAT_FILL_COLOR = "#fff";
	var STAT_BORDER_COLOR = "#000";
	var STAT_BORDER_WIDTH = 2;
	var STAT_BORDER_RADIUS = 10;
	var STAT_STRING_DISTANSE = 30;

	var CELLS = 20;

	var CELL_SIZE = ROOM_SIZE / CELLS;
	var RADIUS = CELL_SIZE / 2;
	var CELL_STYLE_FREE = 0;
	var CELL_STYLE_FOOD = 1;
	var CELL_STYLE_SNAKE = 2;

	var ROOM_FOOD_COLOR = "#f00";

	var MAX_SCORE_FOR_FOOD = 100;
	var SCORE_DECREASE_BY_STEP = 5;

	var INITIAL_SNAKE_LENGTH = 3;
	var SNAKE_COLOR = "#ff0";
	var START_POINT_X = 1;
	var START_POINT_Y = 1;
	var SNAKE_INITIAL_HEAD_X = START_POINT_X + INITIAL_SNAKE_LENGTH - 1;

	var DOUBLE_PI = 2 * Math.PI;

	var INITIAL_SPEED_X = 1;
	var INITIAL_SPEED_Y = 0;

	var DIRECTION_UP = "UP";
	var DIRECTION_RIGHT = "RIGHT";
	var DIRECTION_DOWN = "DOWN";
	var DIRECTION_LEFT = "LEFT";

	if (SNAKE_INITIAL_HEAD_X >= CELLS)
		throw new Error("Incorrect initial data");

	var snake = [],
	    map = [];

	for (var i = 0; i < CELLS; ++i) {

		var row = [];
		for (var j = 0; j < CELLS; ++j) {
			if ((i === START_POINT_Y) && (j >= START_POINT_X) && (j <= SNAKE_INITIAL_HEAD_X)) {
				snake.unshift({x: j, y: i});
				row.push(CELL_STYLE_SNAKE);
			} else {
				row.push(CELL_STYLE_FREE);
			}
		}
		map.push(row);
	}

	function fillCircle (context, x, y, r, color) {
		context.fillStyle = color;
		context.lineWidth = 0;
		context.strokeStyle = "rgba(0, 0, 0, 0)"
		context.beginPath();
		context.moveTo(x + r, y);
		context.arc(x, y, r, 0, DOUBLE_PI, false);
		context.fill();
	}

	function setFood () {
		var free = [];

		map.forEach (function (row, i) {
			row.forEach(function (style, j) {
					if (style === CELL_STYLE_FREE)
						free.push({x: j, y: i});
			});
		});

		var length = free.length;

		var point = free[(Math.random() * length) >> 0];

		map[point.y][point.x] = CELL_STYLE_FOOD;
	}

	function getDirection (key) {
		var name = key.keyName;

		if (name === 'W' || (/UP/.test(name) && !/PAGEUP/.test(name)))
			return DIRECTION_UP;
		if (name === 'A' || /LEFT/.test(name))
			return DIRECTION_LEFT;
		if (name === 'D' || /RIGHT/.test(name))
			return DIRECTION_RIGHT;
		if (name === 'S' || (/DOWN/.test(name) && !/PAGEDOWN/.test(name)))
			return DIRECTION_DOWN;
	}

	window.onload = function () {

		var speed = {
		    	x: INITIAL_SPEED_X,
		    	y: INITIAL_SPEED_Y
		    },
		    directionChanged = false,
		    gameOver = false;
		
		var _document = new Document(document.body, {width: CANVAS_WIDTH, height: CANVAS_HEIGHT});
		var room = new Node ({
			draw: function (context, x, y, props, alpha) {
				map.forEach (function (row, i) {
					row.forEach(function (style, j) {
						var x = (j + 0.5) * CELL_SIZE,
						    y = (i + 0.5) * CELL_SIZE;

						switch (style) {
							case CELL_STYLE_FREE: break;
							case CELL_STYLE_FOOD: fillCircle(context, x, y, RADIUS, ROOM_FOOD_COLOR); break;
							case CELL_STYLE_SNAKE: fillCircle(context, x, y, RADIUS, SNAKE_COLOR); break;
							default: throw new Error("Incorrect cell type");
						}
					})
				});
			},
			translate: {x: PADDING, y: ROOM_VERTICAL_SHIFT},
			width: ROOM_SIZE,
			height: ROOM_SIZE,
			predraw: function (context, x, y, props) {
				var w = props.width, h = props.height;
				context.beginPath();
				context.clearRect(x, y, w, h);
				context.lineWidth = ROOM_BORDER_WIDTH;
				context.strokeStyle = ROOM_BORDER_COLOR;
				context.fillStyle = ROOM_FILL_COLOR;
				context.moveTo(0, 0);
				context.lineTo(w, 0);
				context.lineTo(w, h);
				context.lineTo(0, h);
				context.closePath();
				context.stroke();
				context.fill();
				context.clip();
			}
		});

		var gameOverText = new Node ({
			draw: function (context, x, y, props) {
				if (!gameOver)
					return;

				var gradient = props.gradient,
				    TEXT = "GAME OVER";

				if (!gradient) {
					var shift = 20;
					gradient = context.createLinearGradient(x, y - shift, x, y + shift);
					gradient.addColorStop(0, '#f00');
					gradient.addColorStop(1, '#000');

					this.setProps({gradient: gradient}, true);
				}

				context.font="bold 70px monospaced";
				context.lineWidth = 2;
				context.fillStyle = gradient;
				context.strokeStyle = '#000';
				context.shadowColor = 'rgba(200, 50, 50, 0.7)';
				context.shadowOffsetX = 7;
				context.shadowOffsetY = -3;
				context.shadowBlur = 5;
				context.textAlign = 'center';
				context.textBaseline = 'middle';
				context.strokeText(TEXT, x, y);
				context.fillText(TEXT, x, y);
			},
			x: CANVAS_WIDTH /2,
			y: CANVAS_HEIGHT / 2
		});

		var scores = new Node ({
			draw: function (context, x, y, props) {
				context.font="italic 30px monospaced";
				context.fillStyle = '#000';
				context.textAlign = 'left';
				context.textBaseline = 'middle';
				context.fillText(['Score', props.score].join(': '), x, y);
			},
			translate: {x: PADDING, y: PADDING},
			x: PADDING,
			y: SCORE_HEIGHT / 2,
			width: SCORE_WIDTH,
			height: SCORE_HEIGHT,
			predraw: function (context, x, y, props) {
				var w = props.width, h = props.height;
				context.beginPath();
				context.clearRect(0, 0, w, h);
				context.lineWidth = SCORE_BORDER_WIDTH;
				context.strokeStyle = SCORE_BORDER_COLOR;
				context.fillStyle = SCORE_FILL_COLOR;
				context.moveTo(w/2, 0);
				context.arcTo(w, 0, w, h, SCORE_BORDER_RADIUS);
				context.arcTo(w, h, 0, h, SCORE_BORDER_RADIUS);
				context.arcTo(0, h, 0, 0, SCORE_BORDER_RADIUS);
				context.arcTo(0, 0, w, 0, SCORE_BORDER_RADIUS);
				context.closePath();
				context.stroke();
				context.fill();
				context.clip();
			}
		}).setProps({score: 0}, true);

		var loot = new Node ({
			draw: function (context, x, y, props) {
				context.font="italic 30px monospaced";
				context.fillStyle = '#000';
				context.textAlign = 'center';
				context.textBaseline = 'middle';
				context.fillText('Loot:', x, y);
				context.fillText(props.loot, x, y + LOOT_STRING_DISTANSE);
			},
			translate: {x: 2 * PADDING + SCORE_WIDTH, y: PADDING},
			x: LOOT_WIDTH / 2,
			y: (LOOT_HEIGHT - LOOT_STRING_DISTANSE) / 2,
			width: LOOT_WIDTH,
			height: LOOT_HEIGHT,
			predraw: function (context, x, y, props) {
				var w = props.width, h = props.height;
				context.beginPath();
				context.clearRect(0, 0, w, h);
				context.lineWidth = LOOT_BORDER_WIDTH;
				context.strokeStyle = LOOT_BORDER_COLOR;
				context.fillStyle = LOOT_FILL_COLOR;
				context.moveTo(w/2, 0);
				context.arcTo(w, 0, w, h, LOOT_BORDER_RADIUS);
				context.arcTo(w, h, 0, h, LOOT_BORDER_RADIUS);
				context.arcTo(0, h, 0, 0, LOOT_BORDER_RADIUS);
				context.arcTo(0, 0, w, 0, LOOT_BORDER_RADIUS);
				context.closePath();
				context.stroke();
				context.fill();
				context.clip();
			}
		});

		var stat = new Node ({
			draw: function (context, x, y, props) {
				context.font="italic 20px monospaced";
				context.fillStyle = '#000';
				context.textAlign = 'left';
				context.textBaseline = 'middle';
				context.fillText(['Length', snake.length].join(': '), x, 50);
				context.fillText(['Eaten', props.eaten].join(': '), x, 150);
			},
			translate: {x: 2 * PADDING + ROOM_SIZE, y: 2 * PADDING + LOOT_HEIGHT},
			x: PADDING,
			width: STAT_WIDTH,
			height: STAT_HEIGHT,
			predraw: function (context, x, y, props) {
				var w = props.width, h = props.height;
				context.beginPath();
				context.clearRect(0, 0, w, h);
				context.lineWidth = LOOT_BORDER_WIDTH;
				context.strokeStyle = LOOT_BORDER_COLOR;
				context.fillStyle = LOOT_FILL_COLOR;
				context.moveTo(w/2, 0);
				context.arcTo(w, 0, w, h, LOOT_BORDER_RADIUS);
				context.arcTo(w, h, 0, h, LOOT_BORDER_RADIUS);
				context.arcTo(0, h, 0, 0, LOOT_BORDER_RADIUS);
				context.arcTo(0, 0, w, 0, LOOT_BORDER_RADIUS);
				context.closePath();
				context.stroke();
				context.fill();
				context.clip();
			}
		});

		window.addEventListener('keydown', function (event) {
			if (directionChanged)
				return;

			switch (getDirection(keymap(event))) {
				case DIRECTION_UP: if (!speed.y) speed = {x: 0, y: -1}; directionChanged = true; break;
				case DIRECTION_RIGHT: if (!speed.x) speed = {x: 1, y: 0}; directionChanged = true; break;
				case DIRECTION_DOWN: if (!speed.y) speed = {x: 0, y: 1}; directionChanged = true; break;
				case DIRECTION_LEFT: if (!speed.x) speed = {x: -1, y: 0}; directionChanged = true; break;
			}
		}, false);

		setFood();

		var scoreToAdd = MAX_SCORE_FOR_FOOD;

		_document.addNode(room)
		         .addNode(gameOverText)
		         .addNode(scores)
		         .addNode(loot.setProps({loot: scoreToAdd}, true))
		         .addNode(stat.setProps({eaten: 0}, true));
		_document.redraw();

		animator ((function () {
			var prev = 0;

			return function (alpha) {
				if (gameOver)
					return;

				alpha = alpha >> 0;

				var delta = alpha - prev;

				if (delta >= FPS / 4 && !gameOver) {
					var head = snake[0];
					var next = {x: head.x + speed.x, y: head.y + speed.y};
					var row = map[next.y];

					if (!row) {
						gameOver = true;
					} else {

						switch (row[next.x]) {
							case CELL_STYLE_FOOD:
								scores.setProps({score: scoreToAdd + scores.getProps('score')}, true);
								snake.unshift(next);
								row[next.x] = CELL_STYLE_SNAKE;
								setFood();
								room.draw();
								scores.draw();
								scoreToAdd = MAX_SCORE_FOR_FOOD;
								loot.setProps({loot: scoreToAdd}, true).draw();
								stat.setProps({eaten: stat.getProps('eaten') + 1}, true).draw();
								break;
							case CELL_STYLE_FREE:
								if (scoreToAdd) {
									scoreToAdd -= SCORE_DECREASE_BY_STEP;
									if (scoreToAdd < 0)
										scoreToAdd = 0;
									loot.setProps({loot: scoreToAdd}, true).draw();
								}
								var free = snake.pop();
								map[free.y][free.x] = CELL_STYLE_FREE;
								snake.unshift(next);
								row[next.x] = CELL_STYLE_SNAKE;
								room.draw();
								break;
							case CELL_STYLE_SNAKE:
							default: gameOver = true;
						}

						directionChanged = gameOver;
					}

					gameOverText.draw();

					prev = alpha;
				}
				return !gameOver;
			}
		})(), FPS);
	}
})(_13kb.Document, _13kb.Node, _13kb.animator, _13kb.keymap);