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

/***/ "./src/js/interesReserva.js":
/*!**********************************!*\
  !*** ./src/js/interesReserva.js ***!
  \**********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\ndocument.querySelector('#experiencia').addEventListener('change', async function() {\r\n    const experienciaId = this.value;\r\n    const preferenciaSelect = document.querySelector('#preferencia');\r\n\r\n    // Verifica que se haya seleccionado la Experiencia Preferida\r\n    if(!experienciaId) {\r\n        preferenciaSelect.disabled = true;\r\n        preferenciaSelect.innerHTML = '<option value=\"\">Seleccione Preferencia</option>';\r\n    }\r\n\r\n    // Habilita el boton para selecciona la Preferencia\r\n    preferenciaSelect.disabled = false;\r\n\r\n    // Consulta y obtiene una respuesta de la API\r\n    const response = await fetch(`/reserva/${experienciaId}/tipo-eventos`);\r\n    const preferencias = await response.json();\r\n    console.log(preferencias);\r\n\r\n    // Limpias las opciones anteriores\r\n    preferenciaSelect.innerHTML = '<option value=\"\">Seleccione Preferencia</option>';\r\n\r\n    // \r\n    preferencias.forEach(preferencia => {\r\n        const option = document.createElement('option');\r\n        option.value = preferencia.id;\r\n        option.textContent = preferencia.name;\r\n        preferenciaSelect.appendChild(option);\r\n    })\r\n})\r\n\r\ndocument.querySelector('#preferencia').addEventListener('change', function() {\r\n    const experienciaId = document.querySelector('#experiencia').value;\r\n    let preferenciaId = document.querySelector('#preferencia').value;\r\n    const interesButton = document.querySelector('#interesButton');\r\n\r\n    if(preferenciaId == \"\") {\r\n        preferenciaId = undefined;\r\n    }\r\n\r\n    if(!preferenciaId) {\r\n        interesButton.classList.remove('cursor-pointer');\r\n        interesButton.classList.add('bg-gray-400');\r\n        interesButton.classList.add('pointer-events-none')\r\n        interesButton.classList.remove('bg-sky-950');\r\n        interesButton.classList.remove('hover:bg-sky-600');\r\n        interesButton.classList.remove('duration-200');\r\n    } else {\r\n        interesButton.classList.add('cursor-pointer');\r\n        interesButton.classList.remove('bg-gray-400');\r\n        interesButton.classList.remove('pointer-events-none')\r\n        interesButton.classList.add('bg-sky-950');\r\n        interesButton.classList.add('hover:bg-sky-600');\r\n        interesButton.classList.add('duration-200');\r\n    }\r\n})\r\n\r\ndocument.querySelector('#interesButton').addEventListener('click', function() {\r\n    const interesDiv = document.querySelector('#formInteres');\r\n    const reservaDiv = document.querySelector('#reservaDiv');\r\n\r\n    // Valores ingresados por el usuario\r\n    const experienciaId = document.querySelector('#experiencia').value;\r\n    let preferenciaId = document.querySelector('#preferencia').value;\r\n\r\n    // Valores ocultos en el formulario de la Reserva\r\n    const interesPrincipalInput = document.querySelector('#interesPrincipalInput');\r\n    const PreferenciaInput = document.querySelector('#PreferenciaInput');\r\n    interesPrincipalInput.value = experienciaId;\r\n    PreferenciaInput.value = preferenciaId;\r\n\r\n    interesDiv.classList.add('hidden');  \r\n    reservaDiv.classList.remove('hidden');  \r\n})\n\n//# sourceURL=webpack://servicio-hoteleria/./src/js/interesReserva.js?");

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
/******/ 	__webpack_modules__["./src/js/interesReserva.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;