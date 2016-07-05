"use strict";

const {screen: {availWidth, availHeight}} = window;

const that = {};

let zoneList = [];

function configure (elem, attrs = {}) {
	for (let key in attrs)
		elem.setAttribute(key, attrs[key]);
}

export default class Canvas {
	constructor (elem, params = {}) {

		if (that.canvas) 
			throw new Error("Canvas element allways initialised.");

		const {width=availWidth, height=availHeight, ...attrs} = params;

		that.canvas = document.createElement('canvas');

		configure(that.canvas, {width, height});
		configure(that.canvas, attrs);

		elem.appendChild(that.canvas);

		that.context = that.canvas.getContext('2d');

		'addZone,removeZone,redraw'.split(',').forEach(key => this[key] = this[key].bind(this));
	}

	get context () {
		return that.context;
	}

	get canvas () {
		return that.canvas;
	}

	addZone (zone) {
		zone.context = that.context;
		zoneList.push(zone);

		return this;
	}

	removeZone (zoneId) {
		zoneList = zoneList.filter(({id}) => id !== zoneId);
		return this;
	}

	redraw () {
		zoneList.forEach(zone => zone.redraw(true)); //Simple redraw: redraw only zone, not zones above.
		return this;
	}
}