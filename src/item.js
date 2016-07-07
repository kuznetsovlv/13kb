"use strict";

const items = {};

function checkItem (item, id) {
	if (items[id].item !== item)
		throw new Error ("Structure destroied!");
}

export default class Item {
	constructor (id, draw, x = 0, y =0) {

		if (!id || items[id])
			throw new Error('Element Item must have an unique id.');

		if (typeof draw !== 'function')
			throw new Errror ('The "draw" method must be a function.');

		items[id] = {id, draw: draw.bind(this), x, y, item: this};

		this.id = id;
	}

	getContext () {
		const {id} = this;
		checkItem(this, id);
		return items[id].context;
	}

	setContext (context) {
		const {id} = this;
		checkItem(this, id);
		items[id].context = context;

		return this;
	}

	redraw () {
		const {id} = this;
		checkItem(this, id);
		const {draw, x, y, context} = items[id];

		draw(context, x, y);

		return this;
	}

	remove () {
		const {id} = this;
		checkItem(this, id);

		delete items[id];
		delete this.id;
	}
}