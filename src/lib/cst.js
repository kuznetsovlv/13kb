export function transformContext (context, transorms = []) {
	transorms.forEach(({type, x, y, angle = 0}, i) => {
		switch (type) {
			case 'translate': context.translate(x || 0, y || 0); break;
			case 'scale': context.scale(x || 1, y || 1); break;
			case 'rotate': context.rotate(angle); break;
			default: throw new Error(`Unknown transform type at position ${i}.`);
		}
	});
}

function rotate ({x, y}, angle) {
	const c = Math.cos(angle);
	const s = Math.sin(angle);

	const _x = x * c + y * s;
	const _y = -x * s + y * c;

	return {x: _x, y: _y};
}

export function toSystem ({x = 0, y = 0}, transorms = []) {
	return transforms.reduce(({type, x:tx, y:ty, angle = 0}, i) => {
		switch (type) {
			case 'translate': x -= (tx || 0); y -= (ty || 0); break;
			case 'scale': x /= (tx || 1); y /= (ty || 1); break;
			case 'rotate': return rotate({x, y}, angle);
			default: throw new Error(`Unknown transform type at position ${i}.`);
		}

		return {x, y};
	}, {x, y});
}

export function fromSystem ({x = 0, y = 0}, transorms = []) {
	const {length} = transforms;
	const last = length - 1;
	return transorms.map((x, i) => transforms[last - i]).reduce (({type, x:tx, y:ty, angle = 0}, i) => {
		switch (type) {
			case 'translate': x += (tx || 0); y += (ty || 0); break;
			case 'scale': x *= (tx || 1); y *= (ty || 1); break;
			case 'rotate': return rotate({x, y}, -angle);
			default: throw new Error(`Unknown transform type at position ${i}.`);
		}
	}, {x, y});
}