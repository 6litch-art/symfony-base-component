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


// import Tooltip from 'bootstrap';
// $(window).on("load.tooltip", function() { $('[data-toggle="tooltip"]').tooltip({html:true}) });
// $(window).on("onbeforeunload.tooltip",function() { $("div[id^='tooltip']").hide().remove(); });
// import Popover from 'bootstrap';
// $(window).on("onbeforeunload.popover",function() { $("div[id^='popover']").hide().remove(); });
// $(window).on("load.popover", function() { $('[data-toggle="popover"]').popover({html:true}) });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWFzeWFkbWluLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05pQzs7QUFFakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBQSxNQUFNLENBQUNDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxVQUFTQyxLQUFLLEVBQUU7RUFFNUNGLE1BQU0sQ0FBQ0csVUFBVSxDQUFDLDhCQUE4QixDQUFDLENBQUNGLGdCQUFnQixDQUFDLFFBQVEsRUFBRTtJQUFBLE9BQU1HLGFBQWEsQ0FBQ0MsU0FBUyxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUVDLE9BQU8sRUFBRSxFQUFFLEVBQUUsR0FBQyxFQUFFLEdBQUMsSUFBSSxDQUFDO0VBQUEsRUFBQztBQUMzSixDQUFDLENBQUM7O0FBRUY7QUFDQTtBQUNBTixNQUFNLENBQUNDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxVQUFTQyxLQUFLLEVBQUU7O0VBRTVDO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtBQUFBLENBQ0gsQ0FBQztBQUdGLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBN0JDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvc3R5bGVzL2Vhc3lhZG1pbi5zY3NzPzk5MDAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy8uL2Fzc2V0cy9lYXN5YWRtaW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAnLi9zdHlsZXMvZWFzeWFkbWluLnNjc3MnO1xuXG4vLyBpbXBvcnQgVG9vbHRpcCBmcm9tICdib290c3RyYXAnO1xuLy8gJCh3aW5kb3cpLm9uKFwibG9hZC50b29sdGlwXCIsIGZ1bmN0aW9uKCkgeyAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCh7aHRtbDp0cnVlfSkgfSk7XG4vLyAkKHdpbmRvdykub24oXCJvbmJlZm9yZXVubG9hZC50b29sdGlwXCIsZnVuY3Rpb24oKSB7ICQoXCJkaXZbaWRePSd0b29sdGlwJ11cIikuaGlkZSgpLnJlbW92ZSgpOyB9KTtcbi8vIGltcG9ydCBQb3BvdmVyIGZyb20gJ2Jvb3RzdHJhcCc7XG4vLyAkKHdpbmRvdykub24oXCJvbmJlZm9yZXVubG9hZC5wb3BvdmVyXCIsZnVuY3Rpb24oKSB7ICQoXCJkaXZbaWRePSdwb3BvdmVyJ11cIikuaGlkZSgpLnJlbW92ZSgpOyB9KTtcbi8vICQod2luZG93KS5vbihcImxvYWQucG9wb3ZlclwiLCBmdW5jdGlvbigpIHsgJCgnW2RhdGEtdG9nZ2xlPVwicG9wb3ZlclwiXScpLnBvcG92ZXIoe2h0bWw6dHJ1ZX0pIH0pO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgXG4gICAgd2luZG93Lm1hdGNoTWVkaWEoJyhwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyayknKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiBDb29raWVDb25zZW50LnNldENvb2tpZShcInVzZXJcIiwgXCJuZWNlc3NhcnlcIiwgZ2V0VXNlcigpLCAzMCoyNCozNjAwKSk7XG59KTtcblxuLy9cbi8vIEFwcGx5IGJvb3RzdHJhcCBmb3JtIHZhbGlkYXRpb25cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgIC8vXG4gICAgLy8gRG9ja1xuICAgIC8vICQoJyNvbmxpbmUtdXNlcnMgbGknKS5yZXNpemVPbkFwcHJvYWNoKHtcbiAgICAvLyAgICAgeTogMCxcbiAgICAvLyAgICAgc3BsaXQ6IDEsXG4gICAgLy8gICAgIHpvb206IDIsXG4gICAgLy8gICAgIGp1bXA6ICxcbiAgICAvLyAgICAgdHJpZ2dlcjogMVxuICAgIC8vICAgfSk7XG59KTtcblxuXG57LyogPHNjcmlwdD5cbiQoZnVuY3Rpb24gKCkge1xuICAgICQoJ1tkYXRhLXRvZ2dsZT1cInBvcG92ZXJcIl0nKS5wb3BvdmVyKHtodG1sOnRydWV9KVxuICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKHt0cmlnZ2VyOlwibWFudWFsXCIsIGh0bWw6dHJ1ZX0pXG5cbiAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykub24oJ2NsaWNrLnBlcnNpc3RlbnQnLCBmdW5jdGlvbiAoKSB7ICQodGhpcykudG9vbHRpcCgndG9nZ2xlJyk7IH0pO1xuICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5vbignbW91c2VsZWF2ZS5wZXJzaXN0ZW50JywgZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICAgICQodGhpcykuZGF0YShcImhvdmVyXCIsIGZhbHNlKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZighJCh0aGlzKS5kYXRhKFwiaG92ZXJcIikgJiYgISQoXCIjXCIrdGhpcy5nZXRBdHRyaWJ1dGUoXCJhcmlhLWRlc2NyaWJlZGJ5XCIpKS5kYXRhKFwiaG92ZXJcIikpICB7XG4gICAgICAgICAgICAgICAgJChcIiNcIit0aGlzLmdldEF0dHJpYnV0ZShcImFyaWEtZGVzY3JpYmVkYnlcIikpLm9mZignbW91c2VlbnRlci5wZXJzaXN0ZW50Jyk7XG4gICAgICAgICAgICAgICAgJChcIiNcIit0aGlzLmdldEF0dHJpYnV0ZShcImFyaWEtZGVzY3JpYmVkYnlcIikpLm9mZignbW91c2VsZWF2ZS5wZXJzaXN0ZW50Jyk7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS50b29sdGlwKCdoaWRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKSwgNTAwKTtcbiAgICB9KTtcblxuICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5vbignbW91c2VlbnRlci5wZXJzaXN0ZW50JywgZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgJCh0aGlzKS5kYXRhKFwiaG92ZXJcIiwgdHJ1ZSk7XG4gICAgICAgIGlmKCEkKHRoaXMpLmF0dHIoXCJhcmlhLWRlc2NyaWJlZGJ5XCIpKSB7XG5cbiAgICAgICAgICAgICQodGhpcykudG9vbHRpcCgnc2hvdycpO1xuICAgICAgICAgICAgJChcIiNcIit0aGlzLmdldEF0dHJpYnV0ZShcImFyaWEtZGVzY3JpYmVkYnlcIikpLm9uKCdtb3VzZWVudGVyLnBlcnNpc3RlbnQnLCBmdW5jdGlvbiAoKSB7ICQodGhpcykuZGF0YShcImhvdmVyXCIsIHRydWUgKTsgfSk7XG4gICAgICAgICAgICAkKFwiI1wiK3RoaXMuZ2V0QXR0cmlidXRlKFwiYXJpYS1kZXNjcmliZWRieVwiKSkub24oJ21vdXNlbGVhdmUucGVyc2lzdGVudCcsIGZ1bmN0aW9uICgpIHsgJCh0aGlzKS5kYXRhKFwiaG92ZXJcIiwgZmFsc2UpOyAkKHRoYXQpLnRyaWdnZXIoXCJtb3VzZWxlYXZlLnBlcnNpc3RlbnRcIik7IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9vbHRpcCA9ICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5ub3QodGhpcyk7XG4gICAgICAgIHRvb2x0aXAudG9vbHRpcCgnaGlkZScpO1xuICAgIH0pO1xufSk7XG48L3NjcmlwdD4gKi99Il0sIm5hbWVzIjpbIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsIm1hdGNoTWVkaWEiLCJDb29raWVDb25zZW50Iiwic2V0Q29va2llIiwiZ2V0VXNlciJdLCJzb3VyY2VSb290IjoiIn0=