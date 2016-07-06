"use strict";

export const Canvas = () => {
	const createCanvas = (id, width = 100, heigth = 100, root = document.body) => {
		const elem = document.createElement('canvas');

		if (id)
			elem.setAttribute('id', id);

		elem.width = width;
		elem.height = heigth;

		const context = elem.getContext('2d');

		root.appendChild(elem);

		return {elem, context, id};
	};

	const canvas_1 = createCanvas('test-main', 500, 500);
	const canvas_2 = createCanvas('test-secondary');

	canvas_2.context.fillStyle = '#f00';
	canvas_2.context.fillRect(0, 0, 100, 100);
	canvas_2.context.fill();

	canvas_1.context.drawImage(canvas_2.elem, 50, 0, 100, 50);

	canvas_2.context.fillStyle = '#00f';
	canvas_2.context.fillRect(0, 0, 100, 100);
	canvas_2.context.fill();

	canvas_1.context.drawImage(canvas_2.elem, 100, 100);

	canvas_2.context.fillStyle = '#0f0';
	canvas_2.context.fillRect(0, 0, 100, 100);
	canvas_2.context.fill();

	canvas_1.context.drawImage(canvas_2.elem, 0, 0, 50, 50, 200, 200, 50, 50);
}