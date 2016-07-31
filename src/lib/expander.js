"use strict";

export default function expander (elem, ...interfaces) {

	function add (obj, val) {
		try {
			return val.bind(obj);
		} catch (e) {
			if (!val || typeof val !== 'object')
				return val;

			let res;

			if (val instanceof Array) {
				res = [];

				for (let i = 0, length = val.length; i < length; ++i)
					res.push(add(res, val[i]));
			} else {
				res = {};

				for (let key in val)
					res[key] = add(res, val[key]);
			}

			return res;
		}
	}

	elem.expand = (function (...interfaces) {
		interfaces.forEach(iface => {
			for (let key in iface)
				elem[key] = add(elem, iface[key]);
		});

		return this;
	}).bind(elem);

	return elem.expand.apply(elem, interfaces);
}
