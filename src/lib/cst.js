export function transformContext (context, transorms = []) {
	transorms.forEach(({type, x, y, angle}) => {
		switch (type) {
			case 'translate': context.translate(x || 0, y || 0); break;
			case 'scale': context.scale(x || 1, y || 1); break;
			case 'rotate': context.rotate(angle); break;
			default: throw new Error('Unknown transform type');
		}
	});
}