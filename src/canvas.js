"use strict";

import createCanvas from './createCanvas';

const {screen: {availWidth, availHeight}} = window;

let that = {};

let fragmentList = [];

function configure (elem, attrs = {}) {
	for (let key in attrs)
		elem.setAttribute(key, attrs[key]);
}

export default class Canvas {
	constructor (elem, params = {}) {

		if (that.canvas) 
			throw new Error("Canvas element allways initialised.");

		const {width=availWidth, height=availHeight, ...attrs} = params;

		that = {...that, ...createCanvas()}

		'addFragment,removeFragment,redraw'.split(',').forEach(key => this[key] = this[key].bind(this));
	}

	get context () {
		return that.context;
	}

	get canvas () {
		return that.canvas;
	}

	addFragment (fragment) {
		fragment.context = that.context;
		fragmentList.push(fragment);

		return this;
	}

	removeFragment (fragmentId) {
		fragmentList = fragmentList.filter(({id}) => id !== fragmentId);
		return this;
	}

	redraw () {
		fragmentList.forEach(fragment => fragment.redraw());
		return this;
	}
}