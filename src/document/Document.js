"use strict";

import createCanvas        from '../lib/createCanvas';
import expander            from '../lib/expander';
import * as eventInterfase from '../interfaces/events';
import eventFactory        from '../event/event-factory';


const {innerHeight, innerWidth} = window;

let that = {
	background: x => x,
	children: []
};

export default class Document {
	constructor (elem, params = {}) {

		if (that.canvas) 
			throw new Error("Canvas element allways initialised.");

		const {width = innerWidth, height = innerHeight, transitEvents = [], ...attrs} = params;

		that = {...that, ...createCanvas({...params, width, height}, elem), ...attrs}

		'addNode,removeNodes,redraw,clear,distClear,getProps,setProps,setBackground'.split(',').forEach(key => this[key] = this[key].bind(this));

		expander(this, eventInterfase);

		transitEvents.forEach(type => that.canvas.addEventListener(type, event => console.log(this, event), false));
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

	getProps (name) {
		return name ? that[name] : that;
	}

	setProps (props = {}, mod) {

		if (mod)
			that = {...that, ...props}
		else
			that = {...props};

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

	toSystem ({x, y}) {
		return {x, y};
	}

	toExtraSystem ({x, y}) {
		return {x, y};
	}
}