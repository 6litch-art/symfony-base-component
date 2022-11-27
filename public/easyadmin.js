/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/styles/easyadmin.scss":
/*!**************************************!*\
  !*** ./assets/styles/easyadmin.scss ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************************!*\
  !*** ./assets/easyadmin.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_easyadmin_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/easyadmin.scss */ "./assets/styles/easyadmin.scss");

window.addEventListener('load', function (event) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    return CookieConsent.setCookie("user", "necessary", getUser(), 30 * 24 * 3600);
  });
});

//
// Apply bootstrap form validation
window.addEventListener('load', function (event) {

  //
  // Dock
  // $('#online-users li').resizeOnApproach({
  //     y: 0,
  //     split: 1,
  //     zoom: 2,
  //     jump: ,
  //     trigger: 1
  //   });
});
{/* <script>
 $(function () {
    $('[data-toggle="popover"]').popover({html:true})
    $('[data-toggle="tooltip"]').tooltip({trigger:"manual", html:true})
     $('[data-toggle="tooltip"]').on('click.persistent', function () { $(this).tooltip('toggle'); });
    $('[data-toggle="tooltip"]').on('mouseleave.persistent', function ()
    {
        $(this).data("hover", false);
        setTimeout(function () {
            if(!$(this).data("hover") && !$("#"+this.getAttribute("aria-describedby")).data("hover"))  {
                $("#"+this.getAttribute("aria-describedby")).off('mouseenter.persistent');
                $("#"+this.getAttribute("aria-describedby")).off('mouseleave.persistent');
                $(this).tooltip('hide');
            }
        }.bind(this), 500);
    });
     $('[data-toggle="tooltip"]').on('mouseenter.persistent', function ()
    {
        var that = this;
        $(this).data("hover", true);
        if(!$(this).attr("aria-describedby")) {
             $(this).tooltip('show');
            $("#"+this.getAttribute("aria-describedby")).on('mouseenter.persistent', function () { $(this).data("hover", true ); });
            $("#"+this.getAttribute("aria-describedby")).on('mouseleave.persistent', function () { $(this).data("hover", false); $(that).trigger("mouseleave.persistent"); });
        }
         tooltip = $('[data-toggle="tooltip"]').not(this);
        tooltip.tooltip('hide');
    });
 });
 </script> */}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWFzeWFkbWluLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05pQztBQUVqQ0EsTUFBTSxDQUFDQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsVUFBU0MsS0FBSyxFQUFFO0VBRTVDRixNQUFNLENBQUNHLFVBQVUsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDRixnQkFBZ0IsQ0FBQyxRQUFRLEVBQUU7SUFBQSxPQUFNRyxhQUFhLENBQUNDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFQyxPQUFPLEVBQUUsRUFBRSxFQUFFLEdBQUMsRUFBRSxHQUFDLElBQUksQ0FBQztFQUFBLEVBQUM7QUFDM0osQ0FBQyxDQUFDOztBQUVGO0FBQ0E7QUFDQU4sTUFBTSxDQUFDQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsVUFBU0MsS0FBSyxFQUFFOztFQUU1QztFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7QUFBQSxDQUNILENBQUM7QUFHRixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQTdCQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vYXNzZXRzL3N0eWxlcy9lYXN5YWRtaW4uc2Nzcz85OTAwIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vLi9hc3NldHMvZWFzeWFkbWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgJy4vc3R5bGVzL2Vhc3lhZG1pbi5zY3NzJztcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbihldmVudCkge1xuICAgIFxuICAgIHdpbmRvdy5tYXRjaE1lZGlhKCcocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspJykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4gQ29va2llQ29uc2VudC5zZXRDb29raWUoXCJ1c2VyXCIsIFwibmVjZXNzYXJ5XCIsIGdldFVzZXIoKSwgMzAqMjQqMzYwMCkpO1xufSk7XG5cbi8vXG4vLyBBcHBseSBib290c3RyYXAgZm9ybSB2YWxpZGF0aW9uXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAvL1xuICAgIC8vIERvY2tcbiAgICAvLyAkKCcjb25saW5lLXVzZXJzIGxpJykucmVzaXplT25BcHByb2FjaCh7XG4gICAgLy8gICAgIHk6IDAsXG4gICAgLy8gICAgIHNwbGl0OiAxLFxuICAgIC8vICAgICB6b29tOiAyLFxuICAgIC8vICAgICBqdW1wOiAsXG4gICAgLy8gICAgIHRyaWdnZXI6IDFcbiAgICAvLyAgIH0pO1xufSk7XG5cblxuey8qIDxzY3JpcHQ+XG4kKGZ1bmN0aW9uICgpIHtcbiAgICAkKCdbZGF0YS10b2dnbGU9XCJwb3BvdmVyXCJdJykucG9wb3Zlcih7aHRtbDp0cnVlfSlcbiAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCh7dHJpZ2dlcjpcIm1hbnVhbFwiLCBodG1sOnRydWV9KVxuXG4gICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLm9uKCdjbGljay5wZXJzaXN0ZW50JywgZnVuY3Rpb24gKCkgeyAkKHRoaXMpLnRvb2x0aXAoJ3RvZ2dsZScpOyB9KTtcbiAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykub24oJ21vdXNlbGVhdmUucGVyc2lzdGVudCcsIGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICAkKHRoaXMpLmRhdGEoXCJob3ZlclwiLCBmYWxzZSk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYoISQodGhpcykuZGF0YShcImhvdmVyXCIpICYmICEkKFwiI1wiK3RoaXMuZ2V0QXR0cmlidXRlKFwiYXJpYS1kZXNjcmliZWRieVwiKSkuZGF0YShcImhvdmVyXCIpKSAge1xuICAgICAgICAgICAgICAgICQoXCIjXCIrdGhpcy5nZXRBdHRyaWJ1dGUoXCJhcmlhLWRlc2NyaWJlZGJ5XCIpKS5vZmYoJ21vdXNlZW50ZXIucGVyc2lzdGVudCcpO1xuICAgICAgICAgICAgICAgICQoXCIjXCIrdGhpcy5nZXRBdHRyaWJ1dGUoXCJhcmlhLWRlc2NyaWJlZGJ5XCIpKS5vZmYoJ21vdXNlbGVhdmUucGVyc2lzdGVudCcpO1xuICAgICAgICAgICAgICAgICQodGhpcykudG9vbHRpcCgnaGlkZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcyksIDUwMCk7XG4gICAgfSk7XG5cbiAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykub24oJ21vdXNlZW50ZXIucGVyc2lzdGVudCcsIGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICQodGhpcykuZGF0YShcImhvdmVyXCIsIHRydWUpO1xuICAgICAgICBpZighJCh0aGlzKS5hdHRyKFwiYXJpYS1kZXNjcmliZWRieVwiKSkge1xuXG4gICAgICAgICAgICAkKHRoaXMpLnRvb2x0aXAoJ3Nob3cnKTtcbiAgICAgICAgICAgICQoXCIjXCIrdGhpcy5nZXRBdHRyaWJ1dGUoXCJhcmlhLWRlc2NyaWJlZGJ5XCIpKS5vbignbW91c2VlbnRlci5wZXJzaXN0ZW50JywgZnVuY3Rpb24gKCkgeyAkKHRoaXMpLmRhdGEoXCJob3ZlclwiLCB0cnVlICk7IH0pO1xuICAgICAgICAgICAgJChcIiNcIit0aGlzLmdldEF0dHJpYnV0ZShcImFyaWEtZGVzY3JpYmVkYnlcIikpLm9uKCdtb3VzZWxlYXZlLnBlcnNpc3RlbnQnLCBmdW5jdGlvbiAoKSB7ICQodGhpcykuZGF0YShcImhvdmVyXCIsIGZhbHNlKTsgJCh0aGF0KS50cmlnZ2VyKFwibW91c2VsZWF2ZS5wZXJzaXN0ZW50XCIpOyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvb2x0aXAgPSAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykubm90KHRoaXMpO1xuICAgICAgICB0b29sdGlwLnRvb2x0aXAoJ2hpZGUnKTtcbiAgICB9KTtcbn0pO1xuPC9zY3JpcHQ+ICovfSJdLCJuYW1lcyI6WyJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJtYXRjaE1lZGlhIiwiQ29va2llQ29uc2VudCIsInNldENvb2tpZSIsImdldFVzZXIiXSwic291cmNlUm9vdCI6IiJ9