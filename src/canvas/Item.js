"use strict";

import {items, checkItem} from '../private';

export default class Item {
	constructor (id, draw, x = 0, y =0, props = {}) {

		if (!id || items[id])
			throw new Error('Element Item must have an unique id.');

		if (typeof draw !== 'function')
			throw new Errror ('The "draw" method must be a function.');

		items[id] = {id, draw: draw.bind(this), x, y, props, item: this};

		Object.defineProperty(this, 'id', {get: () => id});
	}

	getContext () {
		return items[checkItem(this)].context;
	}

	setContext (context) {
		items[checkItem(this)].context = context;

		return this;
	}

	getProps (name) {
		const {props} = items[checkItem(this)];

		return name ? props[name] : props;
	}

	setProps (props = {}, mod) {
		const id = checkItem(this);

		if (mod) {
			const item = items[id];

			item[id] = {...item, ...props, item: this}

		} else {
			items[id].props = {...props};
		}
	}

	redraw () {
		const {draw, x, y, props, context} = items[checkItem(this)];

		context.save();

		draw(context, x, y, props);

		context.restore();

		return this;
	}

	remove () {
		delete items[checkItem(this)];
		delete this.id;
	}
}