export default function getModifiers (event) {
	let modifiers = '';

	if (event.altKey)
		modifiers = `alt+${modifiers}`;
	if (event.ctrlKey)
		modifiers = `ctrl+${modifiers}`;
	if (event.metaKey)
		modifiers = `meta+${modifiers}`;
	if (event.shiftKey)
		modifiers = `shift+${modifiers}`;

	return modifiers;
}