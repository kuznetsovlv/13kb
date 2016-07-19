"use strict";

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

export function emit (type, ...data) {
	const {handlerList = {}} = this.getProps();

	(handlerList[type] || []).forEach(method => method.apply(this, [type].concat(data)));

	return this;
}