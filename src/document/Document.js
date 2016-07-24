"use strict";

import createCanvas from '../lib/createCanvas';

const {innerHeight, innerWidth} = window;

let that = {
	background: x => x,
	children: []
};

function configure (elem, attrs = {}) {
	for (let key in attrs)
		elem.setAttribute(key, attrs[key]);
}

export default class Document {
	constructor (elem, params = {}) {

		if (that.canvas) 
			throw new Error("Canvas element allways initialised.");

		const {width=innerWidth, height=availHeight, ...attrs} = params;

		that = {...that, ...createCanvas({...params, width, height}, elem)}

		'addNode,removeNodes,redraw,clear,distClear'.split(',').forEach(key => this[key] = this[key].bind(this));
	}

	get context () {
		return that.context;
	}

	get canvas () {
		return that.canvas;
	}

	addNode (node, pos = -1) {
		const {children} = that;
		const {length} = children;

		while (pos < 0)
			pos += (length || 1);

		if (pos > length)
			pos = length;

		children.splice(pos, 0, node);
		node.parent = this;

		return this;
	}

	clear () {
		that.background();

		return this;
	}

	distClear () {
		that.context.clearRect(0, 0, that.width, that.height);

		return this;
	}

	setBackground (func) {
		if (typeof func !== 'function')
			throw new Error('Argument must be a function');

		that.background = func.bind(this);

		return this;
	}

	removeNodes (...nodes) {

		const {children} = that;
		nodes.forEach(node => {delete node.parent});
		that.children = children.filter(({parent}) => parent === this);

		return this;
	}

	redraw (alpha) {
		const {context} = this;
		const {children = [], background} = that;

		context.beginPath();
		context.save();

		background();

		children.forEach(node => {
			context.save()
			context.beginPath();
			node.draw(alpha);
			context.restore();
		});

		context.restore();

		return this;
	}
}