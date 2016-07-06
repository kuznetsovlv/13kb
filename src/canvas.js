"use strict";

const {screen: {availWidth, availHeight}} = window;

const that = {};

let layerList = [];

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

	addZone (layer) {
		layer.context = that.context;
		layerList.push(layer);

		return this;
	}

	removeZone (layerId) {
		layerList = layerList.filter(({id}) => id !== layerId);
		return this;
	}

	redraw (layerId) {


		if (!id) {
			layerList.forEach(layer => layer.redraw(true)); //Simple redraw: redraw only layer, not layers above.
		} else {
			const index = layerList.reduce((a, {id}, i) => a = layerId === id ? i : a, -1);

			if (index >= 0)
				layerList.slice(i).forEach(layer => layer.redraw(true)); //Simple redraw: redraw only layer, not layers above.
		}
		
		return this;
	}
}