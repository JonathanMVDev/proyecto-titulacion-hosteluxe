/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/inputCorreo.js":
/*!*******************************!*\
  !*** ./src/js/inputCorreo.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nconst Nombre = document.getElementById('name')\r\nconst Paterno = document.getElementById('paterno')\r\nconst Materno = document.getElementById('materno')\r\nconst Password = document.getElementById('password')\r\n\r\nconst Email = document.getElementById('emailEmpleado')\r\n\r\nfunction limpiarTexto(texto) {\r\n    return texto.normalize(\"NFD\").replace(/[\\u0300-\\u036f]/g, \"\").replace('ñ', 'n').replace('Ñ', 'N')\r\n}\r\n\r\nfunction actualizarInputs() {\r\n    const nombre = limpiarTexto(Nombre.value.trim().toLowerCase())\r\n    const paterno = limpiarTexto(Paterno.value.trim().toLowerCase())\r\n    const materno = limpiarTexto(Materno.value.trim().toLowerCase())\r\n\r\n    if (nombre && paterno && materno) {\r\n        Email.value = `${nombre.substring(0, 2)}.${paterno}${materno.charAt(0)}@servicioHosteluxe.cl`\r\n    } else {\r\n        Email.value = ''\r\n    }\r\n\r\n    if (nombre && paterno) {\r\n        Password.value = `${nombre}.${paterno.substring(0, 2)}`\r\n    }\r\n}\r\n\r\nNombre.addEventListener('input', actualizarInputs)\r\nPaterno.addEventListener('input', actualizarInputs)\r\nMaterno.addEventListener('input', actualizarInputs)\n\n//# sourceURL=webpack://servicio-hoteleria/./src/js/inputCorreo.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/inputCorreo.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;