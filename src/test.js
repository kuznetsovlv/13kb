"use strict";

export const Canvas = () => {
	let stampStart, dateStart;

	function  f (timeStamp) {
		const now = Date.now();

		if (!stampStart) {
			stampStart = timeStamp;
			dateStart = now;
		}
		const d = now - dateStart;

		console.log(`Stamp: ${timeStamp - stampStart}, Date: ${d}, or ${d / 1000}s, or ${new Date(d)}`);

		console.log(`Index: ${window.requestAnimationFrame(f)}`);
	}

	f();
}

export const Item = x => x;