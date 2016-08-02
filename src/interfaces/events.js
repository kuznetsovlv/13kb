"use strict";

import Document from '../document/Document';
import Node     from '../node/Node';

export function on (type, handler) {
	if (typeof handler !== 'function')
		throw new Error('Handler must be a function');

	const tmp = this.getProps('handlerList');

	const handlerList = tmp || {};

	if (!tmp)
		this.setProps({handlerList}, true);

	if (!handlerList[type])
		handlerList[type] = [];

	handlerList[type].push(handler.bind(this));

	return this;
}

export function emit (event) {
	const {handlerList = {}, preHandlerList = {}, children = [], parent} = this.getProps();
	const {type, path, target} = event;

	if (!target || !(traget instanceof Document || target instanceof Node))
		event.target = this;
	

	const preHandler = preHandlerList[type];

	if (preHandler)
		event = preHandler(event)

	(handlerList[type] || []).forEach(method => method.call(this, {...event, path}));

	if (path) {
		const prev = path[path.length - 1];
		const _path = path.map(x => x);
		
		_path.push(this);

		if (parent !== prev)
			parent.emit({...event, path: _path});

		if (!children.some(x => x === prev))
			children.forEach(x => x.emit({...event, path: _path}));
	}

	return this;
}

const preHandlers = {
	'click,dblclick,mouseup,mousedown,mouseenter,mouseleave,mousemove': function (event) {
		const {path, data} = event;

		return {...event, path, data: this.toSystem(data)};
	}
};

export const defaultPrehandlers = {
	bind (elem) {
		const preHandlerList = {};

		for (let key in preHandlers) {
			const func = preHandlers[key].bind(elem);
			key.split(',').forEach(k => preHandlerList[k] = func);
		}

		elem.setProps({preHandlerList}, true);
	}
};