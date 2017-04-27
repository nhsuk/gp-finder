/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/* unknown exports provided */
/* all exports used */
/*!***********************************!*\
  !*** ./public/src/search-form.js ***!
  \***********************************/
/***/ (function(module, exports) {

eval("/* global $,Rx */\n\nfunction updatePage(html) {\n  $('#searchResults').html(html);\n  $('.results__subheader').remove();\n}\n\nfunction handleError() {\n  $('#searchResults').html('<p>We have problems retrieving results. Please try again later.</p>');\n}\n\nfunction clearSearch() {\n  $('#searchResults').html('');\n}\n\nfunction disableFormElements() {\n  $('#searchForm').submit(() => false);\n  $('.form-group--submit').remove();\n  $('.hr--higher').remove();\n  $('#search').attr('placeholder', 'Start typing to see results...');\n}\n\nfunction removeWhitespace(text) {\n  return text.replace(/^\\s+|\\s+$/gm, '');\n}\n\nfunction getSearchObservable() {\n  const searchInput = $('#search')[0];\n  return Rx.DOM.keyup(searchInput);\n}\n\nfunction createSearchObservable() {\n  const inputEvents = getSearchObservable()\n    .pluck('target', 'value')\n    .map(removeWhitespace)\n    .debounce(500);\n\n  inputEvents.filter(text => text.length === 0)\n    .subscribe(clearSearch);\n\n  const words = inputEvents\n    .filter(text => text.length > 2)\n    .distinctUntilChanged();\n  return words;\n}\n\nfunction subscribeToFieldChange(siteRoot) {\n  function callApi(term) {\n    $.get(`${siteRoot}/results`, { search: term }, updatePage).fail(handleError);\n    return term;\n  }\n  createSearchObservable().subscribe(callApi, handleError);\n}\n\n// eslint-disable-next-line no-unused-vars\nfunction enableSPA(siteRoot) {\n  disableFormElements();\n  subscribeToFieldChange(siteRoot);\n}\n\nmodule.exports = {\n  getSearchObservable,\n  subscribeToFieldChange,\n  enableSPA,\n  removeWhitespace,\n  disableFormElements,\n  clearSearch,\n  handleError,\n  updatePage,\n}//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3B1YmxpYy9zcmMvc2VhcmNoLWZvcm0uanM/OGMwYiJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgJCxSeCAqL1xuXG5mdW5jdGlvbiB1cGRhdGVQYWdlKGh0bWwpIHtcbiAgJCgnI3NlYXJjaFJlc3VsdHMnKS5odG1sKGh0bWwpO1xuICAkKCcucmVzdWx0c19fc3ViaGVhZGVyJykucmVtb3ZlKCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUVycm9yKCkge1xuICAkKCcjc2VhcmNoUmVzdWx0cycpLmh0bWwoJzxwPldlIGhhdmUgcHJvYmxlbXMgcmV0cmlldmluZyByZXN1bHRzLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyLjwvcD4nKTtcbn1cblxuZnVuY3Rpb24gY2xlYXJTZWFyY2goKSB7XG4gICQoJyNzZWFyY2hSZXN1bHRzJykuaHRtbCgnJyk7XG59XG5cbmZ1bmN0aW9uIGRpc2FibGVGb3JtRWxlbWVudHMoKSB7XG4gICQoJyNzZWFyY2hGb3JtJykuc3VibWl0KCgpID0+IGZhbHNlKTtcbiAgJCgnLmZvcm0tZ3JvdXAtLXN1Ym1pdCcpLnJlbW92ZSgpO1xuICAkKCcuaHItLWhpZ2hlcicpLnJlbW92ZSgpO1xuICAkKCcjc2VhcmNoJykuYXR0cigncGxhY2Vob2xkZXInLCAnU3RhcnQgdHlwaW5nIHRvIHNlZSByZXN1bHRzLi4uJyk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVdoaXRlc3BhY2UodGV4dCkge1xuICByZXR1cm4gdGV4dC5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nbSwgJycpO1xufVxuXG5mdW5jdGlvbiBnZXRTZWFyY2hPYnNlcnZhYmxlKCkge1xuICBjb25zdCBzZWFyY2hJbnB1dCA9ICQoJyNzZWFyY2gnKVswXTtcbiAgcmV0dXJuIFJ4LkRPTS5rZXl1cChzZWFyY2hJbnB1dCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlYXJjaE9ic2VydmFibGUoKSB7XG4gIGNvbnN0IGlucHV0RXZlbnRzID0gZ2V0U2VhcmNoT2JzZXJ2YWJsZSgpXG4gICAgLnBsdWNrKCd0YXJnZXQnLCAndmFsdWUnKVxuICAgIC5tYXAocmVtb3ZlV2hpdGVzcGFjZSlcbiAgICAuZGVib3VuY2UoNTAwKTtcblxuICBpbnB1dEV2ZW50cy5maWx0ZXIodGV4dCA9PiB0ZXh0Lmxlbmd0aCA9PT0gMClcbiAgICAuc3Vic2NyaWJlKGNsZWFyU2VhcmNoKTtcblxuICBjb25zdCB3b3JkcyA9IGlucHV0RXZlbnRzXG4gICAgLmZpbHRlcih0ZXh0ID0+IHRleHQubGVuZ3RoID4gMilcbiAgICAuZGlzdGluY3RVbnRpbENoYW5nZWQoKTtcbiAgcmV0dXJuIHdvcmRzO1xufVxuXG5mdW5jdGlvbiBzdWJzY3JpYmVUb0ZpZWxkQ2hhbmdlKHNpdGVSb290KSB7XG4gIGZ1bmN0aW9uIGNhbGxBcGkodGVybSkge1xuICAgICQuZ2V0KGAke3NpdGVSb290fS9yZXN1bHRzYCwgeyBzZWFyY2g6IHRlcm0gfSwgdXBkYXRlUGFnZSkuZmFpbChoYW5kbGVFcnJvcik7XG4gICAgcmV0dXJuIHRlcm07XG4gIH1cbiAgY3JlYXRlU2VhcmNoT2JzZXJ2YWJsZSgpLnN1YnNjcmliZShjYWxsQXBpLCBoYW5kbGVFcnJvcik7XG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuZnVuY3Rpb24gZW5hYmxlU1BBKHNpdGVSb290KSB7XG4gIGRpc2FibGVGb3JtRWxlbWVudHMoKTtcbiAgc3Vic2NyaWJlVG9GaWVsZENoYW5nZShzaXRlUm9vdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRTZWFyY2hPYnNlcnZhYmxlLFxuICBzdWJzY3JpYmVUb0ZpZWxkQ2hhbmdlLFxuICBlbmFibGVTUEEsXG4gIHJlbW92ZVdoaXRlc3BhY2UsXG4gIGRpc2FibGVGb3JtRWxlbWVudHMsXG4gIGNsZWFyU2VhcmNoLFxuICBoYW5kbGVFcnJvcixcbiAgdXBkYXRlUGFnZSxcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9zcmMvc2VhcmNoLWZvcm0uanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ }),
/* 1 */
/* unknown exports provided */
/* all exports used */
/*!****************************!*\
  !*** ./public/src/main.js ***!
  \****************************/
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./search-form */ 0);//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3B1YmxpYy9zcmMvbWFpbi5qcz8wNjhjIl0sInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJy4vc2VhcmNoLWZvcm0nKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9zcmMvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9");

/***/ })
/******/ ]);