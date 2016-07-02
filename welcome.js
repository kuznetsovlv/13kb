"use strict";

module.exports = function (message) {

	if (DEV)
		console.log(message);

	alert(`Welcome ${message}!`);
}