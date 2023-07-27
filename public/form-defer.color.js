/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@eastdesire/jscolor/jscolor.js":
/*!*****************************************************!*\
  !*** ./node_modules/@eastdesire/jscolor/jscolor.js ***!
  \*****************************************************/
/***/ (function(module) {

/**
 * jscolor - JavaScript Color Picker
 *
 * @link    http://jscolor.com
 * @license For open source use: GPLv3
 *          For commercial use: JSColor Commercial License
 * @author  Jan Odvarko - East Desire
 *
 * See usage examples at http://jscolor.com/examples/
 */


(function (global, factory) {

	'use strict';

	if ( true && typeof module.exports === 'object') {
		// Export jscolor as a module
		module.exports = global.document ?
			factory (global) :
			function (win) {
				if (!win.document) {
					throw new Error('jscolor needs a window with document');
				}
				return factory(win);
			}
		return;
	}

	// Default use (no module export)
	factory(global);

})(typeof window !== 'undefined' ? window : this, function (window) { // BEGIN factory

// BEGIN jscolor code


'use strict';


var jscolor = (function () { // BEGIN jscolor

var jsc = {


	initialized : false,

	instances : [], // created instances of jscolor

	readyQueue : [], // functions waiting to be called after init


	register : function () {
		if (typeof window !== 'undefined' && window.document) {
			window.document.addEventListener('DOMContentLoaded', jsc.pub.init, false);
		}
	},


	installBySelector : function (selector, rootNode) {
		rootNode = rootNode ? jsc.node(rootNode) : window.document;
		if (!rootNode) {
			throw new Error('Missing root node');
		}

		var elms = rootNode.querySelectorAll(selector);

		// for backward compatibility with DEPRECATED installation/configuration using className
		var matchClass = new RegExp('(^|\\s)(' + jsc.pub.lookupClass + ')(\\s*(\\{[^}]*\\})|\\s|$)', 'i');

		for (var i = 0; i < elms.length; i += 1) {

			if (elms[i].jscolor && elms[i].jscolor instanceof jsc.pub) {
				continue; // jscolor already installed on this element
			}

			if (elms[i].type !== undefined && elms[i].type.toLowerCase() == 'color' && jsc.isColorAttrSupported) {
				continue; // skips inputs of type 'color' if supported by the browser
			}

			var dataOpts, m;

			if (
				(dataOpts = jsc.getDataAttr(elms[i], 'jscolor')) !== null ||
				(elms[i].className && (m = elms[i].className.match(matchClass))) // installation using className (DEPRECATED)
			) {
				var targetElm = elms[i];

				var optsStr = '';
				if (dataOpts !== null) {
					optsStr = dataOpts;

				} else if (m) { // installation using className (DEPRECATED)
					console.warn('Installation using class name is DEPRECATED. Use data-jscolor="" attribute instead.' + jsc.docsRef);
					if (m[4]) {
						optsStr = m[4];
					}
				}

				var opts = null;
				if (optsStr.trim()) {
					try {
						opts = jsc.parseOptionsStr(optsStr);
					} catch (e) {
						console.warn(e + '\n' + optsStr);
					}
				}

				try {
					new jsc.pub(targetElm, opts);
				} catch (e) {
					console.warn(e);
				}
			}
		}
	},


	parseOptionsStr : function (str) {
		var opts = null;

		try {
			opts = JSON.parse(str);

		} catch (eParse) {
			if (!jsc.pub.looseJSON) {
				throw new Error('Could not parse jscolor options as JSON: ' + eParse);
			} else {
				// loose JSON syntax is enabled -> try to evaluate the options string as JavaScript object
				try {
					opts = (new Function ('var opts = (' + str + '); return typeof opts === "object" ? opts : {};'))();
				} catch (eEval) {
					throw new Error('Could not evaluate jscolor options: ' + eEval);
				}
			}
		}
		return opts;
	},


	getInstances : function () {
		var inst = [];
		for (var i = 0; i < jsc.instances.length; i += 1) {
			// if the targetElement still exists, the instance is considered "alive"
			if (jsc.instances[i] && jsc.instances[i].targetElement) {
				inst.push(jsc.instances[i]);
			}
		}
		return inst;
	},


	createEl : function (tagName) {
		var el = window.document.createElement(tagName);
		jsc.setData(el, 'gui', true);
		return el;
	},


	node : function (nodeOrSelector) {
		if (!nodeOrSelector) {
			return null;
		}

		if (typeof nodeOrSelector === 'string') {
			// query selector
			var sel = nodeOrSelector;
			var el = null;
			try {
				el = window.document.querySelector(sel);
			} catch (e) {
				console.warn(e);
				return null;
			}
			if (!el) {
				console.warn('No element matches the selector: %s', sel);
			}
			return el;
		}

		if (jsc.isNode(nodeOrSelector)) {
			// DOM node
			return nodeOrSelector;
		}

		console.warn('Invalid node of type %s: %s', typeof nodeOrSelector, nodeOrSelector);
		return null;
	},


	// See https://stackoverflow.com/questions/384286/
	isNode : function (val) {
		if (typeof Node === 'object') {
			return val instanceof Node;
		}
		return val && typeof val === 'object' && typeof val.nodeType === 'number' && typeof val.nodeName === 'string';
	},


	nodeName : function (node) {
		if (node && node.nodeName) {
			return node.nodeName.toLowerCase();
		}
		return false;
	},


	removeChildren : function (node) {
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
	},


	isTextInput : function (el) {
		return el && jsc.nodeName(el) === 'input' && el.type.toLowerCase() === 'text';
	},


	isButton : function (el) {
		if (!el) {
			return false;
		}
		var n = jsc.nodeName(el);
		return (
			(n === 'button') ||
			(n === 'input' && ['button', 'submit', 'reset'].indexOf(el.type.toLowerCase()) > -1)
		);
	},


	isButtonEmpty : function (el) {
		switch (jsc.nodeName(el)) {
			case 'input': return (!el.value || el.value.trim() === '');
			case 'button': return (el.textContent.trim() === '');
		}
		return null; // could not determine element's text
	},


	// See https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
	isPassiveEventSupported : (function () {
		var supported = false;

		try {
			var opts = Object.defineProperty({}, 'passive', {
				get: function () { supported = true; }
			});
			window.addEventListener('testPassive', null, opts);
			window.removeEventListener('testPassive', null, opts);
		} catch (e) {}

		return supported;
	})(),


	isColorAttrSupported : (function () {
		var elm = window.document.createElement('input');
		if (elm.setAttribute) {
			elm.setAttribute('type', 'color');
			if (elm.type.toLowerCase() == 'color') {
				return true;
			}
		}
		return false;
	})(),


	dataProp : '_data_jscolor',


	// usage:
	//   setData(obj, prop, value)
	//   setData(obj, {prop:value, ...})
	//
	setData : function () {
		var obj = arguments[0];

		if (arguments.length === 3) {
			// setting a single property
			var data = obj.hasOwnProperty(jsc.dataProp) ? obj[jsc.dataProp] : (obj[jsc.dataProp] = {});
			var prop = arguments[1];
			var value = arguments[2];

			data[prop] = value;
			return true;

		} else if (arguments.length === 2 && typeof arguments[1] === 'object') {
			// setting multiple properties
			var data = obj.hasOwnProperty(jsc.dataProp) ? obj[jsc.dataProp] : (obj[jsc.dataProp] = {});
			var map = arguments[1];

			for (var prop in map) {
				if (map.hasOwnProperty(prop)) {
					data[prop] = map[prop];
				}
			}
			return true;
		}

		throw new Error('Invalid arguments');
	},


	// usage:
	//   removeData(obj, prop, [prop...])
	//
	removeData : function () {
		var obj = arguments[0];
		if (!obj.hasOwnProperty(jsc.dataProp)) {
			return true; // data object does not exist
		}
		for (var i = 1; i < arguments.length; i += 1) {
			var prop = arguments[i];
			delete obj[jsc.dataProp][prop];
		}
		return true;
	},


	getData : function (obj, prop, setDefault) {
		if (!obj.hasOwnProperty(jsc.dataProp)) {
			// data object does not exist
			if (setDefault !== undefined) {
				obj[jsc.dataProp] = {}; // create data object
			} else {
				return undefined; // no value to return
			}
		}
		var data = obj[jsc.dataProp];

		if (!data.hasOwnProperty(prop) && setDefault !== undefined) {
			data[prop] = setDefault;
		}
		return data[prop];
	},


	getDataAttr : function (el, name) {
		var attrName = 'data-' + name;
		var attrValue = el.getAttribute(attrName);
		return attrValue;
	},


	setDataAttr : function (el, name, value) {
		var attrName = 'data-' + name;
		el.setAttribute(attrName, value);
	},


	_attachedGroupEvents : {},


	attachGroupEvent : function (groupName, el, evnt, func) {
		if (!jsc._attachedGroupEvents.hasOwnProperty(groupName)) {
			jsc._attachedGroupEvents[groupName] = [];
		}
		jsc._attachedGroupEvents[groupName].push([el, evnt, func]);
		el.addEventListener(evnt, func, false);
	},


	detachGroupEvents : function (groupName) {
		if (jsc._attachedGroupEvents.hasOwnProperty(groupName)) {
			for (var i = 0; i < jsc._attachedGroupEvents[groupName].length; i += 1) {
				var evt = jsc._attachedGroupEvents[groupName][i];
				evt[0].removeEventListener(evt[1], evt[2], false);
			}
			delete jsc._attachedGroupEvents[groupName];
		}
	},


	preventDefault : function (e) {
		if (e.preventDefault) { e.preventDefault(); }
		e.returnValue = false;
	},


	triggerEvent : function (el, eventName, bubbles, cancelable) {
		if (!el) {
			return;
		}

		var ev = null;

		if (typeof Event === 'function') {
			ev = new Event(eventName, {
				bubbles: bubbles,
				cancelable: cancelable
			});
		} else {
			// IE
			ev = window.document.createEvent('Event');
			ev.initEvent(eventName, bubbles, cancelable);
		}

		if (!ev) {
			return false;
		}

		// so that we know that the event was triggered internally
		jsc.setData(ev, 'internal', true);

		el.dispatchEvent(ev);
		return true;
	},


	triggerInputEvent : function (el, eventName, bubbles, cancelable) {
		if (!el) {
			return;
		}
		if (jsc.isTextInput(el)) {
			jsc.triggerEvent(el, eventName, bubbles, cancelable);
		}
	},


	eventKey : function (ev) {
		var keys = {
			9: 'Tab',
			13: 'Enter',
			27: 'Escape',
		};
		if (typeof ev.code === 'string') {
			return ev.code;
		} else if (ev.keyCode !== undefined && keys.hasOwnProperty(ev.keyCode)) {
			return keys[ev.keyCode];
		}
		return null;
	},


	strList : function (str) {
		if (!str) {
			return [];
		}
		return str.replace(/^\s+|\s+$/g, '').split(/\s+/);
	},


	// The className parameter (str) can only contain a single class name
	hasClass : function (elm, className) {
		if (!className) {
			return false;
		}
		if (elm.classList !== undefined) {
			return elm.classList.contains(className);
		}
		// polyfill
		return -1 != (' ' + elm.className.replace(/\s+/g, ' ') + ' ').indexOf(' ' + className + ' ');
	},


	// The className parameter (str) can contain multiple class names separated by whitespace
	addClass : function (elm, className) {
		var classNames = jsc.strList(className);

		if (elm.classList !== undefined) {
			for (var i = 0; i < classNames.length; i += 1) {
				elm.classList.add(classNames[i]);
			}
			return;
		}
		// polyfill
		for (var i = 0; i < classNames.length; i += 1) {
			if (!jsc.hasClass(elm, classNames[i])) {
				elm.className += (elm.className ? ' ' : '') + classNames[i];
			}
		}
	},


	// The className parameter (str) can contain multiple class names separated by whitespace
	removeClass : function (elm, className) {
		var classNames = jsc.strList(className);

		if (elm.classList !== undefined) {
			for (var i = 0; i < classNames.length; i += 1) {
				elm.classList.remove(classNames[i]);
			}
			return;
		}
		// polyfill
		for (var i = 0; i < classNames.length; i += 1) {
			var repl = new RegExp(
				'^\\s*' + classNames[i] + '\\s*|' +
				'\\s*' + classNames[i] + '\\s*$|' +
				'\\s+' + classNames[i] + '(\\s+)',
				'g'
			);
			elm.className = elm.className.replace(repl, '$1');
		}
	},


	getCompStyle : function (elm) {
		var compStyle = window.getComputedStyle ? window.getComputedStyle(elm) : elm.currentStyle;

		// Note: In Firefox, getComputedStyle returns null in a hidden iframe,
		// that's why we need to check if the returned value is non-empty
		if (!compStyle) {
			return {};
		}
		return compStyle;
	},


	// Note:
	//   Setting a property to NULL reverts it to the state before it was first set
	//   with the 'reversible' flag enabled
	//
	setStyle : function (elm, styles, important, reversible) {
		// using '' for standard priority (IE10 apparently doesn't like value undefined)
		var priority = important ? 'important' : '';
		var origStyle = null;

		for (var prop in styles) {
			if (styles.hasOwnProperty(prop)) {
				var setVal = null;

				if (styles[prop] === null) {
					// reverting a property value

					if (!origStyle) {
						// get the original style object, but dont't try to create it if it doesn't exist
						origStyle = jsc.getData(elm, 'origStyle');
					}
					if (origStyle && origStyle.hasOwnProperty(prop)) {
						// we have property's original value -> use it
						setVal = origStyle[prop];
					}

				} else {
					// setting a property value

					if (reversible) {
						if (!origStyle) {
							// get the original style object and if it doesn't exist, create it
							origStyle = jsc.getData(elm, 'origStyle', {});
						}
						if (!origStyle.hasOwnProperty(prop)) {
							// original property value not yet stored -> store it
							origStyle[prop] = elm.style[prop];
						}
					}
					setVal = styles[prop];
				}

				if (setVal !== null) {
					elm.style.setProperty(prop, setVal, priority);
				}
			}
		}
	},


	appendCss : function (css) {
		var head = document.querySelector('head');
		var style = document.createElement('style');
		style.innerText = css;
		head.appendChild(style);
	},


	appendDefaultCss : function (css) {
		jsc.appendCss(
			[
				'.jscolor-wrap, .jscolor-wrap div, .jscolor-wrap canvas { ' +
				'position:static; display:block; visibility:visible; overflow:visible; margin:0; padding:0; ' +
				'border:none; border-radius:0; outline:none; z-index:auto; float:none; ' +
				'width:auto; height:auto; left:auto; right:auto; top:auto; bottom:auto; min-width:0; min-height:0; max-width:none; max-height:none; ' +
				'background:none; clip:auto; opacity:1; transform:none; box-shadow:none; box-sizing:content-box; ' +
				'}',
				'.jscolor-wrap { clear:both; }',
				'.jscolor-wrap .jscolor-picker { position:relative; }',
				'.jscolor-wrap .jscolor-shadow { position:absolute; left:0; top:0; width:100%; height:100%; }',
				'.jscolor-wrap .jscolor-border { position:relative; }',
				'.jscolor-wrap .jscolor-palette { position:absolute; }',
				'.jscolor-wrap .jscolor-palette-sw { position:absolute; display:block; cursor:pointer; }',
				'.jscolor-wrap .jscolor-btn { position:absolute; overflow:hidden; white-space:nowrap; font:13px sans-serif; text-align:center; cursor:pointer; }',
			].join('\n')
		);
	},


	hexColor : function (r, g, b) {
		return '#' + (
			('0' + Math.round(r).toString(16)).slice(-2) +
			('0' + Math.round(g).toString(16)).slice(-2) +
			('0' + Math.round(b).toString(16)).slice(-2)
		).toUpperCase();
	},


	hexaColor : function (r, g, b, a) {
		return '#' + (
			('0' + Math.round(r).toString(16)).slice(-2) +
			('0' + Math.round(g).toString(16)).slice(-2) +
			('0' + Math.round(b).toString(16)).slice(-2) +
			('0' + Math.round(a * 255).toString(16)).slice(-2)
		).toUpperCase();
	},


	rgbColor : function (r, g, b) {
		return 'rgb(' +
			Math.round(r) + ',' +
			Math.round(g) + ',' +
			Math.round(b) +
		')';
	},


	rgbaColor : function (r, g, b, a) {
		return 'rgba(' +
			Math.round(r) + ',' +
			Math.round(g) + ',' +
			Math.round(b) + ',' +
			(Math.round((a===undefined || a===null ? 1 : a) * 100) / 100) +
		')';
	},


	linearGradient : (function () {

		function getFuncName () {
			var stdName = 'linear-gradient';
			var prefixes = ['', '-webkit-', '-moz-', '-o-', '-ms-'];
			var helper = window.document.createElement('div');

			for (var i = 0; i < prefixes.length; i += 1) {
				var tryFunc = prefixes[i] + stdName;
				var tryVal = tryFunc + '(to right, rgba(0,0,0,0), rgba(0,0,0,0))';

				helper.style.background = tryVal;
				if (helper.style.background) { // CSS background successfully set -> function name is supported
					return tryFunc;
				}
			}
			return stdName; // fallback to standard 'linear-gradient' without vendor prefix
		}

		var funcName = getFuncName();

		return function () {
			return funcName + '(' + Array.prototype.join.call(arguments, ', ') + ')';
		};

	})(),


	setBorderRadius : function (elm, value) {
		jsc.setStyle(elm, {'border-radius' : value || '0'});
	},


	setBoxShadow : function (elm, value) {
		jsc.setStyle(elm, {'box-shadow': value || 'none'});
	},


	getElementPos : function (e, relativeToViewport) {
		var x=0, y=0;
		var rect = e.getBoundingClientRect();
		x = rect.left;
		y = rect.top;
		if (!relativeToViewport) {
			var viewPos = jsc.getViewPos();
			x += viewPos[0];
			y += viewPos[1];
		}
		return [x, y];
	},


	getElementSize : function (e) {
		return [e.offsetWidth, e.offsetHeight];
	},


	// get pointer's X/Y coordinates relative to viewport
	getAbsPointerPos : function (e) {
		var x = 0, y = 0;
		if (typeof e.changedTouches !== 'undefined' && e.changedTouches.length) {
			// touch devices
			x = e.changedTouches[0].clientX;
			y = e.changedTouches[0].clientY;
		} else if (typeof e.clientX === 'number') {
			x = e.clientX;
			y = e.clientY;
		}
		return { x: x, y: y };
	},


	// get pointer's X/Y coordinates relative to target element
	getRelPointerPos : function (e) {
		var target = e.target || e.srcElement;
		var targetRect = target.getBoundingClientRect();

		var x = 0, y = 0;

		var clientX = 0, clientY = 0;
		if (typeof e.changedTouches !== 'undefined' && e.changedTouches.length) {
			// touch devices
			clientX = e.changedTouches[0].clientX;
			clientY = e.changedTouches[0].clientY;
		} else if (typeof e.clientX === 'number') {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		x = clientX - targetRect.left;
		y = clientY - targetRect.top;
		return { x: x, y: y };
	},


	getViewPos : function () {
		var doc = window.document.documentElement;
		return [
			(window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
			(window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
		];
	},


	getViewSize : function () {
		var doc = window.document.documentElement;
		return [
			(window.innerWidth || doc.clientWidth),
			(window.innerHeight || doc.clientHeight),
		];
	},


	// r: 0-255
	// g: 0-255
	// b: 0-255
	//
	// returns: [ 0-360, 0-100, 0-100 ]
	//
	RGB_HSV : function (r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;
		var n = Math.min(Math.min(r,g),b);
		var v = Math.max(Math.max(r,g),b);
		var m = v - n;
		if (m === 0) { return [ null, 0, 100 * v ]; }
		var h = r===n ? 3+(b-g)/m : (g===n ? 5+(r-b)/m : 1+(g-r)/m);
		return [
			60 * (h===6?0:h),
			100 * (m/v),
			100 * v
		];
	},


	// h: 0-360
	// s: 0-100
	// v: 0-100
	//
	// returns: [ 0-255, 0-255, 0-255 ]
	//
	HSV_RGB : function (h, s, v) {
		var u = 255 * (v / 100);

		if (h === null) {
			return [ u, u, u ];
		}

		h /= 60;
		s /= 100;

		var i = Math.floor(h);
		var f = i%2 ? h-i : 1-(h-i);
		var m = u * (1 - s);
		var n = u * (1 - s * f);
		switch (i) {
			case 6:
			case 0: return [u,n,m];
			case 1: return [n,u,m];
			case 2: return [m,u,n];
			case 3: return [m,n,u];
			case 4: return [n,m,u];
			case 5: return [u,m,n];
		}
	},


	parseColorString : function (str) {
		var ret = {
			rgba: null,
			format: null // 'hex' | 'hexa' | 'rgb' | 'rgba'
		};

		var m;

		if (m = str.match(/^\W*([0-9A-F]{3,8})\W*$/i)) {
			// HEX notation

			if (m[1].length === 8) {
				// 8-char notation (= with alpha)
				ret.format = 'hexa';
				ret.rgba = [
					parseInt(m[1].slice(0,2),16),
					parseInt(m[1].slice(2,4),16),
					parseInt(m[1].slice(4,6),16),
					parseInt(m[1].slice(6,8),16) / 255
				];

			} else if (m[1].length === 6) {
				// 6-char notation
				ret.format = 'hex';
				ret.rgba = [
					parseInt(m[1].slice(0,2),16),
					parseInt(m[1].slice(2,4),16),
					parseInt(m[1].slice(4,6),16),
					null
				];

			} else if (m[1].length === 3) {
				// 3-char notation
				ret.format = 'hex';
				ret.rgba = [
					parseInt(m[1].charAt(0) + m[1].charAt(0),16),
					parseInt(m[1].charAt(1) + m[1].charAt(1),16),
					parseInt(m[1].charAt(2) + m[1].charAt(2),16),
					null
				];

			} else {
				return false;
			}

			return ret;
		}

		if (m = str.match(/^\W*rgba?\(([^)]*)\)\W*$/i)) {
			// rgb(...) or rgba(...) notation

			var par = m[1].split(',');
			var re = /^\s*(\d+|\d*\.\d+|\d+\.\d*)\s*$/;
			var mR, mG, mB, mA;
			if (
				par.length >= 3 &&
				(mR = par[0].match(re)) &&
				(mG = par[1].match(re)) &&
				(mB = par[2].match(re))
			) {
				ret.format = 'rgb';
				ret.rgba = [
					parseFloat(mR[1]) || 0,
					parseFloat(mG[1]) || 0,
					parseFloat(mB[1]) || 0,
					null
				];

				if (
					par.length >= 4 &&
					(mA = par[3].match(re))
				) {
					ret.format = 'rgba';
					ret.rgba[3] = parseFloat(mA[1]) || 0;
				}
				return ret;
			}
		}

		return false;
	},


	parsePaletteValue : function (mixed) {
		var vals = [];

		if (typeof mixed === 'string') { // input is a string of space separated color values
			// rgb() and rgba() may contain spaces too, so let's find all color values by regex
			mixed.replace(/#[0-9A-F]{3}\b|#[0-9A-F]{6}([0-9A-F]{2})?\b|rgba?\(([^)]*)\)/ig, function (val) {
				vals.push(val);
			});
		} else if (Array.isArray(mixed)) { // input is an array of color values
			vals = mixed;
		}

		// convert all values into uniform color format

		var colors = [];

		for (var i = 0; i < vals.length; i++) {
			var color = jsc.parseColorString(vals[i]);
			if (color) {
				colors.push(color);
			}
		}

		return colors;
	},


	containsTranparentColor : function (colors) {
		for (var i = 0; i < colors.length; i++) {
			var a = colors[i].rgba[3];
			if (a !== null && a < 1.0) {
				return true;
			}
		}
		return false;
	},


	isAlphaFormat : function (format) {
		switch (format.toLowerCase()) {
		case 'hexa':
		case 'rgba':
			return true;
		}
		return false;
	},


	// Canvas scaling for retina displays
	//
	// adapted from https://www.html5rocks.com/en/tutorials/canvas/hidpi/
	//
	scaleCanvasForHighDPR : function (canvas) {
		var dpr = window.devicePixelRatio || 1;
		canvas.width *= dpr;
		canvas.height *= dpr;
		var ctx = canvas.getContext('2d');
		ctx.scale(dpr, dpr);
	},


	genColorPreviewCanvas : function (color, separatorPos, specWidth, scaleForHighDPR) {

		var sepW = Math.round(jsc.pub.previewSeparator.length);
		var sqSize = jsc.pub.chessboardSize;
		var sqColor1 = jsc.pub.chessboardColor1;
		var sqColor2 = jsc.pub.chessboardColor2;

		var cWidth = specWidth ? specWidth : sqSize * 2;
		var cHeight = sqSize * 2;

		var canvas = jsc.createEl('canvas');
		var ctx = canvas.getContext('2d');

		canvas.width = cWidth;
		canvas.height = cHeight;
		if (scaleForHighDPR) {
			jsc.scaleCanvasForHighDPR(canvas);
		}

		// transparency chessboard - background
		ctx.fillStyle = sqColor1;
		ctx.fillRect(0, 0, cWidth, cHeight);

		// transparency chessboard - squares
		ctx.fillStyle = sqColor2;
		for (var x = 0; x < cWidth; x += sqSize * 2) {
			ctx.fillRect(x, 0, sqSize, sqSize);
			ctx.fillRect(x + sqSize, sqSize, sqSize, sqSize);
		}

		if (color) {
			// actual color in foreground
			ctx.fillStyle = color;
			ctx.fillRect(0, 0, cWidth, cHeight);
		}

		var start = null;
		switch (separatorPos) {
			case 'left':
				start = 0;
				ctx.clearRect(0, 0, sepW/2, cHeight);
				break;
			case 'right':
				start = cWidth - sepW;
				ctx.clearRect(cWidth - (sepW/2), 0, sepW/2, cHeight);
				break;
		}
		if (start !== null) {
			ctx.lineWidth = 1;
			for (var i = 0; i < jsc.pub.previewSeparator.length; i += 1) {
				ctx.beginPath();
				ctx.strokeStyle = jsc.pub.previewSeparator[i];
				ctx.moveTo(0.5 + start + i, 0);
				ctx.lineTo(0.5 + start + i, cHeight);
				ctx.stroke();
			}
		}

		return {
			canvas: canvas,
			width: cWidth,
			height: cHeight,
		};
	},


	// if position or width is not set => fill the entire element (0%-100%)
	genColorPreviewGradient : function (color, position, width) {
		var params = [];

		if (position && width) {
			params = [
				'to ' + {'left':'right', 'right':'left'}[position],
				color + ' 0%',
				color + ' ' + width + 'px',
				'rgba(0,0,0,0) ' + (width + 1) + 'px',
				'rgba(0,0,0,0) 100%',
			];
		} else {
			params = [
				'to right',
				color + ' 0%',
				color + ' 100%',
			];
		}

		return jsc.linearGradient.apply(this, params);
	},


	redrawPosition : function () {

		if (!jsc.picker || !jsc.picker.owner) {
			return; // picker is not shown
		}

		var thisObj = jsc.picker.owner;

		if (thisObj.container !== window.document.body) {

			jsc._drawPosition(thisObj, 0, 0, 'relative', false);

		} else {

			var tp, vp;

			if (thisObj.fixed) {
				// Fixed elements are positioned relative to viewport,
				// therefore we can ignore the scroll offset
				tp = jsc.getElementPos(thisObj.targetElement, true); // target pos
				vp = [0, 0]; // view pos
			} else {
				tp = jsc.getElementPos(thisObj.targetElement); // target pos
				vp = jsc.getViewPos(); // view pos
			}

			var ts = jsc.getElementSize(thisObj.targetElement); // target size
			var vs = jsc.getViewSize(); // view size
			var pd = jsc.getPickerDims(thisObj);
			var ps = [pd.borderW, pd.borderH]; // picker outer size
			var a, b, c;
			switch (thisObj.position.toLowerCase()) {
				case 'left': a=1; b=0; c=-1; break;
				case 'right':a=1; b=0; c=1; break;
				case 'top':  a=0; b=1; c=-1; break;
				default:     a=0; b=1; c=1; break;
			}
			var l = (ts[b]+ps[b])/2;

			// compute picker position
			if (!thisObj.smartPosition) {
				var pp = [
					tp[a],
					tp[b]+ts[b]-l+l*c
				];
			} else {
				var pp = [
					-vp[a]+tp[a]+ps[a] > vs[a] ?
						(-vp[a]+tp[a]+ts[a]/2 > vs[a]/2 && tp[a]+ts[a]-ps[a] >= 0 ? tp[a]+ts[a]-ps[a] : tp[a]) :
						tp[a],
					-vp[b]+tp[b]+ts[b]+ps[b]-l+l*c > vs[b] ?
						(-vp[b]+tp[b]+ts[b]/2 > vs[b]/2 && tp[b]+ts[b]-l-l*c >= 0 ? tp[b]+ts[b]-l-l*c : tp[b]+ts[b]-l+l*c) :
						(tp[b]+ts[b]-l+l*c >= 0 ? tp[b]+ts[b]-l+l*c : tp[b]+ts[b]-l-l*c)
				];
			}

			var x = pp[a];
			var y = pp[b];
			var positionValue = thisObj.fixed ? 'fixed' : 'absolute';
			var contractShadow =
				(pp[0] + ps[0] > tp[0] || pp[0] < tp[0] + ts[0]) &&
				(pp[1] + ps[1] < tp[1] + ts[1]);

			jsc._drawPosition(thisObj, x, y, positionValue, contractShadow);

		}

	},


	_drawPosition : function (thisObj, x, y, positionValue, contractShadow) {
		var vShadow = contractShadow ? 0 : thisObj.shadowBlur; // px

		jsc.picker.wrap.style.position = positionValue;

		if ( // To avoid unnecessary repositioning during scroll
			Math.round(parseFloat(jsc.picker.wrap.style.left)) !== Math.round(x) ||
			Math.round(parseFloat(jsc.picker.wrap.style.top)) !== Math.round(y)
		) {
			jsc.picker.wrap.style.left = x + 'px';
			jsc.picker.wrap.style.top = y + 'px';
		}

		jsc.setBoxShadow(
			jsc.picker.boxS,
			thisObj.shadow ?
				new jsc.BoxShadow(0, vShadow, thisObj.shadowBlur, 0, thisObj.shadowColor) :
				null);
	},


	getPickerDims : function (thisObj) {
		var w = 2 * thisObj.controlBorderWidth + thisObj.width;
		var h = 2 * thisObj.controlBorderWidth + thisObj.height;

		var sliderSpace = 2 * thisObj.controlBorderWidth + 2 * jsc.getControlPadding(thisObj) + thisObj.sliderSize;

		if (jsc.getSliderChannel(thisObj)) {
			w += sliderSpace;
		}
		if (thisObj.hasAlphaChannel()) {
			w += sliderSpace;
		}

		var pal = jsc.getPaletteDims(thisObj, w);

		if (pal.height) {
			h += pal.height + thisObj.padding;
		}
		if (thisObj.closeButton) {
			h += 2 * thisObj.controlBorderWidth + thisObj.padding + thisObj.buttonHeight;
		}

		var pW = w + (2 * thisObj.padding);
		var pH = h + (2 * thisObj.padding);

		return {
			contentW: w,
			contentH: h,
			paddedW: pW,
			paddedH: pH,
			borderW: pW + (2 * thisObj.borderWidth),
			borderH: pH + (2 * thisObj.borderWidth),
			palette: pal,
		};
	},


	getPaletteDims : function (thisObj, width) {
		var cols = 0, rows = 0, cellW = 0, cellH = 0, height = 0;
		var sampleCount = thisObj._palette ? thisObj._palette.length : 0;

		if (sampleCount) {
			cols = thisObj.paletteCols;
			rows = cols > 0 ? Math.ceil(sampleCount / cols) : 0;

			// color sample's dimensions (includes border)
			cellW = Math.max(1, Math.floor((width - ((cols - 1) * thisObj.paletteSpacing)) / cols));
			cellH = thisObj.paletteHeight ? Math.min(thisObj.paletteHeight, cellW) : cellW;
		}

		if (rows) {
			height =
				rows * cellH +
				(rows - 1) * thisObj.paletteSpacing;
		}

		return {
			cols: cols,
			rows: rows,
			cellW: cellW,
			cellH: cellH,
			width: width,
			height: height,
		};
	},


	getControlPadding : function (thisObj) {
		return Math.max(
			thisObj.padding / 2,
			(2 * thisObj.pointerBorderWidth + thisObj.pointerThickness) - thisObj.controlBorderWidth
		);
	},


	getPadYChannel : function (thisObj) {
		switch (thisObj.mode.charAt(1).toLowerCase()) {
			case 'v': return 'v'; break;
		}
		return 's';
	},


	getSliderChannel : function (thisObj) {
		if (thisObj.mode.length > 2) {
			switch (thisObj.mode.charAt(2).toLowerCase()) {
				case 's': return 's'; break;
				case 'v': return 'v'; break;
			}
		}
		return null;
	},


	// calls function specified in picker's property
	triggerCallback : function (thisObj, prop) {
		if (!thisObj[prop]) {
			return; // callback func not specified
		}
		var callback = null;

		if (typeof thisObj[prop] === 'string') {
			// string with code
			try {
				callback = new Function (thisObj[prop]);
			} catch (e) {
				console.error(e);
			}
		} else {
			// function
			callback = thisObj[prop];
		}

		if (callback) {
			callback.call(thisObj);
		}
	},


	// Triggers a color change related event(s) on all picker instances.
	// It is possible to specify multiple events separated with a space.
	triggerGlobal : function (eventNames) {
		var inst = jsc.getInstances();
		for (var i = 0; i < inst.length; i += 1) {
			inst[i].trigger(eventNames);
		}
	},


	_pointerMoveEvent : {
		mouse: 'mousemove',
		touch: 'touchmove'
	},
	_pointerEndEvent : {
		mouse: 'mouseup',
		touch: 'touchend'
	},


	_pointerOrigin : null,


	onDocumentKeyUp : function (e) {
		if (['Tab', 'Escape'].indexOf(jsc.eventKey(e)) !== -1) {
			if (jsc.picker && jsc.picker.owner) {
				jsc.picker.owner.tryHide();
			}
		}
	},


	onWindowResize : function (e) {
		jsc.redrawPosition();
	},


	onWindowScroll : function (e) {
		jsc.redrawPosition();
	},


	onParentScroll : function (e) {
		// hide the picker when one of the parent elements is scrolled
		if (jsc.picker && jsc.picker.owner) {
			jsc.picker.owner.tryHide();
		}
	},


	onDocumentMouseDown : function (e) {
		var target = e.target || e.srcElement;

		if (target.jscolor && target.jscolor instanceof jsc.pub) { // clicked targetElement -> show picker
			if (target.jscolor.showOnClick && !target.disabled) {
				target.jscolor.show();
			}
		} else if (jsc.getData(target, 'gui')) { // clicked jscolor's GUI element
			var control = jsc.getData(target, 'control');
			if (control) {
				// jscolor's control
				jsc.onControlPointerStart(e, target, jsc.getData(target, 'control'), 'mouse');
			}
		} else {
			// mouse is outside the picker's controls -> hide the color picker!
			if (jsc.picker && jsc.picker.owner) {
				jsc.picker.owner.tryHide();
			}
		}
	},


	onPickerTouchStart : function (e) {
		var target = e.target || e.srcElement;

		if (jsc.getData(target, 'control')) {
			jsc.onControlPointerStart(e, target, jsc.getData(target, 'control'), 'touch');
		}
	},


	onControlPointerStart : function (e, target, controlName, pointerType) {
		var thisObj = jsc.getData(target, 'instance');

		jsc.preventDefault(e);

		var registerDragEvents = function (doc, offset) {
			jsc.attachGroupEvent('drag', doc, jsc._pointerMoveEvent[pointerType],
				jsc.onDocumentPointerMove(e, target, controlName, pointerType, offset));
			jsc.attachGroupEvent('drag', doc, jsc._pointerEndEvent[pointerType],
				jsc.onDocumentPointerEnd(e, target, controlName, pointerType));
		};

		registerDragEvents(window.document, [0, 0]);

		if (window.parent && window.frameElement) {
			var rect = window.frameElement.getBoundingClientRect();
			var ofs = [-rect.left, -rect.top];
			registerDragEvents(window.parent.window.document, ofs);
		}

		var abs = jsc.getAbsPointerPos(e);
		var rel = jsc.getRelPointerPos(e);
		jsc._pointerOrigin = {
			x: abs.x - rel.x,
			y: abs.y - rel.y
		};

		switch (controlName) {
		case 'pad':
			// if the value slider is at the bottom, move it up
			if (jsc.getSliderChannel(thisObj) === 'v' && thisObj.channels.v === 0) {
				thisObj.fromHSVA(null, null, 100, null);
			}
			jsc.setPad(thisObj, e, 0, 0);
			break;

		case 'sld':
			jsc.setSld(thisObj, e, 0);
			break;

		case 'asld':
			jsc.setASld(thisObj, e, 0);
			break;
		}
		thisObj.trigger('input');
	},


	onDocumentPointerMove : function (e, target, controlName, pointerType, offset) {
		return function (e) {
			var thisObj = jsc.getData(target, 'instance');
			switch (controlName) {
			case 'pad':
				jsc.setPad(thisObj, e, offset[0], offset[1]);
				break;

			case 'sld':
				jsc.setSld(thisObj, e, offset[1]);
				break;

			case 'asld':
				jsc.setASld(thisObj, e, offset[1]);
				break;
			}
			thisObj.trigger('input');
		}
	},


	onDocumentPointerEnd : function (e, target, controlName, pointerType) {
		return function (e) {
			var thisObj = jsc.getData(target, 'instance');
			jsc.detachGroupEvents('drag');

			// Always trigger changes AFTER detaching outstanding mouse handlers,
			// in case some color change that occured in user-defined onChange/onInput handler
			// intruded into current mouse events
			thisObj.trigger('input');
			thisObj.trigger('change');
		};
	},


	onPaletteSampleClick : function (e) {
		var target = e.currentTarget;
		var thisObj = jsc.getData(target, 'instance');
		var color = jsc.getData(target, 'color');

		// when format is flexible, use the original format of this color sample
		if (thisObj.format.toLowerCase() === 'any') {
			thisObj._setFormat(color.format); // adapt format
			if (!jsc.isAlphaFormat(thisObj.getFormat())) {
				color.rgba[3] = 1.0; // when switching to a format that doesn't support alpha, set full opacity
			}
		}

		// if this color doesn't specify alpha, use alpha of 1.0 (if applicable)
		if (color.rgba[3] === null) {
			if (thisObj.paletteSetsAlpha === true || (thisObj.paletteSetsAlpha === 'auto' && thisObj._paletteHasTransparency)) {
				color.rgba[3] = 1.0;
			}
		}

		thisObj.fromRGBA.apply(thisObj, color.rgba);

		thisObj.trigger('input');
		thisObj.trigger('change');

		if (thisObj.hideOnPaletteClick) {
			thisObj.hide();
		}
	},


	setPad : function (thisObj, e, ofsX, ofsY) {
		var pointerAbs = jsc.getAbsPointerPos(e);
		var x = ofsX + pointerAbs.x - jsc._pointerOrigin.x - thisObj.padding - thisObj.controlBorderWidth;
		var y = ofsY + pointerAbs.y - jsc._pointerOrigin.y - thisObj.padding - thisObj.controlBorderWidth;

		var xVal = x * (360 / (thisObj.width - 1));
		var yVal = 100 - (y * (100 / (thisObj.height - 1)));

		switch (jsc.getPadYChannel(thisObj)) {
		case 's': thisObj.fromHSVA(xVal, yVal, null, null); break;
		case 'v': thisObj.fromHSVA(xVal, null, yVal, null); break;
		}
	},


	setSld : function (thisObj, e, ofsY) {
		var pointerAbs = jsc.getAbsPointerPos(e);
		var y = ofsY + pointerAbs.y - jsc._pointerOrigin.y - thisObj.padding - thisObj.controlBorderWidth;
		var yVal = 100 - (y * (100 / (thisObj.height - 1)));

		switch (jsc.getSliderChannel(thisObj)) {
		case 's': thisObj.fromHSVA(null, yVal, null, null); break;
		case 'v': thisObj.fromHSVA(null, null, yVal, null); break;
		}
	},


	setASld : function (thisObj, e, ofsY) {
		var pointerAbs = jsc.getAbsPointerPos(e);
		var y = ofsY + pointerAbs.y - jsc._pointerOrigin.y - thisObj.padding - thisObj.controlBorderWidth;
		var yVal = 1.0 - (y * (1.0 / (thisObj.height - 1)));

		if (yVal < 1.0) {
			// if format is flexible and the current format doesn't support alpha, switch to a suitable one
			var fmt = thisObj.getFormat();
			if (thisObj.format.toLowerCase() === 'any' && !jsc.isAlphaFormat(fmt)) {
				thisObj._setFormat(fmt === 'hex' ? 'hexa' : 'rgba');
			}
		}

		thisObj.fromHSVA(null, null, null, yVal);
	},


	createPadCanvas : function () {

		var ret = {
			elm: null,
			draw: null
		};

		var canvas = jsc.createEl('canvas');
		var ctx = canvas.getContext('2d');

		var drawFunc = function (width, height, type) {
			canvas.width = width;
			canvas.height = height;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			var hGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
			hGrad.addColorStop(0 / 6, '#F00');
			hGrad.addColorStop(1 / 6, '#FF0');
			hGrad.addColorStop(2 / 6, '#0F0');
			hGrad.addColorStop(3 / 6, '#0FF');
			hGrad.addColorStop(4 / 6, '#00F');
			hGrad.addColorStop(5 / 6, '#F0F');
			hGrad.addColorStop(6 / 6, '#F00');

			ctx.fillStyle = hGrad;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			var vGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
			switch (type.toLowerCase()) {
			case 's':
				vGrad.addColorStop(0, 'rgba(255,255,255,0)');
				vGrad.addColorStop(1, 'rgba(255,255,255,1)');
				break;
			case 'v':
				vGrad.addColorStop(0, 'rgba(0,0,0,0)');
				vGrad.addColorStop(1, 'rgba(0,0,0,1)');
				break;
			}
			ctx.fillStyle = vGrad;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		};

		ret.elm = canvas;
		ret.draw = drawFunc;

		return ret;
	},


	createSliderGradient : function () {

		var ret = {
			elm: null,
			draw: null
		};

		var canvas = jsc.createEl('canvas');
		var ctx = canvas.getContext('2d');

		var drawFunc = function (width, height, color1, color2) {
			canvas.width = width;
			canvas.height = height;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			var grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
			grad.addColorStop(0, color1);
			grad.addColorStop(1, color2);

			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		};

		ret.elm = canvas;
		ret.draw = drawFunc;

		return ret;
	},


	createASliderGradient : function () {

		var ret = {
			elm: null,
			draw: null
		};

		var canvas = jsc.createEl('canvas');
		var ctx = canvas.getContext('2d');

		var drawFunc = function (width, height, color) {
			canvas.width = width;
			canvas.height = height;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			var sqSize = canvas.width / 2;
			var sqColor1 = jsc.pub.chessboardColor1;
			var sqColor2 = jsc.pub.chessboardColor2;

			// dark gray background
			ctx.fillStyle = sqColor1;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			if (sqSize > 0) { // to avoid infinite loop
				for (var y = 0; y < canvas.height; y += sqSize * 2) {
					// light gray squares
					ctx.fillStyle = sqColor2;
					ctx.fillRect(0, y, sqSize, sqSize);
					ctx.fillRect(sqSize, y + sqSize, sqSize, sqSize);
				}
			}

			var grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
			grad.addColorStop(0, color);
			grad.addColorStop(1, 'rgba(0,0,0,0)');

			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		};

		ret.elm = canvas;
		ret.draw = drawFunc;

		return ret;
	},


	BoxShadow : (function () {
		var BoxShadow = function (hShadow, vShadow, blur, spread, color, inset) {
			this.hShadow = hShadow;
			this.vShadow = vShadow;
			this.blur = blur;
			this.spread = spread;
			this.color = color;
			this.inset = !!inset;
		};

		BoxShadow.prototype.toString = function () {
			var vals = [
				Math.round(this.hShadow) + 'px',
				Math.round(this.vShadow) + 'px',
				Math.round(this.blur) + 'px',
				Math.round(this.spread) + 'px',
				this.color
			];
			if (this.inset) {
				vals.push('inset');
			}
			return vals.join(' ');
		};

		return BoxShadow;
	})(),


	flags : {
		leaveValue : 1 << 0,
		leaveAlpha : 1 << 1,
		leavePreview : 1 << 2,
	},


	enumOpts : {
		format: ['auto', 'any', 'hex', 'hexa', 'rgb', 'rgba'],
		previewPosition: ['left', 'right'],
		mode: ['hsv', 'hvs', 'hs', 'hv'],
		position: ['left', 'right', 'top', 'bottom'],
		alphaChannel: ['auto', true, false],
		paletteSetsAlpha: ['auto', true, false],
	},


	deprecatedOpts : {
		// <old_option>: <new_option>  (<new_option> can be null)
		'styleElement': 'previewElement',
		'onFineChange': 'onInput',
		'overwriteImportant': 'forceStyle',
		'closable': 'closeButton',
		'insetWidth': 'controlBorderWidth',
		'insetColor': 'controlBorderColor',
		'refine': null,
	},


	docsRef : ' ' + 'See https://jscolor.com/docs/',


	//
	// Usage:
	// var myPicker = new JSColor(<targetElement> [, <options>])
	//
	// (constructor is accessible via both 'jscolor' and 'JSColor' name)
	//

	pub : function (targetElement, opts) {

		var THIS = this;

		if (!opts) {
			opts = {};
		}

		this.channels = {
			r: 255, // red [0-255]
			g: 255, // green [0-255]
			b: 255, // blue [0-255]
			h: 0, // hue [0-360]
			s: 0, // saturation [0-100]
			v: 100, // value (brightness) [0-100]
			a: 1.0, // alpha (opacity) [0.0 - 1.0]
		};

		// General options
		//
		this.format = 'auto'; // 'auto' | 'any' | 'hex' | 'hexa' | 'rgb' | 'rgba' - Format of the input/output value
		this.value = undefined; // INITIAL color value in any supported format. To change it later, use method fromString(), fromHSVA(), fromRGBA() or channel()
		this.alpha = undefined; // INITIAL alpha value. To change it later, call method channel('A', <value>)
		this.random = false; // whether to randomize the initial color. Either true | false, or an array of ranges: [minV, maxV, minS, maxS, minH, maxH, minA, maxA]
		this.onChange = undefined; // called when color changes. Value can be either a function or a string with JS code.
		this.onInput = undefined; // called repeatedly as the color is being changed, e.g. while dragging a slider. Value can be either a function or a string with JS code.
		this.valueElement = undefined; // element that will be used to display and input the color value
		this.alphaElement = undefined; // element that will be used to display and input the alpha (opacity) value
		this.previewElement = undefined; // element that will preview the picked color using CSS background
		this.previewPosition = 'left'; // 'left' | 'right' - position of the color preview in previewElement
		this.previewSize = 32; // (px) width of the color preview displayed in previewElement
		this.previewPadding = 8; // (px) space between color preview and content of the previewElement
		this.required = true; // whether the associated text input must always contain a color value. If false, the input can be left empty.
		this.hash = true; // whether to prefix the HEX color code with # symbol (only applicable for HEX format)
		this.uppercase = true; // whether to show the HEX color code in upper case (only applicable for HEX format)
		this.forceStyle = true; // whether to overwrite CSS style of the previewElement using !important flag

		// Color Picker options
		//
		this.width = 181; // width of the color spectrum (in px)
		this.height = 101; // height of the color spectrum (in px)
		this.mode = 'HSV'; // 'HSV' | 'HVS' | 'HS' | 'HV' - layout of the color picker controls
		this.alphaChannel = 'auto'; // 'auto' | true | false - if alpha channel is enabled, the alpha slider will be visible. If 'auto', it will be determined according to color format
		this.position = 'bottom'; // 'left' | 'right' | 'top' | 'bottom' - position relative to the target element
		this.smartPosition = true; // automatically change picker position when there is not enough space for it
		this.showOnClick = true; // whether to show the picker when user clicks its target element
		this.hideOnLeave = true; // whether to automatically hide the picker when user leaves its target element (e.g. upon clicking the document)
		this.palette = []; // colors to be displayed in the palette, specified as an array or a string of space separated color values (in any supported format)
		this.paletteCols = 10; // number of columns in the palette
		this.paletteSetsAlpha = 'auto'; // 'auto' | true | false - if true, palette colors that don't specify alpha will set alpha to 1.0
		this.paletteHeight = 16; // maximum height (px) of a row in the palette
		this.paletteSpacing = 4; // distance (px) between color samples in the palette
		this.hideOnPaletteClick = false; // when set to true, clicking the palette will also hide the color picker
		this.sliderSize = 16; // px
		this.crossSize = 8; // px
		this.closeButton = false; // whether to display the Close button
		this.closeText = 'Close';
		this.buttonColor = 'rgba(0,0,0,1)'; // CSS color
		this.buttonHeight = 18; // px
		this.padding = 12; // px
		this.backgroundColor = 'rgba(255,255,255,1)'; // CSS color
		this.borderWidth = 1; // px
		this.borderColor = 'rgba(187,187,187,1)'; // CSS color
		this.borderRadius = 8; // px
		this.controlBorderWidth = 1; // px
		this.controlBorderColor = 'rgba(187,187,187,1)'; // CSS color
		this.shadow = true; // whether to display a shadow
		this.shadowBlur = 15; // px
		this.shadowColor = 'rgba(0,0,0,0.2)'; // CSS color
		this.pointerColor = 'rgba(76,76,76,1)'; // CSS color
		this.pointerBorderWidth = 1; // px
		this.pointerBorderColor = 'rgba(255,255,255,1)'; // CSS color
		this.pointerThickness = 2; // px
		this.zIndex = 5000;
		this.container = undefined; // where to append the color picker (BODY element by default)

		// Experimental
		//
		this.minS = 0; // min allowed saturation (0 - 100)
		this.maxS = 100; // max allowed saturation (0 - 100)
		this.minV = 0; // min allowed value (brightness) (0 - 100)
		this.maxV = 100; // max allowed value (brightness) (0 - 100)
		this.minA = 0.0; // min allowed alpha (opacity) (0.0 - 1.0)
		this.maxA = 1.0; // max allowed alpha (opacity) (0.0 - 1.0)


		// Getter: option(name)
		// Setter: option(name, value)
		//         option({name:value, ...})
		//
		this.option = function () {
			if (!arguments.length) {
				throw new Error('No option specified');
			}

			if (arguments.length === 1 && typeof arguments[0] === 'string') {
				// getting a single option
				try {
					return getOption(arguments[0]);
				} catch (e) {
					console.warn(e);
				}
				return false;

			} else if (arguments.length >= 2 && typeof arguments[0] === 'string') {
				// setting a single option
				try {
					if (!setOption(arguments[0], arguments[1])) {
						return false;
					}
				} catch (e) {
					console.warn(e);
					return false;
				}
				this.redraw(); // immediately redraws the picker, if it's displayed
				this.exposeColor(); // in case some preview-related or format-related option was changed
				return true;

			} else if (arguments.length === 1 && typeof arguments[0] === 'object') {
				// setting multiple options
				var opts = arguments[0];
				var success = true;
				for (var opt in opts) {
					if (opts.hasOwnProperty(opt)) {
						try {
							if (!setOption(opt, opts[opt])) {
								success = false;
							}
						} catch (e) {
							console.warn(e);
							success = false;
						}
					}
				}
				this.redraw(); // immediately redraws the picker, if it's displayed
				this.exposeColor(); // in case some preview-related or format-related option was changed
				return success;
			}

			throw new Error('Invalid arguments');
		}


		// Getter: channel(name)
		// Setter: channel(name, value)
		//
		this.channel = function (name, value) {
			if (typeof name !== 'string') {
				throw new Error('Invalid value for channel name: ' + name);
			}

			if (value === undefined) {
				// getting channel value
				if (!this.channels.hasOwnProperty(name.toLowerCase())) {
					console.warn('Getting unknown channel: ' + name);
					return false;
				}
				return this.channels[name.toLowerCase()];

			} else {
				// setting channel value
				var res = false;
				switch (name.toLowerCase()) {
					case 'r': res = this.fromRGBA(value, null, null, null); break;
					case 'g': res = this.fromRGBA(null, value, null, null); break;
					case 'b': res = this.fromRGBA(null, null, value, null); break;
					case 'h': res = this.fromHSVA(value, null, null, null); break;
					case 's': res = this.fromHSVA(null, value, null, null); break;
					case 'v': res = this.fromHSVA(null, null, value, null); break;
					case 'a': res = this.fromHSVA(null, null, null, value); break;
					default:
						console.warn('Setting unknown channel: ' + name);
						return false;
				}
				if (res) {
					this.redraw(); // immediately redraws the picker, if it's displayed
					return true;
				}
			}

			return false;
		}


		// Triggers given input event(s) by:
		// - executing on<Event> callback specified as picker's option
		// - triggering standard DOM event listeners attached to the value element
		//
		// It is possible to specify multiple events separated with a space.
		//
		this.trigger = function (eventNames) {
			var evs = jsc.strList(eventNames);
			for (var i = 0; i < evs.length; i += 1) {
				var ev = evs[i].toLowerCase();

				// trigger a callback
				var callbackProp = null;
				switch (ev) {
					case 'input': callbackProp = 'onInput'; break;
					case 'change': callbackProp = 'onChange'; break;
				}
				if (callbackProp) {
					jsc.triggerCallback(this, callbackProp);
				}

				// trigger standard DOM event listeners on the value element
				jsc.triggerInputEvent(this.valueElement, ev, true, true);
			}
		};


		// h: 0-360
		// s: 0-100
		// v: 0-100
		// a: 0.0-1.0
		//
		this.fromHSVA = function (h, s, v, a, flags) { // null = don't change
			if (h === undefined) { h = null; }
			if (s === undefined) { s = null; }
			if (v === undefined) { v = null; }
			if (a === undefined) { a = null; }

			if (h !== null) {
				if (isNaN(h)) { return false; }
				this.channels.h = Math.max(0, Math.min(360, h));
			}
			if (s !== null) {
				if (isNaN(s)) { return false; }
				this.channels.s = Math.max(0, Math.min(100, this.maxS, s), this.minS);
			}
			if (v !== null) {
				if (isNaN(v)) { return false; }
				this.channels.v = Math.max(0, Math.min(100, this.maxV, v), this.minV);
			}
			if (a !== null) {
				if (isNaN(a)) { return false; }
				this.channels.a = this.hasAlphaChannel() ?
					Math.max(0, Math.min(1, this.maxA, a), this.minA) :
					1.0; // if alpha channel is disabled, the color should stay 100% opaque
			}

			var rgb = jsc.HSV_RGB(
				this.channels.h,
				this.channels.s,
				this.channels.v
			);
			this.channels.r = rgb[0];
			this.channels.g = rgb[1];
			this.channels.b = rgb[2];

			this.exposeColor(flags);
			return true;
		};


		// r: 0-255
		// g: 0-255
		// b: 0-255
		// a: 0.0-1.0
		//
		this.fromRGBA = function (r, g, b, a, flags) { // null = don't change
			if (r === undefined) { r = null; }
			if (g === undefined) { g = null; }
			if (b === undefined) { b = null; }
			if (a === undefined) { a = null; }

			if (r !== null) {
				if (isNaN(r)) { return false; }
				r = Math.max(0, Math.min(255, r));
			}
			if (g !== null) {
				if (isNaN(g)) { return false; }
				g = Math.max(0, Math.min(255, g));
			}
			if (b !== null) {
				if (isNaN(b)) { return false; }
				b = Math.max(0, Math.min(255, b));
			}
			if (a !== null) {
				if (isNaN(a)) { return false; }
				this.channels.a = this.hasAlphaChannel() ?
					Math.max(0, Math.min(1, this.maxA, a), this.minA) :
					1.0; // if alpha channel is disabled, the color should stay 100% opaque
			}

			var hsv = jsc.RGB_HSV(
				r===null ? this.channels.r : r,
				g===null ? this.channels.g : g,
				b===null ? this.channels.b : b
			);
			if (hsv[0] !== null) {
				this.channels.h = Math.max(0, Math.min(360, hsv[0]));
			}
			if (hsv[2] !== 0) { // fully black color stays black through entire saturation range, so let's not change saturation
				this.channels.s = Math.max(0, this.minS, Math.min(100, this.maxS, hsv[1]));
			}
			this.channels.v = Math.max(0, this.minV, Math.min(100, this.maxV, hsv[2]));

			// update RGB according to final HSV, as some values might be trimmed
			var rgb = jsc.HSV_RGB(this.channels.h, this.channels.s, this.channels.v);
			this.channels.r = rgb[0];
			this.channels.g = rgb[1];
			this.channels.b = rgb[2];

			this.exposeColor(flags);
			return true;
		};


		// DEPRECATED. Use .fromHSVA() instead
		//
		this.fromHSV = function (h, s, v, flags) {
			console.warn('fromHSV() method is DEPRECATED. Using fromHSVA() instead.' + jsc.docsRef);
			return this.fromHSVA(h, s, v, null, flags);
		};


		// DEPRECATED. Use .fromRGBA() instead
		//
		this.fromRGB = function (r, g, b, flags) {
			console.warn('fromRGB() method is DEPRECATED. Using fromRGBA() instead.' + jsc.docsRef);
			return this.fromRGBA(r, g, b, null, flags);
		};


		this.fromString = function (str, flags) {
			if (!this.required && str.trim() === '') {
				// setting empty string to an optional color input
				this.setPreviewElementBg(null);
				this.setValueElementValue('');
				return true;
			}

			var color = jsc.parseColorString(str);
			if (!color) {
				return false; // could not parse
			}
			if (this.format.toLowerCase() === 'any') {
				this._setFormat(color.format); // adapt format
				if (!jsc.isAlphaFormat(this.getFormat())) {
					color.rgba[3] = 1.0; // when switching to a format that doesn't support alpha, set full opacity
				}
			}
			this.fromRGBA(
				color.rgba[0],
				color.rgba[1],
				color.rgba[2],
				color.rgba[3],
				flags
			);
			return true;
		};


		this.randomize = function (minV, maxV, minS, maxS, minH, maxH, minA, maxA) {
			if (minV === undefined) { minV = 0; }
			if (maxV === undefined) { maxV = 100; }
			if (minS === undefined) { minS = 0; }
			if (maxS === undefined) { maxS = 100; }
			if (minH === undefined) { minH = 0; }
			if (maxH === undefined) { maxH = 359; }
			if (minA === undefined) { minA = 1; }
			if (maxA === undefined) { maxA = 1; }

			this.fromHSVA(
				minH + Math.floor(Math.random() * (maxH - minH + 1)),
				minS + Math.floor(Math.random() * (maxS - minS + 1)),
				minV + Math.floor(Math.random() * (maxV - minV + 1)),
				((100 * minA) + Math.floor(Math.random() * (100 * (maxA - minA) + 1))) / 100
			);
		};


		this.toString = function (format) {
			if (format === undefined) {
				format = this.getFormat(); // format not specified -> use the current format
			}
			switch (format.toLowerCase()) {
				case 'hex': return this.toHEXString(); break;
				case 'hexa': return this.toHEXAString(); break;
				case 'rgb': return this.toRGBString(); break;
				case 'rgba': return this.toRGBAString(); break;
			}
			return false;
		};


		this.toHEXString = function () {
			return jsc.hexColor(
				this.channels.r,
				this.channels.g,
				this.channels.b
			);
		};


		this.toHEXAString = function () {
			return jsc.hexaColor(
				this.channels.r,
				this.channels.g,
				this.channels.b,
				this.channels.a
			);
		};


		this.toRGBString = function () {
			return jsc.rgbColor(
				this.channels.r,
				this.channels.g,
				this.channels.b
			);
		};


		this.toRGBAString = function () {
			return jsc.rgbaColor(
				this.channels.r,
				this.channels.g,
				this.channels.b,
				this.channels.a
			);
		};


		this.toGrayscale = function () {
			return (
				0.213 * this.channels.r +
				0.715 * this.channels.g +
				0.072 * this.channels.b
			);
		};


		this.toCanvas = function () {
			return jsc.genColorPreviewCanvas(this.toRGBAString()).canvas;
		};


		this.toDataURL = function () {
			return this.toCanvas().toDataURL();
		};


		this.toBackground = function () {
			return jsc.pub.background(this.toRGBAString());
		};


		this.isLight = function () {
			return this.toGrayscale() > 255 / 2;
		};


		this.hide = function () {
			if (isPickerOwner()) {
				detachPicker();
			}
		};


		this.show = function () {
			drawPicker();
		};


		this.redraw = function () {
			if (isPickerOwner()) {
				drawPicker();
			}
		};


		this.getFormat = function () {
			return this._currentFormat;
		};


		this._setFormat = function (format) {
			this._currentFormat = format.toLowerCase();
		};


		this.hasAlphaChannel = function () {
			if (this.alphaChannel === 'auto') {
				return (
					this.format.toLowerCase() === 'any' || // format can change on the fly (e.g. from hex to rgba), so let's consider the alpha channel enabled
					jsc.isAlphaFormat(this.getFormat()) || // the current format supports alpha channel
					this.alpha !== undefined || // initial alpha value is set, so we're working with alpha channel
					this.alphaElement !== undefined // the alpha value is redirected, so we're working with alpha channel
				);
			}

			return this.alphaChannel; // the alpha channel is explicitly set
		};


		this.processValueInput = function (str) {
			if (!this.fromString(str)) {
				// could not parse the color value - let's just expose the current color
				this.exposeColor();
			}
		};


		this.processAlphaInput = function (str) {
			if (!this.fromHSVA(null, null, null, parseFloat(str))) {
				// could not parse the alpha value - let's just expose the current color
				this.exposeColor();
			}
		};


		this.exposeColor = function (flags) {
			var colorStr = this.toString();
			var fmt = this.getFormat();

			// reflect current color in data- attribute
			jsc.setDataAttr(this.targetElement, 'current-color', colorStr);

			if (!(flags & jsc.flags.leaveValue) && this.valueElement) {
				if (fmt === 'hex' || fmt === 'hexa') {
					if (!this.uppercase) { colorStr = colorStr.toLowerCase(); }
					if (!this.hash) { colorStr = colorStr.replace(/^#/, ''); }
				}
				this.setValueElementValue(colorStr);
			}

			if (!(flags & jsc.flags.leaveAlpha) && this.alphaElement) {
				var alphaVal = Math.round(this.channels.a * 100) / 100;
				this.setAlphaElementValue(alphaVal);
			}

			if (!(flags & jsc.flags.leavePreview) && this.previewElement) {
				var previewPos = null; // 'left' | 'right' (null -> fill the entire element)

				if (
					jsc.isTextInput(this.previewElement) || // text input
					(jsc.isButton(this.previewElement) && !jsc.isButtonEmpty(this.previewElement)) // button with text
				) {
					previewPos = this.previewPosition;
				}

				this.setPreviewElementBg(this.toRGBAString());
			}

			if (isPickerOwner()) {
				redrawPad();
				redrawSld();
				redrawASld();
			}
		};


		this.setPreviewElementBg = function (color) {
			if (!this.previewElement) {
				return;
			}

			var position = null; // color preview position:  null | 'left' | 'right'
			var width = null; // color preview width:  px | null = fill the entire element
			if (
				jsc.isTextInput(this.previewElement) || // text input
				(jsc.isButton(this.previewElement) && !jsc.isButtonEmpty(this.previewElement)) // button with text
			) {
				position = this.previewPosition;
				width = this.previewSize;
			}

			var backgrounds = [];

			if (!color) {
				// there is no color preview to display -> let's remove any previous background image
				backgrounds.push({
					image: 'none',
					position: 'left top',
					size: 'auto',
					repeat: 'no-repeat',
					origin: 'padding-box',
				});
			} else {
				// CSS gradient for background color preview
				backgrounds.push({
					image: jsc.genColorPreviewGradient(
						color,
						position,
						width ? width - jsc.pub.previewSeparator.length : null
					),
					position: 'left top',
					size: 'auto',
					repeat: position ? 'repeat-y' : 'repeat',
					origin: 'padding-box',
				});

				// data URL of generated PNG image with a gray transparency chessboard
				var preview = jsc.genColorPreviewCanvas(
					'rgba(0,0,0,0)',
					position ? {'left':'right', 'right':'left'}[position] : null,
					width,
					true
				);
				backgrounds.push({
					image: 'url(\'' + preview.canvas.toDataURL() + '\')',
					position: (position || 'left') + ' top',
					size: preview.width + 'px ' + preview.height + 'px',
					repeat: position ? 'repeat-y' : 'repeat',
					origin: 'padding-box',
				});
			}

			var bg = {
				image: [],
				position: [],
				size: [],
				repeat: [],
				origin: [],
			};
			for (var i = 0; i < backgrounds.length; i += 1) {
				bg.image.push(backgrounds[i].image);
				bg.position.push(backgrounds[i].position);
				bg.size.push(backgrounds[i].size);
				bg.repeat.push(backgrounds[i].repeat);
				bg.origin.push(backgrounds[i].origin);
			}

			// set previewElement's background-images
			var sty = {
				'background-image': bg.image.join(', '),
				'background-position': bg.position.join(', '),
				'background-size': bg.size.join(', '),
				'background-repeat': bg.repeat.join(', '),
				'background-origin': bg.origin.join(', '),
			};
			jsc.setStyle(this.previewElement, sty, this.forceStyle);


			// set/restore previewElement's padding
			var padding = {
				left: null,
				right: null,
			};
			if (position) {
				padding[position] = (this.previewSize + this.previewPadding) + 'px';
			}

			var sty = {
				'padding-left': padding.left,
				'padding-right': padding.right,
			};
			jsc.setStyle(this.previewElement, sty, this.forceStyle, true);
		};


		this.setValueElementValue = function (str) {
			if (this.valueElement) {
				if (jsc.nodeName(this.valueElement) === 'input') {
					this.valueElement.value = str;
				} else {
					this.valueElement.innerHTML = str;
				}
			}
		};


		this.setAlphaElementValue = function (str) {
			if (this.alphaElement) {
				if (jsc.nodeName(this.alphaElement) === 'input') {
					this.alphaElement.value = str;
				} else {
					this.alphaElement.innerHTML = str;
				}
			}
		};


		this._processParentElementsInDOM = function () {
			if (this._parentElementsProcessed) { return; }
			this._parentElementsProcessed = true;

			var elm = this.targetElement;
			do {
				// If the target element or one of its parent nodes has fixed position,
				// then use fixed positioning instead
				var compStyle = jsc.getCompStyle(elm);
				if (compStyle.position && compStyle.position.toLowerCase() === 'fixed') {
					this.fixed = true;
				}

				if (elm !== this.targetElement) {
					// Ensure to attach onParentScroll only once to each parent element
					// (multiple targetElements can share the same parent nodes)
					//
					// Note: It's not just offsetParents that can be scrollable,
					// that's why we loop through all parent nodes
					if (!jsc.getData(elm, 'hasScrollListener')) {
						elm.addEventListener('scroll', jsc.onParentScroll, false);
						jsc.setData(elm, 'hasScrollListener', true);
					}
				}
			} while ((elm = elm.parentNode) && jsc.nodeName(elm) !== 'body');
		};


		this.tryHide = function () {
			if (this.hideOnLeave) {
				this.hide();
			}
		};


		this.set__palette = function (val) {
			this.palette = val;
			this._palette = jsc.parsePaletteValue(val);
			this._paletteHasTransparency = jsc.containsTranparentColor(this._palette);
		};


		function setOption (option, value) {
			if (typeof option !== 'string') {
				throw new Error('Invalid value for option name: ' + option);
			}

			// enum option
			if (jsc.enumOpts.hasOwnProperty(option)) {
				if (typeof value === 'string') { // enum string values are case insensitive
					value = value.toLowerCase();
				}
				if (jsc.enumOpts[option].indexOf(value) === -1) {
					throw new Error('Option \'' + option + '\' has invalid value: ' + value);
				}
			}

			// deprecated option
			if (jsc.deprecatedOpts.hasOwnProperty(option)) {
				var oldOpt = option;
				var newOpt = jsc.deprecatedOpts[option];
				if (newOpt) {
					// if we have a new name for this option, let's log a warning and use the new name
					console.warn('Option \'%s\' is DEPRECATED, using \'%s\' instead.' + jsc.docsRef, oldOpt, newOpt);
					option = newOpt;
				} else {
					// new name not available for the option
					throw new Error('Option \'' + option + '\' is DEPRECATED');
				}
			}

			var setter = 'set__' + option;

			if (typeof THIS[setter] === 'function') { // a setter exists for this option
				THIS[setter](value);
				return true;

			} else if (option in THIS) { // option exists as a property
				THIS[option] = value;
				return true;
			}

			throw new Error('Unrecognized configuration option: ' + option);
		}


		function getOption (option) {
			if (typeof option !== 'string') {
				throw new Error('Invalid value for option name: ' + option);
			}

			// deprecated option
			if (jsc.deprecatedOpts.hasOwnProperty(option)) {
				var oldOpt = option;
				var newOpt = jsc.deprecatedOpts[option];
				if (newOpt) {
					// if we have a new name for this option, let's log a warning and use the new name
					console.warn('Option \'%s\' is DEPRECATED, using \'%s\' instead.' + jsc.docsRef, oldOpt, newOpt);
					option = newOpt;
				} else {
					// new name not available for the option
					throw new Error('Option \'' + option + '\' is DEPRECATED');
				}
			}

			var getter = 'get__' + option;

			if (typeof THIS[getter] === 'function') { // a getter exists for this option
				return THIS[getter](value);

			} else if (option in THIS) { // option exists as a property
				return THIS[option];
			}

			throw new Error('Unrecognized configuration option: ' + option);
		}


		function detachPicker () {
			jsc.removeClass(THIS.targetElement, jsc.pub.activeClassName);
			jsc.picker.wrap.parentNode.removeChild(jsc.picker.wrap);
			delete jsc.picker.owner;
		}


		function drawPicker () {

			// At this point, when drawing the picker, we know what the parent elements are
			// and we can do all related DOM operations, such as registering events on them
			// or checking their positioning
			THIS._processParentElementsInDOM();

			if (!jsc.picker) {
				jsc.picker = {
					owner: null, // owner picker instance
					wrap : jsc.createEl('div'),
					box : jsc.createEl('div'),
					boxS : jsc.createEl('div'), // shadow area
					boxB : jsc.createEl('div'), // border
					pad : jsc.createEl('div'),
					padB : jsc.createEl('div'), // border
					padM : jsc.createEl('div'), // mouse/touch area
					padCanvas : jsc.createPadCanvas(),
					cross : jsc.createEl('div'),
					crossBY : jsc.createEl('div'), // border Y
					crossBX : jsc.createEl('div'), // border X
					crossLY : jsc.createEl('div'), // line Y
					crossLX : jsc.createEl('div'), // line X
					sld : jsc.createEl('div'), // slider
					sldB : jsc.createEl('div'), // border
					sldM : jsc.createEl('div'), // mouse/touch area
					sldGrad : jsc.createSliderGradient(),
					sldPtrS : jsc.createEl('div'), // slider pointer spacer
					sldPtrIB : jsc.createEl('div'), // slider pointer inner border
					sldPtrMB : jsc.createEl('div'), // slider pointer middle border
					sldPtrOB : jsc.createEl('div'), // slider pointer outer border
					asld : jsc.createEl('div'), // alpha slider
					asldB : jsc.createEl('div'), // border
					asldM : jsc.createEl('div'), // mouse/touch area
					asldGrad : jsc.createASliderGradient(),
					asldPtrS : jsc.createEl('div'), // slider pointer spacer
					asldPtrIB : jsc.createEl('div'), // slider pointer inner border
					asldPtrMB : jsc.createEl('div'), // slider pointer middle border
					asldPtrOB : jsc.createEl('div'), // slider pointer outer border
					pal : jsc.createEl('div'), // palette
					btn : jsc.createEl('div'),
					btnT : jsc.createEl('div'), // text
				};

				jsc.picker.pad.appendChild(jsc.picker.padCanvas.elm);
				jsc.picker.padB.appendChild(jsc.picker.pad);
				jsc.picker.cross.appendChild(jsc.picker.crossBY);
				jsc.picker.cross.appendChild(jsc.picker.crossBX);
				jsc.picker.cross.appendChild(jsc.picker.crossLY);
				jsc.picker.cross.appendChild(jsc.picker.crossLX);
				jsc.picker.padB.appendChild(jsc.picker.cross);
				jsc.picker.box.appendChild(jsc.picker.padB);
				jsc.picker.box.appendChild(jsc.picker.padM);

				jsc.picker.sld.appendChild(jsc.picker.sldGrad.elm);
				jsc.picker.sldB.appendChild(jsc.picker.sld);
				jsc.picker.sldB.appendChild(jsc.picker.sldPtrOB);
				jsc.picker.sldPtrOB.appendChild(jsc.picker.sldPtrMB);
				jsc.picker.sldPtrMB.appendChild(jsc.picker.sldPtrIB);
				jsc.picker.sldPtrIB.appendChild(jsc.picker.sldPtrS);
				jsc.picker.box.appendChild(jsc.picker.sldB);
				jsc.picker.box.appendChild(jsc.picker.sldM);

				jsc.picker.asld.appendChild(jsc.picker.asldGrad.elm);
				jsc.picker.asldB.appendChild(jsc.picker.asld);
				jsc.picker.asldB.appendChild(jsc.picker.asldPtrOB);
				jsc.picker.asldPtrOB.appendChild(jsc.picker.asldPtrMB);
				jsc.picker.asldPtrMB.appendChild(jsc.picker.asldPtrIB);
				jsc.picker.asldPtrIB.appendChild(jsc.picker.asldPtrS);
				jsc.picker.box.appendChild(jsc.picker.asldB);
				jsc.picker.box.appendChild(jsc.picker.asldM);

				jsc.picker.box.appendChild(jsc.picker.pal);

				jsc.picker.btn.appendChild(jsc.picker.btnT);
				jsc.picker.box.appendChild(jsc.picker.btn);

				jsc.picker.boxB.appendChild(jsc.picker.box);
				jsc.picker.wrap.appendChild(jsc.picker.boxS);
				jsc.picker.wrap.appendChild(jsc.picker.boxB);

				jsc.picker.wrap.addEventListener('touchstart', jsc.onPickerTouchStart,
					jsc.isPassiveEventSupported ? {passive: false} : false);
			}

			var p = jsc.picker;

			var displaySlider = !!jsc.getSliderChannel(THIS);
			var displayAlphaSlider = THIS.hasAlphaChannel();
			var pickerDims = jsc.getPickerDims(THIS);
			var crossOuterSize = (2 * THIS.pointerBorderWidth + THIS.pointerThickness + 2 * THIS.crossSize);
			var controlPadding = jsc.getControlPadding(THIS);
			var borderRadius = Math.min(
				THIS.borderRadius,
				Math.round(THIS.padding * Math.PI)); // px
			var padCursor = 'crosshair';

			// wrap
			p.wrap.className = 'jscolor-wrap';
			p.wrap.style.width = pickerDims.borderW + 'px';
			p.wrap.style.height = pickerDims.borderH + 'px';
			p.wrap.style.zIndex = THIS.zIndex;

			// picker
			p.box.className = 'jscolor-picker';
			p.box.style.width = pickerDims.paddedW + 'px';
			p.box.style.height = pickerDims.paddedH + 'px';

			// picker shadow
			p.boxS.className = 'jscolor-shadow';
			jsc.setBorderRadius(p.boxS, borderRadius + 'px');

			// picker border
			p.boxB.className = 'jscolor-border';
			p.boxB.style.border = THIS.borderWidth + 'px solid';
			p.boxB.style.borderColor = THIS.borderColor;
			p.boxB.style.background = THIS.backgroundColor;
			jsc.setBorderRadius(p.boxB, borderRadius + 'px');

			// IE hack:
			// If the element is transparent, IE will trigger the event on the elements under it,
			// e.g. on Canvas or on elements with border
			p.padM.style.background = 'rgba(255,0,0,.2)';
			p.sldM.style.background = 'rgba(0,255,0,.2)';
			p.asldM.style.background = 'rgba(0,0,255,.2)';

			p.padM.style.opacity =
			p.sldM.style.opacity =
			p.asldM.style.opacity =
				'0';

			// pad
			p.pad.style.position = 'relative';
			p.pad.style.width = THIS.width + 'px';
			p.pad.style.height = THIS.height + 'px';

			// pad - color spectrum (HSV and HVS)
			p.padCanvas.draw(THIS.width, THIS.height, jsc.getPadYChannel(THIS));

			// pad border
			p.padB.style.position = 'absolute';
			p.padB.style.left = THIS.padding + 'px';
			p.padB.style.top = THIS.padding + 'px';
			p.padB.style.border = THIS.controlBorderWidth + 'px solid';
			p.padB.style.borderColor = THIS.controlBorderColor;

			// pad mouse area
			p.padM.style.position = 'absolute';
			p.padM.style.left = 0 + 'px';
			p.padM.style.top = 0 + 'px';
			p.padM.style.width = (THIS.padding + 2 * THIS.controlBorderWidth + THIS.width + controlPadding) + 'px';
			p.padM.style.height = (2 * THIS.controlBorderWidth + 2 * THIS.padding + THIS.height) + 'px';
			p.padM.style.cursor = padCursor;
			jsc.setData(p.padM, {
				instance: THIS,
				control: 'pad',
			})

			// pad cross
			p.cross.style.position = 'absolute';
			p.cross.style.left =
			p.cross.style.top =
				'0';
			p.cross.style.width =
			p.cross.style.height =
				crossOuterSize + 'px';

			// pad cross border Y and X
			p.crossBY.style.position =
			p.crossBX.style.position =
				'absolute';
			p.crossBY.style.background =
			p.crossBX.style.background =
				THIS.pointerBorderColor;
			p.crossBY.style.width =
			p.crossBX.style.height =
				(2 * THIS.pointerBorderWidth + THIS.pointerThickness) + 'px';
			p.crossBY.style.height =
			p.crossBX.style.width =
				crossOuterSize + 'px';
			p.crossBY.style.left =
			p.crossBX.style.top =
				(Math.floor(crossOuterSize / 2) - Math.floor(THIS.pointerThickness / 2) - THIS.pointerBorderWidth) + 'px';
			p.crossBY.style.top =
			p.crossBX.style.left =
				'0';

			// pad cross line Y and X
			p.crossLY.style.position =
			p.crossLX.style.position =
				'absolute';
			p.crossLY.style.background =
			p.crossLX.style.background =
				THIS.pointerColor;
			p.crossLY.style.height =
			p.crossLX.style.width =
				(crossOuterSize - 2 * THIS.pointerBorderWidth) + 'px';
			p.crossLY.style.width =
			p.crossLX.style.height =
				THIS.pointerThickness + 'px';
			p.crossLY.style.left =
			p.crossLX.style.top =
				(Math.floor(crossOuterSize / 2) - Math.floor(THIS.pointerThickness / 2)) + 'px';
			p.crossLY.style.top =
			p.crossLX.style.left =
				THIS.pointerBorderWidth + 'px';


			// slider
			p.sld.style.overflow = 'hidden';
			p.sld.style.width = THIS.sliderSize + 'px';
			p.sld.style.height = THIS.height + 'px';

			// slider gradient
			p.sldGrad.draw(THIS.sliderSize, THIS.height, '#000', '#000');

			// slider border
			p.sldB.style.display = displaySlider ? 'block' : 'none';
			p.sldB.style.position = 'absolute';
			p.sldB.style.left = (THIS.padding + THIS.width + 2 * THIS.controlBorderWidth + 2 * controlPadding) + 'px';
			p.sldB.style.top = THIS.padding + 'px';
			p.sldB.style.border = THIS.controlBorderWidth + 'px solid';
			p.sldB.style.borderColor = THIS.controlBorderColor;

			// slider mouse area
			p.sldM.style.display = displaySlider ? 'block' : 'none';
			p.sldM.style.position = 'absolute';
			p.sldM.style.left = (THIS.padding + THIS.width + 2 * THIS.controlBorderWidth + controlPadding) + 'px';
			p.sldM.style.top = 0 + 'px';
			p.sldM.style.width = (
					(THIS.sliderSize + 2 * controlPadding + 2 * THIS.controlBorderWidth) +
					(displayAlphaSlider ? 0 : Math.max(0, THIS.padding - controlPadding)) // remaining padding to the right edge
				) + 'px';
			p.sldM.style.height = (2 * THIS.controlBorderWidth + 2 * THIS.padding + THIS.height) + 'px';
			p.sldM.style.cursor = 'default';
			jsc.setData(p.sldM, {
				instance: THIS,
				control: 'sld',
			});

			// slider pointer inner and outer border
			p.sldPtrIB.style.border =
			p.sldPtrOB.style.border =
				THIS.pointerBorderWidth + 'px solid ' + THIS.pointerBorderColor;

			// slider pointer outer border
			p.sldPtrOB.style.position = 'absolute';
			p.sldPtrOB.style.left = -(2 * THIS.pointerBorderWidth + THIS.pointerThickness) + 'px';
			p.sldPtrOB.style.top = '0';

			// slider pointer middle border
			p.sldPtrMB.style.border = THIS.pointerThickness + 'px solid ' + THIS.pointerColor;

			// slider pointer spacer
			p.sldPtrS.style.width = THIS.sliderSize + 'px';
			p.sldPtrS.style.height = jsc.pub.sliderInnerSpace + 'px';


			// alpha slider
			p.asld.style.overflow = 'hidden';
			p.asld.style.width = THIS.sliderSize + 'px';
			p.asld.style.height = THIS.height + 'px';

			// alpha slider gradient
			p.asldGrad.draw(THIS.sliderSize, THIS.height, '#000');

			// alpha slider border
			p.asldB.style.display = displayAlphaSlider ? 'block' : 'none';
			p.asldB.style.position = 'absolute';
			p.asldB.style.left = (
					(THIS.padding + THIS.width + 2 * THIS.controlBorderWidth + controlPadding) +
					(displaySlider ? (THIS.sliderSize + 3 * controlPadding + 2 * THIS.controlBorderWidth) : 0)
				) + 'px';
			p.asldB.style.top = THIS.padding + 'px';
			p.asldB.style.border = THIS.controlBorderWidth + 'px solid';
			p.asldB.style.borderColor = THIS.controlBorderColor;

			// alpha slider mouse area
			p.asldM.style.display = displayAlphaSlider ? 'block' : 'none';
			p.asldM.style.position = 'absolute';
			p.asldM.style.left = (
					(THIS.padding + THIS.width + 2 * THIS.controlBorderWidth + controlPadding) +
					(displaySlider ? (THIS.sliderSize + 2 * controlPadding + 2 * THIS.controlBorderWidth) : 0)
				) + 'px';
			p.asldM.style.top = 0 + 'px';
			p.asldM.style.width = (
					(THIS.sliderSize + 2 * controlPadding + 2 * THIS.controlBorderWidth) +
					Math.max(0, THIS.padding - controlPadding) // remaining padding to the right edge
				) + 'px';
			p.asldM.style.height = (2 * THIS.controlBorderWidth + 2 * THIS.padding + THIS.height) + 'px';
			p.asldM.style.cursor = 'default';
			jsc.setData(p.asldM, {
				instance: THIS,
				control: 'asld',
			})

			// alpha slider pointer inner and outer border
			p.asldPtrIB.style.border =
			p.asldPtrOB.style.border =
				THIS.pointerBorderWidth + 'px solid ' + THIS.pointerBorderColor;

			// alpha slider pointer outer border
			p.asldPtrOB.style.position = 'absolute';
			p.asldPtrOB.style.left = -(2 * THIS.pointerBorderWidth + THIS.pointerThickness) + 'px';
			p.asldPtrOB.style.top = '0';

			// alpha slider pointer middle border
			p.asldPtrMB.style.border = THIS.pointerThickness + 'px solid ' + THIS.pointerColor;

			// alpha slider pointer spacer
			p.asldPtrS.style.width = THIS.sliderSize + 'px';
			p.asldPtrS.style.height = jsc.pub.sliderInnerSpace + 'px';


			// palette
			p.pal.className = 'jscolor-palette';
			p.pal.style.display = pickerDims.palette.rows ? 'block' : 'none';
			p.pal.style.left = THIS.padding + 'px';
			p.pal.style.top = (2 * THIS.controlBorderWidth + 2 * THIS.padding + THIS.height) + 'px';

			// palette's color samples

			p.pal.innerHTML = '';

			var chessboard = jsc.genColorPreviewCanvas('rgba(0,0,0,0)');

			var si = 0; // color sample's index
			for (var r = 0; r < pickerDims.palette.rows; r++) {
				for (var c = 0; c < pickerDims.palette.cols && si < THIS._palette.length; c++, si++) {
					var sampleColor = THIS._palette[si];
					var sampleCssColor = jsc.rgbaColor.apply(null, sampleColor.rgba);

					var sc = jsc.createEl('div'); // color sample's color
					sc.style.width = (pickerDims.palette.cellW - 2 * THIS.controlBorderWidth) + 'px';
					sc.style.height = (pickerDims.palette.cellH - 2 * THIS.controlBorderWidth) + 'px';
					sc.style.backgroundColor = sampleCssColor;

					var sw = jsc.createEl('div'); // color sample's wrap
					sw.className = 'jscolor-palette-sw';
					sw.style.left =
						(
							pickerDims.palette.cols <= 1 ? 0 :
							Math.round(10 * (c * ((pickerDims.contentW - pickerDims.palette.cellW) / (pickerDims.palette.cols - 1)))) / 10
						) + 'px';
					sw.style.top = (r * (pickerDims.palette.cellH + THIS.paletteSpacing)) + 'px';
					sw.style.border = THIS.controlBorderWidth + 'px solid';
					sw.style.borderColor = THIS.controlBorderColor;
					if (sampleColor.rgba[3] !== null && sampleColor.rgba[3] < 1.0) { // only create chessboard background if the sample has transparency
						sw.style.backgroundImage = 'url(\'' + chessboard.canvas.toDataURL() + '\')';
						sw.style.backgroundRepeat = 'repeat';
						sw.style.backgroundPosition = 'center center';
					}
					jsc.setData(sw, {
						instance: THIS,
						control: 'palette-sw',
						color: sampleColor,
					});
					sw.addEventListener('click', jsc.onPaletteSampleClick, false);
					sw.appendChild(sc);
					p.pal.appendChild(sw);
				}
			}


			// the Close button
			function setBtnBorder () {
				var insetColors = THIS.controlBorderColor.split(/\s+/);
				var outsetColor = insetColors.length < 2 ? insetColors[0] : insetColors[1] + ' ' + insetColors[0] + ' ' + insetColors[0] + ' ' + insetColors[1];
				p.btn.style.borderColor = outsetColor;
			}
			var btnPadding = 15; // px
			p.btn.className = 'jscolor-btn jscolor-btn-close';
			p.btn.style.display = THIS.closeButton ? 'block' : 'none';
			p.btn.style.left = THIS.padding + 'px';
			p.btn.style.bottom = THIS.padding + 'px';
			p.btn.style.padding = '0 ' + btnPadding + 'px';
			p.btn.style.maxWidth = (pickerDims.contentW - 2 * THIS.controlBorderWidth - 2 * btnPadding) + 'px';
			p.btn.style.height = THIS.buttonHeight + 'px';
			p.btn.style.border = THIS.controlBorderWidth + 'px solid';
			setBtnBorder();
			p.btn.style.color = THIS.buttonColor;
			p.btn.onmousedown = function () {
				THIS.hide();
			};
			p.btnT.style.display = 'inline';
			p.btnT.style.lineHeight = THIS.buttonHeight + 'px';
			p.btnT.innerText = THIS.closeText;

			// reposition the pointers
			redrawPad();
			redrawSld();
			redrawASld();

			// If we are changing the owner without first closing the picker,
			// make sure to first deal with the old owner
			if (jsc.picker.owner && jsc.picker.owner !== THIS) {
				jsc.removeClass(jsc.picker.owner.targetElement, jsc.pub.activeClassName);
			}

			// Set a new picker owner
			jsc.picker.owner = THIS;

			// The redrawPosition() method needs picker.owner to be set, that's why we call it here,
			// after setting the owner
			jsc.redrawPosition();

			if (p.wrap.parentNode !== THIS.container) {
				THIS.container.appendChild(p.wrap);
			}

			jsc.addClass(THIS.targetElement, jsc.pub.activeClassName);
		}


		function redrawPad () {
			// redraw the pad pointer
			var yChannel = jsc.getPadYChannel(THIS);
			var x = Math.round((THIS.channels.h / 360) * (THIS.width - 1));
			var y = Math.round((1 - THIS.channels[yChannel] / 100) * (THIS.height - 1));
			var crossOuterSize = (2 * THIS.pointerBorderWidth + THIS.pointerThickness + 2 * THIS.crossSize);
			var ofs = -Math.floor(crossOuterSize / 2);
			jsc.picker.cross.style.left = (x + ofs) + 'px';
			jsc.picker.cross.style.top = (y + ofs) + 'px';

			// redraw the slider
			switch (jsc.getSliderChannel(THIS)) {
			case 's':
				var rgb1 = jsc.HSV_RGB(THIS.channels.h, 100, THIS.channels.v);
				var rgb2 = jsc.HSV_RGB(THIS.channels.h, 0, THIS.channels.v);
				var color1 = 'rgb(' +
					Math.round(rgb1[0]) + ',' +
					Math.round(rgb1[1]) + ',' +
					Math.round(rgb1[2]) + ')';
				var color2 = 'rgb(' +
					Math.round(rgb2[0]) + ',' +
					Math.round(rgb2[1]) + ',' +
					Math.round(rgb2[2]) + ')';
				jsc.picker.sldGrad.draw(THIS.sliderSize, THIS.height, color1, color2);
				break;
			case 'v':
				var rgb = jsc.HSV_RGB(THIS.channels.h, THIS.channels.s, 100);
				var color1 = 'rgb(' +
					Math.round(rgb[0]) + ',' +
					Math.round(rgb[1]) + ',' +
					Math.round(rgb[2]) + ')';
				var color2 = '#000';
				jsc.picker.sldGrad.draw(THIS.sliderSize, THIS.height, color1, color2);
				break;
			}

			// redraw the alpha slider
			jsc.picker.asldGrad.draw(THIS.sliderSize, THIS.height, THIS.toHEXString());
		}


		function redrawSld () {
			var sldChannel = jsc.getSliderChannel(THIS);
			if (sldChannel) {
				// redraw the slider pointer
				var y = Math.round((1 - THIS.channels[sldChannel] / 100) * (THIS.height - 1));
				jsc.picker.sldPtrOB.style.top = (y - (2 * THIS.pointerBorderWidth + THIS.pointerThickness) - Math.floor(jsc.pub.sliderInnerSpace / 2)) + 'px';
			}

			// redraw the alpha slider
			jsc.picker.asldGrad.draw(THIS.sliderSize, THIS.height, THIS.toHEXString());
		}


		function redrawASld () {
			var y = Math.round((1 - THIS.channels.a) * (THIS.height - 1));
			jsc.picker.asldPtrOB.style.top = (y - (2 * THIS.pointerBorderWidth + THIS.pointerThickness) - Math.floor(jsc.pub.sliderInnerSpace / 2)) + 'px';
		}


		function isPickerOwner () {
			return jsc.picker && jsc.picker.owner === THIS;
		}


		function onValueKeyDown (ev) {
			if (jsc.eventKey(ev) === 'Enter') {
				if (THIS.valueElement) {
					THIS.processValueInput(THIS.valueElement.value);
				}
				THIS.tryHide();
			}
		}


		function onAlphaKeyDown (ev) {
			if (jsc.eventKey(ev) === 'Enter') {
				if (THIS.alphaElement) {
					THIS.processAlphaInput(THIS.alphaElement.value);
				}
				THIS.tryHide();
			}
		}


		function onValueChange (ev) {
			if (jsc.getData(ev, 'internal')) {
				return; // skip if the event was internally triggered by jscolor
			}

			var oldVal = THIS.valueElement.value;

			THIS.processValueInput(THIS.valueElement.value); // this might change the value

			jsc.triggerCallback(THIS, 'onChange');

			if (THIS.valueElement.value !== oldVal) {
				// value was additionally changed -> let's trigger the change event again, even though it was natively dispatched
				jsc.triggerInputEvent(THIS.valueElement, 'change', true, true);
			}
		}


		function onAlphaChange (ev) {
			if (jsc.getData(ev, 'internal')) {
				return; // skip if the event was internally triggered by jscolor
			}

			var oldVal = THIS.alphaElement.value;

			THIS.processAlphaInput(THIS.alphaElement.value); // this might change the value

			jsc.triggerCallback(THIS, 'onChange');

			// triggering valueElement's onChange (because changing alpha changes the entire color, e.g. with rgba format)
			jsc.triggerInputEvent(THIS.valueElement, 'change', true, true);

			if (THIS.alphaElement.value !== oldVal) {
				// value was additionally changed -> let's trigger the change event again, even though it was natively dispatched
				jsc.triggerInputEvent(THIS.alphaElement, 'change', true, true);
			}
		}


		function onValueInput (ev) {
			if (jsc.getData(ev, 'internal')) {
				return; // skip if the event was internally triggered by jscolor
			}

			if (THIS.valueElement) {
				THIS.fromString(THIS.valueElement.value, jsc.flags.leaveValue);
			}

			jsc.triggerCallback(THIS, 'onInput');

			// triggering valueElement's onInput
			// (not needed, it was dispatched normally by the browser)
		}


		function onAlphaInput (ev) {
			if (jsc.getData(ev, 'internal')) {
				return; // skip if the event was internally triggered by jscolor
			}

			if (THIS.alphaElement) {
				THIS.fromHSVA(null, null, null, parseFloat(THIS.alphaElement.value), jsc.flags.leaveAlpha);
			}

			jsc.triggerCallback(THIS, 'onInput');

			// triggering valueElement's onInput (because changing alpha changes the entire color, e.g. with rgba format)
			jsc.triggerInputEvent(THIS.valueElement, 'input', true, true);
		}


		// let's process the DEPRECATED 'options' property (this will be later removed)
		if (jsc.pub.options) {
			// let's set custom default options, if specified
			for (var opt in jsc.pub.options) {
				if (jsc.pub.options.hasOwnProperty(opt)) {
					try {
						setOption(opt, jsc.pub.options[opt]);
					} catch (e) {
						console.warn(e);
					}
				}
			}
		}


		// let's apply configuration presets
		//
		var presetsArr = [];

		if (opts.preset) {
			if (typeof opts.preset === 'string') {
				presetsArr = opts.preset.split(/\s+/);
			} else if (Array.isArray(opts.preset)) {
				presetsArr = opts.preset.slice(); // slice() to clone
			} else {
				console.warn('Unrecognized preset value');
			}
		}

		// always use the 'default' preset. If it's not listed, append it to the end.
		if (presetsArr.indexOf('default') === -1) {
			presetsArr.push('default');
		}

		// let's apply the presets in reverse order, so that should there be any overlapping options,
		// the formerly listed preset will override the latter
		for (var i = presetsArr.length - 1; i >= 0; i -= 1) {
			var pres = presetsArr[i];
			if (!pres) {
				continue; // preset is empty string
			}
			if (!jsc.pub.presets.hasOwnProperty(pres)) {
				console.warn('Unknown preset: %s', pres);
				continue;
			}
			for (var opt in jsc.pub.presets[pres]) {
				if (jsc.pub.presets[pres].hasOwnProperty(opt)) {
					try {
						setOption(opt, jsc.pub.presets[pres][opt]);
					} catch (e) {
						console.warn(e);
					}
				}
			}
		}


		// let's set specific options for this color picker
		var nonProperties = [
			// these options won't be set as instance properties
			'preset',
		];
		for (var opt in opts) {
			if (opts.hasOwnProperty(opt)) {
				if (nonProperties.indexOf(opt) === -1) {
					try {
						setOption(opt, opts[opt]);
					} catch (e) {
						console.warn(e);
					}
				}
			}
		}


		//
		// Install the color picker on chosen element(s)
		//


		// Determine picker's container element
		if (this.container === undefined) {
			this.container = window.document.body; // default container is BODY element

		} else { // explicitly set to custom element
			this.container = jsc.node(this.container);
		}

		if (!this.container) {
			throw new Error('Cannot instantiate color picker without a container element');
		}


		// Fetch the target element
		this.targetElement = jsc.node(targetElement);

		if (!this.targetElement) {
			// temporarily customized error message to help with migrating from versions prior to 2.2
			if (typeof targetElement === 'string' && /^[a-zA-Z][\w:.-]*$/.test(targetElement)) {
				// targetElement looks like valid ID
				var possiblyId = targetElement;
				throw new Error('If \'' + possiblyId + '\' is supposed to be an ID, please use \'#' + possiblyId + '\' or any valid CSS selector.');
			}

			throw new Error('Cannot instantiate color picker without a target element');
		}

		if (this.targetElement.jscolor && this.targetElement.jscolor instanceof jsc.pub) {
			throw new Error('Color picker already installed on this element');
		}


		// link this instance with the target element
		this.targetElement.jscolor = this;
		jsc.addClass(this.targetElement, jsc.pub.className);

		// register this instance
		jsc.instances.push(this);


		// if target is BUTTON
		if (jsc.isButton(this.targetElement)) {

			if (this.targetElement.type.toLowerCase() !== 'button') {
				// on buttons, always force type to be 'button', e.g. in situations the target <button> has no type
				// and thus defaults to 'submit' and would submit the form when clicked
				this.targetElement.type = 'button';
			}

			if (jsc.isButtonEmpty(this.targetElement)) { // empty button
				// it is important to clear element's contents first.
				// if we're re-instantiating color pickers on DOM that has been modified by changing page's innerHTML,
				// we would keep adding more non-breaking spaces to element's content (because element's contents survive
				// innerHTML changes, but picker instances don't)
				jsc.removeChildren(this.targetElement);

				// let's insert a non-breaking space
				this.targetElement.appendChild(window.document.createTextNode('\xa0'));

				// set min-width = previewSize, if not already greater
				var compStyle = jsc.getCompStyle(this.targetElement);
				var currMinWidth = parseFloat(compStyle['min-width']) || 0;
				if (currMinWidth < this.previewSize) {
					jsc.setStyle(this.targetElement, {
						'min-width': this.previewSize + 'px',
					}, this.forceStyle);
				}
			}
		}

		// Determine the value element
		if (this.valueElement === undefined) {
			if (jsc.isTextInput(this.targetElement)) {
				// for text inputs, default valueElement is targetElement
				this.valueElement = this.targetElement;
			} else {
				// leave it undefined
			}

		} else if (this.valueElement === null) { // explicitly set to null
			// leave it null

		} else { // explicitly set to custom element
			this.valueElement = jsc.node(this.valueElement);
		}

		// Determine the alpha element
		if (this.alphaElement) {
			this.alphaElement = jsc.node(this.alphaElement);
		}

		// Determine the preview element
		if (this.previewElement === undefined) {
			this.previewElement = this.targetElement; // default previewElement is targetElement

		} else if (this.previewElement === null) { // explicitly set to null
			// leave it null

		} else { // explicitly set to custom element
			this.previewElement = jsc.node(this.previewElement);
		}

		// valueElement
		if (this.valueElement && jsc.isTextInput(this.valueElement)) {

			// If the value element has onInput event already set, we need to detach it and attach AFTER our listener.
			// otherwise the picker instance would still contain the old color when accessed from the onInput handler.
			var valueElementOrigEvents = {
				onInput: this.valueElement.oninput
			};
			this.valueElement.oninput = null;

			this.valueElement.addEventListener('keydown', onValueKeyDown, false);
			this.valueElement.addEventListener('change', onValueChange, false);
			this.valueElement.addEventListener('input', onValueInput, false);
			// the original event listener must be attached AFTER our handler (to let it first set picker's color)
			if (valueElementOrigEvents.onInput) {
				this.valueElement.addEventListener('input', valueElementOrigEvents.onInput, false);
			}

			this.valueElement.setAttribute('autocomplete', 'off');
			this.valueElement.setAttribute('autocorrect', 'off');
			this.valueElement.setAttribute('autocapitalize', 'off');
			this.valueElement.setAttribute('spellcheck', false);
		}

		// alphaElement
		if (this.alphaElement && jsc.isTextInput(this.alphaElement)) {
			this.alphaElement.addEventListener('keydown', onAlphaKeyDown, false);
			this.alphaElement.addEventListener('change', onAlphaChange, false);
			this.alphaElement.addEventListener('input', onAlphaInput, false);

			this.alphaElement.setAttribute('autocomplete', 'off');
			this.alphaElement.setAttribute('autocorrect', 'off');
			this.alphaElement.setAttribute('autocapitalize', 'off');
			this.alphaElement.setAttribute('spellcheck', false);
		}

		// determine initial color value
		//
		var initValue = 'FFFFFF';

		if (this.value !== undefined) {
			initValue = this.value; // get initial color from the 'value' property
		} else if (this.valueElement && this.valueElement.value !== undefined) {
			initValue = this.valueElement.value; // get initial color from valueElement's value
		}

		// determine initial alpha value
		//
		var initAlpha = undefined;

		if (this.alpha !== undefined) {
			initAlpha = (''+this.alpha); // get initial alpha value from the 'alpha' property
		} else if (this.alphaElement && this.alphaElement.value !== undefined) {
			initAlpha = this.alphaElement.value; // get initial color from alphaElement's value
		}

		// determine current format based on the initial color value
		//
		this._currentFormat = null;

		if (['auto', 'any'].indexOf(this.format.toLowerCase()) > -1) {
			// format is 'auto' or 'any' -> let's auto-detect current format
			var color = jsc.parseColorString(initValue);
			this._currentFormat = color ? color.format : 'hex';
		} else {
			// format is specified
			this._currentFormat = this.format.toLowerCase();
		}


		// let's parse the initial color value and expose color's preview
		this.processValueInput(initValue);

		// let's also parse and expose the initial alpha value, if any
		//
		// Note: If the initial color value contains alpha value in it (e.g. in rgba format),
		// this will overwrite it. So we should only process alpha input if there was initial
		// alpha explicitly set, otherwise we could needlessly lose initial value's alpha
		if (initAlpha !== undefined) {
			this.processAlphaInput(initAlpha);
		}

		if (this.random) {
			// randomize the initial color value
			this.randomize.apply(this, Array.isArray(this.random) ? this.random : []);
		}

	}

};


//================================
// Public properties and methods
//================================

//
// These will be publicly available via jscolor.<name> and JSColor.<name>
//


// class that will be set to elements having jscolor installed on them
jsc.pub.className = 'jscolor';


// class that will be set to elements having jscolor active on them
jsc.pub.activeClassName = 'jscolor-active';


// whether to try to parse the options string by evaluating it using 'new Function()'
// in case it could not be parsed with JSON.parse()
jsc.pub.looseJSON = true;


// presets
jsc.pub.presets = {};

// built-in presets
jsc.pub.presets['default'] = {}; // baseline for customization

jsc.pub.presets['light'] = { // default color scheme
	backgroundColor: 'rgba(255,255,255,1)',
	controlBorderColor: 'rgba(187,187,187,1)',
	buttonColor: 'rgba(0,0,0,1)',
};
jsc.pub.presets['dark'] = {
	backgroundColor: 'rgba(51,51,51,1)',
	controlBorderColor: 'rgba(153,153,153,1)',
	buttonColor: 'rgba(240,240,240,1)',
};

jsc.pub.presets['small'] = { width:101, height:101, padding:10, sliderSize:14, paletteCols:8 };
jsc.pub.presets['medium'] = { width:181, height:101, padding:12, sliderSize:16, paletteCols:10 }; // default size
jsc.pub.presets['large'] = { width:271, height:151, padding:12, sliderSize:24, paletteCols:15 };

jsc.pub.presets['thin'] = { borderWidth:1, controlBorderWidth:1, pointerBorderWidth:1 }; // default thickness
jsc.pub.presets['thick'] = { borderWidth:2, controlBorderWidth:2, pointerBorderWidth:2 };


// size of space in the sliders
jsc.pub.sliderInnerSpace = 3; // px

// transparency chessboard
jsc.pub.chessboardSize = 8; // px
jsc.pub.chessboardColor1 = '#666666';
jsc.pub.chessboardColor2 = '#999999';

// preview separator
jsc.pub.previewSeparator = ['rgba(255,255,255,.65)', 'rgba(128,128,128,.65)'];


// Initializes jscolor
jsc.pub.init = function () {
	if (jsc.initialized) {
		return;
	}

	// attach some necessary handlers
	window.document.addEventListener('mousedown', jsc.onDocumentMouseDown, false);
	window.document.addEventListener('keyup', jsc.onDocumentKeyUp, false);
	window.addEventListener('resize', jsc.onWindowResize, false);
	window.addEventListener('scroll', jsc.onWindowScroll, false);

	// append default CSS to HEAD
	jsc.appendDefaultCss();

	// install jscolor on current DOM
	jsc.pub.install();

	jsc.initialized = true;

	// call functions waiting in the queue
	while (jsc.readyQueue.length) {
		var func = jsc.readyQueue.shift();
		func();
	}
};


// Installs jscolor on current DOM tree
jsc.pub.install = function (rootNode) {
	var success = true;

	try {
		jsc.installBySelector('[data-jscolor]', rootNode);
	} catch (e) {
		success = false;
		console.warn(e);
	}

	// for backward compatibility with DEPRECATED installation using class name
	if (jsc.pub.lookupClass) {
		try {
			jsc.installBySelector(
				(
					'input.' + jsc.pub.lookupClass + ', ' +
					'button.' + jsc.pub.lookupClass
				),
				rootNode
			);
		} catch (e) {}
	}

	return success;
};


// Registers function to be called as soon as jscolor is initialized (or immediately, if it already is).
//
jsc.pub.ready = function (func) {
	if (typeof func !== 'function') {
		console.warn('Passed value is not a function');
		return false;
	}

	if (jsc.initialized) {
		func();
	} else {
		jsc.readyQueue.push(func);
	}
	return true;
};


// Triggers given input event(s) (e.g. 'input' or 'change') on all color pickers.
//
// It is possible to specify multiple events separated with a space.
// If called before jscolor is initialized, then the events will be triggered after initialization.
//
jsc.pub.trigger = function (eventNames) {
	var triggerNow = function () {
		jsc.triggerGlobal(eventNames);
	};

	if (jsc.initialized) {
		triggerNow();
	} else {
		jsc.pub.ready(triggerNow);
	}
};


// Hides current color picker box
jsc.pub.hide = function () {
	if (jsc.picker && jsc.picker.owner) {
		jsc.picker.owner.hide();
	}
};


// Returns a data URL of a gray chessboard image that indicates transparency
jsc.pub.chessboard = function (color) {
	if (!color) {
		color = 'rgba(0,0,0,0)';
	}
	var preview = jsc.genColorPreviewCanvas(color);
	return preview.canvas.toDataURL();
};


// Returns a data URL of a gray chessboard image that indicates transparency
jsc.pub.background = function (color) {
	var backgrounds = [];

	// CSS gradient for background color preview
	backgrounds.push(jsc.genColorPreviewGradient(color));

	// data URL of generated PNG image with a gray transparency chessboard
	var preview = jsc.genColorPreviewCanvas();
	backgrounds.push([
		'url(\'' + preview.canvas.toDataURL() + '\')',
		'left top',
		'repeat',
	].join(' '));

	return backgrounds.join(', ');
};


//
// DEPRECATED properties and methods
//


// DEPRECATED. Use jscolor.presets.default instead.
//
// Custom default options for all color pickers, e.g. { hash: true, width: 300 }
jsc.pub.options = {};


// DEPRECATED. Use data-jscolor attribute instead, which installs jscolor on given element.
//
// By default, we'll search for all elements with class="jscolor" and install a color picker on them.
//
// You can change what class name will be looked for by setting the property jscolor.lookupClass
// anywhere in your HTML document. To completely disable the automatic lookup, set it to null.
//
jsc.pub.lookupClass = 'jscolor';


// DEPRECATED. Use data-jscolor attribute instead, which installs jscolor on given element.
//
// Install jscolor on all elements that have the specified class name
jsc.pub.installByClassName = function () {
	console.error('jscolor.installByClassName() is DEPRECATED. Use data-jscolor="" attribute instead of a class name.' + jsc.docsRef);
	return false;
};


jsc.register();


return jsc.pub;


})(); // END jscolor


if (typeof window.jscolor === 'undefined') {
	window.jscolor = window.JSColor = jscolor;
}


// END jscolor code

return jscolor;

}); // END factory


/***/ }),

/***/ "./node_modules/@simonwep/pickr/dist/pickr.min.js":
/*!********************************************************!*\
  !*** ./node_modules/@simonwep/pickr/dist/pickr.min.js ***!
  \********************************************************/
/***/ ((module) => {

/*! Pickr 1.8.2 MIT | https://github.com/Simonwep/pickr */
!function(t,e){ true?module.exports=e():0}(self,(function(){return(()=>{"use strict";var t={d:(e,o)=>{for(var n in o)t.o(o,n)&&!t.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:o[n]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};t.d(e,{default:()=>L});var o={};function n(t,e,o,n,i={}){e instanceof HTMLCollection||e instanceof NodeList?e=Array.from(e):Array.isArray(e)||(e=[e]),Array.isArray(o)||(o=[o]);for(const s of e)for(const e of o)s[t](e,n,{capture:!1,...i});return Array.prototype.slice.call(arguments,1)}t.r(o),t.d(o,{adjustableInputNumbers:()=>p,createElementFromString:()=>r,createFromTemplate:()=>a,eventPath:()=>l,off:()=>s,on:()=>i,resolveElement:()=>c});const i=n.bind(null,"addEventListener"),s=n.bind(null,"removeEventListener");function r(t){const e=document.createElement("div");return e.innerHTML=t.trim(),e.firstElementChild}function a(t){const e=(t,e)=>{const o=t.getAttribute(e);return t.removeAttribute(e),o},o=(t,n={})=>{const i=e(t,":obj"),s=e(t,":ref"),r=i?n[i]={}:n;s&&(n[s]=t);for(const n of Array.from(t.children)){const t=e(n,":arr"),i=o(n,t?{}:r);t&&(r[t]||(r[t]=[])).push(Object.keys(i).length?i:n)}return n};return o(r(t))}function l(t){let e=t.path||t.composedPath&&t.composedPath();if(e)return e;let o=t.target.parentElement;for(e=[t.target,o];o=o.parentElement;)e.push(o);return e.push(document,window),e}function c(t){return t instanceof Element?t:"string"==typeof t?t.split(/>>/g).reduce(((t,e,o,n)=>(t=t.querySelector(e),o<n.length-1?t.shadowRoot:t)),document):null}function p(t,e=(t=>t)){function o(o){const n=[.001,.01,.1][Number(o.shiftKey||2*o.ctrlKey)]*(o.deltaY<0?1:-1);let i=0,s=t.selectionStart;t.value=t.value.replace(/[\d.]+/g,((t,o)=>o<=s&&o+t.length>=s?(s=o,e(Number(t),n,i)):(i++,t))),t.focus(),t.setSelectionRange(s,s),o.preventDefault(),t.dispatchEvent(new Event("input"))}i(t,"focus",(()=>i(window,"wheel",o,{passive:!1}))),i(t,"blur",(()=>s(window,"wheel",o)))}const{min:u,max:h,floor:d,round:m}=Math;function f(t,e,o){e/=100,o/=100;const n=d(t=t/360*6),i=t-n,s=o*(1-e),r=o*(1-i*e),a=o*(1-(1-i)*e),l=n%6;return[255*[o,r,s,s,a,o][l],255*[a,o,o,r,s,s][l],255*[s,s,a,o,o,r][l]]}function v(t,e,o){const n=(2-(e/=100))*(o/=100)/2;return 0!==n&&(e=1===n?0:n<.5?e*o/(2*n):e*o/(2-2*n)),[t,100*e,100*n]}function b(t,e,o){const n=u(t/=255,e/=255,o/=255),i=h(t,e,o),s=i-n;let r,a;if(0===s)r=a=0;else{a=s/i;const n=((i-t)/6+s/2)/s,l=((i-e)/6+s/2)/s,c=((i-o)/6+s/2)/s;t===i?r=c-l:e===i?r=1/3+n-c:o===i&&(r=2/3+l-n),r<0?r+=1:r>1&&(r-=1)}return[360*r,100*a,100*i]}function y(t,e,o,n){e/=100,o/=100;return[...b(255*(1-u(1,(t/=100)*(1-(n/=100))+n)),255*(1-u(1,e*(1-n)+n)),255*(1-u(1,o*(1-n)+n)))]}function g(t,e,o){e/=100;const n=2*(e*=(o/=100)<.5?o:1-o)/(o+e)*100,i=100*(o+e);return[t,isNaN(n)?0:n,i]}function _(t){return b(...t.match(/.{2}/g).map((t=>parseInt(t,16))))}function w(t){t=t.match(/^[a-zA-Z]+$/)?function(t){if("black"===t.toLowerCase())return"#000";const e=document.createElement("canvas").getContext("2d");return e.fillStyle=t,"#000"===e.fillStyle?null:e.fillStyle}(t):t;const e={cmyk:/^cmyk[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)/i,rgba:/^((rgba)|rgb)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i,hsla:/^((hsla)|hsl)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i,hsva:/^((hsva)|hsv)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i,hexa:/^#?(([\dA-Fa-f]{3,4})|([\dA-Fa-f]{6})|([\dA-Fa-f]{8}))$/i},o=t=>t.map((t=>/^(|\d+)\.\d+|\d+$/.test(t)?Number(t):void 0));let n;t:for(const i in e){if(!(n=e[i].exec(t)))continue;const s=t=>!!n[2]==("number"==typeof t);switch(i){case"cmyk":{const[,t,e,s,r]=o(n);if(t>100||e>100||s>100||r>100)break t;return{values:y(t,e,s,r),type:i}}case"rgba":{const[,,,t,e,r,a]=o(n);if(t>255||e>255||r>255||a<0||a>1||!s(a))break t;return{values:[...b(t,e,r),a],a,type:i}}case"hexa":{let[,t]=n;4!==t.length&&3!==t.length||(t=t.split("").map((t=>t+t)).join(""));const e=t.substring(0,6);let o=t.substring(6);return o=o?parseInt(o,16)/255:void 0,{values:[..._(e),o],a:o,type:i}}case"hsla":{const[,,,t,e,r,a]=o(n);if(t>360||e>100||r>100||a<0||a>1||!s(a))break t;return{values:[...g(t,e,r),a],a,type:i}}case"hsva":{const[,,,t,e,r,a]=o(n);if(t>360||e>100||r>100||a<0||a>1||!s(a))break t;return{values:[t,e,r,a],a,type:i}}}}return{values:null,type:null}}function A(t=0,e=0,o=0,n=1){const i=(t,e)=>(o=-1)=>e(~o?t.map((t=>Number(t.toFixed(o)))):t),s={h:t,s:e,v:o,a:n,toHSVA(){const t=[s.h,s.s,s.v,s.a];return t.toString=i(t,(t=>`hsva(${t[0]}, ${t[1]}%, ${t[2]}%, ${s.a})`)),t},toHSLA(){const t=[...v(s.h,s.s,s.v),s.a];return t.toString=i(t,(t=>`hsla(${t[0]}, ${t[1]}%, ${t[2]}%, ${s.a})`)),t},toRGBA(){const t=[...f(s.h,s.s,s.v),s.a];return t.toString=i(t,(t=>`rgba(${t[0]}, ${t[1]}, ${t[2]}, ${s.a})`)),t},toCMYK(){const t=function(t,e,o){const n=f(t,e,o),i=n[0]/255,s=n[1]/255,r=n[2]/255,a=u(1-i,1-s,1-r);return[100*(1===a?0:(1-i-a)/(1-a)),100*(1===a?0:(1-s-a)/(1-a)),100*(1===a?0:(1-r-a)/(1-a)),100*a]}(s.h,s.s,s.v);return t.toString=i(t,(t=>`cmyk(${t[0]}%, ${t[1]}%, ${t[2]}%, ${t[3]}%)`)),t},toHEXA(){const t=function(t,e,o){return f(t,e,o).map((t=>m(t).toString(16).padStart(2,"0")))}(s.h,s.s,s.v),e=s.a>=1?"":Number((255*s.a).toFixed(0)).toString(16).toUpperCase().padStart(2,"0");return e&&t.push(e),t.toString=()=>`#${t.join("").toUpperCase()}`,t},clone:()=>A(s.h,s.s,s.v,s.a)};return s}const C=t=>Math.max(Math.min(t,1),0);function $(t){const e={options:Object.assign({lock:null,onchange:()=>0,onstop:()=>0},t),_keyboard(t){const{options:o}=e,{type:n,key:i}=t;if(document.activeElement===o.wrapper){const{lock:o}=e.options,s="ArrowUp"===i,r="ArrowRight"===i,a="ArrowDown"===i,l="ArrowLeft"===i;if("keydown"===n&&(s||r||a||l)){let n=0,i=0;"v"===o?n=s||r?1:-1:"h"===o?n=s||r?-1:1:(i=s?-1:a?1:0,n=l?-1:r?1:0),e.update(C(e.cache.x+.01*n),C(e.cache.y+.01*i)),t.preventDefault()}else i.startsWith("Arrow")&&(e.options.onstop(),t.preventDefault())}},_tapstart(t){i(document,["mouseup","touchend","touchcancel"],e._tapstop),i(document,["mousemove","touchmove"],e._tapmove),t.cancelable&&t.preventDefault(),e._tapmove(t)},_tapmove(t){const{options:o,cache:n}=e,{lock:i,element:s,wrapper:r}=o,a=r.getBoundingClientRect();let l=0,c=0;if(t){const e=t&&t.touches&&t.touches[0];l=t?(e||t).clientX:0,c=t?(e||t).clientY:0,l<a.left?l=a.left:l>a.left+a.width&&(l=a.left+a.width),c<a.top?c=a.top:c>a.top+a.height&&(c=a.top+a.height),l-=a.left,c-=a.top}else n&&(l=n.x*a.width,c=n.y*a.height);"h"!==i&&(s.style.left=`calc(${l/a.width*100}% - ${s.offsetWidth/2}px)`),"v"!==i&&(s.style.top=`calc(${c/a.height*100}% - ${s.offsetHeight/2}px)`),e.cache={x:l/a.width,y:c/a.height};const p=C(l/a.width),u=C(c/a.height);switch(i){case"v":return o.onchange(p);case"h":return o.onchange(u);default:return o.onchange(p,u)}},_tapstop(){e.options.onstop(),s(document,["mouseup","touchend","touchcancel"],e._tapstop),s(document,["mousemove","touchmove"],e._tapmove)},trigger(){e._tapmove()},update(t=0,o=0){const{left:n,top:i,width:s,height:r}=e.options.wrapper.getBoundingClientRect();"h"===e.options.lock&&(o=t),e._tapmove({clientX:n+s*t,clientY:i+r*o})},destroy(){const{options:t,_tapstart:o,_keyboard:n}=e;s(document,["keydown","keyup"],n),s([t.wrapper,t.element],"mousedown",o),s([t.wrapper,t.element],"touchstart",o,{passive:!1})}},{options:o,_tapstart:n,_keyboard:r}=e;return i([o.wrapper,o.element],"mousedown",n),i([o.wrapper,o.element],"touchstart",n,{passive:!1}),i(document,["keydown","keyup"],r),e}function k(t={}){t=Object.assign({onchange:()=>0,className:"",elements:[]},t);const e=i(t.elements,"click",(e=>{t.elements.forEach((o=>o.classList[e.target===o?"add":"remove"](t.className))),t.onchange(e),e.stopPropagation()}));return{destroy:()=>s(...e)}}const S={variantFlipOrder:{start:"sme",middle:"mse",end:"ems"},positionFlipOrder:{top:"tbrl",right:"rltb",bottom:"btrl",left:"lrbt"},position:"bottom",margin:8},O=(t,e,o)=>{const{container:n,margin:i,position:s,variantFlipOrder:r,positionFlipOrder:a}={container:document.documentElement.getBoundingClientRect(),...S,...o},{left:l,top:c}=e.style;e.style.left="0",e.style.top="0";const p=t.getBoundingClientRect(),u=e.getBoundingClientRect(),h={t:p.top-u.height-i,b:p.bottom+i,r:p.right+i,l:p.left-u.width-i},d={vs:p.left,vm:p.left+p.width/2+-u.width/2,ve:p.left+p.width-u.width,hs:p.top,hm:p.bottom-p.height/2-u.height/2,he:p.bottom-u.height},[m,f="middle"]=s.split("-"),v=a[m],b=r[f],{top:y,left:g,bottom:_,right:w}=n;for(const t of v){const o="t"===t||"b"===t,n=h[t],[i,s]=o?["top","left"]:["left","top"],[r,a]=o?[u.height,u.width]:[u.width,u.height],[l,c]=o?[_,w]:[w,_],[p,m]=o?[y,g]:[g,y];if(!(n<p||n+r>l))for(const r of b){const l=d[(o?"v":"h")+r];if(!(l<m||l+a>c))return e.style[s]=l-u[s]+"px",e.style[i]=n-u[i]+"px",t+r}}return e.style.left=l,e.style.top=c,null};function E(t,e,o){return e in t?Object.defineProperty(t,e,{value:o,enumerable:!0,configurable:!0,writable:!0}):t[e]=o,t}class L{constructor(t){E(this,"_initializingActive",!0),E(this,"_recalc",!0),E(this,"_nanopop",null),E(this,"_root",null),E(this,"_color",A()),E(this,"_lastColor",A()),E(this,"_swatchColors",[]),E(this,"_setupAnimationFrame",null),E(this,"_eventListener",{init:[],save:[],hide:[],show:[],clear:[],change:[],changestop:[],cancel:[],swatchselect:[]}),this.options=t=Object.assign({...L.DEFAULT_OPTIONS},t);const{swatches:e,components:o,theme:n,sliders:i,lockOpacity:s,padding:r}=t;["nano","monolith"].includes(n)&&!i&&(t.sliders="h"),o.interaction||(o.interaction={});const{preview:a,opacity:l,hue:c,palette:p}=o;o.opacity=!s&&l,o.palette=p||a||l||c,this._preBuild(),this._buildComponents(),this._bindEvents(),this._finalBuild(),e&&e.length&&e.forEach((t=>this.addSwatch(t)));const{button:u,app:h}=this._root;this._nanopop=((t,e,o)=>{const n="object"!=typeof t||t instanceof HTMLElement?{reference:t,popper:e,...o}:t;return{update(t=n){const{reference:e,popper:o}=Object.assign(n,t);if(!o||!e)throw new Error("Popper- or reference-element missing.");return O(e,o,n)}}})(u,h,{margin:r}),u.setAttribute("role","button"),u.setAttribute("aria-label",this._t("btn:toggle"));const d=this;this._setupAnimationFrame=requestAnimationFrame((function e(){if(!h.offsetWidth)return requestAnimationFrame(e);d.setColor(t.default),d._rePositioningPicker(),t.defaultRepresentation&&(d._representation=t.defaultRepresentation,d.setColorRepresentation(d._representation)),t.showAlways&&d.show(),d._initializingActive=!1,d._emit("init")}))}_preBuild(){const{options:t}=this;for(const e of["el","container"])t[e]=c(t[e]);this._root=(t=>{const{components:e,useAsButton:o,inline:n,appClass:i,theme:s,lockOpacity:r}=t.options,l=t=>t?"":'style="display:none" hidden',c=e=>t._t(e),p=a(`\n      <div :ref="root" class="pickr">\n\n        ${o?"":'<button type="button" :ref="button" class="pcr-button"></button>'}\n\n        <div :ref="app" class="pcr-app ${i||""}" data-theme="${s}" ${n?'style="position: unset"':""} aria-label="${c("ui:dialog")}" role="window">\n          <div class="pcr-selection" ${l(e.palette)}>\n            <div :obj="preview" class="pcr-color-preview" ${l(e.preview)}>\n              <button type="button" :ref="lastColor" class="pcr-last-color" aria-label="${c("btn:last-color")}"></button>\n              <div :ref="currentColor" class="pcr-current-color"></div>\n            </div>\n\n            <div :obj="palette" class="pcr-color-palette">\n              <div :ref="picker" class="pcr-picker"></div>\n              <div :ref="palette" class="pcr-palette" tabindex="0" aria-label="${c("aria:palette")}" role="listbox"></div>\n            </div>\n\n            <div :obj="hue" class="pcr-color-chooser" ${l(e.hue)}>\n              <div :ref="picker" class="pcr-picker"></div>\n              <div :ref="slider" class="pcr-hue pcr-slider" tabindex="0" aria-label="${c("aria:hue")}" role="slider"></div>\n            </div>\n\n            <div :obj="opacity" class="pcr-color-opacity" ${l(e.opacity)}>\n              <div :ref="picker" class="pcr-picker"></div>\n              <div :ref="slider" class="pcr-opacity pcr-slider" tabindex="0" aria-label="${c("aria:opacity")}" role="slider"></div>\n            </div>\n          </div>\n\n          <div class="pcr-swatches ${e.palette?"":"pcr-last"}" :ref="swatches"></div>\n\n          <div :obj="interaction" class="pcr-interaction" ${l(Object.keys(e.interaction).length)}>\n            <input :ref="result" class="pcr-result" type="text" spellcheck="false" ${l(e.interaction.input)} aria-label="${c("aria:input")}">\n\n            <input :arr="options" class="pcr-type" data-type="HEXA" value="${r?"HEX":"HEXA"}" type="button" ${l(e.interaction.hex)}>\n            <input :arr="options" class="pcr-type" data-type="RGBA" value="${r?"RGB":"RGBA"}" type="button" ${l(e.interaction.rgba)}>\n            <input :arr="options" class="pcr-type" data-type="HSLA" value="${r?"HSL":"HSLA"}" type="button" ${l(e.interaction.hsla)}>\n            <input :arr="options" class="pcr-type" data-type="HSVA" value="${r?"HSV":"HSVA"}" type="button" ${l(e.interaction.hsva)}>\n            <input :arr="options" class="pcr-type" data-type="CMYK" value="CMYK" type="button" ${l(e.interaction.cmyk)}>\n\n            <input :ref="save" class="pcr-save" value="${c("btn:save")}" type="button" ${l(e.interaction.save)} aria-label="${c("aria:btn:save")}">\n            <input :ref="cancel" class="pcr-cancel" value="${c("btn:cancel")}" type="button" ${l(e.interaction.cancel)} aria-label="${c("aria:btn:cancel")}">\n            <input :ref="clear" class="pcr-clear" value="${c("btn:clear")}" type="button" ${l(e.interaction.clear)} aria-label="${c("aria:btn:clear")}">\n          </div>\n        </div>\n      </div>\n    `),u=p.interaction;return u.options.find((t=>!t.hidden&&!t.classList.add("active"))),u.type=()=>u.options.find((t=>t.classList.contains("active"))),p})(this),t.useAsButton&&(this._root.button=t.el),t.container.appendChild(this._root.root)}_finalBuild(){const t=this.options,e=this._root;if(t.container.removeChild(e.root),t.inline){const o=t.el.parentElement;t.el.nextSibling?o.insertBefore(e.app,t.el.nextSibling):o.appendChild(e.app)}else t.container.appendChild(e.app);t.useAsButton?t.inline&&t.el.remove():t.el.parentNode.replaceChild(e.root,t.el),t.disabled&&this.disable(),t.comparison||(e.button.style.transition="none",t.useAsButton||(e.preview.lastColor.style.transition="none")),this.hide()}_buildComponents(){const t=this,e=this.options.components,o=(t.options.sliders||"v").repeat(2),[n,i]=o.match(/^[vh]+$/g)?o:[],s=()=>this._color||(this._color=this._lastColor.clone()),r={palette:$({element:t._root.palette.picker,wrapper:t._root.palette.palette,onstop:()=>t._emit("changestop","slider",t),onchange(o,n){if(!e.palette)return;const i=s(),{_root:r,options:a}=t,{lastColor:l,currentColor:c}=r.preview;t._recalc&&(i.s=100*o,i.v=100-100*n,i.v<0&&(i.v=0),t._updateOutput("slider"));const p=i.toRGBA().toString(0);this.element.style.background=p,this.wrapper.style.background=`\n                        linear-gradient(to top, rgba(0, 0, 0, ${i.a}), transparent),\n                        linear-gradient(to left, hsla(${i.h}, 100%, 50%, ${i.a}), rgba(255, 255, 255, ${i.a}))\n                    `,a.comparison?a.useAsButton||t._lastColor||l.style.setProperty("--pcr-color",p):(r.button.style.setProperty("--pcr-color",p),r.button.classList.remove("clear"));const u=i.toHEXA().toString();for(const{el:e,color:o}of t._swatchColors)e.classList[u===o.toHEXA().toString()?"add":"remove"]("pcr-active");c.style.setProperty("--pcr-color",p)}}),hue:$({lock:"v"===i?"h":"v",element:t._root.hue.picker,wrapper:t._root.hue.slider,onstop:()=>t._emit("changestop","slider",t),onchange(o){if(!e.hue||!e.palette)return;const n=s();t._recalc&&(n.h=360*o),this.element.style.backgroundColor=`hsl(${n.h}, 100%, 50%)`,r.palette.trigger()}}),opacity:$({lock:"v"===n?"h":"v",element:t._root.opacity.picker,wrapper:t._root.opacity.slider,onstop:()=>t._emit("changestop","slider",t),onchange(o){if(!e.opacity||!e.palette)return;const n=s();t._recalc&&(n.a=Math.round(100*o)/100),this.element.style.background=`rgba(0, 0, 0, ${n.a})`,r.palette.trigger()}}),selectable:k({elements:t._root.interaction.options,className:"active",onchange(e){t._representation=e.target.getAttribute("data-type").toUpperCase(),t._recalc&&t._updateOutput("swatch")}})};this._components=r}_bindEvents(){const{_root:t,options:e}=this,o=[i(t.interaction.clear,"click",(()=>this._clearColor())),i([t.interaction.cancel,t.preview.lastColor],"click",(()=>{this.setHSVA(...(this._lastColor||this._color).toHSVA(),!0),this._emit("cancel")})),i(t.interaction.save,"click",(()=>{!this.applyColor()&&!e.showAlways&&this.hide()})),i(t.interaction.result,["keyup","input"],(t=>{this.setColor(t.target.value,!0)&&!this._initializingActive&&(this._emit("change",this._color,"input",this),this._emit("changestop","input",this)),t.stopImmediatePropagation()})),i(t.interaction.result,["focus","blur"],(t=>{this._recalc="blur"===t.type,this._recalc&&this._updateOutput(null)})),i([t.palette.palette,t.palette.picker,t.hue.slider,t.hue.picker,t.opacity.slider,t.opacity.picker],["mousedown","touchstart"],(()=>this._recalc=!0),{passive:!0})];if(!e.showAlways){const n=e.closeWithKey;o.push(i(t.button,"click",(()=>this.isOpen()?this.hide():this.show())),i(document,"keyup",(t=>this.isOpen()&&(t.key===n||t.code===n)&&this.hide())),i(document,["touchstart","mousedown"],(e=>{this.isOpen()&&!l(e).some((e=>e===t.app||e===t.button))&&this.hide()}),{capture:!0}))}if(e.adjustableNumbers){const e={rgba:[255,255,255,1],hsva:[360,100,100,1],hsla:[360,100,100,1],cmyk:[100,100,100,100]};p(t.interaction.result,((t,o,n)=>{const i=e[this.getColorRepresentation().toLowerCase()];if(i){const e=i[n],s=t+(e>=100?1e3*o:o);return s<=0?0:Number((s<e?s:e).toPrecision(3))}return t}))}if(e.autoReposition&&!e.inline){let t=null;const n=this;o.push(i(window,["scroll","resize"],(()=>{n.isOpen()&&(e.closeOnScroll&&n.hide(),null===t?(t=setTimeout((()=>t=null),100),requestAnimationFrame((function e(){n._rePositioningPicker(),null!==t&&requestAnimationFrame(e)}))):(clearTimeout(t),t=setTimeout((()=>t=null),100)))}),{capture:!0}))}this._eventBindings=o}_rePositioningPicker(){const{options:t}=this;if(!t.inline){if(!this._nanopop.update({container:document.body.getBoundingClientRect(),position:t.position})){const t=this._root.app,e=t.getBoundingClientRect();t.style.top=(window.innerHeight-e.height)/2+"px",t.style.left=(window.innerWidth-e.width)/2+"px"}}}_updateOutput(t){const{_root:e,_color:o,options:n}=this;if(e.interaction.type()){const t=`to${e.interaction.type().getAttribute("data-type")}`;e.interaction.result.value="function"==typeof o[t]?o[t]().toString(n.outputPrecision):""}!this._initializingActive&&this._recalc&&this._emit("change",o,t,this)}_clearColor(t=!1){const{_root:e,options:o}=this;o.useAsButton||e.button.style.setProperty("--pcr-color","rgba(0, 0, 0, 0.15)"),e.button.classList.add("clear"),o.showAlways||this.hide(),this._lastColor=null,this._initializingActive||t||(this._emit("save",null),this._emit("clear"))}_parseLocalColor(t){const{values:e,type:o,a:n}=w(t),{lockOpacity:i}=this.options,s=void 0!==n&&1!==n;return e&&3===e.length&&(e[3]=void 0),{values:!e||i&&s?null:e,type:o}}_t(t){return this.options.i18n[t]||L.I18N_DEFAULTS[t]}_emit(t,...e){this._eventListener[t].forEach((t=>t(...e,this)))}on(t,e){return this._eventListener[t].push(e),this}off(t,e){const o=this._eventListener[t]||[],n=o.indexOf(e);return~n&&o.splice(n,1),this}addSwatch(t){const{values:e}=this._parseLocalColor(t);if(e){const{_swatchColors:t,_root:o}=this,n=A(...e),s=r(`<button type="button" style="--pcr-color: ${n.toRGBA().toString(0)}" aria-label="${this._t("btn:swatch")}"/>`);return o.swatches.appendChild(s),t.push({el:s,color:n}),this._eventBindings.push(i(s,"click",(()=>{this.setHSVA(...n.toHSVA(),!0),this._emit("swatchselect",n),this._emit("change",n,"swatch",this)}))),!0}return!1}removeSwatch(t){const e=this._swatchColors[t];if(e){const{el:o}=e;return this._root.swatches.removeChild(o),this._swatchColors.splice(t,1),!0}return!1}applyColor(t=!1){const{preview:e,button:o}=this._root,n=this._color.toRGBA().toString(0);return e.lastColor.style.setProperty("--pcr-color",n),this.options.useAsButton||o.style.setProperty("--pcr-color",n),o.classList.remove("clear"),this._lastColor=this._color.clone(),this._initializingActive||t||this._emit("save",this._color),this}destroy(){cancelAnimationFrame(this._setupAnimationFrame),this._eventBindings.forEach((t=>s(...t))),Object.keys(this._components).forEach((t=>this._components[t].destroy()))}destroyAndRemove(){this.destroy();const{root:t,app:e}=this._root;t.parentElement&&t.parentElement.removeChild(t),e.parentElement.removeChild(e),Object.keys(this).forEach((t=>this[t]=null))}hide(){return!!this.isOpen()&&(this._root.app.classList.remove("visible"),this._emit("hide"),!0)}show(){return!this.options.disabled&&!this.isOpen()&&(this._root.app.classList.add("visible"),this._rePositioningPicker(),this._emit("show",this._color),this)}isOpen(){return this._root.app.classList.contains("visible")}setHSVA(t=360,e=0,o=0,n=1,i=!1){const s=this._recalc;if(this._recalc=!1,t<0||t>360||e<0||e>100||o<0||o>100||n<0||n>1)return!1;this._color=A(t,e,o,n);const{hue:r,opacity:a,palette:l}=this._components;return r.update(t/360),a.update(n),l.update(e/100,1-o/100),i||this.applyColor(),s&&this._updateOutput(),this._recalc=s,!0}setColor(t,e=!1){if(null===t)return this._clearColor(e),!0;const{values:o,type:n}=this._parseLocalColor(t);if(o){const t=n.toUpperCase(),{options:i}=this._root.interaction,s=i.find((e=>e.getAttribute("data-type")===t));if(s&&!s.hidden)for(const t of i)t.classList[t===s?"add":"remove"]("active");return!!this.setHSVA(...o,e)&&this.setColorRepresentation(t)}return!1}setColorRepresentation(t){return t=t.toUpperCase(),!!this._root.interaction.options.find((e=>e.getAttribute("data-type").startsWith(t)&&!e.click()))}getColorRepresentation(){return this._representation}getColor(){return this._color}getSelectedColor(){return this._lastColor}getRoot(){return this._root}disable(){return this.hide(),this.options.disabled=!0,this._root.button.classList.add("disabled"),this}enable(){return this.options.disabled=!1,this._root.button.classList.remove("disabled"),this}}return E(L,"utils",o),E(L,"version","1.8.2"),E(L,"I18N_DEFAULTS",{"ui:dialog":"color picker dialog","btn:toggle":"toggle color picker dialog","btn:swatch":"color swatch","btn:last-color":"use previous color","btn:save":"Save","btn:cancel":"Cancel","btn:clear":"Clear","aria:btn:save":"save and close","aria:btn:cancel":"cancel and close","aria:btn:clear":"clear and close","aria:input":"color input field","aria:palette":"color selection area","aria:hue":"hue selection slider","aria:opacity":"selection slider"}),E(L,"DEFAULT_OPTIONS",{appClass:null,theme:"classic",useAsButton:!1,padding:8,disabled:!1,comparison:!0,closeOnScroll:!1,outputPrecision:0,lockOpacity:!1,autoReposition:!0,container:"body",components:{interaction:{}},i18n:{},swatches:null,inline:!1,sliders:null,default:"#42445a",defaultRepresentation:null,position:"bottom-middle",adjustableNumbers:!0,showAlways:!1,closeWithKey:"Escape"}),E(L,"create",(t=>new L(t))),e=e.default})()}));
//# sourceMappingURL=pickr.min.js.map

/***/ }),

/***/ "./assets/styles/js/forms/form-type-color.js":
/*!***************************************************!*\
  !*** ./assets/styles/js/forms/form-type-color.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_array_for_each_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.for-each.js */ "./node_modules/core-js/modules/es.array.for-each.js");
/* harmony import */ var core_js_modules_es_array_for_each_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_for_each_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/web.dom-collections.for-each.js */ "./node_modules/core-js/modules/web.dom-collections.for-each.js");
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_object_assign_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.object.assign.js */ "./node_modules/core-js/modules/es.object.assign.js");
/* harmony import */ var core_js_modules_es_object_assign_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_assign_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_error_to_string_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.error.to-string.js */ "./node_modules/core-js/modules/es.error.to-string.js");
/* harmony import */ var core_js_modules_es_error_to_string_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_error_to_string_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_date_to_string_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.date.to-string.js */ "./node_modules/core-js/modules/es.date.to-string.js");
/* harmony import */ var core_js_modules_es_date_to_string_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_date_to_string_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.regexp.to-string.js */ "./node_modules/core-js/modules/es.regexp.to-string.js");
/* harmony import */ var core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _eastdesire_jscolor__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @eastdesire/jscolor */ "./node_modules/@eastdesire/jscolor/jscolor.js");
/* harmony import */ var _eastdesire_jscolor__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_eastdesire_jscolor__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _simonwep_pickr_dist_themes_classic_min_css__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @simonwep/pickr/dist/themes/classic.min.css */ "./node_modules/@simonwep/pickr/dist/themes/classic.min.css");
/* harmony import */ var _simonwep_pickr_dist_themes_monolith_min_css__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @simonwep/pickr/dist/themes/monolith.min.css */ "./node_modules/@simonwep/pickr/dist/themes/monolith.min.css");
/* harmony import */ var _simonwep_pickr_dist_themes_nano_min_css__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @simonwep/pickr/dist/themes/nano.min.css */ "./node_modules/@simonwep/pickr/dist/themes/nano.min.css");
/* harmony import */ var _simonwep_pickr__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @simonwep/pickr */ "./node_modules/@simonwep/pickr/dist/pickr.min.js");
/* harmony import */ var _simonwep_pickr__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_simonwep_pickr__WEBPACK_IMPORTED_MODULE_11__);







// Use either jscolor


// Or pickr libraryr.. with one of the following themes
 // 'classic' theme
 // 'monolith' theme
 // 'nano' theme

// Modern or es5 bundle (pay attention to the note below!)

window.addEventListener("load.form_type", function () {
  document.querySelectorAll("[data-color-field]").forEach(function (el) {
    el.style.backgroundColor = el.value;
    var pickrOptions = JSON.parse(el.getAttribute("data-color-pickr"));
    pickrOptions["default"] = el.value;
    var pickr = new (_simonwep_pickr__WEBPACK_IMPORTED_MODULE_11___default())(Object.assign({}, pickrOptions));
    pickr.on('change', function (color, instance) {
      var hexa = color.toHEXA().toString();
      if (hexa.length == 7) hexa += 'FF';
      var colorRgba = color.toRGBA();
      el.value = hexa;
      el.style.backgroundColor = hexa;
      el.style.color = Math.sqrt(0.299 * (colorRgba[0] * colorRgba[0]) + 0.587 * (colorRgba[1] * colorRgba[1]) + 0.114 * (colorRgba[2] * colorRgba[2])) <= 127.5 && colorRgba[3] > 0.4 ? '#FFF' : '#000';
    });
  });
});

/***/ }),

/***/ "./node_modules/core-js/internals/a-callable.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/a-callable.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js/internals/try-to-string.js");

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ "./node_modules/core-js/internals/an-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/an-object.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-for-each.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/array-for-each.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $forEach = (__webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").forEach);
var arrayMethodIsStrict = __webpack_require__(/*! ../internals/array-method-is-strict */ "./node_modules/core-js/internals/array-method-is-strict.js");

var STRICT_METHOD = arrayMethodIsStrict('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
module.exports = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
} : [].forEach;


/***/ }),

/***/ "./node_modules/core-js/internals/array-includes.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/array-includes.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js/internals/to-absolute-index.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-iteration.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/array-iteration.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");
var arraySpeciesCreate = __webpack_require__(/*! ../internals/array-species-create */ "./node_modules/core-js/internals/array-species-create.js");

var push = uncurryThis([].push);

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that);
    var length = lengthOfArrayLike(self);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push(target, value);      // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push(target, value);      // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod(7)
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-method-is-strict.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/array-method-is-strict.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call -- required for testing
    method.call(null, argument || function () { return 1; }, 1);
  });
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-species-constructor.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/internals/array-species-constructor.js ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js/internals/is-array.js");
var isConstructor = __webpack_require__(/*! ../internals/is-constructor */ "./node_modules/core-js/internals/is-constructor.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var SPECIES = wellKnownSymbol('species');
var $Array = Array;

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? $Array : C;
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-species-create.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/array-species-create.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arraySpeciesConstructor = __webpack_require__(/*! ../internals/array-species-constructor */ "./node_modules/core-js/internals/array-species-constructor.js");

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};


/***/ }),

/***/ "./node_modules/core-js/internals/classof-raw.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/classof-raw.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ "./node_modules/core-js/internals/classof.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/classof.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js/internals/to-string-tag-support.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/copy-constructor-properties.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/internals/copy-constructor-properties.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var ownKeys = __webpack_require__(/*! ../internals/own-keys */ "./node_modules/core-js/internals/own-keys.js");
var getOwnPropertyDescriptorModule = __webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/create-non-enumerable-property.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/internals/create-non-enumerable-property.js ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "./node_modules/core-js/internals/create-property-descriptor.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/internals/create-property-descriptor.js ***!
  \**********************************************************************/
/***/ ((module) => {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/define-built-in.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/define-built-in.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var makeBuiltIn = __webpack_require__(/*! ../internals/make-built-in */ "./node_modules/core-js/internals/make-built-in.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js/internals/define-global-property.js");

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/define-global-property.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/define-global-property.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ "./node_modules/core-js/internals/descriptors.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/descriptors.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),

/***/ "./node_modules/core-js/internals/document-all.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/document-all.js ***!
  \********************************************************/
/***/ ((module) => {

var documentAll = typeof document == 'object' && document.all;

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
var IS_HTMLDDA = typeof documentAll == 'undefined' && documentAll !== undefined;

module.exports = {
  all: documentAll,
  IS_HTMLDDA: IS_HTMLDDA
};


/***/ }),

/***/ "./node_modules/core-js/internals/document-create-element.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/document-create-element.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ "./node_modules/core-js/internals/dom-iterables.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/dom-iterables.js ***!
  \*********************************************************/
/***/ ((module) => {

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};


/***/ }),

/***/ "./node_modules/core-js/internals/dom-token-list-prototype.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/dom-token-list-prototype.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
var documentCreateElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js");

var classList = documentCreateElement('span').classList;
var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;

module.exports = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;


/***/ }),

/***/ "./node_modules/core-js/internals/engine-user-agent.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-user-agent.js ***!
  \*************************************************************/
/***/ ((module) => {

module.exports = typeof navigator != 'undefined' && String(navigator.userAgent) || '';


/***/ }),

/***/ "./node_modules/core-js/internals/engine-v8-version.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-v8-version.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js/internals/engine-user-agent.js");

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ "./node_modules/core-js/internals/enum-bug-keys.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/enum-bug-keys.js ***!
  \*********************************************************/
/***/ ((module) => {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ "./node_modules/core-js/internals/error-to-string.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/error-to-string.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var normalizeStringArgument = __webpack_require__(/*! ../internals/normalize-string-argument */ "./node_modules/core-js/internals/normalize-string-argument.js");

var nativeErrorToString = Error.prototype.toString;

var INCORRECT_TO_STRING = fails(function () {
  if (DESCRIPTORS) {
    // Chrome 32- incorrectly call accessor
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    var object = create(Object.defineProperty({}, 'name', { get: function () {
      return this === object;
    } }));
    if (nativeErrorToString.call(object) !== 'true') return true;
  }
  // FF10- does not properly handle non-strings
  return nativeErrorToString.call({ message: 1, name: 2 }) !== '2: 1'
    // IE8 does not properly handle defaults
    || nativeErrorToString.call({}) !== 'Error';
});

module.exports = INCORRECT_TO_STRING ? function toString() {
  var O = anObject(this);
  var name = normalizeStringArgument(O.name, 'Error');
  var message = normalizeStringArgument(O.message);
  return !name ? message : !message ? name : name + ': ' + message;
} : nativeErrorToString;


/***/ }),

/***/ "./node_modules/core-js/internals/export.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/export.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var getOwnPropertyDescriptor = (__webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js").f);
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js/internals/define-global-property.js");
var copyConstructorProperties = __webpack_require__(/*! ../internals/copy-constructor-properties */ "./node_modules/core-js/internals/copy-constructor-properties.js");
var isForced = __webpack_require__(/*! ../internals/is-forced */ "./node_modules/core-js/internals/is-forced.js");

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/fails.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/internals/fails.js ***!
  \*************************************************/
/***/ ((module) => {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-bind-context.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-bind-context.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this-clause */ "./node_modules/core-js/internals/function-uncurry-this-clause.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-bind-native.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-bind-native.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ "./node_modules/core-js/internals/function-call.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-call.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-name.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-name.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-uncurry-this-clause.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js/internals/function-uncurry-this-clause.js ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

module.exports = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-uncurry-this.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-uncurry-this.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-built-in.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/get-built-in.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-method.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/get-method.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),

/***/ "./node_modules/core-js/internals/global.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/global.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),

/***/ "./node_modules/core-js/internals/has-own-property.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/has-own-property.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ "./node_modules/core-js/internals/hidden-keys.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/hidden-keys.js ***!
  \*******************************************************/
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js/internals/html.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/internals/html.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ "./node_modules/core-js/internals/ie8-dom-define.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/ie8-dom-define.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var createElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js");

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),

/***/ "./node_modules/core-js/internals/indexed-object.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/indexed-object.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ "./node_modules/core-js/internals/inspect-source.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/inspect-source.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ "./node_modules/core-js/internals/internal-state.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/internal-state.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var NATIVE_WEAK_MAP = __webpack_require__(/*! ../internals/weak-map-basic-detection */ "./node_modules/core-js/internals/weak-map-basic-detection.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var shared = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-array.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/is-array.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) == 'Array';
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-callable.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/is-callable.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var $documentAll = __webpack_require__(/*! ../internals/document-all */ "./node_modules/core-js/internals/document-all.js");

var documentAll = $documentAll.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = $documentAll.IS_HTMLDDA ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-constructor.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/is-constructor.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js/internals/inspect-source.js");

var noop = function () { /* empty */ };
var empty = [];
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = uncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, empty, argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};

isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
module.exports = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;


/***/ }),

/***/ "./node_modules/core-js/internals/is-forced.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-forced.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ "./node_modules/core-js/internals/is-null-or-undefined.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/is-null-or-undefined.js ***!
  \****************************************************************/
/***/ ((module) => {

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-object.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var $documentAll = __webpack_require__(/*! ../internals/document-all */ "./node_modules/core-js/internals/document-all.js");

var documentAll = $documentAll.all;

module.exports = $documentAll.IS_HTMLDDA ? function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it) || it === documentAll;
} : function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-pure.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/is-pure.js ***!
  \***************************************************/
/***/ ((module) => {

module.exports = false;


/***/ }),

/***/ "./node_modules/core-js/internals/is-symbol.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-symbol.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js/internals/use-symbol-as-uid.js");

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ "./node_modules/core-js/internals/length-of-array-like.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/length-of-array-like.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ "./node_modules/core-js/internals/make-built-in.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/make-built-in.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(/*! ../internals/function-name */ "./node_modules/core-js/internals/function-name.js").CONFIGURABLE);
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js/internals/inspect-source.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis(''.slice);
var replace = uncurryThis(''.replace);
var join = uncurryThis([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),

/***/ "./node_modules/core-js/internals/math-trunc.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/math-trunc.js ***!
  \******************************************************/
/***/ ((module) => {

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ "./node_modules/core-js/internals/normalize-string-argument.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/internals/normalize-string-argument.js ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js/internals/to-string.js");

module.exports = function (argument, $default) {
  return argument === undefined ? arguments.length < 2 ? '' : $default : toString(argument);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-assign.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/object-assign.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "./node_modules/core-js/internals/object-keys.js");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "./node_modules/core-js/internals/object-get-own-property-symbols.js");
var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "./node_modules/core-js/internals/object-property-is-enumerable.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");

// eslint-disable-next-line es/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es/no-object-defineproperty -- required for testing
var defineProperty = Object.defineProperty;
var concat = uncurryThis([].concat);

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
module.exports = !$assign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line es/no-symbol -- safe
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || call(propertyIsEnumerable, S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;


/***/ }),

/***/ "./node_modules/core-js/internals/object-create.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/object-create.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var definePropertiesModule = __webpack_require__(/*! ../internals/object-define-properties */ "./node_modules/core-js/internals/object-define-properties.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");
var html = __webpack_require__(/*! ../internals/html */ "./node_modules/core-js/internals/html.js");
var documentCreateElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-define-properties.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/object-define-properties.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(/*! ../internals/v8-prototype-define-bug */ "./node_modules/core-js/internals/v8-prototype-define-bug.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "./node_modules/core-js/internals/object-keys.js");

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-define-property.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-define-property.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js/internals/ie8-dom-define.js");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(/*! ../internals/v8-prototype-define-bug */ "./node_modules/core-js/internals/v8-prototype-define-bug.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js/internals/to-property-key.js");

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-descriptor.js":
/*!******************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-descriptor.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "./node_modules/core-js/internals/object-property-is-enumerable.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js/internals/to-property-key.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js/internals/ie8-dom-define.js");

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-names.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-names.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "./node_modules/core-js/internals/object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-symbols.js":
/*!***************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-symbols.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "./node_modules/core-js/internals/object-is-prototype-of.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-is-prototype-of.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ "./node_modules/core-js/internals/object-keys-internal.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/object-keys-internal.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var indexOf = (__webpack_require__(/*! ../internals/array-includes */ "./node_modules/core-js/internals/array-includes.js").indexOf);
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-keys.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/object-keys.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "./node_modules/core-js/internals/object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-property-is-enumerable.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-property-is-enumerable.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ "./node_modules/core-js/internals/object-to-string.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/object-to-string.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js/internals/to-string-tag-support.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};


/***/ }),

/***/ "./node_modules/core-js/internals/ordinary-to-primitive.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/ordinary-to-primitive.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "./node_modules/core-js/internals/own-keys.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/own-keys.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var getOwnPropertyNamesModule = __webpack_require__(/*! ../internals/object-get-own-property-names */ "./node_modules/core-js/internals/object-get-own-property-names.js");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "./node_modules/core-js/internals/object-get-own-property-symbols.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ "./node_modules/core-js/internals/regexp-flags.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-flags.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.hasIndices) result += 'd';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.unicodeSets) result += 'v';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/regexp-get-flags.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-get-flags.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var regExpFlags = __webpack_require__(/*! ../internals/regexp-flags */ "./node_modules/core-js/internals/regexp-flags.js");

var RegExpPrototype = RegExp.prototype;

module.exports = function (R) {
  var flags = R.flags;
  return flags === undefined && !('flags' in RegExpPrototype) && !hasOwn(R, 'flags') && isPrototypeOf(RegExpPrototype, R)
    ? call(regExpFlags, R) : flags;
};


/***/ }),

/***/ "./node_modules/core-js/internals/require-object-coercible.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/require-object-coercible.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/internals/shared-key.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/shared-key.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ "./node_modules/core-js/internals/shared-store.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/shared-store.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js/internals/define-global-property.js");

var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});

module.exports = store;


/***/ }),

/***/ "./node_modules/core-js/internals/shared.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/shared.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");
var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.30.1',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2023 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.30.1/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ "./node_modules/core-js/internals/symbol-constructor-detection.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js/internals/symbol-constructor-detection.js ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js/internals/engine-v8-version.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ "./node_modules/core-js/internals/to-absolute-index.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/to-absolute-index.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-indexed-object.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/to-indexed-object.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-integer-or-infinity.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/to-integer-or-infinity.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var trunc = __webpack_require__(/*! ../internals/math-trunc */ "./node_modules/core-js/internals/math-trunc.js");

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-length.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-length.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-object.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-primitive.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/to-primitive.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js/internals/is-symbol.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");
var ordinaryToPrimitive = __webpack_require__(/*! ../internals/ordinary-to-primitive */ "./node_modules/core-js/internals/ordinary-to-primitive.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-property-key.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/to-property-key.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toPrimitive = __webpack_require__(/*! ../internals/to-primitive */ "./node_modules/core-js/internals/to-primitive.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js/internals/is-symbol.js");

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-string-tag-support.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/to-string-tag-support.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ "./node_modules/core-js/internals/to-string.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-string.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};


/***/ }),

/***/ "./node_modules/core-js/internals/try-to-string.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/try-to-string.js ***!
  \*********************************************************/
/***/ ((module) => {

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/uid.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/internals/uid.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ "./node_modules/core-js/internals/use-symbol-as-uid.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/use-symbol-as-uid.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "./node_modules/core-js/internals/symbol-constructor-detection.js");

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ "./node_modules/core-js/internals/v8-prototype-define-bug.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/v8-prototype-define-bug.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});


/***/ }),

/***/ "./node_modules/core-js/internals/weak-map-basic-detection.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/weak-map-basic-detection.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ "./node_modules/core-js/internals/well-known-symbol.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/well-known-symbol.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "./node_modules/core-js/internals/symbol-constructor-detection.js");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js/internals/use-symbol-as-uid.js");

var Symbol = global.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.for-each.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.for-each.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var forEach = __webpack_require__(/*! ../internals/array-for-each */ "./node_modules/core-js/internals/array-for-each.js");

// `Array.prototype.forEach` method
// https://tc39.es/ecma262/#sec-array.prototype.foreach
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
$({ target: 'Array', proto: true, forced: [].forEach != forEach }, {
  forEach: forEach
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.date.to-string.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.date.to-string.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

// TODO: Remove from `core-js@4`
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");

var DatePrototype = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var nativeDateToString = uncurryThis(DatePrototype[TO_STRING]);
var thisTimeValue = uncurryThis(DatePrototype.getTime);

// `Date.prototype.toString` method
// https://tc39.es/ecma262/#sec-date.prototype.tostring
if (String(new Date(NaN)) != INVALID_DATE) {
  defineBuiltIn(DatePrototype, TO_STRING, function toString() {
    var value = thisTimeValue(this);
    // eslint-disable-next-line no-self-compare -- NaN check
    return value === value ? nativeDateToString(this) : INVALID_DATE;
  });
}


/***/ }),

/***/ "./node_modules/core-js/modules/es.error.to-string.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/es.error.to-string.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var errorToString = __webpack_require__(/*! ../internals/error-to-string */ "./node_modules/core-js/internals/error-to-string.js");

var ErrorPrototype = Error.prototype;

// `Error.prototype.toString` method fix
// https://tc39.es/ecma262/#sec-error.prototype.tostring
if (ErrorPrototype.toString !== errorToString) {
  defineBuiltIn(ErrorPrototype, 'toString', errorToString);
}


/***/ }),

/***/ "./node_modules/core-js/modules/es.object.assign.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.assign.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var assign = __webpack_require__(/*! ../internals/object-assign */ "./node_modules/core-js/internals/object-assign.js");

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
// eslint-disable-next-line es/no-object-assign -- required for testing
$({ target: 'Object', stat: true, arity: 2, forced: Object.assign !== assign }, {
  assign: assign
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.object.to-string.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.to-string.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js/internals/to-string-tag-support.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var toString = __webpack_require__(/*! ../internals/object-to-string */ "./node_modules/core-js/internals/object-to-string.js");

// `Object.prototype.toString` method
// https://tc39.es/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  defineBuiltIn(Object.prototype, 'toString', toString, { unsafe: true });
}


/***/ }),

/***/ "./node_modules/core-js/modules/es.regexp.to-string.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es.regexp.to-string.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var PROPER_FUNCTION_NAME = (__webpack_require__(/*! ../internals/function-name */ "./node_modules/core-js/internals/function-name.js").PROPER);
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var $toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js/internals/to-string.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var getRegExpFlags = __webpack_require__(/*! ../internals/regexp-get-flags */ "./node_modules/core-js/internals/regexp-get-flags.js");

var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var nativeToString = RegExpPrototype[TO_STRING];

var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = PROPER_FUNCTION_NAME && nativeToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  defineBuiltIn(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var pattern = $toString(R.source);
    var flags = $toString(getRegExpFlags(R));
    return '/' + pattern + '/' + flags;
  }, { unsafe: true });
}


/***/ }),

/***/ "./node_modules/core-js/modules/web.dom-collections.for-each.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/modules/web.dom-collections.for-each.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var DOMIterables = __webpack_require__(/*! ../internals/dom-iterables */ "./node_modules/core-js/internals/dom-iterables.js");
var DOMTokenListPrototype = __webpack_require__(/*! ../internals/dom-token-list-prototype */ "./node_modules/core-js/internals/dom-token-list-prototype.js");
var forEach = __webpack_require__(/*! ../internals/array-for-each */ "./node_modules/core-js/internals/array-for-each.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");

var handlePrototype = function (CollectionPrototype) {
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
};

for (var COLLECTION_NAME in DOMIterables) {
  if (DOMIterables[COLLECTION_NAME]) {
    handlePrototype(global[COLLECTION_NAME] && global[COLLECTION_NAME].prototype);
  }
}

handlePrototype(DOMTokenListPrototype);


/***/ }),

/***/ "./node_modules/@simonwep/pickr/dist/themes/classic.min.css":
/*!******************************************************************!*\
  !*** ./node_modules/@simonwep/pickr/dist/themes/classic.min.css ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/@simonwep/pickr/dist/themes/monolith.min.css":
/*!*******************************************************************!*\
  !*** ./node_modules/@simonwep/pickr/dist/themes/monolith.min.css ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/@simonwep/pickr/dist/themes/nano.min.css":
/*!***************************************************************!*\
  !*** ./node_modules/@simonwep/pickr/dist/themes/nano.min.css ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************************!*\
  !*** ./assets/form-defer.color.js ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_js_forms_form_type_color_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/js/forms/form-type-color.js */ "./assets/styles/js/forms/form-type-color.js");

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLElBQUk7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Q7QUFDdEQsc0RBQXNEO0FBQ3REO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Q7QUFDdEQsc0RBQXNEO0FBQ3REO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCLG9CQUFvQixtQkFBbUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUIsdUJBQXVCO0FBQ3ZCLDZCQUE2QjtBQUM3Qiw0QkFBNEI7QUFDNUIsaUNBQWlDO0FBQ2pDLGlDQUFpQztBQUNqQyxtQ0FBbUM7QUFDbkMsaUNBQWlDO0FBQ2pDLHlCQUF5QjtBQUN6QiwyQkFBMkI7QUFDM0Isd0JBQXdCO0FBQ3hCLG9CQUFvQjtBQUNwQix5QkFBeUI7QUFDekIsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQixxQkFBcUI7QUFDckIscUJBQXFCO0FBQ3JCLDhCQUE4QjtBQUM5Qiw0QkFBNEI7QUFDNUIsNkJBQTZCO0FBQzdCLDJCQUEyQjtBQUMzQiwyQkFBMkI7QUFDM0IscUJBQXFCO0FBQ3JCLHlCQUF5QjtBQUN6QixrQ0FBa0M7QUFDbEMsMkJBQTJCO0FBQzNCLDJCQUEyQjtBQUMzQixtQ0FBbUM7QUFDbkMsd0JBQXdCO0FBQ3hCLHNCQUFzQjtBQUN0Qiw0QkFBNEI7QUFDNUI7QUFDQSxzQ0FBc0M7QUFDdEMsMEJBQTBCO0FBQzFCLHFCQUFxQjtBQUNyQixnREFBZ0Q7QUFDaEQsd0JBQXdCO0FBQ3hCLDRDQUE0QztBQUM1Qyx5QkFBeUI7QUFDekIsK0JBQStCO0FBQy9CLG1EQUFtRDtBQUNuRCxzQkFBc0I7QUFDdEIsd0JBQXdCO0FBQ3hCLHdDQUF3QztBQUN4QywwQ0FBMEM7QUFDMUMsK0JBQStCO0FBQy9CLG1EQUFtRDtBQUNuRCw2QkFBNkI7QUFDN0I7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLG1CQUFtQjtBQUNuQixpQkFBaUI7QUFDakIsbUJBQW1CO0FBQ25CLG1CQUFtQjtBQUNuQixtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsZ0JBQWdCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLDZEQUE2RDtBQUM3RCw2REFBNkQ7QUFDN0QsNkRBQTZEO0FBQzdELDZEQUE2RDtBQUM3RCw2REFBNkQ7QUFDN0QsNkRBQTZEO0FBQzdELDZEQUE2RDtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGdCQUFnQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDLCtDQUErQztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRDtBQUNqRCwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRDtBQUNqRCwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBLG1DQUFtQztBQUNuQztBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCLDZCQUE2QjtBQUM3Qiw2QkFBNkI7QUFDN0IsNkJBQTZCO0FBQzdCLDZCQUE2QjtBQUM3Qiw2QkFBNkI7QUFDN0IsNkJBQTZCO0FBQzdCLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLDJDQUEyQztBQUMzQyw2Q0FBNkM7QUFDN0MsMkNBQTJDO0FBQzNDLDZDQUE2QztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUIsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QixxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLCtCQUErQjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHdCQUF3QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QztBQUM3QztBQUNBO0FBQ0E7QUFDQSxLQUFLLDJCQUEyQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBLEtBQUssMkJBQTJCO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxnQkFBZ0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsbUJBQW1CLDZCQUE2QjtBQUNoRCxvQkFBb0IsMERBQTBEO0FBQzlFO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzRUFBc0U7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRDtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0Q7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsc0NBQXNDO0FBQ3RDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLFFBQVE7QUFDOUM7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0EsSUFBSSxPQUFPO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRDtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLElBQUksdUNBQXVDO0FBQzNDO0FBQ0E7QUFDQSxJQUFJLE9BQU87QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QztBQUM3QztBQUNBLElBQUkseUNBQXlDO0FBQzdDO0FBQ0E7QUFDQSxJQUFJLE9BQU87QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCLElBQUk7QUFDSix3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEMsSUFBSTtBQUNKLHdDQUF3QztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCLDhCQUE4QixvRUFBb0U7QUFDbEcsNkJBQTZCO0FBQzdCO0FBQ0EsNEJBQTRCLDZEQUE2RDtBQUN6Riw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUE2Qzs7QUFFdkY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUNyQkE7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGVhc3RkZXNpcmUvanNjb2xvci9qc2NvbG9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9Ac2ltb253ZXAvcGlja3IvZGlzdC9waWNrci5taW4uanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL3N0eWxlcy9qcy9mb3Jtcy9mb3JtLXR5cGUtY29sb3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2EtY2FsbGFibGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FuLW9iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktZm9yLWVhY2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FycmF5LWluY2x1ZGVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1pdGVyYXRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FycmF5LW1ldGhvZC1pcy1zdHJpY3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FycmF5LXNwZWNpZXMtY3JlYXRlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jbGFzc29mLXJhdy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY2xhc3NvZi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY29weS1jb25zdHJ1Y3Rvci1wcm9wZXJ0aWVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jcmVhdGUtbm9uLWVudW1lcmFibGUtcHJvcGVydHkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NyZWF0ZS1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9kZWZpbmUtYnVpbHQtaW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2RlZmluZS1nbG9iYWwtcHJvcGVydHkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2Rlc2NyaXB0b3JzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9kb2N1bWVudC1hbGwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2RvY3VtZW50LWNyZWF0ZS1lbGVtZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9kb20taXRlcmFibGVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9kb20tdG9rZW4tbGlzdC1wcm90b3R5cGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2VuZ2luZS11c2VyLWFnZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbmdpbmUtdjgtdmVyc2lvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZW51bS1idWcta2V5cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZXJyb3ItdG8tc3RyaW5nLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9leHBvcnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2ZhaWxzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi1iaW5kLWNvbnRleHQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2Z1bmN0aW9uLWJpbmQtbmF0aXZlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi1jYWxsLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi1uYW1lLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMtY2xhdXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2dldC1idWlsdC1pbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZ2V0LW1ldGhvZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9oaWRkZW4ta2V5cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaHRtbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaWU4LWRvbS1kZWZpbmUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2luZGV4ZWQtb2JqZWN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pbnNwZWN0LXNvdXJjZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaW50ZXJuYWwtc3RhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLWFycmF5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1jYWxsYWJsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtY29uc3RydWN0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLWZvcmNlZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtbnVsbC1vci11bmRlZmluZWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLW9iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtcHVyZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtc3ltYm9sLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9sZW5ndGgtb2YtYXJyYXktbGlrZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbWFrZS1idWlsdC1pbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbWF0aC10cnVuYy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbm9ybWFsaXplLXN0cmluZy1hcmd1bWVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWFzc2lnbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWNyZWF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0aWVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1uYW1lcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktc3ltYm9scy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWlzLXByb3RvdHlwZS1vZi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1rZXlzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtcHJvcGVydHktaXMtZW51bWVyYWJsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LXRvLXN0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb3JkaW5hcnktdG8tcHJpbWl0aXZlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vd24ta2V5cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVnZXhwLWZsYWdzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9yZWdleHAtZ2V0LWZsYWdzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NoYXJlZC1rZXkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NoYXJlZC1zdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2hhcmVkLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zeW1ib2wtY29uc3RydWN0b3ItZGV0ZWN0aW9uLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1hYnNvbHV0ZS1pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLWludGVnZXItb3ItaW5maW5pdHkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLWxlbmd0aC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tb2JqZWN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1wcmltaXRpdmUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLXByb3BlcnR5LWtleS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tc3RyaW5nLXRhZy1zdXBwb3J0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1zdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RyeS10by1zdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3VpZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdXNlLXN5bWJvbC1hcy11aWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3Y4LXByb3RvdHlwZS1kZWZpbmUtYnVnLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy93ZWFrLW1hcC1iYXNpYy1kZXRlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuYXJyYXkuZm9yLWVhY2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5kYXRlLnRvLXN0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLmVycm9yLnRvLXN0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLm9iamVjdC5hc3NpZ24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5vYmplY3QudG8tc3RyaW5nLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMucmVnZXhwLnRvLXN0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi5kb20tY29sbGVjdGlvbnMuZm9yLWVhY2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BzaW1vbndlcC9waWNrci9kaXN0L3RoZW1lcy9jbGFzc2ljLm1pbi5jc3M/NTFmZCIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQHNpbW9ud2VwL3BpY2tyL2Rpc3QvdGhlbWVzL21vbm9saXRoLm1pbi5jc3M/YjY3NiIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQHNpbW9ud2VwL3BpY2tyL2Rpc3QvdGhlbWVzL25hbm8ubWluLmNzcz8zMGVlIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vLi9hc3NldHMvZm9ybS1kZWZlci5jb2xvci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICoganNjb2xvciAtIEphdmFTY3JpcHQgQ29sb3IgUGlja2VyXHJcbiAqXHJcbiAqIEBsaW5rICAgIGh0dHA6Ly9qc2NvbG9yLmNvbVxyXG4gKiBAbGljZW5zZSBGb3Igb3BlbiBzb3VyY2UgdXNlOiBHUEx2M1xyXG4gKiAgICAgICAgICBGb3IgY29tbWVyY2lhbCB1c2U6IEpTQ29sb3IgQ29tbWVyY2lhbCBMaWNlbnNlXHJcbiAqIEBhdXRob3IgIEphbiBPZHZhcmtvIC0gRWFzdCBEZXNpcmVcclxuICpcclxuICogU2VlIHVzYWdlIGV4YW1wbGVzIGF0IGh0dHA6Ly9qc2NvbG9yLmNvbS9leGFtcGxlcy9cclxuICovXHJcblxyXG5cclxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG5cdFx0Ly8gRXhwb3J0IGpzY29sb3IgYXMgYSBtb2R1bGVcclxuXHRcdG1vZHVsZS5leHBvcnRzID0gZ2xvYmFsLmRvY3VtZW50ID9cclxuXHRcdFx0ZmFjdG9yeSAoZ2xvYmFsKSA6XHJcblx0XHRcdGZ1bmN0aW9uICh3aW4pIHtcclxuXHRcdFx0XHRpZiAoIXdpbi5kb2N1bWVudCkge1xyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdqc2NvbG9yIG5lZWRzIGEgd2luZG93IHdpdGggZG9jdW1lbnQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGZhY3Rvcnkod2luKTtcclxuXHRcdFx0fVxyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0Ly8gRGVmYXVsdCB1c2UgKG5vIG1vZHVsZSBleHBvcnQpXHJcblx0ZmFjdG9yeShnbG9iYWwpO1xyXG5cclxufSkodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB0aGlzLCBmdW5jdGlvbiAod2luZG93KSB7IC8vIEJFR0lOIGZhY3RvcnlcclxuXHJcbi8vIEJFR0lOIGpzY29sb3IgY29kZVxyXG5cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG52YXIganNjb2xvciA9IChmdW5jdGlvbiAoKSB7IC8vIEJFR0lOIGpzY29sb3JcclxuXHJcbnZhciBqc2MgPSB7XHJcblxyXG5cclxuXHRpbml0aWFsaXplZCA6IGZhbHNlLFxyXG5cclxuXHRpbnN0YW5jZXMgOiBbXSwgLy8gY3JlYXRlZCBpbnN0YW5jZXMgb2YganNjb2xvclxyXG5cclxuXHRyZWFkeVF1ZXVlIDogW10sIC8vIGZ1bmN0aW9ucyB3YWl0aW5nIHRvIGJlIGNhbGxlZCBhZnRlciBpbml0XHJcblxyXG5cclxuXHRyZWdpc3RlciA6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuZG9jdW1lbnQpIHtcclxuXHRcdFx0d2luZG93LmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBqc2MucHViLmluaXQsIGZhbHNlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0aW5zdGFsbEJ5U2VsZWN0b3IgOiBmdW5jdGlvbiAoc2VsZWN0b3IsIHJvb3ROb2RlKSB7XHJcblx0XHRyb290Tm9kZSA9IHJvb3ROb2RlID8ganNjLm5vZGUocm9vdE5vZGUpIDogd2luZG93LmRvY3VtZW50O1xyXG5cdFx0aWYgKCFyb290Tm9kZSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ01pc3Npbmcgcm9vdCBub2RlJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGVsbXMgPSByb290Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuXHJcblx0XHQvLyBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSB3aXRoIERFUFJFQ0FURUQgaW5zdGFsbGF0aW9uL2NvbmZpZ3VyYXRpb24gdXNpbmcgY2xhc3NOYW1lXHJcblx0XHR2YXIgbWF0Y2hDbGFzcyA9IG5ldyBSZWdFeHAoJyhefFxcXFxzKSgnICsganNjLnB1Yi5sb29rdXBDbGFzcyArICcpKFxcXFxzKihcXFxce1tefV0qXFxcXH0pfFxcXFxzfCQpJywgJ2knKTtcclxuXHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGVsbXMubGVuZ3RoOyBpICs9IDEpIHtcclxuXHJcblx0XHRcdGlmIChlbG1zW2ldLmpzY29sb3IgJiYgZWxtc1tpXS5qc2NvbG9yIGluc3RhbmNlb2YganNjLnB1Yikge1xyXG5cdFx0XHRcdGNvbnRpbnVlOyAvLyBqc2NvbG9yIGFscmVhZHkgaW5zdGFsbGVkIG9uIHRoaXMgZWxlbWVudFxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoZWxtc1tpXS50eXBlICE9PSB1bmRlZmluZWQgJiYgZWxtc1tpXS50eXBlLnRvTG93ZXJDYXNlKCkgPT0gJ2NvbG9yJyAmJiBqc2MuaXNDb2xvckF0dHJTdXBwb3J0ZWQpIHtcclxuXHRcdFx0XHRjb250aW51ZTsgLy8gc2tpcHMgaW5wdXRzIG9mIHR5cGUgJ2NvbG9yJyBpZiBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXJcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIGRhdGFPcHRzLCBtO1xyXG5cclxuXHRcdFx0aWYgKFxyXG5cdFx0XHRcdChkYXRhT3B0cyA9IGpzYy5nZXREYXRhQXR0cihlbG1zW2ldLCAnanNjb2xvcicpKSAhPT0gbnVsbCB8fFxyXG5cdFx0XHRcdChlbG1zW2ldLmNsYXNzTmFtZSAmJiAobSA9IGVsbXNbaV0uY2xhc3NOYW1lLm1hdGNoKG1hdGNoQ2xhc3MpKSkgLy8gaW5zdGFsbGF0aW9uIHVzaW5nIGNsYXNzTmFtZSAoREVQUkVDQVRFRClcclxuXHRcdFx0KSB7XHJcblx0XHRcdFx0dmFyIHRhcmdldEVsbSA9IGVsbXNbaV07XHJcblxyXG5cdFx0XHRcdHZhciBvcHRzU3RyID0gJyc7XHJcblx0XHRcdFx0aWYgKGRhdGFPcHRzICE9PSBudWxsKSB7XHJcblx0XHRcdFx0XHRvcHRzU3RyID0gZGF0YU9wdHM7XHJcblxyXG5cdFx0XHRcdH0gZWxzZSBpZiAobSkgeyAvLyBpbnN0YWxsYXRpb24gdXNpbmcgY2xhc3NOYW1lIChERVBSRUNBVEVEKVxyXG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKCdJbnN0YWxsYXRpb24gdXNpbmcgY2xhc3MgbmFtZSBpcyBERVBSRUNBVEVELiBVc2UgZGF0YS1qc2NvbG9yPVwiXCIgYXR0cmlidXRlIGluc3RlYWQuJyArIGpzYy5kb2NzUmVmKTtcclxuXHRcdFx0XHRcdGlmIChtWzRdKSB7XHJcblx0XHRcdFx0XHRcdG9wdHNTdHIgPSBtWzRdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dmFyIG9wdHMgPSBudWxsO1xyXG5cdFx0XHRcdGlmIChvcHRzU3RyLnRyaW0oKSkge1xyXG5cdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0b3B0cyA9IGpzYy5wYXJzZU9wdGlvbnNTdHIob3B0c1N0cik7XHJcblx0XHRcdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUud2FybihlICsgJ1xcbicgKyBvcHRzU3RyKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRuZXcganNjLnB1Yih0YXJnZXRFbG0sIG9wdHMpO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUud2FybihlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0cGFyc2VPcHRpb25zU3RyIDogZnVuY3Rpb24gKHN0cikge1xyXG5cdFx0dmFyIG9wdHMgPSBudWxsO1xyXG5cclxuXHRcdHRyeSB7XHJcblx0XHRcdG9wdHMgPSBKU09OLnBhcnNlKHN0cik7XHJcblxyXG5cdFx0fSBjYXRjaCAoZVBhcnNlKSB7XHJcblx0XHRcdGlmICghanNjLnB1Yi5sb29zZUpTT04pIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBwYXJzZSBqc2NvbG9yIG9wdGlvbnMgYXMgSlNPTjogJyArIGVQYXJzZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly8gbG9vc2UgSlNPTiBzeW50YXggaXMgZW5hYmxlZCAtPiB0cnkgdG8gZXZhbHVhdGUgdGhlIG9wdGlvbnMgc3RyaW5nIGFzIEphdmFTY3JpcHQgb2JqZWN0XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdG9wdHMgPSAobmV3IEZ1bmN0aW9uICgndmFyIG9wdHMgPSAoJyArIHN0ciArICcpOyByZXR1cm4gdHlwZW9mIG9wdHMgPT09IFwib2JqZWN0XCIgPyBvcHRzIDoge307JykpKCk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZUV2YWwpIHtcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGV2YWx1YXRlIGpzY29sb3Igb3B0aW9uczogJyArIGVFdmFsKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBvcHRzO1xyXG5cdH0sXHJcblxyXG5cclxuXHRnZXRJbnN0YW5jZXMgOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgaW5zdCA9IFtdO1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBqc2MuaW5zdGFuY2VzLmxlbmd0aDsgaSArPSAxKSB7XHJcblx0XHRcdC8vIGlmIHRoZSB0YXJnZXRFbGVtZW50IHN0aWxsIGV4aXN0cywgdGhlIGluc3RhbmNlIGlzIGNvbnNpZGVyZWQgXCJhbGl2ZVwiXHJcblx0XHRcdGlmIChqc2MuaW5zdGFuY2VzW2ldICYmIGpzYy5pbnN0YW5jZXNbaV0udGFyZ2V0RWxlbWVudCkge1xyXG5cdFx0XHRcdGluc3QucHVzaChqc2MuaW5zdGFuY2VzW2ldKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGluc3Q7XHJcblx0fSxcclxuXHJcblxyXG5cdGNyZWF0ZUVsIDogZnVuY3Rpb24gKHRhZ05hbWUpIHtcclxuXHRcdHZhciBlbCA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xyXG5cdFx0anNjLnNldERhdGEoZWwsICdndWknLCB0cnVlKTtcclxuXHRcdHJldHVybiBlbDtcclxuXHR9LFxyXG5cclxuXHJcblx0bm9kZSA6IGZ1bmN0aW9uIChub2RlT3JTZWxlY3Rvcikge1xyXG5cdFx0aWYgKCFub2RlT3JTZWxlY3Rvcikge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodHlwZW9mIG5vZGVPclNlbGVjdG9yID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHQvLyBxdWVyeSBzZWxlY3RvclxyXG5cdFx0XHR2YXIgc2VsID0gbm9kZU9yU2VsZWN0b3I7XHJcblx0XHRcdHZhciBlbCA9IG51bGw7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0ZWwgPSB3aW5kb3cuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWwpO1xyXG5cdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0Y29uc29sZS53YXJuKGUpO1xyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghZWwpIHtcclxuXHRcdFx0XHRjb25zb2xlLndhcm4oJ05vIGVsZW1lbnQgbWF0Y2hlcyB0aGUgc2VsZWN0b3I6ICVzJywgc2VsKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZWw7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGpzYy5pc05vZGUobm9kZU9yU2VsZWN0b3IpKSB7XHJcblx0XHRcdC8vIERPTSBub2RlXHJcblx0XHRcdHJldHVybiBub2RlT3JTZWxlY3RvcjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zb2xlLndhcm4oJ0ludmFsaWQgbm9kZSBvZiB0eXBlICVzOiAlcycsIHR5cGVvZiBub2RlT3JTZWxlY3Rvciwgbm9kZU9yU2VsZWN0b3IpO1xyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fSxcclxuXHJcblxyXG5cdC8vIFNlZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zODQyODYvXHJcblx0aXNOb2RlIDogZnVuY3Rpb24gKHZhbCkge1xyXG5cdFx0aWYgKHR5cGVvZiBOb2RlID09PSAnb2JqZWN0Jykge1xyXG5cdFx0XHRyZXR1cm4gdmFsIGluc3RhbmNlb2YgTm9kZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB2YWwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbC5ub2RlVHlwZSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHZhbC5ub2RlTmFtZSA9PT0gJ3N0cmluZyc7XHJcblx0fSxcclxuXHJcblxyXG5cdG5vZGVOYW1lIDogZnVuY3Rpb24gKG5vZGUpIHtcclxuXHRcdGlmIChub2RlICYmIG5vZGUubm9kZU5hbWUpIHtcclxuXHRcdFx0cmV0dXJuIG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cclxuXHJcblx0cmVtb3ZlQ2hpbGRyZW4gOiBmdW5jdGlvbiAobm9kZSkge1xyXG5cdFx0d2hpbGUgKG5vZGUuZmlyc3RDaGlsZCkge1xyXG5cdFx0XHRub2RlLnJlbW92ZUNoaWxkKG5vZGUuZmlyc3RDaGlsZCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblxyXG5cdGlzVGV4dElucHV0IDogZnVuY3Rpb24gKGVsKSB7XHJcblx0XHRyZXR1cm4gZWwgJiYganNjLm5vZGVOYW1lKGVsKSA9PT0gJ2lucHV0JyAmJiBlbC50eXBlLnRvTG93ZXJDYXNlKCkgPT09ICd0ZXh0JztcclxuXHR9LFxyXG5cclxuXHJcblx0aXNCdXR0b24gOiBmdW5jdGlvbiAoZWwpIHtcclxuXHRcdGlmICghZWwpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG4gPSBqc2Mubm9kZU5hbWUoZWwpO1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0KG4gPT09ICdidXR0b24nKSB8fFxyXG5cdFx0XHQobiA9PT0gJ2lucHV0JyAmJiBbJ2J1dHRvbicsICdzdWJtaXQnLCAncmVzZXQnXS5pbmRleE9mKGVsLnR5cGUudG9Mb3dlckNhc2UoKSkgPiAtMSlcclxuXHRcdCk7XHJcblx0fSxcclxuXHJcblxyXG5cdGlzQnV0dG9uRW1wdHkgOiBmdW5jdGlvbiAoZWwpIHtcclxuXHRcdHN3aXRjaCAoanNjLm5vZGVOYW1lKGVsKSkge1xyXG5cdFx0XHRjYXNlICdpbnB1dCc6IHJldHVybiAoIWVsLnZhbHVlIHx8IGVsLnZhbHVlLnRyaW0oKSA9PT0gJycpO1xyXG5cdFx0XHRjYXNlICdidXR0b24nOiByZXR1cm4gKGVsLnRleHRDb250ZW50LnRyaW0oKSA9PT0gJycpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7IC8vIGNvdWxkIG5vdCBkZXRlcm1pbmUgZWxlbWVudCdzIHRleHRcclxuXHR9LFxyXG5cclxuXHJcblx0Ly8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9XSUNHL0V2ZW50TGlzdGVuZXJPcHRpb25zL2Jsb2IvZ2gtcGFnZXMvZXhwbGFpbmVyLm1kXHJcblx0aXNQYXNzaXZlRXZlbnRTdXBwb3J0ZWQgOiAoZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIHN1cHBvcnRlZCA9IGZhbHNlO1xyXG5cclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBvcHRzID0gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAncGFzc2l2ZScsIHtcclxuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uICgpIHsgc3VwcG9ydGVkID0gdHJ1ZTsgfVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Rlc3RQYXNzaXZlJywgbnVsbCwgb3B0cyk7XHJcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd0ZXN0UGFzc2l2ZScsIG51bGwsIG9wdHMpO1xyXG5cdFx0fSBjYXRjaCAoZSkge31cclxuXHJcblx0XHRyZXR1cm4gc3VwcG9ydGVkO1xyXG5cdH0pKCksXHJcblxyXG5cclxuXHRpc0NvbG9yQXR0clN1cHBvcnRlZCA6IChmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgZWxtID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcblx0XHRpZiAoZWxtLnNldEF0dHJpYnV0ZSkge1xyXG5cdFx0XHRlbG0uc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NvbG9yJyk7XHJcblx0XHRcdGlmIChlbG0udHlwZS50b0xvd2VyQ2FzZSgpID09ICdjb2xvcicpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0pKCksXHJcblxyXG5cclxuXHRkYXRhUHJvcCA6ICdfZGF0YV9qc2NvbG9yJyxcclxuXHJcblxyXG5cdC8vIHVzYWdlOlxyXG5cdC8vICAgc2V0RGF0YShvYmosIHByb3AsIHZhbHVlKVxyXG5cdC8vICAgc2V0RGF0YShvYmosIHtwcm9wOnZhbHVlLCAuLi59KVxyXG5cdC8vXHJcblx0c2V0RGF0YSA6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBvYmogPSBhcmd1bWVudHNbMF07XHJcblxyXG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcclxuXHRcdFx0Ly8gc2V0dGluZyBhIHNpbmdsZSBwcm9wZXJ0eVxyXG5cdFx0XHR2YXIgZGF0YSA9IG9iai5oYXNPd25Qcm9wZXJ0eShqc2MuZGF0YVByb3ApID8gb2JqW2pzYy5kYXRhUHJvcF0gOiAob2JqW2pzYy5kYXRhUHJvcF0gPSB7fSk7XHJcblx0XHRcdHZhciBwcm9wID0gYXJndW1lbnRzWzFdO1xyXG5cdFx0XHR2YXIgdmFsdWUgPSBhcmd1bWVudHNbMl07XHJcblxyXG5cdFx0XHRkYXRhW3Byb3BdID0gdmFsdWU7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cclxuXHRcdH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMiAmJiB0eXBlb2YgYXJndW1lbnRzWzFdID09PSAnb2JqZWN0Jykge1xyXG5cdFx0XHQvLyBzZXR0aW5nIG11bHRpcGxlIHByb3BlcnRpZXNcclxuXHRcdFx0dmFyIGRhdGEgPSBvYmouaGFzT3duUHJvcGVydHkoanNjLmRhdGFQcm9wKSA/IG9ialtqc2MuZGF0YVByb3BdIDogKG9ialtqc2MuZGF0YVByb3BdID0ge30pO1xyXG5cdFx0XHR2YXIgbWFwID0gYXJndW1lbnRzWzFdO1xyXG5cclxuXHRcdFx0Zm9yICh2YXIgcHJvcCBpbiBtYXApIHtcclxuXHRcdFx0XHRpZiAobWFwLmhhc093blByb3BlcnR5KHByb3ApKSB7XHJcblx0XHRcdFx0XHRkYXRhW3Byb3BdID0gbWFwW3Byb3BdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXJndW1lbnRzJyk7XHJcblx0fSxcclxuXHJcblxyXG5cdC8vIHVzYWdlOlxyXG5cdC8vICAgcmVtb3ZlRGF0YShvYmosIHByb3AsIFtwcm9wLi4uXSlcclxuXHQvL1xyXG5cdHJlbW92ZURhdGEgOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgb2JqID0gYXJndW1lbnRzWzBdO1xyXG5cdFx0aWYgKCFvYmouaGFzT3duUHJvcGVydHkoanNjLmRhdGFQcm9wKSkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTsgLy8gZGF0YSBvYmplY3QgZG9lcyBub3QgZXhpc3RcclxuXHRcdH1cclxuXHRcdGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSArPSAxKSB7XHJcblx0XHRcdHZhciBwcm9wID0gYXJndW1lbnRzW2ldO1xyXG5cdFx0XHRkZWxldGUgb2JqW2pzYy5kYXRhUHJvcF1bcHJvcF07XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9LFxyXG5cclxuXHJcblx0Z2V0RGF0YSA6IGZ1bmN0aW9uIChvYmosIHByb3AsIHNldERlZmF1bHQpIHtcclxuXHRcdGlmICghb2JqLmhhc093blByb3BlcnR5KGpzYy5kYXRhUHJvcCkpIHtcclxuXHRcdFx0Ly8gZGF0YSBvYmplY3QgZG9lcyBub3QgZXhpc3RcclxuXHRcdFx0aWYgKHNldERlZmF1bHQgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdG9ialtqc2MuZGF0YVByb3BdID0ge307IC8vIGNyZWF0ZSBkYXRhIG9iamVjdFxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7IC8vIG5vIHZhbHVlIHRvIHJldHVyblxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR2YXIgZGF0YSA9IG9ialtqc2MuZGF0YVByb3BdO1xyXG5cclxuXHRcdGlmICghZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJiBzZXREZWZhdWx0ICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0ZGF0YVtwcm9wXSA9IHNldERlZmF1bHQ7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZGF0YVtwcm9wXTtcclxuXHR9LFxyXG5cclxuXHJcblx0Z2V0RGF0YUF0dHIgOiBmdW5jdGlvbiAoZWwsIG5hbWUpIHtcclxuXHRcdHZhciBhdHRyTmFtZSA9ICdkYXRhLScgKyBuYW1lO1xyXG5cdFx0dmFyIGF0dHJWYWx1ZSA9IGVsLmdldEF0dHJpYnV0ZShhdHRyTmFtZSk7XHJcblx0XHRyZXR1cm4gYXR0clZhbHVlO1xyXG5cdH0sXHJcblxyXG5cclxuXHRzZXREYXRhQXR0ciA6IGZ1bmN0aW9uIChlbCwgbmFtZSwgdmFsdWUpIHtcclxuXHRcdHZhciBhdHRyTmFtZSA9ICdkYXRhLScgKyBuYW1lO1xyXG5cdFx0ZWwuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCB2YWx1ZSk7XHJcblx0fSxcclxuXHJcblxyXG5cdF9hdHRhY2hlZEdyb3VwRXZlbnRzIDoge30sXHJcblxyXG5cclxuXHRhdHRhY2hHcm91cEV2ZW50IDogZnVuY3Rpb24gKGdyb3VwTmFtZSwgZWwsIGV2bnQsIGZ1bmMpIHtcclxuXHRcdGlmICghanNjLl9hdHRhY2hlZEdyb3VwRXZlbnRzLmhhc093blByb3BlcnR5KGdyb3VwTmFtZSkpIHtcclxuXHRcdFx0anNjLl9hdHRhY2hlZEdyb3VwRXZlbnRzW2dyb3VwTmFtZV0gPSBbXTtcclxuXHRcdH1cclxuXHRcdGpzYy5fYXR0YWNoZWRHcm91cEV2ZW50c1tncm91cE5hbWVdLnB1c2goW2VsLCBldm50LCBmdW5jXSk7XHJcblx0XHRlbC5hZGRFdmVudExpc3RlbmVyKGV2bnQsIGZ1bmMsIGZhbHNlKTtcclxuXHR9LFxyXG5cclxuXHJcblx0ZGV0YWNoR3JvdXBFdmVudHMgOiBmdW5jdGlvbiAoZ3JvdXBOYW1lKSB7XHJcblx0XHRpZiAoanNjLl9hdHRhY2hlZEdyb3VwRXZlbnRzLmhhc093blByb3BlcnR5KGdyb3VwTmFtZSkpIHtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBqc2MuX2F0dGFjaGVkR3JvdXBFdmVudHNbZ3JvdXBOYW1lXS5sZW5ndGg7IGkgKz0gMSkge1xyXG5cdFx0XHRcdHZhciBldnQgPSBqc2MuX2F0dGFjaGVkR3JvdXBFdmVudHNbZ3JvdXBOYW1lXVtpXTtcclxuXHRcdFx0XHRldnRbMF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldnRbMV0sIGV2dFsyXSwgZmFsc2UpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRlbGV0ZSBqc2MuX2F0dGFjaGVkR3JvdXBFdmVudHNbZ3JvdXBOYW1lXTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0cHJldmVudERlZmF1bHQgOiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKGUucHJldmVudERlZmF1bHQpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyB9XHJcblx0XHRlLnJldHVyblZhbHVlID0gZmFsc2U7XHJcblx0fSxcclxuXHJcblxyXG5cdHRyaWdnZXJFdmVudCA6IGZ1bmN0aW9uIChlbCwgZXZlbnROYW1lLCBidWJibGVzLCBjYW5jZWxhYmxlKSB7XHJcblx0XHRpZiAoIWVsKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgZXYgPSBudWxsO1xyXG5cclxuXHRcdGlmICh0eXBlb2YgRXZlbnQgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0ZXYgPSBuZXcgRXZlbnQoZXZlbnROYW1lLCB7XHJcblx0XHRcdFx0YnViYmxlczogYnViYmxlcyxcclxuXHRcdFx0XHRjYW5jZWxhYmxlOiBjYW5jZWxhYmxlXHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gSUVcclxuXHRcdFx0ZXYgPSB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcblx0XHRcdGV2LmluaXRFdmVudChldmVudE5hbWUsIGJ1YmJsZXMsIGNhbmNlbGFibGUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghZXYpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNvIHRoYXQgd2Uga25vdyB0aGF0IHRoZSBldmVudCB3YXMgdHJpZ2dlcmVkIGludGVybmFsbHlcclxuXHRcdGpzYy5zZXREYXRhKGV2LCAnaW50ZXJuYWwnLCB0cnVlKTtcclxuXHJcblx0XHRlbC5kaXNwYXRjaEV2ZW50KGV2KTtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH0sXHJcblxyXG5cclxuXHR0cmlnZ2VySW5wdXRFdmVudCA6IGZ1bmN0aW9uIChlbCwgZXZlbnROYW1lLCBidWJibGVzLCBjYW5jZWxhYmxlKSB7XHJcblx0XHRpZiAoIWVsKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGlmIChqc2MuaXNUZXh0SW5wdXQoZWwpKSB7XHJcblx0XHRcdGpzYy50cmlnZ2VyRXZlbnQoZWwsIGV2ZW50TmFtZSwgYnViYmxlcywgY2FuY2VsYWJsZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblxyXG5cdGV2ZW50S2V5IDogZnVuY3Rpb24gKGV2KSB7XHJcblx0XHR2YXIga2V5cyA9IHtcclxuXHRcdFx0OTogJ1RhYicsXHJcblx0XHRcdDEzOiAnRW50ZXInLFxyXG5cdFx0XHQyNzogJ0VzY2FwZScsXHJcblx0XHR9O1xyXG5cdFx0aWYgKHR5cGVvZiBldi5jb2RlID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRyZXR1cm4gZXYuY29kZTtcclxuXHRcdH0gZWxzZSBpZiAoZXYua2V5Q29kZSAhPT0gdW5kZWZpbmVkICYmIGtleXMuaGFzT3duUHJvcGVydHkoZXYua2V5Q29kZSkpIHtcclxuXHRcdFx0cmV0dXJuIGtleXNbZXYua2V5Q29kZV07XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9LFxyXG5cclxuXHJcblx0c3RyTGlzdCA6IGZ1bmN0aW9uIChzdHIpIHtcclxuXHRcdGlmICghc3RyKSB7XHJcblx0XHRcdHJldHVybiBbXTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpLnNwbGl0KC9cXHMrLyk7XHJcblx0fSxcclxuXHJcblxyXG5cdC8vIFRoZSBjbGFzc05hbWUgcGFyYW1ldGVyIChzdHIpIGNhbiBvbmx5IGNvbnRhaW4gYSBzaW5nbGUgY2xhc3MgbmFtZVxyXG5cdGhhc0NsYXNzIDogZnVuY3Rpb24gKGVsbSwgY2xhc3NOYW1lKSB7XHJcblx0XHRpZiAoIWNsYXNzTmFtZSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRpZiAoZWxtLmNsYXNzTGlzdCAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHJldHVybiBlbG0uY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7XHJcblx0XHR9XHJcblx0XHQvLyBwb2x5ZmlsbFxyXG5cdFx0cmV0dXJuIC0xICE9ICgnICcgKyBlbG0uY2xhc3NOYW1lLnJlcGxhY2UoL1xccysvZywgJyAnKSArICcgJykuaW5kZXhPZignICcgKyBjbGFzc05hbWUgKyAnICcpO1xyXG5cdH0sXHJcblxyXG5cclxuXHQvLyBUaGUgY2xhc3NOYW1lIHBhcmFtZXRlciAoc3RyKSBjYW4gY29udGFpbiBtdWx0aXBsZSBjbGFzcyBuYW1lcyBzZXBhcmF0ZWQgYnkgd2hpdGVzcGFjZVxyXG5cdGFkZENsYXNzIDogZnVuY3Rpb24gKGVsbSwgY2xhc3NOYW1lKSB7XHJcblx0XHR2YXIgY2xhc3NOYW1lcyA9IGpzYy5zdHJMaXN0KGNsYXNzTmFtZSk7XHJcblxyXG5cdFx0aWYgKGVsbS5jbGFzc0xpc3QgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzTmFtZXMubGVuZ3RoOyBpICs9IDEpIHtcclxuXHRcdFx0XHRlbG0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWVzW2ldKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHQvLyBwb2x5ZmlsbFxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjbGFzc05hbWVzLmxlbmd0aDsgaSArPSAxKSB7XHJcblx0XHRcdGlmICghanNjLmhhc0NsYXNzKGVsbSwgY2xhc3NOYW1lc1tpXSkpIHtcclxuXHRcdFx0XHRlbG0uY2xhc3NOYW1lICs9IChlbG0uY2xhc3NOYW1lID8gJyAnIDogJycpICsgY2xhc3NOYW1lc1tpXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHQvLyBUaGUgY2xhc3NOYW1lIHBhcmFtZXRlciAoc3RyKSBjYW4gY29udGFpbiBtdWx0aXBsZSBjbGFzcyBuYW1lcyBzZXBhcmF0ZWQgYnkgd2hpdGVzcGFjZVxyXG5cdHJlbW92ZUNsYXNzIDogZnVuY3Rpb24gKGVsbSwgY2xhc3NOYW1lKSB7XHJcblx0XHR2YXIgY2xhc3NOYW1lcyA9IGpzYy5zdHJMaXN0KGNsYXNzTmFtZSk7XHJcblxyXG5cdFx0aWYgKGVsbS5jbGFzc0xpc3QgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzTmFtZXMubGVuZ3RoOyBpICs9IDEpIHtcclxuXHRcdFx0XHRlbG0uY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWVzW2ldKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHQvLyBwb2x5ZmlsbFxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjbGFzc05hbWVzLmxlbmd0aDsgaSArPSAxKSB7XHJcblx0XHRcdHZhciByZXBsID0gbmV3IFJlZ0V4cChcclxuXHRcdFx0XHQnXlxcXFxzKicgKyBjbGFzc05hbWVzW2ldICsgJ1xcXFxzKnwnICtcclxuXHRcdFx0XHQnXFxcXHMqJyArIGNsYXNzTmFtZXNbaV0gKyAnXFxcXHMqJHwnICtcclxuXHRcdFx0XHQnXFxcXHMrJyArIGNsYXNzTmFtZXNbaV0gKyAnKFxcXFxzKyknLFxyXG5cdFx0XHRcdCdnJ1xyXG5cdFx0XHQpO1xyXG5cdFx0XHRlbG0uY2xhc3NOYW1lID0gZWxtLmNsYXNzTmFtZS5yZXBsYWNlKHJlcGwsICckMScpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHRnZXRDb21wU3R5bGUgOiBmdW5jdGlvbiAoZWxtKSB7XHJcblx0XHR2YXIgY29tcFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUgPyB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbG0pIDogZWxtLmN1cnJlbnRTdHlsZTtcclxuXHJcblx0XHQvLyBOb3RlOiBJbiBGaXJlZm94LCBnZXRDb21wdXRlZFN0eWxlIHJldHVybnMgbnVsbCBpbiBhIGhpZGRlbiBpZnJhbWUsXHJcblx0XHQvLyB0aGF0J3Mgd2h5IHdlIG5lZWQgdG8gY2hlY2sgaWYgdGhlIHJldHVybmVkIHZhbHVlIGlzIG5vbi1lbXB0eVxyXG5cdFx0aWYgKCFjb21wU3R5bGUpIHtcclxuXHRcdFx0cmV0dXJuIHt9O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNvbXBTdHlsZTtcclxuXHR9LFxyXG5cclxuXHJcblx0Ly8gTm90ZTpcclxuXHQvLyAgIFNldHRpbmcgYSBwcm9wZXJ0eSB0byBOVUxMIHJldmVydHMgaXQgdG8gdGhlIHN0YXRlIGJlZm9yZSBpdCB3YXMgZmlyc3Qgc2V0XHJcblx0Ly8gICB3aXRoIHRoZSAncmV2ZXJzaWJsZScgZmxhZyBlbmFibGVkXHJcblx0Ly9cclxuXHRzZXRTdHlsZSA6IGZ1bmN0aW9uIChlbG0sIHN0eWxlcywgaW1wb3J0YW50LCByZXZlcnNpYmxlKSB7XHJcblx0XHQvLyB1c2luZyAnJyBmb3Igc3RhbmRhcmQgcHJpb3JpdHkgKElFMTAgYXBwYXJlbnRseSBkb2Vzbid0IGxpa2UgdmFsdWUgdW5kZWZpbmVkKVxyXG5cdFx0dmFyIHByaW9yaXR5ID0gaW1wb3J0YW50ID8gJ2ltcG9ydGFudCcgOiAnJztcclxuXHRcdHZhciBvcmlnU3R5bGUgPSBudWxsO1xyXG5cclxuXHRcdGZvciAodmFyIHByb3AgaW4gc3R5bGVzKSB7XHJcblx0XHRcdGlmIChzdHlsZXMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuXHRcdFx0XHR2YXIgc2V0VmFsID0gbnVsbDtcclxuXHJcblx0XHRcdFx0aWYgKHN0eWxlc1twcm9wXSA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0Ly8gcmV2ZXJ0aW5nIGEgcHJvcGVydHkgdmFsdWVcclxuXHJcblx0XHRcdFx0XHRpZiAoIW9yaWdTdHlsZSkge1xyXG5cdFx0XHRcdFx0XHQvLyBnZXQgdGhlIG9yaWdpbmFsIHN0eWxlIG9iamVjdCwgYnV0IGRvbnQndCB0cnkgdG8gY3JlYXRlIGl0IGlmIGl0IGRvZXNuJ3QgZXhpc3RcclxuXHRcdFx0XHRcdFx0b3JpZ1N0eWxlID0ganNjLmdldERhdGEoZWxtLCAnb3JpZ1N0eWxlJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAob3JpZ1N0eWxlICYmIG9yaWdTdHlsZS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG5cdFx0XHRcdFx0XHQvLyB3ZSBoYXZlIHByb3BlcnR5J3Mgb3JpZ2luYWwgdmFsdWUgLT4gdXNlIGl0XHJcblx0XHRcdFx0XHRcdHNldFZhbCA9IG9yaWdTdHlsZVtwcm9wXTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIHNldHRpbmcgYSBwcm9wZXJ0eSB2YWx1ZVxyXG5cclxuXHRcdFx0XHRcdGlmIChyZXZlcnNpYmxlKSB7XHJcblx0XHRcdFx0XHRcdGlmICghb3JpZ1N0eWxlKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gZ2V0IHRoZSBvcmlnaW5hbCBzdHlsZSBvYmplY3QgYW5kIGlmIGl0IGRvZXNuJ3QgZXhpc3QsIGNyZWF0ZSBpdFxyXG5cdFx0XHRcdFx0XHRcdG9yaWdTdHlsZSA9IGpzYy5nZXREYXRhKGVsbSwgJ29yaWdTdHlsZScsIHt9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZiAoIW9yaWdTdHlsZS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIG9yaWdpbmFsIHByb3BlcnR5IHZhbHVlIG5vdCB5ZXQgc3RvcmVkIC0+IHN0b3JlIGl0XHJcblx0XHRcdFx0XHRcdFx0b3JpZ1N0eWxlW3Byb3BdID0gZWxtLnN0eWxlW3Byb3BdO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRzZXRWYWwgPSBzdHlsZXNbcHJvcF07XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoc2V0VmFsICE9PSBudWxsKSB7XHJcblx0XHRcdFx0XHRlbG0uc3R5bGUuc2V0UHJvcGVydHkocHJvcCwgc2V0VmFsLCBwcmlvcml0eSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblxyXG5cdGFwcGVuZENzcyA6IGZ1bmN0aW9uIChjc3MpIHtcclxuXHRcdHZhciBoZWFkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaGVhZCcpO1xyXG5cdFx0dmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuXHRcdHN0eWxlLmlubmVyVGV4dCA9IGNzcztcclxuXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xyXG5cdH0sXHJcblxyXG5cclxuXHRhcHBlbmREZWZhdWx0Q3NzIDogZnVuY3Rpb24gKGNzcykge1xyXG5cdFx0anNjLmFwcGVuZENzcyhcclxuXHRcdFx0W1xyXG5cdFx0XHRcdCcuanNjb2xvci13cmFwLCAuanNjb2xvci13cmFwIGRpdiwgLmpzY29sb3Itd3JhcCBjYW52YXMgeyAnICtcclxuXHRcdFx0XHQncG9zaXRpb246c3RhdGljOyBkaXNwbGF5OmJsb2NrOyB2aXNpYmlsaXR5OnZpc2libGU7IG92ZXJmbG93OnZpc2libGU7IG1hcmdpbjowOyBwYWRkaW5nOjA7ICcgK1xyXG5cdFx0XHRcdCdib3JkZXI6bm9uZTsgYm9yZGVyLXJhZGl1czowOyBvdXRsaW5lOm5vbmU7IHotaW5kZXg6YXV0bzsgZmxvYXQ6bm9uZTsgJyArXHJcblx0XHRcdFx0J3dpZHRoOmF1dG87IGhlaWdodDphdXRvOyBsZWZ0OmF1dG87IHJpZ2h0OmF1dG87IHRvcDphdXRvOyBib3R0b206YXV0bzsgbWluLXdpZHRoOjA7IG1pbi1oZWlnaHQ6MDsgbWF4LXdpZHRoOm5vbmU7IG1heC1oZWlnaHQ6bm9uZTsgJyArXHJcblx0XHRcdFx0J2JhY2tncm91bmQ6bm9uZTsgY2xpcDphdXRvOyBvcGFjaXR5OjE7IHRyYW5zZm9ybTpub25lOyBib3gtc2hhZG93Om5vbmU7IGJveC1zaXppbmc6Y29udGVudC1ib3g7ICcgK1xyXG5cdFx0XHRcdCd9JyxcclxuXHRcdFx0XHQnLmpzY29sb3Itd3JhcCB7IGNsZWFyOmJvdGg7IH0nLFxyXG5cdFx0XHRcdCcuanNjb2xvci13cmFwIC5qc2NvbG9yLXBpY2tlciB7IHBvc2l0aW9uOnJlbGF0aXZlOyB9JyxcclxuXHRcdFx0XHQnLmpzY29sb3Itd3JhcCAuanNjb2xvci1zaGFkb3cgeyBwb3NpdGlvbjphYnNvbHV0ZTsgbGVmdDowOyB0b3A6MDsgd2lkdGg6MTAwJTsgaGVpZ2h0OjEwMCU7IH0nLFxyXG5cdFx0XHRcdCcuanNjb2xvci13cmFwIC5qc2NvbG9yLWJvcmRlciB7IHBvc2l0aW9uOnJlbGF0aXZlOyB9JyxcclxuXHRcdFx0XHQnLmpzY29sb3Itd3JhcCAuanNjb2xvci1wYWxldHRlIHsgcG9zaXRpb246YWJzb2x1dGU7IH0nLFxyXG5cdFx0XHRcdCcuanNjb2xvci13cmFwIC5qc2NvbG9yLXBhbGV0dGUtc3cgeyBwb3NpdGlvbjphYnNvbHV0ZTsgZGlzcGxheTpibG9jazsgY3Vyc29yOnBvaW50ZXI7IH0nLFxyXG5cdFx0XHRcdCcuanNjb2xvci13cmFwIC5qc2NvbG9yLWJ0biB7IHBvc2l0aW9uOmFic29sdXRlOyBvdmVyZmxvdzpoaWRkZW47IHdoaXRlLXNwYWNlOm5vd3JhcDsgZm9udDoxM3B4IHNhbnMtc2VyaWY7IHRleHQtYWxpZ246Y2VudGVyOyBjdXJzb3I6cG9pbnRlcjsgfScsXHJcblx0XHRcdF0uam9pbignXFxuJylcclxuXHRcdCk7XHJcblx0fSxcclxuXHJcblxyXG5cdGhleENvbG9yIDogZnVuY3Rpb24gKHIsIGcsIGIpIHtcclxuXHRcdHJldHVybiAnIycgKyAoXHJcblx0XHRcdCgnMCcgKyBNYXRoLnJvdW5kKHIpLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpICtcclxuXHRcdFx0KCcwJyArIE1hdGgucm91bmQoZykudG9TdHJpbmcoMTYpKS5zbGljZSgtMikgK1xyXG5cdFx0XHQoJzAnICsgTWF0aC5yb3VuZChiKS50b1N0cmluZygxNikpLnNsaWNlKC0yKVxyXG5cdFx0KS50b1VwcGVyQ2FzZSgpO1xyXG5cdH0sXHJcblxyXG5cclxuXHRoZXhhQ29sb3IgOiBmdW5jdGlvbiAociwgZywgYiwgYSkge1xyXG5cdFx0cmV0dXJuICcjJyArIChcclxuXHRcdFx0KCcwJyArIE1hdGgucm91bmQocikudG9TdHJpbmcoMTYpKS5zbGljZSgtMikgK1xyXG5cdFx0XHQoJzAnICsgTWF0aC5yb3VuZChnKS50b1N0cmluZygxNikpLnNsaWNlKC0yKSArXHJcblx0XHRcdCgnMCcgKyBNYXRoLnJvdW5kKGIpLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpICtcclxuXHRcdFx0KCcwJyArIE1hdGgucm91bmQoYSAqIDI1NSkudG9TdHJpbmcoMTYpKS5zbGljZSgtMilcclxuXHRcdCkudG9VcHBlckNhc2UoKTtcclxuXHR9LFxyXG5cclxuXHJcblx0cmdiQ29sb3IgOiBmdW5jdGlvbiAociwgZywgYikge1xyXG5cdFx0cmV0dXJuICdyZ2IoJyArXHJcblx0XHRcdE1hdGgucm91bmQocikgKyAnLCcgK1xyXG5cdFx0XHRNYXRoLnJvdW5kKGcpICsgJywnICtcclxuXHRcdFx0TWF0aC5yb3VuZChiKSArXHJcblx0XHQnKSc7XHJcblx0fSxcclxuXHJcblxyXG5cdHJnYmFDb2xvciA6IGZ1bmN0aW9uIChyLCBnLCBiLCBhKSB7XHJcblx0XHRyZXR1cm4gJ3JnYmEoJyArXHJcblx0XHRcdE1hdGgucm91bmQocikgKyAnLCcgK1xyXG5cdFx0XHRNYXRoLnJvdW5kKGcpICsgJywnICtcclxuXHRcdFx0TWF0aC5yb3VuZChiKSArICcsJyArXHJcblx0XHRcdChNYXRoLnJvdW5kKChhPT09dW5kZWZpbmVkIHx8IGE9PT1udWxsID8gMSA6IGEpICogMTAwKSAvIDEwMCkgK1xyXG5cdFx0JyknO1xyXG5cdH0sXHJcblxyXG5cclxuXHRsaW5lYXJHcmFkaWVudCA6IChmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2V0RnVuY05hbWUgKCkge1xyXG5cdFx0XHR2YXIgc3RkTmFtZSA9ICdsaW5lYXItZ3JhZGllbnQnO1xyXG5cdFx0XHR2YXIgcHJlZml4ZXMgPSBbJycsICctd2Via2l0LScsICctbW96LScsICctby0nLCAnLW1zLSddO1xyXG5cdFx0XHR2YXIgaGVscGVyID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwcmVmaXhlcy5sZW5ndGg7IGkgKz0gMSkge1xyXG5cdFx0XHRcdHZhciB0cnlGdW5jID0gcHJlZml4ZXNbaV0gKyBzdGROYW1lO1xyXG5cdFx0XHRcdHZhciB0cnlWYWwgPSB0cnlGdW5jICsgJyh0byByaWdodCwgcmdiYSgwLDAsMCwwKSwgcmdiYSgwLDAsMCwwKSknO1xyXG5cclxuXHRcdFx0XHRoZWxwZXIuc3R5bGUuYmFja2dyb3VuZCA9IHRyeVZhbDtcclxuXHRcdFx0XHRpZiAoaGVscGVyLnN0eWxlLmJhY2tncm91bmQpIHsgLy8gQ1NTIGJhY2tncm91bmQgc3VjY2Vzc2Z1bGx5IHNldCAtPiBmdW5jdGlvbiBuYW1lIGlzIHN1cHBvcnRlZFxyXG5cdFx0XHRcdFx0cmV0dXJuIHRyeUZ1bmM7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBzdGROYW1lOyAvLyBmYWxsYmFjayB0byBzdGFuZGFyZCAnbGluZWFyLWdyYWRpZW50JyB3aXRob3V0IHZlbmRvciBwcmVmaXhcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgZnVuY05hbWUgPSBnZXRGdW5jTmFtZSgpO1xyXG5cclxuXHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHJldHVybiBmdW5jTmFtZSArICcoJyArIEFycmF5LnByb3RvdHlwZS5qb2luLmNhbGwoYXJndW1lbnRzLCAnLCAnKSArICcpJztcclxuXHRcdH07XHJcblxyXG5cdH0pKCksXHJcblxyXG5cclxuXHRzZXRCb3JkZXJSYWRpdXMgOiBmdW5jdGlvbiAoZWxtLCB2YWx1ZSkge1xyXG5cdFx0anNjLnNldFN0eWxlKGVsbSwgeydib3JkZXItcmFkaXVzJyA6IHZhbHVlIHx8ICcwJ30pO1xyXG5cdH0sXHJcblxyXG5cclxuXHRzZXRCb3hTaGFkb3cgOiBmdW5jdGlvbiAoZWxtLCB2YWx1ZSkge1xyXG5cdFx0anNjLnNldFN0eWxlKGVsbSwgeydib3gtc2hhZG93JzogdmFsdWUgfHwgJ25vbmUnfSk7XHJcblx0fSxcclxuXHJcblxyXG5cdGdldEVsZW1lbnRQb3MgOiBmdW5jdGlvbiAoZSwgcmVsYXRpdmVUb1ZpZXdwb3J0KSB7XHJcblx0XHR2YXIgeD0wLCB5PTA7XHJcblx0XHR2YXIgcmVjdCA9IGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblx0XHR4ID0gcmVjdC5sZWZ0O1xyXG5cdFx0eSA9IHJlY3QudG9wO1xyXG5cdFx0aWYgKCFyZWxhdGl2ZVRvVmlld3BvcnQpIHtcclxuXHRcdFx0dmFyIHZpZXdQb3MgPSBqc2MuZ2V0Vmlld1BvcygpO1xyXG5cdFx0XHR4ICs9IHZpZXdQb3NbMF07XHJcblx0XHRcdHkgKz0gdmlld1Bvc1sxXTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBbeCwgeV07XHJcblx0fSxcclxuXHJcblxyXG5cdGdldEVsZW1lbnRTaXplIDogZnVuY3Rpb24gKGUpIHtcclxuXHRcdHJldHVybiBbZS5vZmZzZXRXaWR0aCwgZS5vZmZzZXRIZWlnaHRdO1xyXG5cdH0sXHJcblxyXG5cclxuXHQvLyBnZXQgcG9pbnRlcidzIFgvWSBjb29yZGluYXRlcyByZWxhdGl2ZSB0byB2aWV3cG9ydFxyXG5cdGdldEFic1BvaW50ZXJQb3MgOiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0dmFyIHggPSAwLCB5ID0gMDtcclxuXHRcdGlmICh0eXBlb2YgZS5jaGFuZ2VkVG91Y2hlcyAhPT0gJ3VuZGVmaW5lZCcgJiYgZS5jaGFuZ2VkVG91Y2hlcy5sZW5ndGgpIHtcclxuXHRcdFx0Ly8gdG91Y2ggZGV2aWNlc1xyXG5cdFx0XHR4ID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYO1xyXG5cdFx0XHR5ID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZO1xyXG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgZS5jbGllbnRYID09PSAnbnVtYmVyJykge1xyXG5cdFx0XHR4ID0gZS5jbGllbnRYO1xyXG5cdFx0XHR5ID0gZS5jbGllbnRZO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHsgeDogeCwgeTogeSB9O1xyXG5cdH0sXHJcblxyXG5cclxuXHQvLyBnZXQgcG9pbnRlcidzIFgvWSBjb29yZGluYXRlcyByZWxhdGl2ZSB0byB0YXJnZXQgZWxlbWVudFxyXG5cdGdldFJlbFBvaW50ZXJQb3MgOiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0dmFyIHRhcmdldCA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcclxuXHRcdHZhciB0YXJnZXRSZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuXHRcdHZhciB4ID0gMCwgeSA9IDA7XHJcblxyXG5cdFx0dmFyIGNsaWVudFggPSAwLCBjbGllbnRZID0gMDtcclxuXHRcdGlmICh0eXBlb2YgZS5jaGFuZ2VkVG91Y2hlcyAhPT0gJ3VuZGVmaW5lZCcgJiYgZS5jaGFuZ2VkVG91Y2hlcy5sZW5ndGgpIHtcclxuXHRcdFx0Ly8gdG91Y2ggZGV2aWNlc1xyXG5cdFx0XHRjbGllbnRYID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYO1xyXG5cdFx0XHRjbGllbnRZID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZO1xyXG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgZS5jbGllbnRYID09PSAnbnVtYmVyJykge1xyXG5cdFx0XHRjbGllbnRYID0gZS5jbGllbnRYO1xyXG5cdFx0XHRjbGllbnRZID0gZS5jbGllbnRZO1xyXG5cdFx0fVxyXG5cclxuXHRcdHggPSBjbGllbnRYIC0gdGFyZ2V0UmVjdC5sZWZ0O1xyXG5cdFx0eSA9IGNsaWVudFkgLSB0YXJnZXRSZWN0LnRvcDtcclxuXHRcdHJldHVybiB7IHg6IHgsIHk6IHkgfTtcclxuXHR9LFxyXG5cclxuXHJcblx0Z2V0Vmlld1BvcyA6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBkb2MgPSB3aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0KHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2Muc2Nyb2xsTGVmdCkgLSAoZG9jLmNsaWVudExlZnQgfHwgMCksXHJcblx0XHRcdCh3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jLnNjcm9sbFRvcCkgLSAoZG9jLmNsaWVudFRvcCB8fCAwKVxyXG5cdFx0XTtcclxuXHR9LFxyXG5cclxuXHJcblx0Z2V0Vmlld1NpemUgOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgZG9jID0gd2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdCh3aW5kb3cuaW5uZXJXaWR0aCB8fCBkb2MuY2xpZW50V2lkdGgpLFxyXG5cdFx0XHQod2luZG93LmlubmVySGVpZ2h0IHx8IGRvYy5jbGllbnRIZWlnaHQpLFxyXG5cdFx0XTtcclxuXHR9LFxyXG5cclxuXHJcblx0Ly8gcjogMC0yNTVcclxuXHQvLyBnOiAwLTI1NVxyXG5cdC8vIGI6IDAtMjU1XHJcblx0Ly9cclxuXHQvLyByZXR1cm5zOiBbIDAtMzYwLCAwLTEwMCwgMC0xMDAgXVxyXG5cdC8vXHJcblx0UkdCX0hTViA6IGZ1bmN0aW9uIChyLCBnLCBiKSB7XHJcblx0XHRyIC89IDI1NTtcclxuXHRcdGcgLz0gMjU1O1xyXG5cdFx0YiAvPSAyNTU7XHJcblx0XHR2YXIgbiA9IE1hdGgubWluKE1hdGgubWluKHIsZyksYik7XHJcblx0XHR2YXIgdiA9IE1hdGgubWF4KE1hdGgubWF4KHIsZyksYik7XHJcblx0XHR2YXIgbSA9IHYgLSBuO1xyXG5cdFx0aWYgKG0gPT09IDApIHsgcmV0dXJuIFsgbnVsbCwgMCwgMTAwICogdiBdOyB9XHJcblx0XHR2YXIgaCA9IHI9PT1uID8gMysoYi1nKS9tIDogKGc9PT1uID8gNSsoci1iKS9tIDogMSsoZy1yKS9tKTtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdDYwICogKGg9PT02PzA6aCksXHJcblx0XHRcdDEwMCAqIChtL3YpLFxyXG5cdFx0XHQxMDAgKiB2XHJcblx0XHRdO1xyXG5cdH0sXHJcblxyXG5cclxuXHQvLyBoOiAwLTM2MFxyXG5cdC8vIHM6IDAtMTAwXHJcblx0Ly8gdjogMC0xMDBcclxuXHQvL1xyXG5cdC8vIHJldHVybnM6IFsgMC0yNTUsIDAtMjU1LCAwLTI1NSBdXHJcblx0Ly9cclxuXHRIU1ZfUkdCIDogZnVuY3Rpb24gKGgsIHMsIHYpIHtcclxuXHRcdHZhciB1ID0gMjU1ICogKHYgLyAxMDApO1xyXG5cclxuXHRcdGlmIChoID09PSBudWxsKSB7XHJcblx0XHRcdHJldHVybiBbIHUsIHUsIHUgXTtcclxuXHRcdH1cclxuXHJcblx0XHRoIC89IDYwO1xyXG5cdFx0cyAvPSAxMDA7XHJcblxyXG5cdFx0dmFyIGkgPSBNYXRoLmZsb29yKGgpO1xyXG5cdFx0dmFyIGYgPSBpJTIgPyBoLWkgOiAxLShoLWkpO1xyXG5cdFx0dmFyIG0gPSB1ICogKDEgLSBzKTtcclxuXHRcdHZhciBuID0gdSAqICgxIC0gcyAqIGYpO1xyXG5cdFx0c3dpdGNoIChpKSB7XHJcblx0XHRcdGNhc2UgNjpcclxuXHRcdFx0Y2FzZSAwOiByZXR1cm4gW3UsbixtXTtcclxuXHRcdFx0Y2FzZSAxOiByZXR1cm4gW24sdSxtXTtcclxuXHRcdFx0Y2FzZSAyOiByZXR1cm4gW20sdSxuXTtcclxuXHRcdFx0Y2FzZSAzOiByZXR1cm4gW20sbix1XTtcclxuXHRcdFx0Y2FzZSA0OiByZXR1cm4gW24sbSx1XTtcclxuXHRcdFx0Y2FzZSA1OiByZXR1cm4gW3UsbSxuXTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0cGFyc2VDb2xvclN0cmluZyA6IGZ1bmN0aW9uIChzdHIpIHtcclxuXHRcdHZhciByZXQgPSB7XHJcblx0XHRcdHJnYmE6IG51bGwsXHJcblx0XHRcdGZvcm1hdDogbnVsbCAvLyAnaGV4JyB8ICdoZXhhJyB8ICdyZ2InIHwgJ3JnYmEnXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBtO1xyXG5cclxuXHRcdGlmIChtID0gc3RyLm1hdGNoKC9eXFxXKihbMC05QS1GXXszLDh9KVxcVyokL2kpKSB7XHJcblx0XHRcdC8vIEhFWCBub3RhdGlvblxyXG5cclxuXHRcdFx0aWYgKG1bMV0ubGVuZ3RoID09PSA4KSB7XHJcblx0XHRcdFx0Ly8gOC1jaGFyIG5vdGF0aW9uICg9IHdpdGggYWxwaGEpXHJcblx0XHRcdFx0cmV0LmZvcm1hdCA9ICdoZXhhJztcclxuXHRcdFx0XHRyZXQucmdiYSA9IFtcclxuXHRcdFx0XHRcdHBhcnNlSW50KG1bMV0uc2xpY2UoMCwyKSwxNiksXHJcblx0XHRcdFx0XHRwYXJzZUludChtWzFdLnNsaWNlKDIsNCksMTYpLFxyXG5cdFx0XHRcdFx0cGFyc2VJbnQobVsxXS5zbGljZSg0LDYpLDE2KSxcclxuXHRcdFx0XHRcdHBhcnNlSW50KG1bMV0uc2xpY2UoNiw4KSwxNikgLyAyNTVcclxuXHRcdFx0XHRdO1xyXG5cclxuXHRcdFx0fSBlbHNlIGlmIChtWzFdLmxlbmd0aCA9PT0gNikge1xyXG5cdFx0XHRcdC8vIDYtY2hhciBub3RhdGlvblxyXG5cdFx0XHRcdHJldC5mb3JtYXQgPSAnaGV4JztcclxuXHRcdFx0XHRyZXQucmdiYSA9IFtcclxuXHRcdFx0XHRcdHBhcnNlSW50KG1bMV0uc2xpY2UoMCwyKSwxNiksXHJcblx0XHRcdFx0XHRwYXJzZUludChtWzFdLnNsaWNlKDIsNCksMTYpLFxyXG5cdFx0XHRcdFx0cGFyc2VJbnQobVsxXS5zbGljZSg0LDYpLDE2KSxcclxuXHRcdFx0XHRcdG51bGxcclxuXHRcdFx0XHRdO1xyXG5cclxuXHRcdFx0fSBlbHNlIGlmIChtWzFdLmxlbmd0aCA9PT0gMykge1xyXG5cdFx0XHRcdC8vIDMtY2hhciBub3RhdGlvblxyXG5cdFx0XHRcdHJldC5mb3JtYXQgPSAnaGV4JztcclxuXHRcdFx0XHRyZXQucmdiYSA9IFtcclxuXHRcdFx0XHRcdHBhcnNlSW50KG1bMV0uY2hhckF0KDApICsgbVsxXS5jaGFyQXQoMCksMTYpLFxyXG5cdFx0XHRcdFx0cGFyc2VJbnQobVsxXS5jaGFyQXQoMSkgKyBtWzFdLmNoYXJBdCgxKSwxNiksXHJcblx0XHRcdFx0XHRwYXJzZUludChtWzFdLmNoYXJBdCgyKSArIG1bMV0uY2hhckF0KDIpLDE2KSxcclxuXHRcdFx0XHRcdG51bGxcclxuXHRcdFx0XHRdO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiByZXQ7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG0gPSBzdHIubWF0Y2goL15cXFcqcmdiYT9cXCgoW14pXSopXFwpXFxXKiQvaSkpIHtcclxuXHRcdFx0Ly8gcmdiKC4uLikgb3IgcmdiYSguLi4pIG5vdGF0aW9uXHJcblxyXG5cdFx0XHR2YXIgcGFyID0gbVsxXS5zcGxpdCgnLCcpO1xyXG5cdFx0XHR2YXIgcmUgPSAvXlxccyooXFxkK3xcXGQqXFwuXFxkK3xcXGQrXFwuXFxkKilcXHMqJC87XHJcblx0XHRcdHZhciBtUiwgbUcsIG1CLCBtQTtcclxuXHRcdFx0aWYgKFxyXG5cdFx0XHRcdHBhci5sZW5ndGggPj0gMyAmJlxyXG5cdFx0XHRcdChtUiA9IHBhclswXS5tYXRjaChyZSkpICYmXHJcblx0XHRcdFx0KG1HID0gcGFyWzFdLm1hdGNoKHJlKSkgJiZcclxuXHRcdFx0XHQobUIgPSBwYXJbMl0ubWF0Y2gocmUpKVxyXG5cdFx0XHQpIHtcclxuXHRcdFx0XHRyZXQuZm9ybWF0ID0gJ3JnYic7XHJcblx0XHRcdFx0cmV0LnJnYmEgPSBbXHJcblx0XHRcdFx0XHRwYXJzZUZsb2F0KG1SWzFdKSB8fCAwLFxyXG5cdFx0XHRcdFx0cGFyc2VGbG9hdChtR1sxXSkgfHwgMCxcclxuXHRcdFx0XHRcdHBhcnNlRmxvYXQobUJbMV0pIHx8IDAsXHJcblx0XHRcdFx0XHRudWxsXHJcblx0XHRcdFx0XTtcclxuXHJcblx0XHRcdFx0aWYgKFxyXG5cdFx0XHRcdFx0cGFyLmxlbmd0aCA+PSA0ICYmXHJcblx0XHRcdFx0XHQobUEgPSBwYXJbM10ubWF0Y2gocmUpKVxyXG5cdFx0XHRcdCkge1xyXG5cdFx0XHRcdFx0cmV0LmZvcm1hdCA9ICdyZ2JhJztcclxuXHRcdFx0XHRcdHJldC5yZ2JhWzNdID0gcGFyc2VGbG9hdChtQVsxXSkgfHwgMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHJldDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cclxuXHJcblx0cGFyc2VQYWxldHRlVmFsdWUgOiBmdW5jdGlvbiAobWl4ZWQpIHtcclxuXHRcdHZhciB2YWxzID0gW107XHJcblxyXG5cdFx0aWYgKHR5cGVvZiBtaXhlZCA9PT0gJ3N0cmluZycpIHsgLy8gaW5wdXQgaXMgYSBzdHJpbmcgb2Ygc3BhY2Ugc2VwYXJhdGVkIGNvbG9yIHZhbHVlc1xyXG5cdFx0XHQvLyByZ2IoKSBhbmQgcmdiYSgpIG1heSBjb250YWluIHNwYWNlcyB0b28sIHNvIGxldCdzIGZpbmQgYWxsIGNvbG9yIHZhbHVlcyBieSByZWdleFxyXG5cdFx0XHRtaXhlZC5yZXBsYWNlKC8jWzAtOUEtRl17M31cXGJ8I1swLTlBLUZdezZ9KFswLTlBLUZdezJ9KT9cXGJ8cmdiYT9cXCgoW14pXSopXFwpL2lnLCBmdW5jdGlvbiAodmFsKSB7XHJcblx0XHRcdFx0dmFscy5wdXNoKHZhbCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KG1peGVkKSkgeyAvLyBpbnB1dCBpcyBhbiBhcnJheSBvZiBjb2xvciB2YWx1ZXNcclxuXHRcdFx0dmFscyA9IG1peGVkO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNvbnZlcnQgYWxsIHZhbHVlcyBpbnRvIHVuaWZvcm0gY29sb3IgZm9ybWF0XHJcblxyXG5cdFx0dmFyIGNvbG9ycyA9IFtdO1xyXG5cclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdmFscy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgY29sb3IgPSBqc2MucGFyc2VDb2xvclN0cmluZyh2YWxzW2ldKTtcclxuXHRcdFx0aWYgKGNvbG9yKSB7XHJcblx0XHRcdFx0Y29sb3JzLnB1c2goY29sb3IpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGNvbG9ycztcclxuXHR9LFxyXG5cclxuXHJcblx0Y29udGFpbnNUcmFucGFyZW50Q29sb3IgOiBmdW5jdGlvbiAoY29sb3JzKSB7XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNvbG9ycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgYSA9IGNvbG9yc1tpXS5yZ2JhWzNdO1xyXG5cdFx0XHRpZiAoYSAhPT0gbnVsbCAmJiBhIDwgMS4wKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cclxuXHJcblx0aXNBbHBoYUZvcm1hdCA6IGZ1bmN0aW9uIChmb3JtYXQpIHtcclxuXHRcdHN3aXRjaCAoZm9ybWF0LnRvTG93ZXJDYXNlKCkpIHtcclxuXHRcdGNhc2UgJ2hleGEnOlxyXG5cdFx0Y2FzZSAncmdiYSc6XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblxyXG5cclxuXHQvLyBDYW52YXMgc2NhbGluZyBmb3IgcmV0aW5hIGRpc3BsYXlzXHJcblx0Ly9cclxuXHQvLyBhZGFwdGVkIGZyb20gaHR0cHM6Ly93d3cuaHRtbDVyb2Nrcy5jb20vZW4vdHV0b3JpYWxzL2NhbnZhcy9oaWRwaS9cclxuXHQvL1xyXG5cdHNjYWxlQ2FudmFzRm9ySGlnaERQUiA6IGZ1bmN0aW9uIChjYW52YXMpIHtcclxuXHRcdHZhciBkcHIgPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxO1xyXG5cdFx0Y2FudmFzLndpZHRoICo9IGRwcjtcclxuXHRcdGNhbnZhcy5oZWlnaHQgKj0gZHByO1xyXG5cdFx0dmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cdFx0Y3R4LnNjYWxlKGRwciwgZHByKTtcclxuXHR9LFxyXG5cclxuXHJcblx0Z2VuQ29sb3JQcmV2aWV3Q2FudmFzIDogZnVuY3Rpb24gKGNvbG9yLCBzZXBhcmF0b3JQb3MsIHNwZWNXaWR0aCwgc2NhbGVGb3JIaWdoRFBSKSB7XHJcblxyXG5cdFx0dmFyIHNlcFcgPSBNYXRoLnJvdW5kKGpzYy5wdWIucHJldmlld1NlcGFyYXRvci5sZW5ndGgpO1xyXG5cdFx0dmFyIHNxU2l6ZSA9IGpzYy5wdWIuY2hlc3Nib2FyZFNpemU7XHJcblx0XHR2YXIgc3FDb2xvcjEgPSBqc2MucHViLmNoZXNzYm9hcmRDb2xvcjE7XHJcblx0XHR2YXIgc3FDb2xvcjIgPSBqc2MucHViLmNoZXNzYm9hcmRDb2xvcjI7XHJcblxyXG5cdFx0dmFyIGNXaWR0aCA9IHNwZWNXaWR0aCA/IHNwZWNXaWR0aCA6IHNxU2l6ZSAqIDI7XHJcblx0XHR2YXIgY0hlaWdodCA9IHNxU2l6ZSAqIDI7XHJcblxyXG5cdFx0dmFyIGNhbnZhcyA9IGpzYy5jcmVhdGVFbCgnY2FudmFzJyk7XHJcblx0XHR2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG5cdFx0Y2FudmFzLndpZHRoID0gY1dpZHRoO1xyXG5cdFx0Y2FudmFzLmhlaWdodCA9IGNIZWlnaHQ7XHJcblx0XHRpZiAoc2NhbGVGb3JIaWdoRFBSKSB7XHJcblx0XHRcdGpzYy5zY2FsZUNhbnZhc0ZvckhpZ2hEUFIoY2FudmFzKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyB0cmFuc3BhcmVuY3kgY2hlc3Nib2FyZCAtIGJhY2tncm91bmRcclxuXHRcdGN0eC5maWxsU3R5bGUgPSBzcUNvbG9yMTtcclxuXHRcdGN0eC5maWxsUmVjdCgwLCAwLCBjV2lkdGgsIGNIZWlnaHQpO1xyXG5cclxuXHRcdC8vIHRyYW5zcGFyZW5jeSBjaGVzc2JvYXJkIC0gc3F1YXJlc1xyXG5cdFx0Y3R4LmZpbGxTdHlsZSA9IHNxQ29sb3IyO1xyXG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCBjV2lkdGg7IHggKz0gc3FTaXplICogMikge1xyXG5cdFx0XHRjdHguZmlsbFJlY3QoeCwgMCwgc3FTaXplLCBzcVNpemUpO1xyXG5cdFx0XHRjdHguZmlsbFJlY3QoeCArIHNxU2l6ZSwgc3FTaXplLCBzcVNpemUsIHNxU2l6ZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGNvbG9yKSB7XHJcblx0XHRcdC8vIGFjdHVhbCBjb2xvciBpbiBmb3JlZ3JvdW5kXHJcblx0XHRcdGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcclxuXHRcdFx0Y3R4LmZpbGxSZWN0KDAsIDAsIGNXaWR0aCwgY0hlaWdodCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHN0YXJ0ID0gbnVsbDtcclxuXHRcdHN3aXRjaCAoc2VwYXJhdG9yUG9zKSB7XHJcblx0XHRcdGNhc2UgJ2xlZnQnOlxyXG5cdFx0XHRcdHN0YXJ0ID0gMDtcclxuXHRcdFx0XHRjdHguY2xlYXJSZWN0KDAsIDAsIHNlcFcvMiwgY0hlaWdodCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3JpZ2h0JzpcclxuXHRcdFx0XHRzdGFydCA9IGNXaWR0aCAtIHNlcFc7XHJcblx0XHRcdFx0Y3R4LmNsZWFyUmVjdChjV2lkdGggLSAoc2VwVy8yKSwgMCwgc2VwVy8yLCBjSGVpZ2h0KTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHRcdGlmIChzdGFydCAhPT0gbnVsbCkge1xyXG5cdFx0XHRjdHgubGluZVdpZHRoID0gMTtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBqc2MucHViLnByZXZpZXdTZXBhcmF0b3IubGVuZ3RoOyBpICs9IDEpIHtcclxuXHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0ganNjLnB1Yi5wcmV2aWV3U2VwYXJhdG9yW2ldO1xyXG5cdFx0XHRcdGN0eC5tb3ZlVG8oMC41ICsgc3RhcnQgKyBpLCAwKTtcclxuXHRcdFx0XHRjdHgubGluZVRvKDAuNSArIHN0YXJ0ICsgaSwgY0hlaWdodCk7XHJcblx0XHRcdFx0Y3R4LnN0cm9rZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Y2FudmFzOiBjYW52YXMsXHJcblx0XHRcdHdpZHRoOiBjV2lkdGgsXHJcblx0XHRcdGhlaWdodDogY0hlaWdodCxcclxuXHRcdH07XHJcblx0fSxcclxuXHJcblxyXG5cdC8vIGlmIHBvc2l0aW9uIG9yIHdpZHRoIGlzIG5vdCBzZXQgPT4gZmlsbCB0aGUgZW50aXJlIGVsZW1lbnQgKDAlLTEwMCUpXHJcblx0Z2VuQ29sb3JQcmV2aWV3R3JhZGllbnQgOiBmdW5jdGlvbiAoY29sb3IsIHBvc2l0aW9uLCB3aWR0aCkge1xyXG5cdFx0dmFyIHBhcmFtcyA9IFtdO1xyXG5cclxuXHRcdGlmIChwb3NpdGlvbiAmJiB3aWR0aCkge1xyXG5cdFx0XHRwYXJhbXMgPSBbXHJcblx0XHRcdFx0J3RvICcgKyB7J2xlZnQnOidyaWdodCcsICdyaWdodCc6J2xlZnQnfVtwb3NpdGlvbl0sXHJcblx0XHRcdFx0Y29sb3IgKyAnIDAlJyxcclxuXHRcdFx0XHRjb2xvciArICcgJyArIHdpZHRoICsgJ3B4JyxcclxuXHRcdFx0XHQncmdiYSgwLDAsMCwwKSAnICsgKHdpZHRoICsgMSkgKyAncHgnLFxyXG5cdFx0XHRcdCdyZ2JhKDAsMCwwLDApIDEwMCUnLFxyXG5cdFx0XHRdO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cGFyYW1zID0gW1xyXG5cdFx0XHRcdCd0byByaWdodCcsXHJcblx0XHRcdFx0Y29sb3IgKyAnIDAlJyxcclxuXHRcdFx0XHRjb2xvciArICcgMTAwJScsXHJcblx0XHRcdF07XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGpzYy5saW5lYXJHcmFkaWVudC5hcHBseSh0aGlzLCBwYXJhbXMpO1xyXG5cdH0sXHJcblxyXG5cclxuXHRyZWRyYXdQb3NpdGlvbiA6IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRpZiAoIWpzYy5waWNrZXIgfHwgIWpzYy5waWNrZXIub3duZXIpIHtcclxuXHRcdFx0cmV0dXJuOyAvLyBwaWNrZXIgaXMgbm90IHNob3duXHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHRoaXNPYmogPSBqc2MucGlja2VyLm93bmVyO1xyXG5cclxuXHRcdGlmICh0aGlzT2JqLmNvbnRhaW5lciAhPT0gd2luZG93LmRvY3VtZW50LmJvZHkpIHtcclxuXHJcblx0XHRcdGpzYy5fZHJhd1Bvc2l0aW9uKHRoaXNPYmosIDAsIDAsICdyZWxhdGl2ZScsIGZhbHNlKTtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0dmFyIHRwLCB2cDtcclxuXHJcblx0XHRcdGlmICh0aGlzT2JqLmZpeGVkKSB7XHJcblx0XHRcdFx0Ly8gRml4ZWQgZWxlbWVudHMgYXJlIHBvc2l0aW9uZWQgcmVsYXRpdmUgdG8gdmlld3BvcnQsXHJcblx0XHRcdFx0Ly8gdGhlcmVmb3JlIHdlIGNhbiBpZ25vcmUgdGhlIHNjcm9sbCBvZmZzZXRcclxuXHRcdFx0XHR0cCA9IGpzYy5nZXRFbGVtZW50UG9zKHRoaXNPYmoudGFyZ2V0RWxlbWVudCwgdHJ1ZSk7IC8vIHRhcmdldCBwb3NcclxuXHRcdFx0XHR2cCA9IFswLCAwXTsgLy8gdmlldyBwb3NcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0cCA9IGpzYy5nZXRFbGVtZW50UG9zKHRoaXNPYmoudGFyZ2V0RWxlbWVudCk7IC8vIHRhcmdldCBwb3NcclxuXHRcdFx0XHR2cCA9IGpzYy5nZXRWaWV3UG9zKCk7IC8vIHZpZXcgcG9zXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciB0cyA9IGpzYy5nZXRFbGVtZW50U2l6ZSh0aGlzT2JqLnRhcmdldEVsZW1lbnQpOyAvLyB0YXJnZXQgc2l6ZVxyXG5cdFx0XHR2YXIgdnMgPSBqc2MuZ2V0Vmlld1NpemUoKTsgLy8gdmlldyBzaXplXHJcblx0XHRcdHZhciBwZCA9IGpzYy5nZXRQaWNrZXJEaW1zKHRoaXNPYmopO1xyXG5cdFx0XHR2YXIgcHMgPSBbcGQuYm9yZGVyVywgcGQuYm9yZGVySF07IC8vIHBpY2tlciBvdXRlciBzaXplXHJcblx0XHRcdHZhciBhLCBiLCBjO1xyXG5cdFx0XHRzd2l0Y2ggKHRoaXNPYmoucG9zaXRpb24udG9Mb3dlckNhc2UoKSkge1xyXG5cdFx0XHRcdGNhc2UgJ2xlZnQnOiBhPTE7IGI9MDsgYz0tMTsgYnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAncmlnaHQnOmE9MTsgYj0wOyBjPTE7IGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ3RvcCc6ICBhPTA7IGI9MTsgYz0tMTsgYnJlYWs7XHJcblx0XHRcdFx0ZGVmYXVsdDogICAgIGE9MDsgYj0xOyBjPTE7IGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBsID0gKHRzW2JdK3BzW2JdKS8yO1xyXG5cclxuXHRcdFx0Ly8gY29tcHV0ZSBwaWNrZXIgcG9zaXRpb25cclxuXHRcdFx0aWYgKCF0aGlzT2JqLnNtYXJ0UG9zaXRpb24pIHtcclxuXHRcdFx0XHR2YXIgcHAgPSBbXHJcblx0XHRcdFx0XHR0cFthXSxcclxuXHRcdFx0XHRcdHRwW2JdK3RzW2JdLWwrbCpjXHJcblx0XHRcdFx0XTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgcHAgPSBbXHJcblx0XHRcdFx0XHQtdnBbYV0rdHBbYV0rcHNbYV0gPiB2c1thXSA/XHJcblx0XHRcdFx0XHRcdCgtdnBbYV0rdHBbYV0rdHNbYV0vMiA+IHZzW2FdLzIgJiYgdHBbYV0rdHNbYV0tcHNbYV0gPj0gMCA/IHRwW2FdK3RzW2FdLXBzW2FdIDogdHBbYV0pIDpcclxuXHRcdFx0XHRcdFx0dHBbYV0sXHJcblx0XHRcdFx0XHQtdnBbYl0rdHBbYl0rdHNbYl0rcHNbYl0tbCtsKmMgPiB2c1tiXSA/XHJcblx0XHRcdFx0XHRcdCgtdnBbYl0rdHBbYl0rdHNbYl0vMiA+IHZzW2JdLzIgJiYgdHBbYl0rdHNbYl0tbC1sKmMgPj0gMCA/IHRwW2JdK3RzW2JdLWwtbCpjIDogdHBbYl0rdHNbYl0tbCtsKmMpIDpcclxuXHRcdFx0XHRcdFx0KHRwW2JdK3RzW2JdLWwrbCpjID49IDAgPyB0cFtiXSt0c1tiXS1sK2wqYyA6IHRwW2JdK3RzW2JdLWwtbCpjKVxyXG5cdFx0XHRcdF07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciB4ID0gcHBbYV07XHJcblx0XHRcdHZhciB5ID0gcHBbYl07XHJcblx0XHRcdHZhciBwb3NpdGlvblZhbHVlID0gdGhpc09iai5maXhlZCA/ICdmaXhlZCcgOiAnYWJzb2x1dGUnO1xyXG5cdFx0XHR2YXIgY29udHJhY3RTaGFkb3cgPVxyXG5cdFx0XHRcdChwcFswXSArIHBzWzBdID4gdHBbMF0gfHwgcHBbMF0gPCB0cFswXSArIHRzWzBdKSAmJlxyXG5cdFx0XHRcdChwcFsxXSArIHBzWzFdIDwgdHBbMV0gKyB0c1sxXSk7XHJcblxyXG5cdFx0XHRqc2MuX2RyYXdQb3NpdGlvbih0aGlzT2JqLCB4LCB5LCBwb3NpdGlvblZhbHVlLCBjb250cmFjdFNoYWRvdyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9LFxyXG5cclxuXHJcblx0X2RyYXdQb3NpdGlvbiA6IGZ1bmN0aW9uICh0aGlzT2JqLCB4LCB5LCBwb3NpdGlvblZhbHVlLCBjb250cmFjdFNoYWRvdykge1xyXG5cdFx0dmFyIHZTaGFkb3cgPSBjb250cmFjdFNoYWRvdyA/IDAgOiB0aGlzT2JqLnNoYWRvd0JsdXI7IC8vIHB4XHJcblxyXG5cdFx0anNjLnBpY2tlci53cmFwLnN0eWxlLnBvc2l0aW9uID0gcG9zaXRpb25WYWx1ZTtcclxuXHJcblx0XHRpZiAoIC8vIFRvIGF2b2lkIHVubmVjZXNzYXJ5IHJlcG9zaXRpb25pbmcgZHVyaW5nIHNjcm9sbFxyXG5cdFx0XHRNYXRoLnJvdW5kKHBhcnNlRmxvYXQoanNjLnBpY2tlci53cmFwLnN0eWxlLmxlZnQpKSAhPT0gTWF0aC5yb3VuZCh4KSB8fFxyXG5cdFx0XHRNYXRoLnJvdW5kKHBhcnNlRmxvYXQoanNjLnBpY2tlci53cmFwLnN0eWxlLnRvcCkpICE9PSBNYXRoLnJvdW5kKHkpXHJcblx0XHQpIHtcclxuXHRcdFx0anNjLnBpY2tlci53cmFwLnN0eWxlLmxlZnQgPSB4ICsgJ3B4JztcclxuXHRcdFx0anNjLnBpY2tlci53cmFwLnN0eWxlLnRvcCA9IHkgKyAncHgnO1xyXG5cdFx0fVxyXG5cclxuXHRcdGpzYy5zZXRCb3hTaGFkb3coXHJcblx0XHRcdGpzYy5waWNrZXIuYm94UyxcclxuXHRcdFx0dGhpc09iai5zaGFkb3cgP1xyXG5cdFx0XHRcdG5ldyBqc2MuQm94U2hhZG93KDAsIHZTaGFkb3csIHRoaXNPYmouc2hhZG93Qmx1ciwgMCwgdGhpc09iai5zaGFkb3dDb2xvcikgOlxyXG5cdFx0XHRcdG51bGwpO1xyXG5cdH0sXHJcblxyXG5cclxuXHRnZXRQaWNrZXJEaW1zIDogZnVuY3Rpb24gKHRoaXNPYmopIHtcclxuXHRcdHZhciB3ID0gMiAqIHRoaXNPYmouY29udHJvbEJvcmRlcldpZHRoICsgdGhpc09iai53aWR0aDtcclxuXHRcdHZhciBoID0gMiAqIHRoaXNPYmouY29udHJvbEJvcmRlcldpZHRoICsgdGhpc09iai5oZWlnaHQ7XHJcblxyXG5cdFx0dmFyIHNsaWRlclNwYWNlID0gMiAqIHRoaXNPYmouY29udHJvbEJvcmRlcldpZHRoICsgMiAqIGpzYy5nZXRDb250cm9sUGFkZGluZyh0aGlzT2JqKSArIHRoaXNPYmouc2xpZGVyU2l6ZTtcclxuXHJcblx0XHRpZiAoanNjLmdldFNsaWRlckNoYW5uZWwodGhpc09iaikpIHtcclxuXHRcdFx0dyArPSBzbGlkZXJTcGFjZTtcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzT2JqLmhhc0FscGhhQ2hhbm5lbCgpKSB7XHJcblx0XHRcdHcgKz0gc2xpZGVyU3BhY2U7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHBhbCA9IGpzYy5nZXRQYWxldHRlRGltcyh0aGlzT2JqLCB3KTtcclxuXHJcblx0XHRpZiAocGFsLmhlaWdodCkge1xyXG5cdFx0XHRoICs9IHBhbC5oZWlnaHQgKyB0aGlzT2JqLnBhZGRpbmc7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpc09iai5jbG9zZUJ1dHRvbikge1xyXG5cdFx0XHRoICs9IDIgKiB0aGlzT2JqLmNvbnRyb2xCb3JkZXJXaWR0aCArIHRoaXNPYmoucGFkZGluZyArIHRoaXNPYmouYnV0dG9uSGVpZ2h0O1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBwVyA9IHcgKyAoMiAqIHRoaXNPYmoucGFkZGluZyk7XHJcblx0XHR2YXIgcEggPSBoICsgKDIgKiB0aGlzT2JqLnBhZGRpbmcpO1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGNvbnRlbnRXOiB3LFxyXG5cdFx0XHRjb250ZW50SDogaCxcclxuXHRcdFx0cGFkZGVkVzogcFcsXHJcblx0XHRcdHBhZGRlZEg6IHBILFxyXG5cdFx0XHRib3JkZXJXOiBwVyArICgyICogdGhpc09iai5ib3JkZXJXaWR0aCksXHJcblx0XHRcdGJvcmRlckg6IHBIICsgKDIgKiB0aGlzT2JqLmJvcmRlcldpZHRoKSxcclxuXHRcdFx0cGFsZXR0ZTogcGFsLFxyXG5cdFx0fTtcclxuXHR9LFxyXG5cclxuXHJcblx0Z2V0UGFsZXR0ZURpbXMgOiBmdW5jdGlvbiAodGhpc09iaiwgd2lkdGgpIHtcclxuXHRcdHZhciBjb2xzID0gMCwgcm93cyA9IDAsIGNlbGxXID0gMCwgY2VsbEggPSAwLCBoZWlnaHQgPSAwO1xyXG5cdFx0dmFyIHNhbXBsZUNvdW50ID0gdGhpc09iai5fcGFsZXR0ZSA/IHRoaXNPYmouX3BhbGV0dGUubGVuZ3RoIDogMDtcclxuXHJcblx0XHRpZiAoc2FtcGxlQ291bnQpIHtcclxuXHRcdFx0Y29scyA9IHRoaXNPYmoucGFsZXR0ZUNvbHM7XHJcblx0XHRcdHJvd3MgPSBjb2xzID4gMCA/IE1hdGguY2VpbChzYW1wbGVDb3VudCAvIGNvbHMpIDogMDtcclxuXHJcblx0XHRcdC8vIGNvbG9yIHNhbXBsZSdzIGRpbWVuc2lvbnMgKGluY2x1ZGVzIGJvcmRlcilcclxuXHRcdFx0Y2VsbFcgPSBNYXRoLm1heCgxLCBNYXRoLmZsb29yKCh3aWR0aCAtICgoY29scyAtIDEpICogdGhpc09iai5wYWxldHRlU3BhY2luZykpIC8gY29scykpO1xyXG5cdFx0XHRjZWxsSCA9IHRoaXNPYmoucGFsZXR0ZUhlaWdodCA/IE1hdGgubWluKHRoaXNPYmoucGFsZXR0ZUhlaWdodCwgY2VsbFcpIDogY2VsbFc7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHJvd3MpIHtcclxuXHRcdFx0aGVpZ2h0ID1cclxuXHRcdFx0XHRyb3dzICogY2VsbEggK1xyXG5cdFx0XHRcdChyb3dzIC0gMSkgKiB0aGlzT2JqLnBhbGV0dGVTcGFjaW5nO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGNvbHM6IGNvbHMsXHJcblx0XHRcdHJvd3M6IHJvd3MsXHJcblx0XHRcdGNlbGxXOiBjZWxsVyxcclxuXHRcdFx0Y2VsbEg6IGNlbGxILFxyXG5cdFx0XHR3aWR0aDogd2lkdGgsXHJcblx0XHRcdGhlaWdodDogaGVpZ2h0LFxyXG5cdFx0fTtcclxuXHR9LFxyXG5cclxuXHJcblx0Z2V0Q29udHJvbFBhZGRpbmcgOiBmdW5jdGlvbiAodGhpc09iaikge1xyXG5cdFx0cmV0dXJuIE1hdGgubWF4KFxyXG5cdFx0XHR0aGlzT2JqLnBhZGRpbmcgLyAyLFxyXG5cdFx0XHQoMiAqIHRoaXNPYmoucG9pbnRlckJvcmRlcldpZHRoICsgdGhpc09iai5wb2ludGVyVGhpY2tuZXNzKSAtIHRoaXNPYmouY29udHJvbEJvcmRlcldpZHRoXHJcblx0XHQpO1xyXG5cdH0sXHJcblxyXG5cclxuXHRnZXRQYWRZQ2hhbm5lbCA6IGZ1bmN0aW9uICh0aGlzT2JqKSB7XHJcblx0XHRzd2l0Y2ggKHRoaXNPYmoubW9kZS5jaGFyQXQoMSkudG9Mb3dlckNhc2UoKSkge1xyXG5cdFx0XHRjYXNlICd2JzogcmV0dXJuICd2JzsgYnJlYWs7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gJ3MnO1xyXG5cdH0sXHJcblxyXG5cclxuXHRnZXRTbGlkZXJDaGFubmVsIDogZnVuY3Rpb24gKHRoaXNPYmopIHtcclxuXHRcdGlmICh0aGlzT2JqLm1vZGUubGVuZ3RoID4gMikge1xyXG5cdFx0XHRzd2l0Y2ggKHRoaXNPYmoubW9kZS5jaGFyQXQoMikudG9Mb3dlckNhc2UoKSkge1xyXG5cdFx0XHRcdGNhc2UgJ3MnOiByZXR1cm4gJ3MnOyBicmVhaztcclxuXHRcdFx0XHRjYXNlICd2JzogcmV0dXJuICd2JzsgYnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH0sXHJcblxyXG5cclxuXHQvLyBjYWxscyBmdW5jdGlvbiBzcGVjaWZpZWQgaW4gcGlja2VyJ3MgcHJvcGVydHlcclxuXHR0cmlnZ2VyQ2FsbGJhY2sgOiBmdW5jdGlvbiAodGhpc09iaiwgcHJvcCkge1xyXG5cdFx0aWYgKCF0aGlzT2JqW3Byb3BdKSB7XHJcblx0XHRcdHJldHVybjsgLy8gY2FsbGJhY2sgZnVuYyBub3Qgc3BlY2lmaWVkXHJcblx0XHR9XHJcblx0XHR2YXIgY2FsbGJhY2sgPSBudWxsO1xyXG5cclxuXHRcdGlmICh0eXBlb2YgdGhpc09ialtwcm9wXSA9PT0gJ3N0cmluZycpIHtcclxuXHRcdFx0Ly8gc3RyaW5nIHdpdGggY29kZVxyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGNhbGxiYWNrID0gbmV3IEZ1bmN0aW9uICh0aGlzT2JqW3Byb3BdKTtcclxuXHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoZSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIGZ1bmN0aW9uXHJcblx0XHRcdGNhbGxiYWNrID0gdGhpc09ialtwcm9wXTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoY2FsbGJhY2spIHtcclxuXHRcdFx0Y2FsbGJhY2suY2FsbCh0aGlzT2JqKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0Ly8gVHJpZ2dlcnMgYSBjb2xvciBjaGFuZ2UgcmVsYXRlZCBldmVudChzKSBvbiBhbGwgcGlja2VyIGluc3RhbmNlcy5cclxuXHQvLyBJdCBpcyBwb3NzaWJsZSB0byBzcGVjaWZ5IG11bHRpcGxlIGV2ZW50cyBzZXBhcmF0ZWQgd2l0aCBhIHNwYWNlLlxyXG5cdHRyaWdnZXJHbG9iYWwgOiBmdW5jdGlvbiAoZXZlbnROYW1lcykge1xyXG5cdFx0dmFyIGluc3QgPSBqc2MuZ2V0SW5zdGFuY2VzKCk7XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGluc3QubGVuZ3RoOyBpICs9IDEpIHtcclxuXHRcdFx0aW5zdFtpXS50cmlnZ2VyKGV2ZW50TmFtZXMpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHRfcG9pbnRlck1vdmVFdmVudCA6IHtcclxuXHRcdG1vdXNlOiAnbW91c2Vtb3ZlJyxcclxuXHRcdHRvdWNoOiAndG91Y2htb3ZlJ1xyXG5cdH0sXHJcblx0X3BvaW50ZXJFbmRFdmVudCA6IHtcclxuXHRcdG1vdXNlOiAnbW91c2V1cCcsXHJcblx0XHR0b3VjaDogJ3RvdWNoZW5kJ1xyXG5cdH0sXHJcblxyXG5cclxuXHRfcG9pbnRlck9yaWdpbiA6IG51bGwsXHJcblxyXG5cclxuXHRvbkRvY3VtZW50S2V5VXAgOiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKFsnVGFiJywgJ0VzY2FwZSddLmluZGV4T2YoanNjLmV2ZW50S2V5KGUpKSAhPT0gLTEpIHtcclxuXHRcdFx0aWYgKGpzYy5waWNrZXIgJiYganNjLnBpY2tlci5vd25lcikge1xyXG5cdFx0XHRcdGpzYy5waWNrZXIub3duZXIudHJ5SGlkZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblxyXG5cdG9uV2luZG93UmVzaXplIDogZnVuY3Rpb24gKGUpIHtcclxuXHRcdGpzYy5yZWRyYXdQb3NpdGlvbigpO1xyXG5cdH0sXHJcblxyXG5cclxuXHRvbldpbmRvd1Njcm9sbCA6IGZ1bmN0aW9uIChlKSB7XHJcblx0XHRqc2MucmVkcmF3UG9zaXRpb24oKTtcclxuXHR9LFxyXG5cclxuXHJcblx0b25QYXJlbnRTY3JvbGwgOiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0Ly8gaGlkZSB0aGUgcGlja2VyIHdoZW4gb25lIG9mIHRoZSBwYXJlbnQgZWxlbWVudHMgaXMgc2Nyb2xsZWRcclxuXHRcdGlmIChqc2MucGlja2VyICYmIGpzYy5waWNrZXIub3duZXIpIHtcclxuXHRcdFx0anNjLnBpY2tlci5vd25lci50cnlIaWRlKCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblxyXG5cdG9uRG9jdW1lbnRNb3VzZURvd24gOiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0dmFyIHRhcmdldCA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcclxuXHJcblx0XHRpZiAodGFyZ2V0LmpzY29sb3IgJiYgdGFyZ2V0LmpzY29sb3IgaW5zdGFuY2VvZiBqc2MucHViKSB7IC8vIGNsaWNrZWQgdGFyZ2V0RWxlbWVudCAtPiBzaG93IHBpY2tlclxyXG5cdFx0XHRpZiAodGFyZ2V0LmpzY29sb3Iuc2hvd09uQ2xpY2sgJiYgIXRhcmdldC5kaXNhYmxlZCkge1xyXG5cdFx0XHRcdHRhcmdldC5qc2NvbG9yLnNob3coKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmIChqc2MuZ2V0RGF0YSh0YXJnZXQsICdndWknKSkgeyAvLyBjbGlja2VkIGpzY29sb3IncyBHVUkgZWxlbWVudFxyXG5cdFx0XHR2YXIgY29udHJvbCA9IGpzYy5nZXREYXRhKHRhcmdldCwgJ2NvbnRyb2wnKTtcclxuXHRcdFx0aWYgKGNvbnRyb2wpIHtcclxuXHRcdFx0XHQvLyBqc2NvbG9yJ3MgY29udHJvbFxyXG5cdFx0XHRcdGpzYy5vbkNvbnRyb2xQb2ludGVyU3RhcnQoZSwgdGFyZ2V0LCBqc2MuZ2V0RGF0YSh0YXJnZXQsICdjb250cm9sJyksICdtb3VzZScpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQvLyBtb3VzZSBpcyBvdXRzaWRlIHRoZSBwaWNrZXIncyBjb250cm9scyAtPiBoaWRlIHRoZSBjb2xvciBwaWNrZXIhXHJcblx0XHRcdGlmIChqc2MucGlja2VyICYmIGpzYy5waWNrZXIub3duZXIpIHtcclxuXHRcdFx0XHRqc2MucGlja2VyLm93bmVyLnRyeUhpZGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHRvblBpY2tlclRvdWNoU3RhcnQgOiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0dmFyIHRhcmdldCA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcclxuXHJcblx0XHRpZiAoanNjLmdldERhdGEodGFyZ2V0LCAnY29udHJvbCcpKSB7XHJcblx0XHRcdGpzYy5vbkNvbnRyb2xQb2ludGVyU3RhcnQoZSwgdGFyZ2V0LCBqc2MuZ2V0RGF0YSh0YXJnZXQsICdjb250cm9sJyksICd0b3VjaCcpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHRvbkNvbnRyb2xQb2ludGVyU3RhcnQgOiBmdW5jdGlvbiAoZSwgdGFyZ2V0LCBjb250cm9sTmFtZSwgcG9pbnRlclR5cGUpIHtcclxuXHRcdHZhciB0aGlzT2JqID0ganNjLmdldERhdGEodGFyZ2V0LCAnaW5zdGFuY2UnKTtcclxuXHJcblx0XHRqc2MucHJldmVudERlZmF1bHQoZSk7XHJcblxyXG5cdFx0dmFyIHJlZ2lzdGVyRHJhZ0V2ZW50cyA9IGZ1bmN0aW9uIChkb2MsIG9mZnNldCkge1xyXG5cdFx0XHRqc2MuYXR0YWNoR3JvdXBFdmVudCgnZHJhZycsIGRvYywganNjLl9wb2ludGVyTW92ZUV2ZW50W3BvaW50ZXJUeXBlXSxcclxuXHRcdFx0XHRqc2Mub25Eb2N1bWVudFBvaW50ZXJNb3ZlKGUsIHRhcmdldCwgY29udHJvbE5hbWUsIHBvaW50ZXJUeXBlLCBvZmZzZXQpKTtcclxuXHRcdFx0anNjLmF0dGFjaEdyb3VwRXZlbnQoJ2RyYWcnLCBkb2MsIGpzYy5fcG9pbnRlckVuZEV2ZW50W3BvaW50ZXJUeXBlXSxcclxuXHRcdFx0XHRqc2Mub25Eb2N1bWVudFBvaW50ZXJFbmQoZSwgdGFyZ2V0LCBjb250cm9sTmFtZSwgcG9pbnRlclR5cGUpKTtcclxuXHRcdH07XHJcblxyXG5cdFx0cmVnaXN0ZXJEcmFnRXZlbnRzKHdpbmRvdy5kb2N1bWVudCwgWzAsIDBdKTtcclxuXHJcblx0XHRpZiAod2luZG93LnBhcmVudCAmJiB3aW5kb3cuZnJhbWVFbGVtZW50KSB7XHJcblx0XHRcdHZhciByZWN0ID0gd2luZG93LmZyYW1lRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHRcdFx0dmFyIG9mcyA9IFstcmVjdC5sZWZ0LCAtcmVjdC50b3BdO1xyXG5cdFx0XHRyZWdpc3RlckRyYWdFdmVudHMod2luZG93LnBhcmVudC53aW5kb3cuZG9jdW1lbnQsIG9mcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGFicyA9IGpzYy5nZXRBYnNQb2ludGVyUG9zKGUpO1xyXG5cdFx0dmFyIHJlbCA9IGpzYy5nZXRSZWxQb2ludGVyUG9zKGUpO1xyXG5cdFx0anNjLl9wb2ludGVyT3JpZ2luID0ge1xyXG5cdFx0XHR4OiBhYnMueCAtIHJlbC54LFxyXG5cdFx0XHR5OiBhYnMueSAtIHJlbC55XHJcblx0XHR9O1xyXG5cclxuXHRcdHN3aXRjaCAoY29udHJvbE5hbWUpIHtcclxuXHRcdGNhc2UgJ3BhZCc6XHJcblx0XHRcdC8vIGlmIHRoZSB2YWx1ZSBzbGlkZXIgaXMgYXQgdGhlIGJvdHRvbSwgbW92ZSBpdCB1cFxyXG5cdFx0XHRpZiAoanNjLmdldFNsaWRlckNoYW5uZWwodGhpc09iaikgPT09ICd2JyAmJiB0aGlzT2JqLmNoYW5uZWxzLnYgPT09IDApIHtcclxuXHRcdFx0XHR0aGlzT2JqLmZyb21IU1ZBKG51bGwsIG51bGwsIDEwMCwgbnVsbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0anNjLnNldFBhZCh0aGlzT2JqLCBlLCAwLCAwKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0Y2FzZSAnc2xkJzpcclxuXHRcdFx0anNjLnNldFNsZCh0aGlzT2JqLCBlLCAwKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0Y2FzZSAnYXNsZCc6XHJcblx0XHRcdGpzYy5zZXRBU2xkKHRoaXNPYmosIGUsIDApO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHRcdHRoaXNPYmoudHJpZ2dlcignaW5wdXQnKTtcclxuXHR9LFxyXG5cclxuXHJcblx0b25Eb2N1bWVudFBvaW50ZXJNb3ZlIDogZnVuY3Rpb24gKGUsIHRhcmdldCwgY29udHJvbE5hbWUsIHBvaW50ZXJUeXBlLCBvZmZzZXQpIHtcclxuXHRcdHJldHVybiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHR2YXIgdGhpc09iaiA9IGpzYy5nZXREYXRhKHRhcmdldCwgJ2luc3RhbmNlJyk7XHJcblx0XHRcdHN3aXRjaCAoY29udHJvbE5hbWUpIHtcclxuXHRcdFx0Y2FzZSAncGFkJzpcclxuXHRcdFx0XHRqc2Muc2V0UGFkKHRoaXNPYmosIGUsIG9mZnNldFswXSwgb2Zmc2V0WzFdKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdGNhc2UgJ3NsZCc6XHJcblx0XHRcdFx0anNjLnNldFNsZCh0aGlzT2JqLCBlLCBvZmZzZXRbMV0pO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0Y2FzZSAnYXNsZCc6XHJcblx0XHRcdFx0anNjLnNldEFTbGQodGhpc09iaiwgZSwgb2Zmc2V0WzFdKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzT2JqLnRyaWdnZXIoJ2lucHV0Jyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblxyXG5cdG9uRG9jdW1lbnRQb2ludGVyRW5kIDogZnVuY3Rpb24gKGUsIHRhcmdldCwgY29udHJvbE5hbWUsIHBvaW50ZXJUeXBlKSB7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0dmFyIHRoaXNPYmogPSBqc2MuZ2V0RGF0YSh0YXJnZXQsICdpbnN0YW5jZScpO1xyXG5cdFx0XHRqc2MuZGV0YWNoR3JvdXBFdmVudHMoJ2RyYWcnKTtcclxuXHJcblx0XHRcdC8vIEFsd2F5cyB0cmlnZ2VyIGNoYW5nZXMgQUZURVIgZGV0YWNoaW5nIG91dHN0YW5kaW5nIG1vdXNlIGhhbmRsZXJzLFxyXG5cdFx0XHQvLyBpbiBjYXNlIHNvbWUgY29sb3IgY2hhbmdlIHRoYXQgb2NjdXJlZCBpbiB1c2VyLWRlZmluZWQgb25DaGFuZ2Uvb25JbnB1dCBoYW5kbGVyXHJcblx0XHRcdC8vIGludHJ1ZGVkIGludG8gY3VycmVudCBtb3VzZSBldmVudHNcclxuXHRcdFx0dGhpc09iai50cmlnZ2VyKCdpbnB1dCcpO1xyXG5cdFx0XHR0aGlzT2JqLnRyaWdnZXIoJ2NoYW5nZScpO1xyXG5cdFx0fTtcclxuXHR9LFxyXG5cclxuXHJcblx0b25QYWxldHRlU2FtcGxlQ2xpY2sgOiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0dmFyIHRhcmdldCA9IGUuY3VycmVudFRhcmdldDtcclxuXHRcdHZhciB0aGlzT2JqID0ganNjLmdldERhdGEodGFyZ2V0LCAnaW5zdGFuY2UnKTtcclxuXHRcdHZhciBjb2xvciA9IGpzYy5nZXREYXRhKHRhcmdldCwgJ2NvbG9yJyk7XHJcblxyXG5cdFx0Ly8gd2hlbiBmb3JtYXQgaXMgZmxleGlibGUsIHVzZSB0aGUgb3JpZ2luYWwgZm9ybWF0IG9mIHRoaXMgY29sb3Igc2FtcGxlXHJcblx0XHRpZiAodGhpc09iai5mb3JtYXQudG9Mb3dlckNhc2UoKSA9PT0gJ2FueScpIHtcclxuXHRcdFx0dGhpc09iai5fc2V0Rm9ybWF0KGNvbG9yLmZvcm1hdCk7IC8vIGFkYXB0IGZvcm1hdFxyXG5cdFx0XHRpZiAoIWpzYy5pc0FscGhhRm9ybWF0KHRoaXNPYmouZ2V0Rm9ybWF0KCkpKSB7XHJcblx0XHRcdFx0Y29sb3IucmdiYVszXSA9IDEuMDsgLy8gd2hlbiBzd2l0Y2hpbmcgdG8gYSBmb3JtYXQgdGhhdCBkb2Vzbid0IHN1cHBvcnQgYWxwaGEsIHNldCBmdWxsIG9wYWNpdHlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGlmIHRoaXMgY29sb3IgZG9lc24ndCBzcGVjaWZ5IGFscGhhLCB1c2UgYWxwaGEgb2YgMS4wIChpZiBhcHBsaWNhYmxlKVxyXG5cdFx0aWYgKGNvbG9yLnJnYmFbM10gPT09IG51bGwpIHtcclxuXHRcdFx0aWYgKHRoaXNPYmoucGFsZXR0ZVNldHNBbHBoYSA9PT0gdHJ1ZSB8fCAodGhpc09iai5wYWxldHRlU2V0c0FscGhhID09PSAnYXV0bycgJiYgdGhpc09iai5fcGFsZXR0ZUhhc1RyYW5zcGFyZW5jeSkpIHtcclxuXHRcdFx0XHRjb2xvci5yZ2JhWzNdID0gMS4wO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpc09iai5mcm9tUkdCQS5hcHBseSh0aGlzT2JqLCBjb2xvci5yZ2JhKTtcclxuXHJcblx0XHR0aGlzT2JqLnRyaWdnZXIoJ2lucHV0Jyk7XHJcblx0XHR0aGlzT2JqLnRyaWdnZXIoJ2NoYW5nZScpO1xyXG5cclxuXHRcdGlmICh0aGlzT2JqLmhpZGVPblBhbGV0dGVDbGljaykge1xyXG5cdFx0XHR0aGlzT2JqLmhpZGUoKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0c2V0UGFkIDogZnVuY3Rpb24gKHRoaXNPYmosIGUsIG9mc1gsIG9mc1kpIHtcclxuXHRcdHZhciBwb2ludGVyQWJzID0ganNjLmdldEFic1BvaW50ZXJQb3MoZSk7XHJcblx0XHR2YXIgeCA9IG9mc1ggKyBwb2ludGVyQWJzLnggLSBqc2MuX3BvaW50ZXJPcmlnaW4ueCAtIHRoaXNPYmoucGFkZGluZyAtIHRoaXNPYmouY29udHJvbEJvcmRlcldpZHRoO1xyXG5cdFx0dmFyIHkgPSBvZnNZICsgcG9pbnRlckFicy55IC0ganNjLl9wb2ludGVyT3JpZ2luLnkgLSB0aGlzT2JqLnBhZGRpbmcgLSB0aGlzT2JqLmNvbnRyb2xCb3JkZXJXaWR0aDtcclxuXHJcblx0XHR2YXIgeFZhbCA9IHggKiAoMzYwIC8gKHRoaXNPYmoud2lkdGggLSAxKSk7XHJcblx0XHR2YXIgeVZhbCA9IDEwMCAtICh5ICogKDEwMCAvICh0aGlzT2JqLmhlaWdodCAtIDEpKSk7XHJcblxyXG5cdFx0c3dpdGNoIChqc2MuZ2V0UGFkWUNoYW5uZWwodGhpc09iaikpIHtcclxuXHRcdGNhc2UgJ3MnOiB0aGlzT2JqLmZyb21IU1ZBKHhWYWwsIHlWYWwsIG51bGwsIG51bGwpOyBicmVhaztcclxuXHRcdGNhc2UgJ3YnOiB0aGlzT2JqLmZyb21IU1ZBKHhWYWwsIG51bGwsIHlWYWwsIG51bGwpOyBicmVhaztcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0c2V0U2xkIDogZnVuY3Rpb24gKHRoaXNPYmosIGUsIG9mc1kpIHtcclxuXHRcdHZhciBwb2ludGVyQWJzID0ganNjLmdldEFic1BvaW50ZXJQb3MoZSk7XHJcblx0XHR2YXIgeSA9IG9mc1kgKyBwb2ludGVyQWJzLnkgLSBqc2MuX3BvaW50ZXJPcmlnaW4ueSAtIHRoaXNPYmoucGFkZGluZyAtIHRoaXNPYmouY29udHJvbEJvcmRlcldpZHRoO1xyXG5cdFx0dmFyIHlWYWwgPSAxMDAgLSAoeSAqICgxMDAgLyAodGhpc09iai5oZWlnaHQgLSAxKSkpO1xyXG5cclxuXHRcdHN3aXRjaCAoanNjLmdldFNsaWRlckNoYW5uZWwodGhpc09iaikpIHtcclxuXHRcdGNhc2UgJ3MnOiB0aGlzT2JqLmZyb21IU1ZBKG51bGwsIHlWYWwsIG51bGwsIG51bGwpOyBicmVhaztcclxuXHRcdGNhc2UgJ3YnOiB0aGlzT2JqLmZyb21IU1ZBKG51bGwsIG51bGwsIHlWYWwsIG51bGwpOyBicmVhaztcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0c2V0QVNsZCA6IGZ1bmN0aW9uICh0aGlzT2JqLCBlLCBvZnNZKSB7XHJcblx0XHR2YXIgcG9pbnRlckFicyA9IGpzYy5nZXRBYnNQb2ludGVyUG9zKGUpO1xyXG5cdFx0dmFyIHkgPSBvZnNZICsgcG9pbnRlckFicy55IC0ganNjLl9wb2ludGVyT3JpZ2luLnkgLSB0aGlzT2JqLnBhZGRpbmcgLSB0aGlzT2JqLmNvbnRyb2xCb3JkZXJXaWR0aDtcclxuXHRcdHZhciB5VmFsID0gMS4wIC0gKHkgKiAoMS4wIC8gKHRoaXNPYmouaGVpZ2h0IC0gMSkpKTtcclxuXHJcblx0XHRpZiAoeVZhbCA8IDEuMCkge1xyXG5cdFx0XHQvLyBpZiBmb3JtYXQgaXMgZmxleGlibGUgYW5kIHRoZSBjdXJyZW50IGZvcm1hdCBkb2Vzbid0IHN1cHBvcnQgYWxwaGEsIHN3aXRjaCB0byBhIHN1aXRhYmxlIG9uZVxyXG5cdFx0XHR2YXIgZm10ID0gdGhpc09iai5nZXRGb3JtYXQoKTtcclxuXHRcdFx0aWYgKHRoaXNPYmouZm9ybWF0LnRvTG93ZXJDYXNlKCkgPT09ICdhbnknICYmICFqc2MuaXNBbHBoYUZvcm1hdChmbXQpKSB7XHJcblx0XHRcdFx0dGhpc09iai5fc2V0Rm9ybWF0KGZtdCA9PT0gJ2hleCcgPyAnaGV4YScgOiAncmdiYScpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpc09iai5mcm9tSFNWQShudWxsLCBudWxsLCBudWxsLCB5VmFsKTtcclxuXHR9LFxyXG5cclxuXHJcblx0Y3JlYXRlUGFkQ2FudmFzIDogZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdHZhciByZXQgPSB7XHJcblx0XHRcdGVsbTogbnVsbCxcclxuXHRcdFx0ZHJhdzogbnVsbFxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgY2FudmFzID0ganNjLmNyZWF0ZUVsKCdjYW52YXMnKTtcclxuXHRcdHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcblx0XHR2YXIgZHJhd0Z1bmMgPSBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgdHlwZSkge1xyXG5cdFx0XHRjYW52YXMud2lkdGggPSB3aWR0aDtcclxuXHRcdFx0Y2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuXHJcblx0XHRcdGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuXHJcblx0XHRcdHZhciBoR3JhZCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCBjYW52YXMud2lkdGgsIDApO1xyXG5cdFx0XHRoR3JhZC5hZGRDb2xvclN0b3AoMCAvIDYsICcjRjAwJyk7XHJcblx0XHRcdGhHcmFkLmFkZENvbG9yU3RvcCgxIC8gNiwgJyNGRjAnKTtcclxuXHRcdFx0aEdyYWQuYWRkQ29sb3JTdG9wKDIgLyA2LCAnIzBGMCcpO1xyXG5cdFx0XHRoR3JhZC5hZGRDb2xvclN0b3AoMyAvIDYsICcjMEZGJyk7XHJcblx0XHRcdGhHcmFkLmFkZENvbG9yU3RvcCg0IC8gNiwgJyMwMEYnKTtcclxuXHRcdFx0aEdyYWQuYWRkQ29sb3JTdG9wKDUgLyA2LCAnI0YwRicpO1xyXG5cdFx0XHRoR3JhZC5hZGRDb2xvclN0b3AoNiAvIDYsICcjRjAwJyk7XHJcblxyXG5cdFx0XHRjdHguZmlsbFN0eWxlID0gaEdyYWQ7XHJcblx0XHRcdGN0eC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG5cclxuXHRcdFx0dmFyIHZHcmFkID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIGNhbnZhcy5oZWlnaHQpO1xyXG5cdFx0XHRzd2l0Y2ggKHR5cGUudG9Mb3dlckNhc2UoKSkge1xyXG5cdFx0XHRjYXNlICdzJzpcclxuXHRcdFx0XHR2R3JhZC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMjU1LDI1NSwyNTUsMCknKTtcclxuXHRcdFx0XHR2R3JhZC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMjU1LDI1NSwyNTUsMSknKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAndic6XHJcblx0XHRcdFx0dkdyYWQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDAsMCwwLDApJyk7XHJcblx0XHRcdFx0dkdyYWQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDAsMCwwLDEpJyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9IHZHcmFkO1xyXG5cdFx0XHRjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuXHRcdH07XHJcblxyXG5cdFx0cmV0LmVsbSA9IGNhbnZhcztcclxuXHRcdHJldC5kcmF3ID0gZHJhd0Z1bmM7XHJcblxyXG5cdFx0cmV0dXJuIHJldDtcclxuXHR9LFxyXG5cclxuXHJcblx0Y3JlYXRlU2xpZGVyR3JhZGllbnQgOiBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0dmFyIHJldCA9IHtcclxuXHRcdFx0ZWxtOiBudWxsLFxyXG5cdFx0XHRkcmF3OiBudWxsXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBjYW52YXMgPSBqc2MuY3JlYXRlRWwoJ2NhbnZhcycpO1xyXG5cdFx0dmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuXHRcdHZhciBkcmF3RnVuYyA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCBjb2xvcjEsIGNvbG9yMikge1xyXG5cdFx0XHRjYW52YXMud2lkdGggPSB3aWR0aDtcclxuXHRcdFx0Y2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuXHJcblx0XHRcdGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuXHJcblx0XHRcdHZhciBncmFkID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIGNhbnZhcy5oZWlnaHQpO1xyXG5cdFx0XHRncmFkLmFkZENvbG9yU3RvcCgwLCBjb2xvcjEpO1xyXG5cdFx0XHRncmFkLmFkZENvbG9yU3RvcCgxLCBjb2xvcjIpO1xyXG5cclxuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9IGdyYWQ7XHJcblx0XHRcdGN0eC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG5cdFx0fTtcclxuXHJcblx0XHRyZXQuZWxtID0gY2FudmFzO1xyXG5cdFx0cmV0LmRyYXcgPSBkcmF3RnVuYztcclxuXHJcblx0XHRyZXR1cm4gcmV0O1xyXG5cdH0sXHJcblxyXG5cclxuXHRjcmVhdGVBU2xpZGVyR3JhZGllbnQgOiBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0dmFyIHJldCA9IHtcclxuXHRcdFx0ZWxtOiBudWxsLFxyXG5cdFx0XHRkcmF3OiBudWxsXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBjYW52YXMgPSBqc2MuY3JlYXRlRWwoJ2NhbnZhcycpO1xyXG5cdFx0dmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuXHRcdHZhciBkcmF3RnVuYyA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCBjb2xvcikge1xyXG5cdFx0XHRjYW52YXMud2lkdGggPSB3aWR0aDtcclxuXHRcdFx0Y2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuXHJcblx0XHRcdGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuXHJcblx0XHRcdHZhciBzcVNpemUgPSBjYW52YXMud2lkdGggLyAyO1xyXG5cdFx0XHR2YXIgc3FDb2xvcjEgPSBqc2MucHViLmNoZXNzYm9hcmRDb2xvcjE7XHJcblx0XHRcdHZhciBzcUNvbG9yMiA9IGpzYy5wdWIuY2hlc3Nib2FyZENvbG9yMjtcclxuXHJcblx0XHRcdC8vIGRhcmsgZ3JheSBiYWNrZ3JvdW5kXHJcblx0XHRcdGN0eC5maWxsU3R5bGUgPSBzcUNvbG9yMTtcclxuXHRcdFx0Y3R4LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcblxyXG5cdFx0XHRpZiAoc3FTaXplID4gMCkgeyAvLyB0byBhdm9pZCBpbmZpbml0ZSBsb29wXHJcblx0XHRcdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCBjYW52YXMuaGVpZ2h0OyB5ICs9IHNxU2l6ZSAqIDIpIHtcclxuXHRcdFx0XHRcdC8vIGxpZ2h0IGdyYXkgc3F1YXJlc1xyXG5cdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IHNxQ29sb3IyO1xyXG5cdFx0XHRcdFx0Y3R4LmZpbGxSZWN0KDAsIHksIHNxU2l6ZSwgc3FTaXplKTtcclxuXHRcdFx0XHRcdGN0eC5maWxsUmVjdChzcVNpemUsIHkgKyBzcVNpemUsIHNxU2l6ZSwgc3FTaXplKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBncmFkID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIGNhbnZhcy5oZWlnaHQpO1xyXG5cdFx0XHRncmFkLmFkZENvbG9yU3RvcCgwLCBjb2xvcik7XHJcblx0XHRcdGdyYWQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDAsMCwwLDApJyk7XHJcblxyXG5cdFx0XHRjdHguZmlsbFN0eWxlID0gZ3JhZDtcclxuXHRcdFx0Y3R4LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldC5lbG0gPSBjYW52YXM7XHJcblx0XHRyZXQuZHJhdyA9IGRyYXdGdW5jO1xyXG5cclxuXHRcdHJldHVybiByZXQ7XHJcblx0fSxcclxuXHJcblxyXG5cdEJveFNoYWRvdyA6IChmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgQm94U2hhZG93ID0gZnVuY3Rpb24gKGhTaGFkb3csIHZTaGFkb3csIGJsdXIsIHNwcmVhZCwgY29sb3IsIGluc2V0KSB7XHJcblx0XHRcdHRoaXMuaFNoYWRvdyA9IGhTaGFkb3c7XHJcblx0XHRcdHRoaXMudlNoYWRvdyA9IHZTaGFkb3c7XHJcblx0XHRcdHRoaXMuYmx1ciA9IGJsdXI7XHJcblx0XHRcdHRoaXMuc3ByZWFkID0gc3ByZWFkO1xyXG5cdFx0XHR0aGlzLmNvbG9yID0gY29sb3I7XHJcblx0XHRcdHRoaXMuaW5zZXQgPSAhIWluc2V0O1xyXG5cdFx0fTtcclxuXHJcblx0XHRCb3hTaGFkb3cucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgdmFscyA9IFtcclxuXHRcdFx0XHRNYXRoLnJvdW5kKHRoaXMuaFNoYWRvdykgKyAncHgnLFxyXG5cdFx0XHRcdE1hdGgucm91bmQodGhpcy52U2hhZG93KSArICdweCcsXHJcblx0XHRcdFx0TWF0aC5yb3VuZCh0aGlzLmJsdXIpICsgJ3B4JyxcclxuXHRcdFx0XHRNYXRoLnJvdW5kKHRoaXMuc3ByZWFkKSArICdweCcsXHJcblx0XHRcdFx0dGhpcy5jb2xvclxyXG5cdFx0XHRdO1xyXG5cdFx0XHRpZiAodGhpcy5pbnNldCkge1xyXG5cdFx0XHRcdHZhbHMucHVzaCgnaW5zZXQnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdmFscy5qb2luKCcgJyk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiBCb3hTaGFkb3c7XHJcblx0fSkoKSxcclxuXHJcblxyXG5cdGZsYWdzIDoge1xyXG5cdFx0bGVhdmVWYWx1ZSA6IDEgPDwgMCxcclxuXHRcdGxlYXZlQWxwaGEgOiAxIDw8IDEsXHJcblx0XHRsZWF2ZVByZXZpZXcgOiAxIDw8IDIsXHJcblx0fSxcclxuXHJcblxyXG5cdGVudW1PcHRzIDoge1xyXG5cdFx0Zm9ybWF0OiBbJ2F1dG8nLCAnYW55JywgJ2hleCcsICdoZXhhJywgJ3JnYicsICdyZ2JhJ10sXHJcblx0XHRwcmV2aWV3UG9zaXRpb246IFsnbGVmdCcsICdyaWdodCddLFxyXG5cdFx0bW9kZTogWydoc3YnLCAnaHZzJywgJ2hzJywgJ2h2J10sXHJcblx0XHRwb3NpdGlvbjogWydsZWZ0JywgJ3JpZ2h0JywgJ3RvcCcsICdib3R0b20nXSxcclxuXHRcdGFscGhhQ2hhbm5lbDogWydhdXRvJywgdHJ1ZSwgZmFsc2VdLFxyXG5cdFx0cGFsZXR0ZVNldHNBbHBoYTogWydhdXRvJywgdHJ1ZSwgZmFsc2VdLFxyXG5cdH0sXHJcblxyXG5cclxuXHRkZXByZWNhdGVkT3B0cyA6IHtcclxuXHRcdC8vIDxvbGRfb3B0aW9uPjogPG5ld19vcHRpb24+ICAoPG5ld19vcHRpb24+IGNhbiBiZSBudWxsKVxyXG5cdFx0J3N0eWxlRWxlbWVudCc6ICdwcmV2aWV3RWxlbWVudCcsXHJcblx0XHQnb25GaW5lQ2hhbmdlJzogJ29uSW5wdXQnLFxyXG5cdFx0J292ZXJ3cml0ZUltcG9ydGFudCc6ICdmb3JjZVN0eWxlJyxcclxuXHRcdCdjbG9zYWJsZSc6ICdjbG9zZUJ1dHRvbicsXHJcblx0XHQnaW5zZXRXaWR0aCc6ICdjb250cm9sQm9yZGVyV2lkdGgnLFxyXG5cdFx0J2luc2V0Q29sb3InOiAnY29udHJvbEJvcmRlckNvbG9yJyxcclxuXHRcdCdyZWZpbmUnOiBudWxsLFxyXG5cdH0sXHJcblxyXG5cclxuXHRkb2NzUmVmIDogJyAnICsgJ1NlZSBodHRwczovL2pzY29sb3IuY29tL2RvY3MvJyxcclxuXHJcblxyXG5cdC8vXHJcblx0Ly8gVXNhZ2U6XHJcblx0Ly8gdmFyIG15UGlja2VyID0gbmV3IEpTQ29sb3IoPHRhcmdldEVsZW1lbnQ+IFssIDxvcHRpb25zPl0pXHJcblx0Ly9cclxuXHQvLyAoY29uc3RydWN0b3IgaXMgYWNjZXNzaWJsZSB2aWEgYm90aCAnanNjb2xvcicgYW5kICdKU0NvbG9yJyBuYW1lKVxyXG5cdC8vXHJcblxyXG5cdHB1YiA6IGZ1bmN0aW9uICh0YXJnZXRFbGVtZW50LCBvcHRzKSB7XHJcblxyXG5cdFx0dmFyIFRISVMgPSB0aGlzO1xyXG5cclxuXHRcdGlmICghb3B0cykge1xyXG5cdFx0XHRvcHRzID0ge307XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5jaGFubmVscyA9IHtcclxuXHRcdFx0cjogMjU1LCAvLyByZWQgWzAtMjU1XVxyXG5cdFx0XHRnOiAyNTUsIC8vIGdyZWVuIFswLTI1NV1cclxuXHRcdFx0YjogMjU1LCAvLyBibHVlIFswLTI1NV1cclxuXHRcdFx0aDogMCwgLy8gaHVlIFswLTM2MF1cclxuXHRcdFx0czogMCwgLy8gc2F0dXJhdGlvbiBbMC0xMDBdXHJcblx0XHRcdHY6IDEwMCwgLy8gdmFsdWUgKGJyaWdodG5lc3MpIFswLTEwMF1cclxuXHRcdFx0YTogMS4wLCAvLyBhbHBoYSAob3BhY2l0eSkgWzAuMCAtIDEuMF1cclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gR2VuZXJhbCBvcHRpb25zXHJcblx0XHQvL1xyXG5cdFx0dGhpcy5mb3JtYXQgPSAnYXV0byc7IC8vICdhdXRvJyB8ICdhbnknIHwgJ2hleCcgfCAnaGV4YScgfCAncmdiJyB8ICdyZ2JhJyAtIEZvcm1hdCBvZiB0aGUgaW5wdXQvb3V0cHV0IHZhbHVlXHJcblx0XHR0aGlzLnZhbHVlID0gdW5kZWZpbmVkOyAvLyBJTklUSUFMIGNvbG9yIHZhbHVlIGluIGFueSBzdXBwb3J0ZWQgZm9ybWF0LiBUbyBjaGFuZ2UgaXQgbGF0ZXIsIHVzZSBtZXRob2QgZnJvbVN0cmluZygpLCBmcm9tSFNWQSgpLCBmcm9tUkdCQSgpIG9yIGNoYW5uZWwoKVxyXG5cdFx0dGhpcy5hbHBoYSA9IHVuZGVmaW5lZDsgLy8gSU5JVElBTCBhbHBoYSB2YWx1ZS4gVG8gY2hhbmdlIGl0IGxhdGVyLCBjYWxsIG1ldGhvZCBjaGFubmVsKCdBJywgPHZhbHVlPilcclxuXHRcdHRoaXMucmFuZG9tID0gZmFsc2U7IC8vIHdoZXRoZXIgdG8gcmFuZG9taXplIHRoZSBpbml0aWFsIGNvbG9yLiBFaXRoZXIgdHJ1ZSB8IGZhbHNlLCBvciBhbiBhcnJheSBvZiByYW5nZXM6IFttaW5WLCBtYXhWLCBtaW5TLCBtYXhTLCBtaW5ILCBtYXhILCBtaW5BLCBtYXhBXVxyXG5cdFx0dGhpcy5vbkNoYW5nZSA9IHVuZGVmaW5lZDsgLy8gY2FsbGVkIHdoZW4gY29sb3IgY2hhbmdlcy4gVmFsdWUgY2FuIGJlIGVpdGhlciBhIGZ1bmN0aW9uIG9yIGEgc3RyaW5nIHdpdGggSlMgY29kZS5cclxuXHRcdHRoaXMub25JbnB1dCA9IHVuZGVmaW5lZDsgLy8gY2FsbGVkIHJlcGVhdGVkbHkgYXMgdGhlIGNvbG9yIGlzIGJlaW5nIGNoYW5nZWQsIGUuZy4gd2hpbGUgZHJhZ2dpbmcgYSBzbGlkZXIuIFZhbHVlIGNhbiBiZSBlaXRoZXIgYSBmdW5jdGlvbiBvciBhIHN0cmluZyB3aXRoIEpTIGNvZGUuXHJcblx0XHR0aGlzLnZhbHVlRWxlbWVudCA9IHVuZGVmaW5lZDsgLy8gZWxlbWVudCB0aGF0IHdpbGwgYmUgdXNlZCB0byBkaXNwbGF5IGFuZCBpbnB1dCB0aGUgY29sb3IgdmFsdWVcclxuXHRcdHRoaXMuYWxwaGFFbGVtZW50ID0gdW5kZWZpbmVkOyAvLyBlbGVtZW50IHRoYXQgd2lsbCBiZSB1c2VkIHRvIGRpc3BsYXkgYW5kIGlucHV0IHRoZSBhbHBoYSAob3BhY2l0eSkgdmFsdWVcclxuXHRcdHRoaXMucHJldmlld0VsZW1lbnQgPSB1bmRlZmluZWQ7IC8vIGVsZW1lbnQgdGhhdCB3aWxsIHByZXZpZXcgdGhlIHBpY2tlZCBjb2xvciB1c2luZyBDU1MgYmFja2dyb3VuZFxyXG5cdFx0dGhpcy5wcmV2aWV3UG9zaXRpb24gPSAnbGVmdCc7IC8vICdsZWZ0JyB8ICdyaWdodCcgLSBwb3NpdGlvbiBvZiB0aGUgY29sb3IgcHJldmlldyBpbiBwcmV2aWV3RWxlbWVudFxyXG5cdFx0dGhpcy5wcmV2aWV3U2l6ZSA9IDMyOyAvLyAocHgpIHdpZHRoIG9mIHRoZSBjb2xvciBwcmV2aWV3IGRpc3BsYXllZCBpbiBwcmV2aWV3RWxlbWVudFxyXG5cdFx0dGhpcy5wcmV2aWV3UGFkZGluZyA9IDg7IC8vIChweCkgc3BhY2UgYmV0d2VlbiBjb2xvciBwcmV2aWV3IGFuZCBjb250ZW50IG9mIHRoZSBwcmV2aWV3RWxlbWVudFxyXG5cdFx0dGhpcy5yZXF1aXJlZCA9IHRydWU7IC8vIHdoZXRoZXIgdGhlIGFzc29jaWF0ZWQgdGV4dCBpbnB1dCBtdXN0IGFsd2F5cyBjb250YWluIGEgY29sb3IgdmFsdWUuIElmIGZhbHNlLCB0aGUgaW5wdXQgY2FuIGJlIGxlZnQgZW1wdHkuXHJcblx0XHR0aGlzLmhhc2ggPSB0cnVlOyAvLyB3aGV0aGVyIHRvIHByZWZpeCB0aGUgSEVYIGNvbG9yIGNvZGUgd2l0aCAjIHN5bWJvbCAob25seSBhcHBsaWNhYmxlIGZvciBIRVggZm9ybWF0KVxyXG5cdFx0dGhpcy51cHBlcmNhc2UgPSB0cnVlOyAvLyB3aGV0aGVyIHRvIHNob3cgdGhlIEhFWCBjb2xvciBjb2RlIGluIHVwcGVyIGNhc2UgKG9ubHkgYXBwbGljYWJsZSBmb3IgSEVYIGZvcm1hdClcclxuXHRcdHRoaXMuZm9yY2VTdHlsZSA9IHRydWU7IC8vIHdoZXRoZXIgdG8gb3ZlcndyaXRlIENTUyBzdHlsZSBvZiB0aGUgcHJldmlld0VsZW1lbnQgdXNpbmcgIWltcG9ydGFudCBmbGFnXHJcblxyXG5cdFx0Ly8gQ29sb3IgUGlja2VyIG9wdGlvbnNcclxuXHRcdC8vXHJcblx0XHR0aGlzLndpZHRoID0gMTgxOyAvLyB3aWR0aCBvZiB0aGUgY29sb3Igc3BlY3RydW0gKGluIHB4KVxyXG5cdFx0dGhpcy5oZWlnaHQgPSAxMDE7IC8vIGhlaWdodCBvZiB0aGUgY29sb3Igc3BlY3RydW0gKGluIHB4KVxyXG5cdFx0dGhpcy5tb2RlID0gJ0hTVic7IC8vICdIU1YnIHwgJ0hWUycgfCAnSFMnIHwgJ0hWJyAtIGxheW91dCBvZiB0aGUgY29sb3IgcGlja2VyIGNvbnRyb2xzXHJcblx0XHR0aGlzLmFscGhhQ2hhbm5lbCA9ICdhdXRvJzsgLy8gJ2F1dG8nIHwgdHJ1ZSB8IGZhbHNlIC0gaWYgYWxwaGEgY2hhbm5lbCBpcyBlbmFibGVkLCB0aGUgYWxwaGEgc2xpZGVyIHdpbGwgYmUgdmlzaWJsZS4gSWYgJ2F1dG8nLCBpdCB3aWxsIGJlIGRldGVybWluZWQgYWNjb3JkaW5nIHRvIGNvbG9yIGZvcm1hdFxyXG5cdFx0dGhpcy5wb3NpdGlvbiA9ICdib3R0b20nOyAvLyAnbGVmdCcgfCAncmlnaHQnIHwgJ3RvcCcgfCAnYm90dG9tJyAtIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSB0YXJnZXQgZWxlbWVudFxyXG5cdFx0dGhpcy5zbWFydFBvc2l0aW9uID0gdHJ1ZTsgLy8gYXV0b21hdGljYWxseSBjaGFuZ2UgcGlja2VyIHBvc2l0aW9uIHdoZW4gdGhlcmUgaXMgbm90IGVub3VnaCBzcGFjZSBmb3IgaXRcclxuXHRcdHRoaXMuc2hvd09uQ2xpY2sgPSB0cnVlOyAvLyB3aGV0aGVyIHRvIHNob3cgdGhlIHBpY2tlciB3aGVuIHVzZXIgY2xpY2tzIGl0cyB0YXJnZXQgZWxlbWVudFxyXG5cdFx0dGhpcy5oaWRlT25MZWF2ZSA9IHRydWU7IC8vIHdoZXRoZXIgdG8gYXV0b21hdGljYWxseSBoaWRlIHRoZSBwaWNrZXIgd2hlbiB1c2VyIGxlYXZlcyBpdHMgdGFyZ2V0IGVsZW1lbnQgKGUuZy4gdXBvbiBjbGlja2luZyB0aGUgZG9jdW1lbnQpXHJcblx0XHR0aGlzLnBhbGV0dGUgPSBbXTsgLy8gY29sb3JzIHRvIGJlIGRpc3BsYXllZCBpbiB0aGUgcGFsZXR0ZSwgc3BlY2lmaWVkIGFzIGFuIGFycmF5IG9yIGEgc3RyaW5nIG9mIHNwYWNlIHNlcGFyYXRlZCBjb2xvciB2YWx1ZXMgKGluIGFueSBzdXBwb3J0ZWQgZm9ybWF0KVxyXG5cdFx0dGhpcy5wYWxldHRlQ29scyA9IDEwOyAvLyBudW1iZXIgb2YgY29sdW1ucyBpbiB0aGUgcGFsZXR0ZVxyXG5cdFx0dGhpcy5wYWxldHRlU2V0c0FscGhhID0gJ2F1dG8nOyAvLyAnYXV0bycgfCB0cnVlIHwgZmFsc2UgLSBpZiB0cnVlLCBwYWxldHRlIGNvbG9ycyB0aGF0IGRvbid0IHNwZWNpZnkgYWxwaGEgd2lsbCBzZXQgYWxwaGEgdG8gMS4wXHJcblx0XHR0aGlzLnBhbGV0dGVIZWlnaHQgPSAxNjsgLy8gbWF4aW11bSBoZWlnaHQgKHB4KSBvZiBhIHJvdyBpbiB0aGUgcGFsZXR0ZVxyXG5cdFx0dGhpcy5wYWxldHRlU3BhY2luZyA9IDQ7IC8vIGRpc3RhbmNlIChweCkgYmV0d2VlbiBjb2xvciBzYW1wbGVzIGluIHRoZSBwYWxldHRlXHJcblx0XHR0aGlzLmhpZGVPblBhbGV0dGVDbGljayA9IGZhbHNlOyAvLyB3aGVuIHNldCB0byB0cnVlLCBjbGlja2luZyB0aGUgcGFsZXR0ZSB3aWxsIGFsc28gaGlkZSB0aGUgY29sb3IgcGlja2VyXHJcblx0XHR0aGlzLnNsaWRlclNpemUgPSAxNjsgLy8gcHhcclxuXHRcdHRoaXMuY3Jvc3NTaXplID0gODsgLy8gcHhcclxuXHRcdHRoaXMuY2xvc2VCdXR0b24gPSBmYWxzZTsgLy8gd2hldGhlciB0byBkaXNwbGF5IHRoZSBDbG9zZSBidXR0b25cclxuXHRcdHRoaXMuY2xvc2VUZXh0ID0gJ0Nsb3NlJztcclxuXHRcdHRoaXMuYnV0dG9uQ29sb3IgPSAncmdiYSgwLDAsMCwxKSc7IC8vIENTUyBjb2xvclxyXG5cdFx0dGhpcy5idXR0b25IZWlnaHQgPSAxODsgLy8gcHhcclxuXHRcdHRoaXMucGFkZGluZyA9IDEyOyAvLyBweFxyXG5cdFx0dGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwxKSc7IC8vIENTUyBjb2xvclxyXG5cdFx0dGhpcy5ib3JkZXJXaWR0aCA9IDE7IC8vIHB4XHJcblx0XHR0aGlzLmJvcmRlckNvbG9yID0gJ3JnYmEoMTg3LDE4NywxODcsMSknOyAvLyBDU1MgY29sb3JcclxuXHRcdHRoaXMuYm9yZGVyUmFkaXVzID0gODsgLy8gcHhcclxuXHRcdHRoaXMuY29udHJvbEJvcmRlcldpZHRoID0gMTsgLy8gcHhcclxuXHRcdHRoaXMuY29udHJvbEJvcmRlckNvbG9yID0gJ3JnYmEoMTg3LDE4NywxODcsMSknOyAvLyBDU1MgY29sb3JcclxuXHRcdHRoaXMuc2hhZG93ID0gdHJ1ZTsgLy8gd2hldGhlciB0byBkaXNwbGF5IGEgc2hhZG93XHJcblx0XHR0aGlzLnNoYWRvd0JsdXIgPSAxNTsgLy8gcHhcclxuXHRcdHRoaXMuc2hhZG93Q29sb3IgPSAncmdiYSgwLDAsMCwwLjIpJzsgLy8gQ1NTIGNvbG9yXHJcblx0XHR0aGlzLnBvaW50ZXJDb2xvciA9ICdyZ2JhKDc2LDc2LDc2LDEpJzsgLy8gQ1NTIGNvbG9yXHJcblx0XHR0aGlzLnBvaW50ZXJCb3JkZXJXaWR0aCA9IDE7IC8vIHB4XHJcblx0XHR0aGlzLnBvaW50ZXJCb3JkZXJDb2xvciA9ICdyZ2JhKDI1NSwyNTUsMjU1LDEpJzsgLy8gQ1NTIGNvbG9yXHJcblx0XHR0aGlzLnBvaW50ZXJUaGlja25lc3MgPSAyOyAvLyBweFxyXG5cdFx0dGhpcy56SW5kZXggPSA1MDAwO1xyXG5cdFx0dGhpcy5jb250YWluZXIgPSB1bmRlZmluZWQ7IC8vIHdoZXJlIHRvIGFwcGVuZCB0aGUgY29sb3IgcGlja2VyIChCT0RZIGVsZW1lbnQgYnkgZGVmYXVsdClcclxuXHJcblx0XHQvLyBFeHBlcmltZW50YWxcclxuXHRcdC8vXHJcblx0XHR0aGlzLm1pblMgPSAwOyAvLyBtaW4gYWxsb3dlZCBzYXR1cmF0aW9uICgwIC0gMTAwKVxyXG5cdFx0dGhpcy5tYXhTID0gMTAwOyAvLyBtYXggYWxsb3dlZCBzYXR1cmF0aW9uICgwIC0gMTAwKVxyXG5cdFx0dGhpcy5taW5WID0gMDsgLy8gbWluIGFsbG93ZWQgdmFsdWUgKGJyaWdodG5lc3MpICgwIC0gMTAwKVxyXG5cdFx0dGhpcy5tYXhWID0gMTAwOyAvLyBtYXggYWxsb3dlZCB2YWx1ZSAoYnJpZ2h0bmVzcykgKDAgLSAxMDApXHJcblx0XHR0aGlzLm1pbkEgPSAwLjA7IC8vIG1pbiBhbGxvd2VkIGFscGhhIChvcGFjaXR5KSAoMC4wIC0gMS4wKVxyXG5cdFx0dGhpcy5tYXhBID0gMS4wOyAvLyBtYXggYWxsb3dlZCBhbHBoYSAob3BhY2l0eSkgKDAuMCAtIDEuMClcclxuXHJcblxyXG5cdFx0Ly8gR2V0dGVyOiBvcHRpb24obmFtZSlcclxuXHRcdC8vIFNldHRlcjogb3B0aW9uKG5hbWUsIHZhbHVlKVxyXG5cdFx0Ly8gICAgICAgICBvcHRpb24oe25hbWU6dmFsdWUsIC4uLn0pXHJcblx0XHQvL1xyXG5cdFx0dGhpcy5vcHRpb24gPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignTm8gb3B0aW9uIHNwZWNpZmllZCcpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdC8vIGdldHRpbmcgYSBzaW5nbGUgb3B0aW9uXHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHJldHVybiBnZXRPcHRpb24oYXJndW1lbnRzWzBdKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRcdH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAyICYmIHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0Ly8gc2V0dGluZyBhIHNpbmdsZSBvcHRpb25cclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0aWYgKCFzZXRPcHRpb24oYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oZSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMucmVkcmF3KCk7IC8vIGltbWVkaWF0ZWx5IHJlZHJhd3MgdGhlIHBpY2tlciwgaWYgaXQncyBkaXNwbGF5ZWRcclxuXHRcdFx0XHR0aGlzLmV4cG9zZUNvbG9yKCk7IC8vIGluIGNhc2Ugc29tZSBwcmV2aWV3LXJlbGF0ZWQgb3IgZm9ybWF0LXJlbGF0ZWQgb3B0aW9uIHdhcyBjaGFuZ2VkXHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ29iamVjdCcpIHtcclxuXHRcdFx0XHQvLyBzZXR0aW5nIG11bHRpcGxlIG9wdGlvbnNcclxuXHRcdFx0XHR2YXIgb3B0cyA9IGFyZ3VtZW50c1swXTtcclxuXHRcdFx0XHR2YXIgc3VjY2VzcyA9IHRydWU7XHJcblx0XHRcdFx0Zm9yICh2YXIgb3B0IGluIG9wdHMpIHtcclxuXHRcdFx0XHRcdGlmIChvcHRzLmhhc093blByb3BlcnR5KG9wdCkpIHtcclxuXHRcdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIXNldE9wdGlvbihvcHQsIG9wdHNbb3B0XSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHN1Y2Nlc3MgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oZSk7XHJcblx0XHRcdFx0XHRcdFx0c3VjY2VzcyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMucmVkcmF3KCk7IC8vIGltbWVkaWF0ZWx5IHJlZHJhd3MgdGhlIHBpY2tlciwgaWYgaXQncyBkaXNwbGF5ZWRcclxuXHRcdFx0XHR0aGlzLmV4cG9zZUNvbG9yKCk7IC8vIGluIGNhc2Ugc29tZSBwcmV2aWV3LXJlbGF0ZWQgb3IgZm9ybWF0LXJlbGF0ZWQgb3B0aW9uIHdhcyBjaGFuZ2VkXHJcblx0XHRcdFx0cmV0dXJuIHN1Y2Nlc3M7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBhcmd1bWVudHMnKTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gR2V0dGVyOiBjaGFubmVsKG5hbWUpXHJcblx0XHQvLyBTZXR0ZXI6IGNoYW5uZWwobmFtZSwgdmFsdWUpXHJcblx0XHQvL1xyXG5cdFx0dGhpcy5jaGFubmVsID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XHJcblx0XHRcdGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdmFsdWUgZm9yIGNoYW5uZWwgbmFtZTogJyArIG5hbWUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdC8vIGdldHRpbmcgY2hhbm5lbCB2YWx1ZVxyXG5cdFx0XHRcdGlmICghdGhpcy5jaGFubmVscy5oYXNPd25Qcm9wZXJ0eShuYW1lLnRvTG93ZXJDYXNlKCkpKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oJ0dldHRpbmcgdW5rbm93biBjaGFubmVsOiAnICsgbmFtZSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiB0aGlzLmNoYW5uZWxzW25hbWUudG9Mb3dlckNhc2UoKV07XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8vIHNldHRpbmcgY2hhbm5lbCB2YWx1ZVxyXG5cdFx0XHRcdHZhciByZXMgPSBmYWxzZTtcclxuXHRcdFx0XHRzd2l0Y2ggKG5hbWUudG9Mb3dlckNhc2UoKSkge1xyXG5cdFx0XHRcdFx0Y2FzZSAncic6IHJlcyA9IHRoaXMuZnJvbVJHQkEodmFsdWUsIG51bGwsIG51bGwsIG51bGwpOyBicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2cnOiByZXMgPSB0aGlzLmZyb21SR0JBKG51bGwsIHZhbHVlLCBudWxsLCBudWxsKTsgYnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdiJzogcmVzID0gdGhpcy5mcm9tUkdCQShudWxsLCBudWxsLCB2YWx1ZSwgbnVsbCk7IGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnaCc6IHJlcyA9IHRoaXMuZnJvbUhTVkEodmFsdWUsIG51bGwsIG51bGwsIG51bGwpOyBicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ3MnOiByZXMgPSB0aGlzLmZyb21IU1ZBKG51bGwsIHZhbHVlLCBudWxsLCBudWxsKTsgYnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICd2JzogcmVzID0gdGhpcy5mcm9tSFNWQShudWxsLCBudWxsLCB2YWx1ZSwgbnVsbCk7IGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnYSc6IHJlcyA9IHRoaXMuZnJvbUhTVkEobnVsbCwgbnVsbCwgbnVsbCwgdmFsdWUpOyBicmVhaztcclxuXHRcdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUud2FybignU2V0dGluZyB1bmtub3duIGNoYW5uZWw6ICcgKyBuYW1lKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAocmVzKSB7XHJcblx0XHRcdFx0XHR0aGlzLnJlZHJhdygpOyAvLyBpbW1lZGlhdGVseSByZWRyYXdzIHRoZSBwaWNrZXIsIGlmIGl0J3MgZGlzcGxheWVkXHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gVHJpZ2dlcnMgZ2l2ZW4gaW5wdXQgZXZlbnQocykgYnk6XHJcblx0XHQvLyAtIGV4ZWN1dGluZyBvbjxFdmVudD4gY2FsbGJhY2sgc3BlY2lmaWVkIGFzIHBpY2tlcidzIG9wdGlvblxyXG5cdFx0Ly8gLSB0cmlnZ2VyaW5nIHN0YW5kYXJkIERPTSBldmVudCBsaXN0ZW5lcnMgYXR0YWNoZWQgdG8gdGhlIHZhbHVlIGVsZW1lbnRcclxuXHRcdC8vXHJcblx0XHQvLyBJdCBpcyBwb3NzaWJsZSB0byBzcGVjaWZ5IG11bHRpcGxlIGV2ZW50cyBzZXBhcmF0ZWQgd2l0aCBhIHNwYWNlLlxyXG5cdFx0Ly9cclxuXHRcdHRoaXMudHJpZ2dlciA9IGZ1bmN0aW9uIChldmVudE5hbWVzKSB7XHJcblx0XHRcdHZhciBldnMgPSBqc2Muc3RyTGlzdChldmVudE5hbWVzKTtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBldnMubGVuZ3RoOyBpICs9IDEpIHtcclxuXHRcdFx0XHR2YXIgZXYgPSBldnNbaV0udG9Mb3dlckNhc2UoKTtcclxuXHJcblx0XHRcdFx0Ly8gdHJpZ2dlciBhIGNhbGxiYWNrXHJcblx0XHRcdFx0dmFyIGNhbGxiYWNrUHJvcCA9IG51bGw7XHJcblx0XHRcdFx0c3dpdGNoIChldikge1xyXG5cdFx0XHRcdFx0Y2FzZSAnaW5wdXQnOiBjYWxsYmFja1Byb3AgPSAnb25JbnB1dCc7IGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnY2hhbmdlJzogY2FsbGJhY2tQcm9wID0gJ29uQ2hhbmdlJzsgYnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChjYWxsYmFja1Byb3ApIHtcclxuXHRcdFx0XHRcdGpzYy50cmlnZ2VyQ2FsbGJhY2sodGhpcywgY2FsbGJhY2tQcm9wKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIHRyaWdnZXIgc3RhbmRhcmQgRE9NIGV2ZW50IGxpc3RlbmVycyBvbiB0aGUgdmFsdWUgZWxlbWVudFxyXG5cdFx0XHRcdGpzYy50cmlnZ2VySW5wdXRFdmVudCh0aGlzLnZhbHVlRWxlbWVudCwgZXYsIHRydWUsIHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHQvLyBoOiAwLTM2MFxyXG5cdFx0Ly8gczogMC0xMDBcclxuXHRcdC8vIHY6IDAtMTAwXHJcblx0XHQvLyBhOiAwLjAtMS4wXHJcblx0XHQvL1xyXG5cdFx0dGhpcy5mcm9tSFNWQSA9IGZ1bmN0aW9uIChoLCBzLCB2LCBhLCBmbGFncykgeyAvLyBudWxsID0gZG9uJ3QgY2hhbmdlXHJcblx0XHRcdGlmIChoID09PSB1bmRlZmluZWQpIHsgaCA9IG51bGw7IH1cclxuXHRcdFx0aWYgKHMgPT09IHVuZGVmaW5lZCkgeyBzID0gbnVsbDsgfVxyXG5cdFx0XHRpZiAodiA9PT0gdW5kZWZpbmVkKSB7IHYgPSBudWxsOyB9XHJcblx0XHRcdGlmIChhID09PSB1bmRlZmluZWQpIHsgYSA9IG51bGw7IH1cclxuXHJcblx0XHRcdGlmIChoICE9PSBudWxsKSB7XHJcblx0XHRcdFx0aWYgKGlzTmFOKGgpKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFx0XHRcdHRoaXMuY2hhbm5lbHMuaCA9IE1hdGgubWF4KDAsIE1hdGgubWluKDM2MCwgaCkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChzICE9PSBudWxsKSB7XHJcblx0XHRcdFx0aWYgKGlzTmFOKHMpKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFx0XHRcdHRoaXMuY2hhbm5lbHMucyA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEwMCwgdGhpcy5tYXhTLCBzKSwgdGhpcy5taW5TKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodiAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdGlmIChpc05hTih2KSkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcdFx0XHR0aGlzLmNoYW5uZWxzLnYgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxMDAsIHRoaXMubWF4ViwgdiksIHRoaXMubWluVik7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGEgIT09IG51bGwpIHtcclxuXHRcdFx0XHRpZiAoaXNOYU4oYSkpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0XHRcdFx0dGhpcy5jaGFubmVscy5hID0gdGhpcy5oYXNBbHBoYUNoYW5uZWwoKSA/XHJcblx0XHRcdFx0XHRNYXRoLm1heCgwLCBNYXRoLm1pbigxLCB0aGlzLm1heEEsIGEpLCB0aGlzLm1pbkEpIDpcclxuXHRcdFx0XHRcdDEuMDsgLy8gaWYgYWxwaGEgY2hhbm5lbCBpcyBkaXNhYmxlZCwgdGhlIGNvbG9yIHNob3VsZCBzdGF5IDEwMCUgb3BhcXVlXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciByZ2IgPSBqc2MuSFNWX1JHQihcclxuXHRcdFx0XHR0aGlzLmNoYW5uZWxzLmgsXHJcblx0XHRcdFx0dGhpcy5jaGFubmVscy5zLFxyXG5cdFx0XHRcdHRoaXMuY2hhbm5lbHMudlxyXG5cdFx0XHQpO1xyXG5cdFx0XHR0aGlzLmNoYW5uZWxzLnIgPSByZ2JbMF07XHJcblx0XHRcdHRoaXMuY2hhbm5lbHMuZyA9IHJnYlsxXTtcclxuXHRcdFx0dGhpcy5jaGFubmVscy5iID0gcmdiWzJdO1xyXG5cclxuXHRcdFx0dGhpcy5leHBvc2VDb2xvcihmbGFncyk7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0Ly8gcjogMC0yNTVcclxuXHRcdC8vIGc6IDAtMjU1XHJcblx0XHQvLyBiOiAwLTI1NVxyXG5cdFx0Ly8gYTogMC4wLTEuMFxyXG5cdFx0Ly9cclxuXHRcdHRoaXMuZnJvbVJHQkEgPSBmdW5jdGlvbiAociwgZywgYiwgYSwgZmxhZ3MpIHsgLy8gbnVsbCA9IGRvbid0IGNoYW5nZVxyXG5cdFx0XHRpZiAociA9PT0gdW5kZWZpbmVkKSB7IHIgPSBudWxsOyB9XHJcblx0XHRcdGlmIChnID09PSB1bmRlZmluZWQpIHsgZyA9IG51bGw7IH1cclxuXHRcdFx0aWYgKGIgPT09IHVuZGVmaW5lZCkgeyBiID0gbnVsbDsgfVxyXG5cdFx0XHRpZiAoYSA9PT0gdW5kZWZpbmVkKSB7IGEgPSBudWxsOyB9XHJcblxyXG5cdFx0XHRpZiAociAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdGlmIChpc05hTihyKSkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcdFx0XHRyID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCByKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGcgIT09IG51bGwpIHtcclxuXHRcdFx0XHRpZiAoaXNOYU4oZykpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0XHRcdFx0ZyA9IE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgZykpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChiICE9PSBudWxsKSB7XHJcblx0XHRcdFx0aWYgKGlzTmFOKGIpKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFx0XHRcdGIgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIGIpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoYSAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdGlmIChpc05hTihhKSkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcdFx0XHR0aGlzLmNoYW5uZWxzLmEgPSB0aGlzLmhhc0FscGhhQ2hhbm5lbCgpID9cclxuXHRcdFx0XHRcdE1hdGgubWF4KDAsIE1hdGgubWluKDEsIHRoaXMubWF4QSwgYSksIHRoaXMubWluQSkgOlxyXG5cdFx0XHRcdFx0MS4wOyAvLyBpZiBhbHBoYSBjaGFubmVsIGlzIGRpc2FibGVkLCB0aGUgY29sb3Igc2hvdWxkIHN0YXkgMTAwJSBvcGFxdWVcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIGhzdiA9IGpzYy5SR0JfSFNWKFxyXG5cdFx0XHRcdHI9PT1udWxsID8gdGhpcy5jaGFubmVscy5yIDogcixcclxuXHRcdFx0XHRnPT09bnVsbCA/IHRoaXMuY2hhbm5lbHMuZyA6IGcsXHJcblx0XHRcdFx0Yj09PW51bGwgPyB0aGlzLmNoYW5uZWxzLmIgOiBiXHJcblx0XHRcdCk7XHJcblx0XHRcdGlmIChoc3ZbMF0gIT09IG51bGwpIHtcclxuXHRcdFx0XHR0aGlzLmNoYW5uZWxzLmggPSBNYXRoLm1heCgwLCBNYXRoLm1pbigzNjAsIGhzdlswXSkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChoc3ZbMl0gIT09IDApIHsgLy8gZnVsbHkgYmxhY2sgY29sb3Igc3RheXMgYmxhY2sgdGhyb3VnaCBlbnRpcmUgc2F0dXJhdGlvbiByYW5nZSwgc28gbGV0J3Mgbm90IGNoYW5nZSBzYXR1cmF0aW9uXHJcblx0XHRcdFx0dGhpcy5jaGFubmVscy5zID0gTWF0aC5tYXgoMCwgdGhpcy5taW5TLCBNYXRoLm1pbigxMDAsIHRoaXMubWF4UywgaHN2WzFdKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5jaGFubmVscy52ID0gTWF0aC5tYXgoMCwgdGhpcy5taW5WLCBNYXRoLm1pbigxMDAsIHRoaXMubWF4ViwgaHN2WzJdKSk7XHJcblxyXG5cdFx0XHQvLyB1cGRhdGUgUkdCIGFjY29yZGluZyB0byBmaW5hbCBIU1YsIGFzIHNvbWUgdmFsdWVzIG1pZ2h0IGJlIHRyaW1tZWRcclxuXHRcdFx0dmFyIHJnYiA9IGpzYy5IU1ZfUkdCKHRoaXMuY2hhbm5lbHMuaCwgdGhpcy5jaGFubmVscy5zLCB0aGlzLmNoYW5uZWxzLnYpO1xyXG5cdFx0XHR0aGlzLmNoYW5uZWxzLnIgPSByZ2JbMF07XHJcblx0XHRcdHRoaXMuY2hhbm5lbHMuZyA9IHJnYlsxXTtcclxuXHRcdFx0dGhpcy5jaGFubmVscy5iID0gcmdiWzJdO1xyXG5cclxuXHRcdFx0dGhpcy5leHBvc2VDb2xvcihmbGFncyk7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0Ly8gREVQUkVDQVRFRC4gVXNlIC5mcm9tSFNWQSgpIGluc3RlYWRcclxuXHRcdC8vXHJcblx0XHR0aGlzLmZyb21IU1YgPSBmdW5jdGlvbiAoaCwgcywgdiwgZmxhZ3MpIHtcclxuXHRcdFx0Y29uc29sZS53YXJuKCdmcm9tSFNWKCkgbWV0aG9kIGlzIERFUFJFQ0FURUQuIFVzaW5nIGZyb21IU1ZBKCkgaW5zdGVhZC4nICsganNjLmRvY3NSZWYpO1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5mcm9tSFNWQShoLCBzLCB2LCBudWxsLCBmbGFncyk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHQvLyBERVBSRUNBVEVELiBVc2UgLmZyb21SR0JBKCkgaW5zdGVhZFxyXG5cdFx0Ly9cclxuXHRcdHRoaXMuZnJvbVJHQiA9IGZ1bmN0aW9uIChyLCBnLCBiLCBmbGFncykge1xyXG5cdFx0XHRjb25zb2xlLndhcm4oJ2Zyb21SR0IoKSBtZXRob2QgaXMgREVQUkVDQVRFRC4gVXNpbmcgZnJvbVJHQkEoKSBpbnN0ZWFkLicgKyBqc2MuZG9jc1JlZik7XHJcblx0XHRcdHJldHVybiB0aGlzLmZyb21SR0JBKHIsIGcsIGIsIG51bGwsIGZsYWdzKTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHRoaXMuZnJvbVN0cmluZyA9IGZ1bmN0aW9uIChzdHIsIGZsYWdzKSB7XHJcblx0XHRcdGlmICghdGhpcy5yZXF1aXJlZCAmJiBzdHIudHJpbSgpID09PSAnJykge1xyXG5cdFx0XHRcdC8vIHNldHRpbmcgZW1wdHkgc3RyaW5nIHRvIGFuIG9wdGlvbmFsIGNvbG9yIGlucHV0XHJcblx0XHRcdFx0dGhpcy5zZXRQcmV2aWV3RWxlbWVudEJnKG51bGwpO1xyXG5cdFx0XHRcdHRoaXMuc2V0VmFsdWVFbGVtZW50VmFsdWUoJycpO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgY29sb3IgPSBqc2MucGFyc2VDb2xvclN0cmluZyhzdHIpO1xyXG5cdFx0XHRpZiAoIWNvbG9yKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlOyAvLyBjb3VsZCBub3QgcGFyc2VcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodGhpcy5mb3JtYXQudG9Mb3dlckNhc2UoKSA9PT0gJ2FueScpIHtcclxuXHRcdFx0XHR0aGlzLl9zZXRGb3JtYXQoY29sb3IuZm9ybWF0KTsgLy8gYWRhcHQgZm9ybWF0XHJcblx0XHRcdFx0aWYgKCFqc2MuaXNBbHBoYUZvcm1hdCh0aGlzLmdldEZvcm1hdCgpKSkge1xyXG5cdFx0XHRcdFx0Y29sb3IucmdiYVszXSA9IDEuMDsgLy8gd2hlbiBzd2l0Y2hpbmcgdG8gYSBmb3JtYXQgdGhhdCBkb2Vzbid0IHN1cHBvcnQgYWxwaGEsIHNldCBmdWxsIG9wYWNpdHlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5mcm9tUkdCQShcclxuXHRcdFx0XHRjb2xvci5yZ2JhWzBdLFxyXG5cdFx0XHRcdGNvbG9yLnJnYmFbMV0sXHJcblx0XHRcdFx0Y29sb3IucmdiYVsyXSxcclxuXHRcdFx0XHRjb2xvci5yZ2JhWzNdLFxyXG5cdFx0XHRcdGZsYWdzXHJcblx0XHRcdCk7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy5yYW5kb21pemUgPSBmdW5jdGlvbiAobWluViwgbWF4ViwgbWluUywgbWF4UywgbWluSCwgbWF4SCwgbWluQSwgbWF4QSkge1xyXG5cdFx0XHRpZiAobWluViA9PT0gdW5kZWZpbmVkKSB7IG1pblYgPSAwOyB9XHJcblx0XHRcdGlmIChtYXhWID09PSB1bmRlZmluZWQpIHsgbWF4ViA9IDEwMDsgfVxyXG5cdFx0XHRpZiAobWluUyA9PT0gdW5kZWZpbmVkKSB7IG1pblMgPSAwOyB9XHJcblx0XHRcdGlmIChtYXhTID09PSB1bmRlZmluZWQpIHsgbWF4UyA9IDEwMDsgfVxyXG5cdFx0XHRpZiAobWluSCA9PT0gdW5kZWZpbmVkKSB7IG1pbkggPSAwOyB9XHJcblx0XHRcdGlmIChtYXhIID09PSB1bmRlZmluZWQpIHsgbWF4SCA9IDM1OTsgfVxyXG5cdFx0XHRpZiAobWluQSA9PT0gdW5kZWZpbmVkKSB7IG1pbkEgPSAxOyB9XHJcblx0XHRcdGlmIChtYXhBID09PSB1bmRlZmluZWQpIHsgbWF4QSA9IDE7IH1cclxuXHJcblx0XHRcdHRoaXMuZnJvbUhTVkEoXHJcblx0XHRcdFx0bWluSCArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXhIIC0gbWluSCArIDEpKSxcclxuXHRcdFx0XHRtaW5TICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heFMgLSBtaW5TICsgMSkpLFxyXG5cdFx0XHRcdG1pblYgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4ViAtIG1pblYgKyAxKSksXHJcblx0XHRcdFx0KCgxMDAgKiBtaW5BKSArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgxMDAgKiAobWF4QSAtIG1pbkEpICsgMSkpKSAvIDEwMFxyXG5cdFx0XHQpO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy50b1N0cmluZyA9IGZ1bmN0aW9uIChmb3JtYXQpIHtcclxuXHRcdFx0aWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0Zm9ybWF0ID0gdGhpcy5nZXRGb3JtYXQoKTsgLy8gZm9ybWF0IG5vdCBzcGVjaWZpZWQgLT4gdXNlIHRoZSBjdXJyZW50IGZvcm1hdFxyXG5cdFx0XHR9XHJcblx0XHRcdHN3aXRjaCAoZm9ybWF0LnRvTG93ZXJDYXNlKCkpIHtcclxuXHRcdFx0XHRjYXNlICdoZXgnOiByZXR1cm4gdGhpcy50b0hFWFN0cmluZygpOyBicmVhaztcclxuXHRcdFx0XHRjYXNlICdoZXhhJzogcmV0dXJuIHRoaXMudG9IRVhBU3RyaW5nKCk7IGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ3JnYic6IHJldHVybiB0aGlzLnRvUkdCU3RyaW5nKCk7IGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ3JnYmEnOiByZXR1cm4gdGhpcy50b1JHQkFTdHJpbmcoKTsgYnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy50b0hFWFN0cmluZyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0cmV0dXJuIGpzYy5oZXhDb2xvcihcclxuXHRcdFx0XHR0aGlzLmNoYW5uZWxzLnIsXHJcblx0XHRcdFx0dGhpcy5jaGFubmVscy5nLFxyXG5cdFx0XHRcdHRoaXMuY2hhbm5lbHMuYlxyXG5cdFx0XHQpO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy50b0hFWEFTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHJldHVybiBqc2MuaGV4YUNvbG9yKFxyXG5cdFx0XHRcdHRoaXMuY2hhbm5lbHMucixcclxuXHRcdFx0XHR0aGlzLmNoYW5uZWxzLmcsXHJcblx0XHRcdFx0dGhpcy5jaGFubmVscy5iLFxyXG5cdFx0XHRcdHRoaXMuY2hhbm5lbHMuYVxyXG5cdFx0XHQpO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy50b1JHQlN0cmluZyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0cmV0dXJuIGpzYy5yZ2JDb2xvcihcclxuXHRcdFx0XHR0aGlzLmNoYW5uZWxzLnIsXHJcblx0XHRcdFx0dGhpcy5jaGFubmVscy5nLFxyXG5cdFx0XHRcdHRoaXMuY2hhbm5lbHMuYlxyXG5cdFx0XHQpO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy50b1JHQkFTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHJldHVybiBqc2MucmdiYUNvbG9yKFxyXG5cdFx0XHRcdHRoaXMuY2hhbm5lbHMucixcclxuXHRcdFx0XHR0aGlzLmNoYW5uZWxzLmcsXHJcblx0XHRcdFx0dGhpcy5jaGFubmVscy5iLFxyXG5cdFx0XHRcdHRoaXMuY2hhbm5lbHMuYVxyXG5cdFx0XHQpO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy50b0dyYXlzY2FsZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHQwLjIxMyAqIHRoaXMuY2hhbm5lbHMuciArXHJcblx0XHRcdFx0MC43MTUgKiB0aGlzLmNoYW5uZWxzLmcgK1xyXG5cdFx0XHRcdDAuMDcyICogdGhpcy5jaGFubmVscy5iXHJcblx0XHRcdCk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLnRvQ2FudmFzID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRyZXR1cm4ganNjLmdlbkNvbG9yUHJldmlld0NhbnZhcyh0aGlzLnRvUkdCQVN0cmluZygpKS5jYW52YXM7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLnRvRGF0YVVSTCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMudG9DYW52YXMoKS50b0RhdGFVUkwoKTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHRoaXMudG9CYWNrZ3JvdW5kID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRyZXR1cm4ganNjLnB1Yi5iYWNrZ3JvdW5kKHRoaXMudG9SR0JBU3RyaW5nKCkpO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy5pc0xpZ2h0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy50b0dyYXlzY2FsZSgpID4gMjU1IC8gMjtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHRoaXMuaGlkZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKGlzUGlja2VyT3duZXIoKSkge1xyXG5cdFx0XHRcdGRldGFjaFBpY2tlcigpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLnNob3cgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGRyYXdQaWNrZXIoKTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHRoaXMucmVkcmF3ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoaXNQaWNrZXJPd25lcigpKSB7XHJcblx0XHRcdFx0ZHJhd1BpY2tlcigpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLmdldEZvcm1hdCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuX2N1cnJlbnRGb3JtYXQ7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLl9zZXRGb3JtYXQgPSBmdW5jdGlvbiAoZm9ybWF0KSB7XHJcblx0XHRcdHRoaXMuX2N1cnJlbnRGb3JtYXQgPSBmb3JtYXQudG9Mb3dlckNhc2UoKTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHRoaXMuaGFzQWxwaGFDaGFubmVsID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAodGhpcy5hbHBoYUNoYW5uZWwgPT09ICdhdXRvJykge1xyXG5cdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHR0aGlzLmZvcm1hdC50b0xvd2VyQ2FzZSgpID09PSAnYW55JyB8fCAvLyBmb3JtYXQgY2FuIGNoYW5nZSBvbiB0aGUgZmx5IChlLmcuIGZyb20gaGV4IHRvIHJnYmEpLCBzbyBsZXQncyBjb25zaWRlciB0aGUgYWxwaGEgY2hhbm5lbCBlbmFibGVkXHJcblx0XHRcdFx0XHRqc2MuaXNBbHBoYUZvcm1hdCh0aGlzLmdldEZvcm1hdCgpKSB8fCAvLyB0aGUgY3VycmVudCBmb3JtYXQgc3VwcG9ydHMgYWxwaGEgY2hhbm5lbFxyXG5cdFx0XHRcdFx0dGhpcy5hbHBoYSAhPT0gdW5kZWZpbmVkIHx8IC8vIGluaXRpYWwgYWxwaGEgdmFsdWUgaXMgc2V0LCBzbyB3ZSdyZSB3b3JraW5nIHdpdGggYWxwaGEgY2hhbm5lbFxyXG5cdFx0XHRcdFx0dGhpcy5hbHBoYUVsZW1lbnQgIT09IHVuZGVmaW5lZCAvLyB0aGUgYWxwaGEgdmFsdWUgaXMgcmVkaXJlY3RlZCwgc28gd2UncmUgd29ya2luZyB3aXRoIGFscGhhIGNoYW5uZWxcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hbHBoYUNoYW5uZWw7IC8vIHRoZSBhbHBoYSBjaGFubmVsIGlzIGV4cGxpY2l0bHkgc2V0XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLnByb2Nlc3NWYWx1ZUlucHV0ID0gZnVuY3Rpb24gKHN0cikge1xyXG5cdFx0XHRpZiAoIXRoaXMuZnJvbVN0cmluZyhzdHIpKSB7XHJcblx0XHRcdFx0Ly8gY291bGQgbm90IHBhcnNlIHRoZSBjb2xvciB2YWx1ZSAtIGxldCdzIGp1c3QgZXhwb3NlIHRoZSBjdXJyZW50IGNvbG9yXHJcblx0XHRcdFx0dGhpcy5leHBvc2VDb2xvcigpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLnByb2Nlc3NBbHBoYUlucHV0ID0gZnVuY3Rpb24gKHN0cikge1xyXG5cdFx0XHRpZiAoIXRoaXMuZnJvbUhTVkEobnVsbCwgbnVsbCwgbnVsbCwgcGFyc2VGbG9hdChzdHIpKSkge1xyXG5cdFx0XHRcdC8vIGNvdWxkIG5vdCBwYXJzZSB0aGUgYWxwaGEgdmFsdWUgLSBsZXQncyBqdXN0IGV4cG9zZSB0aGUgY3VycmVudCBjb2xvclxyXG5cdFx0XHRcdHRoaXMuZXhwb3NlQ29sb3IoKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy5leHBvc2VDb2xvciA9IGZ1bmN0aW9uIChmbGFncykge1xyXG5cdFx0XHR2YXIgY29sb3JTdHIgPSB0aGlzLnRvU3RyaW5nKCk7XHJcblx0XHRcdHZhciBmbXQgPSB0aGlzLmdldEZvcm1hdCgpO1xyXG5cclxuXHRcdFx0Ly8gcmVmbGVjdCBjdXJyZW50IGNvbG9yIGluIGRhdGEtIGF0dHJpYnV0ZVxyXG5cdFx0XHRqc2Muc2V0RGF0YUF0dHIodGhpcy50YXJnZXRFbGVtZW50LCAnY3VycmVudC1jb2xvcicsIGNvbG9yU3RyKTtcclxuXHJcblx0XHRcdGlmICghKGZsYWdzICYganNjLmZsYWdzLmxlYXZlVmFsdWUpICYmIHRoaXMudmFsdWVFbGVtZW50KSB7XHJcblx0XHRcdFx0aWYgKGZtdCA9PT0gJ2hleCcgfHwgZm10ID09PSAnaGV4YScpIHtcclxuXHRcdFx0XHRcdGlmICghdGhpcy51cHBlcmNhc2UpIHsgY29sb3JTdHIgPSBjb2xvclN0ci50b0xvd2VyQ2FzZSgpOyB9XHJcblx0XHRcdFx0XHRpZiAoIXRoaXMuaGFzaCkgeyBjb2xvclN0ciA9IGNvbG9yU3RyLnJlcGxhY2UoL14jLywgJycpOyB9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMuc2V0VmFsdWVFbGVtZW50VmFsdWUoY29sb3JTdHIpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIShmbGFncyAmIGpzYy5mbGFncy5sZWF2ZUFscGhhKSAmJiB0aGlzLmFscGhhRWxlbWVudCkge1xyXG5cdFx0XHRcdHZhciBhbHBoYVZhbCA9IE1hdGgucm91bmQodGhpcy5jaGFubmVscy5hICogMTAwKSAvIDEwMDtcclxuXHRcdFx0XHR0aGlzLnNldEFscGhhRWxlbWVudFZhbHVlKGFscGhhVmFsKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCEoZmxhZ3MgJiBqc2MuZmxhZ3MubGVhdmVQcmV2aWV3KSAmJiB0aGlzLnByZXZpZXdFbGVtZW50KSB7XHJcblx0XHRcdFx0dmFyIHByZXZpZXdQb3MgPSBudWxsOyAvLyAnbGVmdCcgfCAncmlnaHQnIChudWxsIC0+IGZpbGwgdGhlIGVudGlyZSBlbGVtZW50KVxyXG5cclxuXHRcdFx0XHRpZiAoXHJcblx0XHRcdFx0XHRqc2MuaXNUZXh0SW5wdXQodGhpcy5wcmV2aWV3RWxlbWVudCkgfHwgLy8gdGV4dCBpbnB1dFxyXG5cdFx0XHRcdFx0KGpzYy5pc0J1dHRvbih0aGlzLnByZXZpZXdFbGVtZW50KSAmJiAhanNjLmlzQnV0dG9uRW1wdHkodGhpcy5wcmV2aWV3RWxlbWVudCkpIC8vIGJ1dHRvbiB3aXRoIHRleHRcclxuXHRcdFx0XHQpIHtcclxuXHRcdFx0XHRcdHByZXZpZXdQb3MgPSB0aGlzLnByZXZpZXdQb3NpdGlvbjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMuc2V0UHJldmlld0VsZW1lbnRCZyh0aGlzLnRvUkdCQVN0cmluZygpKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGlzUGlja2VyT3duZXIoKSkge1xyXG5cdFx0XHRcdHJlZHJhd1BhZCgpO1xyXG5cdFx0XHRcdHJlZHJhd1NsZCgpO1xyXG5cdFx0XHRcdHJlZHJhd0FTbGQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy5zZXRQcmV2aWV3RWxlbWVudEJnID0gZnVuY3Rpb24gKGNvbG9yKSB7XHJcblx0XHRcdGlmICghdGhpcy5wcmV2aWV3RWxlbWVudCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHBvc2l0aW9uID0gbnVsbDsgLy8gY29sb3IgcHJldmlldyBwb3NpdGlvbjogIG51bGwgfCAnbGVmdCcgfCAncmlnaHQnXHJcblx0XHRcdHZhciB3aWR0aCA9IG51bGw7IC8vIGNvbG9yIHByZXZpZXcgd2lkdGg6ICBweCB8IG51bGwgPSBmaWxsIHRoZSBlbnRpcmUgZWxlbWVudFxyXG5cdFx0XHRpZiAoXHJcblx0XHRcdFx0anNjLmlzVGV4dElucHV0KHRoaXMucHJldmlld0VsZW1lbnQpIHx8IC8vIHRleHQgaW5wdXRcclxuXHRcdFx0XHQoanNjLmlzQnV0dG9uKHRoaXMucHJldmlld0VsZW1lbnQpICYmICFqc2MuaXNCdXR0b25FbXB0eSh0aGlzLnByZXZpZXdFbGVtZW50KSkgLy8gYnV0dG9uIHdpdGggdGV4dFxyXG5cdFx0XHQpIHtcclxuXHRcdFx0XHRwb3NpdGlvbiA9IHRoaXMucHJldmlld1Bvc2l0aW9uO1xyXG5cdFx0XHRcdHdpZHRoID0gdGhpcy5wcmV2aWV3U2l6ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIGJhY2tncm91bmRzID0gW107XHJcblxyXG5cdFx0XHRpZiAoIWNvbG9yKSB7XHJcblx0XHRcdFx0Ly8gdGhlcmUgaXMgbm8gY29sb3IgcHJldmlldyB0byBkaXNwbGF5IC0+IGxldCdzIHJlbW92ZSBhbnkgcHJldmlvdXMgYmFja2dyb3VuZCBpbWFnZVxyXG5cdFx0XHRcdGJhY2tncm91bmRzLnB1c2goe1xyXG5cdFx0XHRcdFx0aW1hZ2U6ICdub25lJyxcclxuXHRcdFx0XHRcdHBvc2l0aW9uOiAnbGVmdCB0b3AnLFxyXG5cdFx0XHRcdFx0c2l6ZTogJ2F1dG8nLFxyXG5cdFx0XHRcdFx0cmVwZWF0OiAnbm8tcmVwZWF0JyxcclxuXHRcdFx0XHRcdG9yaWdpbjogJ3BhZGRpbmctYm94JyxcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvLyBDU1MgZ3JhZGllbnQgZm9yIGJhY2tncm91bmQgY29sb3IgcHJldmlld1xyXG5cdFx0XHRcdGJhY2tncm91bmRzLnB1c2goe1xyXG5cdFx0XHRcdFx0aW1hZ2U6IGpzYy5nZW5Db2xvclByZXZpZXdHcmFkaWVudChcclxuXHRcdFx0XHRcdFx0Y29sb3IsXHJcblx0XHRcdFx0XHRcdHBvc2l0aW9uLFxyXG5cdFx0XHRcdFx0XHR3aWR0aCA/IHdpZHRoIC0ganNjLnB1Yi5wcmV2aWV3U2VwYXJhdG9yLmxlbmd0aCA6IG51bGxcclxuXHRcdFx0XHRcdCksXHJcblx0XHRcdFx0XHRwb3NpdGlvbjogJ2xlZnQgdG9wJyxcclxuXHRcdFx0XHRcdHNpemU6ICdhdXRvJyxcclxuXHRcdFx0XHRcdHJlcGVhdDogcG9zaXRpb24gPyAncmVwZWF0LXknIDogJ3JlcGVhdCcsXHJcblx0XHRcdFx0XHRvcmlnaW46ICdwYWRkaW5nLWJveCcsXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdC8vIGRhdGEgVVJMIG9mIGdlbmVyYXRlZCBQTkcgaW1hZ2Ugd2l0aCBhIGdyYXkgdHJhbnNwYXJlbmN5IGNoZXNzYm9hcmRcclxuXHRcdFx0XHR2YXIgcHJldmlldyA9IGpzYy5nZW5Db2xvclByZXZpZXdDYW52YXMoXHJcblx0XHRcdFx0XHQncmdiYSgwLDAsMCwwKScsXHJcblx0XHRcdFx0XHRwb3NpdGlvbiA/IHsnbGVmdCc6J3JpZ2h0JywgJ3JpZ2h0JzonbGVmdCd9W3Bvc2l0aW9uXSA6IG51bGwsXHJcblx0XHRcdFx0XHR3aWR0aCxcclxuXHRcdFx0XHRcdHRydWVcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHRcdGJhY2tncm91bmRzLnB1c2goe1xyXG5cdFx0XHRcdFx0aW1hZ2U6ICd1cmwoXFwnJyArIHByZXZpZXcuY2FudmFzLnRvRGF0YVVSTCgpICsgJ1xcJyknLFxyXG5cdFx0XHRcdFx0cG9zaXRpb246IChwb3NpdGlvbiB8fCAnbGVmdCcpICsgJyB0b3AnLFxyXG5cdFx0XHRcdFx0c2l6ZTogcHJldmlldy53aWR0aCArICdweCAnICsgcHJldmlldy5oZWlnaHQgKyAncHgnLFxyXG5cdFx0XHRcdFx0cmVwZWF0OiBwb3NpdGlvbiA/ICdyZXBlYXQteScgOiAncmVwZWF0JyxcclxuXHRcdFx0XHRcdG9yaWdpbjogJ3BhZGRpbmctYm94JyxcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIGJnID0ge1xyXG5cdFx0XHRcdGltYWdlOiBbXSxcclxuXHRcdFx0XHRwb3NpdGlvbjogW10sXHJcblx0XHRcdFx0c2l6ZTogW10sXHJcblx0XHRcdFx0cmVwZWF0OiBbXSxcclxuXHRcdFx0XHRvcmlnaW46IFtdLFxyXG5cdFx0XHR9O1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGJhY2tncm91bmRzLmxlbmd0aDsgaSArPSAxKSB7XHJcblx0XHRcdFx0YmcuaW1hZ2UucHVzaChiYWNrZ3JvdW5kc1tpXS5pbWFnZSk7XHJcblx0XHRcdFx0YmcucG9zaXRpb24ucHVzaChiYWNrZ3JvdW5kc1tpXS5wb3NpdGlvbik7XHJcblx0XHRcdFx0Ymcuc2l6ZS5wdXNoKGJhY2tncm91bmRzW2ldLnNpemUpO1xyXG5cdFx0XHRcdGJnLnJlcGVhdC5wdXNoKGJhY2tncm91bmRzW2ldLnJlcGVhdCk7XHJcblx0XHRcdFx0Ymcub3JpZ2luLnB1c2goYmFja2dyb3VuZHNbaV0ub3JpZ2luKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gc2V0IHByZXZpZXdFbGVtZW50J3MgYmFja2dyb3VuZC1pbWFnZXNcclxuXHRcdFx0dmFyIHN0eSA9IHtcclxuXHRcdFx0XHQnYmFja2dyb3VuZC1pbWFnZSc6IGJnLmltYWdlLmpvaW4oJywgJyksXHJcblx0XHRcdFx0J2JhY2tncm91bmQtcG9zaXRpb24nOiBiZy5wb3NpdGlvbi5qb2luKCcsICcpLFxyXG5cdFx0XHRcdCdiYWNrZ3JvdW5kLXNpemUnOiBiZy5zaXplLmpvaW4oJywgJyksXHJcblx0XHRcdFx0J2JhY2tncm91bmQtcmVwZWF0JzogYmcucmVwZWF0LmpvaW4oJywgJyksXHJcblx0XHRcdFx0J2JhY2tncm91bmQtb3JpZ2luJzogYmcub3JpZ2luLmpvaW4oJywgJyksXHJcblx0XHRcdH07XHJcblx0XHRcdGpzYy5zZXRTdHlsZSh0aGlzLnByZXZpZXdFbGVtZW50LCBzdHksIHRoaXMuZm9yY2VTdHlsZSk7XHJcblxyXG5cclxuXHRcdFx0Ly8gc2V0L3Jlc3RvcmUgcHJldmlld0VsZW1lbnQncyBwYWRkaW5nXHJcblx0XHRcdHZhciBwYWRkaW5nID0ge1xyXG5cdFx0XHRcdGxlZnQ6IG51bGwsXHJcblx0XHRcdFx0cmlnaHQ6IG51bGwsXHJcblx0XHRcdH07XHJcblx0XHRcdGlmIChwb3NpdGlvbikge1xyXG5cdFx0XHRcdHBhZGRpbmdbcG9zaXRpb25dID0gKHRoaXMucHJldmlld1NpemUgKyB0aGlzLnByZXZpZXdQYWRkaW5nKSArICdweCc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBzdHkgPSB7XHJcblx0XHRcdFx0J3BhZGRpbmctbGVmdCc6IHBhZGRpbmcubGVmdCxcclxuXHRcdFx0XHQncGFkZGluZy1yaWdodCc6IHBhZGRpbmcucmlnaHQsXHJcblx0XHRcdH07XHJcblx0XHRcdGpzYy5zZXRTdHlsZSh0aGlzLnByZXZpZXdFbGVtZW50LCBzdHksIHRoaXMuZm9yY2VTdHlsZSwgdHJ1ZSk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLnNldFZhbHVlRWxlbWVudFZhbHVlID0gZnVuY3Rpb24gKHN0cikge1xyXG5cdFx0XHRpZiAodGhpcy52YWx1ZUVsZW1lbnQpIHtcclxuXHRcdFx0XHRpZiAoanNjLm5vZGVOYW1lKHRoaXMudmFsdWVFbGVtZW50KSA9PT0gJ2lucHV0Jykge1xyXG5cdFx0XHRcdFx0dGhpcy52YWx1ZUVsZW1lbnQudmFsdWUgPSBzdHI7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMudmFsdWVFbGVtZW50LmlubmVySFRNTCA9IHN0cjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHRoaXMuc2V0QWxwaGFFbGVtZW50VmFsdWUgPSBmdW5jdGlvbiAoc3RyKSB7XHJcblx0XHRcdGlmICh0aGlzLmFscGhhRWxlbWVudCkge1xyXG5cdFx0XHRcdGlmIChqc2Mubm9kZU5hbWUodGhpcy5hbHBoYUVsZW1lbnQpID09PSAnaW5wdXQnKSB7XHJcblx0XHRcdFx0XHR0aGlzLmFscGhhRWxlbWVudC52YWx1ZSA9IHN0cjtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5hbHBoYUVsZW1lbnQuaW5uZXJIVE1MID0gc3RyO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy5fcHJvY2Vzc1BhcmVudEVsZW1lbnRzSW5ET00gPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICh0aGlzLl9wYXJlbnRFbGVtZW50c1Byb2Nlc3NlZCkgeyByZXR1cm47IH1cclxuXHRcdFx0dGhpcy5fcGFyZW50RWxlbWVudHNQcm9jZXNzZWQgPSB0cnVlO1xyXG5cclxuXHRcdFx0dmFyIGVsbSA9IHRoaXMudGFyZ2V0RWxlbWVudDtcclxuXHRcdFx0ZG8ge1xyXG5cdFx0XHRcdC8vIElmIHRoZSB0YXJnZXQgZWxlbWVudCBvciBvbmUgb2YgaXRzIHBhcmVudCBub2RlcyBoYXMgZml4ZWQgcG9zaXRpb24sXHJcblx0XHRcdFx0Ly8gdGhlbiB1c2UgZml4ZWQgcG9zaXRpb25pbmcgaW5zdGVhZFxyXG5cdFx0XHRcdHZhciBjb21wU3R5bGUgPSBqc2MuZ2V0Q29tcFN0eWxlKGVsbSk7XHJcblx0XHRcdFx0aWYgKGNvbXBTdHlsZS5wb3NpdGlvbiAmJiBjb21wU3R5bGUucG9zaXRpb24udG9Mb3dlckNhc2UoKSA9PT0gJ2ZpeGVkJykge1xyXG5cdFx0XHRcdFx0dGhpcy5maXhlZCA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoZWxtICE9PSB0aGlzLnRhcmdldEVsZW1lbnQpIHtcclxuXHRcdFx0XHRcdC8vIEVuc3VyZSB0byBhdHRhY2ggb25QYXJlbnRTY3JvbGwgb25seSBvbmNlIHRvIGVhY2ggcGFyZW50IGVsZW1lbnRcclxuXHRcdFx0XHRcdC8vIChtdWx0aXBsZSB0YXJnZXRFbGVtZW50cyBjYW4gc2hhcmUgdGhlIHNhbWUgcGFyZW50IG5vZGVzKVxyXG5cdFx0XHRcdFx0Ly9cclxuXHRcdFx0XHRcdC8vIE5vdGU6IEl0J3Mgbm90IGp1c3Qgb2Zmc2V0UGFyZW50cyB0aGF0IGNhbiBiZSBzY3JvbGxhYmxlLFxyXG5cdFx0XHRcdFx0Ly8gdGhhdCdzIHdoeSB3ZSBsb29wIHRocm91Z2ggYWxsIHBhcmVudCBub2Rlc1xyXG5cdFx0XHRcdFx0aWYgKCFqc2MuZ2V0RGF0YShlbG0sICdoYXNTY3JvbGxMaXN0ZW5lcicpKSB7XHJcblx0XHRcdFx0XHRcdGVsbS5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBqc2Mub25QYXJlbnRTY3JvbGwsIGZhbHNlKTtcclxuXHRcdFx0XHRcdFx0anNjLnNldERhdGEoZWxtLCAnaGFzU2Nyb2xsTGlzdGVuZXInLCB0cnVlKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gd2hpbGUgKChlbG0gPSBlbG0ucGFyZW50Tm9kZSkgJiYganNjLm5vZGVOYW1lKGVsbSkgIT09ICdib2R5Jyk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLnRyeUhpZGUgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICh0aGlzLmhpZGVPbkxlYXZlKSB7XHJcblx0XHRcdFx0dGhpcy5oaWRlKCk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHRoaXMuc2V0X19wYWxldHRlID0gZnVuY3Rpb24gKHZhbCkge1xyXG5cdFx0XHR0aGlzLnBhbGV0dGUgPSB2YWw7XHJcblx0XHRcdHRoaXMuX3BhbGV0dGUgPSBqc2MucGFyc2VQYWxldHRlVmFsdWUodmFsKTtcclxuXHRcdFx0dGhpcy5fcGFsZXR0ZUhhc1RyYW5zcGFyZW5jeSA9IGpzYy5jb250YWluc1RyYW5wYXJlbnRDb2xvcih0aGlzLl9wYWxldHRlKTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIHNldE9wdGlvbiAob3B0aW9uLCB2YWx1ZSkge1xyXG5cdFx0XHRpZiAodHlwZW9mIG9wdGlvbiAhPT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdmFsdWUgZm9yIG9wdGlvbiBuYW1lOiAnICsgb3B0aW9uKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gZW51bSBvcHRpb25cclxuXHRcdFx0aWYgKGpzYy5lbnVtT3B0cy5oYXNPd25Qcm9wZXJ0eShvcHRpb24pKSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHsgLy8gZW51bSBzdHJpbmcgdmFsdWVzIGFyZSBjYXNlIGluc2Vuc2l0aXZlXHJcblx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChqc2MuZW51bU9wdHNbb3B0aW9uXS5pbmRleE9mKHZhbHVlKSA9PT0gLTEpIHtcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignT3B0aW9uIFxcJycgKyBvcHRpb24gKyAnXFwnIGhhcyBpbnZhbGlkIHZhbHVlOiAnICsgdmFsdWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gZGVwcmVjYXRlZCBvcHRpb25cclxuXHRcdFx0aWYgKGpzYy5kZXByZWNhdGVkT3B0cy5oYXNPd25Qcm9wZXJ0eShvcHRpb24pKSB7XHJcblx0XHRcdFx0dmFyIG9sZE9wdCA9IG9wdGlvbjtcclxuXHRcdFx0XHR2YXIgbmV3T3B0ID0ganNjLmRlcHJlY2F0ZWRPcHRzW29wdGlvbl07XHJcblx0XHRcdFx0aWYgKG5ld09wdCkge1xyXG5cdFx0XHRcdFx0Ly8gaWYgd2UgaGF2ZSBhIG5ldyBuYW1lIGZvciB0aGlzIG9wdGlvbiwgbGV0J3MgbG9nIGEgd2FybmluZyBhbmQgdXNlIHRoZSBuZXcgbmFtZVxyXG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKCdPcHRpb24gXFwnJXNcXCcgaXMgREVQUkVDQVRFRCwgdXNpbmcgXFwnJXNcXCcgaW5zdGVhZC4nICsganNjLmRvY3NSZWYsIG9sZE9wdCwgbmV3T3B0KTtcclxuXHRcdFx0XHRcdG9wdGlvbiA9IG5ld09wdDtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gbmV3IG5hbWUgbm90IGF2YWlsYWJsZSBmb3IgdGhlIG9wdGlvblxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdPcHRpb24gXFwnJyArIG9wdGlvbiArICdcXCcgaXMgREVQUkVDQVRFRCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHNldHRlciA9ICdzZXRfXycgKyBvcHRpb247XHJcblxyXG5cdFx0XHRpZiAodHlwZW9mIFRISVNbc2V0dGVyXSA9PT0gJ2Z1bmN0aW9uJykgeyAvLyBhIHNldHRlciBleGlzdHMgZm9yIHRoaXMgb3B0aW9uXHJcblx0XHRcdFx0VEhJU1tzZXR0ZXJdKHZhbHVlKTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHJcblx0XHRcdH0gZWxzZSBpZiAob3B0aW9uIGluIFRISVMpIHsgLy8gb3B0aW9uIGV4aXN0cyBhcyBhIHByb3BlcnR5XHJcblx0XHRcdFx0VEhJU1tvcHRpb25dID0gdmFsdWU7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignVW5yZWNvZ25pemVkIGNvbmZpZ3VyYXRpb24gb3B0aW9uOiAnICsgb3B0aW9uKTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2V0T3B0aW9uIChvcHRpb24pIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBvcHRpb24gIT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHZhbHVlIGZvciBvcHRpb24gbmFtZTogJyArIG9wdGlvbik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGRlcHJlY2F0ZWQgb3B0aW9uXHJcblx0XHRcdGlmIChqc2MuZGVwcmVjYXRlZE9wdHMuaGFzT3duUHJvcGVydHkob3B0aW9uKSkge1xyXG5cdFx0XHRcdHZhciBvbGRPcHQgPSBvcHRpb247XHJcblx0XHRcdFx0dmFyIG5ld09wdCA9IGpzYy5kZXByZWNhdGVkT3B0c1tvcHRpb25dO1xyXG5cdFx0XHRcdGlmIChuZXdPcHQpIHtcclxuXHRcdFx0XHRcdC8vIGlmIHdlIGhhdmUgYSBuZXcgbmFtZSBmb3IgdGhpcyBvcHRpb24sIGxldCdzIGxvZyBhIHdhcm5pbmcgYW5kIHVzZSB0aGUgbmV3IG5hbWVcclxuXHRcdFx0XHRcdGNvbnNvbGUud2FybignT3B0aW9uIFxcJyVzXFwnIGlzIERFUFJFQ0FURUQsIHVzaW5nIFxcJyVzXFwnIGluc3RlYWQuJyArIGpzYy5kb2NzUmVmLCBvbGRPcHQsIG5ld09wdCk7XHJcblx0XHRcdFx0XHRvcHRpb24gPSBuZXdPcHQ7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIG5ldyBuYW1lIG5vdCBhdmFpbGFibGUgZm9yIHRoZSBvcHRpb25cclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignT3B0aW9uIFxcJycgKyBvcHRpb24gKyAnXFwnIGlzIERFUFJFQ0FURUQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBnZXR0ZXIgPSAnZ2V0X18nICsgb3B0aW9uO1xyXG5cclxuXHRcdFx0aWYgKHR5cGVvZiBUSElTW2dldHRlcl0gPT09ICdmdW5jdGlvbicpIHsgLy8gYSBnZXR0ZXIgZXhpc3RzIGZvciB0aGlzIG9wdGlvblxyXG5cdFx0XHRcdHJldHVybiBUSElTW2dldHRlcl0odmFsdWUpO1xyXG5cclxuXHRcdFx0fSBlbHNlIGlmIChvcHRpb24gaW4gVEhJUykgeyAvLyBvcHRpb24gZXhpc3RzIGFzIGEgcHJvcGVydHlcclxuXHRcdFx0XHRyZXR1cm4gVEhJU1tvcHRpb25dO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1VucmVjb2duaXplZCBjb25maWd1cmF0aW9uIG9wdGlvbjogJyArIG9wdGlvbik7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIGRldGFjaFBpY2tlciAoKSB7XHJcblx0XHRcdGpzYy5yZW1vdmVDbGFzcyhUSElTLnRhcmdldEVsZW1lbnQsIGpzYy5wdWIuYWN0aXZlQ2xhc3NOYW1lKTtcclxuXHRcdFx0anNjLnBpY2tlci53cmFwLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoanNjLnBpY2tlci53cmFwKTtcclxuXHRcdFx0ZGVsZXRlIGpzYy5waWNrZXIub3duZXI7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIGRyYXdQaWNrZXIgKCkge1xyXG5cclxuXHRcdFx0Ly8gQXQgdGhpcyBwb2ludCwgd2hlbiBkcmF3aW5nIHRoZSBwaWNrZXIsIHdlIGtub3cgd2hhdCB0aGUgcGFyZW50IGVsZW1lbnRzIGFyZVxyXG5cdFx0XHQvLyBhbmQgd2UgY2FuIGRvIGFsbCByZWxhdGVkIERPTSBvcGVyYXRpb25zLCBzdWNoIGFzIHJlZ2lzdGVyaW5nIGV2ZW50cyBvbiB0aGVtXHJcblx0XHRcdC8vIG9yIGNoZWNraW5nIHRoZWlyIHBvc2l0aW9uaW5nXHJcblx0XHRcdFRISVMuX3Byb2Nlc3NQYXJlbnRFbGVtZW50c0luRE9NKCk7XHJcblxyXG5cdFx0XHRpZiAoIWpzYy5waWNrZXIpIHtcclxuXHRcdFx0XHRqc2MucGlja2VyID0ge1xyXG5cdFx0XHRcdFx0b3duZXI6IG51bGwsIC8vIG93bmVyIHBpY2tlciBpbnN0YW5jZVxyXG5cdFx0XHRcdFx0d3JhcCA6IGpzYy5jcmVhdGVFbCgnZGl2JyksXHJcblx0XHRcdFx0XHRib3ggOiBqc2MuY3JlYXRlRWwoJ2RpdicpLFxyXG5cdFx0XHRcdFx0Ym94UyA6IGpzYy5jcmVhdGVFbCgnZGl2JyksIC8vIHNoYWRvdyBhcmVhXHJcblx0XHRcdFx0XHRib3hCIDoganNjLmNyZWF0ZUVsKCdkaXYnKSwgLy8gYm9yZGVyXHJcblx0XHRcdFx0XHRwYWQgOiBqc2MuY3JlYXRlRWwoJ2RpdicpLFxyXG5cdFx0XHRcdFx0cGFkQiA6IGpzYy5jcmVhdGVFbCgnZGl2JyksIC8vIGJvcmRlclxyXG5cdFx0XHRcdFx0cGFkTSA6IGpzYy5jcmVhdGVFbCgnZGl2JyksIC8vIG1vdXNlL3RvdWNoIGFyZWFcclxuXHRcdFx0XHRcdHBhZENhbnZhcyA6IGpzYy5jcmVhdGVQYWRDYW52YXMoKSxcclxuXHRcdFx0XHRcdGNyb3NzIDoganNjLmNyZWF0ZUVsKCdkaXYnKSxcclxuXHRcdFx0XHRcdGNyb3NzQlkgOiBqc2MuY3JlYXRlRWwoJ2RpdicpLCAvLyBib3JkZXIgWVxyXG5cdFx0XHRcdFx0Y3Jvc3NCWCA6IGpzYy5jcmVhdGVFbCgnZGl2JyksIC8vIGJvcmRlciBYXHJcblx0XHRcdFx0XHRjcm9zc0xZIDoganNjLmNyZWF0ZUVsKCdkaXYnKSwgLy8gbGluZSBZXHJcblx0XHRcdFx0XHRjcm9zc0xYIDoganNjLmNyZWF0ZUVsKCdkaXYnKSwgLy8gbGluZSBYXHJcblx0XHRcdFx0XHRzbGQgOiBqc2MuY3JlYXRlRWwoJ2RpdicpLCAvLyBzbGlkZXJcclxuXHRcdFx0XHRcdHNsZEIgOiBqc2MuY3JlYXRlRWwoJ2RpdicpLCAvLyBib3JkZXJcclxuXHRcdFx0XHRcdHNsZE0gOiBqc2MuY3JlYXRlRWwoJ2RpdicpLCAvLyBtb3VzZS90b3VjaCBhcmVhXHJcblx0XHRcdFx0XHRzbGRHcmFkIDoganNjLmNyZWF0ZVNsaWRlckdyYWRpZW50KCksXHJcblx0XHRcdFx0XHRzbGRQdHJTIDoganNjLmNyZWF0ZUVsKCdkaXYnKSwgLy8gc2xpZGVyIHBvaW50ZXIgc3BhY2VyXHJcblx0XHRcdFx0XHRzbGRQdHJJQiA6IGpzYy5jcmVhdGVFbCgnZGl2JyksIC8vIHNsaWRlciBwb2ludGVyIGlubmVyIGJvcmRlclxyXG5cdFx0XHRcdFx0c2xkUHRyTUIgOiBqc2MuY3JlYXRlRWwoJ2RpdicpLCAvLyBzbGlkZXIgcG9pbnRlciBtaWRkbGUgYm9yZGVyXHJcblx0XHRcdFx0XHRzbGRQdHJPQiA6IGpzYy5jcmVhdGVFbCgnZGl2JyksIC8vIHNsaWRlciBwb2ludGVyIG91dGVyIGJvcmRlclxyXG5cdFx0XHRcdFx0YXNsZCA6IGpzYy5jcmVhdGVFbCgnZGl2JyksIC8vIGFscGhhIHNsaWRlclxyXG5cdFx0XHRcdFx0YXNsZEIgOiBqc2MuY3JlYXRlRWwoJ2RpdicpLCAvLyBib3JkZXJcclxuXHRcdFx0XHRcdGFzbGRNIDoganNjLmNyZWF0ZUVsKCdkaXYnKSwgLy8gbW91c2UvdG91Y2ggYXJlYVxyXG5cdFx0XHRcdFx0YXNsZEdyYWQgOiBqc2MuY3JlYXRlQVNsaWRlckdyYWRpZW50KCksXHJcblx0XHRcdFx0XHRhc2xkUHRyUyA6IGpzYy5jcmVhdGVFbCgnZGl2JyksIC8vIHNsaWRlciBwb2ludGVyIHNwYWNlclxyXG5cdFx0XHRcdFx0YXNsZFB0cklCIDoganNjLmNyZWF0ZUVsKCdkaXYnKSwgLy8gc2xpZGVyIHBvaW50ZXIgaW5uZXIgYm9yZGVyXHJcblx0XHRcdFx0XHRhc2xkUHRyTUIgOiBqc2MuY3JlYXRlRWwoJ2RpdicpLCAvLyBzbGlkZXIgcG9pbnRlciBtaWRkbGUgYm9yZGVyXHJcblx0XHRcdFx0XHRhc2xkUHRyT0IgOiBqc2MuY3JlYXRlRWwoJ2RpdicpLCAvLyBzbGlkZXIgcG9pbnRlciBvdXRlciBib3JkZXJcclxuXHRcdFx0XHRcdHBhbCA6IGpzYy5jcmVhdGVFbCgnZGl2JyksIC8vIHBhbGV0dGVcclxuXHRcdFx0XHRcdGJ0biA6IGpzYy5jcmVhdGVFbCgnZGl2JyksXHJcblx0XHRcdFx0XHRidG5UIDoganNjLmNyZWF0ZUVsKCdkaXYnKSwgLy8gdGV4dFxyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdGpzYy5waWNrZXIucGFkLmFwcGVuZENoaWxkKGpzYy5waWNrZXIucGFkQ2FudmFzLmVsbSk7XHJcblx0XHRcdFx0anNjLnBpY2tlci5wYWRCLmFwcGVuZENoaWxkKGpzYy5waWNrZXIucGFkKTtcclxuXHRcdFx0XHRqc2MucGlja2VyLmNyb3NzLmFwcGVuZENoaWxkKGpzYy5waWNrZXIuY3Jvc3NCWSk7XHJcblx0XHRcdFx0anNjLnBpY2tlci5jcm9zcy5hcHBlbmRDaGlsZChqc2MucGlja2VyLmNyb3NzQlgpO1xyXG5cdFx0XHRcdGpzYy5waWNrZXIuY3Jvc3MuYXBwZW5kQ2hpbGQoanNjLnBpY2tlci5jcm9zc0xZKTtcclxuXHRcdFx0XHRqc2MucGlja2VyLmNyb3NzLmFwcGVuZENoaWxkKGpzYy5waWNrZXIuY3Jvc3NMWCk7XHJcblx0XHRcdFx0anNjLnBpY2tlci5wYWRCLmFwcGVuZENoaWxkKGpzYy5waWNrZXIuY3Jvc3MpO1xyXG5cdFx0XHRcdGpzYy5waWNrZXIuYm94LmFwcGVuZENoaWxkKGpzYy5waWNrZXIucGFkQik7XHJcblx0XHRcdFx0anNjLnBpY2tlci5ib3guYXBwZW5kQ2hpbGQoanNjLnBpY2tlci5wYWRNKTtcclxuXHJcblx0XHRcdFx0anNjLnBpY2tlci5zbGQuYXBwZW5kQ2hpbGQoanNjLnBpY2tlci5zbGRHcmFkLmVsbSk7XHJcblx0XHRcdFx0anNjLnBpY2tlci5zbGRCLmFwcGVuZENoaWxkKGpzYy5waWNrZXIuc2xkKTtcclxuXHRcdFx0XHRqc2MucGlja2VyLnNsZEIuYXBwZW5kQ2hpbGQoanNjLnBpY2tlci5zbGRQdHJPQik7XHJcblx0XHRcdFx0anNjLnBpY2tlci5zbGRQdHJPQi5hcHBlbmRDaGlsZChqc2MucGlja2VyLnNsZFB0ck1CKTtcclxuXHRcdFx0XHRqc2MucGlja2VyLnNsZFB0ck1CLmFwcGVuZENoaWxkKGpzYy5waWNrZXIuc2xkUHRySUIpO1xyXG5cdFx0XHRcdGpzYy5waWNrZXIuc2xkUHRySUIuYXBwZW5kQ2hpbGQoanNjLnBpY2tlci5zbGRQdHJTKTtcclxuXHRcdFx0XHRqc2MucGlja2VyLmJveC5hcHBlbmRDaGlsZChqc2MucGlja2VyLnNsZEIpO1xyXG5cdFx0XHRcdGpzYy5waWNrZXIuYm94LmFwcGVuZENoaWxkKGpzYy5waWNrZXIuc2xkTSk7XHJcblxyXG5cdFx0XHRcdGpzYy5waWNrZXIuYXNsZC5hcHBlbmRDaGlsZChqc2MucGlja2VyLmFzbGRHcmFkLmVsbSk7XHJcblx0XHRcdFx0anNjLnBpY2tlci5hc2xkQi5hcHBlbmRDaGlsZChqc2MucGlja2VyLmFzbGQpO1xyXG5cdFx0XHRcdGpzYy5waWNrZXIuYXNsZEIuYXBwZW5kQ2hpbGQoanNjLnBpY2tlci5hc2xkUHRyT0IpO1xyXG5cdFx0XHRcdGpzYy5waWNrZXIuYXNsZFB0ck9CLmFwcGVuZENoaWxkKGpzYy5waWNrZXIuYXNsZFB0ck1CKTtcclxuXHRcdFx0XHRqc2MucGlja2VyLmFzbGRQdHJNQi5hcHBlbmRDaGlsZChqc2MucGlja2VyLmFzbGRQdHJJQik7XHJcblx0XHRcdFx0anNjLnBpY2tlci5hc2xkUHRySUIuYXBwZW5kQ2hpbGQoanNjLnBpY2tlci5hc2xkUHRyUyk7XHJcblx0XHRcdFx0anNjLnBpY2tlci5ib3guYXBwZW5kQ2hpbGQoanNjLnBpY2tlci5hc2xkQik7XHJcblx0XHRcdFx0anNjLnBpY2tlci5ib3guYXBwZW5kQ2hpbGQoanNjLnBpY2tlci5hc2xkTSk7XHJcblxyXG5cdFx0XHRcdGpzYy5waWNrZXIuYm94LmFwcGVuZENoaWxkKGpzYy5waWNrZXIucGFsKTtcclxuXHJcblx0XHRcdFx0anNjLnBpY2tlci5idG4uYXBwZW5kQ2hpbGQoanNjLnBpY2tlci5idG5UKTtcclxuXHRcdFx0XHRqc2MucGlja2VyLmJveC5hcHBlbmRDaGlsZChqc2MucGlja2VyLmJ0bik7XHJcblxyXG5cdFx0XHRcdGpzYy5waWNrZXIuYm94Qi5hcHBlbmRDaGlsZChqc2MucGlja2VyLmJveCk7XHJcblx0XHRcdFx0anNjLnBpY2tlci53cmFwLmFwcGVuZENoaWxkKGpzYy5waWNrZXIuYm94Uyk7XHJcblx0XHRcdFx0anNjLnBpY2tlci53cmFwLmFwcGVuZENoaWxkKGpzYy5waWNrZXIuYm94Qik7XHJcblxyXG5cdFx0XHRcdGpzYy5waWNrZXIud3JhcC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywganNjLm9uUGlja2VyVG91Y2hTdGFydCxcclxuXHRcdFx0XHRcdGpzYy5pc1Bhc3NpdmVFdmVudFN1cHBvcnRlZCA/IHtwYXNzaXZlOiBmYWxzZX0gOiBmYWxzZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBwID0ganNjLnBpY2tlcjtcclxuXHJcblx0XHRcdHZhciBkaXNwbGF5U2xpZGVyID0gISFqc2MuZ2V0U2xpZGVyQ2hhbm5lbChUSElTKTtcclxuXHRcdFx0dmFyIGRpc3BsYXlBbHBoYVNsaWRlciA9IFRISVMuaGFzQWxwaGFDaGFubmVsKCk7XHJcblx0XHRcdHZhciBwaWNrZXJEaW1zID0ganNjLmdldFBpY2tlckRpbXMoVEhJUyk7XHJcblx0XHRcdHZhciBjcm9zc091dGVyU2l6ZSA9ICgyICogVEhJUy5wb2ludGVyQm9yZGVyV2lkdGggKyBUSElTLnBvaW50ZXJUaGlja25lc3MgKyAyICogVEhJUy5jcm9zc1NpemUpO1xyXG5cdFx0XHR2YXIgY29udHJvbFBhZGRpbmcgPSBqc2MuZ2V0Q29udHJvbFBhZGRpbmcoVEhJUyk7XHJcblx0XHRcdHZhciBib3JkZXJSYWRpdXMgPSBNYXRoLm1pbihcclxuXHRcdFx0XHRUSElTLmJvcmRlclJhZGl1cyxcclxuXHRcdFx0XHRNYXRoLnJvdW5kKFRISVMucGFkZGluZyAqIE1hdGguUEkpKTsgLy8gcHhcclxuXHRcdFx0dmFyIHBhZEN1cnNvciA9ICdjcm9zc2hhaXInO1xyXG5cclxuXHRcdFx0Ly8gd3JhcFxyXG5cdFx0XHRwLndyYXAuY2xhc3NOYW1lID0gJ2pzY29sb3Itd3JhcCc7XHJcblx0XHRcdHAud3JhcC5zdHlsZS53aWR0aCA9IHBpY2tlckRpbXMuYm9yZGVyVyArICdweCc7XHJcblx0XHRcdHAud3JhcC5zdHlsZS5oZWlnaHQgPSBwaWNrZXJEaW1zLmJvcmRlckggKyAncHgnO1xyXG5cdFx0XHRwLndyYXAuc3R5bGUuekluZGV4ID0gVEhJUy56SW5kZXg7XHJcblxyXG5cdFx0XHQvLyBwaWNrZXJcclxuXHRcdFx0cC5ib3guY2xhc3NOYW1lID0gJ2pzY29sb3ItcGlja2VyJztcclxuXHRcdFx0cC5ib3guc3R5bGUud2lkdGggPSBwaWNrZXJEaW1zLnBhZGRlZFcgKyAncHgnO1xyXG5cdFx0XHRwLmJveC5zdHlsZS5oZWlnaHQgPSBwaWNrZXJEaW1zLnBhZGRlZEggKyAncHgnO1xyXG5cclxuXHRcdFx0Ly8gcGlja2VyIHNoYWRvd1xyXG5cdFx0XHRwLmJveFMuY2xhc3NOYW1lID0gJ2pzY29sb3Itc2hhZG93JztcclxuXHRcdFx0anNjLnNldEJvcmRlclJhZGl1cyhwLmJveFMsIGJvcmRlclJhZGl1cyArICdweCcpO1xyXG5cclxuXHRcdFx0Ly8gcGlja2VyIGJvcmRlclxyXG5cdFx0XHRwLmJveEIuY2xhc3NOYW1lID0gJ2pzY29sb3ItYm9yZGVyJztcclxuXHRcdFx0cC5ib3hCLnN0eWxlLmJvcmRlciA9IFRISVMuYm9yZGVyV2lkdGggKyAncHggc29saWQnO1xyXG5cdFx0XHRwLmJveEIuc3R5bGUuYm9yZGVyQ29sb3IgPSBUSElTLmJvcmRlckNvbG9yO1xyXG5cdFx0XHRwLmJveEIuc3R5bGUuYmFja2dyb3VuZCA9IFRISVMuYmFja2dyb3VuZENvbG9yO1xyXG5cdFx0XHRqc2Muc2V0Qm9yZGVyUmFkaXVzKHAuYm94QiwgYm9yZGVyUmFkaXVzICsgJ3B4Jyk7XHJcblxyXG5cdFx0XHQvLyBJRSBoYWNrOlxyXG5cdFx0XHQvLyBJZiB0aGUgZWxlbWVudCBpcyB0cmFuc3BhcmVudCwgSUUgd2lsbCB0cmlnZ2VyIHRoZSBldmVudCBvbiB0aGUgZWxlbWVudHMgdW5kZXIgaXQsXHJcblx0XHRcdC8vIGUuZy4gb24gQ2FudmFzIG9yIG9uIGVsZW1lbnRzIHdpdGggYm9yZGVyXHJcblx0XHRcdHAucGFkTS5zdHlsZS5iYWNrZ3JvdW5kID0gJ3JnYmEoMjU1LDAsMCwuMiknO1xyXG5cdFx0XHRwLnNsZE0uc3R5bGUuYmFja2dyb3VuZCA9ICdyZ2JhKDAsMjU1LDAsLjIpJztcclxuXHRcdFx0cC5hc2xkTS5zdHlsZS5iYWNrZ3JvdW5kID0gJ3JnYmEoMCwwLDI1NSwuMiknO1xyXG5cclxuXHRcdFx0cC5wYWRNLnN0eWxlLm9wYWNpdHkgPVxyXG5cdFx0XHRwLnNsZE0uc3R5bGUub3BhY2l0eSA9XHJcblx0XHRcdHAuYXNsZE0uc3R5bGUub3BhY2l0eSA9XHJcblx0XHRcdFx0JzAnO1xyXG5cclxuXHRcdFx0Ly8gcGFkXHJcblx0XHRcdHAucGFkLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcclxuXHRcdFx0cC5wYWQuc3R5bGUud2lkdGggPSBUSElTLndpZHRoICsgJ3B4JztcclxuXHRcdFx0cC5wYWQuc3R5bGUuaGVpZ2h0ID0gVEhJUy5oZWlnaHQgKyAncHgnO1xyXG5cclxuXHRcdFx0Ly8gcGFkIC0gY29sb3Igc3BlY3RydW0gKEhTViBhbmQgSFZTKVxyXG5cdFx0XHRwLnBhZENhbnZhcy5kcmF3KFRISVMud2lkdGgsIFRISVMuaGVpZ2h0LCBqc2MuZ2V0UGFkWUNoYW5uZWwoVEhJUykpO1xyXG5cclxuXHRcdFx0Ly8gcGFkIGJvcmRlclxyXG5cdFx0XHRwLnBhZEIuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG5cdFx0XHRwLnBhZEIuc3R5bGUubGVmdCA9IFRISVMucGFkZGluZyArICdweCc7XHJcblx0XHRcdHAucGFkQi5zdHlsZS50b3AgPSBUSElTLnBhZGRpbmcgKyAncHgnO1xyXG5cdFx0XHRwLnBhZEIuc3R5bGUuYm9yZGVyID0gVEhJUy5jb250cm9sQm9yZGVyV2lkdGggKyAncHggc29saWQnO1xyXG5cdFx0XHRwLnBhZEIuc3R5bGUuYm9yZGVyQ29sb3IgPSBUSElTLmNvbnRyb2xCb3JkZXJDb2xvcjtcclxuXHJcblx0XHRcdC8vIHBhZCBtb3VzZSBhcmVhXHJcblx0XHRcdHAucGFkTS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcblx0XHRcdHAucGFkTS5zdHlsZS5sZWZ0ID0gMCArICdweCc7XHJcblx0XHRcdHAucGFkTS5zdHlsZS50b3AgPSAwICsgJ3B4JztcclxuXHRcdFx0cC5wYWRNLnN0eWxlLndpZHRoID0gKFRISVMucGFkZGluZyArIDIgKiBUSElTLmNvbnRyb2xCb3JkZXJXaWR0aCArIFRISVMud2lkdGggKyBjb250cm9sUGFkZGluZykgKyAncHgnO1xyXG5cdFx0XHRwLnBhZE0uc3R5bGUuaGVpZ2h0ID0gKDIgKiBUSElTLmNvbnRyb2xCb3JkZXJXaWR0aCArIDIgKiBUSElTLnBhZGRpbmcgKyBUSElTLmhlaWdodCkgKyAncHgnO1xyXG5cdFx0XHRwLnBhZE0uc3R5bGUuY3Vyc29yID0gcGFkQ3Vyc29yO1xyXG5cdFx0XHRqc2Muc2V0RGF0YShwLnBhZE0sIHtcclxuXHRcdFx0XHRpbnN0YW5jZTogVEhJUyxcclxuXHRcdFx0XHRjb250cm9sOiAncGFkJyxcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdC8vIHBhZCBjcm9zc1xyXG5cdFx0XHRwLmNyb3NzLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuXHRcdFx0cC5jcm9zcy5zdHlsZS5sZWZ0ID1cclxuXHRcdFx0cC5jcm9zcy5zdHlsZS50b3AgPVxyXG5cdFx0XHRcdCcwJztcclxuXHRcdFx0cC5jcm9zcy5zdHlsZS53aWR0aCA9XHJcblx0XHRcdHAuY3Jvc3Muc3R5bGUuaGVpZ2h0ID1cclxuXHRcdFx0XHRjcm9zc091dGVyU2l6ZSArICdweCc7XHJcblxyXG5cdFx0XHQvLyBwYWQgY3Jvc3MgYm9yZGVyIFkgYW5kIFhcclxuXHRcdFx0cC5jcm9zc0JZLnN0eWxlLnBvc2l0aW9uID1cclxuXHRcdFx0cC5jcm9zc0JYLnN0eWxlLnBvc2l0aW9uID1cclxuXHRcdFx0XHQnYWJzb2x1dGUnO1xyXG5cdFx0XHRwLmNyb3NzQlkuc3R5bGUuYmFja2dyb3VuZCA9XHJcblx0XHRcdHAuY3Jvc3NCWC5zdHlsZS5iYWNrZ3JvdW5kID1cclxuXHRcdFx0XHRUSElTLnBvaW50ZXJCb3JkZXJDb2xvcjtcclxuXHRcdFx0cC5jcm9zc0JZLnN0eWxlLndpZHRoID1cclxuXHRcdFx0cC5jcm9zc0JYLnN0eWxlLmhlaWdodCA9XHJcblx0XHRcdFx0KDIgKiBUSElTLnBvaW50ZXJCb3JkZXJXaWR0aCArIFRISVMucG9pbnRlclRoaWNrbmVzcykgKyAncHgnO1xyXG5cdFx0XHRwLmNyb3NzQlkuc3R5bGUuaGVpZ2h0ID1cclxuXHRcdFx0cC5jcm9zc0JYLnN0eWxlLndpZHRoID1cclxuXHRcdFx0XHRjcm9zc091dGVyU2l6ZSArICdweCc7XHJcblx0XHRcdHAuY3Jvc3NCWS5zdHlsZS5sZWZ0ID1cclxuXHRcdFx0cC5jcm9zc0JYLnN0eWxlLnRvcCA9XHJcblx0XHRcdFx0KE1hdGguZmxvb3IoY3Jvc3NPdXRlclNpemUgLyAyKSAtIE1hdGguZmxvb3IoVEhJUy5wb2ludGVyVGhpY2tuZXNzIC8gMikgLSBUSElTLnBvaW50ZXJCb3JkZXJXaWR0aCkgKyAncHgnO1xyXG5cdFx0XHRwLmNyb3NzQlkuc3R5bGUudG9wID1cclxuXHRcdFx0cC5jcm9zc0JYLnN0eWxlLmxlZnQgPVxyXG5cdFx0XHRcdCcwJztcclxuXHJcblx0XHRcdC8vIHBhZCBjcm9zcyBsaW5lIFkgYW5kIFhcclxuXHRcdFx0cC5jcm9zc0xZLnN0eWxlLnBvc2l0aW9uID1cclxuXHRcdFx0cC5jcm9zc0xYLnN0eWxlLnBvc2l0aW9uID1cclxuXHRcdFx0XHQnYWJzb2x1dGUnO1xyXG5cdFx0XHRwLmNyb3NzTFkuc3R5bGUuYmFja2dyb3VuZCA9XHJcblx0XHRcdHAuY3Jvc3NMWC5zdHlsZS5iYWNrZ3JvdW5kID1cclxuXHRcdFx0XHRUSElTLnBvaW50ZXJDb2xvcjtcclxuXHRcdFx0cC5jcm9zc0xZLnN0eWxlLmhlaWdodCA9XHJcblx0XHRcdHAuY3Jvc3NMWC5zdHlsZS53aWR0aCA9XHJcblx0XHRcdFx0KGNyb3NzT3V0ZXJTaXplIC0gMiAqIFRISVMucG9pbnRlckJvcmRlcldpZHRoKSArICdweCc7XHJcblx0XHRcdHAuY3Jvc3NMWS5zdHlsZS53aWR0aCA9XHJcblx0XHRcdHAuY3Jvc3NMWC5zdHlsZS5oZWlnaHQgPVxyXG5cdFx0XHRcdFRISVMucG9pbnRlclRoaWNrbmVzcyArICdweCc7XHJcblx0XHRcdHAuY3Jvc3NMWS5zdHlsZS5sZWZ0ID1cclxuXHRcdFx0cC5jcm9zc0xYLnN0eWxlLnRvcCA9XHJcblx0XHRcdFx0KE1hdGguZmxvb3IoY3Jvc3NPdXRlclNpemUgLyAyKSAtIE1hdGguZmxvb3IoVEhJUy5wb2ludGVyVGhpY2tuZXNzIC8gMikpICsgJ3B4JztcclxuXHRcdFx0cC5jcm9zc0xZLnN0eWxlLnRvcCA9XHJcblx0XHRcdHAuY3Jvc3NMWC5zdHlsZS5sZWZ0ID1cclxuXHRcdFx0XHRUSElTLnBvaW50ZXJCb3JkZXJXaWR0aCArICdweCc7XHJcblxyXG5cclxuXHRcdFx0Ly8gc2xpZGVyXHJcblx0XHRcdHAuc2xkLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcblx0XHRcdHAuc2xkLnN0eWxlLndpZHRoID0gVEhJUy5zbGlkZXJTaXplICsgJ3B4JztcclxuXHRcdFx0cC5zbGQuc3R5bGUuaGVpZ2h0ID0gVEhJUy5oZWlnaHQgKyAncHgnO1xyXG5cclxuXHRcdFx0Ly8gc2xpZGVyIGdyYWRpZW50XHJcblx0XHRcdHAuc2xkR3JhZC5kcmF3KFRISVMuc2xpZGVyU2l6ZSwgVEhJUy5oZWlnaHQsICcjMDAwJywgJyMwMDAnKTtcclxuXHJcblx0XHRcdC8vIHNsaWRlciBib3JkZXJcclxuXHRcdFx0cC5zbGRCLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5U2xpZGVyID8gJ2Jsb2NrJyA6ICdub25lJztcclxuXHRcdFx0cC5zbGRCLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuXHRcdFx0cC5zbGRCLnN0eWxlLmxlZnQgPSAoVEhJUy5wYWRkaW5nICsgVEhJUy53aWR0aCArIDIgKiBUSElTLmNvbnRyb2xCb3JkZXJXaWR0aCArIDIgKiBjb250cm9sUGFkZGluZykgKyAncHgnO1xyXG5cdFx0XHRwLnNsZEIuc3R5bGUudG9wID0gVEhJUy5wYWRkaW5nICsgJ3B4JztcclxuXHRcdFx0cC5zbGRCLnN0eWxlLmJvcmRlciA9IFRISVMuY29udHJvbEJvcmRlcldpZHRoICsgJ3B4IHNvbGlkJztcclxuXHRcdFx0cC5zbGRCLnN0eWxlLmJvcmRlckNvbG9yID0gVEhJUy5jb250cm9sQm9yZGVyQ29sb3I7XHJcblxyXG5cdFx0XHQvLyBzbGlkZXIgbW91c2UgYXJlYVxyXG5cdFx0XHRwLnNsZE0uc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlTbGlkZXIgPyAnYmxvY2snIDogJ25vbmUnO1xyXG5cdFx0XHRwLnNsZE0uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG5cdFx0XHRwLnNsZE0uc3R5bGUubGVmdCA9IChUSElTLnBhZGRpbmcgKyBUSElTLndpZHRoICsgMiAqIFRISVMuY29udHJvbEJvcmRlcldpZHRoICsgY29udHJvbFBhZGRpbmcpICsgJ3B4JztcclxuXHRcdFx0cC5zbGRNLnN0eWxlLnRvcCA9IDAgKyAncHgnO1xyXG5cdFx0XHRwLnNsZE0uc3R5bGUud2lkdGggPSAoXHJcblx0XHRcdFx0XHQoVEhJUy5zbGlkZXJTaXplICsgMiAqIGNvbnRyb2xQYWRkaW5nICsgMiAqIFRISVMuY29udHJvbEJvcmRlcldpZHRoKSArXHJcblx0XHRcdFx0XHQoZGlzcGxheUFscGhhU2xpZGVyID8gMCA6IE1hdGgubWF4KDAsIFRISVMucGFkZGluZyAtIGNvbnRyb2xQYWRkaW5nKSkgLy8gcmVtYWluaW5nIHBhZGRpbmcgdG8gdGhlIHJpZ2h0IGVkZ2VcclxuXHRcdFx0XHQpICsgJ3B4JztcclxuXHRcdFx0cC5zbGRNLnN0eWxlLmhlaWdodCA9ICgyICogVEhJUy5jb250cm9sQm9yZGVyV2lkdGggKyAyICogVEhJUy5wYWRkaW5nICsgVEhJUy5oZWlnaHQpICsgJ3B4JztcclxuXHRcdFx0cC5zbGRNLnN0eWxlLmN1cnNvciA9ICdkZWZhdWx0JztcclxuXHRcdFx0anNjLnNldERhdGEocC5zbGRNLCB7XHJcblx0XHRcdFx0aW5zdGFuY2U6IFRISVMsXHJcblx0XHRcdFx0Y29udHJvbDogJ3NsZCcsXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly8gc2xpZGVyIHBvaW50ZXIgaW5uZXIgYW5kIG91dGVyIGJvcmRlclxyXG5cdFx0XHRwLnNsZFB0cklCLnN0eWxlLmJvcmRlciA9XHJcblx0XHRcdHAuc2xkUHRyT0Iuc3R5bGUuYm9yZGVyID1cclxuXHRcdFx0XHRUSElTLnBvaW50ZXJCb3JkZXJXaWR0aCArICdweCBzb2xpZCAnICsgVEhJUy5wb2ludGVyQm9yZGVyQ29sb3I7XHJcblxyXG5cdFx0XHQvLyBzbGlkZXIgcG9pbnRlciBvdXRlciBib3JkZXJcclxuXHRcdFx0cC5zbGRQdHJPQi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcblx0XHRcdHAuc2xkUHRyT0Iuc3R5bGUubGVmdCA9IC0oMiAqIFRISVMucG9pbnRlckJvcmRlcldpZHRoICsgVEhJUy5wb2ludGVyVGhpY2tuZXNzKSArICdweCc7XHJcblx0XHRcdHAuc2xkUHRyT0Iuc3R5bGUudG9wID0gJzAnO1xyXG5cclxuXHRcdFx0Ly8gc2xpZGVyIHBvaW50ZXIgbWlkZGxlIGJvcmRlclxyXG5cdFx0XHRwLnNsZFB0ck1CLnN0eWxlLmJvcmRlciA9IFRISVMucG9pbnRlclRoaWNrbmVzcyArICdweCBzb2xpZCAnICsgVEhJUy5wb2ludGVyQ29sb3I7XHJcblxyXG5cdFx0XHQvLyBzbGlkZXIgcG9pbnRlciBzcGFjZXJcclxuXHRcdFx0cC5zbGRQdHJTLnN0eWxlLndpZHRoID0gVEhJUy5zbGlkZXJTaXplICsgJ3B4JztcclxuXHRcdFx0cC5zbGRQdHJTLnN0eWxlLmhlaWdodCA9IGpzYy5wdWIuc2xpZGVySW5uZXJTcGFjZSArICdweCc7XHJcblxyXG5cclxuXHRcdFx0Ly8gYWxwaGEgc2xpZGVyXHJcblx0XHRcdHAuYXNsZC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyXG5cdFx0XHRwLmFzbGQuc3R5bGUud2lkdGggPSBUSElTLnNsaWRlclNpemUgKyAncHgnO1xyXG5cdFx0XHRwLmFzbGQuc3R5bGUuaGVpZ2h0ID0gVEhJUy5oZWlnaHQgKyAncHgnO1xyXG5cclxuXHRcdFx0Ly8gYWxwaGEgc2xpZGVyIGdyYWRpZW50XHJcblx0XHRcdHAuYXNsZEdyYWQuZHJhdyhUSElTLnNsaWRlclNpemUsIFRISVMuaGVpZ2h0LCAnIzAwMCcpO1xyXG5cclxuXHRcdFx0Ly8gYWxwaGEgc2xpZGVyIGJvcmRlclxyXG5cdFx0XHRwLmFzbGRCLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5QWxwaGFTbGlkZXIgPyAnYmxvY2snIDogJ25vbmUnO1xyXG5cdFx0XHRwLmFzbGRCLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuXHRcdFx0cC5hc2xkQi5zdHlsZS5sZWZ0ID0gKFxyXG5cdFx0XHRcdFx0KFRISVMucGFkZGluZyArIFRISVMud2lkdGggKyAyICogVEhJUy5jb250cm9sQm9yZGVyV2lkdGggKyBjb250cm9sUGFkZGluZykgK1xyXG5cdFx0XHRcdFx0KGRpc3BsYXlTbGlkZXIgPyAoVEhJUy5zbGlkZXJTaXplICsgMyAqIGNvbnRyb2xQYWRkaW5nICsgMiAqIFRISVMuY29udHJvbEJvcmRlcldpZHRoKSA6IDApXHJcblx0XHRcdFx0KSArICdweCc7XHJcblx0XHRcdHAuYXNsZEIuc3R5bGUudG9wID0gVEhJUy5wYWRkaW5nICsgJ3B4JztcclxuXHRcdFx0cC5hc2xkQi5zdHlsZS5ib3JkZXIgPSBUSElTLmNvbnRyb2xCb3JkZXJXaWR0aCArICdweCBzb2xpZCc7XHJcblx0XHRcdHAuYXNsZEIuc3R5bGUuYm9yZGVyQ29sb3IgPSBUSElTLmNvbnRyb2xCb3JkZXJDb2xvcjtcclxuXHJcblx0XHRcdC8vIGFscGhhIHNsaWRlciBtb3VzZSBhcmVhXHJcblx0XHRcdHAuYXNsZE0uc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlBbHBoYVNsaWRlciA/ICdibG9jaycgOiAnbm9uZSc7XHJcblx0XHRcdHAuYXNsZE0uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG5cdFx0XHRwLmFzbGRNLnN0eWxlLmxlZnQgPSAoXHJcblx0XHRcdFx0XHQoVEhJUy5wYWRkaW5nICsgVEhJUy53aWR0aCArIDIgKiBUSElTLmNvbnRyb2xCb3JkZXJXaWR0aCArIGNvbnRyb2xQYWRkaW5nKSArXHJcblx0XHRcdFx0XHQoZGlzcGxheVNsaWRlciA/IChUSElTLnNsaWRlclNpemUgKyAyICogY29udHJvbFBhZGRpbmcgKyAyICogVEhJUy5jb250cm9sQm9yZGVyV2lkdGgpIDogMClcclxuXHRcdFx0XHQpICsgJ3B4JztcclxuXHRcdFx0cC5hc2xkTS5zdHlsZS50b3AgPSAwICsgJ3B4JztcclxuXHRcdFx0cC5hc2xkTS5zdHlsZS53aWR0aCA9IChcclxuXHRcdFx0XHRcdChUSElTLnNsaWRlclNpemUgKyAyICogY29udHJvbFBhZGRpbmcgKyAyICogVEhJUy5jb250cm9sQm9yZGVyV2lkdGgpICtcclxuXHRcdFx0XHRcdE1hdGgubWF4KDAsIFRISVMucGFkZGluZyAtIGNvbnRyb2xQYWRkaW5nKSAvLyByZW1haW5pbmcgcGFkZGluZyB0byB0aGUgcmlnaHQgZWRnZVxyXG5cdFx0XHRcdCkgKyAncHgnO1xyXG5cdFx0XHRwLmFzbGRNLnN0eWxlLmhlaWdodCA9ICgyICogVEhJUy5jb250cm9sQm9yZGVyV2lkdGggKyAyICogVEhJUy5wYWRkaW5nICsgVEhJUy5oZWlnaHQpICsgJ3B4JztcclxuXHRcdFx0cC5hc2xkTS5zdHlsZS5jdXJzb3IgPSAnZGVmYXVsdCc7XHJcblx0XHRcdGpzYy5zZXREYXRhKHAuYXNsZE0sIHtcclxuXHRcdFx0XHRpbnN0YW5jZTogVEhJUyxcclxuXHRcdFx0XHRjb250cm9sOiAnYXNsZCcsXHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHQvLyBhbHBoYSBzbGlkZXIgcG9pbnRlciBpbm5lciBhbmQgb3V0ZXIgYm9yZGVyXHJcblx0XHRcdHAuYXNsZFB0cklCLnN0eWxlLmJvcmRlciA9XHJcblx0XHRcdHAuYXNsZFB0ck9CLnN0eWxlLmJvcmRlciA9XHJcblx0XHRcdFx0VEhJUy5wb2ludGVyQm9yZGVyV2lkdGggKyAncHggc29saWQgJyArIFRISVMucG9pbnRlckJvcmRlckNvbG9yO1xyXG5cclxuXHRcdFx0Ly8gYWxwaGEgc2xpZGVyIHBvaW50ZXIgb3V0ZXIgYm9yZGVyXHJcblx0XHRcdHAuYXNsZFB0ck9CLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuXHRcdFx0cC5hc2xkUHRyT0Iuc3R5bGUubGVmdCA9IC0oMiAqIFRISVMucG9pbnRlckJvcmRlcldpZHRoICsgVEhJUy5wb2ludGVyVGhpY2tuZXNzKSArICdweCc7XHJcblx0XHRcdHAuYXNsZFB0ck9CLnN0eWxlLnRvcCA9ICcwJztcclxuXHJcblx0XHRcdC8vIGFscGhhIHNsaWRlciBwb2ludGVyIG1pZGRsZSBib3JkZXJcclxuXHRcdFx0cC5hc2xkUHRyTUIuc3R5bGUuYm9yZGVyID0gVEhJUy5wb2ludGVyVGhpY2tuZXNzICsgJ3B4IHNvbGlkICcgKyBUSElTLnBvaW50ZXJDb2xvcjtcclxuXHJcblx0XHRcdC8vIGFscGhhIHNsaWRlciBwb2ludGVyIHNwYWNlclxyXG5cdFx0XHRwLmFzbGRQdHJTLnN0eWxlLndpZHRoID0gVEhJUy5zbGlkZXJTaXplICsgJ3B4JztcclxuXHRcdFx0cC5hc2xkUHRyUy5zdHlsZS5oZWlnaHQgPSBqc2MucHViLnNsaWRlcklubmVyU3BhY2UgKyAncHgnO1xyXG5cclxuXHJcblx0XHRcdC8vIHBhbGV0dGVcclxuXHRcdFx0cC5wYWwuY2xhc3NOYW1lID0gJ2pzY29sb3ItcGFsZXR0ZSc7XHJcblx0XHRcdHAucGFsLnN0eWxlLmRpc3BsYXkgPSBwaWNrZXJEaW1zLnBhbGV0dGUucm93cyA/ICdibG9jaycgOiAnbm9uZSc7XHJcblx0XHRcdHAucGFsLnN0eWxlLmxlZnQgPSBUSElTLnBhZGRpbmcgKyAncHgnO1xyXG5cdFx0XHRwLnBhbC5zdHlsZS50b3AgPSAoMiAqIFRISVMuY29udHJvbEJvcmRlcldpZHRoICsgMiAqIFRISVMucGFkZGluZyArIFRISVMuaGVpZ2h0KSArICdweCc7XHJcblxyXG5cdFx0XHQvLyBwYWxldHRlJ3MgY29sb3Igc2FtcGxlc1xyXG5cclxuXHRcdFx0cC5wYWwuaW5uZXJIVE1MID0gJyc7XHJcblxyXG5cdFx0XHR2YXIgY2hlc3Nib2FyZCA9IGpzYy5nZW5Db2xvclByZXZpZXdDYW52YXMoJ3JnYmEoMCwwLDAsMCknKTtcclxuXHJcblx0XHRcdHZhciBzaSA9IDA7IC8vIGNvbG9yIHNhbXBsZSdzIGluZGV4XHJcblx0XHRcdGZvciAodmFyIHIgPSAwOyByIDwgcGlja2VyRGltcy5wYWxldHRlLnJvd3M7IHIrKykge1xyXG5cdFx0XHRcdGZvciAodmFyIGMgPSAwOyBjIDwgcGlja2VyRGltcy5wYWxldHRlLmNvbHMgJiYgc2kgPCBUSElTLl9wYWxldHRlLmxlbmd0aDsgYysrLCBzaSsrKSB7XHJcblx0XHRcdFx0XHR2YXIgc2FtcGxlQ29sb3IgPSBUSElTLl9wYWxldHRlW3NpXTtcclxuXHRcdFx0XHRcdHZhciBzYW1wbGVDc3NDb2xvciA9IGpzYy5yZ2JhQ29sb3IuYXBwbHkobnVsbCwgc2FtcGxlQ29sb3IucmdiYSk7XHJcblxyXG5cdFx0XHRcdFx0dmFyIHNjID0ganNjLmNyZWF0ZUVsKCdkaXYnKTsgLy8gY29sb3Igc2FtcGxlJ3MgY29sb3JcclxuXHRcdFx0XHRcdHNjLnN0eWxlLndpZHRoID0gKHBpY2tlckRpbXMucGFsZXR0ZS5jZWxsVyAtIDIgKiBUSElTLmNvbnRyb2xCb3JkZXJXaWR0aCkgKyAncHgnO1xyXG5cdFx0XHRcdFx0c2Muc3R5bGUuaGVpZ2h0ID0gKHBpY2tlckRpbXMucGFsZXR0ZS5jZWxsSCAtIDIgKiBUSElTLmNvbnRyb2xCb3JkZXJXaWR0aCkgKyAncHgnO1xyXG5cdFx0XHRcdFx0c2Muc3R5bGUuYmFja2dyb3VuZENvbG9yID0gc2FtcGxlQ3NzQ29sb3I7XHJcblxyXG5cdFx0XHRcdFx0dmFyIHN3ID0ganNjLmNyZWF0ZUVsKCdkaXYnKTsgLy8gY29sb3Igc2FtcGxlJ3Mgd3JhcFxyXG5cdFx0XHRcdFx0c3cuY2xhc3NOYW1lID0gJ2pzY29sb3ItcGFsZXR0ZS1zdyc7XHJcblx0XHRcdFx0XHRzdy5zdHlsZS5sZWZ0ID1cclxuXHRcdFx0XHRcdFx0KFxyXG5cdFx0XHRcdFx0XHRcdHBpY2tlckRpbXMucGFsZXR0ZS5jb2xzIDw9IDEgPyAwIDpcclxuXHRcdFx0XHRcdFx0XHRNYXRoLnJvdW5kKDEwICogKGMgKiAoKHBpY2tlckRpbXMuY29udGVudFcgLSBwaWNrZXJEaW1zLnBhbGV0dGUuY2VsbFcpIC8gKHBpY2tlckRpbXMucGFsZXR0ZS5jb2xzIC0gMSkpKSkgLyAxMFxyXG5cdFx0XHRcdFx0XHQpICsgJ3B4JztcclxuXHRcdFx0XHRcdHN3LnN0eWxlLnRvcCA9IChyICogKHBpY2tlckRpbXMucGFsZXR0ZS5jZWxsSCArIFRISVMucGFsZXR0ZVNwYWNpbmcpKSArICdweCc7XHJcblx0XHRcdFx0XHRzdy5zdHlsZS5ib3JkZXIgPSBUSElTLmNvbnRyb2xCb3JkZXJXaWR0aCArICdweCBzb2xpZCc7XHJcblx0XHRcdFx0XHRzdy5zdHlsZS5ib3JkZXJDb2xvciA9IFRISVMuY29udHJvbEJvcmRlckNvbG9yO1xyXG5cdFx0XHRcdFx0aWYgKHNhbXBsZUNvbG9yLnJnYmFbM10gIT09IG51bGwgJiYgc2FtcGxlQ29sb3IucmdiYVszXSA8IDEuMCkgeyAvLyBvbmx5IGNyZWF0ZSBjaGVzc2JvYXJkIGJhY2tncm91bmQgaWYgdGhlIHNhbXBsZSBoYXMgdHJhbnNwYXJlbmN5XHJcblx0XHRcdFx0XHRcdHN3LnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICd1cmwoXFwnJyArIGNoZXNzYm9hcmQuY2FudmFzLnRvRGF0YVVSTCgpICsgJ1xcJyknO1xyXG5cdFx0XHRcdFx0XHRzdy5zdHlsZS5iYWNrZ3JvdW5kUmVwZWF0ID0gJ3JlcGVhdCc7XHJcblx0XHRcdFx0XHRcdHN3LnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9ICdjZW50ZXIgY2VudGVyJztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGpzYy5zZXREYXRhKHN3LCB7XHJcblx0XHRcdFx0XHRcdGluc3RhbmNlOiBUSElTLFxyXG5cdFx0XHRcdFx0XHRjb250cm9sOiAncGFsZXR0ZS1zdycsXHJcblx0XHRcdFx0XHRcdGNvbG9yOiBzYW1wbGVDb2xvcixcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0c3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBqc2Mub25QYWxldHRlU2FtcGxlQ2xpY2ssIGZhbHNlKTtcclxuXHRcdFx0XHRcdHN3LmFwcGVuZENoaWxkKHNjKTtcclxuXHRcdFx0XHRcdHAucGFsLmFwcGVuZENoaWxkKHN3KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHQvLyB0aGUgQ2xvc2UgYnV0dG9uXHJcblx0XHRcdGZ1bmN0aW9uIHNldEJ0bkJvcmRlciAoKSB7XHJcblx0XHRcdFx0dmFyIGluc2V0Q29sb3JzID0gVEhJUy5jb250cm9sQm9yZGVyQ29sb3Iuc3BsaXQoL1xccysvKTtcclxuXHRcdFx0XHR2YXIgb3V0c2V0Q29sb3IgPSBpbnNldENvbG9ycy5sZW5ndGggPCAyID8gaW5zZXRDb2xvcnNbMF0gOiBpbnNldENvbG9yc1sxXSArICcgJyArIGluc2V0Q29sb3JzWzBdICsgJyAnICsgaW5zZXRDb2xvcnNbMF0gKyAnICcgKyBpbnNldENvbG9yc1sxXTtcclxuXHRcdFx0XHRwLmJ0bi5zdHlsZS5ib3JkZXJDb2xvciA9IG91dHNldENvbG9yO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBidG5QYWRkaW5nID0gMTU7IC8vIHB4XHJcblx0XHRcdHAuYnRuLmNsYXNzTmFtZSA9ICdqc2NvbG9yLWJ0biBqc2NvbG9yLWJ0bi1jbG9zZSc7XHJcblx0XHRcdHAuYnRuLnN0eWxlLmRpc3BsYXkgPSBUSElTLmNsb3NlQnV0dG9uID8gJ2Jsb2NrJyA6ICdub25lJztcclxuXHRcdFx0cC5idG4uc3R5bGUubGVmdCA9IFRISVMucGFkZGluZyArICdweCc7XHJcblx0XHRcdHAuYnRuLnN0eWxlLmJvdHRvbSA9IFRISVMucGFkZGluZyArICdweCc7XHJcblx0XHRcdHAuYnRuLnN0eWxlLnBhZGRpbmcgPSAnMCAnICsgYnRuUGFkZGluZyArICdweCc7XHJcblx0XHRcdHAuYnRuLnN0eWxlLm1heFdpZHRoID0gKHBpY2tlckRpbXMuY29udGVudFcgLSAyICogVEhJUy5jb250cm9sQm9yZGVyV2lkdGggLSAyICogYnRuUGFkZGluZykgKyAncHgnO1xyXG5cdFx0XHRwLmJ0bi5zdHlsZS5oZWlnaHQgPSBUSElTLmJ1dHRvbkhlaWdodCArICdweCc7XHJcblx0XHRcdHAuYnRuLnN0eWxlLmJvcmRlciA9IFRISVMuY29udHJvbEJvcmRlcldpZHRoICsgJ3B4IHNvbGlkJztcclxuXHRcdFx0c2V0QnRuQm9yZGVyKCk7XHJcblx0XHRcdHAuYnRuLnN0eWxlLmNvbG9yID0gVEhJUy5idXR0b25Db2xvcjtcclxuXHRcdFx0cC5idG4ub25tb3VzZWRvd24gPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0VEhJUy5oaWRlKCk7XHJcblx0XHRcdH07XHJcblx0XHRcdHAuYnRuVC5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZSc7XHJcblx0XHRcdHAuYnRuVC5zdHlsZS5saW5lSGVpZ2h0ID0gVEhJUy5idXR0b25IZWlnaHQgKyAncHgnO1xyXG5cdFx0XHRwLmJ0blQuaW5uZXJUZXh0ID0gVEhJUy5jbG9zZVRleHQ7XHJcblxyXG5cdFx0XHQvLyByZXBvc2l0aW9uIHRoZSBwb2ludGVyc1xyXG5cdFx0XHRyZWRyYXdQYWQoKTtcclxuXHRcdFx0cmVkcmF3U2xkKCk7XHJcblx0XHRcdHJlZHJhd0FTbGQoKTtcclxuXHJcblx0XHRcdC8vIElmIHdlIGFyZSBjaGFuZ2luZyB0aGUgb3duZXIgd2l0aG91dCBmaXJzdCBjbG9zaW5nIHRoZSBwaWNrZXIsXHJcblx0XHRcdC8vIG1ha2Ugc3VyZSB0byBmaXJzdCBkZWFsIHdpdGggdGhlIG9sZCBvd25lclxyXG5cdFx0XHRpZiAoanNjLnBpY2tlci5vd25lciAmJiBqc2MucGlja2VyLm93bmVyICE9PSBUSElTKSB7XHJcblx0XHRcdFx0anNjLnJlbW92ZUNsYXNzKGpzYy5waWNrZXIub3duZXIudGFyZ2V0RWxlbWVudCwganNjLnB1Yi5hY3RpdmVDbGFzc05hbWUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBTZXQgYSBuZXcgcGlja2VyIG93bmVyXHJcblx0XHRcdGpzYy5waWNrZXIub3duZXIgPSBUSElTO1xyXG5cclxuXHRcdFx0Ly8gVGhlIHJlZHJhd1Bvc2l0aW9uKCkgbWV0aG9kIG5lZWRzIHBpY2tlci5vd25lciB0byBiZSBzZXQsIHRoYXQncyB3aHkgd2UgY2FsbCBpdCBoZXJlLFxyXG5cdFx0XHQvLyBhZnRlciBzZXR0aW5nIHRoZSBvd25lclxyXG5cdFx0XHRqc2MucmVkcmF3UG9zaXRpb24oKTtcclxuXHJcblx0XHRcdGlmIChwLndyYXAucGFyZW50Tm9kZSAhPT0gVEhJUy5jb250YWluZXIpIHtcclxuXHRcdFx0XHRUSElTLmNvbnRhaW5lci5hcHBlbmRDaGlsZChwLndyYXApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRqc2MuYWRkQ2xhc3MoVEhJUy50YXJnZXRFbGVtZW50LCBqc2MucHViLmFjdGl2ZUNsYXNzTmFtZSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIHJlZHJhd1BhZCAoKSB7XHJcblx0XHRcdC8vIHJlZHJhdyB0aGUgcGFkIHBvaW50ZXJcclxuXHRcdFx0dmFyIHlDaGFubmVsID0ganNjLmdldFBhZFlDaGFubmVsKFRISVMpO1xyXG5cdFx0XHR2YXIgeCA9IE1hdGgucm91bmQoKFRISVMuY2hhbm5lbHMuaCAvIDM2MCkgKiAoVEhJUy53aWR0aCAtIDEpKTtcclxuXHRcdFx0dmFyIHkgPSBNYXRoLnJvdW5kKCgxIC0gVEhJUy5jaGFubmVsc1t5Q2hhbm5lbF0gLyAxMDApICogKFRISVMuaGVpZ2h0IC0gMSkpO1xyXG5cdFx0XHR2YXIgY3Jvc3NPdXRlclNpemUgPSAoMiAqIFRISVMucG9pbnRlckJvcmRlcldpZHRoICsgVEhJUy5wb2ludGVyVGhpY2tuZXNzICsgMiAqIFRISVMuY3Jvc3NTaXplKTtcclxuXHRcdFx0dmFyIG9mcyA9IC1NYXRoLmZsb29yKGNyb3NzT3V0ZXJTaXplIC8gMik7XHJcblx0XHRcdGpzYy5waWNrZXIuY3Jvc3Muc3R5bGUubGVmdCA9ICh4ICsgb2ZzKSArICdweCc7XHJcblx0XHRcdGpzYy5waWNrZXIuY3Jvc3Muc3R5bGUudG9wID0gKHkgKyBvZnMpICsgJ3B4JztcclxuXHJcblx0XHRcdC8vIHJlZHJhdyB0aGUgc2xpZGVyXHJcblx0XHRcdHN3aXRjaCAoanNjLmdldFNsaWRlckNoYW5uZWwoVEhJUykpIHtcclxuXHRcdFx0Y2FzZSAncyc6XHJcblx0XHRcdFx0dmFyIHJnYjEgPSBqc2MuSFNWX1JHQihUSElTLmNoYW5uZWxzLmgsIDEwMCwgVEhJUy5jaGFubmVscy52KTtcclxuXHRcdFx0XHR2YXIgcmdiMiA9IGpzYy5IU1ZfUkdCKFRISVMuY2hhbm5lbHMuaCwgMCwgVEhJUy5jaGFubmVscy52KTtcclxuXHRcdFx0XHR2YXIgY29sb3IxID0gJ3JnYignICtcclxuXHRcdFx0XHRcdE1hdGgucm91bmQocmdiMVswXSkgKyAnLCcgK1xyXG5cdFx0XHRcdFx0TWF0aC5yb3VuZChyZ2IxWzFdKSArICcsJyArXHJcblx0XHRcdFx0XHRNYXRoLnJvdW5kKHJnYjFbMl0pICsgJyknO1xyXG5cdFx0XHRcdHZhciBjb2xvcjIgPSAncmdiKCcgK1xyXG5cdFx0XHRcdFx0TWF0aC5yb3VuZChyZ2IyWzBdKSArICcsJyArXHJcblx0XHRcdFx0XHRNYXRoLnJvdW5kKHJnYjJbMV0pICsgJywnICtcclxuXHRcdFx0XHRcdE1hdGgucm91bmQocmdiMlsyXSkgKyAnKSc7XHJcblx0XHRcdFx0anNjLnBpY2tlci5zbGRHcmFkLmRyYXcoVEhJUy5zbGlkZXJTaXplLCBUSElTLmhlaWdodCwgY29sb3IxLCBjb2xvcjIpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICd2JzpcclxuXHRcdFx0XHR2YXIgcmdiID0ganNjLkhTVl9SR0IoVEhJUy5jaGFubmVscy5oLCBUSElTLmNoYW5uZWxzLnMsIDEwMCk7XHJcblx0XHRcdFx0dmFyIGNvbG9yMSA9ICdyZ2IoJyArXHJcblx0XHRcdFx0XHRNYXRoLnJvdW5kKHJnYlswXSkgKyAnLCcgK1xyXG5cdFx0XHRcdFx0TWF0aC5yb3VuZChyZ2JbMV0pICsgJywnICtcclxuXHRcdFx0XHRcdE1hdGgucm91bmQocmdiWzJdKSArICcpJztcclxuXHRcdFx0XHR2YXIgY29sb3IyID0gJyMwMDAnO1xyXG5cdFx0XHRcdGpzYy5waWNrZXIuc2xkR3JhZC5kcmF3KFRISVMuc2xpZGVyU2l6ZSwgVEhJUy5oZWlnaHQsIGNvbG9yMSwgY29sb3IyKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gcmVkcmF3IHRoZSBhbHBoYSBzbGlkZXJcclxuXHRcdFx0anNjLnBpY2tlci5hc2xkR3JhZC5kcmF3KFRISVMuc2xpZGVyU2l6ZSwgVEhJUy5oZWlnaHQsIFRISVMudG9IRVhTdHJpbmcoKSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIHJlZHJhd1NsZCAoKSB7XHJcblx0XHRcdHZhciBzbGRDaGFubmVsID0ganNjLmdldFNsaWRlckNoYW5uZWwoVEhJUyk7XHJcblx0XHRcdGlmIChzbGRDaGFubmVsKSB7XHJcblx0XHRcdFx0Ly8gcmVkcmF3IHRoZSBzbGlkZXIgcG9pbnRlclxyXG5cdFx0XHRcdHZhciB5ID0gTWF0aC5yb3VuZCgoMSAtIFRISVMuY2hhbm5lbHNbc2xkQ2hhbm5lbF0gLyAxMDApICogKFRISVMuaGVpZ2h0IC0gMSkpO1xyXG5cdFx0XHRcdGpzYy5waWNrZXIuc2xkUHRyT0Iuc3R5bGUudG9wID0gKHkgLSAoMiAqIFRISVMucG9pbnRlckJvcmRlcldpZHRoICsgVEhJUy5wb2ludGVyVGhpY2tuZXNzKSAtIE1hdGguZmxvb3IoanNjLnB1Yi5zbGlkZXJJbm5lclNwYWNlIC8gMikpICsgJ3B4JztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gcmVkcmF3IHRoZSBhbHBoYSBzbGlkZXJcclxuXHRcdFx0anNjLnBpY2tlci5hc2xkR3JhZC5kcmF3KFRISVMuc2xpZGVyU2l6ZSwgVEhJUy5oZWlnaHQsIFRISVMudG9IRVhTdHJpbmcoKSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIHJlZHJhd0FTbGQgKCkge1xyXG5cdFx0XHR2YXIgeSA9IE1hdGgucm91bmQoKDEgLSBUSElTLmNoYW5uZWxzLmEpICogKFRISVMuaGVpZ2h0IC0gMSkpO1xyXG5cdFx0XHRqc2MucGlja2VyLmFzbGRQdHJPQi5zdHlsZS50b3AgPSAoeSAtICgyICogVEhJUy5wb2ludGVyQm9yZGVyV2lkdGggKyBUSElTLnBvaW50ZXJUaGlja25lc3MpIC0gTWF0aC5mbG9vcihqc2MucHViLnNsaWRlcklubmVyU3BhY2UgLyAyKSkgKyAncHgnO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRmdW5jdGlvbiBpc1BpY2tlck93bmVyICgpIHtcclxuXHRcdFx0cmV0dXJuIGpzYy5waWNrZXIgJiYganNjLnBpY2tlci5vd25lciA9PT0gVEhJUztcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0ZnVuY3Rpb24gb25WYWx1ZUtleURvd24gKGV2KSB7XHJcblx0XHRcdGlmIChqc2MuZXZlbnRLZXkoZXYpID09PSAnRW50ZXInKSB7XHJcblx0XHRcdFx0aWYgKFRISVMudmFsdWVFbGVtZW50KSB7XHJcblx0XHRcdFx0XHRUSElTLnByb2Nlc3NWYWx1ZUlucHV0KFRISVMudmFsdWVFbGVtZW50LnZhbHVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0VEhJUy50cnlIaWRlKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0ZnVuY3Rpb24gb25BbHBoYUtleURvd24gKGV2KSB7XHJcblx0XHRcdGlmIChqc2MuZXZlbnRLZXkoZXYpID09PSAnRW50ZXInKSB7XHJcblx0XHRcdFx0aWYgKFRISVMuYWxwaGFFbGVtZW50KSB7XHJcblx0XHRcdFx0XHRUSElTLnByb2Nlc3NBbHBoYUlucHV0KFRISVMuYWxwaGFFbGVtZW50LnZhbHVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0VEhJUy50cnlIaWRlKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0ZnVuY3Rpb24gb25WYWx1ZUNoYW5nZSAoZXYpIHtcclxuXHRcdFx0aWYgKGpzYy5nZXREYXRhKGV2LCAnaW50ZXJuYWwnKSkge1xyXG5cdFx0XHRcdHJldHVybjsgLy8gc2tpcCBpZiB0aGUgZXZlbnQgd2FzIGludGVybmFsbHkgdHJpZ2dlcmVkIGJ5IGpzY29sb3JcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIG9sZFZhbCA9IFRISVMudmFsdWVFbGVtZW50LnZhbHVlO1xyXG5cclxuXHRcdFx0VEhJUy5wcm9jZXNzVmFsdWVJbnB1dChUSElTLnZhbHVlRWxlbWVudC52YWx1ZSk7IC8vIHRoaXMgbWlnaHQgY2hhbmdlIHRoZSB2YWx1ZVxyXG5cclxuXHRcdFx0anNjLnRyaWdnZXJDYWxsYmFjayhUSElTLCAnb25DaGFuZ2UnKTtcclxuXHJcblx0XHRcdGlmIChUSElTLnZhbHVlRWxlbWVudC52YWx1ZSAhPT0gb2xkVmFsKSB7XHJcblx0XHRcdFx0Ly8gdmFsdWUgd2FzIGFkZGl0aW9uYWxseSBjaGFuZ2VkIC0+IGxldCdzIHRyaWdnZXIgdGhlIGNoYW5nZSBldmVudCBhZ2FpbiwgZXZlbiB0aG91Z2ggaXQgd2FzIG5hdGl2ZWx5IGRpc3BhdGNoZWRcclxuXHRcdFx0XHRqc2MudHJpZ2dlcklucHV0RXZlbnQoVEhJUy52YWx1ZUVsZW1lbnQsICdjaGFuZ2UnLCB0cnVlLCB0cnVlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRmdW5jdGlvbiBvbkFscGhhQ2hhbmdlIChldikge1xyXG5cdFx0XHRpZiAoanNjLmdldERhdGEoZXYsICdpbnRlcm5hbCcpKSB7XHJcblx0XHRcdFx0cmV0dXJuOyAvLyBza2lwIGlmIHRoZSBldmVudCB3YXMgaW50ZXJuYWxseSB0cmlnZ2VyZWQgYnkganNjb2xvclxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgb2xkVmFsID0gVEhJUy5hbHBoYUVsZW1lbnQudmFsdWU7XHJcblxyXG5cdFx0XHRUSElTLnByb2Nlc3NBbHBoYUlucHV0KFRISVMuYWxwaGFFbGVtZW50LnZhbHVlKTsgLy8gdGhpcyBtaWdodCBjaGFuZ2UgdGhlIHZhbHVlXHJcblxyXG5cdFx0XHRqc2MudHJpZ2dlckNhbGxiYWNrKFRISVMsICdvbkNoYW5nZScpO1xyXG5cclxuXHRcdFx0Ly8gdHJpZ2dlcmluZyB2YWx1ZUVsZW1lbnQncyBvbkNoYW5nZSAoYmVjYXVzZSBjaGFuZ2luZyBhbHBoYSBjaGFuZ2VzIHRoZSBlbnRpcmUgY29sb3IsIGUuZy4gd2l0aCByZ2JhIGZvcm1hdClcclxuXHRcdFx0anNjLnRyaWdnZXJJbnB1dEV2ZW50KFRISVMudmFsdWVFbGVtZW50LCAnY2hhbmdlJywgdHJ1ZSwgdHJ1ZSk7XHJcblxyXG5cdFx0XHRpZiAoVEhJUy5hbHBoYUVsZW1lbnQudmFsdWUgIT09IG9sZFZhbCkge1xyXG5cdFx0XHRcdC8vIHZhbHVlIHdhcyBhZGRpdGlvbmFsbHkgY2hhbmdlZCAtPiBsZXQncyB0cmlnZ2VyIHRoZSBjaGFuZ2UgZXZlbnQgYWdhaW4sIGV2ZW4gdGhvdWdoIGl0IHdhcyBuYXRpdmVseSBkaXNwYXRjaGVkXHJcblx0XHRcdFx0anNjLnRyaWdnZXJJbnB1dEV2ZW50KFRISVMuYWxwaGFFbGVtZW50LCAnY2hhbmdlJywgdHJ1ZSwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0ZnVuY3Rpb24gb25WYWx1ZUlucHV0IChldikge1xyXG5cdFx0XHRpZiAoanNjLmdldERhdGEoZXYsICdpbnRlcm5hbCcpKSB7XHJcblx0XHRcdFx0cmV0dXJuOyAvLyBza2lwIGlmIHRoZSBldmVudCB3YXMgaW50ZXJuYWxseSB0cmlnZ2VyZWQgYnkganNjb2xvclxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoVEhJUy52YWx1ZUVsZW1lbnQpIHtcclxuXHRcdFx0XHRUSElTLmZyb21TdHJpbmcoVEhJUy52YWx1ZUVsZW1lbnQudmFsdWUsIGpzYy5mbGFncy5sZWF2ZVZhbHVlKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0anNjLnRyaWdnZXJDYWxsYmFjayhUSElTLCAnb25JbnB1dCcpO1xyXG5cclxuXHRcdFx0Ly8gdHJpZ2dlcmluZyB2YWx1ZUVsZW1lbnQncyBvbklucHV0XHJcblx0XHRcdC8vIChub3QgbmVlZGVkLCBpdCB3YXMgZGlzcGF0Y2hlZCBub3JtYWxseSBieSB0aGUgYnJvd3NlcilcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0ZnVuY3Rpb24gb25BbHBoYUlucHV0IChldikge1xyXG5cdFx0XHRpZiAoanNjLmdldERhdGEoZXYsICdpbnRlcm5hbCcpKSB7XHJcblx0XHRcdFx0cmV0dXJuOyAvLyBza2lwIGlmIHRoZSBldmVudCB3YXMgaW50ZXJuYWxseSB0cmlnZ2VyZWQgYnkganNjb2xvclxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoVEhJUy5hbHBoYUVsZW1lbnQpIHtcclxuXHRcdFx0XHRUSElTLmZyb21IU1ZBKG51bGwsIG51bGwsIG51bGwsIHBhcnNlRmxvYXQoVEhJUy5hbHBoYUVsZW1lbnQudmFsdWUpLCBqc2MuZmxhZ3MubGVhdmVBbHBoYSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGpzYy50cmlnZ2VyQ2FsbGJhY2soVEhJUywgJ29uSW5wdXQnKTtcclxuXHJcblx0XHRcdC8vIHRyaWdnZXJpbmcgdmFsdWVFbGVtZW50J3Mgb25JbnB1dCAoYmVjYXVzZSBjaGFuZ2luZyBhbHBoYSBjaGFuZ2VzIHRoZSBlbnRpcmUgY29sb3IsIGUuZy4gd2l0aCByZ2JhIGZvcm1hdClcclxuXHRcdFx0anNjLnRyaWdnZXJJbnB1dEV2ZW50KFRISVMudmFsdWVFbGVtZW50LCAnaW5wdXQnLCB0cnVlLCB0cnVlKTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gbGV0J3MgcHJvY2VzcyB0aGUgREVQUkVDQVRFRCAnb3B0aW9ucycgcHJvcGVydHkgKHRoaXMgd2lsbCBiZSBsYXRlciByZW1vdmVkKVxyXG5cdFx0aWYgKGpzYy5wdWIub3B0aW9ucykge1xyXG5cdFx0XHQvLyBsZXQncyBzZXQgY3VzdG9tIGRlZmF1bHQgb3B0aW9ucywgaWYgc3BlY2lmaWVkXHJcblx0XHRcdGZvciAodmFyIG9wdCBpbiBqc2MucHViLm9wdGlvbnMpIHtcclxuXHRcdFx0XHRpZiAoanNjLnB1Yi5vcHRpb25zLmhhc093blByb3BlcnR5KG9wdCkpIHtcclxuXHRcdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRcdHNldE9wdGlvbihvcHQsIGpzYy5wdWIub3B0aW9uc1tvcHRdKTtcclxuXHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGUpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBsZXQncyBhcHBseSBjb25maWd1cmF0aW9uIHByZXNldHNcclxuXHRcdC8vXHJcblx0XHR2YXIgcHJlc2V0c0FyciA9IFtdO1xyXG5cclxuXHRcdGlmIChvcHRzLnByZXNldCkge1xyXG5cdFx0XHRpZiAodHlwZW9mIG9wdHMucHJlc2V0ID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdHByZXNldHNBcnIgPSBvcHRzLnByZXNldC5zcGxpdCgvXFxzKy8pO1xyXG5cdFx0XHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob3B0cy5wcmVzZXQpKSB7XHJcblx0XHRcdFx0cHJlc2V0c0FyciA9IG9wdHMucHJlc2V0LnNsaWNlKCk7IC8vIHNsaWNlKCkgdG8gY2xvbmVcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjb25zb2xlLndhcm4oJ1VucmVjb2duaXplZCBwcmVzZXQgdmFsdWUnKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGFsd2F5cyB1c2UgdGhlICdkZWZhdWx0JyBwcmVzZXQuIElmIGl0J3Mgbm90IGxpc3RlZCwgYXBwZW5kIGl0IHRvIHRoZSBlbmQuXHJcblx0XHRpZiAocHJlc2V0c0Fyci5pbmRleE9mKCdkZWZhdWx0JykgPT09IC0xKSB7XHJcblx0XHRcdHByZXNldHNBcnIucHVzaCgnZGVmYXVsdCcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGxldCdzIGFwcGx5IHRoZSBwcmVzZXRzIGluIHJldmVyc2Ugb3JkZXIsIHNvIHRoYXQgc2hvdWxkIHRoZXJlIGJlIGFueSBvdmVybGFwcGluZyBvcHRpb25zLFxyXG5cdFx0Ly8gdGhlIGZvcm1lcmx5IGxpc3RlZCBwcmVzZXQgd2lsbCBvdmVycmlkZSB0aGUgbGF0dGVyXHJcblx0XHRmb3IgKHZhciBpID0gcHJlc2V0c0Fyci5sZW5ndGggLSAxOyBpID49IDA7IGkgLT0gMSkge1xyXG5cdFx0XHR2YXIgcHJlcyA9IHByZXNldHNBcnJbaV07XHJcblx0XHRcdGlmICghcHJlcykge1xyXG5cdFx0XHRcdGNvbnRpbnVlOyAvLyBwcmVzZXQgaXMgZW1wdHkgc3RyaW5nXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFqc2MucHViLnByZXNldHMuaGFzT3duUHJvcGVydHkocHJlcykpIHtcclxuXHRcdFx0XHRjb25zb2xlLndhcm4oJ1Vua25vd24gcHJlc2V0OiAlcycsIHByZXMpO1xyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvciAodmFyIG9wdCBpbiBqc2MucHViLnByZXNldHNbcHJlc10pIHtcclxuXHRcdFx0XHRpZiAoanNjLnB1Yi5wcmVzZXRzW3ByZXNdLmhhc093blByb3BlcnR5KG9wdCkpIHtcclxuXHRcdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRcdHNldE9wdGlvbihvcHQsIGpzYy5wdWIucHJlc2V0c1twcmVzXVtvcHRdKTtcclxuXHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGUpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBsZXQncyBzZXQgc3BlY2lmaWMgb3B0aW9ucyBmb3IgdGhpcyBjb2xvciBwaWNrZXJcclxuXHRcdHZhciBub25Qcm9wZXJ0aWVzID0gW1xyXG5cdFx0XHQvLyB0aGVzZSBvcHRpb25zIHdvbid0IGJlIHNldCBhcyBpbnN0YW5jZSBwcm9wZXJ0aWVzXHJcblx0XHRcdCdwcmVzZXQnLFxyXG5cdFx0XTtcclxuXHRcdGZvciAodmFyIG9wdCBpbiBvcHRzKSB7XHJcblx0XHRcdGlmIChvcHRzLmhhc093blByb3BlcnR5KG9wdCkpIHtcclxuXHRcdFx0XHRpZiAobm9uUHJvcGVydGllcy5pbmRleE9mKG9wdCkgPT09IC0xKSB7XHJcblx0XHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0XHRzZXRPcHRpb24ob3B0LCBvcHRzW29wdF0pO1xyXG5cdFx0XHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oZSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vXHJcblx0XHQvLyBJbnN0YWxsIHRoZSBjb2xvciBwaWNrZXIgb24gY2hvc2VuIGVsZW1lbnQocylcclxuXHRcdC8vXHJcblxyXG5cclxuXHRcdC8vIERldGVybWluZSBwaWNrZXIncyBjb250YWluZXIgZWxlbWVudFxyXG5cdFx0aWYgKHRoaXMuY29udGFpbmVyID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0dGhpcy5jb250YWluZXIgPSB3aW5kb3cuZG9jdW1lbnQuYm9keTsgLy8gZGVmYXVsdCBjb250YWluZXIgaXMgQk9EWSBlbGVtZW50XHJcblxyXG5cdFx0fSBlbHNlIHsgLy8gZXhwbGljaXRseSBzZXQgdG8gY3VzdG9tIGVsZW1lbnRcclxuXHRcdFx0dGhpcy5jb250YWluZXIgPSBqc2Mubm9kZSh0aGlzLmNvbnRhaW5lcik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCF0aGlzLmNvbnRhaW5lcikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBpbnN0YW50aWF0ZSBjb2xvciBwaWNrZXIgd2l0aG91dCBhIGNvbnRhaW5lciBlbGVtZW50Jyk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIEZldGNoIHRoZSB0YXJnZXQgZWxlbWVudFxyXG5cdFx0dGhpcy50YXJnZXRFbGVtZW50ID0ganNjLm5vZGUodGFyZ2V0RWxlbWVudCk7XHJcblxyXG5cdFx0aWYgKCF0aGlzLnRhcmdldEVsZW1lbnQpIHtcclxuXHRcdFx0Ly8gdGVtcG9yYXJpbHkgY3VzdG9taXplZCBlcnJvciBtZXNzYWdlIHRvIGhlbHAgd2l0aCBtaWdyYXRpbmcgZnJvbSB2ZXJzaW9ucyBwcmlvciB0byAyLjJcclxuXHRcdFx0aWYgKHR5cGVvZiB0YXJnZXRFbGVtZW50ID09PSAnc3RyaW5nJyAmJiAvXlthLXpBLVpdW1xcdzouLV0qJC8udGVzdCh0YXJnZXRFbGVtZW50KSkge1xyXG5cdFx0XHRcdC8vIHRhcmdldEVsZW1lbnQgbG9va3MgbGlrZSB2YWxpZCBJRFxyXG5cdFx0XHRcdHZhciBwb3NzaWJseUlkID0gdGFyZ2V0RWxlbWVudDtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0lmIFxcJycgKyBwb3NzaWJseUlkICsgJ1xcJyBpcyBzdXBwb3NlZCB0byBiZSBhbiBJRCwgcGxlYXNlIHVzZSBcXCcjJyArIHBvc3NpYmx5SWQgKyAnXFwnIG9yIGFueSB2YWxpZCBDU1Mgc2VsZWN0b3IuJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignQ2Fubm90IGluc3RhbnRpYXRlIGNvbG9yIHBpY2tlciB3aXRob3V0IGEgdGFyZ2V0IGVsZW1lbnQnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy50YXJnZXRFbGVtZW50LmpzY29sb3IgJiYgdGhpcy50YXJnZXRFbGVtZW50LmpzY29sb3IgaW5zdGFuY2VvZiBqc2MucHViKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignQ29sb3IgcGlja2VyIGFscmVhZHkgaW5zdGFsbGVkIG9uIHRoaXMgZWxlbWVudCcpO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBsaW5rIHRoaXMgaW5zdGFuY2Ugd2l0aCB0aGUgdGFyZ2V0IGVsZW1lbnRcclxuXHRcdHRoaXMudGFyZ2V0RWxlbWVudC5qc2NvbG9yID0gdGhpcztcclxuXHRcdGpzYy5hZGRDbGFzcyh0aGlzLnRhcmdldEVsZW1lbnQsIGpzYy5wdWIuY2xhc3NOYW1lKTtcclxuXHJcblx0XHQvLyByZWdpc3RlciB0aGlzIGluc3RhbmNlXHJcblx0XHRqc2MuaW5zdGFuY2VzLnB1c2godGhpcyk7XHJcblxyXG5cclxuXHRcdC8vIGlmIHRhcmdldCBpcyBCVVRUT05cclxuXHRcdGlmIChqc2MuaXNCdXR0b24odGhpcy50YXJnZXRFbGVtZW50KSkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMudGFyZ2V0RWxlbWVudC50eXBlLnRvTG93ZXJDYXNlKCkgIT09ICdidXR0b24nKSB7XHJcblx0XHRcdFx0Ly8gb24gYnV0dG9ucywgYWx3YXlzIGZvcmNlIHR5cGUgdG8gYmUgJ2J1dHRvbicsIGUuZy4gaW4gc2l0dWF0aW9ucyB0aGUgdGFyZ2V0IDxidXR0b24+IGhhcyBubyB0eXBlXHJcblx0XHRcdFx0Ly8gYW5kIHRodXMgZGVmYXVsdHMgdG8gJ3N1Ym1pdCcgYW5kIHdvdWxkIHN1Ym1pdCB0aGUgZm9ybSB3aGVuIGNsaWNrZWRcclxuXHRcdFx0XHR0aGlzLnRhcmdldEVsZW1lbnQudHlwZSA9ICdidXR0b24nO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoanNjLmlzQnV0dG9uRW1wdHkodGhpcy50YXJnZXRFbGVtZW50KSkgeyAvLyBlbXB0eSBidXR0b25cclxuXHRcdFx0XHQvLyBpdCBpcyBpbXBvcnRhbnQgdG8gY2xlYXIgZWxlbWVudCdzIGNvbnRlbnRzIGZpcnN0LlxyXG5cdFx0XHRcdC8vIGlmIHdlJ3JlIHJlLWluc3RhbnRpYXRpbmcgY29sb3IgcGlja2VycyBvbiBET00gdGhhdCBoYXMgYmVlbiBtb2RpZmllZCBieSBjaGFuZ2luZyBwYWdlJ3MgaW5uZXJIVE1MLFxyXG5cdFx0XHRcdC8vIHdlIHdvdWxkIGtlZXAgYWRkaW5nIG1vcmUgbm9uLWJyZWFraW5nIHNwYWNlcyB0byBlbGVtZW50J3MgY29udGVudCAoYmVjYXVzZSBlbGVtZW50J3MgY29udGVudHMgc3Vydml2ZVxyXG5cdFx0XHRcdC8vIGlubmVySFRNTCBjaGFuZ2VzLCBidXQgcGlja2VyIGluc3RhbmNlcyBkb24ndClcclxuXHRcdFx0XHRqc2MucmVtb3ZlQ2hpbGRyZW4odGhpcy50YXJnZXRFbGVtZW50KTtcclxuXHJcblx0XHRcdFx0Ly8gbGV0J3MgaW5zZXJ0IGEgbm9uLWJyZWFraW5nIHNwYWNlXHJcblx0XHRcdFx0dGhpcy50YXJnZXRFbGVtZW50LmFwcGVuZENoaWxkKHdpbmRvdy5kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnXFx4YTAnKSk7XHJcblxyXG5cdFx0XHRcdC8vIHNldCBtaW4td2lkdGggPSBwcmV2aWV3U2l6ZSwgaWYgbm90IGFscmVhZHkgZ3JlYXRlclxyXG5cdFx0XHRcdHZhciBjb21wU3R5bGUgPSBqc2MuZ2V0Q29tcFN0eWxlKHRoaXMudGFyZ2V0RWxlbWVudCk7XHJcblx0XHRcdFx0dmFyIGN1cnJNaW5XaWR0aCA9IHBhcnNlRmxvYXQoY29tcFN0eWxlWydtaW4td2lkdGgnXSkgfHwgMDtcclxuXHRcdFx0XHRpZiAoY3Vyck1pbldpZHRoIDwgdGhpcy5wcmV2aWV3U2l6ZSkge1xyXG5cdFx0XHRcdFx0anNjLnNldFN0eWxlKHRoaXMudGFyZ2V0RWxlbWVudCwge1xyXG5cdFx0XHRcdFx0XHQnbWluLXdpZHRoJzogdGhpcy5wcmV2aWV3U2l6ZSArICdweCcsXHJcblx0XHRcdFx0XHR9LCB0aGlzLmZvcmNlU3R5bGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIERldGVybWluZSB0aGUgdmFsdWUgZWxlbWVudFxyXG5cdFx0aWYgKHRoaXMudmFsdWVFbGVtZW50ID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0aWYgKGpzYy5pc1RleHRJbnB1dCh0aGlzLnRhcmdldEVsZW1lbnQpKSB7XHJcblx0XHRcdFx0Ly8gZm9yIHRleHQgaW5wdXRzLCBkZWZhdWx0IHZhbHVlRWxlbWVudCBpcyB0YXJnZXRFbGVtZW50XHJcblx0XHRcdFx0dGhpcy52YWx1ZUVsZW1lbnQgPSB0aGlzLnRhcmdldEVsZW1lbnQ7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly8gbGVhdmUgaXQgdW5kZWZpbmVkXHJcblx0XHRcdH1cclxuXHJcblx0XHR9IGVsc2UgaWYgKHRoaXMudmFsdWVFbGVtZW50ID09PSBudWxsKSB7IC8vIGV4cGxpY2l0bHkgc2V0IHRvIG51bGxcclxuXHRcdFx0Ly8gbGVhdmUgaXQgbnVsbFxyXG5cclxuXHRcdH0gZWxzZSB7IC8vIGV4cGxpY2l0bHkgc2V0IHRvIGN1c3RvbSBlbGVtZW50XHJcblx0XHRcdHRoaXMudmFsdWVFbGVtZW50ID0ganNjLm5vZGUodGhpcy52YWx1ZUVsZW1lbnQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIERldGVybWluZSB0aGUgYWxwaGEgZWxlbWVudFxyXG5cdFx0aWYgKHRoaXMuYWxwaGFFbGVtZW50KSB7XHJcblx0XHRcdHRoaXMuYWxwaGFFbGVtZW50ID0ganNjLm5vZGUodGhpcy5hbHBoYUVsZW1lbnQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIERldGVybWluZSB0aGUgcHJldmlldyBlbGVtZW50XHJcblx0XHRpZiAodGhpcy5wcmV2aWV3RWxlbWVudCA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHRoaXMucHJldmlld0VsZW1lbnQgPSB0aGlzLnRhcmdldEVsZW1lbnQ7IC8vIGRlZmF1bHQgcHJldmlld0VsZW1lbnQgaXMgdGFyZ2V0RWxlbWVudFxyXG5cclxuXHRcdH0gZWxzZSBpZiAodGhpcy5wcmV2aWV3RWxlbWVudCA9PT0gbnVsbCkgeyAvLyBleHBsaWNpdGx5IHNldCB0byBudWxsXHJcblx0XHRcdC8vIGxlYXZlIGl0IG51bGxcclxuXHJcblx0XHR9IGVsc2UgeyAvLyBleHBsaWNpdGx5IHNldCB0byBjdXN0b20gZWxlbWVudFxyXG5cdFx0XHR0aGlzLnByZXZpZXdFbGVtZW50ID0ganNjLm5vZGUodGhpcy5wcmV2aWV3RWxlbWVudCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdmFsdWVFbGVtZW50XHJcblx0XHRpZiAodGhpcy52YWx1ZUVsZW1lbnQgJiYganNjLmlzVGV4dElucHV0KHRoaXMudmFsdWVFbGVtZW50KSkge1xyXG5cclxuXHRcdFx0Ly8gSWYgdGhlIHZhbHVlIGVsZW1lbnQgaGFzIG9uSW5wdXQgZXZlbnQgYWxyZWFkeSBzZXQsIHdlIG5lZWQgdG8gZGV0YWNoIGl0IGFuZCBhdHRhY2ggQUZURVIgb3VyIGxpc3RlbmVyLlxyXG5cdFx0XHQvLyBvdGhlcndpc2UgdGhlIHBpY2tlciBpbnN0YW5jZSB3b3VsZCBzdGlsbCBjb250YWluIHRoZSBvbGQgY29sb3Igd2hlbiBhY2Nlc3NlZCBmcm9tIHRoZSBvbklucHV0IGhhbmRsZXIuXHJcblx0XHRcdHZhciB2YWx1ZUVsZW1lbnRPcmlnRXZlbnRzID0ge1xyXG5cdFx0XHRcdG9uSW5wdXQ6IHRoaXMudmFsdWVFbGVtZW50Lm9uaW5wdXRcclxuXHRcdFx0fTtcclxuXHRcdFx0dGhpcy52YWx1ZUVsZW1lbnQub25pbnB1dCA9IG51bGw7XHJcblxyXG5cdFx0XHR0aGlzLnZhbHVlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25WYWx1ZUtleURvd24sIGZhbHNlKTtcclxuXHRcdFx0dGhpcy52YWx1ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgb25WYWx1ZUNoYW5nZSwgZmFsc2UpO1xyXG5cdFx0XHR0aGlzLnZhbHVlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIG9uVmFsdWVJbnB1dCwgZmFsc2UpO1xyXG5cdFx0XHQvLyB0aGUgb3JpZ2luYWwgZXZlbnQgbGlzdGVuZXIgbXVzdCBiZSBhdHRhY2hlZCBBRlRFUiBvdXIgaGFuZGxlciAodG8gbGV0IGl0IGZpcnN0IHNldCBwaWNrZXIncyBjb2xvcilcclxuXHRcdFx0aWYgKHZhbHVlRWxlbWVudE9yaWdFdmVudHMub25JbnB1dCkge1xyXG5cdFx0XHRcdHRoaXMudmFsdWVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdmFsdWVFbGVtZW50T3JpZ0V2ZW50cy5vbklucHV0LCBmYWxzZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMudmFsdWVFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXV0b2NvbXBsZXRlJywgJ29mZicpO1xyXG5cdFx0XHR0aGlzLnZhbHVlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2F1dG9jb3JyZWN0JywgJ29mZicpO1xyXG5cdFx0XHR0aGlzLnZhbHVlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2F1dG9jYXBpdGFsaXplJywgJ29mZicpO1xyXG5cdFx0XHR0aGlzLnZhbHVlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NwZWxsY2hlY2snLCBmYWxzZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gYWxwaGFFbGVtZW50XHJcblx0XHRpZiAodGhpcy5hbHBoYUVsZW1lbnQgJiYganNjLmlzVGV4dElucHV0KHRoaXMuYWxwaGFFbGVtZW50KSkge1xyXG5cdFx0XHR0aGlzLmFscGhhRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25BbHBoYUtleURvd24sIGZhbHNlKTtcclxuXHRcdFx0dGhpcy5hbHBoYUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgb25BbHBoYUNoYW5nZSwgZmFsc2UpO1xyXG5cdFx0XHR0aGlzLmFscGhhRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIG9uQWxwaGFJbnB1dCwgZmFsc2UpO1xyXG5cclxuXHRcdFx0dGhpcy5hbHBoYUVsZW1lbnQuc2V0QXR0cmlidXRlKCdhdXRvY29tcGxldGUnLCAnb2ZmJyk7XHJcblx0XHRcdHRoaXMuYWxwaGFFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXV0b2NvcnJlY3QnLCAnb2ZmJyk7XHJcblx0XHRcdHRoaXMuYWxwaGFFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXV0b2NhcGl0YWxpemUnLCAnb2ZmJyk7XHJcblx0XHRcdHRoaXMuYWxwaGFFbGVtZW50LnNldEF0dHJpYnV0ZSgnc3BlbGxjaGVjaycsIGZhbHNlKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBkZXRlcm1pbmUgaW5pdGlhbCBjb2xvciB2YWx1ZVxyXG5cdFx0Ly9cclxuXHRcdHZhciBpbml0VmFsdWUgPSAnRkZGRkZGJztcclxuXHJcblx0XHRpZiAodGhpcy52YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGluaXRWYWx1ZSA9IHRoaXMudmFsdWU7IC8vIGdldCBpbml0aWFsIGNvbG9yIGZyb20gdGhlICd2YWx1ZScgcHJvcGVydHlcclxuXHRcdH0gZWxzZSBpZiAodGhpcy52YWx1ZUVsZW1lbnQgJiYgdGhpcy52YWx1ZUVsZW1lbnQudmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRpbml0VmFsdWUgPSB0aGlzLnZhbHVlRWxlbWVudC52YWx1ZTsgLy8gZ2V0IGluaXRpYWwgY29sb3IgZnJvbSB2YWx1ZUVsZW1lbnQncyB2YWx1ZVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGRldGVybWluZSBpbml0aWFsIGFscGhhIHZhbHVlXHJcblx0XHQvL1xyXG5cdFx0dmFyIGluaXRBbHBoYSA9IHVuZGVmaW5lZDtcclxuXHJcblx0XHRpZiAodGhpcy5hbHBoYSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGluaXRBbHBoYSA9ICgnJyt0aGlzLmFscGhhKTsgLy8gZ2V0IGluaXRpYWwgYWxwaGEgdmFsdWUgZnJvbSB0aGUgJ2FscGhhJyBwcm9wZXJ0eVxyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmFscGhhRWxlbWVudCAmJiB0aGlzLmFscGhhRWxlbWVudC52YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGluaXRBbHBoYSA9IHRoaXMuYWxwaGFFbGVtZW50LnZhbHVlOyAvLyBnZXQgaW5pdGlhbCBjb2xvciBmcm9tIGFscGhhRWxlbWVudCdzIHZhbHVlXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZGV0ZXJtaW5lIGN1cnJlbnQgZm9ybWF0IGJhc2VkIG9uIHRoZSBpbml0aWFsIGNvbG9yIHZhbHVlXHJcblx0XHQvL1xyXG5cdFx0dGhpcy5fY3VycmVudEZvcm1hdCA9IG51bGw7XHJcblxyXG5cdFx0aWYgKFsnYXV0bycsICdhbnknXS5pbmRleE9mKHRoaXMuZm9ybWF0LnRvTG93ZXJDYXNlKCkpID4gLTEpIHtcclxuXHRcdFx0Ly8gZm9ybWF0IGlzICdhdXRvJyBvciAnYW55JyAtPiBsZXQncyBhdXRvLWRldGVjdCBjdXJyZW50IGZvcm1hdFxyXG5cdFx0XHR2YXIgY29sb3IgPSBqc2MucGFyc2VDb2xvclN0cmluZyhpbml0VmFsdWUpO1xyXG5cdFx0XHR0aGlzLl9jdXJyZW50Rm9ybWF0ID0gY29sb3IgPyBjb2xvci5mb3JtYXQgOiAnaGV4JztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIGZvcm1hdCBpcyBzcGVjaWZpZWRcclxuXHRcdFx0dGhpcy5fY3VycmVudEZvcm1hdCA9IHRoaXMuZm9ybWF0LnRvTG93ZXJDYXNlKCk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGxldCdzIHBhcnNlIHRoZSBpbml0aWFsIGNvbG9yIHZhbHVlIGFuZCBleHBvc2UgY29sb3IncyBwcmV2aWV3XHJcblx0XHR0aGlzLnByb2Nlc3NWYWx1ZUlucHV0KGluaXRWYWx1ZSk7XHJcblxyXG5cdFx0Ly8gbGV0J3MgYWxzbyBwYXJzZSBhbmQgZXhwb3NlIHRoZSBpbml0aWFsIGFscGhhIHZhbHVlLCBpZiBhbnlcclxuXHRcdC8vXHJcblx0XHQvLyBOb3RlOiBJZiB0aGUgaW5pdGlhbCBjb2xvciB2YWx1ZSBjb250YWlucyBhbHBoYSB2YWx1ZSBpbiBpdCAoZS5nLiBpbiByZ2JhIGZvcm1hdCksXHJcblx0XHQvLyB0aGlzIHdpbGwgb3ZlcndyaXRlIGl0LiBTbyB3ZSBzaG91bGQgb25seSBwcm9jZXNzIGFscGhhIGlucHV0IGlmIHRoZXJlIHdhcyBpbml0aWFsXHJcblx0XHQvLyBhbHBoYSBleHBsaWNpdGx5IHNldCwgb3RoZXJ3aXNlIHdlIGNvdWxkIG5lZWRsZXNzbHkgbG9zZSBpbml0aWFsIHZhbHVlJ3MgYWxwaGFcclxuXHRcdGlmIChpbml0QWxwaGEgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHR0aGlzLnByb2Nlc3NBbHBoYUlucHV0KGluaXRBbHBoYSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMucmFuZG9tKSB7XHJcblx0XHRcdC8vIHJhbmRvbWl6ZSB0aGUgaW5pdGlhbCBjb2xvciB2YWx1ZVxyXG5cdFx0XHR0aGlzLnJhbmRvbWl6ZS5hcHBseSh0aGlzLCBBcnJheS5pc0FycmF5KHRoaXMucmFuZG9tKSA/IHRoaXMucmFuZG9tIDogW10pO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG59O1xyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gUHVibGljIHByb3BlcnRpZXMgYW5kIG1ldGhvZHNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuLy9cclxuLy8gVGhlc2Ugd2lsbCBiZSBwdWJsaWNseSBhdmFpbGFibGUgdmlhIGpzY29sb3IuPG5hbWU+IGFuZCBKU0NvbG9yLjxuYW1lPlxyXG4vL1xyXG5cclxuXHJcbi8vIGNsYXNzIHRoYXQgd2lsbCBiZSBzZXQgdG8gZWxlbWVudHMgaGF2aW5nIGpzY29sb3IgaW5zdGFsbGVkIG9uIHRoZW1cclxuanNjLnB1Yi5jbGFzc05hbWUgPSAnanNjb2xvcic7XHJcblxyXG5cclxuLy8gY2xhc3MgdGhhdCB3aWxsIGJlIHNldCB0byBlbGVtZW50cyBoYXZpbmcganNjb2xvciBhY3RpdmUgb24gdGhlbVxyXG5qc2MucHViLmFjdGl2ZUNsYXNzTmFtZSA9ICdqc2NvbG9yLWFjdGl2ZSc7XHJcblxyXG5cclxuLy8gd2hldGhlciB0byB0cnkgdG8gcGFyc2UgdGhlIG9wdGlvbnMgc3RyaW5nIGJ5IGV2YWx1YXRpbmcgaXQgdXNpbmcgJ25ldyBGdW5jdGlvbigpJ1xyXG4vLyBpbiBjYXNlIGl0IGNvdWxkIG5vdCBiZSBwYXJzZWQgd2l0aCBKU09OLnBhcnNlKClcclxuanNjLnB1Yi5sb29zZUpTT04gPSB0cnVlO1xyXG5cclxuXHJcbi8vIHByZXNldHNcclxuanNjLnB1Yi5wcmVzZXRzID0ge307XHJcblxyXG4vLyBidWlsdC1pbiBwcmVzZXRzXHJcbmpzYy5wdWIucHJlc2V0c1snZGVmYXVsdCddID0ge307IC8vIGJhc2VsaW5lIGZvciBjdXN0b21pemF0aW9uXHJcblxyXG5qc2MucHViLnByZXNldHNbJ2xpZ2h0J10gPSB7IC8vIGRlZmF1bHQgY29sb3Igc2NoZW1lXHJcblx0YmFja2dyb3VuZENvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwxKScsXHJcblx0Y29udHJvbEJvcmRlckNvbG9yOiAncmdiYSgxODcsMTg3LDE4NywxKScsXHJcblx0YnV0dG9uQ29sb3I6ICdyZ2JhKDAsMCwwLDEpJyxcclxufTtcclxuanNjLnB1Yi5wcmVzZXRzWydkYXJrJ10gPSB7XHJcblx0YmFja2dyb3VuZENvbG9yOiAncmdiYSg1MSw1MSw1MSwxKScsXHJcblx0Y29udHJvbEJvcmRlckNvbG9yOiAncmdiYSgxNTMsMTUzLDE1MywxKScsXHJcblx0YnV0dG9uQ29sb3I6ICdyZ2JhKDI0MCwyNDAsMjQwLDEpJyxcclxufTtcclxuXHJcbmpzYy5wdWIucHJlc2V0c1snc21hbGwnXSA9IHsgd2lkdGg6MTAxLCBoZWlnaHQ6MTAxLCBwYWRkaW5nOjEwLCBzbGlkZXJTaXplOjE0LCBwYWxldHRlQ29sczo4IH07XHJcbmpzYy5wdWIucHJlc2V0c1snbWVkaXVtJ10gPSB7IHdpZHRoOjE4MSwgaGVpZ2h0OjEwMSwgcGFkZGluZzoxMiwgc2xpZGVyU2l6ZToxNiwgcGFsZXR0ZUNvbHM6MTAgfTsgLy8gZGVmYXVsdCBzaXplXHJcbmpzYy5wdWIucHJlc2V0c1snbGFyZ2UnXSA9IHsgd2lkdGg6MjcxLCBoZWlnaHQ6MTUxLCBwYWRkaW5nOjEyLCBzbGlkZXJTaXplOjI0LCBwYWxldHRlQ29sczoxNSB9O1xyXG5cclxuanNjLnB1Yi5wcmVzZXRzWyd0aGluJ10gPSB7IGJvcmRlcldpZHRoOjEsIGNvbnRyb2xCb3JkZXJXaWR0aDoxLCBwb2ludGVyQm9yZGVyV2lkdGg6MSB9OyAvLyBkZWZhdWx0IHRoaWNrbmVzc1xyXG5qc2MucHViLnByZXNldHNbJ3RoaWNrJ10gPSB7IGJvcmRlcldpZHRoOjIsIGNvbnRyb2xCb3JkZXJXaWR0aDoyLCBwb2ludGVyQm9yZGVyV2lkdGg6MiB9O1xyXG5cclxuXHJcbi8vIHNpemUgb2Ygc3BhY2UgaW4gdGhlIHNsaWRlcnNcclxuanNjLnB1Yi5zbGlkZXJJbm5lclNwYWNlID0gMzsgLy8gcHhcclxuXHJcbi8vIHRyYW5zcGFyZW5jeSBjaGVzc2JvYXJkXHJcbmpzYy5wdWIuY2hlc3Nib2FyZFNpemUgPSA4OyAvLyBweFxyXG5qc2MucHViLmNoZXNzYm9hcmRDb2xvcjEgPSAnIzY2NjY2Nic7XHJcbmpzYy5wdWIuY2hlc3Nib2FyZENvbG9yMiA9ICcjOTk5OTk5JztcclxuXHJcbi8vIHByZXZpZXcgc2VwYXJhdG9yXHJcbmpzYy5wdWIucHJldmlld1NlcGFyYXRvciA9IFsncmdiYSgyNTUsMjU1LDI1NSwuNjUpJywgJ3JnYmEoMTI4LDEyOCwxMjgsLjY1KSddO1xyXG5cclxuXHJcbi8vIEluaXRpYWxpemVzIGpzY29sb3JcclxuanNjLnB1Yi5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG5cdGlmIChqc2MuaW5pdGlhbGl6ZWQpIHtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdC8vIGF0dGFjaCBzb21lIG5lY2Vzc2FyeSBoYW5kbGVyc1xyXG5cdHdpbmRvdy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBqc2Mub25Eb2N1bWVudE1vdXNlRG93biwgZmFsc2UpO1xyXG5cdHdpbmRvdy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGpzYy5vbkRvY3VtZW50S2V5VXAsIGZhbHNlKTtcclxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywganNjLm9uV2luZG93UmVzaXplLCBmYWxzZSk7XHJcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGpzYy5vbldpbmRvd1Njcm9sbCwgZmFsc2UpO1xyXG5cclxuXHQvLyBhcHBlbmQgZGVmYXVsdCBDU1MgdG8gSEVBRFxyXG5cdGpzYy5hcHBlbmREZWZhdWx0Q3NzKCk7XHJcblxyXG5cdC8vIGluc3RhbGwganNjb2xvciBvbiBjdXJyZW50IERPTVxyXG5cdGpzYy5wdWIuaW5zdGFsbCgpO1xyXG5cclxuXHRqc2MuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuXHQvLyBjYWxsIGZ1bmN0aW9ucyB3YWl0aW5nIGluIHRoZSBxdWV1ZVxyXG5cdHdoaWxlIChqc2MucmVhZHlRdWV1ZS5sZW5ndGgpIHtcclxuXHRcdHZhciBmdW5jID0ganNjLnJlYWR5UXVldWUuc2hpZnQoKTtcclxuXHRcdGZ1bmMoKTtcclxuXHR9XHJcbn07XHJcblxyXG5cclxuLy8gSW5zdGFsbHMganNjb2xvciBvbiBjdXJyZW50IERPTSB0cmVlXHJcbmpzYy5wdWIuaW5zdGFsbCA9IGZ1bmN0aW9uIChyb290Tm9kZSkge1xyXG5cdHZhciBzdWNjZXNzID0gdHJ1ZTtcclxuXHJcblx0dHJ5IHtcclxuXHRcdGpzYy5pbnN0YWxsQnlTZWxlY3RvcignW2RhdGEtanNjb2xvcl0nLCByb290Tm9kZSk7XHJcblx0fSBjYXRjaCAoZSkge1xyXG5cdFx0c3VjY2VzcyA9IGZhbHNlO1xyXG5cdFx0Y29uc29sZS53YXJuKGUpO1xyXG5cdH1cclxuXHJcblx0Ly8gZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgd2l0aCBERVBSRUNBVEVEIGluc3RhbGxhdGlvbiB1c2luZyBjbGFzcyBuYW1lXHJcblx0aWYgKGpzYy5wdWIubG9va3VwQ2xhc3MpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGpzYy5pbnN0YWxsQnlTZWxlY3RvcihcclxuXHRcdFx0XHQoXHJcblx0XHRcdFx0XHQnaW5wdXQuJyArIGpzYy5wdWIubG9va3VwQ2xhc3MgKyAnLCAnICtcclxuXHRcdFx0XHRcdCdidXR0b24uJyArIGpzYy5wdWIubG9va3VwQ2xhc3NcclxuXHRcdFx0XHQpLFxyXG5cdFx0XHRcdHJvb3ROb2RlXHJcblx0XHRcdCk7XHJcblx0XHR9IGNhdGNoIChlKSB7fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHN1Y2Nlc3M7XHJcbn07XHJcblxyXG5cclxuLy8gUmVnaXN0ZXJzIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBhcyBzb29uIGFzIGpzY29sb3IgaXMgaW5pdGlhbGl6ZWQgKG9yIGltbWVkaWF0ZWx5LCBpZiBpdCBhbHJlYWR5IGlzKS5cclxuLy9cclxuanNjLnB1Yi5yZWFkeSA9IGZ1bmN0aW9uIChmdW5jKSB7XHJcblx0aWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRjb25zb2xlLndhcm4oJ1Bhc3NlZCB2YWx1ZSBpcyBub3QgYSBmdW5jdGlvbicpO1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0aWYgKGpzYy5pbml0aWFsaXplZCkge1xyXG5cdFx0ZnVuYygpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRqc2MucmVhZHlRdWV1ZS5wdXNoKGZ1bmMpO1xyXG5cdH1cclxuXHRyZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcblxyXG4vLyBUcmlnZ2VycyBnaXZlbiBpbnB1dCBldmVudChzKSAoZS5nLiAnaW5wdXQnIG9yICdjaGFuZ2UnKSBvbiBhbGwgY29sb3IgcGlja2Vycy5cclxuLy9cclxuLy8gSXQgaXMgcG9zc2libGUgdG8gc3BlY2lmeSBtdWx0aXBsZSBldmVudHMgc2VwYXJhdGVkIHdpdGggYSBzcGFjZS5cclxuLy8gSWYgY2FsbGVkIGJlZm9yZSBqc2NvbG9yIGlzIGluaXRpYWxpemVkLCB0aGVuIHRoZSBldmVudHMgd2lsbCBiZSB0cmlnZ2VyZWQgYWZ0ZXIgaW5pdGlhbGl6YXRpb24uXHJcbi8vXHJcbmpzYy5wdWIudHJpZ2dlciA9IGZ1bmN0aW9uIChldmVudE5hbWVzKSB7XHJcblx0dmFyIHRyaWdnZXJOb3cgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRqc2MudHJpZ2dlckdsb2JhbChldmVudE5hbWVzKTtcclxuXHR9O1xyXG5cclxuXHRpZiAoanNjLmluaXRpYWxpemVkKSB7XHJcblx0XHR0cmlnZ2VyTm93KCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGpzYy5wdWIucmVhZHkodHJpZ2dlck5vdyk7XHJcblx0fVxyXG59O1xyXG5cclxuXHJcbi8vIEhpZGVzIGN1cnJlbnQgY29sb3IgcGlja2VyIGJveFxyXG5qc2MucHViLmhpZGUgPSBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKGpzYy5waWNrZXIgJiYganNjLnBpY2tlci5vd25lcikge1xyXG5cdFx0anNjLnBpY2tlci5vd25lci5oaWRlKCk7XHJcblx0fVxyXG59O1xyXG5cclxuXHJcbi8vIFJldHVybnMgYSBkYXRhIFVSTCBvZiBhIGdyYXkgY2hlc3Nib2FyZCBpbWFnZSB0aGF0IGluZGljYXRlcyB0cmFuc3BhcmVuY3lcclxuanNjLnB1Yi5jaGVzc2JvYXJkID0gZnVuY3Rpb24gKGNvbG9yKSB7XHJcblx0aWYgKCFjb2xvcikge1xyXG5cdFx0Y29sb3IgPSAncmdiYSgwLDAsMCwwKSc7XHJcblx0fVxyXG5cdHZhciBwcmV2aWV3ID0ganNjLmdlbkNvbG9yUHJldmlld0NhbnZhcyhjb2xvcik7XHJcblx0cmV0dXJuIHByZXZpZXcuY2FudmFzLnRvRGF0YVVSTCgpO1xyXG59O1xyXG5cclxuXHJcbi8vIFJldHVybnMgYSBkYXRhIFVSTCBvZiBhIGdyYXkgY2hlc3Nib2FyZCBpbWFnZSB0aGF0IGluZGljYXRlcyB0cmFuc3BhcmVuY3lcclxuanNjLnB1Yi5iYWNrZ3JvdW5kID0gZnVuY3Rpb24gKGNvbG9yKSB7XHJcblx0dmFyIGJhY2tncm91bmRzID0gW107XHJcblxyXG5cdC8vIENTUyBncmFkaWVudCBmb3IgYmFja2dyb3VuZCBjb2xvciBwcmV2aWV3XHJcblx0YmFja2dyb3VuZHMucHVzaChqc2MuZ2VuQ29sb3JQcmV2aWV3R3JhZGllbnQoY29sb3IpKTtcclxuXHJcblx0Ly8gZGF0YSBVUkwgb2YgZ2VuZXJhdGVkIFBORyBpbWFnZSB3aXRoIGEgZ3JheSB0cmFuc3BhcmVuY3kgY2hlc3Nib2FyZFxyXG5cdHZhciBwcmV2aWV3ID0ganNjLmdlbkNvbG9yUHJldmlld0NhbnZhcygpO1xyXG5cdGJhY2tncm91bmRzLnB1c2goW1xyXG5cdFx0J3VybChcXCcnICsgcHJldmlldy5jYW52YXMudG9EYXRhVVJMKCkgKyAnXFwnKScsXHJcblx0XHQnbGVmdCB0b3AnLFxyXG5cdFx0J3JlcGVhdCcsXHJcblx0XS5qb2luKCcgJykpO1xyXG5cclxuXHRyZXR1cm4gYmFja2dyb3VuZHMuam9pbignLCAnKTtcclxufTtcclxuXHJcblxyXG4vL1xyXG4vLyBERVBSRUNBVEVEIHByb3BlcnRpZXMgYW5kIG1ldGhvZHNcclxuLy9cclxuXHJcblxyXG4vLyBERVBSRUNBVEVELiBVc2UganNjb2xvci5wcmVzZXRzLmRlZmF1bHQgaW5zdGVhZC5cclxuLy9cclxuLy8gQ3VzdG9tIGRlZmF1bHQgb3B0aW9ucyBmb3IgYWxsIGNvbG9yIHBpY2tlcnMsIGUuZy4geyBoYXNoOiB0cnVlLCB3aWR0aDogMzAwIH1cclxuanNjLnB1Yi5vcHRpb25zID0ge307XHJcblxyXG5cclxuLy8gREVQUkVDQVRFRC4gVXNlIGRhdGEtanNjb2xvciBhdHRyaWJ1dGUgaW5zdGVhZCwgd2hpY2ggaW5zdGFsbHMganNjb2xvciBvbiBnaXZlbiBlbGVtZW50LlxyXG4vL1xyXG4vLyBCeSBkZWZhdWx0LCB3ZSdsbCBzZWFyY2ggZm9yIGFsbCBlbGVtZW50cyB3aXRoIGNsYXNzPVwianNjb2xvclwiIGFuZCBpbnN0YWxsIGEgY29sb3IgcGlja2VyIG9uIHRoZW0uXHJcbi8vXHJcbi8vIFlvdSBjYW4gY2hhbmdlIHdoYXQgY2xhc3MgbmFtZSB3aWxsIGJlIGxvb2tlZCBmb3IgYnkgc2V0dGluZyB0aGUgcHJvcGVydHkganNjb2xvci5sb29rdXBDbGFzc1xyXG4vLyBhbnl3aGVyZSBpbiB5b3VyIEhUTUwgZG9jdW1lbnQuIFRvIGNvbXBsZXRlbHkgZGlzYWJsZSB0aGUgYXV0b21hdGljIGxvb2t1cCwgc2V0IGl0IHRvIG51bGwuXHJcbi8vXHJcbmpzYy5wdWIubG9va3VwQ2xhc3MgPSAnanNjb2xvcic7XHJcblxyXG5cclxuLy8gREVQUkVDQVRFRC4gVXNlIGRhdGEtanNjb2xvciBhdHRyaWJ1dGUgaW5zdGVhZCwgd2hpY2ggaW5zdGFsbHMganNjb2xvciBvbiBnaXZlbiBlbGVtZW50LlxyXG4vL1xyXG4vLyBJbnN0YWxsIGpzY29sb3Igb24gYWxsIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgc3BlY2lmaWVkIGNsYXNzIG5hbWVcclxuanNjLnB1Yi5pbnN0YWxsQnlDbGFzc05hbWUgPSBmdW5jdGlvbiAoKSB7XHJcblx0Y29uc29sZS5lcnJvcignanNjb2xvci5pbnN0YWxsQnlDbGFzc05hbWUoKSBpcyBERVBSRUNBVEVELiBVc2UgZGF0YS1qc2NvbG9yPVwiXCIgYXR0cmlidXRlIGluc3RlYWQgb2YgYSBjbGFzcyBuYW1lLicgKyBqc2MuZG9jc1JlZik7XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuXHJcbmpzYy5yZWdpc3RlcigpO1xyXG5cclxuXHJcbnJldHVybiBqc2MucHViO1xyXG5cclxuXHJcbn0pKCk7IC8vIEVORCBqc2NvbG9yXHJcblxyXG5cclxuaWYgKHR5cGVvZiB3aW5kb3cuanNjb2xvciA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuXHR3aW5kb3cuanNjb2xvciA9IHdpbmRvdy5KU0NvbG9yID0ganNjb2xvcjtcclxufVxyXG5cclxuXHJcbi8vIEVORCBqc2NvbG9yIGNvZGVcclxuXHJcbnJldHVybiBqc2NvbG9yO1xyXG5cclxufSk7IC8vIEVORCBmYWN0b3J5XHJcbiIsIi8qISBQaWNrciAxLjguMiBNSVQgfCBodHRwczovL2dpdGh1Yi5jb20vU2ltb253ZXAvcGlja3IgKi9cbiFmdW5jdGlvbih0LGUpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPWUoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtdLGUpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP2V4cG9ydHMuUGlja3I9ZSgpOnQuUGlja3I9ZSgpfShzZWxmLChmdW5jdGlvbigpe3JldHVybigoKT0+e1widXNlIHN0cmljdFwiO3ZhciB0PXtkOihlLG8pPT57Zm9yKHZhciBuIGluIG8pdC5vKG8sbikmJiF0Lm8oZSxuKSYmT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsbix7ZW51bWVyYWJsZTohMCxnZXQ6b1tuXX0pfSxvOih0LGUpPT5PYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxlKSxyOnQ9PntcInVuZGVmaW5lZFwiIT10eXBlb2YgU3ltYm9sJiZTeW1ib2wudG9TdHJpbmdUYWcmJk9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFN5bWJvbC50b1N0cmluZ1RhZyx7dmFsdWU6XCJNb2R1bGVcIn0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfX0sZT17fTt0LmQoZSx7ZGVmYXVsdDooKT0+TH0pO3ZhciBvPXt9O2Z1bmN0aW9uIG4odCxlLG8sbixpPXt9KXtlIGluc3RhbmNlb2YgSFRNTENvbGxlY3Rpb258fGUgaW5zdGFuY2VvZiBOb2RlTGlzdD9lPUFycmF5LmZyb20oZSk6QXJyYXkuaXNBcnJheShlKXx8KGU9W2VdKSxBcnJheS5pc0FycmF5KG8pfHwobz1bb10pO2Zvcihjb25zdCBzIG9mIGUpZm9yKGNvbnN0IGUgb2YgbylzW3RdKGUsbix7Y2FwdHVyZTohMSwuLi5pfSk7cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKX10LnIobyksdC5kKG8se2FkanVzdGFibGVJbnB1dE51bWJlcnM6KCk9PnAsY3JlYXRlRWxlbWVudEZyb21TdHJpbmc6KCk9PnIsY3JlYXRlRnJvbVRlbXBsYXRlOigpPT5hLGV2ZW50UGF0aDooKT0+bCxvZmY6KCk9PnMsb246KCk9PmkscmVzb2x2ZUVsZW1lbnQ6KCk9PmN9KTtjb25zdCBpPW4uYmluZChudWxsLFwiYWRkRXZlbnRMaXN0ZW5lclwiKSxzPW4uYmluZChudWxsLFwicmVtb3ZlRXZlbnRMaXN0ZW5lclwiKTtmdW5jdGlvbiByKHQpe2NvbnN0IGU9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtyZXR1cm4gZS5pbm5lckhUTUw9dC50cmltKCksZS5maXJzdEVsZW1lbnRDaGlsZH1mdW5jdGlvbiBhKHQpe2NvbnN0IGU9KHQsZSk9Pntjb25zdCBvPXQuZ2V0QXR0cmlidXRlKGUpO3JldHVybiB0LnJlbW92ZUF0dHJpYnV0ZShlKSxvfSxvPSh0LG49e30pPT57Y29uc3QgaT1lKHQsXCI6b2JqXCIpLHM9ZSh0LFwiOnJlZlwiKSxyPWk/bltpXT17fTpuO3MmJihuW3NdPXQpO2Zvcihjb25zdCBuIG9mIEFycmF5LmZyb20odC5jaGlsZHJlbikpe2NvbnN0IHQ9ZShuLFwiOmFyclwiKSxpPW8obix0P3t9OnIpO3QmJihyW3RdfHwoclt0XT1bXSkpLnB1c2goT2JqZWN0LmtleXMoaSkubGVuZ3RoP2k6bil9cmV0dXJuIG59O3JldHVybiBvKHIodCkpfWZ1bmN0aW9uIGwodCl7bGV0IGU9dC5wYXRofHx0LmNvbXBvc2VkUGF0aCYmdC5jb21wb3NlZFBhdGgoKTtpZihlKXJldHVybiBlO2xldCBvPXQudGFyZ2V0LnBhcmVudEVsZW1lbnQ7Zm9yKGU9W3QudGFyZ2V0LG9dO289by5wYXJlbnRFbGVtZW50OyllLnB1c2gobyk7cmV0dXJuIGUucHVzaChkb2N1bWVudCx3aW5kb3cpLGV9ZnVuY3Rpb24gYyh0KXtyZXR1cm4gdCBpbnN0YW5jZW9mIEVsZW1lbnQ/dDpcInN0cmluZ1wiPT10eXBlb2YgdD90LnNwbGl0KC8+Pi9nKS5yZWR1Y2UoKCh0LGUsbyxuKT0+KHQ9dC5xdWVyeVNlbGVjdG9yKGUpLG88bi5sZW5ndGgtMT90LnNoYWRvd1Jvb3Q6dCkpLGRvY3VtZW50KTpudWxsfWZ1bmN0aW9uIHAodCxlPSh0PT50KSl7ZnVuY3Rpb24gbyhvKXtjb25zdCBuPVsuMDAxLC4wMSwuMV1bTnVtYmVyKG8uc2hpZnRLZXl8fDIqby5jdHJsS2V5KV0qKG8uZGVsdGFZPDA/MTotMSk7bGV0IGk9MCxzPXQuc2VsZWN0aW9uU3RhcnQ7dC52YWx1ZT10LnZhbHVlLnJlcGxhY2UoL1tcXGQuXSsvZywoKHQsbyk9Pm88PXMmJm8rdC5sZW5ndGg+PXM/KHM9byxlKE51bWJlcih0KSxuLGkpKTooaSsrLHQpKSksdC5mb2N1cygpLHQuc2V0U2VsZWN0aW9uUmFuZ2UocyxzKSxvLnByZXZlbnREZWZhdWx0KCksdC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImlucHV0XCIpKX1pKHQsXCJmb2N1c1wiLCgoKT0+aSh3aW5kb3csXCJ3aGVlbFwiLG8se3Bhc3NpdmU6ITF9KSkpLGkodCxcImJsdXJcIiwoKCk9PnMod2luZG93LFwid2hlZWxcIixvKSkpfWNvbnN0e21pbjp1LG1heDpoLGZsb29yOmQscm91bmQ6bX09TWF0aDtmdW5jdGlvbiBmKHQsZSxvKXtlLz0xMDAsby89MTAwO2NvbnN0IG49ZCh0PXQvMzYwKjYpLGk9dC1uLHM9byooMS1lKSxyPW8qKDEtaSplKSxhPW8qKDEtKDEtaSkqZSksbD1uJTY7cmV0dXJuWzI1NSpbbyxyLHMscyxhLG9dW2xdLDI1NSpbYSxvLG8scixzLHNdW2xdLDI1NSpbcyxzLGEsbyxvLHJdW2xdXX1mdW5jdGlvbiB2KHQsZSxvKXtjb25zdCBuPSgyLShlLz0xMDApKSooby89MTAwKS8yO3JldHVybiAwIT09biYmKGU9MT09PW4/MDpuPC41P2Uqby8oMipuKTplKm8vKDItMipuKSksW3QsMTAwKmUsMTAwKm5dfWZ1bmN0aW9uIGIodCxlLG8pe2NvbnN0IG49dSh0Lz0yNTUsZS89MjU1LG8vPTI1NSksaT1oKHQsZSxvKSxzPWktbjtsZXQgcixhO2lmKDA9PT1zKXI9YT0wO2Vsc2V7YT1zL2k7Y29uc3Qgbj0oKGktdCkvNitzLzIpL3MsbD0oKGktZSkvNitzLzIpL3MsYz0oKGktbykvNitzLzIpL3M7dD09PWk/cj1jLWw6ZT09PWk/cj0xLzMrbi1jOm89PT1pJiYocj0yLzMrbC1uKSxyPDA/cis9MTpyPjEmJihyLT0xKX1yZXR1cm5bMzYwKnIsMTAwKmEsMTAwKmldfWZ1bmN0aW9uIHkodCxlLG8sbil7ZS89MTAwLG8vPTEwMDtyZXR1cm5bLi4uYigyNTUqKDEtdSgxLCh0Lz0xMDApKigxLShuLz0xMDApKStuKSksMjU1KigxLXUoMSxlKigxLW4pK24pKSwyNTUqKDEtdSgxLG8qKDEtbikrbikpKV19ZnVuY3Rpb24gZyh0LGUsbyl7ZS89MTAwO2NvbnN0IG49MiooZSo9KG8vPTEwMCk8LjU/bzoxLW8pLyhvK2UpKjEwMCxpPTEwMCoobytlKTtyZXR1cm5bdCxpc05hTihuKT8wOm4saV19ZnVuY3Rpb24gXyh0KXtyZXR1cm4gYiguLi50Lm1hdGNoKC8uezJ9L2cpLm1hcCgodD0+cGFyc2VJbnQodCwxNikpKSl9ZnVuY3Rpb24gdyh0KXt0PXQubWF0Y2goL15bYS16QS1aXSskLyk/ZnVuY3Rpb24odCl7aWYoXCJibGFja1wiPT09dC50b0xvd2VyQ2FzZSgpKXJldHVyblwiIzAwMFwiO2NvbnN0IGU9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKS5nZXRDb250ZXh0KFwiMmRcIik7cmV0dXJuIGUuZmlsbFN0eWxlPXQsXCIjMDAwXCI9PT1lLmZpbGxTdHlsZT9udWxsOmUuZmlsbFN0eWxlfSh0KTp0O2NvbnN0IGU9e2NteWs6L15jbXlrW1xcRF0rKFtcXGQuXSspW1xcRF0rKFtcXGQuXSspW1xcRF0rKFtcXGQuXSspW1xcRF0rKFtcXGQuXSspL2kscmdiYTovXigocmdiYSl8cmdiKVtcXERdKyhbXFxkLl0rKVtcXERdKyhbXFxkLl0rKVtcXERdKyhbXFxkLl0rKVtcXERdKj8oW1xcZC5dK3wkKS9pLGhzbGE6L14oKGhzbGEpfGhzbClbXFxEXSsoW1xcZC5dKylbXFxEXSsoW1xcZC5dKylbXFxEXSsoW1xcZC5dKylbXFxEXSo/KFtcXGQuXSt8JCkvaSxoc3ZhOi9eKChoc3ZhKXxoc3YpW1xcRF0rKFtcXGQuXSspW1xcRF0rKFtcXGQuXSspW1xcRF0rKFtcXGQuXSspW1xcRF0qPyhbXFxkLl0rfCQpL2ksaGV4YTovXiM/KChbXFxkQS1GYS1mXXszLDR9KXwoW1xcZEEtRmEtZl17Nn0pfChbXFxkQS1GYS1mXXs4fSkpJC9pfSxvPXQ9PnQubWFwKCh0PT4vXih8XFxkKylcXC5cXGQrfFxcZCskLy50ZXN0KHQpP051bWJlcih0KTp2b2lkIDApKTtsZXQgbjt0OmZvcihjb25zdCBpIGluIGUpe2lmKCEobj1lW2ldLmV4ZWModCkpKWNvbnRpbnVlO2NvbnN0IHM9dD0+ISFuWzJdPT0oXCJudW1iZXJcIj09dHlwZW9mIHQpO3N3aXRjaChpKXtjYXNlXCJjbXlrXCI6e2NvbnN0Wyx0LGUscyxyXT1vKG4pO2lmKHQ+MTAwfHxlPjEwMHx8cz4xMDB8fHI+MTAwKWJyZWFrIHQ7cmV0dXJue3ZhbHVlczp5KHQsZSxzLHIpLHR5cGU6aX19Y2FzZVwicmdiYVwiOntjb25zdFssLCx0LGUscixhXT1vKG4pO2lmKHQ+MjU1fHxlPjI1NXx8cj4yNTV8fGE8MHx8YT4xfHwhcyhhKSlicmVhayB0O3JldHVybnt2YWx1ZXM6Wy4uLmIodCxlLHIpLGFdLGEsdHlwZTppfX1jYXNlXCJoZXhhXCI6e2xldFssdF09bjs0IT09dC5sZW5ndGgmJjMhPT10Lmxlbmd0aHx8KHQ9dC5zcGxpdChcIlwiKS5tYXAoKHQ9PnQrdCkpLmpvaW4oXCJcIikpO2NvbnN0IGU9dC5zdWJzdHJpbmcoMCw2KTtsZXQgbz10LnN1YnN0cmluZyg2KTtyZXR1cm4gbz1vP3BhcnNlSW50KG8sMTYpLzI1NTp2b2lkIDAse3ZhbHVlczpbLi4uXyhlKSxvXSxhOm8sdHlwZTppfX1jYXNlXCJoc2xhXCI6e2NvbnN0WywsLHQsZSxyLGFdPW8obik7aWYodD4zNjB8fGU+MTAwfHxyPjEwMHx8YTwwfHxhPjF8fCFzKGEpKWJyZWFrIHQ7cmV0dXJue3ZhbHVlczpbLi4uZyh0LGUsciksYV0sYSx0eXBlOml9fWNhc2VcImhzdmFcIjp7Y29uc3RbLCwsdCxlLHIsYV09byhuKTtpZih0PjM2MHx8ZT4xMDB8fHI+MTAwfHxhPDB8fGE+MXx8IXMoYSkpYnJlYWsgdDtyZXR1cm57dmFsdWVzOlt0LGUscixhXSxhLHR5cGU6aX19fX1yZXR1cm57dmFsdWVzOm51bGwsdHlwZTpudWxsfX1mdW5jdGlvbiBBKHQ9MCxlPTAsbz0wLG49MSl7Y29uc3QgaT0odCxlKT0+KG89LTEpPT5lKH5vP3QubWFwKCh0PT5OdW1iZXIodC50b0ZpeGVkKG8pKSkpOnQpLHM9e2g6dCxzOmUsdjpvLGE6bix0b0hTVkEoKXtjb25zdCB0PVtzLmgscy5zLHMudixzLmFdO3JldHVybiB0LnRvU3RyaW5nPWkodCwodD0+YGhzdmEoJHt0WzBdfSwgJHt0WzFdfSUsICR7dFsyXX0lLCAke3MuYX0pYCkpLHR9LHRvSFNMQSgpe2NvbnN0IHQ9Wy4uLnYocy5oLHMucyxzLnYpLHMuYV07cmV0dXJuIHQudG9TdHJpbmc9aSh0LCh0PT5gaHNsYSgke3RbMF19LCAke3RbMV19JSwgJHt0WzJdfSUsICR7cy5hfSlgKSksdH0sdG9SR0JBKCl7Y29uc3QgdD1bLi4uZihzLmgscy5zLHMudikscy5hXTtyZXR1cm4gdC50b1N0cmluZz1pKHQsKHQ9PmByZ2JhKCR7dFswXX0sICR7dFsxXX0sICR7dFsyXX0sICR7cy5hfSlgKSksdH0sdG9DTVlLKCl7Y29uc3QgdD1mdW5jdGlvbih0LGUsbyl7Y29uc3Qgbj1mKHQsZSxvKSxpPW5bMF0vMjU1LHM9blsxXS8yNTUscj1uWzJdLzI1NSxhPXUoMS1pLDEtcywxLXIpO3JldHVyblsxMDAqKDE9PT1hPzA6KDEtaS1hKS8oMS1hKSksMTAwKigxPT09YT8wOigxLXMtYSkvKDEtYSkpLDEwMCooMT09PWE/MDooMS1yLWEpLygxLWEpKSwxMDAqYV19KHMuaCxzLnMscy52KTtyZXR1cm4gdC50b1N0cmluZz1pKHQsKHQ9PmBjbXlrKCR7dFswXX0lLCAke3RbMV19JSwgJHt0WzJdfSUsICR7dFszXX0lKWApKSx0fSx0b0hFWEEoKXtjb25zdCB0PWZ1bmN0aW9uKHQsZSxvKXtyZXR1cm4gZih0LGUsbykubWFwKCh0PT5tKHQpLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLFwiMFwiKSkpfShzLmgscy5zLHMudiksZT1zLmE+PTE/XCJcIjpOdW1iZXIoKDI1NSpzLmEpLnRvRml4ZWQoMCkpLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpLnBhZFN0YXJ0KDIsXCIwXCIpO3JldHVybiBlJiZ0LnB1c2goZSksdC50b1N0cmluZz0oKT0+YCMke3Quam9pbihcIlwiKS50b1VwcGVyQ2FzZSgpfWAsdH0sY2xvbmU6KCk9PkEocy5oLHMucyxzLnYscy5hKX07cmV0dXJuIHN9Y29uc3QgQz10PT5NYXRoLm1heChNYXRoLm1pbih0LDEpLDApO2Z1bmN0aW9uICQodCl7Y29uc3QgZT17b3B0aW9uczpPYmplY3QuYXNzaWduKHtsb2NrOm51bGwsb25jaGFuZ2U6KCk9PjAsb25zdG9wOigpPT4wfSx0KSxfa2V5Ym9hcmQodCl7Y29uc3R7b3B0aW9uczpvfT1lLHt0eXBlOm4sa2V5Oml9PXQ7aWYoZG9jdW1lbnQuYWN0aXZlRWxlbWVudD09PW8ud3JhcHBlcil7Y29uc3R7bG9jazpvfT1lLm9wdGlvbnMscz1cIkFycm93VXBcIj09PWkscj1cIkFycm93UmlnaHRcIj09PWksYT1cIkFycm93RG93blwiPT09aSxsPVwiQXJyb3dMZWZ0XCI9PT1pO2lmKFwia2V5ZG93blwiPT09biYmKHN8fHJ8fGF8fGwpKXtsZXQgbj0wLGk9MDtcInZcIj09PW8/bj1zfHxyPzE6LTE6XCJoXCI9PT1vP249c3x8cj8tMToxOihpPXM/LTE6YT8xOjAsbj1sPy0xOnI/MTowKSxlLnVwZGF0ZShDKGUuY2FjaGUueCsuMDEqbiksQyhlLmNhY2hlLnkrLjAxKmkpKSx0LnByZXZlbnREZWZhdWx0KCl9ZWxzZSBpLnN0YXJ0c1dpdGgoXCJBcnJvd1wiKSYmKGUub3B0aW9ucy5vbnN0b3AoKSx0LnByZXZlbnREZWZhdWx0KCkpfX0sX3RhcHN0YXJ0KHQpe2koZG9jdW1lbnQsW1wibW91c2V1cFwiLFwidG91Y2hlbmRcIixcInRvdWNoY2FuY2VsXCJdLGUuX3RhcHN0b3ApLGkoZG9jdW1lbnQsW1wibW91c2Vtb3ZlXCIsXCJ0b3VjaG1vdmVcIl0sZS5fdGFwbW92ZSksdC5jYW5jZWxhYmxlJiZ0LnByZXZlbnREZWZhdWx0KCksZS5fdGFwbW92ZSh0KX0sX3RhcG1vdmUodCl7Y29uc3R7b3B0aW9uczpvLGNhY2hlOm59PWUse2xvY2s6aSxlbGVtZW50OnMsd3JhcHBlcjpyfT1vLGE9ci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtsZXQgbD0wLGM9MDtpZih0KXtjb25zdCBlPXQmJnQudG91Y2hlcyYmdC50b3VjaGVzWzBdO2w9dD8oZXx8dCkuY2xpZW50WDowLGM9dD8oZXx8dCkuY2xpZW50WTowLGw8YS5sZWZ0P2w9YS5sZWZ0Omw+YS5sZWZ0K2Eud2lkdGgmJihsPWEubGVmdCthLndpZHRoKSxjPGEudG9wP2M9YS50b3A6Yz5hLnRvcCthLmhlaWdodCYmKGM9YS50b3ArYS5oZWlnaHQpLGwtPWEubGVmdCxjLT1hLnRvcH1lbHNlIG4mJihsPW4ueCphLndpZHRoLGM9bi55KmEuaGVpZ2h0KTtcImhcIiE9PWkmJihzLnN0eWxlLmxlZnQ9YGNhbGMoJHtsL2Eud2lkdGgqMTAwfSUgLSAke3Mub2Zmc2V0V2lkdGgvMn1weClgKSxcInZcIiE9PWkmJihzLnN0eWxlLnRvcD1gY2FsYygke2MvYS5oZWlnaHQqMTAwfSUgLSAke3Mub2Zmc2V0SGVpZ2h0LzJ9cHgpYCksZS5jYWNoZT17eDpsL2Eud2lkdGgseTpjL2EuaGVpZ2h0fTtjb25zdCBwPUMobC9hLndpZHRoKSx1PUMoYy9hLmhlaWdodCk7c3dpdGNoKGkpe2Nhc2VcInZcIjpyZXR1cm4gby5vbmNoYW5nZShwKTtjYXNlXCJoXCI6cmV0dXJuIG8ub25jaGFuZ2UodSk7ZGVmYXVsdDpyZXR1cm4gby5vbmNoYW5nZShwLHUpfX0sX3RhcHN0b3AoKXtlLm9wdGlvbnMub25zdG9wKCkscyhkb2N1bWVudCxbXCJtb3VzZXVwXCIsXCJ0b3VjaGVuZFwiLFwidG91Y2hjYW5jZWxcIl0sZS5fdGFwc3RvcCkscyhkb2N1bWVudCxbXCJtb3VzZW1vdmVcIixcInRvdWNobW92ZVwiXSxlLl90YXBtb3ZlKX0sdHJpZ2dlcigpe2UuX3RhcG1vdmUoKX0sdXBkYXRlKHQ9MCxvPTApe2NvbnN0e2xlZnQ6bix0b3A6aSx3aWR0aDpzLGhlaWdodDpyfT1lLm9wdGlvbnMud3JhcHBlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcImhcIj09PWUub3B0aW9ucy5sb2NrJiYobz10KSxlLl90YXBtb3ZlKHtjbGllbnRYOm4rcyp0LGNsaWVudFk6aStyKm99KX0sZGVzdHJveSgpe2NvbnN0e29wdGlvbnM6dCxfdGFwc3RhcnQ6byxfa2V5Ym9hcmQ6bn09ZTtzKGRvY3VtZW50LFtcImtleWRvd25cIixcImtleXVwXCJdLG4pLHMoW3Qud3JhcHBlcix0LmVsZW1lbnRdLFwibW91c2Vkb3duXCIsbykscyhbdC53cmFwcGVyLHQuZWxlbWVudF0sXCJ0b3VjaHN0YXJ0XCIsbyx7cGFzc2l2ZTohMX0pfX0se29wdGlvbnM6byxfdGFwc3RhcnQ6bixfa2V5Ym9hcmQ6cn09ZTtyZXR1cm4gaShbby53cmFwcGVyLG8uZWxlbWVudF0sXCJtb3VzZWRvd25cIixuKSxpKFtvLndyYXBwZXIsby5lbGVtZW50XSxcInRvdWNoc3RhcnRcIixuLHtwYXNzaXZlOiExfSksaShkb2N1bWVudCxbXCJrZXlkb3duXCIsXCJrZXl1cFwiXSxyKSxlfWZ1bmN0aW9uIGsodD17fSl7dD1PYmplY3QuYXNzaWduKHtvbmNoYW5nZTooKT0+MCxjbGFzc05hbWU6XCJcIixlbGVtZW50czpbXX0sdCk7Y29uc3QgZT1pKHQuZWxlbWVudHMsXCJjbGlja1wiLChlPT57dC5lbGVtZW50cy5mb3JFYWNoKChvPT5vLmNsYXNzTGlzdFtlLnRhcmdldD09PW8/XCJhZGRcIjpcInJlbW92ZVwiXSh0LmNsYXNzTmFtZSkpKSx0Lm9uY2hhbmdlKGUpLGUuc3RvcFByb3BhZ2F0aW9uKCl9KSk7cmV0dXJue2Rlc3Ryb3k6KCk9PnMoLi4uZSl9fWNvbnN0IFM9e3ZhcmlhbnRGbGlwT3JkZXI6e3N0YXJ0Olwic21lXCIsbWlkZGxlOlwibXNlXCIsZW5kOlwiZW1zXCJ9LHBvc2l0aW9uRmxpcE9yZGVyOnt0b3A6XCJ0YnJsXCIscmlnaHQ6XCJybHRiXCIsYm90dG9tOlwiYnRybFwiLGxlZnQ6XCJscmJ0XCJ9LHBvc2l0aW9uOlwiYm90dG9tXCIsbWFyZ2luOjh9LE89KHQsZSxvKT0+e2NvbnN0e2NvbnRhaW5lcjpuLG1hcmdpbjppLHBvc2l0aW9uOnMsdmFyaWFudEZsaXBPcmRlcjpyLHBvc2l0aW9uRmxpcE9yZGVyOmF9PXtjb250YWluZXI6ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLC4uLlMsLi4ub30se2xlZnQ6bCx0b3A6Y309ZS5zdHlsZTtlLnN0eWxlLmxlZnQ9XCIwXCIsZS5zdHlsZS50b3A9XCIwXCI7Y29uc3QgcD10LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLHU9ZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxoPXt0OnAudG9wLXUuaGVpZ2h0LWksYjpwLmJvdHRvbStpLHI6cC5yaWdodCtpLGw6cC5sZWZ0LXUud2lkdGgtaX0sZD17dnM6cC5sZWZ0LHZtOnAubGVmdCtwLndpZHRoLzIrLXUud2lkdGgvMix2ZTpwLmxlZnQrcC53aWR0aC11LndpZHRoLGhzOnAudG9wLGhtOnAuYm90dG9tLXAuaGVpZ2h0LzItdS5oZWlnaHQvMixoZTpwLmJvdHRvbS11LmhlaWdodH0sW20sZj1cIm1pZGRsZVwiXT1zLnNwbGl0KFwiLVwiKSx2PWFbbV0sYj1yW2ZdLHt0b3A6eSxsZWZ0OmcsYm90dG9tOl8scmlnaHQ6d309bjtmb3IoY29uc3QgdCBvZiB2KXtjb25zdCBvPVwidFwiPT09dHx8XCJiXCI9PT10LG49aFt0XSxbaSxzXT1vP1tcInRvcFwiLFwibGVmdFwiXTpbXCJsZWZ0XCIsXCJ0b3BcIl0sW3IsYV09bz9bdS5oZWlnaHQsdS53aWR0aF06W3Uud2lkdGgsdS5oZWlnaHRdLFtsLGNdPW8/W18sd106W3csX10sW3AsbV09bz9beSxnXTpbZyx5XTtpZighKG48cHx8bityPmwpKWZvcihjb25zdCByIG9mIGIpe2NvbnN0IGw9ZFsobz9cInZcIjpcImhcIikrcl07aWYoIShsPG18fGwrYT5jKSlyZXR1cm4gZS5zdHlsZVtzXT1sLXVbc10rXCJweFwiLGUuc3R5bGVbaV09bi11W2ldK1wicHhcIix0K3J9fXJldHVybiBlLnN0eWxlLmxlZnQ9bCxlLnN0eWxlLnRvcD1jLG51bGx9O2Z1bmN0aW9uIEUodCxlLG8pe3JldHVybiBlIGluIHQ/T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsZSx7dmFsdWU6byxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMH0pOnRbZV09byx0fWNsYXNzIEx7Y29uc3RydWN0b3IodCl7RSh0aGlzLFwiX2luaXRpYWxpemluZ0FjdGl2ZVwiLCEwKSxFKHRoaXMsXCJfcmVjYWxjXCIsITApLEUodGhpcyxcIl9uYW5vcG9wXCIsbnVsbCksRSh0aGlzLFwiX3Jvb3RcIixudWxsKSxFKHRoaXMsXCJfY29sb3JcIixBKCkpLEUodGhpcyxcIl9sYXN0Q29sb3JcIixBKCkpLEUodGhpcyxcIl9zd2F0Y2hDb2xvcnNcIixbXSksRSh0aGlzLFwiX3NldHVwQW5pbWF0aW9uRnJhbWVcIixudWxsKSxFKHRoaXMsXCJfZXZlbnRMaXN0ZW5lclwiLHtpbml0OltdLHNhdmU6W10saGlkZTpbXSxzaG93OltdLGNsZWFyOltdLGNoYW5nZTpbXSxjaGFuZ2VzdG9wOltdLGNhbmNlbDpbXSxzd2F0Y2hzZWxlY3Q6W119KSx0aGlzLm9wdGlvbnM9dD1PYmplY3QuYXNzaWduKHsuLi5MLkRFRkFVTFRfT1BUSU9OU30sdCk7Y29uc3R7c3dhdGNoZXM6ZSxjb21wb25lbnRzOm8sdGhlbWU6bixzbGlkZXJzOmksbG9ja09wYWNpdHk6cyxwYWRkaW5nOnJ9PXQ7W1wibmFub1wiLFwibW9ub2xpdGhcIl0uaW5jbHVkZXMobikmJiFpJiYodC5zbGlkZXJzPVwiaFwiKSxvLmludGVyYWN0aW9ufHwoby5pbnRlcmFjdGlvbj17fSk7Y29uc3R7cHJldmlldzphLG9wYWNpdHk6bCxodWU6YyxwYWxldHRlOnB9PW87by5vcGFjaXR5PSFzJiZsLG8ucGFsZXR0ZT1wfHxhfHxsfHxjLHRoaXMuX3ByZUJ1aWxkKCksdGhpcy5fYnVpbGRDb21wb25lbnRzKCksdGhpcy5fYmluZEV2ZW50cygpLHRoaXMuX2ZpbmFsQnVpbGQoKSxlJiZlLmxlbmd0aCYmZS5mb3JFYWNoKCh0PT50aGlzLmFkZFN3YXRjaCh0KSkpO2NvbnN0e2J1dHRvbjp1LGFwcDpofT10aGlzLl9yb290O3RoaXMuX25hbm9wb3A9KCh0LGUsbyk9Pntjb25zdCBuPVwib2JqZWN0XCIhPXR5cGVvZiB0fHx0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ/e3JlZmVyZW5jZTp0LHBvcHBlcjplLC4uLm99OnQ7cmV0dXJue3VwZGF0ZSh0PW4pe2NvbnN0e3JlZmVyZW5jZTplLHBvcHBlcjpvfT1PYmplY3QuYXNzaWduKG4sdCk7aWYoIW98fCFlKXRocm93IG5ldyBFcnJvcihcIlBvcHBlci0gb3IgcmVmZXJlbmNlLWVsZW1lbnQgbWlzc2luZy5cIik7cmV0dXJuIE8oZSxvLG4pfX19KSh1LGgse21hcmdpbjpyfSksdS5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsXCJidXR0b25cIiksdS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsdGhpcy5fdChcImJ0bjp0b2dnbGVcIikpO2NvbnN0IGQ9dGhpczt0aGlzLl9zZXR1cEFuaW1hdGlvbkZyYW1lPXJlcXVlc3RBbmltYXRpb25GcmFtZSgoZnVuY3Rpb24gZSgpe2lmKCFoLm9mZnNldFdpZHRoKXJldHVybiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZSk7ZC5zZXRDb2xvcih0LmRlZmF1bHQpLGQuX3JlUG9zaXRpb25pbmdQaWNrZXIoKSx0LmRlZmF1bHRSZXByZXNlbnRhdGlvbiYmKGQuX3JlcHJlc2VudGF0aW9uPXQuZGVmYXVsdFJlcHJlc2VudGF0aW9uLGQuc2V0Q29sb3JSZXByZXNlbnRhdGlvbihkLl9yZXByZXNlbnRhdGlvbikpLHQuc2hvd0Fsd2F5cyYmZC5zaG93KCksZC5faW5pdGlhbGl6aW5nQWN0aXZlPSExLGQuX2VtaXQoXCJpbml0XCIpfSkpfV9wcmVCdWlsZCgpe2NvbnN0e29wdGlvbnM6dH09dGhpcztmb3IoY29uc3QgZSBvZltcImVsXCIsXCJjb250YWluZXJcIl0pdFtlXT1jKHRbZV0pO3RoaXMuX3Jvb3Q9KHQ9Pntjb25zdHtjb21wb25lbnRzOmUsdXNlQXNCdXR0b246byxpbmxpbmU6bixhcHBDbGFzczppLHRoZW1lOnMsbG9ja09wYWNpdHk6cn09dC5vcHRpb25zLGw9dD0+dD9cIlwiOidzdHlsZT1cImRpc3BsYXk6bm9uZVwiIGhpZGRlbicsYz1lPT50Ll90KGUpLHA9YShgXFxuICAgICAgPGRpdiA6cmVmPVwicm9vdFwiIGNsYXNzPVwicGlja3JcIj5cXG5cXG4gICAgICAgICR7bz9cIlwiOic8YnV0dG9uIHR5cGU9XCJidXR0b25cIiA6cmVmPVwiYnV0dG9uXCIgY2xhc3M9XCJwY3ItYnV0dG9uXCI+PC9idXR0b24+J31cXG5cXG4gICAgICAgIDxkaXYgOnJlZj1cImFwcFwiIGNsYXNzPVwicGNyLWFwcCAke2l8fFwiXCJ9XCIgZGF0YS10aGVtZT1cIiR7c31cIiAke24/J3N0eWxlPVwicG9zaXRpb246IHVuc2V0XCInOlwiXCJ9IGFyaWEtbGFiZWw9XCIke2MoXCJ1aTpkaWFsb2dcIil9XCIgcm9sZT1cIndpbmRvd1wiPlxcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicGNyLXNlbGVjdGlvblwiICR7bChlLnBhbGV0dGUpfT5cXG4gICAgICAgICAgICA8ZGl2IDpvYmo9XCJwcmV2aWV3XCIgY2xhc3M9XCJwY3ItY29sb3ItcHJldmlld1wiICR7bChlLnByZXZpZXcpfT5cXG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIDpyZWY9XCJsYXN0Q29sb3JcIiBjbGFzcz1cInBjci1sYXN0LWNvbG9yXCIgYXJpYS1sYWJlbD1cIiR7YyhcImJ0bjpsYXN0LWNvbG9yXCIpfVwiPjwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgPGRpdiA6cmVmPVwiY3VycmVudENvbG9yXCIgY2xhc3M9XCJwY3ItY3VycmVudC1jb2xvclwiPjwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgICAgIDxkaXYgOm9iaj1cInBhbGV0dGVcIiBjbGFzcz1cInBjci1jb2xvci1wYWxldHRlXCI+XFxuICAgICAgICAgICAgICA8ZGl2IDpyZWY9XCJwaWNrZXJcIiBjbGFzcz1cInBjci1waWNrZXJcIj48L2Rpdj5cXG4gICAgICAgICAgICAgIDxkaXYgOnJlZj1cInBhbGV0dGVcIiBjbGFzcz1cInBjci1wYWxldHRlXCIgdGFiaW5kZXg9XCIwXCIgYXJpYS1sYWJlbD1cIiR7YyhcImFyaWE6cGFsZXR0ZVwiKX1cIiByb2xlPVwibGlzdGJveFwiPjwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgICAgIDxkaXYgOm9iaj1cImh1ZVwiIGNsYXNzPVwicGNyLWNvbG9yLWNob29zZXJcIiAke2woZS5odWUpfT5cXG4gICAgICAgICAgICAgIDxkaXYgOnJlZj1cInBpY2tlclwiIGNsYXNzPVwicGNyLXBpY2tlclwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgPGRpdiA6cmVmPVwic2xpZGVyXCIgY2xhc3M9XCJwY3ItaHVlIHBjci1zbGlkZXJcIiB0YWJpbmRleD1cIjBcIiBhcmlhLWxhYmVsPVwiJHtjKFwiYXJpYTpodWVcIil9XCIgcm9sZT1cInNsaWRlclwiPjwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgICAgIDxkaXYgOm9iaj1cIm9wYWNpdHlcIiBjbGFzcz1cInBjci1jb2xvci1vcGFjaXR5XCIgJHtsKGUub3BhY2l0eSl9PlxcbiAgICAgICAgICAgICAgPGRpdiA6cmVmPVwicGlja2VyXCIgY2xhc3M9XCJwY3ItcGlja2VyXCI+PC9kaXY+XFxuICAgICAgICAgICAgICA8ZGl2IDpyZWY9XCJzbGlkZXJcIiBjbGFzcz1cInBjci1vcGFjaXR5IHBjci1zbGlkZXJcIiB0YWJpbmRleD1cIjBcIiBhcmlhLWxhYmVsPVwiJHtjKFwiYXJpYTpvcGFjaXR5XCIpfVwiIHJvbGU9XCJzbGlkZXJcIj48L2Rpdj5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgPC9kaXY+XFxuXFxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJwY3Itc3dhdGNoZXMgJHtlLnBhbGV0dGU/XCJcIjpcInBjci1sYXN0XCJ9XCIgOnJlZj1cInN3YXRjaGVzXCI+PC9kaXY+XFxuXFxuICAgICAgICAgIDxkaXYgOm9iaj1cImludGVyYWN0aW9uXCIgY2xhc3M9XCJwY3ItaW50ZXJhY3Rpb25cIiAke2woT2JqZWN0LmtleXMoZS5pbnRlcmFjdGlvbikubGVuZ3RoKX0+XFxuICAgICAgICAgICAgPGlucHV0IDpyZWY9XCJyZXN1bHRcIiBjbGFzcz1cInBjci1yZXN1bHRcIiB0eXBlPVwidGV4dFwiIHNwZWxsY2hlY2s9XCJmYWxzZVwiICR7bChlLmludGVyYWN0aW9uLmlucHV0KX0gYXJpYS1sYWJlbD1cIiR7YyhcImFyaWE6aW5wdXRcIil9XCI+XFxuXFxuICAgICAgICAgICAgPGlucHV0IDphcnI9XCJvcHRpb25zXCIgY2xhc3M9XCJwY3ItdHlwZVwiIGRhdGEtdHlwZT1cIkhFWEFcIiB2YWx1ZT1cIiR7cj9cIkhFWFwiOlwiSEVYQVwifVwiIHR5cGU9XCJidXR0b25cIiAke2woZS5pbnRlcmFjdGlvbi5oZXgpfT5cXG4gICAgICAgICAgICA8aW5wdXQgOmFycj1cIm9wdGlvbnNcIiBjbGFzcz1cInBjci10eXBlXCIgZGF0YS10eXBlPVwiUkdCQVwiIHZhbHVlPVwiJHtyP1wiUkdCXCI6XCJSR0JBXCJ9XCIgdHlwZT1cImJ1dHRvblwiICR7bChlLmludGVyYWN0aW9uLnJnYmEpfT5cXG4gICAgICAgICAgICA8aW5wdXQgOmFycj1cIm9wdGlvbnNcIiBjbGFzcz1cInBjci10eXBlXCIgZGF0YS10eXBlPVwiSFNMQVwiIHZhbHVlPVwiJHtyP1wiSFNMXCI6XCJIU0xBXCJ9XCIgdHlwZT1cImJ1dHRvblwiICR7bChlLmludGVyYWN0aW9uLmhzbGEpfT5cXG4gICAgICAgICAgICA8aW5wdXQgOmFycj1cIm9wdGlvbnNcIiBjbGFzcz1cInBjci10eXBlXCIgZGF0YS10eXBlPVwiSFNWQVwiIHZhbHVlPVwiJHtyP1wiSFNWXCI6XCJIU1ZBXCJ9XCIgdHlwZT1cImJ1dHRvblwiICR7bChlLmludGVyYWN0aW9uLmhzdmEpfT5cXG4gICAgICAgICAgICA8aW5wdXQgOmFycj1cIm9wdGlvbnNcIiBjbGFzcz1cInBjci10eXBlXCIgZGF0YS10eXBlPVwiQ01ZS1wiIHZhbHVlPVwiQ01ZS1wiIHR5cGU9XCJidXR0b25cIiAke2woZS5pbnRlcmFjdGlvbi5jbXlrKX0+XFxuXFxuICAgICAgICAgICAgPGlucHV0IDpyZWY9XCJzYXZlXCIgY2xhc3M9XCJwY3Itc2F2ZVwiIHZhbHVlPVwiJHtjKFwiYnRuOnNhdmVcIil9XCIgdHlwZT1cImJ1dHRvblwiICR7bChlLmludGVyYWN0aW9uLnNhdmUpfSBhcmlhLWxhYmVsPVwiJHtjKFwiYXJpYTpidG46c2F2ZVwiKX1cIj5cXG4gICAgICAgICAgICA8aW5wdXQgOnJlZj1cImNhbmNlbFwiIGNsYXNzPVwicGNyLWNhbmNlbFwiIHZhbHVlPVwiJHtjKFwiYnRuOmNhbmNlbFwiKX1cIiB0eXBlPVwiYnV0dG9uXCIgJHtsKGUuaW50ZXJhY3Rpb24uY2FuY2VsKX0gYXJpYS1sYWJlbD1cIiR7YyhcImFyaWE6YnRuOmNhbmNlbFwiKX1cIj5cXG4gICAgICAgICAgICA8aW5wdXQgOnJlZj1cImNsZWFyXCIgY2xhc3M9XCJwY3ItY2xlYXJcIiB2YWx1ZT1cIiR7YyhcImJ0bjpjbGVhclwiKX1cIiB0eXBlPVwiYnV0dG9uXCIgJHtsKGUuaW50ZXJhY3Rpb24uY2xlYXIpfSBhcmlhLWxhYmVsPVwiJHtjKFwiYXJpYTpidG46Y2xlYXJcIil9XCI+XFxuICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgPC9kaXY+XFxuICAgIGApLHU9cC5pbnRlcmFjdGlvbjtyZXR1cm4gdS5vcHRpb25zLmZpbmQoKHQ9PiF0LmhpZGRlbiYmIXQuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKSkpLHUudHlwZT0oKT0+dS5vcHRpb25zLmZpbmQoKHQ9PnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlXCIpKSkscH0pKHRoaXMpLHQudXNlQXNCdXR0b24mJih0aGlzLl9yb290LmJ1dHRvbj10LmVsKSx0LmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLl9yb290LnJvb3QpfV9maW5hbEJ1aWxkKCl7Y29uc3QgdD10aGlzLm9wdGlvbnMsZT10aGlzLl9yb290O2lmKHQuY29udGFpbmVyLnJlbW92ZUNoaWxkKGUucm9vdCksdC5pbmxpbmUpe2NvbnN0IG89dC5lbC5wYXJlbnRFbGVtZW50O3QuZWwubmV4dFNpYmxpbmc/by5pbnNlcnRCZWZvcmUoZS5hcHAsdC5lbC5uZXh0U2libGluZyk6by5hcHBlbmRDaGlsZChlLmFwcCl9ZWxzZSB0LmNvbnRhaW5lci5hcHBlbmRDaGlsZChlLmFwcCk7dC51c2VBc0J1dHRvbj90LmlubGluZSYmdC5lbC5yZW1vdmUoKTp0LmVsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGUucm9vdCx0LmVsKSx0LmRpc2FibGVkJiZ0aGlzLmRpc2FibGUoKSx0LmNvbXBhcmlzb258fChlLmJ1dHRvbi5zdHlsZS50cmFuc2l0aW9uPVwibm9uZVwiLHQudXNlQXNCdXR0b258fChlLnByZXZpZXcubGFzdENvbG9yLnN0eWxlLnRyYW5zaXRpb249XCJub25lXCIpKSx0aGlzLmhpZGUoKX1fYnVpbGRDb21wb25lbnRzKCl7Y29uc3QgdD10aGlzLGU9dGhpcy5vcHRpb25zLmNvbXBvbmVudHMsbz0odC5vcHRpb25zLnNsaWRlcnN8fFwidlwiKS5yZXBlYXQoMiksW24saV09by5tYXRjaCgvXlt2aF0rJC9nKT9vOltdLHM9KCk9PnRoaXMuX2NvbG9yfHwodGhpcy5fY29sb3I9dGhpcy5fbGFzdENvbG9yLmNsb25lKCkpLHI9e3BhbGV0dGU6JCh7ZWxlbWVudDp0Ll9yb290LnBhbGV0dGUucGlja2VyLHdyYXBwZXI6dC5fcm9vdC5wYWxldHRlLnBhbGV0dGUsb25zdG9wOigpPT50Ll9lbWl0KFwiY2hhbmdlc3RvcFwiLFwic2xpZGVyXCIsdCksb25jaGFuZ2UobyxuKXtpZighZS5wYWxldHRlKXJldHVybjtjb25zdCBpPXMoKSx7X3Jvb3Q6cixvcHRpb25zOmF9PXQse2xhc3RDb2xvcjpsLGN1cnJlbnRDb2xvcjpjfT1yLnByZXZpZXc7dC5fcmVjYWxjJiYoaS5zPTEwMCpvLGkudj0xMDAtMTAwKm4saS52PDAmJihpLnY9MCksdC5fdXBkYXRlT3V0cHV0KFwic2xpZGVyXCIpKTtjb25zdCBwPWkudG9SR0JBKCkudG9TdHJpbmcoMCk7dGhpcy5lbGVtZW50LnN0eWxlLmJhY2tncm91bmQ9cCx0aGlzLndyYXBwZXIuc3R5bGUuYmFja2dyb3VuZD1gXFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZWFyLWdyYWRpZW50KHRvIHRvcCwgcmdiYSgwLCAwLCAwLCAke2kuYX0pLCB0cmFuc3BhcmVudCksXFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZWFyLWdyYWRpZW50KHRvIGxlZnQsIGhzbGEoJHtpLmh9LCAxMDAlLCA1MCUsICR7aS5hfSksIHJnYmEoMjU1LCAyNTUsIDI1NSwgJHtpLmF9KSlcXG4gICAgICAgICAgICAgICAgICAgIGAsYS5jb21wYXJpc29uP2EudXNlQXNCdXR0b258fHQuX2xhc3RDb2xvcnx8bC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tcGNyLWNvbG9yXCIscCk6KHIuYnV0dG9uLnN0eWxlLnNldFByb3BlcnR5KFwiLS1wY3ItY29sb3JcIixwKSxyLmJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiY2xlYXJcIikpO2NvbnN0IHU9aS50b0hFWEEoKS50b1N0cmluZygpO2Zvcihjb25zdHtlbDplLGNvbG9yOm99b2YgdC5fc3dhdGNoQ29sb3JzKWUuY2xhc3NMaXN0W3U9PT1vLnRvSEVYQSgpLnRvU3RyaW5nKCk/XCJhZGRcIjpcInJlbW92ZVwiXShcInBjci1hY3RpdmVcIik7Yy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tcGNyLWNvbG9yXCIscCl9fSksaHVlOiQoe2xvY2s6XCJ2XCI9PT1pP1wiaFwiOlwidlwiLGVsZW1lbnQ6dC5fcm9vdC5odWUucGlja2VyLHdyYXBwZXI6dC5fcm9vdC5odWUuc2xpZGVyLG9uc3RvcDooKT0+dC5fZW1pdChcImNoYW5nZXN0b3BcIixcInNsaWRlclwiLHQpLG9uY2hhbmdlKG8pe2lmKCFlLmh1ZXx8IWUucGFsZXR0ZSlyZXR1cm47Y29uc3Qgbj1zKCk7dC5fcmVjYWxjJiYobi5oPTM2MCpvKSx0aGlzLmVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yPWBoc2woJHtuLmh9LCAxMDAlLCA1MCUpYCxyLnBhbGV0dGUudHJpZ2dlcigpfX0pLG9wYWNpdHk6JCh7bG9jazpcInZcIj09PW4/XCJoXCI6XCJ2XCIsZWxlbWVudDp0Ll9yb290Lm9wYWNpdHkucGlja2VyLHdyYXBwZXI6dC5fcm9vdC5vcGFjaXR5LnNsaWRlcixvbnN0b3A6KCk9PnQuX2VtaXQoXCJjaGFuZ2VzdG9wXCIsXCJzbGlkZXJcIix0KSxvbmNoYW5nZShvKXtpZighZS5vcGFjaXR5fHwhZS5wYWxldHRlKXJldHVybjtjb25zdCBuPXMoKTt0Ll9yZWNhbGMmJihuLmE9TWF0aC5yb3VuZCgxMDAqbykvMTAwKSx0aGlzLmVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZD1gcmdiYSgwLCAwLCAwLCAke24uYX0pYCxyLnBhbGV0dGUudHJpZ2dlcigpfX0pLHNlbGVjdGFibGU6ayh7ZWxlbWVudHM6dC5fcm9vdC5pbnRlcmFjdGlvbi5vcHRpb25zLGNsYXNzTmFtZTpcImFjdGl2ZVwiLG9uY2hhbmdlKGUpe3QuX3JlcHJlc2VudGF0aW9uPWUudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtdHlwZVwiKS50b1VwcGVyQ2FzZSgpLHQuX3JlY2FsYyYmdC5fdXBkYXRlT3V0cHV0KFwic3dhdGNoXCIpfX0pfTt0aGlzLl9jb21wb25lbnRzPXJ9X2JpbmRFdmVudHMoKXtjb25zdHtfcm9vdDp0LG9wdGlvbnM6ZX09dGhpcyxvPVtpKHQuaW50ZXJhY3Rpb24uY2xlYXIsXCJjbGlja1wiLCgoKT0+dGhpcy5fY2xlYXJDb2xvcigpKSksaShbdC5pbnRlcmFjdGlvbi5jYW5jZWwsdC5wcmV2aWV3Lmxhc3RDb2xvcl0sXCJjbGlja1wiLCgoKT0+e3RoaXMuc2V0SFNWQSguLi4odGhpcy5fbGFzdENvbG9yfHx0aGlzLl9jb2xvcikudG9IU1ZBKCksITApLHRoaXMuX2VtaXQoXCJjYW5jZWxcIil9KSksaSh0LmludGVyYWN0aW9uLnNhdmUsXCJjbGlja1wiLCgoKT0+eyF0aGlzLmFwcGx5Q29sb3IoKSYmIWUuc2hvd0Fsd2F5cyYmdGhpcy5oaWRlKCl9KSksaSh0LmludGVyYWN0aW9uLnJlc3VsdCxbXCJrZXl1cFwiLFwiaW5wdXRcIl0sKHQ9Pnt0aGlzLnNldENvbG9yKHQudGFyZ2V0LnZhbHVlLCEwKSYmIXRoaXMuX2luaXRpYWxpemluZ0FjdGl2ZSYmKHRoaXMuX2VtaXQoXCJjaGFuZ2VcIix0aGlzLl9jb2xvcixcImlucHV0XCIsdGhpcyksdGhpcy5fZW1pdChcImNoYW5nZXN0b3BcIixcImlucHV0XCIsdGhpcykpLHQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCl9KSksaSh0LmludGVyYWN0aW9uLnJlc3VsdCxbXCJmb2N1c1wiLFwiYmx1clwiXSwodD0+e3RoaXMuX3JlY2FsYz1cImJsdXJcIj09PXQudHlwZSx0aGlzLl9yZWNhbGMmJnRoaXMuX3VwZGF0ZU91dHB1dChudWxsKX0pKSxpKFt0LnBhbGV0dGUucGFsZXR0ZSx0LnBhbGV0dGUucGlja2VyLHQuaHVlLnNsaWRlcix0Lmh1ZS5waWNrZXIsdC5vcGFjaXR5LnNsaWRlcix0Lm9wYWNpdHkucGlja2VyXSxbXCJtb3VzZWRvd25cIixcInRvdWNoc3RhcnRcIl0sKCgpPT50aGlzLl9yZWNhbGM9ITApLHtwYXNzaXZlOiEwfSldO2lmKCFlLnNob3dBbHdheXMpe2NvbnN0IG49ZS5jbG9zZVdpdGhLZXk7by5wdXNoKGkodC5idXR0b24sXCJjbGlja1wiLCgoKT0+dGhpcy5pc09wZW4oKT90aGlzLmhpZGUoKTp0aGlzLnNob3coKSkpLGkoZG9jdW1lbnQsXCJrZXl1cFwiLCh0PT50aGlzLmlzT3BlbigpJiYodC5rZXk9PT1ufHx0LmNvZGU9PT1uKSYmdGhpcy5oaWRlKCkpKSxpKGRvY3VtZW50LFtcInRvdWNoc3RhcnRcIixcIm1vdXNlZG93blwiXSwoZT0+e3RoaXMuaXNPcGVuKCkmJiFsKGUpLnNvbWUoKGU9PmU9PT10LmFwcHx8ZT09PXQuYnV0dG9uKSkmJnRoaXMuaGlkZSgpfSkse2NhcHR1cmU6ITB9KSl9aWYoZS5hZGp1c3RhYmxlTnVtYmVycyl7Y29uc3QgZT17cmdiYTpbMjU1LDI1NSwyNTUsMV0saHN2YTpbMzYwLDEwMCwxMDAsMV0saHNsYTpbMzYwLDEwMCwxMDAsMV0sY215azpbMTAwLDEwMCwxMDAsMTAwXX07cCh0LmludGVyYWN0aW9uLnJlc3VsdCwoKHQsbyxuKT0+e2NvbnN0IGk9ZVt0aGlzLmdldENvbG9yUmVwcmVzZW50YXRpb24oKS50b0xvd2VyQ2FzZSgpXTtpZihpKXtjb25zdCBlPWlbbl0scz10KyhlPj0xMDA/MWUzKm86byk7cmV0dXJuIHM8PTA/MDpOdW1iZXIoKHM8ZT9zOmUpLnRvUHJlY2lzaW9uKDMpKX1yZXR1cm4gdH0pKX1pZihlLmF1dG9SZXBvc2l0aW9uJiYhZS5pbmxpbmUpe2xldCB0PW51bGw7Y29uc3Qgbj10aGlzO28ucHVzaChpKHdpbmRvdyxbXCJzY3JvbGxcIixcInJlc2l6ZVwiXSwoKCk9PntuLmlzT3BlbigpJiYoZS5jbG9zZU9uU2Nyb2xsJiZuLmhpZGUoKSxudWxsPT09dD8odD1zZXRUaW1lb3V0KCgoKT0+dD1udWxsKSwxMDApLHJlcXVlc3RBbmltYXRpb25GcmFtZSgoZnVuY3Rpb24gZSgpe24uX3JlUG9zaXRpb25pbmdQaWNrZXIoKSxudWxsIT09dCYmcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGUpfSkpKTooY2xlYXJUaW1lb3V0KHQpLHQ9c2V0VGltZW91dCgoKCk9PnQ9bnVsbCksMTAwKSkpfSkse2NhcHR1cmU6ITB9KSl9dGhpcy5fZXZlbnRCaW5kaW5ncz1vfV9yZVBvc2l0aW9uaW5nUGlja2VyKCl7Y29uc3R7b3B0aW9uczp0fT10aGlzO2lmKCF0LmlubGluZSl7aWYoIXRoaXMuX25hbm9wb3AudXBkYXRlKHtjb250YWluZXI6ZG9jdW1lbnQuYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxwb3NpdGlvbjp0LnBvc2l0aW9ufSkpe2NvbnN0IHQ9dGhpcy5fcm9vdC5hcHAsZT10LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3Quc3R5bGUudG9wPSh3aW5kb3cuaW5uZXJIZWlnaHQtZS5oZWlnaHQpLzIrXCJweFwiLHQuc3R5bGUubGVmdD0od2luZG93LmlubmVyV2lkdGgtZS53aWR0aCkvMitcInB4XCJ9fX1fdXBkYXRlT3V0cHV0KHQpe2NvbnN0e19yb290OmUsX2NvbG9yOm8sb3B0aW9uczpufT10aGlzO2lmKGUuaW50ZXJhY3Rpb24udHlwZSgpKXtjb25zdCB0PWB0byR7ZS5pbnRlcmFjdGlvbi50eXBlKCkuZ2V0QXR0cmlidXRlKFwiZGF0YS10eXBlXCIpfWA7ZS5pbnRlcmFjdGlvbi5yZXN1bHQudmFsdWU9XCJmdW5jdGlvblwiPT10eXBlb2Ygb1t0XT9vW3RdKCkudG9TdHJpbmcobi5vdXRwdXRQcmVjaXNpb24pOlwiXCJ9IXRoaXMuX2luaXRpYWxpemluZ0FjdGl2ZSYmdGhpcy5fcmVjYWxjJiZ0aGlzLl9lbWl0KFwiY2hhbmdlXCIsbyx0LHRoaXMpfV9jbGVhckNvbG9yKHQ9ITEpe2NvbnN0e19yb290OmUsb3B0aW9uczpvfT10aGlzO28udXNlQXNCdXR0b258fGUuYnV0dG9uLnN0eWxlLnNldFByb3BlcnR5KFwiLS1wY3ItY29sb3JcIixcInJnYmEoMCwgMCwgMCwgMC4xNSlcIiksZS5idXR0b24uY2xhc3NMaXN0LmFkZChcImNsZWFyXCIpLG8uc2hvd0Fsd2F5c3x8dGhpcy5oaWRlKCksdGhpcy5fbGFzdENvbG9yPW51bGwsdGhpcy5faW5pdGlhbGl6aW5nQWN0aXZlfHx0fHwodGhpcy5fZW1pdChcInNhdmVcIixudWxsKSx0aGlzLl9lbWl0KFwiY2xlYXJcIikpfV9wYXJzZUxvY2FsQ29sb3IodCl7Y29uc3R7dmFsdWVzOmUsdHlwZTpvLGE6bn09dyh0KSx7bG9ja09wYWNpdHk6aX09dGhpcy5vcHRpb25zLHM9dm9pZCAwIT09biYmMSE9PW47cmV0dXJuIGUmJjM9PT1lLmxlbmd0aCYmKGVbM109dm9pZCAwKSx7dmFsdWVzOiFlfHxpJiZzP251bGw6ZSx0eXBlOm99fV90KHQpe3JldHVybiB0aGlzLm9wdGlvbnMuaTE4blt0XXx8TC5JMThOX0RFRkFVTFRTW3RdfV9lbWl0KHQsLi4uZSl7dGhpcy5fZXZlbnRMaXN0ZW5lclt0XS5mb3JFYWNoKCh0PT50KC4uLmUsdGhpcykpKX1vbih0LGUpe3JldHVybiB0aGlzLl9ldmVudExpc3RlbmVyW3RdLnB1c2goZSksdGhpc31vZmYodCxlKXtjb25zdCBvPXRoaXMuX2V2ZW50TGlzdGVuZXJbdF18fFtdLG49by5pbmRleE9mKGUpO3JldHVybn5uJiZvLnNwbGljZShuLDEpLHRoaXN9YWRkU3dhdGNoKHQpe2NvbnN0e3ZhbHVlczplfT10aGlzLl9wYXJzZUxvY2FsQ29sb3IodCk7aWYoZSl7Y29uc3R7X3N3YXRjaENvbG9yczp0LF9yb290Om99PXRoaXMsbj1BKC4uLmUpLHM9cihgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgc3R5bGU9XCItLXBjci1jb2xvcjogJHtuLnRvUkdCQSgpLnRvU3RyaW5nKDApfVwiIGFyaWEtbGFiZWw9XCIke3RoaXMuX3QoXCJidG46c3dhdGNoXCIpfVwiLz5gKTtyZXR1cm4gby5zd2F0Y2hlcy5hcHBlbmRDaGlsZChzKSx0LnB1c2goe2VsOnMsY29sb3I6bn0pLHRoaXMuX2V2ZW50QmluZGluZ3MucHVzaChpKHMsXCJjbGlja1wiLCgoKT0+e3RoaXMuc2V0SFNWQSguLi5uLnRvSFNWQSgpLCEwKSx0aGlzLl9lbWl0KFwic3dhdGNoc2VsZWN0XCIsbiksdGhpcy5fZW1pdChcImNoYW5nZVwiLG4sXCJzd2F0Y2hcIix0aGlzKX0pKSksITB9cmV0dXJuITF9cmVtb3ZlU3dhdGNoKHQpe2NvbnN0IGU9dGhpcy5fc3dhdGNoQ29sb3JzW3RdO2lmKGUpe2NvbnN0e2VsOm99PWU7cmV0dXJuIHRoaXMuX3Jvb3Quc3dhdGNoZXMucmVtb3ZlQ2hpbGQobyksdGhpcy5fc3dhdGNoQ29sb3JzLnNwbGljZSh0LDEpLCEwfXJldHVybiExfWFwcGx5Q29sb3IodD0hMSl7Y29uc3R7cHJldmlldzplLGJ1dHRvbjpvfT10aGlzLl9yb290LG49dGhpcy5fY29sb3IudG9SR0JBKCkudG9TdHJpbmcoMCk7cmV0dXJuIGUubGFzdENvbG9yLnN0eWxlLnNldFByb3BlcnR5KFwiLS1wY3ItY29sb3JcIixuKSx0aGlzLm9wdGlvbnMudXNlQXNCdXR0b258fG8uc3R5bGUuc2V0UHJvcGVydHkoXCItLXBjci1jb2xvclwiLG4pLG8uY2xhc3NMaXN0LnJlbW92ZShcImNsZWFyXCIpLHRoaXMuX2xhc3RDb2xvcj10aGlzLl9jb2xvci5jbG9uZSgpLHRoaXMuX2luaXRpYWxpemluZ0FjdGl2ZXx8dHx8dGhpcy5fZW1pdChcInNhdmVcIix0aGlzLl9jb2xvciksdGhpc31kZXN0cm95KCl7Y2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5fc2V0dXBBbmltYXRpb25GcmFtZSksdGhpcy5fZXZlbnRCaW5kaW5ncy5mb3JFYWNoKCh0PT5zKC4uLnQpKSksT2JqZWN0LmtleXModGhpcy5fY29tcG9uZW50cykuZm9yRWFjaCgodD0+dGhpcy5fY29tcG9uZW50c1t0XS5kZXN0cm95KCkpKX1kZXN0cm95QW5kUmVtb3ZlKCl7dGhpcy5kZXN0cm95KCk7Y29uc3R7cm9vdDp0LGFwcDplfT10aGlzLl9yb290O3QucGFyZW50RWxlbWVudCYmdC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHQpLGUucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChlKSxPYmplY3Qua2V5cyh0aGlzKS5mb3JFYWNoKCh0PT50aGlzW3RdPW51bGwpKX1oaWRlKCl7cmV0dXJuISF0aGlzLmlzT3BlbigpJiYodGhpcy5fcm9vdC5hcHAuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIiksdGhpcy5fZW1pdChcImhpZGVcIiksITApfXNob3coKXtyZXR1cm4hdGhpcy5vcHRpb25zLmRpc2FibGVkJiYhdGhpcy5pc09wZW4oKSYmKHRoaXMuX3Jvb3QuYXBwLmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpLHRoaXMuX3JlUG9zaXRpb25pbmdQaWNrZXIoKSx0aGlzLl9lbWl0KFwic2hvd1wiLHRoaXMuX2NvbG9yKSx0aGlzKX1pc09wZW4oKXtyZXR1cm4gdGhpcy5fcm9vdC5hcHAuY2xhc3NMaXN0LmNvbnRhaW5zKFwidmlzaWJsZVwiKX1zZXRIU1ZBKHQ9MzYwLGU9MCxvPTAsbj0xLGk9ITEpe2NvbnN0IHM9dGhpcy5fcmVjYWxjO2lmKHRoaXMuX3JlY2FsYz0hMSx0PDB8fHQ+MzYwfHxlPDB8fGU+MTAwfHxvPDB8fG8+MTAwfHxuPDB8fG4+MSlyZXR1cm4hMTt0aGlzLl9jb2xvcj1BKHQsZSxvLG4pO2NvbnN0e2h1ZTpyLG9wYWNpdHk6YSxwYWxldHRlOmx9PXRoaXMuX2NvbXBvbmVudHM7cmV0dXJuIHIudXBkYXRlKHQvMzYwKSxhLnVwZGF0ZShuKSxsLnVwZGF0ZShlLzEwMCwxLW8vMTAwKSxpfHx0aGlzLmFwcGx5Q29sb3IoKSxzJiZ0aGlzLl91cGRhdGVPdXRwdXQoKSx0aGlzLl9yZWNhbGM9cywhMH1zZXRDb2xvcih0LGU9ITEpe2lmKG51bGw9PT10KXJldHVybiB0aGlzLl9jbGVhckNvbG9yKGUpLCEwO2NvbnN0e3ZhbHVlczpvLHR5cGU6bn09dGhpcy5fcGFyc2VMb2NhbENvbG9yKHQpO2lmKG8pe2NvbnN0IHQ9bi50b1VwcGVyQ2FzZSgpLHtvcHRpb25zOml9PXRoaXMuX3Jvb3QuaW50ZXJhY3Rpb24scz1pLmZpbmQoKGU9PmUuZ2V0QXR0cmlidXRlKFwiZGF0YS10eXBlXCIpPT09dCkpO2lmKHMmJiFzLmhpZGRlbilmb3IoY29uc3QgdCBvZiBpKXQuY2xhc3NMaXN0W3Q9PT1zP1wiYWRkXCI6XCJyZW1vdmVcIl0oXCJhY3RpdmVcIik7cmV0dXJuISF0aGlzLnNldEhTVkEoLi4ubyxlKSYmdGhpcy5zZXRDb2xvclJlcHJlc2VudGF0aW9uKHQpfXJldHVybiExfXNldENvbG9yUmVwcmVzZW50YXRpb24odCl7cmV0dXJuIHQ9dC50b1VwcGVyQ2FzZSgpLCEhdGhpcy5fcm9vdC5pbnRlcmFjdGlvbi5vcHRpb25zLmZpbmQoKGU9PmUuZ2V0QXR0cmlidXRlKFwiZGF0YS10eXBlXCIpLnN0YXJ0c1dpdGgodCkmJiFlLmNsaWNrKCkpKX1nZXRDb2xvclJlcHJlc2VudGF0aW9uKCl7cmV0dXJuIHRoaXMuX3JlcHJlc2VudGF0aW9ufWdldENvbG9yKCl7cmV0dXJuIHRoaXMuX2NvbG9yfWdldFNlbGVjdGVkQ29sb3IoKXtyZXR1cm4gdGhpcy5fbGFzdENvbG9yfWdldFJvb3QoKXtyZXR1cm4gdGhpcy5fcm9vdH1kaXNhYmxlKCl7cmV0dXJuIHRoaXMuaGlkZSgpLHRoaXMub3B0aW9ucy5kaXNhYmxlZD0hMCx0aGlzLl9yb290LmJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIiksdGhpc31lbmFibGUoKXtyZXR1cm4gdGhpcy5vcHRpb25zLmRpc2FibGVkPSExLHRoaXMuX3Jvb3QuYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKSx0aGlzfX1yZXR1cm4gRShMLFwidXRpbHNcIixvKSxFKEwsXCJ2ZXJzaW9uXCIsXCIxLjguMlwiKSxFKEwsXCJJMThOX0RFRkFVTFRTXCIse1widWk6ZGlhbG9nXCI6XCJjb2xvciBwaWNrZXIgZGlhbG9nXCIsXCJidG46dG9nZ2xlXCI6XCJ0b2dnbGUgY29sb3IgcGlja2VyIGRpYWxvZ1wiLFwiYnRuOnN3YXRjaFwiOlwiY29sb3Igc3dhdGNoXCIsXCJidG46bGFzdC1jb2xvclwiOlwidXNlIHByZXZpb3VzIGNvbG9yXCIsXCJidG46c2F2ZVwiOlwiU2F2ZVwiLFwiYnRuOmNhbmNlbFwiOlwiQ2FuY2VsXCIsXCJidG46Y2xlYXJcIjpcIkNsZWFyXCIsXCJhcmlhOmJ0bjpzYXZlXCI6XCJzYXZlIGFuZCBjbG9zZVwiLFwiYXJpYTpidG46Y2FuY2VsXCI6XCJjYW5jZWwgYW5kIGNsb3NlXCIsXCJhcmlhOmJ0bjpjbGVhclwiOlwiY2xlYXIgYW5kIGNsb3NlXCIsXCJhcmlhOmlucHV0XCI6XCJjb2xvciBpbnB1dCBmaWVsZFwiLFwiYXJpYTpwYWxldHRlXCI6XCJjb2xvciBzZWxlY3Rpb24gYXJlYVwiLFwiYXJpYTpodWVcIjpcImh1ZSBzZWxlY3Rpb24gc2xpZGVyXCIsXCJhcmlhOm9wYWNpdHlcIjpcInNlbGVjdGlvbiBzbGlkZXJcIn0pLEUoTCxcIkRFRkFVTFRfT1BUSU9OU1wiLHthcHBDbGFzczpudWxsLHRoZW1lOlwiY2xhc3NpY1wiLHVzZUFzQnV0dG9uOiExLHBhZGRpbmc6OCxkaXNhYmxlZDohMSxjb21wYXJpc29uOiEwLGNsb3NlT25TY3JvbGw6ITEsb3V0cHV0UHJlY2lzaW9uOjAsbG9ja09wYWNpdHk6ITEsYXV0b1JlcG9zaXRpb246ITAsY29udGFpbmVyOlwiYm9keVwiLGNvbXBvbmVudHM6e2ludGVyYWN0aW9uOnt9fSxpMThuOnt9LHN3YXRjaGVzOm51bGwsaW5saW5lOiExLHNsaWRlcnM6bnVsbCxkZWZhdWx0OlwiIzQyNDQ1YVwiLGRlZmF1bHRSZXByZXNlbnRhdGlvbjpudWxsLHBvc2l0aW9uOlwiYm90dG9tLW1pZGRsZVwiLGFkanVzdGFibGVOdW1iZXJzOiEwLHNob3dBbHdheXM6ITEsY2xvc2VXaXRoS2V5OlwiRXNjYXBlXCJ9KSxFKEwsXCJjcmVhdGVcIiwodD0+bmV3IEwodCkpKSxlPWUuZGVmYXVsdH0pKCl9KSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1waWNrci5taW4uanMubWFwIiwiLy8gVXNlIGVpdGhlciBqc2NvbG9yXG5pbXBvcnQgXCJAZWFzdGRlc2lyZS9qc2NvbG9yXCI7XG5cbi8vIE9yIHBpY2tyIGxpYnJhcnlyLi4gd2l0aCBvbmUgb2YgdGhlIGZvbGxvd2luZyB0aGVtZXNcbmltcG9ydCAnQHNpbW9ud2VwL3BpY2tyL2Rpc3QvdGhlbWVzL2NsYXNzaWMubWluLmNzcyc7ICAgLy8gJ2NsYXNzaWMnIHRoZW1lXG5pbXBvcnQgJ0BzaW1vbndlcC9waWNrci9kaXN0L3RoZW1lcy9tb25vbGl0aC5taW4uY3NzJzsgIC8vICdtb25vbGl0aCcgdGhlbWVcbmltcG9ydCAnQHNpbW9ud2VwL3BpY2tyL2Rpc3QvdGhlbWVzL25hbm8ubWluLmNzcyc7ICAgICAgLy8gJ25hbm8nIHRoZW1lXG5cbi8vIE1vZGVybiBvciBlczUgYnVuZGxlIChwYXkgYXR0ZW50aW9uIHRvIHRoZSBub3RlIGJlbG93ISlcbmltcG9ydCBQaWNrciBmcm9tICdAc2ltb253ZXAvcGlja3InO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWQuZm9ybV90eXBlXCIsIGZ1bmN0aW9uICgpIHtcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1jb2xvci1maWVsZF1cIikuZm9yRWFjaCgoZnVuY3Rpb24gKGVsKSB7XG5cbiAgICAgICAgZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gZWwudmFsdWU7XG5cbiAgICAgICAgdmFyIHBpY2tyT3B0aW9ucyA9IEpTT04ucGFyc2UoZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb2xvci1waWNrclwiKSk7XG4gICAgICAgICAgICBwaWNrck9wdGlvbnNbXCJkZWZhdWx0XCJdID0gZWwudmFsdWU7XG5cbiAgICAgICAgdmFyIHBpY2tyID0gbmV3IFBpY2tyKE9iamVjdC5hc3NpZ24oe30sIHBpY2tyT3B0aW9ucykpO1xuICAgICAgICAgICAgcGlja3Iub24oJ2NoYW5nZScsIChjb2xvciwgaW5zdGFuY2UpID0+IHtcblxuICAgICAgICAgICAgICAgIHZhciBoZXhhID0gY29sb3IudG9IRVhBKCkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBpZiAoaGV4YS5sZW5ndGggPT0gNykgaGV4YSArPSAnRkYnO1xuXG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yUmdiYSA9IGNvbG9yLnRvUkdCQSgpO1xuXG4gICAgICAgICAgICAgICAgZWwudmFsdWUgPSBoZXhhO1xuICAgICAgICAgICAgICAgIGVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGhleGE7XG4gICAgICAgICAgICAgICAgZWwuc3R5bGUuY29sb3IgPSAoTWF0aC5zcXJ0KFxuICAgICAgICAgICAgICAgICAgICAwLjI5OSAqIChjb2xvclJnYmFbMF0gKiBjb2xvclJnYmFbMF0pICtcbiAgICAgICAgICAgICAgICAgICAgMC41ODcgKiAoY29sb3JSZ2JhWzFdICogY29sb3JSZ2JhWzFdKSArXG4gICAgICAgICAgICAgICAgICAgIDAuMTE0ICogKGNvbG9yUmdiYVsyXSAqIGNvbG9yUmdiYVsyXSlcbiAgICAgICAgICAgICAgICApIDw9IDEyNy41ICYmIGNvbG9yUmdiYVszXSA+IDAuNCkgPyAgJyNGRkYnIDogJyMwMDAnO1xuICAgICAgICAgICAgfSk7XG4gICAgfSkpO1xufSk7IiwidmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciB0cnlUb1N0cmluZyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90cnktdG8tc3RyaW5nJyk7XG5cbnZhciAkVHlwZUVycm9yID0gVHlwZUVycm9yO1xuXG4vLyBgQXNzZXJ0OiBJc0NhbGxhYmxlKGFyZ3VtZW50KSBpcyB0cnVlYFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgaWYgKGlzQ2FsbGFibGUoYXJndW1lbnQpKSByZXR1cm4gYXJndW1lbnQ7XG4gIHRocm93ICRUeXBlRXJyb3IodHJ5VG9TdHJpbmcoYXJndW1lbnQpICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcblxudmFyICRTdHJpbmcgPSBTdHJpbmc7XG52YXIgJFR5cGVFcnJvciA9IFR5cGVFcnJvcjtcblxuLy8gYEFzc2VydDogVHlwZShhcmd1bWVudCkgaXMgT2JqZWN0YFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgaWYgKGlzT2JqZWN0KGFyZ3VtZW50KSkgcmV0dXJuIGFyZ3VtZW50O1xuICB0aHJvdyAkVHlwZUVycm9yKCRTdHJpbmcoYXJndW1lbnQpICsgJyBpcyBub3QgYW4gb2JqZWN0Jyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRmb3JFYWNoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWl0ZXJhdGlvbicpLmZvckVhY2g7XG52YXIgYXJyYXlNZXRob2RJc1N0cmljdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1tZXRob2QtaXMtc3RyaWN0Jyk7XG5cbnZhciBTVFJJQ1RfTUVUSE9EID0gYXJyYXlNZXRob2RJc1N0cmljdCgnZm9yRWFjaCcpO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLmZvckVhY2hgIG1ldGhvZCBpbXBsZW1lbnRhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuZm9yZWFjaFxubW9kdWxlLmV4cG9ydHMgPSAhU1RSSUNUX01FVEhPRCA/IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiAsIHRoaXNBcmcgKi8pIHtcbiAgcmV0dXJuICRmb3JFYWNoKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1hcnJheS1wcm90b3R5cGUtZm9yZWFjaCAtLSBzYWZlXG59IDogW10uZm9yRWFjaDtcbiIsInZhciB0b0luZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tYWJzb2x1dGUtaW5kZXgnKTtcbnZhciBsZW5ndGhPZkFycmF5TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9sZW5ndGgtb2YtYXJyYXktbGlrZScpO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLnsgaW5kZXhPZiwgaW5jbHVkZXMgfWAgbWV0aG9kcyBpbXBsZW1lbnRhdGlvblxudmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uIChJU19JTkNMVURFUykge1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBlbCwgZnJvbUluZGV4KSB7XG4gICAgdmFyIE8gPSB0b0luZGV4ZWRPYmplY3QoJHRoaXMpO1xuICAgIHZhciBsZW5ndGggPSBsZW5ndGhPZkFycmF5TGlrZShPKTtcbiAgICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpO1xuICAgIHZhciB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZSAtLSBOYU4gY2hlY2tcbiAgICBpZiAoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpIHdoaWxlIChsZW5ndGggPiBpbmRleCkge1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZSAtLSBOYU4gY2hlY2tcbiAgICAgIGlmICh2YWx1ZSAhPSB2YWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjaW5kZXhPZiBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xuICAgICAgaWYgKChJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKSAmJiBPW2luZGV4XSA9PT0gZWwpIHJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvLyBgQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuaW5jbHVkZXNcbiAgaW5jbHVkZXM6IGNyZWF0ZU1ldGhvZCh0cnVlKSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5pbmRleE9mYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuaW5kZXhvZlxuICBpbmRleE9mOiBjcmVhdGVNZXRob2QoZmFsc2UpXG59O1xuIiwidmFyIGJpbmQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tYmluZC1jb250ZXh0Jyk7XG52YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG52YXIgSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbmRleGVkLW9iamVjdCcpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLW9iamVjdCcpO1xudmFyIGxlbmd0aE9mQXJyYXlMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2xlbmd0aC1vZi1hcnJheS1saWtlJyk7XG52YXIgYXJyYXlTcGVjaWVzQ3JlYXRlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LXNwZWNpZXMtY3JlYXRlJyk7XG5cbnZhciBwdXNoID0gdW5jdXJyeVRoaXMoW10ucHVzaCk7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUueyBmb3JFYWNoLCBtYXAsIGZpbHRlciwgc29tZSwgZXZlcnksIGZpbmQsIGZpbmRJbmRleCwgZmlsdGVyUmVqZWN0IH1gIG1ldGhvZHMgaW1wbGVtZW50YXRpb25cbnZhciBjcmVhdGVNZXRob2QgPSBmdW5jdGlvbiAoVFlQRSkge1xuICB2YXIgSVNfTUFQID0gVFlQRSA9PSAxO1xuICB2YXIgSVNfRklMVEVSID0gVFlQRSA9PSAyO1xuICB2YXIgSVNfU09NRSA9IFRZUEUgPT0gMztcbiAgdmFyIElTX0VWRVJZID0gVFlQRSA9PSA0O1xuICB2YXIgSVNfRklORF9JTkRFWCA9IFRZUEUgPT0gNjtcbiAgdmFyIElTX0ZJTFRFUl9SRUpFQ1QgPSBUWVBFID09IDc7XG4gIHZhciBOT19IT0xFUyA9IFRZUEUgPT0gNSB8fCBJU19GSU5EX0lOREVYO1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBjYWxsYmFja2ZuLCB0aGF0LCBzcGVjaWZpY0NyZWF0ZSkge1xuICAgIHZhciBPID0gdG9PYmplY3QoJHRoaXMpO1xuICAgIHZhciBzZWxmID0gSW5kZXhlZE9iamVjdChPKTtcbiAgICB2YXIgYm91bmRGdW5jdGlvbiA9IGJpbmQoY2FsbGJhY2tmbiwgdGhhdCk7XG4gICAgdmFyIGxlbmd0aCA9IGxlbmd0aE9mQXJyYXlMaWtlKHNlbGYpO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGNyZWF0ZSA9IHNwZWNpZmljQ3JlYXRlIHx8IGFycmF5U3BlY2llc0NyZWF0ZTtcbiAgICB2YXIgdGFyZ2V0ID0gSVNfTUFQID8gY3JlYXRlKCR0aGlzLCBsZW5ndGgpIDogSVNfRklMVEVSIHx8IElTX0ZJTFRFUl9SRUpFQ1QgPyBjcmVhdGUoJHRoaXMsIDApIDogdW5kZWZpbmVkO1xuICAgIHZhciB2YWx1ZSwgcmVzdWx0O1xuICAgIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSBpZiAoTk9fSE9MRVMgfHwgaW5kZXggaW4gc2VsZikge1xuICAgICAgdmFsdWUgPSBzZWxmW2luZGV4XTtcbiAgICAgIHJlc3VsdCA9IGJvdW5kRnVuY3Rpb24odmFsdWUsIGluZGV4LCBPKTtcbiAgICAgIGlmIChUWVBFKSB7XG4gICAgICAgIGlmIChJU19NQVApIHRhcmdldFtpbmRleF0gPSByZXN1bHQ7IC8vIG1hcFxuICAgICAgICBlbHNlIGlmIChyZXN1bHQpIHN3aXRjaCAoVFlQRSkge1xuICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgICAvLyBzb21lXG4gICAgICAgICAgY2FzZSA1OiByZXR1cm4gdmFsdWU7ICAgICAgICAgICAgIC8vIGZpbmRcbiAgICAgICAgICBjYXNlIDY6IHJldHVybiBpbmRleDsgICAgICAgICAgICAgLy8gZmluZEluZGV4XG4gICAgICAgICAgY2FzZSAyOiBwdXNoKHRhcmdldCwgdmFsdWUpOyAgICAgIC8vIGZpbHRlclxuICAgICAgICB9IGVsc2Ugc3dpdGNoIChUWVBFKSB7XG4gICAgICAgICAgY2FzZSA0OiByZXR1cm4gZmFsc2U7ICAgICAgICAgICAgIC8vIGV2ZXJ5XG4gICAgICAgICAgY2FzZSA3OiBwdXNoKHRhcmdldCwgdmFsdWUpOyAgICAgIC8vIGZpbHRlclJlamVjdFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBJU19GSU5EX0lOREVYID8gLTEgOiBJU19TT01FIHx8IElTX0VWRVJZID8gSVNfRVZFUlkgOiB0YXJnZXQ7XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5mb3JFYWNoYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuZm9yZWFjaFxuICBmb3JFYWNoOiBjcmVhdGVNZXRob2QoMCksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUubWFwYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUubWFwXG4gIG1hcDogY3JlYXRlTWV0aG9kKDEpLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLmZpbHRlcmAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZpbHRlclxuICBmaWx0ZXI6IGNyZWF0ZU1ldGhvZCgyKSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5zb21lYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuc29tZVxuICBzb21lOiBjcmVhdGVNZXRob2QoMyksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUuZXZlcnlgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5ldmVyeVxuICBldmVyeTogY3JlYXRlTWV0aG9kKDQpLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLmZpbmRgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5maW5kXG4gIGZpbmQ6IGNyZWF0ZU1ldGhvZCg1KSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5maW5kSW5kZXhgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5maW5kSW5kZXhcbiAgZmluZEluZGV4OiBjcmVhdGVNZXRob2QoNiksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUuZmlsdGVyUmVqZWN0YCBtZXRob2RcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtYXJyYXktZmlsdGVyaW5nXG4gIGZpbHRlclJlamVjdDogY3JlYXRlTWV0aG9kKDcpXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE1FVEhPRF9OQU1FLCBhcmd1bWVudCkge1xuICB2YXIgbWV0aG9kID0gW11bTUVUSE9EX05BTUVdO1xuICByZXR1cm4gISFtZXRob2QgJiYgZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11c2VsZXNzLWNhbGwgLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmdcbiAgICBtZXRob2QuY2FsbChudWxsLCBhcmd1bWVudCB8fCBmdW5jdGlvbiAoKSB7IHJldHVybiAxOyB9LCAxKTtcbiAgfSk7XG59O1xuIiwidmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtYXJyYXknKTtcbnZhciBpc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNvbnN0cnVjdG9yJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciBTUEVDSUVTID0gd2VsbEtub3duU3ltYm9sKCdzcGVjaWVzJyk7XG52YXIgJEFycmF5ID0gQXJyYXk7XG5cbi8vIGEgcGFydCBvZiBgQXJyYXlTcGVjaWVzQ3JlYXRlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXlzcGVjaWVzY3JlYXRlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcmlnaW5hbEFycmF5KSB7XG4gIHZhciBDO1xuICBpZiAoaXNBcnJheShvcmlnaW5hbEFycmF5KSkge1xuICAgIEMgPSBvcmlnaW5hbEFycmF5LmNvbnN0cnVjdG9yO1xuICAgIC8vIGNyb3NzLXJlYWxtIGZhbGxiYWNrXG4gICAgaWYgKGlzQ29uc3RydWN0b3IoQykgJiYgKEMgPT09ICRBcnJheSB8fCBpc0FycmF5KEMucHJvdG90eXBlKSkpIEMgPSB1bmRlZmluZWQ7XG4gICAgZWxzZSBpZiAoaXNPYmplY3QoQykpIHtcbiAgICAgIEMgPSBDW1NQRUNJRVNdO1xuICAgICAgaWYgKEMgPT09IG51bGwpIEMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9IHJldHVybiBDID09PSB1bmRlZmluZWQgPyAkQXJyYXkgOiBDO1xufTtcbiIsInZhciBhcnJheVNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yJyk7XG5cbi8vIGBBcnJheVNwZWNpZXNDcmVhdGVgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheXNwZWNpZXNjcmVhdGVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9yaWdpbmFsQXJyYXksIGxlbmd0aCkge1xuICByZXR1cm4gbmV3IChhcnJheVNwZWNpZXNDb25zdHJ1Y3RvcihvcmlnaW5hbEFycmF5KSkobGVuZ3RoID09PSAwID8gMCA6IGxlbmd0aCk7XG59O1xuIiwidmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcycpO1xuXG52YXIgdG9TdHJpbmcgPSB1bmN1cnJ5VGhpcyh7fS50b1N0cmluZyk7XG52YXIgc3RyaW5nU2xpY2UgPSB1bmN1cnJ5VGhpcygnJy5zbGljZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBzdHJpbmdTbGljZSh0b1N0cmluZyhpdCksIDgsIC0xKTtcbn07XG4iLCJ2YXIgVE9fU1RSSU5HX1RBR19TVVBQT1JUID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXN0cmluZy10YWctc3VwcG9ydCcpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciBjbGFzc29mUmF3ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NsYXNzb2YtcmF3Jyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciBUT19TVFJJTkdfVEFHID0gd2VsbEtub3duU3ltYm9sKCd0b1N0cmluZ1RhZycpO1xudmFyICRPYmplY3QgPSBPYmplY3Q7XG5cbi8vIEVTMyB3cm9uZyBoZXJlXG52YXIgQ09SUkVDVF9BUkdVTUVOVFMgPSBjbGFzc29mUmF3KGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgU2NyaXB0IEFjY2VzcyBEZW5pZWQgZXJyb3JcbnZhciB0cnlHZXQgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICB0cnkge1xuICAgIHJldHVybiBpdFtrZXldO1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG59O1xuXG4vLyBnZXR0aW5nIHRhZyBmcm9tIEVTNisgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgXG5tb2R1bGUuZXhwb3J0cyA9IFRPX1NUUklOR19UQUdfU1VQUE9SVCA/IGNsYXNzb2ZSYXcgOiBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIE8sIHRhZywgcmVzdWx0O1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAodGFnID0gdHJ5R2V0KE8gPSAkT2JqZWN0KGl0KSwgVE9fU1RSSU5HX1RBRykpID09ICdzdHJpbmcnID8gdGFnXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBDT1JSRUNUX0FSR1VNRU5UUyA/IGNsYXNzb2ZSYXcoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAocmVzdWx0ID0gY2xhc3NvZlJhdyhPKSkgPT0gJ09iamVjdCcgJiYgaXNDYWxsYWJsZShPLmNhbGxlZSkgPyAnQXJndW1lbnRzJyA6IHJlc3VsdDtcbn07XG4iLCJ2YXIgaGFzT3duID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcy1vd24tcHJvcGVydHknKTtcbnZhciBvd25LZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL293bi1rZXlzJyk7XG52YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcbnZhciBkZWZpbmVQcm9wZXJ0eU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhcmdldCwgc291cmNlLCBleGNlcHRpb25zKSB7XG4gIHZhciBrZXlzID0gb3duS2V5cyhzb3VyY2UpO1xuICB2YXIgZGVmaW5lUHJvcGVydHkgPSBkZWZpbmVQcm9wZXJ0eU1vZHVsZS5mO1xuICB2YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yTW9kdWxlLmY7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgIGlmICghaGFzT3duKHRhcmdldCwga2V5KSAmJiAhKGV4Y2VwdGlvbnMgJiYgaGFzT3duKGV4Y2VwdGlvbnMsIGtleSkpKSB7XG4gICAgICBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7XG4gICAgfVxuICB9XG59O1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgZGVmaW5lUHJvcGVydHlNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpO1xudmFyIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvciA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtcHJvcGVydHktZGVzY3JpcHRvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERFU0NSSVBUT1JTID8gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4gZGVmaW5lUHJvcGVydHlNb2R1bGUuZihvYmplY3QsIGtleSwgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIGRlZmluZVByb3BlcnR5TW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKTtcbnZhciBtYWtlQnVpbHRJbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9tYWtlLWJ1aWx0LWluJyk7XG52YXIgZGVmaW5lR2xvYmFsUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVmaW5lLWdsb2JhbC1wcm9wZXJ0eScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChPLCBrZXksIHZhbHVlLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuICB2YXIgc2ltcGxlID0gb3B0aW9ucy5lbnVtZXJhYmxlO1xuICB2YXIgbmFtZSA9IG9wdGlvbnMubmFtZSAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5uYW1lIDoga2V5O1xuICBpZiAoaXNDYWxsYWJsZSh2YWx1ZSkpIG1ha2VCdWlsdEluKHZhbHVlLCBuYW1lLCBvcHRpb25zKTtcbiAgaWYgKG9wdGlvbnMuZ2xvYmFsKSB7XG4gICAgaWYgKHNpbXBsZSkgT1trZXldID0gdmFsdWU7XG4gICAgZWxzZSBkZWZpbmVHbG9iYWxQcm9wZXJ0eShrZXksIHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICB0cnkge1xuICAgICAgaWYgKCFvcHRpb25zLnVuc2FmZSkgZGVsZXRlIE9ba2V5XTtcbiAgICAgIGVsc2UgaWYgKE9ba2V5XSkgc2ltcGxlID0gdHJ1ZTtcbiAgICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG4gICAgaWYgKHNpbXBsZSkgT1trZXldID0gdmFsdWU7XG4gICAgZWxzZSBkZWZpbmVQcm9wZXJ0eU1vZHVsZS5mKE8sIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6ICFvcHRpb25zLm5vbkNvbmZpZ3VyYWJsZSxcbiAgICAgIHdyaXRhYmxlOiAhb3B0aW9ucy5ub25Xcml0YWJsZVxuICAgIH0pO1xuICB9IHJldHVybiBPO1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZGVmaW5lcHJvcGVydHkgLS0gc2FmZVxudmFyIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHRyeSB7XG4gICAgZGVmaW5lUHJvcGVydHkoZ2xvYmFsLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGdsb2JhbFtrZXldID0gdmFsdWU7XG4gIH0gcmV0dXJuIHZhbHVlO1xufTtcbiIsInZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG4vLyBEZXRlY3QgSUU4J3MgaW5jb21wbGV0ZSBkZWZpbmVQcm9wZXJ0eSBpbXBsZW1lbnRhdGlvblxubW9kdWxlLmV4cG9ydHMgPSAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWRlZmluZXByb3BlcnR5IC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nXG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sIDEsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pWzFdICE9IDc7XG59KTtcbiIsInZhciBkb2N1bWVudEFsbCA9IHR5cGVvZiBkb2N1bWVudCA9PSAnb2JqZWN0JyAmJiBkb2N1bWVudC5hbGw7XG5cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtSXNIVE1MRERBLWludGVybmFsLXNsb3Rcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSB1bmljb3JuL25vLXR5cGVvZi11bmRlZmluZWQgLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmdcbnZhciBJU19IVE1MRERBID0gdHlwZW9mIGRvY3VtZW50QWxsID09ICd1bmRlZmluZWQnICYmIGRvY3VtZW50QWxsICE9PSB1bmRlZmluZWQ7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhbGw6IGRvY3VtZW50QWxsLFxuICBJU19IVE1MRERBOiBJU19IVE1MRERBXG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcblxudmFyIGRvY3VtZW50ID0gZ2xvYmFsLmRvY3VtZW50O1xuLy8gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCcgaW4gb2xkIElFXG52YXIgRVhJU1RTID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gRVhJU1RTID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCIvLyBpdGVyYWJsZSBET00gY29sbGVjdGlvbnNcbi8vIGZsYWcgLSBgaXRlcmFibGVgIGludGVyZmFjZSAtICdlbnRyaWVzJywgJ2tleXMnLCAndmFsdWVzJywgJ2ZvckVhY2gnIG1ldGhvZHNcbm1vZHVsZS5leHBvcnRzID0ge1xuICBDU1NSdWxlTGlzdDogMCxcbiAgQ1NTU3R5bGVEZWNsYXJhdGlvbjogMCxcbiAgQ1NTVmFsdWVMaXN0OiAwLFxuICBDbGllbnRSZWN0TGlzdDogMCxcbiAgRE9NUmVjdExpc3Q6IDAsXG4gIERPTVN0cmluZ0xpc3Q6IDAsXG4gIERPTVRva2VuTGlzdDogMSxcbiAgRGF0YVRyYW5zZmVySXRlbUxpc3Q6IDAsXG4gIEZpbGVMaXN0OiAwLFxuICBIVE1MQWxsQ29sbGVjdGlvbjogMCxcbiAgSFRNTENvbGxlY3Rpb246IDAsXG4gIEhUTUxGb3JtRWxlbWVudDogMCxcbiAgSFRNTFNlbGVjdEVsZW1lbnQ6IDAsXG4gIE1lZGlhTGlzdDogMCxcbiAgTWltZVR5cGVBcnJheTogMCxcbiAgTmFtZWROb2RlTWFwOiAwLFxuICBOb2RlTGlzdDogMSxcbiAgUGFpbnRSZXF1ZXN0TGlzdDogMCxcbiAgUGx1Z2luOiAwLFxuICBQbHVnaW5BcnJheTogMCxcbiAgU1ZHTGVuZ3RoTGlzdDogMCxcbiAgU1ZHTnVtYmVyTGlzdDogMCxcbiAgU1ZHUGF0aFNlZ0xpc3Q6IDAsXG4gIFNWR1BvaW50TGlzdDogMCxcbiAgU1ZHU3RyaW5nTGlzdDogMCxcbiAgU1ZHVHJhbnNmb3JtTGlzdDogMCxcbiAgU291cmNlQnVmZmVyTGlzdDogMCxcbiAgU3R5bGVTaGVldExpc3Q6IDAsXG4gIFRleHRUcmFja0N1ZUxpc3Q6IDAsXG4gIFRleHRUcmFja0xpc3Q6IDAsXG4gIFRvdWNoTGlzdDogMFxufTtcbiIsIi8vIGluIG9sZCBXZWJLaXQgdmVyc2lvbnMsIGBlbGVtZW50LmNsYXNzTGlzdGAgaXMgbm90IGFuIGluc3RhbmNlIG9mIGdsb2JhbCBgRE9NVG9rZW5MaXN0YFxudmFyIGRvY3VtZW50Q3JlYXRlRWxlbWVudCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kb2N1bWVudC1jcmVhdGUtZWxlbWVudCcpO1xuXG52YXIgY2xhc3NMaXN0ID0gZG9jdW1lbnRDcmVhdGVFbGVtZW50KCdzcGFuJykuY2xhc3NMaXN0O1xudmFyIERPTVRva2VuTGlzdFByb3RvdHlwZSA9IGNsYXNzTGlzdCAmJiBjbGFzc0xpc3QuY29uc3RydWN0b3IgJiYgY2xhc3NMaXN0LmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBET01Ub2tlbkxpc3RQcm90b3R5cGUgPT09IE9iamVjdC5wcm90b3R5cGUgPyB1bmRlZmluZWQgOiBET01Ub2tlbkxpc3RQcm90b3R5cGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiBuYXZpZ2F0b3IgIT0gJ3VuZGVmaW5lZCcgJiYgU3RyaW5nKG5hdmlnYXRvci51c2VyQWdlbnQpIHx8ICcnO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciB1c2VyQWdlbnQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW5naW5lLXVzZXItYWdlbnQnKTtcblxudmFyIHByb2Nlc3MgPSBnbG9iYWwucHJvY2VzcztcbnZhciBEZW5vID0gZ2xvYmFsLkRlbm87XG52YXIgdmVyc2lvbnMgPSBwcm9jZXNzICYmIHByb2Nlc3MudmVyc2lvbnMgfHwgRGVubyAmJiBEZW5vLnZlcnNpb247XG52YXIgdjggPSB2ZXJzaW9ucyAmJiB2ZXJzaW9ucy52ODtcbnZhciBtYXRjaCwgdmVyc2lvbjtcblxuaWYgKHY4KSB7XG4gIG1hdGNoID0gdjguc3BsaXQoJy4nKTtcbiAgLy8gaW4gb2xkIENocm9tZSwgdmVyc2lvbnMgb2YgVjggaXNuJ3QgVjggPSBDaHJvbWUgLyAxMFxuICAvLyBidXQgdGhlaXIgY29ycmVjdCB2ZXJzaW9ucyBhcmUgbm90IGludGVyZXN0aW5nIGZvciB1c1xuICB2ZXJzaW9uID0gbWF0Y2hbMF0gPiAwICYmIG1hdGNoWzBdIDwgNCA/IDEgOiArKG1hdGNoWzBdICsgbWF0Y2hbMV0pO1xufVxuXG4vLyBCcm93c2VyRlMgTm9kZUpTIGBwcm9jZXNzYCBwb2x5ZmlsbCBpbmNvcnJlY3RseSBzZXQgYC52OGAgdG8gYDAuMGBcbi8vIHNvIGNoZWNrIGB1c2VyQWdlbnRgIGV2ZW4gaWYgYC52OGAgZXhpc3RzLCBidXQgMFxuaWYgKCF2ZXJzaW9uICYmIHVzZXJBZ2VudCkge1xuICBtYXRjaCA9IHVzZXJBZ2VudC5tYXRjaCgvRWRnZVxcLyhcXGQrKS8pO1xuICBpZiAoIW1hdGNoIHx8IG1hdGNoWzFdID49IDc0KSB7XG4gICAgbWF0Y2ggPSB1c2VyQWdlbnQubWF0Y2goL0Nocm9tZVxcLyhcXGQrKS8pO1xuICAgIGlmIChtYXRjaCkgdmVyc2lvbiA9ICttYXRjaFsxXTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHZlcnNpb247XG4iLCIvLyBJRTgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gW1xuICAnY29uc3RydWN0b3InLFxuICAnaGFzT3duUHJvcGVydHknLFxuICAnaXNQcm90b3R5cGVPZicsXG4gICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsXG4gICd0b0xvY2FsZVN0cmluZycsXG4gICd0b1N0cmluZycsXG4gICd2YWx1ZU9mJ1xuXTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1jcmVhdGUnKTtcbnZhciBub3JtYWxpemVTdHJpbmdBcmd1bWVudCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9ub3JtYWxpemUtc3RyaW5nLWFyZ3VtZW50Jyk7XG5cbnZhciBuYXRpdmVFcnJvclRvU3RyaW5nID0gRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nO1xuXG52YXIgSU5DT1JSRUNUX1RPX1NUUklORyA9IGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgaWYgKERFU0NSSVBUT1JTKSB7XG4gICAgLy8gQ2hyb21lIDMyLSBpbmNvcnJlY3RseSBjYWxsIGFjY2Vzc29yXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1kZWZpbmVwcm9wZXJ0eSAtLSBzYWZlXG4gICAgdmFyIG9iamVjdCA9IGNyZWF0ZShPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICduYW1lJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzID09PSBvYmplY3Q7XG4gICAgfSB9KSk7XG4gICAgaWYgKG5hdGl2ZUVycm9yVG9TdHJpbmcuY2FsbChvYmplY3QpICE9PSAndHJ1ZScpIHJldHVybiB0cnVlO1xuICB9XG4gIC8vIEZGMTAtIGRvZXMgbm90IHByb3Blcmx5IGhhbmRsZSBub24tc3RyaW5nc1xuICByZXR1cm4gbmF0aXZlRXJyb3JUb1N0cmluZy5jYWxsKHsgbWVzc2FnZTogMSwgbmFtZTogMiB9KSAhPT0gJzI6IDEnXG4gICAgLy8gSUU4IGRvZXMgbm90IHByb3Blcmx5IGhhbmRsZSBkZWZhdWx0c1xuICAgIHx8IG5hdGl2ZUVycm9yVG9TdHJpbmcuY2FsbCh7fSkgIT09ICdFcnJvcic7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBJTkNPUlJFQ1RfVE9fU1RSSU5HID8gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHZhciBPID0gYW5PYmplY3QodGhpcyk7XG4gIHZhciBuYW1lID0gbm9ybWFsaXplU3RyaW5nQXJndW1lbnQoTy5uYW1lLCAnRXJyb3InKTtcbiAgdmFyIG1lc3NhZ2UgPSBub3JtYWxpemVTdHJpbmdBcmd1bWVudChPLm1lc3NhZ2UpO1xuICByZXR1cm4gIW5hbWUgPyBtZXNzYWdlIDogIW1lc3NhZ2UgPyBuYW1lIDogbmFtZSArICc6ICcgKyBtZXNzYWdlO1xufSA6IG5hdGl2ZUVycm9yVG9TdHJpbmc7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yJykuZjtcbnZhciBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5Jyk7XG52YXIgZGVmaW5lQnVpbHRJbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZWZpbmUtYnVpbHQtaW4nKTtcbnZhciBkZWZpbmVHbG9iYWxQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZWZpbmUtZ2xvYmFsLXByb3BlcnR5Jyk7XG52YXIgY29weUNvbnN0cnVjdG9yUHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jb3B5LWNvbnN0cnVjdG9yLXByb3BlcnRpZXMnKTtcbnZhciBpc0ZvcmNlZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1mb3JjZWQnKTtcblxuLypcbiAgb3B0aW9ucy50YXJnZXQgICAgICAgICAtIG5hbWUgb2YgdGhlIHRhcmdldCBvYmplY3RcbiAgb3B0aW9ucy5nbG9iYWwgICAgICAgICAtIHRhcmdldCBpcyB0aGUgZ2xvYmFsIG9iamVjdFxuICBvcHRpb25zLnN0YXQgICAgICAgICAgIC0gZXhwb3J0IGFzIHN0YXRpYyBtZXRob2RzIG9mIHRhcmdldFxuICBvcHRpb25zLnByb3RvICAgICAgICAgIC0gZXhwb3J0IGFzIHByb3RvdHlwZSBtZXRob2RzIG9mIHRhcmdldFxuICBvcHRpb25zLnJlYWwgICAgICAgICAgIC0gcmVhbCBwcm90b3R5cGUgbWV0aG9kIGZvciB0aGUgYHB1cmVgIHZlcnNpb25cbiAgb3B0aW9ucy5mb3JjZWQgICAgICAgICAtIGV4cG9ydCBldmVuIGlmIHRoZSBuYXRpdmUgZmVhdHVyZSBpcyBhdmFpbGFibGVcbiAgb3B0aW9ucy5iaW5kICAgICAgICAgICAtIGJpbmQgbWV0aG9kcyB0byB0aGUgdGFyZ2V0LCByZXF1aXJlZCBmb3IgdGhlIGBwdXJlYCB2ZXJzaW9uXG4gIG9wdGlvbnMud3JhcCAgICAgICAgICAgLSB3cmFwIGNvbnN0cnVjdG9ycyB0byBwcmV2ZW50aW5nIGdsb2JhbCBwb2xsdXRpb24sIHJlcXVpcmVkIGZvciB0aGUgYHB1cmVgIHZlcnNpb25cbiAgb3B0aW9ucy51bnNhZmUgICAgICAgICAtIHVzZSB0aGUgc2ltcGxlIGFzc2lnbm1lbnQgb2YgcHJvcGVydHkgaW5zdGVhZCBvZiBkZWxldGUgKyBkZWZpbmVQcm9wZXJ0eVxuICBvcHRpb25zLnNoYW0gICAgICAgICAgIC0gYWRkIGEgZmxhZyB0byBub3QgY29tcGxldGVseSBmdWxsIHBvbHlmaWxsc1xuICBvcHRpb25zLmVudW1lcmFibGUgICAgIC0gZXhwb3J0IGFzIGVudW1lcmFibGUgcHJvcGVydHlcbiAgb3B0aW9ucy5kb250Q2FsbEdldFNldCAtIHByZXZlbnQgY2FsbGluZyBhIGdldHRlciBvbiB0YXJnZXRcbiAgb3B0aW9ucy5uYW1lICAgICAgICAgICAtIHRoZSAubmFtZSBvZiB0aGUgZnVuY3Rpb24gaWYgaXQgZG9lcyBub3QgbWF0Y2ggdGhlIGtleVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9wdGlvbnMsIHNvdXJjZSkge1xuICB2YXIgVEFSR0VUID0gb3B0aW9ucy50YXJnZXQ7XG4gIHZhciBHTE9CQUwgPSBvcHRpb25zLmdsb2JhbDtcbiAgdmFyIFNUQVRJQyA9IG9wdGlvbnMuc3RhdDtcbiAgdmFyIEZPUkNFRCwgdGFyZ2V0LCBrZXksIHRhcmdldFByb3BlcnR5LCBzb3VyY2VQcm9wZXJ0eSwgZGVzY3JpcHRvcjtcbiAgaWYgKEdMT0JBTCkge1xuICAgIHRhcmdldCA9IGdsb2JhbDtcbiAgfSBlbHNlIGlmIChTVEFUSUMpIHtcbiAgICB0YXJnZXQgPSBnbG9iYWxbVEFSR0VUXSB8fCBkZWZpbmVHbG9iYWxQcm9wZXJ0eShUQVJHRVQsIHt9KTtcbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQgPSAoZ2xvYmFsW1RBUkdFVF0gfHwge30pLnByb3RvdHlwZTtcbiAgfVxuICBpZiAodGFyZ2V0KSBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICBzb3VyY2VQcm9wZXJ0eSA9IHNvdXJjZVtrZXldO1xuICAgIGlmIChvcHRpb25zLmRvbnRDYWxsR2V0U2V0KSB7XG4gICAgICBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgICAgIHRhcmdldFByb3BlcnR5ID0gZGVzY3JpcHRvciAmJiBkZXNjcmlwdG9yLnZhbHVlO1xuICAgIH0gZWxzZSB0YXJnZXRQcm9wZXJ0eSA9IHRhcmdldFtrZXldO1xuICAgIEZPUkNFRCA9IGlzRm9yY2VkKEdMT0JBTCA/IGtleSA6IFRBUkdFVCArIChTVEFUSUMgPyAnLicgOiAnIycpICsga2V5LCBvcHRpb25zLmZvcmNlZCk7XG4gICAgLy8gY29udGFpbmVkIGluIHRhcmdldFxuICAgIGlmICghRk9SQ0VEICYmIHRhcmdldFByb3BlcnR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0eXBlb2Ygc291cmNlUHJvcGVydHkgPT0gdHlwZW9mIHRhcmdldFByb3BlcnR5KSBjb250aW51ZTtcbiAgICAgIGNvcHlDb25zdHJ1Y3RvclByb3BlcnRpZXMoc291cmNlUHJvcGVydHksIHRhcmdldFByb3BlcnR5KTtcbiAgICB9XG4gICAgLy8gYWRkIGEgZmxhZyB0byBub3QgY29tcGxldGVseSBmdWxsIHBvbHlmaWxsc1xuICAgIGlmIChvcHRpb25zLnNoYW0gfHwgKHRhcmdldFByb3BlcnR5ICYmIHRhcmdldFByb3BlcnR5LnNoYW0pKSB7XG4gICAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoc291cmNlUHJvcGVydHksICdzaGFtJywgdHJ1ZSk7XG4gICAgfVxuICAgIGRlZmluZUJ1aWx0SW4odGFyZ2V0LCBrZXksIHNvdXJjZVByb3BlcnR5LCBvcHRpb25zKTtcbiAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG4iLCJ2YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzLWNsYXVzZScpO1xudmFyIGFDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hLWNhbGxhYmxlJyk7XG52YXIgTkFUSVZFX0JJTkQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tYmluZC1uYXRpdmUnKTtcblxudmFyIGJpbmQgPSB1bmN1cnJ5VGhpcyh1bmN1cnJ5VGhpcy5iaW5kKTtcblxuLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbiwgdGhhdCkge1xuICBhQ2FsbGFibGUoZm4pO1xuICByZXR1cm4gdGhhdCA9PT0gdW5kZWZpbmVkID8gZm4gOiBOQVRJVkVfQklORCA/IGJpbmQoZm4sIHRoYXQpIDogZnVuY3Rpb24gKC8qIC4uLmFyZ3MgKi8pIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCJ2YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tZnVuY3Rpb24tcHJvdG90eXBlLWJpbmQgLS0gc2FmZVxuICB2YXIgdGVzdCA9IChmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH0pLmJpbmQoKTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGlucyAtLSBzYWZlXG4gIHJldHVybiB0eXBlb2YgdGVzdCAhPSAnZnVuY3Rpb24nIHx8IHRlc3QuaGFzT3duUHJvcGVydHkoJ3Byb3RvdHlwZScpO1xufSk7XG4iLCJ2YXIgTkFUSVZFX0JJTkQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tYmluZC1uYXRpdmUnKTtcblxudmFyIGNhbGwgPSBGdW5jdGlvbi5wcm90b3R5cGUuY2FsbDtcblxubW9kdWxlLmV4cG9ydHMgPSBOQVRJVkVfQklORCA/IGNhbGwuYmluZChjYWxsKSA6IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGNhbGwuYXBwbHkoY2FsbCwgYXJndW1lbnRzKTtcbn07XG4iLCJ2YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xuXG52YXIgRnVuY3Rpb25Qcm90b3R5cGUgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldG93bnByb3BlcnR5ZGVzY3JpcHRvciAtLSBzYWZlXG52YXIgZ2V0RGVzY3JpcHRvciA9IERFU0NSSVBUT1JTICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbnZhciBFWElTVFMgPSBoYXNPd24oRnVuY3Rpb25Qcm90b3R5cGUsICduYW1lJyk7XG4vLyBhZGRpdGlvbmFsIHByb3RlY3Rpb24gZnJvbSBtaW5pZmllZCAvIG1hbmdsZWQgLyBkcm9wcGVkIGZ1bmN0aW9uIG5hbWVzXG52YXIgUFJPUEVSID0gRVhJU1RTICYmIChmdW5jdGlvbiBzb21ldGhpbmcoKSB7IC8qIGVtcHR5ICovIH0pLm5hbWUgPT09ICdzb21ldGhpbmcnO1xudmFyIENPTkZJR1VSQUJMRSA9IEVYSVNUUyAmJiAoIURFU0NSSVBUT1JTIHx8IChERVNDUklQVE9SUyAmJiBnZXREZXNjcmlwdG9yKEZ1bmN0aW9uUHJvdG90eXBlLCAnbmFtZScpLmNvbmZpZ3VyYWJsZSkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgRVhJU1RTOiBFWElTVFMsXG4gIFBST1BFUjogUFJPUEVSLFxuICBDT05GSUdVUkFCTEU6IENPTkZJR1VSQUJMRVxufTtcbiIsInZhciBjbGFzc29mUmF3ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NsYXNzb2YtcmF3Jyk7XG52YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuKSB7XG4gIC8vIE5hc2hvcm4gYnVnOlxuICAvLyAgIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy8xMTI4XG4gIC8vICAgaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzExMzBcbiAgaWYgKGNsYXNzb2ZSYXcoZm4pID09PSAnRnVuY3Rpb24nKSByZXR1cm4gdW5jdXJyeVRoaXMoZm4pO1xufTtcbiIsInZhciBOQVRJVkVfQklORCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi1iaW5kLW5hdGl2ZScpO1xuXG52YXIgRnVuY3Rpb25Qcm90b3R5cGUgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG52YXIgY2FsbCA9IEZ1bmN0aW9uUHJvdG90eXBlLmNhbGw7XG52YXIgdW5jdXJyeVRoaXNXaXRoQmluZCA9IE5BVElWRV9CSU5EICYmIEZ1bmN0aW9uUHJvdG90eXBlLmJpbmQuYmluZChjYWxsLCBjYWxsKTtcblxubW9kdWxlLmV4cG9ydHMgPSBOQVRJVkVfQklORCA/IHVuY3VycnlUaGlzV2l0aEJpbmQgOiBmdW5jdGlvbiAoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2FsbC5hcHBseShmbiwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcblxudmFyIGFGdW5jdGlvbiA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gaXNDYWxsYWJsZShhcmd1bWVudCkgPyBhcmd1bWVudCA6IHVuZGVmaW5lZDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWVzcGFjZSwgbWV0aG9kKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoIDwgMiA/IGFGdW5jdGlvbihnbG9iYWxbbmFtZXNwYWNlXSkgOiBnbG9iYWxbbmFtZXNwYWNlXSAmJiBnbG9iYWxbbmFtZXNwYWNlXVttZXRob2RdO1xufTtcbiIsInZhciBhQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYS1jYWxsYWJsZScpO1xudmFyIGlzTnVsbE9yVW5kZWZpbmVkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW51bGwtb3ItdW5kZWZpbmVkJyk7XG5cbi8vIGBHZXRNZXRob2RgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1nZXRtZXRob2Rcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFYsIFApIHtcbiAgdmFyIGZ1bmMgPSBWW1BdO1xuICByZXR1cm4gaXNOdWxsT3JVbmRlZmluZWQoZnVuYykgPyB1bmRlZmluZWQgOiBhQ2FsbGFibGUoZnVuYyk7XG59O1xuIiwidmFyIGNoZWNrID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCAmJiBpdC5NYXRoID09IE1hdGggJiYgaXQ7XG59O1xuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxubW9kdWxlLmV4cG9ydHMgPVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tZ2xvYmFsLXRoaXMgLS0gc2FmZVxuICBjaGVjayh0eXBlb2YgZ2xvYmFsVGhpcyA9PSAnb2JqZWN0JyAmJiBnbG9iYWxUaGlzKSB8fFxuICBjaGVjayh0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvdykgfHxcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtZ2xvYmFscyAtLSBzYWZlXG4gIGNoZWNrKHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYpIHx8XG4gIGNoZWNrKHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsKSB8fFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmMgLS0gZmFsbGJhY2tcbiAgKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0pKCkgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbiIsInZhciB1bmN1cnJ5VGhpcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1vYmplY3QnKTtcblxudmFyIGhhc093blByb3BlcnR5ID0gdW5jdXJyeVRoaXMoe30uaGFzT3duUHJvcGVydHkpO1xuXG4vLyBgSGFzT3duUHJvcGVydHlgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1oYXNvd25wcm9wZXJ0eVxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1oYXNvd24gLS0gc2FmZVxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuaGFzT3duIHx8IGZ1bmN0aW9uIGhhc093bihpdCwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eSh0b09iamVjdChpdCksIGtleSk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsInZhciBnZXRCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1idWlsdC1pbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEJ1aWx0SW4oJ2RvY3VtZW50JywgJ2RvY3VtZW50RWxlbWVudCcpO1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBjcmVhdGVFbGVtZW50ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RvY3VtZW50LWNyZWF0ZS1lbGVtZW50Jyk7XG5cbi8vIFRoYW5rcyB0byBJRTggZm9yIGl0cyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhREVTQ1JJUFRPUlMgJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1kZWZpbmVwcm9wZXJ0eSAtLSByZXF1aXJlZCBmb3IgdGVzdGluZ1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGNyZWF0ZUVsZW1lbnQoJ2RpdicpLCAnYScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH1cbiAgfSkuYSAhPSA3O1xufSk7XG4iLCJ2YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NsYXNzb2YtcmF3Jyk7XG5cbnZhciAkT2JqZWN0ID0gT2JqZWN0O1xudmFyIHNwbGl0ID0gdW5jdXJyeVRoaXMoJycuc3BsaXQpO1xuXG4vLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xubW9kdWxlLmV4cG9ydHMgPSBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIHRocm93cyBhbiBlcnJvciBpbiByaGlubywgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL3JoaW5vL2lzc3Vlcy8zNDZcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGlucyAtLSBzYWZlXG4gIHJldHVybiAhJE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApO1xufSkgPyBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGNsYXNzb2YoaXQpID09ICdTdHJpbmcnID8gc3BsaXQoaXQsICcnKSA6ICRPYmplY3QoaXQpO1xufSA6ICRPYmplY3Q7XG4iLCJ2YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIHN0b3JlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1zdG9yZScpO1xuXG52YXIgZnVuY3Rpb25Ub1N0cmluZyA9IHVuY3VycnlUaGlzKEZ1bmN0aW9uLnRvU3RyaW5nKTtcblxuLy8gdGhpcyBoZWxwZXIgYnJva2VuIGluIGBjb3JlLWpzQDMuNC4xLTMuNC40YCwgc28gd2UgY2FuJ3QgdXNlIGBzaGFyZWRgIGhlbHBlclxuaWYgKCFpc0NhbGxhYmxlKHN0b3JlLmluc3BlY3RTb3VyY2UpKSB7XG4gIHN0b3JlLmluc3BlY3RTb3VyY2UgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb25Ub1N0cmluZyhpdCk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RvcmUuaW5zcGVjdFNvdXJjZTtcbiIsInZhciBOQVRJVkVfV0VBS19NQVAgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2Vhay1tYXAtYmFzaWMtZGV0ZWN0aW9uJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xudmFyIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtbm9uLWVudW1lcmFibGUtcHJvcGVydHknKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQtc3RvcmUnKTtcbnZhciBzaGFyZWRLZXkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkLWtleScpO1xudmFyIGhpZGRlbktleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGlkZGVuLWtleXMnKTtcblxudmFyIE9CSkVDVF9BTFJFQURZX0lOSVRJQUxJWkVEID0gJ09iamVjdCBhbHJlYWR5IGluaXRpYWxpemVkJztcbnZhciBUeXBlRXJyb3IgPSBnbG9iYWwuVHlwZUVycm9yO1xudmFyIFdlYWtNYXAgPSBnbG9iYWwuV2Vha01hcDtcbnZhciBzZXQsIGdldCwgaGFzO1xuXG52YXIgZW5mb3JjZSA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaGFzKGl0KSA/IGdldChpdCkgOiBzZXQoaXQsIHt9KTtcbn07XG5cbnZhciBnZXR0ZXJGb3IgPSBmdW5jdGlvbiAoVFlQRSkge1xuICByZXR1cm4gZnVuY3Rpb24gKGl0KSB7XG4gICAgdmFyIHN0YXRlO1xuICAgIGlmICghaXNPYmplY3QoaXQpIHx8IChzdGF0ZSA9IGdldChpdCkpLnR5cGUgIT09IFRZUEUpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcignSW5jb21wYXRpYmxlIHJlY2VpdmVyLCAnICsgVFlQRSArICcgcmVxdWlyZWQnKTtcbiAgICB9IHJldHVybiBzdGF0ZTtcbiAgfTtcbn07XG5cbmlmIChOQVRJVkVfV0VBS19NQVAgfHwgc2hhcmVkLnN0YXRlKSB7XG4gIHZhciBzdG9yZSA9IHNoYXJlZC5zdGF0ZSB8fCAoc2hhcmVkLnN0YXRlID0gbmV3IFdlYWtNYXAoKSk7XG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXNlbGYtYXNzaWduIC0tIHByb3RvdHlwZSBtZXRob2RzIHByb3RlY3Rpb24gKi9cbiAgc3RvcmUuZ2V0ID0gc3RvcmUuZ2V0O1xuICBzdG9yZS5oYXMgPSBzdG9yZS5oYXM7XG4gIHN0b3JlLnNldCA9IHN0b3JlLnNldDtcbiAgLyogZXNsaW50LWVuYWJsZSBuby1zZWxmLWFzc2lnbiAtLSBwcm90b3R5cGUgbWV0aG9kcyBwcm90ZWN0aW9uICovXG4gIHNldCA9IGZ1bmN0aW9uIChpdCwgbWV0YWRhdGEpIHtcbiAgICBpZiAoc3RvcmUuaGFzKGl0KSkgdGhyb3cgVHlwZUVycm9yKE9CSkVDVF9BTFJFQURZX0lOSVRJQUxJWkVEKTtcbiAgICBtZXRhZGF0YS5mYWNhZGUgPSBpdDtcbiAgICBzdG9yZS5zZXQoaXQsIG1ldGFkYXRhKTtcbiAgICByZXR1cm4gbWV0YWRhdGE7XG4gIH07XG4gIGdldCA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiBzdG9yZS5nZXQoaXQpIHx8IHt9O1xuICB9O1xuICBoYXMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gc3RvcmUuaGFzKGl0KTtcbiAgfTtcbn0gZWxzZSB7XG4gIHZhciBTVEFURSA9IHNoYXJlZEtleSgnc3RhdGUnKTtcbiAgaGlkZGVuS2V5c1tTVEFURV0gPSB0cnVlO1xuICBzZXQgPSBmdW5jdGlvbiAoaXQsIG1ldGFkYXRhKSB7XG4gICAgaWYgKGhhc093bihpdCwgU1RBVEUpKSB0aHJvdyBUeXBlRXJyb3IoT0JKRUNUX0FMUkVBRFlfSU5JVElBTElaRUQpO1xuICAgIG1ldGFkYXRhLmZhY2FkZSA9IGl0O1xuICAgIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShpdCwgU1RBVEUsIG1ldGFkYXRhKTtcbiAgICByZXR1cm4gbWV0YWRhdGE7XG4gIH07XG4gIGdldCA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiBoYXNPd24oaXQsIFNUQVRFKSA/IGl0W1NUQVRFXSA6IHt9O1xuICB9O1xuICBoYXMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gaGFzT3duKGl0LCBTVEFURSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IHNldCxcbiAgZ2V0OiBnZXQsXG4gIGhhczogaGFzLFxuICBlbmZvcmNlOiBlbmZvcmNlLFxuICBnZXR0ZXJGb3I6IGdldHRlckZvclxufTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NsYXNzb2YtcmF3Jyk7XG5cbi8vIGBJc0FycmF5YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtaXNhcnJheVxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLWFycmF5LWlzYXJyYXkgLS0gc2FmZVxubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIGlzQXJyYXkoYXJndW1lbnQpIHtcbiAgcmV0dXJuIGNsYXNzb2YoYXJndW1lbnQpID09ICdBcnJheSc7XG59O1xuIiwidmFyICRkb2N1bWVudEFsbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kb2N1bWVudC1hbGwnKTtcblxudmFyIGRvY3VtZW50QWxsID0gJGRvY3VtZW50QWxsLmFsbDtcblxuLy8gYElzQ2FsbGFibGVgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1pc2NhbGxhYmxlXG5tb2R1bGUuZXhwb3J0cyA9ICRkb2N1bWVudEFsbC5JU19IVE1MRERBID8gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHJldHVybiB0eXBlb2YgYXJndW1lbnQgPT0gJ2Z1bmN0aW9uJyB8fCBhcmd1bWVudCA9PT0gZG9jdW1lbnRBbGw7XG59IDogZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHJldHVybiB0eXBlb2YgYXJndW1lbnQgPT0gJ2Z1bmN0aW9uJztcbn07XG4iLCJ2YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jbGFzc29mJyk7XG52YXIgZ2V0QnVpbHRJbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtYnVpbHQtaW4nKTtcbnZhciBpbnNwZWN0U291cmNlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luc3BlY3Qtc291cmNlJyk7XG5cbnZhciBub29wID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xudmFyIGVtcHR5ID0gW107XG52YXIgY29uc3RydWN0ID0gZ2V0QnVpbHRJbignUmVmbGVjdCcsICdjb25zdHJ1Y3QnKTtcbnZhciBjb25zdHJ1Y3RvclJlZ0V4cCA9IC9eXFxzKig/OmNsYXNzfGZ1bmN0aW9uKVxcYi87XG52YXIgZXhlYyA9IHVuY3VycnlUaGlzKGNvbnN0cnVjdG9yUmVnRXhwLmV4ZWMpO1xudmFyIElOQ09SUkVDVF9UT19TVFJJTkcgPSAhY29uc3RydWN0b3JSZWdFeHAuZXhlYyhub29wKTtcblxudmFyIGlzQ29uc3RydWN0b3JNb2Rlcm4gPSBmdW5jdGlvbiBpc0NvbnN0cnVjdG9yKGFyZ3VtZW50KSB7XG4gIGlmICghaXNDYWxsYWJsZShhcmd1bWVudCkpIHJldHVybiBmYWxzZTtcbiAgdHJ5IHtcbiAgICBjb25zdHJ1Y3Qobm9vcCwgZW1wdHksIGFyZ3VtZW50KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbnZhciBpc0NvbnN0cnVjdG9yTGVnYWN5ID0gZnVuY3Rpb24gaXNDb25zdHJ1Y3Rvcihhcmd1bWVudCkge1xuICBpZiAoIWlzQ2FsbGFibGUoYXJndW1lbnQpKSByZXR1cm4gZmFsc2U7XG4gIHN3aXRjaCAoY2xhc3NvZihhcmd1bWVudCkpIHtcbiAgICBjYXNlICdBc3luY0Z1bmN0aW9uJzpcbiAgICBjYXNlICdHZW5lcmF0b3JGdW5jdGlvbic6XG4gICAgY2FzZSAnQXN5bmNHZW5lcmF0b3JGdW5jdGlvbic6IHJldHVybiBmYWxzZTtcbiAgfVxuICB0cnkge1xuICAgIC8vIHdlIGNhbid0IGNoZWNrIC5wcm90b3R5cGUgc2luY2UgY29uc3RydWN0b3JzIHByb2R1Y2VkIGJ5IC5iaW5kIGhhdmVuJ3QgaXRcbiAgICAvLyBgRnVuY3Rpb24jdG9TdHJpbmdgIHRocm93cyBvbiBzb21lIGJ1aWx0LWl0IGZ1bmN0aW9uIGluIHNvbWUgbGVnYWN5IGVuZ2luZXNcbiAgICAvLyAoZm9yIGV4YW1wbGUsIGBET01RdWFkYCBhbmQgc2ltaWxhciBpbiBGRjQxLSlcbiAgICByZXR1cm4gSU5DT1JSRUNUX1RPX1NUUklORyB8fCAhIWV4ZWMoY29uc3RydWN0b3JSZWdFeHAsIGluc3BlY3RTb3VyY2UoYXJndW1lbnQpKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxuaXNDb25zdHJ1Y3RvckxlZ2FjeS5zaGFtID0gdHJ1ZTtcblxuLy8gYElzQ29uc3RydWN0b3JgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1pc2NvbnN0cnVjdG9yXG5tb2R1bGUuZXhwb3J0cyA9ICFjb25zdHJ1Y3QgfHwgZmFpbHMoZnVuY3Rpb24gKCkge1xuICB2YXIgY2FsbGVkO1xuICByZXR1cm4gaXNDb25zdHJ1Y3Rvck1vZGVybihpc0NvbnN0cnVjdG9yTW9kZXJuLmNhbGwpXG4gICAgfHwgIWlzQ29uc3RydWN0b3JNb2Rlcm4oT2JqZWN0KVxuICAgIHx8ICFpc0NvbnN0cnVjdG9yTW9kZXJuKGZ1bmN0aW9uICgpIHsgY2FsbGVkID0gdHJ1ZTsgfSlcbiAgICB8fCBjYWxsZWQ7XG59KSA/IGlzQ29uc3RydWN0b3JMZWdhY3kgOiBpc0NvbnN0cnVjdG9yTW9kZXJuO1xuIiwidmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xuXG52YXIgcmVwbGFjZW1lbnQgPSAvI3xcXC5wcm90b3R5cGVcXC4vO1xuXG52YXIgaXNGb3JjZWQgPSBmdW5jdGlvbiAoZmVhdHVyZSwgZGV0ZWN0aW9uKSB7XG4gIHZhciB2YWx1ZSA9IGRhdGFbbm9ybWFsaXplKGZlYXR1cmUpXTtcbiAgcmV0dXJuIHZhbHVlID09IFBPTFlGSUxMID8gdHJ1ZVxuICAgIDogdmFsdWUgPT0gTkFUSVZFID8gZmFsc2VcbiAgICA6IGlzQ2FsbGFibGUoZGV0ZWN0aW9uKSA/IGZhaWxzKGRldGVjdGlvbilcbiAgICA6ICEhZGV0ZWN0aW9uO1xufTtcblxudmFyIG5vcm1hbGl6ZSA9IGlzRm9yY2VkLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgcmV0dXJuIFN0cmluZyhzdHJpbmcpLnJlcGxhY2UocmVwbGFjZW1lbnQsICcuJykudG9Mb3dlckNhc2UoKTtcbn07XG5cbnZhciBkYXRhID0gaXNGb3JjZWQuZGF0YSA9IHt9O1xudmFyIE5BVElWRSA9IGlzRm9yY2VkLk5BVElWRSA9ICdOJztcbnZhciBQT0xZRklMTCA9IGlzRm9yY2VkLlBPTFlGSUxMID0gJ1AnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRm9yY2VkO1xuIiwiLy8gd2UgY2FuJ3QgdXNlIGp1c3QgYGl0ID09IG51bGxgIHNpbmNlIG9mIGBkb2N1bWVudC5hbGxgIHNwZWNpYWwgY2FzZVxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1Jc0hUTUxEREEtaW50ZXJuYWwtc2xvdC1hZWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA9PT0gbnVsbCB8fCBpdCA9PT0gdW5kZWZpbmVkO1xufTtcbiIsInZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgJGRvY3VtZW50QWxsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RvY3VtZW50LWFsbCcpO1xuXG52YXIgZG9jdW1lbnRBbGwgPSAkZG9jdW1lbnRBbGwuYWxsO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICRkb2N1bWVudEFsbC5JU19IVE1MRERBID8gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IGlzQ2FsbGFibGUoaXQpIHx8IGl0ID09PSBkb2N1bWVudEFsbDtcbn0gOiBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogaXNDYWxsYWJsZShpdCk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmYWxzZTtcbiIsInZhciBnZXRCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1idWlsdC1pbicpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciBpc1Byb3RvdHlwZU9mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1pcy1wcm90b3R5cGUtb2YnKTtcbnZhciBVU0VfU1lNQk9MX0FTX1VJRCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91c2Utc3ltYm9sLWFzLXVpZCcpO1xuXG52YXIgJE9iamVjdCA9IE9iamVjdDtcblxubW9kdWxlLmV4cG9ydHMgPSBVU0VfU1lNQk9MX0FTX1VJRCA/IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnO1xufSA6IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgJFN5bWJvbCA9IGdldEJ1aWx0SW4oJ1N5bWJvbCcpO1xuICByZXR1cm4gaXNDYWxsYWJsZSgkU3ltYm9sKSAmJiBpc1Byb3RvdHlwZU9mKCRTeW1ib2wucHJvdG90eXBlLCAkT2JqZWN0KGl0KSk7XG59O1xuIiwidmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWxlbmd0aCcpO1xuXG4vLyBgTGVuZ3RoT2ZBcnJheUxpa2VgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1sZW5ndGhvZmFycmF5bGlrZVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiB0b0xlbmd0aChvYmoubGVuZ3RoKTtcbn07XG4iLCJ2YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgaGFzT3duID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcy1vd24tcHJvcGVydHknKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIENPTkZJR1VSQUJMRV9GVU5DVElPTl9OQU1FID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLW5hbWUnKS5DT05GSUdVUkFCTEU7XG52YXIgaW5zcGVjdFNvdXJjZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnNwZWN0LXNvdXJjZScpO1xudmFyIEludGVybmFsU3RhdGVNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaW50ZXJuYWwtc3RhdGUnKTtcblxudmFyIGVuZm9yY2VJbnRlcm5hbFN0YXRlID0gSW50ZXJuYWxTdGF0ZU1vZHVsZS5lbmZvcmNlO1xudmFyIGdldEludGVybmFsU3RhdGUgPSBJbnRlcm5hbFN0YXRlTW9kdWxlLmdldDtcbnZhciAkU3RyaW5nID0gU3RyaW5nO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1kZWZpbmVwcm9wZXJ0eSAtLSBzYWZlXG52YXIgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG52YXIgc3RyaW5nU2xpY2UgPSB1bmN1cnJ5VGhpcygnJy5zbGljZSk7XG52YXIgcmVwbGFjZSA9IHVuY3VycnlUaGlzKCcnLnJlcGxhY2UpO1xudmFyIGpvaW4gPSB1bmN1cnJ5VGhpcyhbXS5qb2luKTtcblxudmFyIENPTkZJR1VSQUJMRV9MRU5HVEggPSBERVNDUklQVE9SUyAmJiAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZGVmaW5lUHJvcGVydHkoZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9LCAnbGVuZ3RoJywgeyB2YWx1ZTogOCB9KS5sZW5ndGggIT09IDg7XG59KTtcblxudmFyIFRFTVBMQVRFID0gU3RyaW5nKFN0cmluZykuc3BsaXQoJ1N0cmluZycpO1xuXG52YXIgbWFrZUJ1aWx0SW4gPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh2YWx1ZSwgbmFtZSwgb3B0aW9ucykge1xuICBpZiAoc3RyaW5nU2xpY2UoJFN0cmluZyhuYW1lKSwgMCwgNykgPT09ICdTeW1ib2woJykge1xuICAgIG5hbWUgPSAnWycgKyByZXBsYWNlKCRTdHJpbmcobmFtZSksIC9eU3ltYm9sXFwoKFteKV0qKVxcKS8sICckMScpICsgJ10nO1xuICB9XG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZ2V0dGVyKSBuYW1lID0gJ2dldCAnICsgbmFtZTtcbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5zZXR0ZXIpIG5hbWUgPSAnc2V0ICcgKyBuYW1lO1xuICBpZiAoIWhhc093bih2YWx1ZSwgJ25hbWUnKSB8fCAoQ09ORklHVVJBQkxFX0ZVTkNUSU9OX05BTUUgJiYgdmFsdWUubmFtZSAhPT0gbmFtZSkpIHtcbiAgICBpZiAoREVTQ1JJUFRPUlMpIGRlZmluZVByb3BlcnR5KHZhbHVlLCAnbmFtZScsIHsgdmFsdWU6IG5hbWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9KTtcbiAgICBlbHNlIHZhbHVlLm5hbWUgPSBuYW1lO1xuICB9XG4gIGlmIChDT05GSUdVUkFCTEVfTEVOR1RIICYmIG9wdGlvbnMgJiYgaGFzT3duKG9wdGlvbnMsICdhcml0eScpICYmIHZhbHVlLmxlbmd0aCAhPT0gb3B0aW9ucy5hcml0eSkge1xuICAgIGRlZmluZVByb3BlcnR5KHZhbHVlLCAnbGVuZ3RoJywgeyB2YWx1ZTogb3B0aW9ucy5hcml0eSB9KTtcbiAgfVxuICB0cnkge1xuICAgIGlmIChvcHRpb25zICYmIGhhc093bihvcHRpb25zLCAnY29uc3RydWN0b3InKSAmJiBvcHRpb25zLmNvbnN0cnVjdG9yKSB7XG4gICAgICBpZiAoREVTQ1JJUFRPUlMpIGRlZmluZVByb3BlcnR5KHZhbHVlLCAncHJvdG90eXBlJywgeyB3cml0YWJsZTogZmFsc2UgfSk7XG4gICAgLy8gaW4gVjggfiBDaHJvbWUgNTMsIHByb3RvdHlwZXMgb2Ygc29tZSBtZXRob2RzLCBsaWtlIGBBcnJheS5wcm90b3R5cGUudmFsdWVzYCwgYXJlIG5vbi13cml0YWJsZVxuICAgIH0gZWxzZSBpZiAodmFsdWUucHJvdG90eXBlKSB2YWx1ZS5wcm90b3R5cGUgPSB1bmRlZmluZWQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgdmFyIHN0YXRlID0gZW5mb3JjZUludGVybmFsU3RhdGUodmFsdWUpO1xuICBpZiAoIWhhc093bihzdGF0ZSwgJ3NvdXJjZScpKSB7XG4gICAgc3RhdGUuc291cmNlID0gam9pbihURU1QTEFURSwgdHlwZW9mIG5hbWUgPT0gJ3N0cmluZycgPyBuYW1lIDogJycpO1xuICB9IHJldHVybiB2YWx1ZTtcbn07XG5cbi8vIGFkZCBmYWtlIEZ1bmN0aW9uI3RvU3RyaW5nIGZvciBjb3JyZWN0IHdvcmsgd3JhcHBlZCBtZXRob2RzIC8gY29uc3RydWN0b3JzIHdpdGggbWV0aG9kcyBsaWtlIExvRGFzaCBpc05hdGl2ZVxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWV4dGVuZC1uYXRpdmUgLS0gcmVxdWlyZWRcbkZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZyA9IG1ha2VCdWlsdEluKGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gaXNDYWxsYWJsZSh0aGlzKSAmJiBnZXRJbnRlcm5hbFN0YXRlKHRoaXMpLnNvdXJjZSB8fCBpbnNwZWN0U291cmNlKHRoaXMpO1xufSwgJ3RvU3RyaW5nJyk7XG4iLCJ2YXIgY2VpbCA9IE1hdGguY2VpbDtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5cbi8vIGBNYXRoLnRydW5jYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtbWF0aC50cnVuY1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW1hdGgtdHJ1bmMgLS0gc2FmZVxubW9kdWxlLmV4cG9ydHMgPSBNYXRoLnRydW5jIHx8IGZ1bmN0aW9uIHRydW5jKHgpIHtcbiAgdmFyIG4gPSAreDtcbiAgcmV0dXJuIChuID4gMCA/IGZsb29yIDogY2VpbCkobik7XG59O1xuIiwidmFyIHRvU3RyaW5nID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXN0cmluZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCwgJGRlZmF1bHQpIHtcbiAgcmV0dXJuIGFyZ3VtZW50ID09PSB1bmRlZmluZWQgPyBhcmd1bWVudHMubGVuZ3RoIDwgMiA/ICcnIDogJGRlZmF1bHQgOiB0b1N0cmluZyhhcmd1bWVudCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi1jYWxsJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBvYmplY3RLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1rZXlzJyk7XG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LXN5bWJvbHMnKTtcbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtcHJvcGVydHktaXMtZW51bWVyYWJsZScpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLW9iamVjdCcpO1xudmFyIEluZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaW5kZXhlZC1vYmplY3QnKTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1hc3NpZ24gLS0gc2FmZVxudmFyICRhc3NpZ24gPSBPYmplY3QuYXNzaWduO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1kZWZpbmVwcm9wZXJ0eSAtLSByZXF1aXJlZCBmb3IgdGVzdGluZ1xudmFyIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIGNvbmNhdCA9IHVuY3VycnlUaGlzKFtdLmNvbmNhdCk7XG5cbi8vIGBPYmplY3QuYXNzaWduYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LmFzc2lnblxubW9kdWxlLmV4cG9ydHMgPSAhJGFzc2lnbiB8fCBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIHNob3VsZCBoYXZlIGNvcnJlY3Qgb3JkZXIgb2Ygb3BlcmF0aW9ucyAoRWRnZSBidWcpXG4gIGlmIChERVNDUklQVE9SUyAmJiAkYXNzaWduKHsgYjogMSB9LCAkYXNzaWduKGRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgZGVmaW5lUHJvcGVydHkodGhpcywgJ2InLCB7XG4gICAgICAgIHZhbHVlOiAzLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICB9KSwgeyBiOiAyIH0pKS5iICE9PSAxKSByZXR1cm4gdHJ1ZTtcbiAgLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG4gIHZhciBBID0ge307XG4gIHZhciBCID0ge307XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1zeW1ib2wgLS0gc2FmZVxuICB2YXIgc3ltYm9sID0gU3ltYm9sKCk7XG4gIHZhciBhbHBoYWJldCA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdCc7XG4gIEFbc3ltYm9sXSA9IDc7XG4gIGFscGhhYmV0LnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChjaHIpIHsgQltjaHJdID0gY2hyOyB9KTtcbiAgcmV0dXJuICRhc3NpZ24oe30sIEEpW3N5bWJvbF0gIT0gNyB8fCBvYmplY3RLZXlzKCRhc3NpZ24oe30sIEIpKS5qb2luKCcnKSAhPSBhbHBoYWJldDtcbn0pID8gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnMgLS0gcmVxdWlyZWQgZm9yIGAubGVuZ3RoYFxuICB2YXIgVCA9IHRvT2JqZWN0KHRhcmdldCk7XG4gIHZhciBhcmd1bWVudHNMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICB2YXIgaW5kZXggPSAxO1xuICB2YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzTW9kdWxlLmY7XG4gIHZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IHByb3BlcnR5SXNFbnVtZXJhYmxlTW9kdWxlLmY7XG4gIHdoaWxlIChhcmd1bWVudHNMZW5ndGggPiBpbmRleCkge1xuICAgIHZhciBTID0gSW5kZXhlZE9iamVjdChhcmd1bWVudHNbaW5kZXgrK10pO1xuICAgIHZhciBrZXlzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzID8gY29uY2F0KG9iamVjdEtleXMoUyksIGdldE93blByb3BlcnR5U3ltYm9scyhTKSkgOiBvYmplY3RLZXlzKFMpO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgaiA9IDA7XG4gICAgdmFyIGtleTtcbiAgICB3aGlsZSAobGVuZ3RoID4gaikge1xuICAgICAga2V5ID0ga2V5c1tqKytdO1xuICAgICAgaWYgKCFERVNDUklQVE9SUyB8fCBjYWxsKHByb3BlcnR5SXNFbnVtZXJhYmxlLCBTLCBrZXkpKSBUW2tleV0gPSBTW2tleV07XG4gICAgfVxuICB9IHJldHVybiBUO1xufSA6ICRhc3NpZ247XG4iLCIvKiBnbG9iYWwgQWN0aXZlWE9iamVjdCAtLSBvbGQgSUUsIFdTSCAqL1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xudmFyIGRlZmluZVByb3BlcnRpZXNNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0aWVzJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW51bS1idWcta2V5cycpO1xudmFyIGhpZGRlbktleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGlkZGVuLWtleXMnKTtcbnZhciBodG1sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2h0bWwnKTtcbnZhciBkb2N1bWVudENyZWF0ZUVsZW1lbnQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZG9jdW1lbnQtY3JlYXRlLWVsZW1lbnQnKTtcbnZhciBzaGFyZWRLZXkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkLWtleScpO1xuXG52YXIgR1QgPSAnPic7XG52YXIgTFQgPSAnPCc7XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG52YXIgU0NSSVBUID0gJ3NjcmlwdCc7XG52YXIgSUVfUFJPVE8gPSBzaGFyZWRLZXkoJ0lFX1BST1RPJyk7XG5cbnZhciBFbXB0eUNvbnN0cnVjdG9yID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xuXG52YXIgc2NyaXB0VGFnID0gZnVuY3Rpb24gKGNvbnRlbnQpIHtcbiAgcmV0dXJuIExUICsgU0NSSVBUICsgR1QgKyBjb250ZW50ICsgTFQgKyAnLycgKyBTQ1JJUFQgKyBHVDtcbn07XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBBY3RpdmVYIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgTnVsbFByb3RvT2JqZWN0VmlhQWN0aXZlWCA9IGZ1bmN0aW9uIChhY3RpdmVYRG9jdW1lbnQpIHtcbiAgYWN0aXZlWERvY3VtZW50LndyaXRlKHNjcmlwdFRhZygnJykpO1xuICBhY3RpdmVYRG9jdW1lbnQuY2xvc2UoKTtcbiAgdmFyIHRlbXAgPSBhY3RpdmVYRG9jdW1lbnQucGFyZW50V2luZG93Lk9iamVjdDtcbiAgYWN0aXZlWERvY3VtZW50ID0gbnVsbDsgLy8gYXZvaWQgbWVtb3J5IGxlYWtcbiAgcmV0dXJuIHRlbXA7XG59O1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgTnVsbFByb3RvT2JqZWN0VmlhSUZyYW1lID0gZnVuY3Rpb24gKCkge1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gZG9jdW1lbnRDcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgdmFyIEpTID0gJ2phdmEnICsgU0NSSVBUICsgJzonO1xuICB2YXIgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICBodG1sLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy80NzVcbiAgaWZyYW1lLnNyYyA9IFN0cmluZyhKUyk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUoc2NyaXB0VGFnKCdkb2N1bWVudC5GPU9iamVjdCcpKTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgcmV0dXJuIGlmcmFtZURvY3VtZW50LkY7XG59O1xuXG4vLyBDaGVjayBmb3IgZG9jdW1lbnQuZG9tYWluIGFuZCBhY3RpdmUgeCBzdXBwb3J0XG4vLyBObyBuZWVkIHRvIHVzZSBhY3RpdmUgeCBhcHByb2FjaCB3aGVuIGRvY3VtZW50LmRvbWFpbiBpcyBub3Qgc2V0XG4vLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltL2lzc3Vlcy8xNTBcbi8vIHZhcmlhdGlvbiBvZiBodHRwczovL2dpdGh1Yi5jb20va2l0Y2FtYnJpZGdlL2VzNS1zaGltL2NvbW1pdC80ZjczOGFjMDY2MzQ2XG4vLyBhdm9pZCBJRSBHQyBidWdcbnZhciBhY3RpdmVYRG9jdW1lbnQ7XG52YXIgTnVsbFByb3RvT2JqZWN0ID0gZnVuY3Rpb24gKCkge1xuICB0cnkge1xuICAgIGFjdGl2ZVhEb2N1bWVudCA9IG5ldyBBY3RpdmVYT2JqZWN0KCdodG1sZmlsZScpO1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBpZ25vcmUgKi8gfVxuICBOdWxsUHJvdG9PYmplY3QgPSB0eXBlb2YgZG9jdW1lbnQgIT0gJ3VuZGVmaW5lZCdcbiAgICA/IGRvY3VtZW50LmRvbWFpbiAmJiBhY3RpdmVYRG9jdW1lbnRcbiAgICAgID8gTnVsbFByb3RvT2JqZWN0VmlhQWN0aXZlWChhY3RpdmVYRG9jdW1lbnQpIC8vIG9sZCBJRVxuICAgICAgOiBOdWxsUHJvdG9PYmplY3RWaWFJRnJhbWUoKVxuICAgIDogTnVsbFByb3RvT2JqZWN0VmlhQWN0aXZlWChhY3RpdmVYRG9jdW1lbnQpOyAvLyBXU0hcbiAgdmFyIGxlbmd0aCA9IGVudW1CdWdLZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSBkZWxldGUgTnVsbFByb3RvT2JqZWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbbGVuZ3RoXV07XG4gIHJldHVybiBOdWxsUHJvdG9PYmplY3QoKTtcbn07XG5cbmhpZGRlbktleXNbSUVfUFJPVE9dID0gdHJ1ZTtcblxuLy8gYE9iamVjdC5jcmVhdGVgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuY3JlYXRlXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWNyZWF0ZSAtLSBzYWZlXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKE8gIT09IG51bGwpIHtcbiAgICBFbXB0eUNvbnN0cnVjdG9yW1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHlDb25zdHJ1Y3RvcigpO1xuICAgIEVtcHR5Q29uc3RydWN0b3JbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gTnVsbFByb3RvT2JqZWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkZWZpbmVQcm9wZXJ0aWVzTW9kdWxlLmYocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG4iLCJ2YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBWOF9QUk9UT1RZUEVfREVGSU5FX0JVRyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy92OC1wcm90b3R5cGUtZGVmaW5lLWJ1ZycpO1xudmFyIGRlZmluZVByb3BlcnR5TW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciB0b0luZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QnKTtcbnZhciBvYmplY3RLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1rZXlzJyk7XG5cbi8vIGBPYmplY3QuZGVmaW5lUHJvcGVydGllc2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5kZWZpbmVwcm9wZXJ0aWVzXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWRlZmluZXByb3BlcnRpZXMgLS0gc2FmZVxuZXhwb3J0cy5mID0gREVTQ1JJUFRPUlMgJiYgIVY4X1BST1RPVFlQRV9ERUZJTkVfQlVHID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBwcm9wcyA9IHRvSW5kZXhlZE9iamVjdChQcm9wZXJ0aWVzKTtcbiAgdmFyIGtleXMgPSBvYmplY3RLZXlzKFByb3BlcnRpZXMpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBrZXk7XG4gIHdoaWxlIChsZW5ndGggPiBpbmRleCkgZGVmaW5lUHJvcGVydHlNb2R1bGUuZihPLCBrZXkgPSBrZXlzW2luZGV4KytdLCBwcm9wc1trZXldKTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaWU4LWRvbS1kZWZpbmUnKTtcbnZhciBWOF9QUk9UT1RZUEVfREVGSU5FX0JVRyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy92OC1wcm90b3R5cGUtZGVmaW5lLWJ1ZycpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xudmFyIHRvUHJvcGVydHlLZXkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tcHJvcGVydHkta2V5Jyk7XG5cbnZhciAkVHlwZUVycm9yID0gVHlwZUVycm9yO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1kZWZpbmVwcm9wZXJ0eSAtLSBzYWZlXG52YXIgJGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3IgLS0gc2FmZVxudmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIEVOVU1FUkFCTEUgPSAnZW51bWVyYWJsZSc7XG52YXIgQ09ORklHVVJBQkxFID0gJ2NvbmZpZ3VyYWJsZSc7XG52YXIgV1JJVEFCTEUgPSAnd3JpdGFibGUnO1xuXG4vLyBgT2JqZWN0LmRlZmluZVByb3BlcnR5YCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LmRlZmluZXByb3BlcnR5XG5leHBvcnRzLmYgPSBERVNDUklQVE9SUyA/IFY4X1BST1RPVFlQRV9ERUZJTkVfQlVHID8gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcykge1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJvcGVydHlLZXkoUCk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAodHlwZW9mIE8gPT09ICdmdW5jdGlvbicgJiYgUCA9PT0gJ3Byb3RvdHlwZScgJiYgJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzICYmIFdSSVRBQkxFIGluIEF0dHJpYnV0ZXMgJiYgIUF0dHJpYnV0ZXNbV1JJVEFCTEVdKSB7XG4gICAgdmFyIGN1cnJlbnQgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApO1xuICAgIGlmIChjdXJyZW50ICYmIGN1cnJlbnRbV1JJVEFCTEVdKSB7XG4gICAgICBPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgICAgIEF0dHJpYnV0ZXMgPSB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogQ09ORklHVVJBQkxFIGluIEF0dHJpYnV0ZXMgPyBBdHRyaWJ1dGVzW0NPTkZJR1VSQUJMRV0gOiBjdXJyZW50W0NPTkZJR1VSQUJMRV0sXG4gICAgICAgIGVudW1lcmFibGU6IEVOVU1FUkFCTEUgaW4gQXR0cmlidXRlcyA/IEF0dHJpYnV0ZXNbRU5VTUVSQUJMRV0gOiBjdXJyZW50W0VOVU1FUkFCTEVdLFxuICAgICAgICB3cml0YWJsZTogZmFsc2VcbiAgICAgIH07XG4gICAgfVxuICB9IHJldHVybiAkZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyk7XG59IDogJGRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcykge1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJvcGVydHlLZXkoUCk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuICRkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKSB0aHJvdyAkVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCcpO1xuICBpZiAoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKSBPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi1jYWxsJyk7XG52YXIgcHJvcGVydHlJc0VudW1lcmFibGVNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LXByb3BlcnR5LWlzLWVudW1lcmFibGUnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcbnZhciB0b0luZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QnKTtcbnZhciB0b1Byb3BlcnR5S2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXByb3BlcnR5LWtleScpO1xudmFyIGhhc093biA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5Jyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaWU4LWRvbS1kZWZpbmUnKTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3IgLS0gc2FmZVxudmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG4vLyBgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcmAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3JcbmV4cG9ydHMuZiA9IERFU0NSSVBUT1JTID8gJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKSB7XG4gIE8gPSB0b0luZGV4ZWRPYmplY3QoTyk7XG4gIFAgPSB0b1Byb3BlcnR5S2V5KFApO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKGhhc093bihPLCBQKSkgcmV0dXJuIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcighY2FsbChwcm9wZXJ0eUlzRW51bWVyYWJsZU1vZHVsZS5mLCBPLCBQKSwgT1tQXSk7XG59O1xuIiwidmFyIGludGVybmFsT2JqZWN0S2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VudW0tYnVnLWtleXMnKTtcblxudmFyIGhpZGRlbktleXMgPSBlbnVtQnVnS2V5cy5jb25jYXQoJ2xlbmd0aCcsICdwcm90b3R5cGUnKTtcblxuLy8gYE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LmdldG93bnByb3BlcnR5bmFtZXNcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZ2V0b3ducHJvcGVydHluYW1lcyAtLSBzYWZlXG5leHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKE8pIHtcbiAgcmV0dXJuIGludGVybmFsT2JqZWN0S2V5cyhPLCBoaWRkZW5LZXlzKTtcbn07XG4iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldG93bnByb3BlcnR5c3ltYm9scyAtLSBzYWZlXG5leHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuIiwidmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVuY3VycnlUaGlzKHt9LmlzUHJvdG90eXBlT2YpO1xuIiwidmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcycpO1xudmFyIGhhc093biA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5Jyk7XG52YXIgdG9JbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0Jyk7XG52YXIgaW5kZXhPZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1pbmNsdWRlcycpLmluZGV4T2Y7XG52YXIgaGlkZGVuS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oaWRkZW4ta2V5cycpO1xuXG52YXIgcHVzaCA9IHVuY3VycnlUaGlzKFtdLnB1c2gpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWVzKSB7XG4gIHZhciBPID0gdG9JbmRleGVkT2JqZWN0KG9iamVjdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBPKSAhaGFzT3duKGhpZGRlbktleXMsIGtleSkgJiYgaGFzT3duKE8sIGtleSkgJiYgcHVzaChyZXN1bHQsIGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIGlmIChoYXNPd24oTywga2V5ID0gbmFtZXNbaSsrXSkpIHtcbiAgICB+aW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcHVzaChyZXN1bHQsIGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCJ2YXIgaW50ZXJuYWxPYmplY3RLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1rZXlzLWludGVybmFsJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW51bS1idWcta2V5cycpO1xuXG4vLyBgT2JqZWN0LmtleXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3Qua2V5c1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1rZXlzIC0tIHNhZmVcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKSB7XG4gIHJldHVybiBpbnRlcm5hbE9iamVjdEtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkcHJvcGVydHlJc0VudW1lcmFibGUgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZ2V0b3ducHJvcGVydHlkZXNjcmlwdG9yIC0tIHNhZmVcbnZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG4vLyBOYXNob3JuIH4gSkRLOCBidWdcbnZhciBOQVNIT1JOX0JVRyA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvciAmJiAhJHByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwoeyAxOiAyIH0sIDEpO1xuXG4vLyBgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZWAgbWV0aG9kIGltcGxlbWVudGF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5wcm90b3R5cGUucHJvcGVydHlpc2VudW1lcmFibGVcbmV4cG9ydHMuZiA9IE5BU0hPUk5fQlVHID8gZnVuY3Rpb24gcHJvcGVydHlJc0VudW1lcmFibGUoVikge1xuICB2YXIgZGVzY3JpcHRvciA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0aGlzLCBWKTtcbiAgcmV0dXJuICEhZGVzY3JpcHRvciAmJiBkZXNjcmlwdG9yLmVudW1lcmFibGU7XG59IDogJHByb3BlcnR5SXNFbnVtZXJhYmxlO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIFRPX1NUUklOR19UQUdfU1VQUE9SVCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1zdHJpbmctdGFnLXN1cHBvcnQnKTtcbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NsYXNzb2YnKTtcblxuLy8gYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgIG1ldGhvZCBpbXBsZW1lbnRhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IFRPX1NUUklOR19UQUdfU1VQUE9SVCA/IHt9LnRvU3RyaW5nIDogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiAnW29iamVjdCAnICsgY2xhc3NvZih0aGlzKSArICddJztcbn07XG4iLCJ2YXIgY2FsbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi1jYWxsJyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xuXG52YXIgJFR5cGVFcnJvciA9IFR5cGVFcnJvcjtcblxuLy8gYE9yZGluYXJ5VG9QcmltaXRpdmVgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vcmRpbmFyeXRvcHJpbWl0aXZlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbnB1dCwgcHJlZikge1xuICB2YXIgZm4sIHZhbDtcbiAgaWYgKHByZWYgPT09ICdzdHJpbmcnICYmIGlzQ2FsbGFibGUoZm4gPSBpbnB1dC50b1N0cmluZykgJiYgIWlzT2JqZWN0KHZhbCA9IGNhbGwoZm4sIGlucHV0KSkpIHJldHVybiB2YWw7XG4gIGlmIChpc0NhbGxhYmxlKGZuID0gaW5wdXQudmFsdWVPZikgJiYgIWlzT2JqZWN0KHZhbCA9IGNhbGwoZm4sIGlucHV0KSkpIHJldHVybiB2YWw7XG4gIGlmIChwcmVmICE9PSAnc3RyaW5nJyAmJiBpc0NhbGxhYmxlKGZuID0gaW5wdXQudG9TdHJpbmcpICYmICFpc09iamVjdCh2YWwgPSBjYWxsKGZuLCBpbnB1dCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyAkVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTtcbiIsInZhciBnZXRCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1idWlsdC1pbicpO1xudmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcycpO1xudmFyIGdldE93blByb3BlcnR5TmFtZXNNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktbmFtZXMnKTtcbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHNNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktc3ltYm9scycpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xuXG52YXIgY29uY2F0ID0gdW5jdXJyeVRoaXMoW10uY29uY2F0KTtcblxuLy8gYWxsIG9iamVjdCBrZXlzLCBpbmNsdWRlcyBub24tZW51bWVyYWJsZSBhbmQgc3ltYm9sc1xubW9kdWxlLmV4cG9ydHMgPSBnZXRCdWlsdEluKCdSZWZsZWN0JywgJ293bktleXMnKSB8fCBmdW5jdGlvbiBvd25LZXlzKGl0KSB7XG4gIHZhciBrZXlzID0gZ2V0T3duUHJvcGVydHlOYW1lc01vZHVsZS5mKGFuT2JqZWN0KGl0KSk7XG4gIHZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHNNb2R1bGUuZjtcbiAgcmV0dXJuIGdldE93blByb3BlcnR5U3ltYm9scyA/IGNvbmNhdChrZXlzLCBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoaXQpKSA6IGtleXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xuXG4vLyBgUmVnRXhwLnByb3RvdHlwZS5mbGFnc2AgZ2V0dGVyIGltcGxlbWVudGF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWdldC1yZWdleHAucHJvdG90eXBlLmZsYWdzXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHRoYXQgPSBhbk9iamVjdCh0aGlzKTtcbiAgdmFyIHJlc3VsdCA9ICcnO1xuICBpZiAodGhhdC5oYXNJbmRpY2VzKSByZXN1bHQgKz0gJ2QnO1xuICBpZiAodGhhdC5nbG9iYWwpIHJlc3VsdCArPSAnZyc7XG4gIGlmICh0aGF0Lmlnbm9yZUNhc2UpIHJlc3VsdCArPSAnaSc7XG4gIGlmICh0aGF0Lm11bHRpbGluZSkgcmVzdWx0ICs9ICdtJztcbiAgaWYgKHRoYXQuZG90QWxsKSByZXN1bHQgKz0gJ3MnO1xuICBpZiAodGhhdC51bmljb2RlKSByZXN1bHQgKz0gJ3UnO1xuICBpZiAodGhhdC51bmljb2RlU2V0cykgcmVzdWx0ICs9ICd2JztcbiAgaWYgKHRoYXQuc3RpY2t5KSByZXN1bHQgKz0gJ3knO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsInZhciBjYWxsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLWNhbGwnKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIGlzUHJvdG90eXBlT2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWlzLXByb3RvdHlwZS1vZicpO1xudmFyIHJlZ0V4cEZsYWdzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZ2V4cC1mbGFncycpO1xuXG52YXIgUmVnRXhwUHJvdG90eXBlID0gUmVnRXhwLnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoUikge1xuICB2YXIgZmxhZ3MgPSBSLmZsYWdzO1xuICByZXR1cm4gZmxhZ3MgPT09IHVuZGVmaW5lZCAmJiAhKCdmbGFncycgaW4gUmVnRXhwUHJvdG90eXBlKSAmJiAhaGFzT3duKFIsICdmbGFncycpICYmIGlzUHJvdG90eXBlT2YoUmVnRXhwUHJvdG90eXBlLCBSKVxuICAgID8gY2FsbChyZWdFeHBGbGFncywgUikgOiBmbGFncztcbn07XG4iLCJ2YXIgaXNOdWxsT3JVbmRlZmluZWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtbnVsbC1vci11bmRlZmluZWQnKTtcblxudmFyICRUeXBlRXJyb3IgPSBUeXBlRXJyb3I7XG5cbi8vIGBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtcmVxdWlyZW9iamVjdGNvZXJjaWJsZVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGlzTnVsbE9yVW5kZWZpbmVkKGl0KSkgdGhyb3cgJFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdWlkJyk7XG5cbnZhciBrZXlzID0gc2hhcmVkKCdrZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4ga2V5c1trZXldIHx8IChrZXlzW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBkZWZpbmVHbG9iYWxQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZWZpbmUtZ2xvYmFsLXByb3BlcnR5Jyk7XG5cbnZhciBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJztcbnZhciBzdG9yZSA9IGdsb2JhbFtTSEFSRURdIHx8IGRlZmluZUdsb2JhbFByb3BlcnR5KFNIQVJFRCwge30pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JlO1xuIiwidmFyIElTX1BVUkUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtcHVyZScpO1xudmFyIHN0b3JlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1zdG9yZScpO1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHt9KTtcbn0pKCd2ZXJzaW9ucycsIFtdKS5wdXNoKHtcbiAgdmVyc2lvbjogJzMuMzAuMScsXG4gIG1vZGU6IElTX1BVUkUgPyAncHVyZScgOiAnZ2xvYmFsJyxcbiAgY29weXJpZ2h0OiAnwqkgMjAxNC0yMDIzIERlbmlzIFB1c2hrYXJldiAoemxvaXJvY2sucnUpJyxcbiAgbGljZW5zZTogJ2h0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2Jsb2IvdjMuMzAuMS9MSUNFTlNFJyxcbiAgc291cmNlOiAnaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMnXG59KTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIGVzL25vLXN5bWJvbCAtLSByZXF1aXJlZCBmb3IgdGVzdGluZyAqL1xudmFyIFY4X1ZFUlNJT04gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW5naW5lLXY4LXZlcnNpb24nKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldG93bnByb3BlcnR5c3ltYm9scyAtLSByZXF1aXJlZCBmb3IgdGVzdGluZ1xubW9kdWxlLmV4cG9ydHMgPSAhIU9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHN5bWJvbCA9IFN5bWJvbCgpO1xuICAvLyBDaHJvbWUgMzggU3ltYm9sIGhhcyBpbmNvcnJlY3QgdG9TdHJpbmcgY29udmVyc2lvblxuICAvLyBgZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzYCBwb2x5ZmlsbCBzeW1ib2xzIGNvbnZlcnRlZCB0byBvYmplY3QgYXJlIG5vdCBTeW1ib2wgaW5zdGFuY2VzXG4gIHJldHVybiAhU3RyaW5nKHN5bWJvbCkgfHwgIShPYmplY3Qoc3ltYm9sKSBpbnN0YW5jZW9mIFN5bWJvbCkgfHxcbiAgICAvLyBDaHJvbWUgMzgtNDAgc3ltYm9scyBhcmUgbm90IGluaGVyaXRlZCBmcm9tIERPTSBjb2xsZWN0aW9ucyBwcm90b3R5cGVzIHRvIGluc3RhbmNlc1xuICAgICFTeW1ib2wuc2hhbSAmJiBWOF9WRVJTSU9OICYmIFY4X1ZFUlNJT04gPCA0MTtcbn0pO1xuIiwidmFyIHRvSW50ZWdlck9ySW5maW5pdHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW50ZWdlci1vci1pbmZpbml0eScpO1xuXG52YXIgbWF4ID0gTWF0aC5tYXg7XG52YXIgbWluID0gTWF0aC5taW47XG5cbi8vIEhlbHBlciBmb3IgYSBwb3B1bGFyIHJlcGVhdGluZyBjYXNlIG9mIHRoZSBzcGVjOlxuLy8gTGV0IGludGVnZXIgYmUgPyBUb0ludGVnZXIoaW5kZXgpLlxuLy8gSWYgaW50ZWdlciA8IDAsIGxldCByZXN1bHQgYmUgbWF4KChsZW5ndGggKyBpbnRlZ2VyKSwgMCk7IGVsc2UgbGV0IHJlc3VsdCBiZSBtaW4oaW50ZWdlciwgbGVuZ3RoKS5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgdmFyIGludGVnZXIgPSB0b0ludGVnZXJPckluZmluaXR5KGluZGV4KTtcbiAgcmV0dXJuIGludGVnZXIgPCAwID8gbWF4KGludGVnZXIgKyBsZW5ndGgsIDApIDogbWluKGludGVnZXIsIGxlbmd0aCk7XG59O1xuIiwiLy8gdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luZGV4ZWQtb2JqZWN0Jyk7XG52YXIgcmVxdWlyZU9iamVjdENvZXJjaWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIEluZGV4ZWRPYmplY3QocmVxdWlyZU9iamVjdENvZXJjaWJsZShpdCkpO1xufTtcbiIsInZhciB0cnVuYyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9tYXRoLXRydW5jJyk7XG5cbi8vIGBUb0ludGVnZXJPckluZmluaXR5YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9pbnRlZ2Vyb3JpbmZpbml0eVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgdmFyIG51bWJlciA9ICthcmd1bWVudDtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZSAtLSBOYU4gY2hlY2tcbiAgcmV0dXJuIG51bWJlciAhPT0gbnVtYmVyIHx8IG51bWJlciA9PT0gMCA/IDAgOiB0cnVuYyhudW1iZXIpO1xufTtcbiIsInZhciB0b0ludGVnZXJPckluZmluaXR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWludGVnZXItb3ItaW5maW5pdHknKTtcblxudmFyIG1pbiA9IE1hdGgubWluO1xuXG4vLyBgVG9MZW5ndGhgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10b2xlbmd0aFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgcmV0dXJuIGFyZ3VtZW50ID4gMCA/IG1pbih0b0ludGVnZXJPckluZmluaXR5KGFyZ3VtZW50KSwgMHgxRkZGRkZGRkZGRkZGRikgOiAwOyAvLyAyICoqIDUzIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuIiwidmFyIHJlcXVpcmVPYmplY3RDb2VyY2libGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlJyk7XG5cbnZhciAkT2JqZWN0ID0gT2JqZWN0O1xuXG4vLyBgVG9PYmplY3RgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10b29iamVjdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgcmV0dXJuICRPYmplY3QocmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudCkpO1xufTtcbiIsInZhciBjYWxsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLWNhbGwnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBpc1N5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1zeW1ib2wnKTtcbnZhciBnZXRNZXRob2QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2V0LW1ldGhvZCcpO1xudmFyIG9yZGluYXJ5VG9QcmltaXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb3JkaW5hcnktdG8tcHJpbWl0aXZlJyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciAkVHlwZUVycm9yID0gVHlwZUVycm9yO1xudmFyIFRPX1BSSU1JVElWRSA9IHdlbGxLbm93blN5bWJvbCgndG9QcmltaXRpdmUnKTtcblxuLy8gYFRvUHJpbWl0aXZlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9wcmltaXRpdmVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGlucHV0LCBwcmVmKSB7XG4gIGlmICghaXNPYmplY3QoaW5wdXQpIHx8IGlzU3ltYm9sKGlucHV0KSkgcmV0dXJuIGlucHV0O1xuICB2YXIgZXhvdGljVG9QcmltID0gZ2V0TWV0aG9kKGlucHV0LCBUT19QUklNSVRJVkUpO1xuICB2YXIgcmVzdWx0O1xuICBpZiAoZXhvdGljVG9QcmltKSB7XG4gICAgaWYgKHByZWYgPT09IHVuZGVmaW5lZCkgcHJlZiA9ICdkZWZhdWx0JztcbiAgICByZXN1bHQgPSBjYWxsKGV4b3RpY1RvUHJpbSwgaW5wdXQsIHByZWYpO1xuICAgIGlmICghaXNPYmplY3QocmVzdWx0KSB8fCBpc1N5bWJvbChyZXN1bHQpKSByZXR1cm4gcmVzdWx0O1xuICAgIHRocm93ICRUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG4gIH1cbiAgaWYgKHByZWYgPT09IHVuZGVmaW5lZCkgcHJlZiA9ICdudW1iZXInO1xuICByZXR1cm4gb3JkaW5hcnlUb1ByaW1pdGl2ZShpbnB1dCwgcHJlZik7XG59O1xuIiwidmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXByaW1pdGl2ZScpO1xudmFyIGlzU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLXN5bWJvbCcpO1xuXG4vLyBgVG9Qcm9wZXJ0eUtleWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvcHJvcGVydHlrZXlcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHZhciBrZXkgPSB0b1ByaW1pdGl2ZShhcmd1bWVudCwgJ3N0cmluZycpO1xuICByZXR1cm4gaXNTeW1ib2woa2V5KSA/IGtleSA6IGtleSArICcnO1xufTtcbiIsInZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcblxudmFyIFRPX1NUUklOR19UQUcgPSB3ZWxsS25vd25TeW1ib2woJ3RvU3RyaW5nVGFnJyk7XG52YXIgdGVzdCA9IHt9O1xuXG50ZXN0W1RPX1NUUklOR19UQUddID0gJ3onO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0cmluZyh0ZXN0KSA9PT0gJ1tvYmplY3Qgel0nO1xuIiwidmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY2xhc3NvZicpO1xuXG52YXIgJFN0cmluZyA9IFN0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgaWYgKGNsYXNzb2YoYXJndW1lbnQpID09PSAnU3ltYm9sJykgdGhyb3cgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCBhIFN5bWJvbCB2YWx1ZSB0byBhIHN0cmluZycpO1xuICByZXR1cm4gJFN0cmluZyhhcmd1bWVudCk7XG59O1xuIiwidmFyICRTdHJpbmcgPSBTdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICRTdHJpbmcoYXJndW1lbnQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiAnT2JqZWN0JztcbiAgfVxufTtcbiIsInZhciB1bmN1cnJ5VGhpcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMnKTtcblxudmFyIGlkID0gMDtcbnZhciBwb3N0Zml4ID0gTWF0aC5yYW5kb20oKTtcbnZhciB0b1N0cmluZyA9IHVuY3VycnlUaGlzKDEuMC50b1N0cmluZyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnICsgKGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXkpICsgJylfJyArIHRvU3RyaW5nKCsraWQgKyBwb3N0Zml4LCAzNik7XG59O1xuIiwiLyogZXNsaW50LWRpc2FibGUgZXMvbm8tc3ltYm9sIC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nICovXG52YXIgTkFUSVZFX1NZTUJPTCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zeW1ib2wtY29uc3RydWN0b3ItZGV0ZWN0aW9uJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gTkFUSVZFX1NZTUJPTFxuICAmJiAhU3ltYm9sLnNoYW1cbiAgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PSAnc3ltYm9sJztcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbi8vIFY4IH4gQ2hyb21lIDM2LVxuLy8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzMzNFxubW9kdWxlLmV4cG9ydHMgPSBERVNDUklQVE9SUyAmJiBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZGVmaW5lcHJvcGVydHkgLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmdcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH0sICdwcm90b3R5cGUnLCB7XG4gICAgdmFsdWU6IDQyLFxuICAgIHdyaXRhYmxlOiBmYWxzZVxuICB9KS5wcm90b3R5cGUgIT0gNDI7XG59KTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xuXG52YXIgV2Vha01hcCA9IGdsb2JhbC5XZWFrTWFwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQ2FsbGFibGUoV2Vha01hcCkgJiYgL25hdGl2ZSBjb2RlLy50ZXN0KFN0cmluZyhXZWFrTWFwKSk7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQnKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91aWQnKTtcbnZhciBOQVRJVkVfU1lNQk9MID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3N5bWJvbC1jb25zdHJ1Y3Rvci1kZXRlY3Rpb24nKTtcbnZhciBVU0VfU1lNQk9MX0FTX1VJRCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91c2Utc3ltYm9sLWFzLXVpZCcpO1xuXG52YXIgU3ltYm9sID0gZ2xvYmFsLlN5bWJvbDtcbnZhciBXZWxsS25vd25TeW1ib2xzU3RvcmUgPSBzaGFyZWQoJ3drcycpO1xudmFyIGNyZWF0ZVdlbGxLbm93blN5bWJvbCA9IFVTRV9TWU1CT0xfQVNfVUlEID8gU3ltYm9sWydmb3InXSB8fCBTeW1ib2wgOiBTeW1ib2wgJiYgU3ltYm9sLndpdGhvdXRTZXR0ZXIgfHwgdWlkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIGlmICghaGFzT3duKFdlbGxLbm93blN5bWJvbHNTdG9yZSwgbmFtZSkpIHtcbiAgICBXZWxsS25vd25TeW1ib2xzU3RvcmVbbmFtZV0gPSBOQVRJVkVfU1lNQk9MICYmIGhhc093bihTeW1ib2wsIG5hbWUpXG4gICAgICA/IFN5bWJvbFtuYW1lXVxuICAgICAgOiBjcmVhdGVXZWxsS25vd25TeW1ib2woJ1N5bWJvbC4nICsgbmFtZSk7XG4gIH0gcmV0dXJuIFdlbGxLbm93blN5bWJvbHNTdG9yZVtuYW1lXTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBmb3JFYWNoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWZvci1lYWNoJyk7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUuZm9yRWFjaGAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5mb3JlYWNoXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tYXJyYXktcHJvdG90eXBlLWZvcmVhY2ggLS0gc2FmZVxuJCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogW10uZm9yRWFjaCAhPSBmb3JFYWNoIH0sIHtcbiAgZm9yRWFjaDogZm9yRWFjaFxufSk7XG4iLCIvLyBUT0RPOiBSZW1vdmUgZnJvbSBgY29yZS1qc0A0YFxudmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcycpO1xudmFyIGRlZmluZUJ1aWx0SW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVmaW5lLWJ1aWx0LWluJyk7XG5cbnZhciBEYXRlUHJvdG90eXBlID0gRGF0ZS5wcm90b3R5cGU7XG52YXIgSU5WQUxJRF9EQVRFID0gJ0ludmFsaWQgRGF0ZSc7XG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciBuYXRpdmVEYXRlVG9TdHJpbmcgPSB1bmN1cnJ5VGhpcyhEYXRlUHJvdG90eXBlW1RPX1NUUklOR10pO1xudmFyIHRoaXNUaW1lVmFsdWUgPSB1bmN1cnJ5VGhpcyhEYXRlUHJvdG90eXBlLmdldFRpbWUpO1xuXG4vLyBgRGF0ZS5wcm90b3R5cGUudG9TdHJpbmdgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1kYXRlLnByb3RvdHlwZS50b3N0cmluZ1xuaWYgKFN0cmluZyhuZXcgRGF0ZShOYU4pKSAhPSBJTlZBTElEX0RBVEUpIHtcbiAgZGVmaW5lQnVpbHRJbihEYXRlUHJvdG90eXBlLCBUT19TVFJJTkcsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHZhciB2YWx1ZSA9IHRoaXNUaW1lVmFsdWUodGhpcyk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZSAtLSBOYU4gY2hlY2tcbiAgICByZXR1cm4gdmFsdWUgPT09IHZhbHVlID8gbmF0aXZlRGF0ZVRvU3RyaW5nKHRoaXMpIDogSU5WQUxJRF9EQVRFO1xuICB9KTtcbn1cbiIsInZhciBkZWZpbmVCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RlZmluZS1idWlsdC1pbicpO1xudmFyIGVycm9yVG9TdHJpbmcgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXJyb3ItdG8tc3RyaW5nJyk7XG5cbnZhciBFcnJvclByb3RvdHlwZSA9IEVycm9yLnByb3RvdHlwZTtcblxuLy8gYEVycm9yLnByb3RvdHlwZS50b1N0cmluZ2AgbWV0aG9kIGZpeFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1lcnJvci5wcm90b3R5cGUudG9zdHJpbmdcbmlmIChFcnJvclByb3RvdHlwZS50b1N0cmluZyAhPT0gZXJyb3JUb1N0cmluZykge1xuICBkZWZpbmVCdWlsdEluKEVycm9yUHJvdG90eXBlLCAndG9TdHJpbmcnLCBlcnJvclRvU3RyaW5nKTtcbn1cbiIsInZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtYXNzaWduJyk7XG5cbi8vIGBPYmplY3QuYXNzaWduYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LmFzc2lnblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1hc3NpZ24gLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmdcbiQoeyB0YXJnZXQ6ICdPYmplY3QnLCBzdGF0OiB0cnVlLCBhcml0eTogMiwgZm9yY2VkOiBPYmplY3QuYXNzaWduICE9PSBhc3NpZ24gfSwge1xuICBhc3NpZ246IGFzc2lnblxufSk7XG4iLCJ2YXIgVE9fU1RSSU5HX1RBR19TVVBQT1JUID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXN0cmluZy10YWctc3VwcG9ydCcpO1xudmFyIGRlZmluZUJ1aWx0SW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVmaW5lLWJ1aWx0LWluJyk7XG52YXIgdG9TdHJpbmcgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LXRvLXN0cmluZycpO1xuXG4vLyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmdcbmlmICghVE9fU1RSSU5HX1RBR19TVVBQT1JUKSB7XG4gIGRlZmluZUJ1aWx0SW4oT2JqZWN0LnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgdG9TdHJpbmcsIHsgdW5zYWZlOiB0cnVlIH0pO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIFBST1BFUl9GVU5DVElPTl9OQU1FID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLW5hbWUnKS5QUk9QRVI7XG52YXIgZGVmaW5lQnVpbHRJbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZWZpbmUtYnVpbHQtaW4nKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciAkdG9TdHJpbmcgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tc3RyaW5nJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBnZXRSZWdFeHBGbGFncyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWdleHAtZ2V0LWZsYWdzJyk7XG5cbnZhciBUT19TVFJJTkcgPSAndG9TdHJpbmcnO1xudmFyIFJlZ0V4cFByb3RvdHlwZSA9IFJlZ0V4cC5wcm90b3R5cGU7XG52YXIgbmF0aXZlVG9TdHJpbmcgPSBSZWdFeHBQcm90b3R5cGVbVE9fU1RSSU5HXTtcblxudmFyIE5PVF9HRU5FUklDID0gZmFpbHMoZnVuY3Rpb24gKCkgeyByZXR1cm4gbmF0aXZlVG9TdHJpbmcuY2FsbCh7IHNvdXJjZTogJ2EnLCBmbGFnczogJ2InIH0pICE9ICcvYS9iJzsgfSk7XG4vLyBGRjQ0LSBSZWdFeHAjdG9TdHJpbmcgaGFzIGEgd3JvbmcgbmFtZVxudmFyIElOQ09SUkVDVF9OQU1FID0gUFJPUEVSX0ZVTkNUSU9OX05BTUUgJiYgbmF0aXZlVG9TdHJpbmcubmFtZSAhPSBUT19TVFJJTkc7XG5cbi8vIGBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtcmVnZXhwLnByb3RvdHlwZS50b3N0cmluZ1xuaWYgKE5PVF9HRU5FUklDIHx8IElOQ09SUkVDVF9OQU1FKSB7XG4gIGRlZmluZUJ1aWx0SW4oUmVnRXhwLnByb3RvdHlwZSwgVE9fU1RSSU5HLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICB2YXIgUiA9IGFuT2JqZWN0KHRoaXMpO1xuICAgIHZhciBwYXR0ZXJuID0gJHRvU3RyaW5nKFIuc291cmNlKTtcbiAgICB2YXIgZmxhZ3MgPSAkdG9TdHJpbmcoZ2V0UmVnRXhwRmxhZ3MoUikpO1xuICAgIHJldHVybiAnLycgKyBwYXR0ZXJuICsgJy8nICsgZmxhZ3M7XG4gIH0sIHsgdW5zYWZlOiB0cnVlIH0pO1xufVxuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBET01JdGVyYWJsZXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZG9tLWl0ZXJhYmxlcycpO1xudmFyIERPTVRva2VuTGlzdFByb3RvdHlwZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kb20tdG9rZW4tbGlzdC1wcm90b3R5cGUnKTtcbnZhciBmb3JFYWNoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWZvci1lYWNoJyk7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xuXG52YXIgaGFuZGxlUHJvdG90eXBlID0gZnVuY3Rpb24gKENvbGxlY3Rpb25Qcm90b3R5cGUpIHtcbiAgLy8gc29tZSBDaHJvbWUgdmVyc2lvbnMgaGF2ZSBub24tY29uZmlndXJhYmxlIG1ldGhvZHMgb24gRE9NVG9rZW5MaXN0XG4gIGlmIChDb2xsZWN0aW9uUHJvdG90eXBlICYmIENvbGxlY3Rpb25Qcm90b3R5cGUuZm9yRWFjaCAhPT0gZm9yRWFjaCkgdHJ5IHtcbiAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoQ29sbGVjdGlvblByb3RvdHlwZSwgJ2ZvckVhY2gnLCBmb3JFYWNoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBDb2xsZWN0aW9uUHJvdG90eXBlLmZvckVhY2ggPSBmb3JFYWNoO1xuICB9XG59O1xuXG5mb3IgKHZhciBDT0xMRUNUSU9OX05BTUUgaW4gRE9NSXRlcmFibGVzKSB7XG4gIGlmIChET01JdGVyYWJsZXNbQ09MTEVDVElPTl9OQU1FXSkge1xuICAgIGhhbmRsZVByb3RvdHlwZShnbG9iYWxbQ09MTEVDVElPTl9OQU1FXSAmJiBnbG9iYWxbQ09MTEVDVElPTl9OQU1FXS5wcm90b3R5cGUpO1xuICB9XG59XG5cbmhhbmRsZVByb3RvdHlwZShET01Ub2tlbkxpc3RQcm90b3R5cGUpO1xuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0ICcuL3N0eWxlcy9qcy9mb3Jtcy9mb3JtLXR5cGUtY29sb3IuanMnOyJdLCJuYW1lcyI6WyJQaWNrciIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwiZWwiLCJzdHlsZSIsImJhY2tncm91bmRDb2xvciIsInZhbHVlIiwicGlja3JPcHRpb25zIiwiSlNPTiIsInBhcnNlIiwiZ2V0QXR0cmlidXRlIiwicGlja3IiLCJPYmplY3QiLCJhc3NpZ24iLCJvbiIsImNvbG9yIiwiaW5zdGFuY2UiLCJoZXhhIiwidG9IRVhBIiwidG9TdHJpbmciLCJsZW5ndGgiLCJjb2xvclJnYmEiLCJ0b1JHQkEiLCJNYXRoIiwic3FydCJdLCJzb3VyY2VSb290IjoiIn0=