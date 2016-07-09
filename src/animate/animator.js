"use strict";

if (!window.requestAnimationFrame) {

	window.requestAnimationFrame = (callback) => {
		let now;

		try {
			now = Date.now();
		} catch (e) {
			now = new Date().getTime();
		}

		return setTimeOut(() => callback(now), 0);	
	}
}

export default function (animation, fps = 24) {
	const period = 1000 / fps;
	let start;

	function _animate (stamp) {
		if (!start)
			start = stamp;

		const alpha = (stamp - start) / period;

		animation(alpha);

		window.requestAnimationFrame(_animate);
	}

	return window.requestAnimationFrame(_animate);
}