var home =
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
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(1)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _welcome = __webpack_require__(3);

	var _welcome2 = _interopRequireDefault(_welcome);

	var _test = __webpack_require__(4);

	var _test2 = _interopRequireDefault(_test);

	(0, _welcome2['default'])('home');
	(0, _test2['default'])('test');

	exports['default'] = _welcome2['default'];
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(2);

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    default: obj
	  };
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (message) {

		if (true) console.log(message);

		// alert(`Welcome ${message}!`);

		alert('Welcome ' + message + '!');
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(1)["default"];

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _welcome = __webpack_require__(3);

	var _welcome2 = _interopRequireDefault(_welcome);

	exports["default"] = function (msg) {
		(0, _welcome2["default"])(msg);
	};

	module.exports = exports["default"];

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map