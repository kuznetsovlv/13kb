"use strict";

import createCanvas from './createCanvas';

const {screen: {availWidth, availHeight}} = window;

let that = {
	background: x => x
};

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

		that = {...that, ...createCanvas({...params, width, height}, elem)}

		'addFragment,removeFragments,redraw'.split(',').forEach(key => this[key] = this[key].bind(this));
	}

	get context () {
		return that.context;
	}

	get canvas () {
		return that.canvas;
	}

	addFragment (fragment, pos = -1) {
		const {length} = fragmentList;

		while (pos < 0)
			pos += (length || 1);

		if (pos > length)
			pos = length;

		fragment.setContext(that.context);
		fragmentList.splice(pos, 0, fragment);

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

		that.background = func.bind(that);

		return this;
	}

	removeFragments (...fragmentIds) {

		fragmentIds = fragmentIds.reduce((a, b) => {a[b] = b; return a;}, {});

		fragmentList.filter(({id}) => id === fragmentIds[id]).forEach(fragment => fragment.setContext(null));

		fragmentList = fragmentList.filter(({id}) => id !== fragmentIds[id]);

		return this;
	}

	redraw (begin = 0) {

		if (!begin)
			that.background();

		fragmentList.slice(begin).forEach(fragment => fragment.redraw());
		return this;
	}

	sort (...ids) {
		if (typeof ids[0] === 'function')
			fragmentList = fragmentList.sort(ids[0]) 
		else {
			if (ids[0] instanceof Array)
				ids = ids[0];

			fragmentList = fragmentList.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
		}

		return this;
	}
}