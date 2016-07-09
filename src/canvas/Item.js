"use strict";

const items = {};

function checkItem (item, id) {
	if (items[id].item !== item)
		throw new Error ("Structure destroied!");
}

export default class Item {
	constructor (id, draw, x = 0, y =0, props = {}) {

		if (!id || items[id])
			throw new Error('Element Item must have an unique id.');

		if (typeof draw !== 'function')
			throw new Errror ('The "draw" method must be a function.');

		items[id] = {id, draw: draw.bind(this), x, y, props, item: this};

		this.id = {get: () => id};
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

	getProps (name) {
		const {id} = this;
		checkItem(this, id);
		const {props} = items[id];

		return name ? props[name] : props;
	}

	setProps (props = {}, mod) {
		const {id} = this;
		checkItem(this, id);

		if (mod) {
			const item = items[id];

			item[id] = {...item, ...props, item: this}

		} else {
			items[id].props = {...props};
		}
	}

	redraw () {
		const {id} = this;
		checkItem(this, id);
		const {draw, x, y, props, context} = items[id];

		context.save();

		draw(context, x, y, props);

		context.restore();

		return this;
	}

	remove () {
		const {id} = this;
		checkItem(this, id);

		delete items[id];
		delete this.id;
	}
}