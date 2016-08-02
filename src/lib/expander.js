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

				for (let key in val) {
					const v = add(res, val[key]);
					if (v !== undefined)
						res[key] = v;
				}
			}

			return res;
		}
	}

	elem.expand = (function (...interfaces) {
		interfaces.forEach(iface => {
			for (let key in iface) {
				const v = add(elem, iface[key]);
				if (v !== undefined)
					elem[key] = v;
			}
		});

		return this;
	}).bind(elem);

	return elem.expand.apply(elem, interfaces);
}
