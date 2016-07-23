(function (Document, Node, animator, expander, events) {
	"use strict";

	var CANVAS_WIDTH = 600;
	var CANVAS_HEIGHT = 400;

	var ROOM_SIZE = 400;
	var ROOM_FILL_COLOR = "#00ff00";
	var ROOM_BORDER_COLOR = "#000";
	var ROOM_BORDER_WIDTH = 2;

	var CELLS = 20;

	var CELL_SIZE = ROOM_SIZE / CELLS;
	var RADIUS = CELL_SIZE / 2;
	var CELL_STYLE_FREE = 0;
	var CELL_STYLE_FOOD = 1;
	var CELL_STYLE_SNAKE = 2;

	var ROOM_FOOD_COLOR = "#f00";

	var INITIAL_SNAKE_LENGTH = 3;
	var SNAKE_COLOR = "#00f";
	var START_POINT_X = 1;
	var START_POINT_Y = 1;
	var SNAKE_INITIAL_HEAD_X = START_POINT_X + INITIAL_SNAKE_LENGTH - 1;

	var DOUBLE_PI = 2 * Math.PI;

	var INITIAL_SPEED_X = 1;
	var INITIAL_SPEED_Y = 2;

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

	window.onload = function () {
		

		var _document = new Document(document.body, {width: CANVAS_WIDTH, height: CANVAS_HEIGHT});
		var room = new Node ({
			draw: function (context, x, y, props) {
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
			translate: {x: (CANVAS_WIDTH - ROOM_SIZE) / 2, y: 0},
			width: ROOM_SIZE,
			height: ROOM_SIZE,
			predraw: function (context, x, y, props) {
				context.beginPath();
				context.lineWidth = ROOM_BORDER_WIDTH;
				context.strokeStyle = ROOM_BORDER_COLOR;
				context.fillStyle = ROOM_FILL_COLOR;
				context.strokeRect(0, 0, props.width, props.height);
				context.fillRect(0, 0, props.width, props.height);
			}
		});

		var speed = {
			x: INITIAL_SPEED_X,
			y: INITIAL_SPEED_Y
		};

		setFood();

		_document.addNode(room);
		_document.redraw();
	}
})(_13kb.Document, _13kb.Node, _13kb.animator, _13kb.expander, _13kb.events);