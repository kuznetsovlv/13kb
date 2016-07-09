"use strict";
import Canvas	from './canvas/Canvas';
import Item		from './canvas/Item';
import animator	from './animate/animator';

export default function () {
	const canvas = new Canvas(document.body);

	const context = canvas.context;

	const img = new Image();

	img.src = './4.png';

	const props = {
		frames: [
			{x1: 12, y1: 0, x2: 108, y2: 145, x_shift: 0, y_shift: 0},
			{x1: 110, y1: 0, x2: 180, y2: 145, x_shift: 0, y_shift: 0},
			{x1: 197, y1: 0, x2: 247, y2: 145, x_shift: 0, y_shift: 0},
			{x1: 266, y1: 0, x2: 336, y2: 145, x_shift: 0, y_shift: 0},
			{x1: 341, y1: 0, x2: 413, y2: 145, x_shift: 0, y_shift: 0}
		]
	};

	const draw = (function () {
		let index = 0;

		return function (context, x, y, {frames}) {
			const {x1, x2, y1, y2, x_shift, y_shift} = frames[(index++) % frames.length];

			const w = x2 - x1;
			const h = y2 - y1;

			context.drawImage(img, x1, y1, w, h, x + x_shift, y + y_shift, w, h);
		};
	})()

	img.addEventListener('load', event => {
		canvas.addFragment(new Item('girl', draw, 0, 0, props));

		animator((function () {
			let prevAlpha = -1;
			return function (alpha) {
				alpha = alpha >> 0;

				if (alpha <= prevAlpha)
					return;

				prevAlpha = alpha;

				canvas.distClear().redraw();

			}
		})(), 8);
	}, false);
	
}