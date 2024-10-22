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

/***/ "./src/js/editarInput.js":
/*!*******************************!*\
  !*** ./src/js/editarInput.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\ndocument.getElementById('categoria').addEventListener('change', async function() {\r\n    const categoriaId = this.value\r\n    const subcategoriaSelect = document.getElementById('subcategoria')\r\n\r\n\r\n    // Si no se seleccionó ninguna categoría, limpiar las subcategorías\r\n    if (!categoriaId) {\r\n        subcategoriaSelect.disabled = true\r\n        subcategoriaSelect.innerHTML = '<option value=\"\">Seleccione</option>';\r\n        return\r\n    }\r\n\r\n    // Si se seleccionó una categoría, habilitar subcategoría\r\n    subcategoriaSelect.disabled = false\r\n\r\n    // Hacer la solicitud AJAX para obtener las subcategorías\r\n    const response = await fetch(`/administrar/${categoriaId}/sub-categorias`)\r\n    const subcategorias = await response.json()\r\n\r\n    // Limpiar las opciones previas de subcategorías\r\n    subcategoriaSelect.innerHTML = 'option(value=\"\") Seleccione'\r\n\r\n    // Llenar el select con las nuevas subcategorías\r\n    subcategorias.forEach(subcategoria => {\r\n        const option = document.createElement('option')\r\n        option.value = subcategoria.id\r\n        option.textContent = subcategoria.name\r\n        subcategoriaSelect.appendChild(option)\r\n    })\r\n})\r\n\r\nwindow.addEventListener('DOMContentLoaded', async () => {\r\n    const categoriaId = document.getElementById('categoriaId').value\r\n    const subcategoriaId = document.getElementById('subcategoriaId').value\r\n    const categoriaSelect = document.getElementById('categoria')\r\n\r\n    if (categoriaId) {\r\n        categoriaSelect.value = categoriaId\r\n\r\n        const event = new Event('change')\r\n        categoriaSelect.dispatchEvent(event)\r\n\r\n        const subcategoriaSelect = document.getElementById('subcategoria')\r\n        if (subcategoriaId) {\r\n            subcategoriaSelect.value = subcategoriaId\r\n        }\r\n    }\r\n})\n\n//# sourceURL=webpack://servicio-hoteleria/./src/js/editarInput.js?");

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
/******/ 	__webpack_modules__["./src/js/editarInput.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;