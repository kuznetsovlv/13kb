"use strict";

import {items, checkItem}                       from '../lib/private';
import {transformContext, toSystem, fromSystem} from '../lib/cst';
import expander                                 from '../lib/expander';
import * as eventInterfase                      from '../interfaces/events';

const createId = (function  () {
	let id = 0;

	return () => (new Number(id++)).toString(16);

})();

function commitDraw (draw, context, x, y, props, alpha) {
	context.beginPath();
	context.save();
		draw(context, x, y, props, alpha);
	context.restore();
}
 
export default class Node {
	constructor (props = {}) {
		const id = createId();

		if (!id || items[id])
			throw new Error('Element Item must have an unique id.');

		const {draw, predraw, postdraw, children = [], ...rest} = props;

		if (typeof draw !== 'function')
			throw new Errror ('The "draw" method must be a function.');

		items[id] = {...rest, id, draw: draw.bind(this), children, item: this};

		try {
			Object.defineProperty(this, 'id', {get: () => id});
		} catch (e) {
			this.id = id;
		}

		try {
			if (predraw)
				items[id].predraw = predraw.bind(this);
			if (postdraw)
				items[id].postdraw = postdraw.bind(this);
		} catch (e) {}

		'addNode,removeNodes,draw,getProps,setProps,toSystem,toExtraSystem'.split(',').forEach(key => this[key] = this[key].bind(this));

		expander(this, eventInterfase);
	}

	get context () {
		checkItem(this);
		return this.parent ? this.parent.context : null;
	}

	get canvas () {
		checkItem(this);
		return this.parent ? this.parent.canvas : null;
	}

	addNode (node, pos = -1) {
		const {children} = items[checkItem(this)];
		const {length} = children;

		while (pos < 0)
			pos += (length || 1);

		if (pos > length)
			pos = length;

		children.splice(pos, 0, node);
		node.parent = this;

		return this;
	}

	removeNodes (...nodes) {
		const that = items[checkItem(this)];
		const {children} = that;
		nodes.forEach(node => {delete node.parent});
		that.children = children.filter(({parent}) => parent === this);

		return this;
	}

	getProps (name) {
		const props = items[checkItem(this)];

		return name ? props[name] : props;
	}

	setProps (props = {}, mod) {
		const id = checkItem(this);

		if (mod) {
			const oldProps = items[id];

			items[id] = {...oldProps, ...props}

		} else {
			items[id] = {...props};
		}

		return this;
	}

	draw (alpha) {
		const {x = 0, y = 0, draw, predraw, postdraw, transforms =[], children = [], ...rest} = items[checkItem(this)];
		const context = this.context;

		context.beginPath();
		context.save();
		transformContext(context, transforms);

		if (predraw) {
			context.save();
			predraw(context, x, y, rest, alpha);
		}

		commitDraw(draw, context, x, y, rest, alpha);

		children.forEach(node => {
			context.save()
			context.beginPath();
			node.draw(alpha);
			context.restore();
		});

		if (postdraw)
			commitDraw(postdraw, context, x, y, rest, alpha);

		if (predraw)
			context.restore();

		context.restore();
	}

	toSystem ({x, y}) {
		const {transforms =[]} = items[checkItem(this)];

		return toSystem({x, y}, transforms);
	}

	toExtraSystem ({x, y}) {
		const {transforms =[]} = items[checkItem(this)];

		return fromSystem({x, y}, transforms);
	}
};