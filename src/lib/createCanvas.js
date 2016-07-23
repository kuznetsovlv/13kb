"use strict";

const {innerHeight, innerWidth} = window;

export default function (params ={}, root = document.body) {

	const {width=innerHeight, height=innerWidth, ...remains} = params;

	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	canvas.width = width;
	canvas.height = height;

	for (let key in remains)
		canvas.setAttribute(key, remains[key]);

	root.appendChild(canvas);

	return {canvas, context, width, height};
}