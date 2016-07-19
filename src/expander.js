"use strict";

export default function expander (elem, ...interfaces) {
	elem.expand = (function (...interfaces) {
		const {length} = interfaces
		for (let i = 0; i < length; ++i) {
			const iface = interfaces[i];

			for (let key in iface) {
				const value = iface[key];

				try {
					this[key] = value.bind(this);
				} catch (e) {
					if (typeof value === 'object') {
						if (value instanceof Array) {
							this[key] = [...value];
						} else {
							this[key] = {...value};
						}
					} else {
						this[key] = value;
					}
				}
			}
		}

		return this;
	}).bind(elem);

	elem.apply(elem, interfaces);
}
