"use strict";

export const items = {};

export const checkItem = (item) => {
	const {id} = item;
	if (items[id].item !== item)
		throw new Error ("Structure destroied!");
	return id;
};