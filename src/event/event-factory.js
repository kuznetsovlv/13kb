"use strict";

const coppyArr = arr => arr.map(x => x);

function setPath (event, isTransitable) {
	if (isTransitable)
		event.path = [event.target];
	return event;
}

export default function eventFactory ({type = 'default', target = null, data, isTransitable, ...rest}, ...restData) {

	if (!data && data !== 0)
		data = restData.length ? coppyArr(restData) : {};
	else if (typeof data !== 'object')
		data = {[data]: data};
	else if (data instanceof Array)
		data = data.concat(restData);

	if (!(data instanceof Array) && restData.length)
		data.additional = coppyArr(restData);

	return setPath({type, target, data, ...rest}, isTransitable);
}