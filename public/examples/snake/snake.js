(function (Canvas, Item, Zone, animator, expander, events) {
"use strict";

	window.onload = function () {
		var CANVAS_WIDTH = 600;
		var CANVAS_HEIGHT = 400;
		var ROOM_SIZE = 400;
		var CELLS = 20;
		var CELL_SIZE = ROOM_SIZE / CELLS;
		var CELL_STYLE_FREE = 0;
		var CELL_CTYLE_FOOD = 1;
		var CELL_STYLE_SNAKE = 2;

		var canvas = new Canvas(document.body, {width: CANVAS_WIDTH, height: CANVAS_HEIGHT});
		var room = new Zone (
			'room',
			(CANVAS_WIDTH - ROOM_SIZE) / 2,
			0,
			{x: 1, y: 1},
			{width: ROOM_SIZE, height: ROOM_SIZE, border: {lineWidth: 2, strokeStyle: '#000'}},
			function (context, x, y, props) {
				context.fillStyle = '#00ff00';
				context.fillRect(0, 0, props.width, props.height);
			}
		);

		canvas.addFragment(room);


		var pixels = [];

		for (var i = 0; i < CELLS; ++i) {
			var row = [];
			for (var j = 0; j < CELLS; ++j) {
				var item = expander(new Item(
					['cell', [0, i].join('').substr(-2), [0, j].join('').substr(-2)].join('-'),
					function (context, x, y, props) {
						switch (props.style) {
							case CELL_STYLE_FREE: context.fillStyle = 'rgba(0,0,0,0)'; break;
							case CELL_CTYLE_FOOD: context.fillStyle = '#f00'; break;
							case CELL_STYLE_SNAKE: context.fillStyle = '#00f'; break;
							default: throw new Error("Incorrect cell style.");
						}
						context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
					},
					j * CELL_SIZE,
					i * CELL_SIZE,
					{}
					), events, {
					setStyle: function (style) {
						return this.setProps({style: style}, true)
					}

				}).setStyle(CELL_STYLE_FREE);
				row.push(item);
				room.addFragment(item);
			}
			pixels.push(row);
		}

		canvas.redraw();
	}
})(_13kb.Canvas, _13kb.Item, _13kb.Zone, _13kb.animator, _13kb.expander, _13kb.events);