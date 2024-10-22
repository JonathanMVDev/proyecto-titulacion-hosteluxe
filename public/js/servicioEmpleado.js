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

/***/ "./src/js/servicioEmpleado.js":
/*!************************************!*\
  !*** ./src/js/servicioEmpleado.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\ndocument.querySelector('#pedidos').addEventListener('click', function() {\r\n    // Selectores Div\r\n    const pedidosDiv = document.querySelector('#pedidosDiv');\r\n    const mantencionDiv = document.querySelector('#mantencionDiv');\r\n    const eventosDiv = document.querySelector('#eventosDiv');\r\n    // Selectores Button\r\n    const pedidosButton = document.querySelector('#pedidos');\r\n    const mantencionButton = document.querySelector('#mantencion');\r\n    const eventosButton = document.querySelector('#eventos');\r\n\r\n    // Manipulacion de Buttons\r\n    pedidosButton.classList.remove('bg-sky-900');\r\n    pedidosButton.classList.add('bg-gray-400');\r\n    pedidosButton.classList.add('pointer-events-none');\r\n\r\n    mantencionButton.classList.remove('bg-gray-400');\r\n    mantencionButton.classList.add('bg-sky-900');\r\n    mantencionButton.classList.remove('pointer-events-none');\r\n    eventosButton.classList.remove('bg-gray-400');\r\n    eventosButton.classList.add('bg-sky-900');\r\n    eventosButton.classList.remove('pointer-events-none');\r\n\r\n    // Manipulacion de Divs\r\n    mantencionDiv.classList.add('hidden');\r\n    eventosDiv.classList.add('hidden');\r\n    pedidosDiv.classList.remove('hidden');\r\n})\r\n\r\ndocument.querySelector('#mantencion').addEventListener('click', function() {\r\n    // Selectores\r\n    const mantencionDiv = document.querySelector('#mantencionDiv');\r\n    const pedidosDiv = document.querySelector('#pedidosDiv');\r\n    const eventosDiv = document.querySelector('#eventosDiv');\r\n    // Selectores Button\r\n    const pedidosButton = document.querySelector('#pedidos');\r\n    const mantencionButton = document.querySelector('#mantencion');\r\n    const eventosButton = document.querySelector('#eventos');\r\n\r\n    // Manipulacion de Buttons\r\n    mantencionButton.classList.remove('bg-sky-900');\r\n    mantencionButton.classList.add('bg-gray-400');\r\n    mantencionButton.classList.add('pointer-events-none');\r\n\r\n    pedidosButton.classList.remove('bg-gray-400');\r\n    pedidosButton.classList.remove('pointer-events-none');\r\n    pedidosButton.classList.add('bg-sky-900');\r\n    eventosButton.classList.remove('bg-gray-400');\r\n    eventosButton.classList.remove('pointer-events-none');\r\n    eventosButton.classList.add('bg-sky-900');\r\n\r\n    // Manipulacion de Divs\r\n    eventosDiv.classList.add('hidden');\r\n    pedidosDiv.classList.add('hidden');\r\n    mantencionDiv.classList.remove('hidden');\r\n})\r\n\r\ndocument.querySelector('#eventos').addEventListener('click', function() {\r\n    // Selectores\r\n    const pedidosDiv = document.querySelector('#pedidosDiv');\r\n    const mantencionDiv = document.querySelector('#mantencionDiv');\r\n    const eventosDiv = document.querySelector('#eventosDiv');\r\n    // Selectores Button\r\n    const pedidosButton = document.querySelector('#pedidos');\r\n    const mantencionButton = document.querySelector('#mantencion');\r\n    const eventosButton = document.querySelector('#eventos');\r\n\r\n    // Manipulacion de Buttons\r\n    eventosButton.classList.remove('bg-sky-900');\r\n    eventosButton.classList.add('bg-gray-400');\r\n    eventosButton.classList.add('pointer-events-none');\r\n    \r\n    mantencionButton.classList.remove('bg-gray-400');\r\n    mantencionButton.classList.remove('pointer-events-none');\r\n    mantencionButton.classList.add('bg-sky-900');\r\n    pedidosButton.classList.remove('bg-gray-400');\r\n    pedidosButton.classList.remove('pointer-events-none');\r\n    pedidosButton.classList.add('bg-sky-900');\r\n\r\n    // Manipulacion de Divs\r\n    mantencionDiv.classList.add('hidden');\r\n    pedidosDiv.classList.add('hidden');\r\n    eventosDiv.classList.remove('hidden');\r\n})\n\n//# sourceURL=webpack://servicio-hoteleria/./src/js/servicioEmpleado.js?");

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
/******/ 	__webpack_modules__["./src/js/servicioEmpleado.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;