var _13kb =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	var Canvas = function Canvas() {
		var createCanvas = function createCanvas(id) {
			var width = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];
			var heigth = arguments.length <= 2 || arguments[2] === undefined ? 100 : arguments[2];
			var root = arguments.length <= 3 || arguments[3] === undefined ? document.body : arguments[3];

			var elem = document.createElement('canvas');

			if (id) elem.setAttribute('id', id);

			elem.width = width;
			elem.height = heigth;

			var context = elem.getContext('2d');

			root.appendChild(elem);

			return { elem: elem, context: context, id: id };
		};

		var canvas_1 = createCanvas('test-main', 500, 500);
		var canvas_2 = createCanvas('test-secondary');

		canvas_2.context.fillStyle = '#f00';
		canvas_2.context.fillRect(0, 0, 100, 100);
		canvas_2.context.fill();

		canvas_1.context.drawImage(canvas_2.elem, 50, 0, 100, 50);

		canvas_2.context.fillStyle = '#00f';
		canvas_2.context.fillRect(0, 0, 100, 100);
		canvas_2.context.fill();

		canvas_1.context.drawImage(canvas_2.elem, 100, 100);

		canvas_2.context.fillStyle = '#0f0';
		canvas_2.context.fillRect(0, 0, 100, 100);
		canvas_2.context.fill();

		canvas_1.context.drawImage(canvas_2.elem, 0, 0, 50, 50, 200, 200, 50, 50);
	};
	exports.Canvas = Canvas;

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map