"use strict";

import {items, checkItem}	from '../private';
import Item					from './Item';

function resScale ({x = 1, y = 1}) {
	return {x, y};
}

function resProps (props) {
	const {border = {}, width = 0, height = 0, fragmentList= []} = props;

	return {...props, border, width, height, fragmentList};
}

export default class Zone extends Item {
	constructor (id, x, y, scale = {x: 1, y: 1}, props = {}, predraw, postdraw) {
		super (id, x => x, x, y, {...resProps(props), scale: resScale(scale)});

		if (predraw)
			items[id].predraw = predraw.bind(this);
		if (postdraw)
			items[id].postdraw = postdraw.bind(this);

	}

	addFragment (fragment, pos = -1) {
		const {props: {fragmentList}}  = items[checkItem(this)];
		const {length} = fragmentList;

		while (pos < 0)
			pos += (length || 1);

		if (pos > length)
			pos = length;

		fragment.setContext(items[checkItem(this)].context);
		fragmentList.splice(pos, 0, fragment);

		return this;
	}

	clear () {
		const {x, y, props: {width, height}} = items[checkItem(this)];
		context.clearRect(x, y, width, height);
	}

	redraw () {
		const {x, y, props, context, predraw, postdraw} = items[checkItem(this)];
		const {border: {lineWidth = 0, strokeStyle="rgba(0, 0, 0, 0)"}, scale: {x:sx, y:sy}, fragmentList, width, height} = props;

		
		context.save();
		context.lineWidth = lineWidth;
		context.strokeStyle = strokeStyle;
		

		context.translate(x, y);
		context.clearRect(0, 0, width, height);
		context.strokeRect(0, 0, width, height);
		// context.clip();
		context.scale(sx, sy);

		if (predraw)
			predraw(context, x, y, props);

		fragmentList.forEach(fragment => fragment.redraw());

		if (postdraw)
			postdraw(context, x, y, props);

		context.restore();

		return this;
	}

	removeFragments (...fragmentIds) {

		const id = checkItem(this);
		const {props: {fragmentList}}  = items[id];

		fragmentIds = fragmentIds.reduce((a, b) => {a[b] = b; return a;}, {});

		fragmentList.filter(({id}) => id === fragmentIds[id]).forEach(fragment => fragment.setContext(null));

		items[id].props.fragmentList = fragmentList.filter(({id}) => id !== fragmentIds[id]);

		return this;
	}

	sort (...ids) {
		const {props: {fragmentList}}  = items[checkItem(this)];

		if (typeof ids[0] === 'function')
			fragmentList.sort(ids[0]) 
		else {
			if (ids[0] instanceof Array)
				ids = ids[0];

			fragmentList.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
		}

		return this;
	}
}