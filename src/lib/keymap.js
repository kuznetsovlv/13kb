import getModifiers from './modifiers';

const keyCodeToKeyName = {
	8:"Backspace", 9:"Tab", 13:"Enter", 16:"Shift", 17:"Control", 18:"Alt",
	19:"Pause", 20:"CapsLock", 27:"Esc", 32:"Spacebar", 33:"PageUp",
	34:"PageDown", 35:"End", 36:"Home", 37:"Left", 38:"Up", 39:"Right",
	40:"Down", 45:"Insert", 46:"Del",
	48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",
	65:"A", 66:"B", 67:"C", 68:"D", 69:"E", 70:"F", 71:"G", 72:"H", 73:"I",
	74:"J", 75:"K", 76:"L", 77:"M", 78:"N", 79:"O", 80:"P", 81:"Q", 82:"R",
	83:"S", 84:"T", 85:"U", 86:"V", 87:"W", 88:"X", 89:"Y", 90:"Z",
	96:"0",97:"1",98:"2",99:"3",100:"4",101:"5",102:"6",103:"7",104:"8",
	105:"9",106:"Multiply", 107:"Add", 109:"Subtract", 110:"Decimal",
	111:"Divide",
	59:";", 61:"=", 186:";", 187:"=",
	188:",", 190:".", 191:"/", 192:"`", 219:"[", 220:"\\", 221:"]", 222:"'"
};

export default function keymap (event) {

	const {key, keyIdentifier, keyCode} = event;

	const keyName = (key || (keyIdentifier && keyIdentifier.substring(0, 2) !== 'U+' ? keyIdentifier : keyCodeToKeyName[keyCode]) || '').toUpperCase();

	if (!keyName)
		return;

	const modifiers = getModifiers (event);

	const keyId = `${modifiers}${keyName.toLowerCase()}`;

	return {modifiers, keyName, keyId};
}