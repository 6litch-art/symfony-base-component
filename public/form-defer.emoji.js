/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/styles/js/forms/form-type-emoji.js":
/*!***************************************************!*\
  !*** ./assets/styles/js/forms/form-type-emoji.js ***!
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
/* harmony import */ var _picmo_popup_picker__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @picmo/popup-picker */ "./node_modules/@picmo/popup-picker/dist/index.js");
/* harmony import */ var picmo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! picmo */ "./node_modules/picmo/dist/index.js");





window.addEventListener("load.form_type", function () {
  document.querySelectorAll("[data-emoji-field]").forEach(function (el) {
    var pickerOptions = {
      theme: picmo__WEBPACK_IMPORTED_MODULE_4__.autoTheme
    };
    var popupOptions = {
      triggerElement: el,
      referenceElement: el
    };
    var popup = (0,_picmo_popup_picker__WEBPACK_IMPORTED_MODULE_3__.createPopup)(pickerOptions, popupOptions);
    popup.addEventListener('emoji:select', function (event) {
      el.value = event.emoji;
    });
    el.addEventListener("click", function () {
      popup.toggle();
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

/***/ "./node_modules/@picmo/popup-picker/dist/index.js":
/*!********************************************************!*\
  !*** ./node_modules/@picmo/popup-picker/dist/index.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PopupPickerController": () => (/* binding */ le),
/* harmony export */   "createPopup": () => (/* binding */ de)
/* harmony export */ });
/* harmony import */ var picmo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! picmo */ "./node_modules/picmo/dist/index.js");

function V(t) {
  return t.split("-")[0];
}
function N(t) {
  return t.split("-")[1];
}
function K(t) {
  return ["top", "bottom"].includes(V(t)) ? "x" : "y";
}
function at(t) {
  return t === "y" ? "height" : "width";
}
function tt(t, e, n) {
  let {
    reference: i,
    floating: o
  } = t;
  const c = i.x + i.width / 2 - o.width / 2, r = i.y + i.height / 2 - o.height / 2, s = K(e), l = at(s), a = i[l] / 2 - o[l] / 2, d = V(e), f = s === "x";
  let u;
  switch (d) {
    case "top":
      u = {
        x: c,
        y: i.y - o.height
      };
      break;
    case "bottom":
      u = {
        x: c,
        y: i.y + i.height
      };
      break;
    case "right":
      u = {
        x: i.x + i.width,
        y: r
      };
      break;
    case "left":
      u = {
        x: i.x - o.width,
        y: r
      };
      break;
    default:
      u = {
        x: i.x,
        y: i.y
      };
  }
  switch (N(e)) {
    case "start":
      u[s] -= a * (n && f ? -1 : 1);
      break;
    case "end":
      u[s] += a * (n && f ? -1 : 1);
      break;
  }
  return u;
}
const Pt = async (t, e, n) => {
  const {
    placement: i = "bottom",
    strategy: o = "absolute",
    middleware: c = [],
    platform: r
  } = n, s = await (r.isRTL == null ? void 0 : r.isRTL(e));
  let l = await r.getElementRects({
    reference: t,
    floating: e,
    strategy: o
  }), {
    x: a,
    y: d
  } = tt(l, i, s), f = i, u = {}, p = 0;
  for (let m = 0; m < c.length; m++) {
    const {
      name: h,
      fn: w
    } = c[m], {
      x: y,
      y: g,
      data: v,
      reset: x
    } = await w({
      x: a,
      y: d,
      initialPlacement: i,
      placement: f,
      strategy: o,
      middlewareData: u,
      rects: l,
      platform: r,
      elements: {
        reference: t,
        floating: e
      }
    });
    if (a = y != null ? y : a, d = g != null ? g : d, u = {
      ...u,
      [h]: {
        ...u[h],
        ...v
      }
    }, x && p <= 50) {
      p++, typeof x == "object" && (x.placement && (f = x.placement), x.rects && (l = x.rects === !0 ? await r.getElementRects({
        reference: t,
        floating: e,
        strategy: o
      }) : x.rects), {
        x: a,
        y: d
      } = tt(l, f, s)), m = -1;
      continue;
    }
  }
  return {
    x: a,
    y: d,
    placement: f,
    strategy: o,
    middlewareData: u
  };
};
function At(t) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...t
  };
}
function Lt(t) {
  return typeof t != "number" ? At(t) : {
    top: t,
    right: t,
    bottom: t,
    left: t
  };
}
function I(t) {
  return {
    ...t,
    top: t.y,
    left: t.x,
    right: t.x + t.width,
    bottom: t.y + t.height
  };
}
async function Q(t, e) {
  var n;
  e === void 0 && (e = {});
  const {
    x: i,
    y: o,
    platform: c,
    rects: r,
    elements: s,
    strategy: l
  } = t, {
    boundary: a = "clippingAncestors",
    rootBoundary: d = "viewport",
    elementContext: f = "floating",
    altBoundary: u = !1,
    padding: p = 0
  } = e, m = Lt(p), w = s[u ? f === "floating" ? "reference" : "floating" : f], y = I(await c.getClippingRect({
    element: (n = await (c.isElement == null ? void 0 : c.isElement(w))) == null || n ? w : w.contextElement || await (c.getDocumentElement == null ? void 0 : c.getDocumentElement(s.floating)),
    boundary: a,
    rootBoundary: d,
    strategy: l
  })), g = I(c.convertOffsetParentRelativeRectToViewportRelativeRect ? await c.convertOffsetParentRelativeRectToViewportRelativeRect({
    rect: f === "floating" ? {
      ...r.floating,
      x: i,
      y: o
    } : r.reference,
    offsetParent: await (c.getOffsetParent == null ? void 0 : c.getOffsetParent(s.floating)),
    strategy: l
  }) : r[f]);
  return {
    top: y.top - g.top + m.top,
    bottom: g.bottom - y.bottom + m.bottom,
    left: y.left - g.left + m.left,
    right: g.right - y.right + m.right
  };
}
const Ot = Math.min, Rt = Math.max;
function et(t, e, n) {
  return Rt(t, Ot(e, n));
}
const kt = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function z(t) {
  return t.replace(/left|right|bottom|top/g, (e) => kt[e]);
}
function ft(t, e, n) {
  n === void 0 && (n = !1);
  const i = N(t), o = K(t), c = at(o);
  let r = o === "x" ? i === (n ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return e.reference[c] > e.floating[c] && (r = z(r)), {
    main: r,
    cross: z(r)
  };
}
const Tt = {
  start: "end",
  end: "start"
};
function G(t) {
  return t.replace(/start|end/g, (e) => Tt[e]);
}
const Bt = ["top", "right", "bottom", "left"], St = /* @__PURE__ */ Bt.reduce((t, e) => t.concat(e, e + "-start", e + "-end"), []);
function Dt(t, e, n) {
  return (t ? [...n.filter((o) => N(o) === t), ...n.filter((o) => N(o) !== t)] : n.filter((o) => V(o) === o)).filter((o) => t ? N(o) === t || (e ? G(o) !== o : !1) : !0);
}
const Vt = function(t) {
  return t === void 0 && (t = {}), {
    name: "autoPlacement",
    options: t,
    async fn(e) {
      var n, i, o, c, r;
      const {
        x: s,
        y: l,
        rects: a,
        middlewareData: d,
        placement: f,
        platform: u,
        elements: p
      } = e, {
        alignment: m = null,
        allowedPlacements: h = St,
        autoAlignment: w = !0,
        ...y
      } = t, g = Dt(m, w, h), v = await Q(e, y), x = (n = (i = d.autoPlacement) == null ? void 0 : i.index) != null ? n : 0, b = g[x];
      if (b == null)
        return {};
      const {
        main: H,
        cross: j
      } = ft(b, a, await (u.isRTL == null ? void 0 : u.isRTL(p.floating)));
      if (f !== b)
        return {
          x: s,
          y: l,
          reset: {
            placement: g[0]
          }
        };
      const _ = [v[V(b)], v[H], v[j]], E = [...(o = (c = d.autoPlacement) == null ? void 0 : c.overflows) != null ? o : [], {
        placement: b,
        overflows: _
      }], B = g[x + 1];
      if (B)
        return {
          data: {
            index: x + 1,
            overflows: E
          },
          reset: {
            placement: B
          }
        };
      const S = E.slice().sort((A, W) => A.overflows[0] - W.overflows[0]), $ = (r = S.find((A) => {
        let {
          overflows: W
        } = A;
        return W.every((yt) => yt <= 0);
      })) == null ? void 0 : r.placement, D = $ != null ? $ : S[0].placement;
      return D !== f ? {
        data: {
          index: x + 1,
          overflows: E
        },
        reset: {
          placement: D
        }
      } : {};
    }
  };
};
function Nt(t) {
  const e = z(t);
  return [G(t), e, G(e)];
}
const Ft = function(t) {
  return t === void 0 && (t = {}), {
    name: "flip",
    options: t,
    async fn(e) {
      var n;
      const {
        placement: i,
        middlewareData: o,
        rects: c,
        initialPlacement: r,
        platform: s,
        elements: l
      } = e, {
        mainAxis: a = !0,
        crossAxis: d = !0,
        fallbackPlacements: f,
        fallbackStrategy: u = "bestFit",
        flipAlignment: p = !0,
        ...m
      } = t, h = V(i), y = f || (h === r || !p ? [z(r)] : Nt(r)), g = [r, ...y], v = await Q(e, m), x = [];
      let b = ((n = o.flip) == null ? void 0 : n.overflows) || [];
      if (a && x.push(v[h]), d) {
        const {
          main: E,
          cross: B
        } = ft(i, c, await (s.isRTL == null ? void 0 : s.isRTL(l.floating)));
        x.push(v[E], v[B]);
      }
      if (b = [...b, {
        placement: i,
        overflows: x
      }], !x.every((E) => E <= 0)) {
        var H, j;
        const E = ((H = (j = o.flip) == null ? void 0 : j.index) != null ? H : 0) + 1, B = g[E];
        if (B)
          return {
            data: {
              index: E,
              overflows: b
            },
            reset: {
              placement: B
            }
          };
        let S = "bottom";
        switch (u) {
          case "bestFit": {
            var _;
            const $ = (_ = b.map((D) => [D, D.overflows.filter((A) => A > 0).reduce((A, W) => A + W, 0)]).sort((D, A) => D[1] - A[1])[0]) == null ? void 0 : _[0].placement;
            $ && (S = $);
            break;
          }
          case "initialPlacement":
            S = r;
            break;
        }
        if (i !== S)
          return {
            reset: {
              placement: S
            }
          };
      }
      return {};
    }
  };
};
async function $t(t, e) {
  const {
    placement: n,
    platform: i,
    elements: o
  } = t, c = await (i.isRTL == null ? void 0 : i.isRTL(o.floating)), r = V(n), s = N(n), l = K(n) === "x", a = ["left", "top"].includes(r) ? -1 : 1, d = c && l ? -1 : 1, f = typeof e == "function" ? e(t) : e;
  let {
    mainAxis: u,
    crossAxis: p,
    alignmentAxis: m
  } = typeof f == "number" ? {
    mainAxis: f,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: 0,
    crossAxis: 0,
    alignmentAxis: null,
    ...f
  };
  return s && typeof m == "number" && (p = s === "end" ? m * -1 : m), l ? {
    x: p * d,
    y: u * a
  } : {
    x: u * a,
    y: p * d
  };
}
const nt = function(t) {
  return t === void 0 && (t = 0), {
    name: "offset",
    options: t,
    async fn(e) {
      const {
        x: n,
        y: i
      } = e, o = await $t(e, t);
      return {
        x: n + o.x,
        y: i + o.y,
        data: o
      };
    }
  };
};
function Wt(t) {
  return t === "x" ? "y" : "x";
}
const ot = function(t) {
  return t === void 0 && (t = {}), {
    name: "shift",
    options: t,
    async fn(e) {
      const {
        x: n,
        y: i,
        placement: o
      } = e, {
        mainAxis: c = !0,
        crossAxis: r = !1,
        limiter: s = {
          fn: (w) => {
            let {
              x: y,
              y: g
            } = w;
            return {
              x: y,
              y: g
            };
          }
        },
        ...l
      } = t, a = {
        x: n,
        y: i
      }, d = await Q(e, l), f = K(V(o)), u = Wt(f);
      let p = a[f], m = a[u];
      if (c) {
        const w = f === "y" ? "top" : "left", y = f === "y" ? "bottom" : "right", g = p + d[w], v = p - d[y];
        p = et(g, p, v);
      }
      if (r) {
        const w = u === "y" ? "top" : "left", y = u === "y" ? "bottom" : "right", g = m + d[w], v = m - d[y];
        m = et(g, m, v);
      }
      const h = s.fn({
        ...e,
        [f]: p,
        [u]: m
      });
      return {
        ...h,
        data: {
          x: h.x - n,
          y: h.y - i
        }
      };
    }
  };
};
function ut(t) {
  return t && t.document && t.location && t.alert && t.setInterval;
}
function R(t) {
  if (t == null)
    return window;
  if (!ut(t)) {
    const e = t.ownerDocument;
    return e && e.defaultView || window;
  }
  return t;
}
function C(t) {
  return R(t).getComputedStyle(t);
}
function L(t) {
  return ut(t) ? "" : t ? (t.nodeName || "").toLowerCase() : "";
}
function dt() {
  const t = navigator.userAgentData;
  return t != null && t.brands ? t.brands.map((e) => e.brand + "/" + e.version).join(" ") : navigator.userAgent;
}
function P(t) {
  return t instanceof R(t).HTMLElement;
}
function k(t) {
  return t instanceof R(t).Element;
}
function Mt(t) {
  return t instanceof R(t).Node;
}
function F(t) {
  if (typeof ShadowRoot > "u")
    return !1;
  const e = R(t).ShadowRoot;
  return t instanceof e || t instanceof ShadowRoot;
}
function U(t) {
  const {
    overflow: e,
    overflowX: n,
    overflowY: i
  } = C(t);
  return /auto|scroll|overlay|hidden/.test(e + i + n);
}
function Ht(t) {
  return ["table", "td", "th"].includes(L(t));
}
function ht(t) {
  const e = /firefox/i.test(dt()), n = C(t);
  return n.transform !== "none" || n.perspective !== "none" || n.contain === "paint" || ["transform", "perspective"].includes(n.willChange) || e && n.willChange === "filter" || e && (n.filter ? n.filter !== "none" : !1);
}
function pt() {
  return !/^((?!chrome|android).)*safari/i.test(dt());
}
const it = Math.min, M = Math.max, X = Math.round;
function O(t, e, n) {
  var i, o, c, r;
  e === void 0 && (e = !1), n === void 0 && (n = !1);
  const s = t.getBoundingClientRect();
  let l = 1, a = 1;
  e && P(t) && (l = t.offsetWidth > 0 && X(s.width) / t.offsetWidth || 1, a = t.offsetHeight > 0 && X(s.height) / t.offsetHeight || 1);
  const d = k(t) ? R(t) : window, f = !pt() && n, u = (s.left + (f && (i = (o = d.visualViewport) == null ? void 0 : o.offsetLeft) != null ? i : 0)) / l, p = (s.top + (f && (c = (r = d.visualViewport) == null ? void 0 : r.offsetTop) != null ? c : 0)) / a, m = s.width / l, h = s.height / a;
  return {
    width: m,
    height: h,
    top: p,
    right: u + m,
    bottom: p + h,
    left: u,
    x: u,
    y: p
  };
}
function T(t) {
  return ((Mt(t) ? t.ownerDocument : t.document) || window.document).documentElement;
}
function q(t) {
  return k(t) ? {
    scrollLeft: t.scrollLeft,
    scrollTop: t.scrollTop
  } : {
    scrollLeft: t.pageXOffset,
    scrollTop: t.pageYOffset
  };
}
function mt(t) {
  return O(T(t)).left + q(t).scrollLeft;
}
function jt(t) {
  const e = O(t);
  return X(e.width) !== t.offsetWidth || X(e.height) !== t.offsetHeight;
}
function _t(t, e, n) {
  const i = P(e), o = T(e), c = O(
    t,
    i && jt(e),
    n === "fixed"
  );
  let r = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const s = {
    x: 0,
    y: 0
  };
  if (i || !i && n !== "fixed")
    if ((L(e) !== "body" || U(o)) && (r = q(e)), P(e)) {
      const l = O(e, !0);
      s.x = l.x + e.clientLeft, s.y = l.y + e.clientTop;
    } else
      o && (s.x = mt(o));
  return {
    x: c.left + r.scrollLeft - s.x,
    y: c.top + r.scrollTop - s.y,
    width: c.width,
    height: c.height
  };
}
function gt(t) {
  return L(t) === "html" ? t : t.assignedSlot || t.parentNode || (F(t) ? t.host : null) || T(t);
}
function st(t) {
  return !P(t) || C(t).position === "fixed" ? null : It(t);
}
function It(t) {
  let {
    offsetParent: e
  } = t, n = t, i = !1;
  for (; n && n !== e; ) {
    const {
      assignedSlot: o
    } = n;
    if (o) {
      let c = o.offsetParent;
      if (C(o).display === "contents") {
        const r = o.hasAttribute("style"), s = o.style.display;
        o.style.display = C(n).display, c = o.offsetParent, o.style.display = s, r || o.removeAttribute("style");
      }
      n = o, e !== c && (e = c, i = !0);
    } else if (F(n) && n.host && i)
      break;
    n = F(n) && n.host || n.parentNode;
  }
  return e;
}
function zt(t) {
  let e = gt(t);
  for (F(e) && (e = e.host); P(e) && !["html", "body"].includes(L(e)); ) {
    if (ht(e))
      return e;
    {
      const n = e.parentNode;
      e = F(n) ? n.host : n;
    }
  }
  return null;
}
function J(t) {
  const e = R(t);
  let n = st(t);
  for (; n && Ht(n) && C(n).position === "static"; )
    n = st(n);
  return n && (L(n) === "html" || L(n) === "body" && C(n).position === "static" && !ht(n)) ? e : n || zt(t) || e;
}
function rt(t) {
  if (P(t))
    return {
      width: t.offsetWidth,
      height: t.offsetHeight
    };
  const e = O(t);
  return {
    width: e.width,
    height: e.height
  };
}
function Xt(t) {
  let {
    rect: e,
    offsetParent: n,
    strategy: i
  } = t;
  const o = P(n), c = T(n);
  if (n === c)
    return e;
  let r = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const s = {
    x: 0,
    y: 0
  };
  if ((o || !o && i !== "fixed") && ((L(n) !== "body" || U(c)) && (r = q(n)), P(n))) {
    const l = O(n, !0);
    s.x = l.x + n.clientLeft, s.y = l.y + n.clientTop;
  }
  return {
    ...e,
    x: e.x - r.scrollLeft + s.x,
    y: e.y - r.scrollTop + s.y
  };
}
function Yt(t, e) {
  const n = R(t), i = T(t), o = n.visualViewport;
  let c = i.clientWidth, r = i.clientHeight, s = 0, l = 0;
  if (o) {
    c = o.width, r = o.height;
    const a = pt();
    (a || !a && e === "fixed") && (s = o.offsetLeft, l = o.offsetTop);
  }
  return {
    width: c,
    height: r,
    x: s,
    y: l
  };
}
function Kt(t) {
  var e;
  const n = T(t), i = q(t), o = (e = t.ownerDocument) == null ? void 0 : e.body, c = M(n.scrollWidth, n.clientWidth, o ? o.scrollWidth : 0, o ? o.clientWidth : 0), r = M(n.scrollHeight, n.clientHeight, o ? o.scrollHeight : 0, o ? o.clientHeight : 0);
  let s = -i.scrollLeft + mt(t);
  const l = -i.scrollTop;
  return C(o || n).direction === "rtl" && (s += M(n.clientWidth, o ? o.clientWidth : 0) - c), {
    width: c,
    height: r,
    x: s,
    y: l
  };
}
function wt(t) {
  const e = gt(t);
  return ["html", "body", "#document"].includes(L(e)) ? t.ownerDocument.body : P(e) && U(e) ? e : wt(e);
}
function Y(t, e) {
  var n;
  e === void 0 && (e = []);
  const i = wt(t), o = i === ((n = t.ownerDocument) == null ? void 0 : n.body), c = R(i), r = o ? [c].concat(c.visualViewport || [], U(i) ? i : []) : i, s = e.concat(r);
  return o ? s : s.concat(Y(r));
}
function Ut(t, e) {
  const n = e.getRootNode == null ? void 0 : e.getRootNode();
  if (t.contains(e))
    return !0;
  if (n && F(n)) {
    let i = e;
    do {
      if (i && t === i)
        return !0;
      i = i.parentNode || i.host;
    } while (i);
  }
  return !1;
}
function qt(t, e) {
  const n = O(t, !1, e === "fixed"), i = n.top + t.clientTop, o = n.left + t.clientLeft;
  return {
    top: i,
    left: o,
    x: o,
    y: i,
    right: o + t.clientWidth,
    bottom: i + t.clientHeight,
    width: t.clientWidth,
    height: t.clientHeight
  };
}
function ct(t, e, n) {
  return e === "viewport" ? I(Yt(t, n)) : k(e) ? qt(e, n) : I(Kt(T(t)));
}
function Gt(t) {
  const e = Y(t), i = ["absolute", "fixed"].includes(C(t).position) && P(t) ? J(t) : t;
  return k(i) ? e.filter((o) => k(o) && Ut(o, i) && L(o) !== "body") : [];
}
function Jt(t) {
  let {
    element: e,
    boundary: n,
    rootBoundary: i,
    strategy: o
  } = t;
  const r = [...n === "clippingAncestors" ? Gt(e) : [].concat(n), i], s = r[0], l = r.reduce((a, d) => {
    const f = ct(e, d, o);
    return a.top = M(f.top, a.top), a.right = it(f.right, a.right), a.bottom = it(f.bottom, a.bottom), a.left = M(f.left, a.left), a;
  }, ct(e, s, o));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
const Qt = {
  getClippingRect: Jt,
  convertOffsetParentRelativeRectToViewportRelativeRect: Xt,
  isElement: k,
  getDimensions: rt,
  getOffsetParent: J,
  getDocumentElement: T,
  getElementRects: (t) => {
    let {
      reference: e,
      floating: n,
      strategy: i
    } = t;
    return {
      reference: _t(e, J(n), i),
      floating: {
        ...rt(n),
        x: 0,
        y: 0
      }
    };
  },
  getClientRects: (t) => Array.from(t.getClientRects()),
  isRTL: (t) => C(t).direction === "rtl"
};
function Zt(t, e, n, i) {
  i === void 0 && (i = {});
  const {
    ancestorScroll: o = !0,
    ancestorResize: c = !0,
    elementResize: r = !0,
    animationFrame: s = !1
  } = i, l = o && !s, a = c && !s, d = l || a ? [...k(t) ? Y(t) : [], ...Y(e)] : [];
  d.forEach((h) => {
    l && h.addEventListener("scroll", n, {
      passive: !0
    }), a && h.addEventListener("resize", n);
  });
  let f = null;
  if (r) {
    let h = !0;
    f = new ResizeObserver(() => {
      h || n(), h = !1;
    }), k(t) && !s && f.observe(t), f.observe(e);
  }
  let u, p = s ? O(t) : null;
  s && m();
  function m() {
    const h = O(t);
    p && (h.x !== p.x || h.y !== p.y || h.width !== p.width || h.height !== p.height) && n(), p = h, u = requestAnimationFrame(m);
  }
  return n(), () => {
    var h;
    d.forEach((w) => {
      l && w.removeEventListener("scroll", n), a && w.removeEventListener("resize", n);
    }), (h = f) == null || h.disconnect(), f = null, s && cancelAnimationFrame(u);
  };
}
const te = (t, e, n) => Pt(t, e, {
  platform: Qt,
  ...n
});
async function ee(t, e, n, i) {
  if (!i)
    throw new Error("Must provide a positioning option");
  return await (typeof i == "string" ? ne(t, e, n, i) : oe(e, i));
}
async function ne(t, e, n, i) {
  if (!n)
    throw new Error("Reference element is required for relative positioning");
  let o;
  return i === "auto" ? o = {
    middleware: [
      Vt(),
      ot(),
      nt({ mainAxis: 5, crossAxis: 12 })
    ]
  } : o = {
    placement: i,
    middleware: [
      Ft(),
      ot(),
      nt(5)
    ]
  }, Zt(n, e, async () => {
    if ((!n.isConnected || !n.offsetParent) && ie(t))
      return;
    const { x: c, y: r } = await te(n, e, o);
    Object.assign(e.style, {
      position: "absolute",
      left: `${c}px`,
      top: `${r}px`
    });
  });
}
function oe(t, e) {
  return t.style.position = "fixed", Object.entries(e).forEach(([n, i]) => {
    t.style[n] = i;
  }), () => {
  };
}
function ie(t) {
  switch (t.options.onPositionLost) {
    case "close":
      return t.close(), !0;
    case "destroy":
      return t.destroy(), !0;
    case "hold":
      return !0;
  }
}
const se = {
  hideOnClickOutside: !0,
  hideOnEmojiSelect: !0,
  hideOnEscape: !0,
  position: "auto",
  showCloseButton: !0,
  onPositionLost: "none"
};
function re(t = {}) {
  return {
    ...se,
    rootElement: document.body,
    ...t
  };
}
const ce = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>', lt = {
  popupContainer: "popupContainer",
  closeButton: "closeButton"
};
class le {
  constructor(e, n) {
    this.isOpen = !1, this.externalEvents = new picmo__WEBPACK_IMPORTED_MODULE_0__.Events(), this.options = { ...re(n), ...(0,picmo__WEBPACK_IMPORTED_MODULE_0__.getOptions)(e) }, this.popupEl = document.createElement("div"), this.popupEl.classList.add(lt.popupContainer), this.popupEl.classList.add(this.options.theme), n.className && this.popupEl.classList.add(n.className), this.options.showCloseButton && (this.closeButton = document.createElement("button"), this.closeButton.type = "button", this.closeButton.classList.add(lt.closeButton), this.closeButton.innerHTML = ce, this.closeButton.addEventListener("click", () => {
      this.close();
    }), this.popupEl.appendChild(this.closeButton));
    const i = document.createElement("div");
    this.popupEl.appendChild(i), this.picker = (0,picmo__WEBPACK_IMPORTED_MODULE_0__.createPicker)({ ...this.options, rootElement: i }), this.focusTrap = new picmo__WEBPACK_IMPORTED_MODULE_0__.FocusTrap(), this.picker.addEventListener("data:ready", () => {
      this.focusTrap.activate(this.picker.el), this.picker.setInitialFocus();
    }), this.options.hideOnEmojiSelect && this.picker.addEventListener("emoji:select", () => {
      var o;
      this.close(), (o = this.triggerElement) == null || o.focus();
    }), this.options.hideOnClickOutside && (this.onDocumentClick = this.onDocumentClick.bind(this), document.addEventListener("click", this.onDocumentClick)), this.options.hideOnEscape && (this.handleKeydown = this.handleKeydown.bind(this), this.popupEl.addEventListener("keydown", this.handleKeydown)), this.referenceElement = this.options.referenceElement, this.triggerElement = this.options.triggerElement;
  }
  addEventListener(e, n) {
    this.externalEvents.on(e, n), this.picker.addEventListener(e, n);
  }
  removeEventListener(e, n) {
    this.externalEvents.off(e, n), this.picker.removeEventListener(e, n);
  }
  handleKeydown(e) {
    var n;
    e.key === "Escape" && (this.close(), (n = this.triggerElement) == null || n.focus());
  }
  async destroy() {
    this.isOpen && await this.close(), document.removeEventListener("click", this.onDocumentClick), this.picker.destroy(), this.externalEvents.removeAll();
  }
  toggle(e) {
    return this.isOpen ? this.close() : this.open(e);
  }
  async open({ triggerElement: e, referenceElement: n } = {}) {
    this.isOpen || (e && (this.triggerElement = e), n && (this.referenceElement = n), await this.initiateOpenStateChange(!0), this.popupEl.style.opacity = "0", this.options.rootElement.appendChild(this.popupEl), await this.setPosition(), this.picker.reset(!1), await this.animatePopup(!0), await this.animateCloseButton(!0), this.picker.setInitialFocus(), this.externalEvents.emit("picker:open"));
  }
  async close() {
    var e;
    !this.isOpen || (await this.initiateOpenStateChange(!1), await this.animateCloseButton(!1), await this.animatePopup(!1), this.popupEl.remove(), this.picker.reset(), (e = this.positionCleanup) == null || e.call(this), this.focusTrap.deactivate(), this.externalEvents.emit("picker:close"));
  }
  getRunningAnimations() {
    return this.picker.el.getAnimations().filter((e) => e.playState === "running");
  }
  async setPosition() {
    var e;
    (e = this.positionCleanup) == null || e.call(this), this.positionCleanup = await ee(
      this,
      this.popupEl,
      this.referenceElement,
      this.options.position
    );
  }
  awaitPendingAnimations() {
    return Promise.all(this.getRunningAnimations().map((e) => e.finished));
  }
  onDocumentClick(e) {
    var o;
    const n = e.target, i = (o = this.triggerElement) == null ? void 0 : o.contains(n);
    this.isOpen && !this.picker.isPickerClick(e) && !i && this.close();
  }
  animatePopup(e) {
    return (0,picmo__WEBPACK_IMPORTED_MODULE_0__.animate)(
      this.popupEl,
      {
        opacity: [0, 1],
        transform: ["scale(0.9)", "scale(1)"]
      },
      {
        duration: 150,
        id: e ? "show-picker" : "hide-picker",
        easing: "ease-in-out",
        direction: e ? "normal" : "reverse",
        fill: "both"
      },
      this.options
    );
  }
  animateCloseButton(e) {
    if (this.closeButton)
      return (0,picmo__WEBPACK_IMPORTED_MODULE_0__.animate)(
        this.closeButton,
        {
          opacity: [0, 1]
        },
        {
          duration: 25,
          id: e ? "show-close" : "hide-close",
          easing: "ease-in-out",
          direction: e ? "normal" : "reverse",
          fill: "both"
        },
        this.options
      );
  }
  async initiateOpenStateChange(e) {
    this.isOpen = e, await this.awaitPendingAnimations();
  }
}
const ae = `.popupContainer{display:flex;flex-direction:column;position:absolute}.popupContainer .closeButton{position:absolute;opacity:0;background:transparent;border:none;z-index:1;right:0;top:0;cursor:pointer;padding:4px;align-self:flex-end;transform:translate(50%,-50%);background:#999999;width:1.5rem;height:1.5rem;display:flex;align-items:center;justify-content:center;border-radius:50%}.popupContainer .closeButton:hover{background:var(--accent-color)}.popupContainer .closeButton svg{fill:#fff;width:1.25rem;height:1.25rem}
`, fe = (0,picmo__WEBPACK_IMPORTED_MODULE_0__.createStyleInjector)();
function de(t, e) {
  return fe(ae), new le({
    autoFocus: "auto",
    ...t
  }, e);
}



/***/ }),

/***/ "./node_modules/picmo/dist/index.js":
/*!******************************************!*\
  !*** ./node_modules/picmo/dist/index.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EmojiPicker": () => (/* binding */ gs),
/* harmony export */   "Events": () => (/* binding */ ae),
/* harmony export */   "FocusTrap": () => (/* binding */ Ue),
/* harmony export */   "InMemoryStoreFactory": () => (/* binding */ Es),
/* harmony export */   "IndexedDbStoreFactory": () => (/* binding */ Ee),
/* harmony export */   "LocalStorageProvider": () => (/* binding */ Ct),
/* harmony export */   "NativeRenderer": () => (/* binding */ pt),
/* harmony export */   "RecentsProvider": () => (/* binding */ bt),
/* harmony export */   "Renderer": () => (/* binding */ ut),
/* harmony export */   "SessionStorageProvider": () => (/* binding */ Fs),
/* harmony export */   "animate": () => (/* binding */ I),
/* harmony export */   "autoTheme": () => (/* binding */ $s),
/* harmony export */   "caseInsensitiveIncludes": () => (/* binding */ he),
/* harmony export */   "computeHash": () => (/* binding */ Ve),
/* harmony export */   "createDatabase": () => (/* binding */ As),
/* harmony export */   "createPicker": () => (/* binding */ Ls),
/* harmony export */   "createStyleInjector": () => (/* binding */ vs),
/* harmony export */   "darkTheme": () => (/* binding */ zs),
/* harmony export */   "debounce": () => (/* binding */ Re),
/* harmony export */   "deleteDatabase": () => (/* binding */ Ps),
/* harmony export */   "en": () => (/* binding */ yt),
/* harmony export */   "getEmojiForEvent": () => (/* binding */ U),
/* harmony export */   "getOptions": () => (/* binding */ kt),
/* harmony export */   "getPrefixedClasses": () => (/* binding */ g),
/* harmony export */   "globalConfig": () => (/* binding */ Et),
/* harmony export */   "lightTheme": () => (/* binding */ Ke),
/* harmony export */   "prefixClassName": () => (/* binding */ oe),
/* harmony export */   "shouldAnimate": () => (/* binding */ be),
/* harmony export */   "throttle": () => (/* binding */ Te),
/* harmony export */   "toElement": () => (/* binding */ J)
/* harmony export */ });
var O = (i, e, t) => {
  if (!e.has(i))
    throw TypeError("Cannot " + t);
};
var y = (i, e, t) => (O(i, e, "read from private field"), t ? t.call(i) : e.get(i)), f = (i, e, t) => {
  if (e.has(i))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(i) : e.set(i, t);
}, A = (i, e, t, s) => (O(i, e, "write to private field"), s ? s.call(i, t) : e.set(i, t), t);
var p = (i, e, t) => (O(i, e, "access private method"), t);
const $e = "14.0";
function Le(i, e, t) {
  let s = `https://cdn.jsdelivr.net/npm/emojibase-data@${e}/${i}`;
  return typeof t == "function" ? s = t(i, e) : typeof t == "string" && (s = `${t}/${i}`), s;
}
async function ie(i, e = {}) {
  const {
    local: t = !1,
    version: s = "latest",
    cdnUrl: o,
    ...r
  } = e, a = Le(i, s, o), n = t ? localStorage : sessionStorage, l = `emojibase/${s}/${i}`, m = n.getItem(l);
  if (m)
    return Promise.resolve(JSON.parse(m));
  const d = await fetch(a, {
    credentials: "omit",
    mode: "cors",
    redirect: "error",
    ...r
  });
  if (!d.ok)
    throw new Error("Failed to load Emojibase dataset.");
  const h = await d.json();
  try {
    n.setItem(l, JSON.stringify(h));
  } catch {
  }
  return h;
}
const Fe = {
  discord: "joypixels",
  slack: "iamcal"
};
async function le(i, e, t) {
  var s;
  return ie(`${i}/shortcodes/${(s = Fe[e]) !== null && s !== void 0 ? s : e}.json`, t);
}
function k(i, e) {
  if (e.length === 0)
    return i;
  const t = new Set(i.shortcodes);
  return e.forEach((s) => {
    const o = s[i.hexcode];
    Array.isArray(o) ? o.forEach((r) => t.add(r)) : o && t.add(o);
  }), i.shortcodes = [...t], i.skins && i.skins.forEach((s) => {
    k(s, e);
  }), i;
}
function Ae(i, e = []) {
  const t = [];
  return i.forEach((s) => {
    if (s.skins) {
      const {
        skins: o,
        ...r
      } = s;
      t.push(k(r, e)), o.forEach((a) => {
        const n = {
          ...a
        };
        r.tags && (n.tags = [...r.tags]), t.push(k(n, e));
      });
    } else
      t.push(k(s, e));
  }), t;
}
function Ie(i, e) {
  return e.length === 0 || i.forEach((t) => {
    k(t, e);
  }), i;
}
async function ve(i, e = {}) {
  const {
    compact: t = !1,
    flat: s = !1,
    shortcodes: o = [],
    ...r
  } = e, a = await ie(`${i}/${t ? "compact" : "data"}.json`, r);
  let n = [];
  return o.length > 0 && (n = await Promise.all(o.map((l) => {
    let m;
    if (l.includes("/")) {
      const [d, h] = l.split("/");
      m = le(d, h, r);
    } else
      m = le(i, l, r);
    return m.catch(() => ({}));
  }))), s ? Ae(a, n) : Ie(a, n);
}
async function we(i, e) {
  return ie(`${i}/messages.json`, e);
}
function U(i, e) {
  const s = i.target.closest("[data-emoji]");
  if (s) {
    const o = e.find((r) => r.emoji === s.dataset.emoji);
    if (o)
      return o;
  }
  return null;
}
function be(i) {
  var t;
  const e = (t = window.matchMedia) == null ? void 0 : t.call(window, "(prefers-reduced-motion: reduce)");
  return i.animate && !(e != null && e.matches);
}
function he(i, e) {
  return i.toLowerCase().includes(e.toLowerCase());
}
function Te(i, e) {
  let t = null;
  return () => {
    t || (t = window.setTimeout(() => {
      i(), t = null;
    }, e));
  };
}
function Re(i, e) {
  let t = null;
  return (...s) => {
    t && window.clearTimeout(t), t = window.setTimeout(() => {
      i(...s), t = null;
    }, e);
  };
}
function I(i, e, t, s) {
  if (be(s) && i.animate)
    return i.animate(e, t).finished;
  const o = t.direction === "normal" ? 1 : 0, r = Object.entries(e).reduce((a, [n, l]) => ({
    ...a,
    [n]: l[o]
  }), {});
  return Object.assign(i.style, r), Promise.resolve();
}
function J(i) {
  var t;
  const e = document.createElement("template");
  return e.innerHTML = i, (t = e.content) == null ? void 0 : t.firstElementChild;
}
async function Ve(i) {
  const e = new TextEncoder().encode(i), t = await crypto.subtle.digest("SHA-256", e);
  return Array.from(new Uint8Array(t)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function g(...i) {
  return i.reduce((e, t) => ({
    ...e,
    [t]: oe(t)
  }), {});
}
function oe(i) {
  return `${i}`;
}
function Me(i, e) {
  const t = `https://cdn.jsdelivr.net/npm/emojibase-data@${i}/${e}`;
  return {
    emojisUrl: `${t}/data.json`,
    messagesUrl: `${t}/messages.json`
  };
}
async function de(i) {
  try {
    return (await fetch(i, { method: "HEAD" })).headers.get("etag");
  } catch {
    return null;
  }
}
function Be(i) {
  const { emojisUrl: e, messagesUrl: t } = Me("latest", i);
  try {
    return Promise.all([
      de(e),
      de(t)
    ]);
  } catch {
    return Promise.all([null, null]);
  }
}
async function De(i, e, t) {
  let s;
  try {
    s = await i.getEtags();
  } catch {
    s = {};
  }
  const { storedEmojisEtag: o, storedMessagesEtag: r } = s;
  if (t !== r || e !== o) {
    const [a, n] = await Promise.all([we(i.locale), ve(i.locale)]);
    await i.populate({
      groups: a.groups,
      emojis: n,
      emojisEtag: e,
      messagesEtag: t
    });
  }
}
async function He(i, e) {
  const t = await i.getHash();
  return e !== t;
}
async function Ce(i, e, t) {
  const s = t || e(i);
  return await s.open(), s;
}
async function Ne(i, e, t) {
  const s = await Ce(i, e, t), [o, r] = await Be(i);
  if (await s.isPopulated())
    o && r && await De(s, o, r);
  else {
    const [a, n] = await Promise.all([we(i), ve(i)]);
    await s.populate({ groups: a.groups, emojis: n, emojisEtag: o, messagesEtag: r });
  }
  return s;
}
async function Oe(i, e, t, s, o) {
  const r = await Ce(i, e, o), a = await Ve(s);
  return (!await r.isPopulated() || await He(r, a)) && await r.populate({ groups: t.groups, emojis: s, hash: a }), r;
}
async function re(i, e, t, s, o) {
  return t && s ? Oe(i, e, t, s, o) : Ne(i, e, o);
}
function Ps(i, e) {
  i.deleteDatabase(e);
}
class Ue {
  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  activate(e) {
    this.rootElement = e, this.rootElement.addEventListener("keydown", this.handleKeyDown);
  }
  deactivate() {
    var e;
    (e = this.rootElement) == null || e.removeEventListener("keydown", this.handleKeyDown);
  }
  get focusableElements() {
    return this.rootElement.querySelectorAll('input, [tabindex="0"]');
  }
  get lastFocusableElement() {
    return this.focusableElements[this.focusableElements.length - 1];
  }
  get firstFocusableElement() {
    return this.focusableElements[0];
  }
  checkFocus(e, t, s) {
    e.target === t && (s.focus(), e.preventDefault());
  }
  handleKeyDown(e) {
    e.key === "Tab" && this.checkFocus(
      e,
      e.shiftKey ? this.firstFocusableElement : this.lastFocusableElement,
      e.shiftKey ? this.lastFocusableElement : this.firstFocusableElement
    );
  }
}
const {
  light: Ke,
  dark: zs,
  auto: $s
} = g("light", "dark", "auto");
class c {
  constructor({ template: e, classes: t, parent: s }) {
    this.isDestroyed = !1, this.appEvents = {}, this.uiEvents = [], this.uiElements = {}, this.ui = {}, this.template = e, this.classes = t, this.parent = s, this.keyBindingHandler = this.keyBindingHandler.bind(this);
  }
  initialize() {
    this.bindAppEvents();
  }
  setCustomEmojis(e) {
    this.customEmojis = e;
  }
  setEvents(e) {
    this.events = e;
  }
  setPickerId(e) {
    this.pickerId = e;
  }
  emit(e, ...t) {
    this.events.emit(e, ...t);
  }
  setI18n(e) {
    this.i18n = e;
  }
  setRenderer(e) {
    this.renderer = e;
  }
  setEmojiData(e) {
    this.emojiDataPromise = e, e.then((t) => {
      this.emojiData = t;
    });
  }
  updateEmojiData(e) {
    this.emojiData = e, this.emojiDataPromise = Promise.resolve(e);
  }
  setOptions(e) {
    this.options = e;
  }
  renderSync(e = {}) {
    return this.el = this.template.renderSync({
      classes: this.classes,
      i18n: this.i18n,
      pickerId: this.pickerId,
      ...e
    }), this.postRender(), this.el;
  }
  async render(e = {}) {
    return await this.emojiDataPromise, this.el = await this.template.renderAsync({
      classes: this.classes,
      i18n: this.i18n,
      pickerId: this.pickerId,
      ...e
    }), this.postRender(), this.el;
  }
  postRender() {
    this.bindUIElements(), this.bindKeyBindings(), this.bindUIEvents(), this.scheduleShowAnimation();
  }
  bindAppEvents() {
    Object.keys(this.appEvents).forEach((e) => {
      this.events.on(e, this.appEvents[e], this);
    }), this.events.on("data:ready", this.updateEmojiData, this);
  }
  unbindAppEvents() {
    Object.keys(this.appEvents).forEach((e) => {
      this.events.off(e, this.appEvents[e]);
    }), this.events.off("data:ready", this.updateEmojiData);
  }
  keyBindingHandler(e) {
    const t = this.keyBindings[e.key];
    t && t.call(this, e);
  }
  bindKeyBindings() {
    this.keyBindings && this.el.addEventListener("keydown", this.keyBindingHandler);
  }
  unbindKeyBindings() {
    this.keyBindings && this.el.removeEventListener("keydown", this.keyBindingHandler);
  }
  bindUIElements() {
    this.ui = Object.keys(this.uiElements).reduce((e, t) => ({
      ...e,
      [t]: this.el.querySelector(this.uiElements[t])
    }), {});
  }
  bindUIEvents() {
    this.uiEvents.forEach((e) => {
      e.handler = e.handler.bind(this), (e.target ? this.ui[e.target] : this.el).addEventListener(e.event, e.handler, e.options);
    });
  }
  unbindUIEvents() {
    this.uiEvents.forEach((e) => {
      (e.target ? this.ui[e.target] : this.el).removeEventListener(e.event, e.handler);
    });
  }
  destroy() {
    this.unbindAppEvents(), this.unbindUIEvents(), this.unbindKeyBindings(), this.el.remove(), this.isDestroyed = !0;
  }
  scheduleShowAnimation() {
    if (this.parent) {
      const e = new MutationObserver((t) => {
        const [s] = t;
        s.type === "childList" && s.addedNodes[0] === this.el && (be(this.options) && this.animateShow && this.animateShow(), e.disconnect);
      });
      e.observe(this.parent, { childList: !0 });
    }
  }
  static childEvent(e, t, s, o = {}) {
    return { target: e, event: t, handler: s, options: o };
  }
  static uiEvent(e, t, s = {}) {
    return { event: e, handler: t, options: s };
  }
  static byClass(e) {
    return `.${e}`;
  }
}
const qe = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512zM232 256C232 264 236 271.5 242.7 275.1L338.7 339.1C349.7 347.3 364.6 344.3 371.1 333.3C379.3 322.3 376.3 307.4 365.3 300L280 243.2V120C280 106.7 269.3 96 255.1 96C242.7 96 231.1 106.7 231.1 120L232 256z"/></svg>', Ge = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M64 496C64 504.8 56.75 512 48 512h-32C7.25 512 0 504.8 0 496V32c0-17.75 14.25-32 32-32s32 14.25 32 32V496zM476.3 0c-6.365 0-13.01 1.35-19.34 4.233c-45.69 20.86-79.56 27.94-107.8 27.94c-59.96 0-94.81-31.86-163.9-31.87C160.9 .3055 131.6 4.867 96 15.75v350.5c32-9.984 59.87-14.1 84.85-14.1c73.63 0 124.9 31.78 198.6 31.78c31.91 0 68.02-5.971 111.1-23.09C504.1 355.9 512 344.4 512 332.1V30.73C512 11.1 495.3 0 476.3 0z"/></svg>', We = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM176.4 240C194 240 208.4 225.7 208.4 208C208.4 190.3 194 176 176.4 176C158.7 176 144.4 190.3 144.4 208C144.4 225.7 158.7 240 176.4 240zM336.4 176C318.7 176 304.4 190.3 304.4 208C304.4 225.7 318.7 240 336.4 240C354 240 368.4 225.7 368.4 208C368.4 190.3 354 176 336.4 176zM259.9 369.4C288.8 369.4 316.2 375.2 340.6 385.5C352.9 390.7 366.7 381.3 361.4 369.1C344.8 330.9 305.6 303.1 259.9 303.1C214.3 303.1 175.1 330.8 158.4 369.1C153.1 381.3 166.1 390.6 179.3 385.4C203.7 375.1 231 369.4 259.9 369.4L259.9 369.4z"/></svg>', _e = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M448 64H192C85.96 64 0 149.1 0 256s85.96 192 192 192h256c106 0 192-85.96 192-192S554 64 448 64zM247.1 280h-32v32c0 13.2-10.78 24-23.98 24c-13.2 0-24.02-10.8-24.02-24v-32L136 279.1C122.8 279.1 111.1 269.2 111.1 256c0-13.2 10.85-24.01 24.05-24.01L167.1 232v-32c0-13.2 10.82-24 24.02-24c13.2 0 23.98 10.8 23.98 24v32h32c13.2 0 24.02 10.8 24.02 24C271.1 269.2 261.2 280 247.1 280zM431.1 344c-22.12 0-39.1-17.87-39.1-39.1s17.87-40 39.1-40s39.1 17.88 39.1 40S454.1 344 431.1 344zM495.1 248c-22.12 0-39.1-17.87-39.1-39.1s17.87-40 39.1-40c22.12 0 39.1 17.88 39.1 40S518.1 248 495.1 248z"/></svg>', Je = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M112.1 454.3c0 6.297 1.816 12.44 5.284 17.69l17.14 25.69c5.25 7.875 17.17 14.28 26.64 14.28h61.67c9.438 0 21.36-6.401 26.61-14.28l17.08-25.68c2.938-4.438 5.348-12.37 5.348-17.7L272 415.1h-160L112.1 454.3zM191.4 .0132C89.44 .3257 16 82.97 16 175.1c0 44.38 16.44 84.84 43.56 115.8c16.53 18.84 42.34 58.23 52.22 91.45c.0313 .25 .0938 .5166 .125 .7823h160.2c.0313-.2656 .0938-.5166 .125-.7823c9.875-33.22 35.69-72.61 52.22-91.45C351.6 260.8 368 220.4 368 175.1C368 78.61 288.9-.2837 191.4 .0132zM192 96.01c-44.13 0-80 35.89-80 79.1C112 184.8 104.8 192 96 192S80 184.8 80 176c0-61.76 50.25-111.1 112-111.1c8.844 0 16 7.159 16 16S200.8 96.01 192 96.01z"/></svg>', Ye = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M512 32H120c-13.25 0-24 10.75-24 24L96.01 288c0 53 43 96 96 96h192C437 384 480 341 480 288h32c70.63 0 128-57.38 128-128S582.6 32 512 32zM512 224h-32V96h32c35.25 0 64 28.75 64 64S547.3 224 512 224zM560 416h-544C7.164 416 0 423.2 0 432C0 458.5 21.49 480 48 480h480c26.51 0 48-21.49 48-48C576 423.2 568.8 416 560 416z"/></svg>', Qe = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M482.3 192C516.5 192 576 221 576 256C576 292 516.5 320 482.3 320H365.7L265.2 495.9C259.5 505.8 248.9 512 237.4 512H181.2C170.6 512 162.9 501.8 165.8 491.6L214.9 320H112L68.8 377.6C65.78 381.6 61.04 384 56 384H14.03C6.284 384 0 377.7 0 369.1C0 368.7 .1818 367.4 .5398 366.1L32 256L.5398 145.9C.1818 144.6 0 143.3 0 142C0 134.3 6.284 128 14.03 128H56C61.04 128 65.78 130.4 68.8 134.4L112 192H214.9L165.8 20.4C162.9 10.17 170.6 0 181.2 0H237.4C248.9 0 259.5 6.153 265.2 16.12L365.7 192H482.3z"/></svg>', Xe = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M9.375 233.4C3.375 239.4 0 247.5 0 256v128c0 8.5 3.375 16.62 9.375 22.62S23.5 416 32 416h32V224H32C23.5 224 15.38 227.4 9.375 233.4zM464 96H352V32c0-17.62-14.38-32-32-32S288 14.38 288 32v64H176C131.8 96 96 131.8 96 176V448c0 35.38 28.62 64 64 64h320c35.38 0 64-28.62 64-64V176C544 131.8 508.3 96 464 96zM256 416H192v-32h64V416zM224 296C201.9 296 184 278.1 184 256S201.9 216 224 216S264 233.9 264 256S246.1 296 224 296zM352 416H288v-32h64V416zM448 416h-64v-32h64V416zM416 296c-22.12 0-40-17.88-40-40S393.9 216 416 216S456 233.9 456 256S438.1 296 416 296zM630.6 233.4C624.6 227.4 616.5 224 608 224h-32v192h32c8.5 0 16.62-3.375 22.62-9.375S640 392.5 640 384V256C640 247.5 636.6 239.4 630.6 233.4z"/></svg>', Ze = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient gradientUnits="userSpaceOnUse" cy="10%" id="gradient-0">
      <stop offset="0" stop-color="hsl(50, 100%, 50%)" />
      <stop offset="1" stop-color="hsl(50, 100%, 60%)" />
    </radialGradient>
  </defs>
  <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
  <ellipse stroke="#000" fill="rgba(0, 0, 0, 0.6)" cx="172.586" cy="207.006" rx="39.974" ry="39.974"/>
  <ellipse stroke="#000" fill="rgba(0, 0, 0, 0.6)" cx="334.523" cy="207.481" rx="39.974" ry="39.974"/>
  <ellipse stroke="#000" fill="rgba(0, 0, 0, 0.6)" cx="313.325" cy="356.208" rx="91.497" ry="59.893"/>
  <path fill="#55a7ff" d="M 159.427 274.06 L 102.158 363.286 L 124.366 417.011 L 160.476 423.338 L 196.937 414.736 L 218.502 375.214"></path>
  <path fill="url(#gradient-0)" d="M256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0zM256 352C290.9 352 323.2 367.8 348.3 394.9C354.3 401.4 364.4 401.7 370.9 395.7C377.4 389.7 377.7 379.6 371.7 373.1C341.6 340.5 301 320 256 320C247.2 320 240 327.2 240 336C240 344.8 247.2 352 256 352H256zM208 369C208 349 179.6 308.6 166.4 291.3C163.2 286.9 156.8 286.9 153.6 291.3C140.6 308.6 112 349 112 369C112 395 133.5 416 160 416C186.5 416 208 395 208 369H208zM303.6 208C303.6 225.7 317.1 240 335.6 240C353.3 240 367.6 225.7 367.6 208C367.6 190.3 353.3 176 335.6 176C317.1 176 303.6 190.3 303.6 208zM207.6 208C207.6 190.3 193.3 176 175.6 176C157.1 176 143.6 190.3 143.6 208C143.6 225.7 157.1 240 175.6 240C193.3 240 207.6 225.7 207.6 208z" />
</svg>`, et = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"/></svg>', tt = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM256.3 331.8C208.9 331.8 164.1 324.9 124.5 312.8C112.2 309 100.2 319.7 105.2 331.5C130.1 390.6 188.4 432 256.3 432C324.2 432 382.4 390.6 407.4 331.5C412.4 319.7 400.4 309 388.1 312.8C348.4 324.9 303.7 331.8 256.3 331.8H256.3zM176.4 176C158.7 176 144.4 190.3 144.4 208C144.4 225.7 158.7 240 176.4 240C194 240 208.4 225.7 208.4 208C208.4 190.3 194 176 176.4 176zM336.4 240C354 240 368.4 225.7 368.4 208C368.4 190.3 354 176 336.4 176C318.7 176 304.4 190.3 304.4 208C304.4 225.7 318.7 240 336.4 240z"/></svg>', st = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M500.3 7.251C507.7 13.33 512 22.41 512 31.1V175.1C512 202.5 483.3 223.1 447.1 223.1C412.7 223.1 383.1 202.5 383.1 175.1C383.1 149.5 412.7 127.1 447.1 127.1V71.03L351.1 90.23V207.1C351.1 234.5 323.3 255.1 287.1 255.1C252.7 255.1 223.1 234.5 223.1 207.1C223.1 181.5 252.7 159.1 287.1 159.1V63.1C287.1 48.74 298.8 35.61 313.7 32.62L473.7 .6198C483.1-1.261 492.9 1.173 500.3 7.251H500.3zM74.66 303.1L86.5 286.2C92.43 277.3 102.4 271.1 113.1 271.1H174.9C185.6 271.1 195.6 277.3 201.5 286.2L213.3 303.1H239.1C266.5 303.1 287.1 325.5 287.1 351.1V463.1C287.1 490.5 266.5 511.1 239.1 511.1H47.1C21.49 511.1-.0019 490.5-.0019 463.1V351.1C-.0019 325.5 21.49 303.1 47.1 303.1H74.66zM143.1 359.1C117.5 359.1 95.1 381.5 95.1 407.1C95.1 434.5 117.5 455.1 143.1 455.1C170.5 455.1 191.1 434.5 191.1 407.1C191.1 381.5 170.5 359.1 143.1 359.1zM440.3 367.1H496C502.7 367.1 508.6 372.1 510.1 378.4C513.3 384.6 511.6 391.7 506.5 396L378.5 508C372.9 512.1 364.6 513.3 358.6 508.9C352.6 504.6 350.3 496.6 353.3 489.7L391.7 399.1H336C329.3 399.1 323.4 395.9 321 389.6C318.7 383.4 320.4 376.3 325.5 371.1L453.5 259.1C459.1 255 467.4 254.7 473.4 259.1C479.4 263.4 481.6 271.4 478.7 278.3L440.3 367.1zM116.7 219.1L19.85 119.2C-8.112 90.26-6.614 42.31 24.85 15.34C51.82-8.137 93.26-3.642 118.2 21.83L128.2 32.32L137.7 21.83C162.7-3.642 203.6-8.137 231.6 15.34C262.6 42.31 264.1 90.26 236.1 119.2L139.7 219.1C133.2 225.6 122.7 225.6 116.7 219.1H116.7z"/></svg>', it = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M413.8 447.1L256 448l0 31.99C256 497.7 241.8 512 224.1 512c-17.67 0-32.1-14.32-32.1-31.99l0-31.99l-158.9-.0099c-28.5 0-43.69-34.49-24.69-56.4l68.98-79.59H62.22c-25.41 0-39.15-29.8-22.67-49.13l60.41-70.85H89.21c-21.28 0-32.87-22.5-19.28-37.31l134.8-146.5c10.4-11.3 28.22-11.3 38.62-.0033l134.9 146.5c13.62 14.81 2.001 37.31-19.28 37.31h-10.77l60.35 70.86c16.46 19.34 2.716 49.12-22.68 49.12h-15.2l68.98 79.59C458.7 413.7 443.1 447.1 413.8 447.1z"/></svg>', ot = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M224 256c70.7 0 128-57.31 128-128S294.7 0 224 0C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3c-95.73 0-173.3 77.6-173.3 173.3C0 496.5 15.52 512 34.66 512H413.3C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304zM479.1 320h-73.85C451.2 357.7 480 414.1 480 477.3C480 490.1 476.2 501.9 470 512h138C625.7 512 640 497.6 640 479.1C640 391.6 568.4 320 479.1 320zM432 256C493.9 256 544 205.9 544 144S493.9 32 432 32c-25.11 0-48.04 8.555-66.72 22.51C376.8 76.63 384 101.4 384 128c0 35.52-11.93 68.14-31.59 94.71C372.7 243.2 400.8 256 432 256z"/></svg>', rt = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="radial" cy="85%">
      <stop offset="20%" stop-color="var(--color-secondary)" />
      <stop offset="100%" stop-color="var(--color-primary)" />
    </radialGradient>
  </defs>
  <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
  <path fill="url('#radial')" d="M506.3 417l-213.3-364c-16.33-28-57.54-28-73.98 0l-213.2 364C-10.59 444.9 9.849 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM232 168c0-13.25 10.75-24 24-24S280 154.8 280 168v128c0 13.25-10.75 24-23.1 24S232 309.3 232 296V168zM256 416c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 401.9 273.4 416 256 416z" />
</svg>`, at = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>';
function nt(i, e) {
  const t = J(e);
  return t.dataset.icon = i, t.classList.add(oe("icon")), t;
}
const me = {
  clock: qe,
  flag: Ge,
  frown: We,
  gamepad: _e,
  lightbulb: Je,
  mug: Ye,
  plane: Qe,
  robot: Xe,
  sad: Ze,
  search: et,
  smiley: tt,
  symbols: st,
  tree: it,
  users: ot,
  warning: rt,
  xmark: at
}, D = {
  recents: "clock",
  "smileys-emotion": "smiley",
  "people-body": "users",
  "animals-nature": "tree",
  "food-drink": "mug",
  activities: "gamepad",
  "travel-places": "plane",
  objects: "lightbulb",
  symbols: "symbols",
  flags: "flag",
  custom: "robot"
};
function je(i, e) {
  if (!(i in me))
    return console.warn(`Unknown icon: "${i}"`), document.createElement("div");
  const t = nt(i, me[i]);
  return e && t.classList.add(oe(`icon-${e}`)), t;
}
const ct = {
  mode: "sync"
};
var w, x, S, Y, P, Q, z, X;
class u {
  constructor(e, t = {}) {
    f(this, S);
    f(this, P);
    f(this, z);
    f(this, w, void 0);
    f(this, x, void 0);
    A(this, w, e), A(this, x, t.mode || ct.mode);
  }
  renderSync(e = {}) {
    const t = J(y(this, w).call(this, e));
    return p(this, z, X).call(this, t, e), p(this, P, Q).call(this, t), p(this, S, Y).call(this, t, e), t;
  }
  async renderAsync(e = {}) {
    const t = J(y(this, w).call(this, e));
    return p(this, z, X).call(this, t, e), p(this, P, Q).call(this, t), await p(this, S, Y).call(this, t, e), t;
  }
  render(e) {
    return y(this, x) === "sync" ? this.renderSync(e) : this.renderAsync(e);
  }
}
w = new WeakMap(), x = new WeakMap(), S = new WeakSet(), Y = async function(e, t) {
  const s = e.querySelectorAll("[data-view]"), o = [];
  for (const r of s) {
    const a = t[r.dataset.view];
    a ? r.dataset.render !== "sync" ? o.push(a.render().then((n) => (r.replaceWith(n), n))) : r.replaceWith(a.renderSync()) : r.remove();
  }
  return Promise.all(o);
}, P = new WeakSet(), Q = function(e) {
  e.querySelectorAll("i[data-icon]").forEach((s) => {
    const { icon: o, size: r } = s.dataset;
    s.replaceWith(je(o, r));
  });
}, z = new WeakSet(), X = function(e, t) {
  return e.querySelectorAll("[data-placeholder]").forEach((o) => {
    const r = o.dataset.placeholder;
    if (r && t[r]) {
      const a = t[r];
      o.replaceWith(...[a].flat());
    } else
      console.warn(`Missing placeholder element for key "${r}"`);
  }), e;
};
const lt = g(
  "imagePlaceholder",
  "placeholder"
), ht = new u(({ classes: i }) => `
  <div class="${i.placeholder} ${i.imagePlaceholder}"></div>
`);
class dt extends c {
  constructor({ classNames: e } = {}) {
    super({ template: ht, classes: lt }), this.classNames = e;
  }
  load(e) {
    const t = document.createElement("img");
    this.classNames && (t.className = this.classNames), t.addEventListener("load", () => {
      this.el.replaceWith(t);
    }, { once: !0 }), Promise.resolve(e).then((s) => t.src = s);
  }
  renderSync() {
    return super.renderSync(), this.classNames && this.classNames.split(" ").forEach((t) => this.el.classList.add(t)), this.el;
  }
}
const mt = g("customEmoji");
class ut {
  renderElement(e) {
    return { content: e };
  }
  renderImage(e = "", t) {
    const s = new dt({ classNames: e });
    return s.renderSync(), { content: s, resolver: () => (s.load(t()), s.el) };
  }
  doRender(e, t, s) {
    if (e.custom)
      return this.renderCustom(e, t, s);
    const { content: o, resolver: r } = this.render(e, s), a = o instanceof Element ? o : o.el;
    return r && r(), a;
  }
  doEmit(e) {
    return e.custom ? this.emitCustom(e) : this.emit(e);
  }
  emitCustom({ url: e, label: t, emoji: s, data: o }) {
    return { url: e, label: t, emoji: s, data: o };
  }
  renderCustom(e, t, s = "") {
    const o = [mt.customEmoji, s].join(" ").trim(), { content: r, resolver: a } = this.renderImage(o, () => e.url), n = r instanceof Element ? r : r.el;
    return a && a(), n;
  }
}
const gt = new u(({ emoji: i }) => `<span>${i}</span>`);
class pt extends ut {
  render(e) {
    return this.renderElement(gt.renderSync({ emoji: e.emoji }));
  }
  emit({ emoji: e, hexcode: t, label: s }) {
    return { emoji: e, hexcode: t, label: s };
  }
}
const yt = {
  "categories.activities": "Activities",
  "categories.animals-nature": "Animals & Nature",
  "categories.custom": "Custom",
  "categories.flags": "Flags",
  "categories.food-drink": "Food & Drink",
  "categories.objects": "Objects",
  "categories.people-body": "People & Body",
  "categories.recents": "Recently Used",
  "categories.smileys-emotion": "Smileys & Emotion",
  "categories.symbols": "Symbols",
  "categories.travel-places": "Travel & Places",
  "error.load": "Failed to load emojis",
  "recents.clear": "Clear recent emojis",
  "recents.none": "You haven't selected any emojis yet.",
  retry: "Try again",
  "search.clear": "Clear search",
  "search.error": "Failed to search emojis",
  "search.notFound": "No results found",
  search: "Search emojis..."
}, ft = [
  (i, e) => (i.hexcode === "1F91D" && e < 14 && (i.skins = []), i),
  (i, e) => (i.skins && (i.skins = i.skins.filter((t) => !t.version || t.version <= e)), i)
];
function vt(i, e) {
  return ft.some((t) => t(i, e) === null) ? null : i;
}
function M(i, e) {
  return i.filter((t) => vt(t, e) !== null);
}
function E(i) {
  var e;
  return {
    emoji: i.emoji,
    label: i.label,
    tags: i.tags,
    skins: (e = i.skins) == null ? void 0 : e.map((t) => E(t)),
    order: i.order,
    custom: !1,
    hexcode: i.hexcode,
    version: i.version
  };
}
function B(i, e, t) {
  var s;
  return t && !t.some((o) => o.order === i.group) ? !1 : he(i.label, e) || ((s = i.tags) == null ? void 0 : s.some((o) => he(o, e)));
}
class ke {
  constructor(e = "en") {
    this.locale = e;
  }
}
const Z = "PicMo";
function Ee(i) {
  return new wt(i);
}
Ee.deleteDatabase = (i) => new Promise((e, t) => {
  const s = indexedDB.deleteDatabase(`${Z}-${i}`);
  s.addEventListener("success", e), s.addEventListener("error", t);
});
class wt extends ke {
  async open() {
    const e = indexedDB.open(`${Z}-${this.locale}`);
    return new Promise((t, s) => {
      e.addEventListener("success", (o) => {
        var r;
        this.db = (r = o.target) == null ? void 0 : r.result, t();
      }), e.addEventListener("error", s), e.addEventListener("upgradeneeded", async (o) => {
        var a;
        this.db = (a = o.target) == null ? void 0 : a.result, this.db.createObjectStore("category", { keyPath: "order" });
        const r = this.db.createObjectStore("emoji", { keyPath: "emoji" });
        r.createIndex("category", "group"), r.createIndex("version", "version"), this.db.createObjectStore("meta");
      });
    });
  }
  async delete() {
    this.close();
    const e = indexedDB.deleteDatabase(`${Z}-${this.locale}`);
    await this.waitForRequest(e);
  }
  close() {
    this.db.close();
  }
  async getEmojiCount() {
    const t = this.db.transaction("emoji", "readonly").objectStore("emoji");
    return (await this.waitForRequest(t.count())).target.result;
  }
  async getEtags() {
    const t = this.db.transaction("meta", "readonly").objectStore("meta"), [s, o] = await Promise.all([
      this.waitForRequest(t.get("emojisEtag")),
      this.waitForRequest(t.get("messagesEtag"))
    ]);
    return {
      storedEmojisEtag: s.target.result,
      storedMessagesEtag: o.target.result
    };
  }
  async setMeta(e) {
    const t = this.db.transaction("meta", "readwrite"), s = t.objectStore("meta");
    return new Promise((o) => {
      t.oncomplete = o, Object.keys(e).filter(Boolean).forEach((a) => {
        s.put(e[a], a);
      });
    });
  }
  async getHash() {
    const t = this.db.transaction("meta", "readonly").objectStore("meta");
    return (await this.waitForRequest(t.get("hash"))).target.result;
  }
  async isPopulated() {
    const t = this.db.transaction("category", "readonly").objectStore("category");
    return (await this.waitForRequest(t.count())).target.result > 0;
  }
  async populate({
    groups: e,
    emojis: t,
    emojisEtag: s,
    messagesEtag: o,
    hash: r
  }) {
    await this.removeAllObjects("category", "emoji");
    const a = [
      this.addObjects("category", e),
      this.addObjects("emoji", t),
      this.setMeta({ emojisEtag: s, messagesEtag: o, hash: r })
    ];
    await Promise.all(a);
  }
  async getCategories(e) {
    var a;
    const s = this.db.transaction("category", "readonly").objectStore("category");
    let r = (await this.waitForRequest(s.getAll())).target.result.filter((n) => n.key !== "component");
    if (e.showRecents && r.unshift({ key: "recents", order: -1 }), (a = e.custom) != null && a.length && r.push({ key: "custom", order: 10 }), e.categories) {
      const n = e.categories;
      r = r.filter((l) => n.includes(l.key)), r.sort((l, m) => n.indexOf(l.key) - n.indexOf(m.key));
    } else
      r.sort((n, l) => n.order - l.order);
    return r;
  }
  async getEmojis(e, t) {
    const r = this.db.transaction("emoji", "readonly").objectStore("emoji").index("category"), l = (await this.waitForRequest(r.getAll(e.order))).target.result.filter((m) => m.version <= t).sort((m, d) => m.order != null && d.order != null ? m.order - d.order : 0).map(E);
    return M(l, t);
  }
  async searchEmojis(e, t, s, o) {
    const r = [];
    return new Promise((a, n) => {
      const d = this.db.transaction("emoji", "readonly").objectStore("emoji").openCursor();
      d.addEventListener("success", (h) => {
        var ce;
        const H = (ce = h.target) == null ? void 0 : ce.result;
        if (!H)
          return a([
            ...M(r, s),
            ...t.filter((ze) => B(ze, e))
          ]);
        const N = H.value;
        B(N, e, o) && N.version <= s && r.push(E(N)), H.continue();
      }), d.addEventListener("error", (h) => {
        n(h);
      });
    });
  }
  async waitForRequest(e) {
    return new Promise((t, s) => {
      e.onsuccess = t, e.onerror = s;
    });
  }
  withTransaction(e, t = "readwrite", s) {
    return new Promise((o, r) => {
      const a = this.db.transaction(e, t);
      a.oncomplete = o, a.onerror = r, s(a);
    });
  }
  async removeAllObjects(...e) {
    const t = this.db.transaction(e, "readwrite"), s = e.map((o) => t.objectStore(o));
    await Promise.all(s.map((o) => this.waitForRequest(o.clear())));
  }
  async addObjects(e, t) {
    return this.withTransaction(e, "readwrite", (s) => {
      const o = s.objectStore(e);
      t.forEach((r) => {
        o.add(r);
      });
    });
  }
}
class bt {
}
const K = "PicMo:recents";
class xe extends bt {
  constructor(e) {
    super(), this.storage = e;
  }
  clear() {
    this.storage.removeItem(K);
  }
  getRecents(e) {
    var t;
    try {
      return JSON.parse((t = this.storage.getItem(K)) != null ? t : "[]").slice(0, e);
    } catch {
      return [];
    }
  }
  addOrUpdateRecent(e, t) {
    const s = [
      e,
      ...this.getRecents(t).filter((o) => o.hexcode !== e.hexcode)
    ].slice(0, t);
    try {
      this.storage.setItem(K, JSON.stringify(s));
    } catch {
      console.warn("storage is not available, recent emojis will not be saved");
    }
  }
}
class Ct extends xe {
  constructor() {
    super(localStorage);
  }
}
const jt = {
  dataStore: Ee,
  theme: Ke,
  animate: !0,
  showCategoryTabs: !0,
  showPreview: !0,
  showRecents: !0,
  showSearch: !0,
  showVariants: !0,
  emojisPerRow: 8,
  visibleRows: 6,
  emojiVersion: "auto",
  i18n: yt,
  locale: "en",
  maxRecents: 50,
  custom: []
};
function kt(i = {}) {
  return {
    ...jt,
    ...i,
    renderer: i.renderer || new pt(),
    recentsProvider: i.recentsProvider || new Ct()
  };
}
var v, b, V, $, ee;
class ae {
  constructor() {
    f(this, b);
    f(this, $);
    f(this, v, /* @__PURE__ */ new Map());
  }
  on(e, t, s) {
    p(this, $, ee).call(this, e, t, s);
  }
  once(e, t, s) {
    p(this, $, ee).call(this, e, t, s, !0);
  }
  off(e, t) {
    const s = p(this, b, V).call(this, e);
    y(this, v).set(e, s.filter((o) => o.handler !== t));
  }
  emit(e, ...t) {
    p(this, b, V).call(this, e).forEach((o) => {
      o.handler.apply(o.context, t), o.once && this.off(e, o.handler);
    });
  }
  removeAll() {
    y(this, v).clear();
  }
}
v = new WeakMap(), b = new WeakSet(), V = function(e) {
  return y(this, v).has(e) || y(this, v).set(e, []), y(this, v).get(e);
}, $ = new WeakSet(), ee = function(e, t, s, o = !1) {
  p(this, b, V).call(this, e).push({ context: s, handler: t, once: o });
};
const Et = {
  injectStyles: !0
};
class xt extends ae {
}
class St extends ae {
}
const te = g(
  "emojiCategory",
  "categoryName",
  "noRecents",
  "recentEmojis"
);
class ne extends c {
  constructor({ template: e, category: t, showVariants: s, lazyLoader: o }) {
    super({ template: e, classes: te }), this.baseUIElements = {
      categoryName: c.byClass(te.categoryName)
    }, this.category = t, this.showVariants = s, this.lazyLoader = o;
  }
  setActive(e, t, s) {
    this.emojiContainer.setActive(e, t, s);
  }
}
const Pt = new u(({ classes: i, emoji: e }) => `
  <button
    type="button"
    class="${i.emojiButton}"
    title="${e.label}"
    data-emoji="${e.emoji}"
    tabindex="-1">
    <div data-placeholder="emojiContent"></div>
  </button>
`), zt = g("emojiButton");
class Se extends c {
  constructor({ emoji: e, lazyLoader: t, category: s }) {
    super({ template: Pt, classes: zt }), this.emoji = e, this.lazyLoader = t, this.category = s;
  }
  initialize() {
    this.uiEvents = [
      c.uiEvent("focus", this.handleFocus)
    ], super.initialize();
  }
  handleFocus() {
    this.category && this.events.emit("focus:change", this.category);
  }
  activateFocus(e) {
    this.el.tabIndex = 0, e && this.el.focus();
  }
  deactivateFocus() {
    this.el.tabIndex = -1;
  }
  renderSync() {
    return super.renderSync({
      emoji: this.emoji,
      emojiContent: this.renderer.doRender(this.emoji, this.lazyLoader)
    });
  }
}
class $t {
  constructor(e, t, s = 0, o = 0, r = !1) {
    this.events = new ae(), this.keyHandlers = {
      ArrowLeft: this.focusPrevious.bind(this),
      ArrowRight: this.focusNext.bind(this),
      ArrowUp: this.focusUp.bind(this),
      ArrowDown: this.focusDown.bind(this)
    }, this.rowCount = Math.ceil(t / e), this.columnCount = e, this.focusedRow = s, this.focusedColumn = o, this.emojiCount = t, this.wrap = r, this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  destroy() {
    this.events.removeAll();
  }
  on(e, t) {
    this.events.on(e, t);
  }
  handleKeyDown(e) {
    e.key in this.keyHandlers && (e.preventDefault(), this.keyHandlers[e.key]());
  }
  setCell(e, t, s = !0) {
    const o = this.getIndex();
    this.focusedRow = e, t !== void 0 && (this.focusedColumn = Math.min(this.columnCount, t)), (this.focusedRow >= this.rowCount || this.getIndex() >= this.emojiCount) && (this.focusedRow = this.rowCount - 1, this.focusedColumn = this.emojiCount % this.columnCount - 1), this.events.emit("focus:change", { from: o, to: this.getIndex(), performFocus: s });
  }
  setFocusedIndex(e, t = !0) {
    const s = Math.floor(e / this.columnCount), o = e % this.columnCount;
    this.setCell(s, o, t);
  }
  focusNext() {
    this.focusedColumn < this.columnCount - 1 && this.getIndex() < this.emojiCount - 1 ? this.setCell(this.focusedRow, this.focusedColumn + 1) : this.focusedRow < this.rowCount - 1 ? this.setCell(this.focusedRow + 1, 0) : this.wrap ? this.setCell(0, 0) : this.events.emit("focus:overflow", 0);
  }
  focusPrevious() {
    this.focusedColumn > 0 ? this.setCell(this.focusedRow, this.focusedColumn - 1) : this.focusedRow > 0 ? this.setCell(this.focusedRow - 1, this.columnCount - 1) : this.wrap ? this.setCell(this.rowCount - 1, this.columnCount - 1) : this.events.emit("focus:underflow", this.columnCount - 1);
  }
  focusUp() {
    this.focusedRow > 0 ? this.setCell(this.focusedRow - 1, this.focusedColumn) : this.events.emit("focus:underflow", this.focusedColumn);
  }
  focusDown() {
    this.focusedRow < this.rowCount - 1 ? this.setCell(this.focusedRow + 1, this.focusedColumn) : this.events.emit("focus:overflow", this.focusedColumn);
  }
  focusToIndex(e) {
    this.setCell(Math.floor(e / this.columnCount), e % this.columnCount);
  }
  getIndex() {
    return this.focusedRow * this.columnCount + this.focusedColumn;
  }
  getCell() {
    return { row: this.focusedRow, column: this.focusedColumn };
  }
  getRowCount() {
    return this.rowCount;
  }
}
const Lt = new u(({ classes: i }) => `
  <div class="${i.emojiContainer}">
    <div data-placeholder="emojis"></div>
  </div>
`), Ft = g("emojiContainer");
class F extends c {
  constructor({ emojis: e, showVariants: t, preview: s = !0, lazyLoader: o, category: r, fullHeight: a = !1 }) {
    super({ template: Lt, classes: Ft }), this.fullHeight = !1, this.showVariants = t, this.lazyLoader = o, this.preview = s, this.emojis = e, this.category = r, this.fullHeight = a, this.setFocus = this.setFocus.bind(this), this.triggerNextCategory = this.triggerNextCategory.bind(this), this.triggerPreviousCategory = this.triggerPreviousCategory.bind(this);
  }
  initialize() {
    this.grid = new $t(this.options.emojisPerRow, this.emojiCount, 0, 0, !this.category), this.grid.on("focus:change", this.setFocus), this.grid.on("focus:overflow", this.triggerNextCategory), this.grid.on("focus:underflow", this.triggerPreviousCategory), this.uiEvents = [
      c.uiEvent("click", this.selectEmoji),
      c.uiEvent("keydown", this.grid.handleKeyDown)
    ], this.preview && this.uiEvents.push(
      c.uiEvent("mouseover", this.showPreview),
      c.uiEvent("mouseout", this.hidePreview),
      c.uiEvent("focus", this.showPreview, { capture: !0 }),
      c.uiEvent("blur", this.hidePreview, { capture: !0 })
    ), super.initialize();
  }
  setFocusedView(e, t) {
    if (!!e)
      if (typeof e == "string") {
        const s = this.emojis.findIndex((o) => o.emoji === e);
        this.grid.setFocusedIndex(s, !1), setTimeout(() => {
          var n, l, m, d;
          const o = this.emojiViews[s].el;
          o.scrollIntoView();
          const r = (n = o.parentElement) == null ? void 0 : n.previousElementSibling, a = (m = (l = o.parentElement) == null ? void 0 : l.parentElement) == null ? void 0 : m.parentElement;
          a.scrollTop -= (d = r == null ? void 0 : r.offsetHeight) != null ? d : 0;
        });
      } else
        e.row === "first" || e.row === 0 ? this.grid.setCell(0, e.offset, t) : e.row === "last" && this.grid.setCell(this.grid.getRowCount() - 1, e.offset, t);
  }
  setActive(e, t, s) {
    var o;
    e ? this.setFocusedView(t, s) : (o = this.emojiViews[this.grid.getIndex()]) == null || o.deactivateFocus();
  }
  renderSync() {
    return this.emojiViews = this.emojis.map(
      (e) => this.viewFactory.create(Se, {
        emoji: e,
        category: this.category,
        lazyLoader: this.lazyLoader,
        renderer: this.renderer
      })
    ), this.emojiElements = this.emojiViews.map((e) => e.renderSync()), super.renderSync({
      emojis: this.emojiElements,
      i18n: this.i18n
    });
  }
  destroy() {
    super.destroy(), this.emojiViews.forEach((e) => e.destroy()), this.grid.destroy();
  }
  triggerPreviousCategory(e) {
    this.events.emit("category:previous", e);
  }
  triggerNextCategory(e) {
    this.category && this.events.emit("category:next", e);
  }
  setFocus({ from: e, to: t, performFocus: s }) {
    var o, r;
    (o = this.emojiViews[e]) == null || o.deactivateFocus(), (r = this.emojiViews[t]) == null || r.activateFocus(s);
  }
  selectEmoji(e) {
    e.stopPropagation();
    const t = U(e, this.emojis);
    t && this.events.emit("emoji:select", {
      emoji: t,
      showVariants: this.showVariants
    });
  }
  showPreview(e) {
    const s = e.target.closest("button"), o = s == null ? void 0 : s.firstElementChild, r = U(e, this.emojis);
    r && this.events.emit("preview:show", r, o == null ? void 0 : o.cloneNode(!0));
  }
  hidePreview(e) {
    U(e, this.emojis) && this.events.emit("preview:hide");
  }
  get emojiCount() {
    return this.emojis.length;
  }
}
const At = new u(({ classes: i, category: e, pickerId: t, icon: s, i18n: o }) => `
  <section class="${i.emojiCategory}" role="tabpanel" aria-labelledby="${t}-category-${e.key}">
    <h3 data-category="${e.key}" class="${i.categoryName}">
      <i data-icon="${s}"></i>
      ${o.get(`categories.${e.key}`, e.message || e.key)}
    </h3>
    <div data-view="emojis" data-render="sync"></div>
  </section>
`);
class It extends ne {
  constructor({ category: e, showVariants: t, lazyLoader: s, emojiVersion: o }) {
    super({ category: e, showVariants: t, lazyLoader: s, template: At }), this.showVariants = t, this.lazyLoader = s, this.emojiVersion = o;
  }
  initialize() {
    this.uiElements = { ...this.baseUIElements }, super.initialize();
  }
  async render() {
    await this.emojiDataPromise;
    const e = await this.emojiData.getEmojis(this.category, this.emojiVersion);
    return this.emojiContainer = this.viewFactory.create(F, {
      emojis: e,
      showVariants: this.showVariants,
      lazyLoader: this.lazyLoader,
      category: this.category.key
    }), super.render({
      category: this.category,
      emojis: this.emojiContainer,
      emojiCount: e.length,
      icon: D[this.category.key]
    });
  }
}
class Tt extends F {
  constructor({ category: e, emojis: t, preview: s = !0, lazyLoader: o }) {
    super({ category: e, emojis: t, showVariants: !1, preview: s, lazyLoader: o });
  }
  async addOrUpdate(e) {
    const t = this.el.querySelector(`[data-emoji="${e.emoji}"]`);
    t && (this.el.removeChild(t), this.emojis = this.emojis.filter((o) => o !== e));
    const s = this.viewFactory.create(Se, { emoji: e });
    if (this.el.insertBefore(s.renderSync(), this.el.firstChild), this.emojis = [
      e,
      ...this.emojis.filter((o) => o !== e)
    ], this.emojis.length > this.options.maxRecents) {
      this.emojis = this.emojis.slice(0, this.options.maxRecents);
      const o = this.el.childElementCount - this.options.maxRecents;
      for (let r = 0; r < o; r++)
        this.el.lastElementChild && this.el.removeChild(this.el.lastElementChild);
    }
  }
}
const Rt = new u(({ emojiCount: i, classes: e, category: t, pickerId: s, icon: o, i18n: r }) => `
  <section class="${e.emojiCategory}" role="tabpanel" aria-labelledby="${s}-category-${t.key}">
    <h3 data-category="${t.key}" class="${e.categoryName}">
      <i data-icon="${o}"></i>
      ${r.get(`categories.${t.key}`, t.message || t.key)}
    </h3>
    <div data-empty="${i === 0}" class="${e.recentEmojis}">
      <div data-view="emojis" data-render="sync"></div>
    </div>
    <div class="${e.noRecents}">
      ${r.get("recents.none")}
    </div>
  </section>
`, { mode: "async" });
class Vt extends ne {
  constructor({ category: e, lazyLoader: t, provider: s }) {
    super({ category: e, showVariants: !1, lazyLoader: t, template: Rt }), this.provider = s;
  }
  initialize() {
    this.uiElements = {
      ...this.baseUIElements,
      recents: c.byClass(te.recentEmojis)
    }, this.appEvents = {
      "recent:add": this.addRecent
    }, super.initialize();
  }
  async addRecent(e) {
    await this.emojiContainer.addOrUpdate(e), this.ui.recents.dataset.empty = "false";
  }
  async render() {
    var t;
    const e = (t = this.provider) == null ? void 0 : t.getRecents(this.options.maxRecents);
    return this.emojiContainer = this.viewFactory.create(Tt, {
      emojis: e,
      showVariants: !1,
      lazyLoader: this.lazyLoader,
      category: this.category.key
    }), await super.render({
      category: this.category,
      emojis: this.emojiContainer,
      emojiCount: e.length,
      icon: D[this.category.key]
    }), this.el;
  }
}
const Mt = new u(({ classes: i, category: e, pickerId: t, icon: s, i18n: o }) => `
  <section class="${i.emojiCategory}" role="tabpanel" aria-labelledby="${t}-category-${e.key}">
    <h3 data-category="${e.key}" class="${i.categoryName}">
      <i data-icon="${s}"></i>
      ${o.get(`categories.${e.key}`, e.message || e.key)}
    </h3>
    <div data-view="emojis" data-render="sync"></div>
  </section>
`);
class Bt extends ne {
  constructor({ category: e, lazyLoader: t }) {
    super({ template: Mt, showVariants: !1, lazyLoader: t, category: e });
  }
  initialize() {
    this.uiElements = { ...this.baseUIElements }, super.initialize();
  }
  async render() {
    return this.emojiContainer = this.viewFactory.create(F, {
      emojis: this.customEmojis,
      showVariants: this.showVariants,
      lazyLoader: this.lazyLoader,
      category: this.category.key
    }), super.render({
      category: this.category,
      emojis: this.emojiContainer,
      emojiCount: this.customEmojis.length,
      icon: D[this.category.key]
    });
  }
}
class Pe {
  constructor() {
    this.elements = /* @__PURE__ */ new Map();
  }
  lazyLoad(e, t) {
    return this.elements.set(e, t), e;
  }
  observe(e) {
    if (window.IntersectionObserver) {
      const t = new IntersectionObserver(
        (s) => {
          s.filter((o) => o.intersectionRatio > 0).map((o) => o.target).forEach((o) => {
            const r = this.elements.get(o);
            r == null || r(), t.unobserve(o);
          });
        },
        {
          root: e
        }
      );
      this.elements.forEach((s, o) => {
        t.observe(o);
      });
    } else
      this.elements.forEach((t) => {
        t();
      });
  }
}
const ue = g("emojiArea"), Dt = new u(({ classes: i }) => `
  <div class="${i.emojiArea}">
    <div data-placeholder="emojis"></div>
  </div>
`, { mode: "async" }), Ht = {
  recents: Vt,
  custom: Bt
};
function Nt(i) {
  return Ht[i.key] || It;
}
function Ot(i) {
  return !i || i === "button" ? {
    row: "first",
    offset: 0
  } : i;
}
class Ut extends c {
  constructor({ categoryTabs: e, categories: t, emojiVersion: s }) {
    super({ template: Dt, classes: ue }), this.selectedCategory = 0, this.scrollListenerState = "active", this.lazyLoader = new Pe(), this.categoryTabs = e, this.categories = t, this.emojiVersion = s, this.handleScroll = Te(this.handleScroll.bind(this), 100);
  }
  initialize() {
    this.appEvents = {
      "category:select": this.handleCategorySelect,
      "category:previous": this.focusPreviousCategory,
      "category:next": this.focusNextCategory,
      "focus:change": this.updateFocusedCategory
    }, this.uiElements = { emojis: c.byClass(ue.emojiArea) }, this.uiEvents = [c.uiEvent("scroll", this.handleScroll)], super.initialize();
  }
  get focusableEmoji() {
    return this.el.querySelector('[tabindex="0"]');
  }
  async render() {
    this.emojiCategories = this.categories.map(this.createCategory, this);
    const e = {};
    return this.categories.forEach((t, s) => {
      e[`emojis-${t.key}`] = this.emojiCategories[s];
    }), await super.render({
      emojis: await Promise.all(this.emojiCategories.map((t) => t.render()))
    }), this.lazyLoader.observe(this.el), window.ResizeObserver && (this.observer = new ResizeObserver(() => {
      const t = this.el.scrollHeight - this.scrollHeight;
      this.el.scrollTop - this.scrollTop === 0 && t > 0 && (this.el.scrollTop += t), this.scrollHeight = this.el.scrollHeight, this.scrollTop = this.el.scrollTop;
    }), this.emojiCategories.forEach((t) => {
      this.observer.observe(t.el);
    })), this.el;
  }
  destroy() {
    super.destroy(), this.emojiCategories.forEach((e) => {
      var t;
      (t = this.observer) == null || t.unobserve(e.el), e.destroy();
    });
  }
  handleCategorySelect(e, t) {
    this.selectCategory(e, t);
  }
  createCategory(e) {
    const t = Nt(e);
    return this.viewFactory.create(t, {
      category: e,
      showVariants: !0,
      lazyLoader: this.lazyLoader,
      emojiVersion: this.emojiVersion,
      provider: this.options.recentsProvider
    });
  }
  determineInitialCategory() {
    var e;
    return this.options.initialCategory && this.categories.find((t) => t.key === this.options.initialCategory) ? this.options.initialCategory : (e = this.categories.find((t) => t.key !== "recents")) == null ? void 0 : e.key;
  }
  determineFocusTarget(e) {
    const t = this.emojiCategories.find((s) => s.category.key === e);
    return this.options.initialEmoji && (t == null ? void 0 : t.el.querySelector(`[data-emoji="${this.options.initialEmoji}"]`)) ? this.options.initialEmoji : "button";
  }
  reset(e = !0) {
    this.events.emit("preview:hide"), this.scrollHeight = this.el.scrollHeight;
    const t = this.determineInitialCategory();
    t && (this.selectCategory(t, {
      focus: this.determineFocusTarget(t),
      performFocus: e,
      scroll: "jump"
    }), this.selectedCategory = this.getCategoryIndex(t));
  }
  getCategoryIndex(e) {
    return this.categories.findIndex((t) => t.key === e);
  }
  focusPreviousCategory(e) {
    this.selectedCategory > 0 && this.focusCategory(this.selectedCategory - 1, { row: "last", offset: e != null ? e : this.options.emojisPerRow });
  }
  focusNextCategory(e) {
    this.selectedCategory < this.categories.length - 1 && this.focusCategory(this.selectedCategory + 1, { row: "first", offset: e != null ? e : 0 });
  }
  focusCategory(e, t) {
    this.selectCategory(e, {
      focus: t,
      performFocus: !0
    });
  }
  async selectCategory(e, t = {}) {
    var l;
    this.scrollListenerState = "suspend";
    const { focus: s, performFocus: o, scroll: r } = {
      performFocus: !1,
      ...t
    };
    this.emojiCategories[this.selectedCategory].setActive(!1);
    const a = this.selectedCategory = typeof e == "number" ? e : this.getCategoryIndex(e);
    (l = this.categoryTabs) == null || l.setActiveTab(this.selectedCategory, {
      performFocus: o,
      scroll: s === "button"
    });
    const n = this.emojiCategories[a].el.offsetTop;
    this.emojiCategories[a].setActive(!0, Ot(s), s !== "button" && o), r && (this.el.scrollTop = n), this.scrollListenerState = "resume";
  }
  updateFocusedCategory(e) {
    var t;
    this.categories[this.selectedCategory].key !== e && (this.scrollListenerState = "suspend", this.selectedCategory = this.getCategoryIndex(e), (t = this.categoryTabs) == null || t.setActiveTab(this.selectedCategory, {
      changeFocusable: !1,
      performFocus: !1
    }), this.scrollListenerState = "resume");
  }
  handleScroll() {
    if (this.scrollListenerState === "suspend" || !this.categoryTabs)
      return;
    if (this.scrollListenerState === "resume") {
      this.scrollListenerState = "active";
      return;
    }
    const e = this.el.scrollTop, t = this.el.scrollHeight - this.el.offsetHeight, s = this.emojiCategories.findIndex((r, a) => {
      var n;
      return e < ((n = this.emojiCategories[a + 1]) == null ? void 0 : n.el.offsetTop);
    }), o = {
      changeFocusable: !1,
      performFocus: !1,
      scroll: !1
    };
    e === 0 ? this.categoryTabs.setActiveTab(0, o) : Math.floor(e) === Math.floor(t) || s < 0 ? this.categoryTabs.setActiveTab(this.categories.length - 1, o) : this.categoryTabs.setActiveTab(s, o);
  }
}
const Kt = new u(({ classList: i, classes: e, icon: t, message: s }) => `
<div class="${i}" role="alert">
  <div class="${e.iconContainer}"><i data-size="10x" data-icon="${t}"></i></div>
  <h3 class="${e.title}">${s}</h3>
</div>
`), ge = g("error", "iconContainer", "title");
class se extends c {
  constructor({ message: e, icon: t = "warning", template: s = Kt, className: o }) {
    super({ template: s, classes: ge }), this.message = e, this.icon = t, this.className = o;
  }
  renderSync() {
    const e = [ge.error, this.className].join(" ").trim();
    return super.renderSync({ message: this.message, icon: this.icon, classList: e });
  }
}
const qt = new u(({ classList: i, classes: e, icon: t, i18n: s, message: o }) => `
  <div class="${i}" role="alert">
    <div class="${e.icon}"><i data-size="10x" data-icon="${t}"></i></div>
    <h3 class="${e.title}">${o}</h3>
    <button type="button">${s.get("retry")}</button>
  </div>
`), Gt = g("dataError");
class Wt extends se {
  constructor({ message: e }) {
    super({ message: e, template: qt, className: Gt.dataError });
  }
  initialize() {
    this.uiElements = { retryButton: "button" }, this.uiEvents = [c.childEvent("retryButton", "click", this.onRetry)], super.initialize();
  }
  async onRetry() {
    this.emojiData ? await this.emojiData.delete() : await this.options.dataStore.deleteDatabase(this.options.locale), this.events.emit("reinitialize");
    const e = await re(this.options.locale, this.options.dataStore, this.options.messages, this.options.emojiData, this.emojiData);
    this.viewFactory.setEmojiData(e), this.events.emit("data:ready", e);
  }
}
const C = g(
  "preview",
  "previewEmoji",
  "previewName",
  "tagList",
  "tag"
), _t = new u(({ classes: i, tag: e }) => `
  <li class="${i.tag}">${e}</li>
`), Jt = new u(({ classes: i }) => `
  <div class="${i.preview}">
    <div class="${i.previewEmoji}"></div>
    <div class="${i.previewName}"></div>
    <ul class="${i.tagList}"></ul>
  </div>
`);
class Yt extends c {
  constructor() {
    super({ template: Jt, classes: C });
  }
  initialize() {
    this.uiElements = {
      emoji: c.byClass(C.previewEmoji),
      name: c.byClass(C.previewName),
      tagList: c.byClass(C.tagList)
    }, this.appEvents = {
      "preview:show": this.showPreview,
      "preview:hide": this.hidePreview
    }, super.initialize();
  }
  showPreview(e, t) {
    if (this.ui.emoji.replaceChildren(t), this.ui.name.textContent = e.label, e.tags) {
      this.ui.tagList.style.display = "flex";
      const s = e.tags.map((o) => _t.renderSync({ tag: o, classes: C }));
      this.ui.tagList.replaceChildren(...s);
    }
  }
  hidePreview() {
    this.ui.emoji.replaceChildren(), this.ui.name.textContent = "", this.ui.tagList.replaceChildren();
  }
}
const Qt = new u(({ classes: i, i18n: e }) => `
  <button title="${e.get("search.clear")}" class="${i.clearSearchButton}">
    <i data-icon="xmark"></i>
  </button>
`), Xt = new u(({ classes: i, i18n: e }) => `
<div class="${i.searchContainer}">
  <input class="${i.searchField}" placeholder="${e.get("search")}">
  <span class="${i.searchAccessory}"></span>
</div>
`, { mode: "async" }), j = g(
  "searchContainer",
  "searchField",
  "clearButton",
  "searchAccessory",
  "clearSearchButton",
  "notFound"
);
class Zt extends c {
  constructor({ categories: e, emojiVersion: t }) {
    super({ template: Xt, classes: j }), this.categories = e.filter((s) => s.key !== "recents"), this.emojiVersion = t, this.search = Re(this.search.bind(this), 100);
  }
  initialize() {
    this.uiElements = {
      searchField: c.byClass(j.searchField),
      searchAccessory: c.byClass(j.searchAccessory)
    }, this.uiEvents = [
      c.childEvent("searchField", "keydown", this.onKeyDown),
      c.childEvent("searchField", "input", this.onSearchInput)
    ], super.initialize();
  }
  async render() {
    return await super.render(), this.searchIcon = je("search"), this.notFoundMessage = this.viewFactory.create(se, {
      message: this.i18n.get("search.notFound"),
      className: j.notFound,
      icon: "sad"
    }), this.notFoundMessage.renderSync(), this.errorMessage = this.viewFactory.create(se, { message: this.i18n.get("search.error") }), this.errorMessage.renderSync(), this.clearSearchButton = Qt.render({
      classes: j,
      i18n: this.i18n
    }), this.clearSearchButton.addEventListener("click", (e) => this.onClearSearch(e)), this.searchField = this.ui.searchField, this.showSearchIcon(), this.el;
  }
  showSearchIcon() {
    this.showSearchAccessory(this.searchIcon);
  }
  showClearSearchButton() {
    this.showSearchAccessory(this.clearSearchButton);
  }
  showSearchAccessory(e) {
    this.ui.searchAccessory.replaceChildren(e);
  }
  clear() {
    this.searchField.value = "", this.showSearchIcon();
  }
  focus() {
    this.searchField.focus();
  }
  onClearSearch(e) {
    var t;
    e.stopPropagation(), this.searchField.value = "", (t = this.resultsContainer) == null || t.destroy(), this.resultsContainer = null, this.showSearchIcon(), this.events.emit("content:show"), this.searchField.focus();
  }
  handleResultsKeydown(e) {
    this.resultsContainer && e.key === "Escape" && this.onClearSearch(e);
  }
  onKeyDown(e) {
    var t;
    e.key === "Escape" && this.searchField.value ? this.onClearSearch(e) : (e.key === "Enter" || e.key === "ArrowDown") && this.resultsContainer && (e.preventDefault(), (t = this.resultsContainer.el.querySelector('[tabindex="0"]')) == null || t.focus());
  }
  onSearchInput(e) {
    this.searchField.value ? (this.showClearSearchButton(), this.search()) : this.onClearSearch(e);
  }
  async search() {
    var e;
    if (!!this.searchField.value)
      try {
        const t = await this.emojiData.searchEmojis(
          this.searchField.value,
          this.customEmojis,
          this.emojiVersion,
          this.categories
        );
        if (this.events.emit("preview:hide"), t.length) {
          const s = new Pe();
          this.resultsContainer = this.viewFactory.create(F, {
            emojis: t,
            fullHeight: !0,
            showVariants: !0,
            lazyLoader: s
          }), this.resultsContainer.renderSync(), (e = this.resultsContainer) != null && e.el && (s.observe(this.resultsContainer.el), this.resultsContainer.setActive(!0, { row: 0, offset: 0 }, !1), this.resultsContainer.el.addEventListener("keydown", (o) => this.handleResultsKeydown(o)), this.events.emit("content:show", this.resultsContainer));
        } else
          this.events.emit("content:show", this.notFoundMessage);
      } catch {
        this.events.emit("content:show", this.errorMessage);
      }
  }
}
const es = new u(({ classes: i }) => `
  <div class="${i.variantOverlay}">
    <div class="${i.variantPopup}">
      <div data-view="emojis" data-render="sync"></div>
    </div>
  </div>
`), pe = g(
  "variantOverlay",
  "variantPopup"
), q = {
  easing: "ease-in-out",
  duration: 250,
  fill: "both"
}, ye = {
  opacity: [0, 1]
}, fe = {
  opacity: [0, 1],
  transform: ["scale3d(0.8, 0.8, 0.8)", "scale3d(1, 1, 1)"]
};
class ts extends c {
  constructor({ emoji: e, parent: t }) {
    super({ template: es, classes: pe, parent: t }), this.focusedEmojiIndex = 0, this.focusTrap = new Ue(), this.animateShow = () => Promise.all([
      I(this.el, ye, q, this.options),
      I(this.ui.popup, fe, q, this.options)
    ]), this.emoji = e;
  }
  initialize() {
    this.uiElements = {
      popup: c.byClass(pe.variantPopup)
    }, this.uiEvents = [
      c.uiEvent("click", this.handleClick),
      c.uiEvent("keydown", this.handleKeydown)
    ], super.initialize();
  }
  animateHide() {
    const e = { ...q, direction: "reverse" };
    return Promise.all([
      I(this.el, ye, e, this.options),
      I(this.ui.popup, fe, e, this.options)
    ]);
  }
  async hide() {
    await this.animateHide(), this.events.emit("variantPopup:hide");
  }
  handleKeydown(e) {
    e.key === "Escape" && (this.hide(), e.stopPropagation());
  }
  handleClick(e) {
    this.ui.popup.contains(e.target) || this.hide();
  }
  getEmoji(e) {
    return this.renderedEmojis[e];
  }
  setFocusedEmoji(e) {
    const t = this.getEmoji(this.focusedEmojiIndex);
    t.tabIndex = -1, this.focusedEmojiIndex = e;
    const s = this.getEmoji(this.focusedEmojiIndex);
    s.tabIndex = 0, s.focus();
  }
  destroy() {
    this.emojiContainer.destroy(), this.focusTrap.deactivate(), super.destroy();
  }
  renderSync() {
    const e = {
      ...this.emoji,
      skins: null
    }, t = (this.emoji.skins || []).map((o) => ({
      ...o,
      label: this.emoji.label,
      tags: this.emoji.tags
    })), s = [e, ...t];
    return this.emojiContainer = this.viewFactory.create(F, {
      emojis: s,
      preview: !1
    }), super.renderSync({ emojis: this.emojiContainer }), s.length < this.options.emojisPerRow && this.el.style.setProperty("--emojis-per-row", s.length.toString()), this.el;
  }
  activate() {
    this.emojiContainer.setActive(!0, { row: 0, offset: 0 }, !0), this.focusTrap.activate(this.el);
  }
}
const ss = new u(({ classes: i, i18n: e, category: t, pickerId: s, icon: o }) => `
<li class="${i.categoryTab}">
  <button
    aria-selected="false"
    role="tab"
    class="${i.categoryButton}"
    tabindex="-1"
    title="${e.get(`categories.${t.key}`, t.message || t.key)}"
    type="button"
    data-category="${t.key}"
    id="${s}-category-${t.key}"
  >
    <i data-icon="${o}"></i>
</li>
`), G = g(
  "categoryTab",
  "categoryTabActive",
  "categoryButton"
);
class is extends c {
  constructor({ category: e, icon: t }) {
    super({ template: ss, classes: G }), this.isActive = !1, this.category = e, this.icon = t;
  }
  initialize() {
    this.uiElements = {
      button: c.byClass(G.categoryButton)
    }, this.uiEvents = [
      c.childEvent("button", "click", this.selectCategory),
      c.childEvent("button", "focus", this.selectCategory)
    ], super.initialize();
  }
  renderSync() {
    return super.renderSync({
      category: this.category,
      icon: this.icon
    }), this.ui.button.ariaSelected = "false", this.el;
  }
  setActive(e, t = {}) {
    const { changeFocusable: s, performFocus: o, scroll: r } = {
      changeFocusable: !0,
      performFocus: !0,
      scroll: !0,
      ...t
    };
    this.el.classList.toggle(G.categoryTabActive, e), s && (this.ui.button.tabIndex = e ? 0 : -1, this.ui.button.ariaSelected = e.toString()), e && o && (this.ui.button.focus(), r && this.events.emit("category:select", this.category.key, { scroll: "animate", focus: "button", performFocus: !1 })), this.isActive = e;
  }
  selectCategory() {
    this.isActive || this.events.emit("category:select", this.category.key, { scroll: "animate", focus: "button", performFocus: !0 });
  }
}
const os = new u(({ classes: i }) => `
  <div class="${i.categoryButtonsContainer}">
    <ul role="tablist" class="${i.categoryButtons}">
      <div data-placeholder="tabs"></div>
    </ul>
  </div>
`), rs = g("categoryButtons", "categoryButtonsContainer");
class as extends c {
  constructor({ categories: e }) {
    super({ template: os, classes: rs }), this.activeCategoryIndex = 0, this.categories = e;
  }
  initialize() {
    this.keyBindings = {
      ArrowLeft: this.stepSelectedTab(-1),
      ArrowRight: this.stepSelectedTab(1)
    }, this.uiEvents = [
      c.uiEvent("scroll", this.checkOverflow)
    ], super.initialize();
  }
  checkOverflow() {
    const e = Math.abs(this.el.scrollLeft - (this.el.scrollWidth - this.el.offsetWidth)) > 1, t = this.el.scrollLeft > 0;
    this.el.className = "categoryButtonsContainer", t && e ? this.el.classList.add("has-overflow-both") : t ? this.el.classList.add("has-overflow-left") : e && this.el.classList.add("has-overflow-right");
  }
  renderSync() {
    return this.tabViews = this.categories.map((e) => this.viewFactory.create(is, { category: e, icon: D[e.key] })), super.renderSync({
      tabs: this.tabViews.map((e) => e.renderSync())
    }), this.el;
  }
  get currentCategory() {
    return this.categories[this.activeCategoryIndex];
  }
  get currentTabView() {
    return this.tabViews[this.activeCategoryIndex];
  }
  setActiveTab(e, t = {}) {
    this.checkOverflow();
    const s = this.currentTabView, o = this.tabViews[e];
    s.setActive(!1, t), o.setActive(!0, t), this.activeCategoryIndex = e;
  }
  getTargetCategory(e) {
    return e < 0 ? this.categories.length - 1 : e >= this.categories.length ? 0 : e;
  }
  stepSelectedTab(e) {
    return () => {
      const t = this.activeCategoryIndex + e;
      this.setActiveTab(this.getTargetCategory(t), {
        changeFocusable: !0,
        performFocus: !0
      });
    };
  }
}
const ns = [
  { version: 15, emoji: String.fromCodePoint(129768) },
  { version: 14, emoji: String.fromCodePoint(128733) },
  { version: 13, emoji: String.fromCodePoint(129729) },
  { version: 12, emoji: String.fromCodePoint(129449) },
  { version: 11, emoji: String.fromCodePoint(129463) },
  { version: 5, emoji: String.fromCodePoint(129322) },
  { version: 4, emoji: String.fromCodePoint(9877) },
  { version: 3, emoji: String.fromCodePoint(129314) },
  { version: 2, emoji: String.fromCodePoint(128488) },
  { version: 1, emoji: String.fromCodePoint(128512) }
];
function cs() {
  var e;
  const i = ns.find((t) => ls(t.emoji));
  return (e = i == null ? void 0 : i.version) != null ? e : 1;
}
function ls(i) {
  const e = document.createElement("canvas").getContext("2d");
  if (e)
    return e.textBaseline = "top", e.font = "32px Arial", e.fillText(i, 0, 0), e.getImageData(16, 16, 1, 1).data[0] !== 0;
}
function W(i, e) {
  return Array.from({ length: i }, () => e).join("");
}
function hs({ showHeader: i, classes: e }) {
  return i ? `
    <header class="${e.header}">
      <div data-view="search"></div>
      <div data-view="categoryTabs" data-render="sync"></div>
    </header>
  ` : "";
}
function ds(i) {
  const { classes: e, theme: t, className: s = "" } = i;
  return `
    <div class="picmo-picker ${e.picker} ${t} ${s}">
      ${hs(i)}
      <div class="${e.content}">
        <div data-view="emojiArea"></div>
      </div>
      <div data-view="preview"></div>
    </div>
  `;
}
function ms(i) {
  const { emojiCount: e, classes: t, theme: s, className: o, categoryCount: r } = i, a = ({ showSearch: d, classes: h }) => d ? `
    <div class="${h.searchSkeleton}">
      <div class="${h.searchInput} ${h.placeholder}"></div>
    </div>
  ` : "", n = ({ showCategoryTabs: d, classes: h }) => d ? `
    <div class="${h.categoryTabsSkeleton}">
      ${W(r, `<div class="${h.placeholder} ${h.categoryTab}"></div>`)}
    </div>
  ` : "", l = ({ showHeader: d, classes: h }) => d ? `
    <header class="${h.headerSkeleton}">
      ${a(i)}
      ${n(i)}
    </header>
  ` : "", m = ({ showPreview: d, classes: h }) => d ? `
    <div class="${h.previewSkeleton}">
      <div class="${h.placeholder} ${h.previewEmoji}"></div>
      <div class="${h.placeholder} ${h.previewName}"></div>
      <ul class="${h.tagList}">
        ${W(3, `<li class="${h.placeholder} ${h.tag}"></li>`)}
      </ul>
    </div>
  ` : "";
  return `
    <div class="picmo-picker ${t.skeleton} ${t.picker} ${s} ${o}">
      ${l(i)}
      <div class="${t.contentSkeleton}">
        <div class="${t.placeholder} ${t.categoryName}"></div>
        <div class="${t.emojiGrid}">
          ${W(e, `<div class="${t.placeholder} ${t.emoji}"></div>`)}
        </div>
      </div>
      ${m(i)}
    </div>
  `;
}
const us = new u((i) => i.isLoaded ? ds(i) : ms(i)), T = g(
  "picker",
  "skeleton",
  "placeholder",
  "searchSkeleton",
  "searchInput",
  "categoryTabsSkeleton",
  "headerSkeleton",
  "categoryTab",
  "contentSkeleton",
  "categoryName",
  "emojiGrid",
  "emoji",
  "previewSkeleton",
  "previewEmoji",
  "previewName",
  "tagList",
  "tag",
  "overlay",
  "content",
  "fullHeight",
  "pluginContainer",
  "header"
), R = {
  emojisPerRow: "--emojis-per-row",
  visibleRows: "--row-count",
  emojiSize: "--emoji-size"
};
class gs extends c {
  constructor() {
    super({ template: us, classes: T }), this.pickerReady = !1, this.externalEvents = new St(), this.updaters = {
      styleProperty: (e) => (t) => this.el.style.setProperty(R[e], t.toString()),
      theme: (e) => {
        const t = this.options.theme, s = this.el.closest(`.${t}`);
        this.el.classList.remove(t), s == null || s.classList.remove(t), this.el.classList.add(e), s == null || s.classList.add(e);
      },
      className: (e) => {
        this.options.className && this.el.classList.remove(this.options.className), this.el.classList.add(e);
      },
      emojisPerRow: this.updateStyleProperty.bind(this, "emojisPerRow"),
      emojiSize: this.updateStyleProperty.bind(this, "emojiSize"),
      visibleRows: this.updateStyleProperty.bind(this, "visibleRows")
    };
  }
  initialize() {
    this.uiElements = {
      pickerContent: c.byClass(T.content),
      header: c.byClass(T.header)
    }, this.uiEvents = [
      c.uiEvent("keydown", this.handleKeyDown)
    ], this.appEvents = {
      error: this.onError,
      reinitialize: this.reinitialize,
      "data:ready": this.onDataReady,
      "content:show": this.showContent,
      "variantPopup:hide": this.hideVariantPopup,
      "emoji:select": this.selectEmoji
    }, super.initialize(), this.options.recentsProvider;
  }
  destroy() {
    var e, t;
    super.destroy(), (e = this.search) == null || e.destroy(), this.emojiArea.destroy(), (t = this.categoryTabs) == null || t.destroy(), this.events.removeAll(), this.externalEvents.removeAll();
  }
  clearRecents() {
    this.options.recentsProvider.clear();
  }
  addEventListener(e, t) {
    this.externalEvents.on(e, t);
  }
  removeEventListener(e, t) {
    this.externalEvents.off(e, t);
  }
  initializePickerView() {
    this.pickerReady && (this.showContent(), this.emojiArea.reset(!1));
  }
  handleKeyDown(e) {
    const t = e.ctrlKey || e.metaKey;
    e.key === "s" && t && this.search && (e.preventDefault(), this.search.focus());
  }
  buildChildViews() {
    return this.options.showPreview && (this.preview = this.viewFactory.create(Yt)), this.options.showSearch && (this.search = this.viewFactory.create(Zt, {
      categories: this.categories,
      emojiVersion: this.emojiVersion
    })), this.options.showCategoryTabs && (this.categoryTabs = this.viewFactory.create(as, {
      categories: this.categories
    })), this.currentView = this.emojiArea = this.viewFactory.create(Ut, {
      categoryTabs: this.categoryTabs,
      categories: this.categories,
      emojiVersion: this.emojiVersion
    }), [this.preview, this.search, this.emojiArea, this.categoryTabs];
  }
  setStyleProperties() {
    this.options.showSearch || this.el.style.setProperty("--search-height-full", "0px"), this.options.showCategoryTabs || (this.el.style.setProperty("--category-tabs-height", "0px"), this.el.style.setProperty("--category-tabs-offset", "0px")), this.options.showPreview || this.el.style.setProperty("--emoji-preview-height-full", "0px"), Object.keys(R).forEach((e) => {
      this.options[e] && this.el.style.setProperty(R[e], this.options[e].toString());
    });
  }
  updateStyleProperty(e, t) {
    this.el.style.setProperty(R[e], t.toString());
  }
  reinitialize() {
    this.renderSync();
  }
  onError(e) {
    const t = this.viewFactory.create(Wt, { message: this.i18n.get("error.load") }), s = this.el.offsetHeight || 375;
    throw this.el.style.height = `${s}px`, this.el.replaceChildren(t.renderSync()), e;
  }
  async onDataReady(e) {
    const t = this.el;
    try {
      e ? this.emojiData = e : await this.emojiDataPromise, this.options.emojiVersion === "auto" ? this.emojiVersion = cs() || parseFloat($e) : this.emojiVersion = this.options.emojiVersion, this.categories = await this.emojiData.getCategories(this.options);
      const [s, o, r, a] = this.buildChildViews();
      await super.render({
        isLoaded: !0,
        search: o,
        categoryTabs: a,
        emojiArea: r,
        preview: s,
        showHeader: Boolean(this.search || this.categoryTabs),
        theme: this.options.theme,
        className: this.options.className
      }), this.el.style.setProperty("--category-count", this.categories.length.toString()), this.pickerReady = !0, t.replaceWith(this.el), this.setStyleProperties(), this.initializePickerView(), this.setInitialFocus(), this.externalEvents.emit("data:ready");
    } catch (s) {
      this.events.emit("error", s);
    }
  }
  renderSync() {
    var t;
    let e = ((t = this.options.categories) == null ? void 0 : t.length) || 10;
    if (this.options.showRecents && (e += 1), super.renderSync({
      isLoaded: !1,
      theme: this.options.theme,
      showSearch: this.options.showSearch,
      showPreview: this.options.showPreview,
      showCategoryTabs: this.options.showCategoryTabs,
      showHeader: this.options.showSearch || this.options.showCategoryTabs,
      emojiCount: this.options.emojisPerRow * this.options.visibleRows,
      categoryCount: e
    }), this.el.style.setProperty("--category-count", e.toString()), !this.options.rootElement)
      throw new Error("Picker must be given a root element via the rootElement option");
    return this.options.rootElement.replaceChildren(this.el), this.setStyleProperties(), this.pickerReady && this.initializePickerView(), this.el;
  }
  getInitialFocusTarget() {
    if (typeof this.options.autoFocus < "u")
      switch (this.options.autoFocus) {
        case "emojis":
          return this.emojiArea.focusableEmoji;
        case "search":
          return this.search;
        case "auto":
          return this.search || this.emojiArea.focusableEmoji;
        default:
          return null;
      }
    if (this.options.autoFocusSearch === !0)
      return console.warn("options.autoFocusSearch is deprecated, please use options.focusTarget instead"), this.search;
  }
  setInitialFocus() {
    var e;
    !this.pickerReady || (e = this.getInitialFocusTarget()) == null || e.focus();
  }
  reset(e = !0) {
    var t;
    this.pickerReady && (this.emojiArea.reset(e), this.showContent(this.emojiArea)), (t = this.search) == null || t.clear(), this.hideVariantPopup();
  }
  showContent(e = this.emojiArea) {
    var t, s;
    e !== this.currentView && (this.currentView !== this.emojiArea && ((t = this.currentView) == null || t.destroy()), this.ui.pickerContent.classList.toggle(T.fullHeight, e !== this.emojiArea), this.ui.pickerContent.replaceChildren(e.el), this.currentView = e, e === this.emojiArea ? (this.emojiArea.reset(), this.categoryTabs && this.ui.header.appendChild(this.categoryTabs.el)) : (s = this.categoryTabs) == null || s.el.remove());
  }
  hideVariantPopup() {
    var e;
    (e = this.variantPopup) == null || e.destroy();
  }
  isPickerClick(e) {
    var r, a;
    const t = e.target, s = this.el.contains(t), o = (a = (r = this.variantPopup) == null ? void 0 : r.el) == null ? void 0 : a.contains(t);
    return s || o;
  }
  async selectEmoji({ emoji: e }) {
    var t, s;
    ((t = e.skins) == null ? void 0 : t.length) && this.options.showVariants && !this.isVariantPopupOpen ? this.showVariantPopup(e) : (await ((s = this.variantPopup) == null ? void 0 : s.animateHide()), this.events.emit("variantPopup:hide"), await this.emitEmoji(e));
  }
  get isVariantPopupOpen() {
    return this.variantPopup && !this.variantPopup.isDestroyed;
  }
  async showVariantPopup(e) {
    const t = document.activeElement;
    this.events.once("variantPopup:hide", () => {
      t == null || t.focus();
    }), this.variantPopup = this.viewFactory.create(ts, { emoji: e, parent: this.el }), this.el.appendChild(this.variantPopup.renderSync()), this.variantPopup.activate();
  }
  async emitEmoji(e) {
    this.externalEvents.emit("emoji:select", await this.renderer.doEmit(e)), this.options.recentsProvider.addOrUpdateRecent(e, this.options.maxRecents), this.events.emit("recent:add", e);
  }
  updateOptions(e) {
    Object.keys(e).forEach((t) => {
      this.updaters[t](e[t]);
    }), Object.assign(this.options, e);
  }
}
class ps {
  constructor({ events: e, i18n: t, renderer: s, emojiData: o, options: r, customEmojis: a = [], pickerId: n }) {
    this.events = e, this.i18n = t, this.renderer = s, this.emojiData = o, this.options = r, this.customEmojis = a, this.pickerId = n;
  }
  setEmojiData(e) {
    this.emojiData = Promise.resolve(e);
  }
  create(e, ...t) {
    const s = new e(...t);
    return s.setPickerId(this.pickerId), s.setEvents(this.events), s.setI18n(this.i18n), s.setRenderer(this.renderer), s.setEmojiData(this.emojiData), s.setOptions(this.options), s.setCustomEmojis(this.customEmojis), s.viewFactory = this, s.initialize(), s;
  }
}
var L;
class ys {
  constructor(e = {}) {
    f(this, L, void 0);
    A(this, L, new Map(Object.entries(e)));
  }
  get(e, t = e) {
    return y(this, L).get(e) || t;
  }
}
L = new WeakMap();
function fs(i, e) {
  e === void 0 && (e = {});
  var t = e.insertAt;
  if (!(!i || typeof document > "u")) {
    var s = document.head || document.getElementsByTagName("head")[0], o = document.createElement("style");
    o.type = "text/css", t === "top" && s.firstChild ? s.insertBefore(o, s.firstChild) : s.appendChild(o), o.styleSheet ? o.styleSheet.cssText = i : o.appendChild(document.createTextNode(i));
  }
}
function vs() {
  let i = !1;
  return function(t) {
    Et.injectStyles && !i && (fs(t), i = !0);
  };
}
const ws = `.picmo-picker .icon{width:1.25em;height:1em;fill:currentColor}.icon-small{font-size:.8em}.icon-medium{font-size:1em}.icon-large{font-size:1.25em}.icon-2x{font-size:2em}.icon-3x{font-size:3em}.icon-4x{font-size:4em}.icon-5x{font-size:5em}.icon-8x{font-size:8em}.icon-10x{font-size:10em}.light,.auto{color-scheme:light;--accent-color: #4f46e5;--background-color: #f9fafb;--border-color: #cccccc;--category-name-background-color: #f9fafb;--category-name-button-color: #999999;--category-name-text-color: hsl(214, 30%, 50%);--category-tab-active-background-color: rgba(255, 255, 255, .6);--category-tab-active-color: var(--accent-color);--category-tab-color: #666;--category-tab-highlight-background-color: rgba(0, 0, 0, .15);--error-color-dark: hsl(0, 100%, 45%);--error-color: hsl(0, 100%, 40%);--focus-indicator-background-color: hsl(198, 65%, 85%);--focus-indicator-color: #333333;--hover-background-color: #c7d2fe;--placeholder-background-color: #cccccc;--search-background-color: #f9fafb;--search-focus-background-color: #ffffff;--search-icon-color: #999999;--search-placeholder-color: #71717a;--secondary-background-color: #e2e8f0;--secondary-text-color: #666666;--tag-background-color: rgba(162, 190, 245, .3);--text-color: #000000;--variant-popup-background-color: #ffffff}.dark{color-scheme:dark;--accent-color: #A580F9;--background-color: #333333;--border-color: #666666;--category-name-background-color: #333333;--category-name-button-color: #eeeeee;--category-name-text-color: #ffffff;--category-tab-active-background-color: #000000;--category-tab-active-color: var(--accent-color);--category-tab-color: #cccccc;--category-tab-highlight-background-color: #4A4A4A;--error-color-dark: hsl(0, 7%, 3%);--error-color: hsl(0, 30%, 60%);--focus-indicator-background-color: hsl(0, 0%, 50%);--focus-indicator-color: #999999;--hover-background-color: hsla(0, 0%, 40%, .85);--image-placeholder-color: #ffffff;--placeholder-background-color: #666666;--search-background-color: #71717a;--search-focus-background-color: #52525b;--search-icon-color: #cccccc;--search-placeholder-color: #d4d4d8;--secondary-background-color: #000000;--secondary-text-color: #999999;--tag-background-color: rgba(162, 190, 245, .3);--text-color: #ffffff;--variant-popup-background-color: #333333}@media (prefers-color-scheme: dark){.auto{color-scheme:dark;--accent-color: #A580F9;--background-color: #333333;--border-color: #666666;--category-name-background-color: #333333;--category-name-button-color: #eeeeee;--category-name-text-color: #ffffff;--category-tab-active-background-color: #000000;--category-tab-active-color: var(--accent-color);--category-tab-color: #cccccc;--category-tab-highlight-background-color: #4A4A4A;--error-color-dark: hsl(0, 7%, 3%);--error-color: hsl(0, 30%, 60%);--focus-indicator-background-color: hsl(0, 0%, 50%);--focus-indicator-color: #999999;--hover-background-color: hsla(0, 0%, 40%, .85);--image-placeholder-color: #ffffff;--placeholder-background-color: #666666;--search-background-color: #71717a;--search-focus-background-color: #52525b;--search-icon-color: #cccccc;--search-placeholder-color: #d4d4d8;--secondary-background-color: #000000;--secondary-text-color: #999999;--tag-background-color: rgba(162, 190, 245, .3);--text-color: #ffffff;--variant-popup-background-color: #333333}}.picmo-picker .categoryButtonsContainer{overflow:auto;padding:2px 0}.picmo-picker .categoryButtonsContainer.has-overflow-right{mask-image:linear-gradient(270deg,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 10%);-webkit-mask-image:linear-gradient(270deg,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 10%)}.picmo-picker .categoryButtonsContainer.has-overflow-left{mask-image:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 10%);-webkit-mask-image:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 10%)}.picmo-picker .categoryButtonsContainer.has-overflow-both{mask-image:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 10%,rgba(255,255,255,1) 90%,rgba(255,255,255,0) 100%);-webkit-mask-image:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 10%,rgba(255,255,255,1) 90%,rgba(255,255,255,0) 100%)}.picmo-picker .categoryButtons{display:flex;flex-direction:row;gap:var(--tab-gap);margin:0;padding:0 .5em;align-items:center;height:var(--category-tabs-height);box-sizing:border-box;width:100%;justify-content:space-between;position:relative;list-style-type:none;justify-self:center;max-width:min(23.55rem,calc(var(--category-count, 1) * 2.5rem))}.picmo-picker .categoryButtons .categoryTab{display:flex;align-items:center;transition:all .1s;width:2em}.picmo-picker .categoryButtons .categoryTab.categoryTabActive .categoryButton{color:var(--category-tab-active-color);background:linear-gradient(rgba(255,255,255,.75) 0%,rgba(255,255,255,.75) 100%),linear-gradient(var(--category-tab-active-color) 0%,var(--category-tab-active-color) 100%);border:2px solid var(--category-tab-active-color)}.picmo-picker .categoryButtons .categoryTab.categoryTabActive .categoryButton:hover{background-color:var(--category-tab-active-background-color)}.picmo-picker .categoryButtons .categoryTab button.categoryButton{border-radius:5px;background:transparent;border:2px solid transparent;color:var(--category-tab-color);cursor:pointer;padding:2px;vertical-align:middle;display:flex;align-items:center;justify-content:center;font-size:1.2rem;width:1.6em;height:1.6em;transition:all .1s}.picmo-picker .categoryButtons .categoryTab button.categoryButton:is(img){width:var(--category-tab-size);height:var(--category-tab-size)}.picmo-picker .categoryButtons .categoryTab button.categoryButton:hover{background:var(--category-tab-highlight-background-color)}.dataError [data-icon]{opacity:.8}@keyframes appear{0%{opacity:0}to{opacity:.8}}@keyframes appear-grow{0%{opacity:0;transform:scale(.8)}to{opacity:.8;transform:scale(1)}}.picmo-picker .error{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:var(--secondary-text-color)}.picmo-picker .error .iconContainer{opacity:.8;animation:appear-grow .25s cubic-bezier(.175,.885,.32,1.275);--color-primary: var(--error-color);--color-secondary: var(--error-color-dark)}.picmo-picker .error .title{animation:appear .25s;animation-delay:50ms;animation-fill-mode:both}.picmo-picker .error button{padding:8px 16px;cursor:pointer;background:var(--background-color);border:1px solid var(--text-color);border-radius:5px;color:var(--text-color)}.picmo-picker .error button:hover{background:var(--text-color);color:var(--background-color)}.emojiButton{background:transparent;border:none;border-radius:15px;cursor:pointer;display:flex;font-family:var(--emoji-font);font-size:var(--emoji-size);height:100%;justify-content:center;align-items:center;margin:0;overflow:hidden;padding:0;width:100%}.emojiButton:hover{background:var(--hover-background-color)}.emojiButton:focus{border-radius:0;background:var(--focus-indicator-background-color);outline:1px solid var(--focus-indicator-color)}.picmo-picker .emojiArea{height:var(--emoji-area-height);overflow-y:auto;position:relative}.picmo-picker .emojiCategory{position:relative}.picmo-picker .emojiCategory .categoryName{font-size:.9em;padding:.5rem;margin:0;background:var(--category-name-background-color);color:var(--category-name-text-color);top:0;z-index:1;display:grid;gap:4px;grid-template-columns:auto 1fr auto;align-items:center;line-height:1;box-sizing:border-box;height:var(--category-name-height);justify-content:flex-start;text-transform:uppercase}.picmo-picker .emojiCategory .categoryName button{background:transparent;border:none;display:flex;align-items:center;cursor:pointer;color:var(--category-name-button-color)}.picmo-picker .emojiCategory .categoryName button:hover{opacity:1}.picmo-picker .emojiCategory .noRecents{color:var(--secondary-text-color);grid-column:1 / span var(--emojis-per-row);font-size:.9em;text-align:center;display:flex;align-items:center;justify-content:center;min-height:calc(var(--emoji-size) * var(--emoji-size-multiplier))}.picmo-picker .emojiCategory .recentEmojis[data-empty=true]{display:none}:is(.picmo-picker .emojiCategory) .recentEmojis[data-empty=false]+div{display:none}.picmo-picker .emojiContainer{display:grid;justify-content:space-between;gap:1px;padding:0 .5em;grid-template-columns:repeat(var(--emojis-per-row),calc(var(--emoji-size) * var(--emoji-size-multiplier)));grid-auto-rows:calc(var(--emoji-size) * var(--emoji-size-multiplier));align-items:center;justify-items:center}.picmo-picker.picker{--border-radius: 5px;--emoji-area-height: calc( (var(--row-count) * var(--emoji-size) * var(--emoji-size-multiplier)) + var(--category-name-height) );--content-height: var(--emoji-area-height);--emojis-per-row: 8;--row-count: 6;--emoji-preview-margin: 4px;--emoji-preview-height: calc(var(--emoji-preview-size) + 1em + 1px);--emoji-preview-height-full: calc(var(--emoji-preview-height) + var(--emoji-preview-margin));--emoji-preview-size: 2.75em;--emoji-size: 2rem;--emoji-size-multiplier: 1.3;--content-margin: 8px;--category-tabs-height:calc(1.5em + 9px);--category-tabs-offset: 8px;--category-tab-size: 1.2rem;--category-name-height: 2rem;--category-name-padding-y: 6px;--search-height: 2em;--search-margin: .5em;--search-margin-bottom: 4px;--search-height-full: calc(var(--search-height) + var(--search-margin) + var(--search-margin-bottom));--overlay-background-color: rgba(0, 0, 0, .8);--emoji-font: "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "Apple Color Emoji", "Twemoji Mozilla", "Noto Color Emoji", "EmojiOne Color", "Android Emoji";--ui-font: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;--ui-font-size: 16px;--picker-width: calc(var(--emojis-per-row) * var(--emoji-size) * var(--emoji-size-multiplier) + 2.75rem);--preview-background-color: var(--secondary-background-color);background:var(--background-color);border-radius:var(--border-radius);border:1px solid var(--border-color);font-family:var(--ui-font);font-size:var(--ui-font-size);overflow:hidden;position:relative;width:var(--picker-width);display:grid;gap:8px}.picmo-picker.picker>*{font-family:var(--ui-font)}.picmo-picker.skeleton{background:var(--background-color);border-radius:var(--border-radius);border:1px solid var(--border-color);font-family:var(--ui-font);width:var(--picker-width);color:var(--secondary-text-color)}.picmo-picker.skeleton *{box-sizing:border-box}.picmo-picker.skeleton .placeholder{background:var(--placeholder-background-color);position:relative;overflow:hidden}.picmo-picker.skeleton .placeholder:after{position:absolute;top:0;right:0;bottom:0;left:0;transform:translate(-100%);background-image:linear-gradient(90deg,rgba(255,255,255,0) 0,rgba(255,255,255,.2) 20%,rgba(255,255,255,.5) 60%,rgba(255,255,255,0) 100%);animation:shine 2s infinite;content:""}.picmo-picker.skeleton .headerSkeleton{background-color:var(--secondary-background-color);padding-top:8px;padding-bottom:8px;display:flex;flex-direction:column;overflow:hidden;gap:8px;border-bottom:1px solid var(--border-color);width:var(--picker-width)}.picmo-picker.skeleton .searchSkeleton{padding:0 8px;height:var(--search-height)}.picmo-picker.skeleton .searchSkeleton .searchInput{width:100%;height:28px;border-radius:3px}.picmo-picker.skeleton .categoryTabsSkeleton{height:var(--category-tabs-height);display:flex;flex-direction:row;align-items:center;justify-self:center;width:calc(2rem * var(--category-count, 1))}.picmo-picker.skeleton .categoryTabsSkeleton .categoryTab{width:25px;height:25px;padding:2px;border-radius:5px;margin:.25em}.picmo-picker.skeleton .contentSkeleton{height:var(--content-height);padding-right:8px;opacity:.7}.picmo-picker.skeleton .contentSkeleton .categoryName{width:50%;height:1rem;margin:.5rem;box-sizing:border-box}.picmo-picker.skeleton .contentSkeleton .emojiGrid{display:grid;justify-content:space-between;gap:1px;padding:0 .5em;grid-template-columns:repeat(var(--emojis-per-row),calc(var(--emoji-size) * var(--emoji-size-multiplier)));grid-auto-rows:calc(var(--emoji-size) * var(--emoji-size-multiplier));align-items:center;justify-items:center;width:var(--picker-width)}.picmo-picker.skeleton .contentSkeleton .emojiGrid .emoji{width:var(--emoji-size);height:var(--emoji-size);border-radius:50%}.picmo-picker.skeleton .previewSkeleton{height:var(--emoji-preview-height);border-top:1px solid var(--border-color);display:grid;align-items:center;padding:.5em;gap:6px;grid-template-columns:auto 1fr;grid-template-rows:auto 1fr;grid-template-areas:"emoji name" "emoji tags"}.picmo-picker.skeleton .previewSkeleton .previewEmoji{grid-area:emoji;border-radius:50%;width:var(--emoji-preview-size);height:var(--emoji-preview-size)}.picmo-picker.skeleton .previewSkeleton .previewName{grid-area:name;height:.8em;width:80%}.picmo-picker.skeleton .previewSkeleton .tagList{grid-area:tags;list-style-type:none;display:flex;flex-direction:row;padding:0;margin:0}.picmo-picker.skeleton .previewSkeleton .tagList .tag{border-radius:3px;padding:2px 8px;margin-right:.25em;height:1em;width:20%}.overlay{background:rgba(0,0,0,.75);height:100%;left:0;position:fixed;top:0;width:100%;z-index:1000}.content{position:relative;overflow:hidden;height:var(--content-height)}.content.fullHeight{height:calc(var(--content-height) + var(--category-tabs-height) + var(--category-tabs-offset));overflow-y:auto}.pluginContainer{margin:.5em;display:flex;flex-direction:row}.header{background-color:var(--secondary-background-color);padding-top:8px;padding-bottom:8px;display:grid;gap:8px;border-bottom:1px solid var(--border-color)}@media (prefers-reduced-motion: reduce){.placeholder{background:var(--placeholder-background-color);position:relative;overflow:hidden}.placeholder:after{display:none}}.picmo-picker .preview{border-top:1px solid var(--border-color);display:grid;align-items:center;gap:6px;grid-template-columns:auto 1fr;grid-template-rows:auto 1fr;grid-template-areas:"emoji name" "emoji tags";height:var(--emoji-preview-height);box-sizing:border-box;padding:.5em;position:relative;background:var(--preview-background-color)}.picmo-picker .preview .previewEmoji{grid-area:emoji;font-size:var(--emoji-preview-size);font-family:var(--emoji-font);width:1.25em;display:flex;align-items:center;justify-content:center}.picmo-picker .preview .previewName{grid-area:name;color:var(--text-color);font-size:.8em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:500}.picmo-picker .preview .tagList{grid-area:tags;list-style-type:none;display:flex;flex-direction:row;padding:0;margin:0;font-size:.75em;overflow:hidden}.picmo-picker .preview .tag{border-radius:3px;background:var(--tag-background-color);color:var(--text-color);padding:2px 8px;margin-right:.25em;white-space:nowrap}.picmo-picker .preview .tag:last-child{margin-right:0}.picmo-picker .searchContainer{display:flex;height:var(--search-height);box-sizing:border-box;padding:0 8px;position:relative}.picmo-picker .searchContainer .searchField{background:var(--search-background-color);border-radius:3px;border:none;box-sizing:border-box;color:var(--text-color);font-size:.9em;outline:none;padding:.5em 2.25em .5em .5em;width:100%}.picmo-picker .searchContainer .searchField:focus{background:var(--search-focus-background-color)}.picmo-picker .searchContainer .searchField::placeholder{color:var(--search-placeholder-color)}.picmo-picker .searchContainer .searchAccessory{color:var(--search-icon-color);height:100%;position:absolute;right:1em;top:0;width:1.25rem;display:flex;align-items:center}.picmo-picker .searchContainer .searchAccessory svg{fill:var(--search-icon-color)}.picmo-picker .searchContainer .clearButton{border:0;color:var(--search-icon-color);background:transparent;cursor:pointer}.picmo-picker .searchContainer .clearSearchButton{cursor:pointer;border:none;background:transparent;color:var(--search-icon-color);font-size:1em;width:100%;height:100%;display:flex;align-items:center;padding:0}.picmo-picker .searchContainer .notFound [data-icon]{fill:#f3e265}.picmo-picker .variantOverlay{background:var(--overlay-background-color);border-radius:5px;display:flex;flex-direction:column;height:100%;justify-content:center;left:0;position:absolute;top:0;width:100%;z-index:1}.picmo-picker .variantOverlay .variantPopup{background:var(--variant-popup-background-color);border-radius:5px;margin:.5em;padding:.5em;text-align:center;user-select:none;display:flex;align-items:center;justify-content:center}.customEmoji{width:1em;height:1em}@keyframes shine{to{transform:translate(100%)}}.picmo-picker .imagePlaceholder{width:2rem;height:2rem;border-radius:50%}.placeholder{background:#DDDBDD;position:relative}.placeholder:after{position:absolute;top:0;right:0;bottom:0;left:0;transform:translate(-100%);background-image:linear-gradient(90deg,rgba(255,255,255,0) 0,rgba(255,255,255,.2) 20%,rgba(255,255,255,.5) 60%,rgba(255,255,255,0) 100%);animation:shine 2s infinite;content:""}
`;
function bs(i) {
  return re(i.locale, i.dataStore, i.messages, i.emojiData);
}
let Cs = 0;
function js() {
  return `picmo-${Date.now()}-${Cs++}`;
}
const ks = vs();
function Ls(i) {
  ks(ws);
  const e = kt(i), t = ((e == null ? void 0 : e.custom) || []).map((l) => ({
    ...l,
    custom: !0,
    tags: ["custom", ...l.tags || []]
  })), s = new xt(), o = bs(e), r = new ys(e.i18n);
  o.then((l) => {
    s.emit("data:ready", l);
  }).catch((l) => {
    s.emit("error", l);
  });
  const n = new ps({
    events: s,
    i18n: r,
    customEmojis: t,
    renderer: e.renderer,
    options: e,
    emojiData: o,
    pickerId: js()
  }).create(gs);
  return n.renderSync(), n;
}
const _ = {};
function Es(i) {
  return _[i] || (_[i] = new xs(i)), _[i];
}
Es.deleteDatabase = (i) => {
};
class xs extends ke {
  open() {
    return Promise.resolve();
  }
  delete() {
    return Promise.resolve();
  }
  close() {
  }
  isPopulated() {
    return Promise.resolve(!1);
  }
  getEmojiCount() {
    return Promise.resolve(this.emojis.length);
  }
  getEtags() {
    return Promise.resolve({ foo: "bar" });
  }
  getHash() {
    return Promise.resolve("");
  }
  populate(e) {
    return this.categories = e.groups, this.emojis = e.emojis, Promise.resolve();
  }
  getCategories(e) {
    var s;
    let t = this.categories.filter((o) => o.key !== "component");
    if (e.showRecents && t.unshift({ key: "recents", order: -1 }), (s = e.custom) != null && s.length && t.push({ key: "custom", order: 10 }), e.categories) {
      const o = e.categories;
      t = t.filter((r) => o.includes(r.key)), t.sort((r, a) => o.indexOf(r.key) - o.indexOf(a.key));
    } else
      t.sort((o, r) => o.order - r.order);
    return Promise.resolve(t);
  }
  getEmojis(e, t) {
    const s = this.emojis.filter((o) => o.group === e.order).filter((o) => o.version <= t).sort((o, r) => o.order != null && r.order != null ? o.order - r.order : 0).map(E);
    return Promise.resolve(M(s, t));
  }
  searchEmojis(e, t, s, o) {
    const r = this.emojis.filter((l) => B(l, e, o)).map(E), a = t.filter((l) => B(l, e, o)), n = [
      ...M(r, s),
      ...a
    ];
    return Promise.resolve(n);
  }
  setMeta(e) {
    this.meta = e;
  }
}
class Fs extends xe {
  constructor() {
    super(sessionStorage);
  }
}
async function As(i, e, t, s) {
  (await re(i, e, t, s)).close();
}



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
  !*** ./assets/form-defer.emoji.js ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_js_forms_form_type_emoji_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/js/forms/form-type-emoji.js */ "./assets/styles/js/forms/form-type-emoji.js");

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckJxSTtBQUNySTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsSUFBSSw0QkFBNEI7QUFDaEMsa0JBQWtCLGNBQWM7QUFDaEM7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKLFNBQVMsY0FBYztBQUN2QjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLDBDQUEwQztBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLDBDQUEwQztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvc3R5bGVzL2pzL2Zvcm1zL2Zvcm0tdHlwZS1lbW9qaS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYS1jYWxsYWJsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYW4tb2JqZWN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1mb3ItZWFjaC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktaW5jbHVkZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FycmF5LWl0ZXJhdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLWlzLXN0cmljdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktc3BlY2llcy1jb25zdHJ1Y3Rvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktc3BlY2llcy1jcmVhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NsYXNzb2YtcmF3LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jbGFzc29mLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jb3B5LWNvbnN0cnVjdG9yLXByb3BlcnRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2RlZmluZS1idWlsdC1pbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZGVmaW5lLWdsb2JhbC1wcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZGVzY3JpcHRvcnMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2RvY3VtZW50LWFsbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZG9jdW1lbnQtY3JlYXRlLWVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2RvbS1pdGVyYWJsZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2RvbS10b2tlbi1saXN0LXByb3RvdHlwZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZW5naW5lLXVzZXItYWdlbnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2VuZ2luZS12OC12ZXJzaW9uLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbnVtLWJ1Zy1rZXlzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9leHBvcnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2ZhaWxzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi1iaW5kLWNvbnRleHQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2Z1bmN0aW9uLWJpbmQtbmF0aXZlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi1jYWxsLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi1uYW1lLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMtY2xhdXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2dldC1idWlsdC1pbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZ2V0LW1ldGhvZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9oaWRkZW4ta2V5cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaWU4LWRvbS1kZWZpbmUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2luZGV4ZWQtb2JqZWN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pbnNwZWN0LXNvdXJjZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaW50ZXJuYWwtc3RhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLWFycmF5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1jYWxsYWJsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtY29uc3RydWN0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLWZvcmNlZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtbnVsbC1vci11bmRlZmluZWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLW9iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtcHVyZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtc3ltYm9sLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9sZW5ndGgtb2YtYXJyYXktbGlrZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbWFrZS1idWlsdC1pbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbWF0aC10cnVuYy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktbmFtZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LXN5bWJvbHMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1pcy1wcm90b3R5cGUtb2YuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1rZXlzLWludGVybmFsLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtcHJvcGVydHktaXMtZW51bWVyYWJsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LXRvLXN0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb3JkaW5hcnktdG8tcHJpbWl0aXZlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vd24ta2V5cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zaGFyZWQta2V5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zaGFyZWQtc3RvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NoYXJlZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc3ltYm9sLWNvbnN0cnVjdG9yLWRldGVjdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tYWJzb2x1dGUtaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1pbnRlZ2VyLW9yLWluZmluaXR5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1sZW5ndGguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLW9iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tcHJpbWl0aXZlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1wcm9wZXJ0eS1rZXkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLXN0cmluZy10YWctc3VwcG9ydC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdHJ5LXRvLXN0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdWlkLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy91c2Utc3ltYm9sLWFzLXVpZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdjgtcHJvdG90eXBlLWRlZmluZS1idWcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3dlYWstbWFwLWJhc2ljLWRldGVjdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5hcnJheS5mb3ItZWFjaC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLm9iamVjdC50by1zdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIuZG9tLWNvbGxlY3Rpb25zLmZvci1lYWNoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AcGljbW8vcG9wdXAtcGlja2VyL2Rpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3BpY21vL2Rpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy8uL2Fzc2V0cy9mb3JtLWRlZmVyLmVtb2ppLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZVBvcHVwIH0gZnJvbSAnQHBpY21vL3BvcHVwLXBpY2tlcic7XG5pbXBvcnQgeyBhdXRvVGhlbWUsIGRhcmtUaGVtZSwgbGlnaHRUaGVtZSB9IGZyb20gJ3BpY21vJztcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkLmZvcm1fdHlwZVwiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZW1vamktZmllbGRdXCIpLmZvckVhY2goKGZ1bmN0aW9uIChlbCkge1xuXG4gICAgICAgIHZhciBwaWNrZXJPcHRpb25zID0ge1xuICAgICAgICAgICAgdGhlbWU6IGF1dG9UaGVtZVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBwb3B1cE9wdGlvbnMgPSB7XG4gICAgICAgICAgICB0cmlnZ2VyRWxlbWVudDogZWwsXG4gICAgICAgICAgICByZWZlcmVuY2VFbGVtZW50OiBlbFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHBvcHVwID0gY3JlYXRlUG9wdXAocGlja2VyT3B0aW9ucywgcG9wdXBPcHRpb25zKTtcbiAgICAgICAgICAgICAgICBwb3B1cC5hZGRFdmVudExpc3RlbmVyKCdlbW9qaTpzZWxlY3QnLCBldmVudCA9PiB7IGVsLnZhbHVlID0gZXZlbnQuZW1vamk7IH0pO1xuXG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7IHBvcHVwLnRvZ2dsZSgpOyB9KTtcbiAgICB9KSk7XG59KTtcbiIsInZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgdHJ5VG9TdHJpbmcgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdHJ5LXRvLXN0cmluZycpO1xuXG52YXIgJFR5cGVFcnJvciA9IFR5cGVFcnJvcjtcblxuLy8gYEFzc2VydDogSXNDYWxsYWJsZShhcmd1bWVudCkgaXMgdHJ1ZWBcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIGlmIChpc0NhbGxhYmxlKGFyZ3VtZW50KSkgcmV0dXJuIGFyZ3VtZW50O1xuICB0aHJvdyAkVHlwZUVycm9yKHRyeVRvU3RyaW5nKGFyZ3VtZW50KSArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG5cbnZhciAkU3RyaW5nID0gU3RyaW5nO1xudmFyICRUeXBlRXJyb3IgPSBUeXBlRXJyb3I7XG5cbi8vIGBBc3NlcnQ6IFR5cGUoYXJndW1lbnQpIGlzIE9iamVjdGBcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIGlmIChpc09iamVjdChhcmd1bWVudCkpIHJldHVybiBhcmd1bWVudDtcbiAgdGhyb3cgJFR5cGVFcnJvcigkU3RyaW5nKGFyZ3VtZW50KSArICcgaXMgbm90IGFuIG9iamVjdCcpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkZm9yRWFjaCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1pdGVyYXRpb24nKS5mb3JFYWNoO1xudmFyIGFycmF5TWV0aG9kSXNTdHJpY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLWlzLXN0cmljdCcpO1xuXG52YXIgU1RSSUNUX01FVEhPRCA9IGFycmF5TWV0aG9kSXNTdHJpY3QoJ2ZvckVhY2gnKTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS5mb3JFYWNoYCBtZXRob2QgaW1wbGVtZW50YXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZvcmVhY2hcbm1vZHVsZS5leHBvcnRzID0gIVNUUklDVF9NRVRIT0QgPyBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrZm4gLyogLCB0aGlzQXJnICovKSB7XG4gIHJldHVybiAkZm9yRWFjaCh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tYXJyYXktcHJvdG90eXBlLWZvcmVhY2ggLS0gc2FmZVxufSA6IFtdLmZvckVhY2g7XG4iLCJ2YXIgdG9JbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0Jyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWFic29sdXRlLWluZGV4Jyk7XG52YXIgbGVuZ3RoT2ZBcnJheUxpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbGVuZ3RoLW9mLWFycmF5LWxpa2UnKTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS57IGluZGV4T2YsIGluY2x1ZGVzIH1gIG1ldGhvZHMgaW1wbGVtZW50YXRpb25cbnZhciBjcmVhdGVNZXRob2QgPSBmdW5jdGlvbiAoSVNfSU5DTFVERVMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgZWwsIGZyb21JbmRleCkge1xuICAgIHZhciBPID0gdG9JbmRleGVkT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgbGVuZ3RoID0gbGVuZ3RoT2ZBcnJheUxpa2UoTyk7XG4gICAgdmFyIGluZGV4ID0gdG9BYnNvbHV0ZUluZGV4KGZyb21JbmRleCwgbGVuZ3RoKTtcbiAgICB2YXIgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmUgLS0gTmFOIGNoZWNrXG4gICAgaWYgKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKSB3aGlsZSAobGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmUgLS0gTmFOIGNoZWNrXG4gICAgICBpZiAodmFsdWUgIT0gdmFsdWUpIHJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I2luZGV4T2YgaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICAgIGlmICgoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTykgJiYgT1tpbmRleF0gPT09IGVsKSByZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5pbmNsdWRlc2AgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmluY2x1ZGVzXG4gIGluY2x1ZGVzOiBjcmVhdGVNZXRob2QodHJ1ZSksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUuaW5kZXhPZmAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmluZGV4b2ZcbiAgaW5kZXhPZjogY3JlYXRlTWV0aG9kKGZhbHNlKVxufTtcbiIsInZhciBiaW5kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLWJpbmQtY29udGV4dCcpO1xudmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcycpO1xudmFyIEluZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaW5kZXhlZC1vYmplY3QnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1vYmplY3QnKTtcbnZhciBsZW5ndGhPZkFycmF5TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9sZW5ndGgtb2YtYXJyYXktbGlrZScpO1xudmFyIGFycmF5U3BlY2llc0NyZWF0ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1zcGVjaWVzLWNyZWF0ZScpO1xuXG52YXIgcHVzaCA9IHVuY3VycnlUaGlzKFtdLnB1c2gpO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLnsgZm9yRWFjaCwgbWFwLCBmaWx0ZXIsIHNvbWUsIGV2ZXJ5LCBmaW5kLCBmaW5kSW5kZXgsIGZpbHRlclJlamVjdCB9YCBtZXRob2RzIGltcGxlbWVudGF0aW9uXG52YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKFRZUEUpIHtcbiAgdmFyIElTX01BUCA9IFRZUEUgPT0gMTtcbiAgdmFyIElTX0ZJTFRFUiA9IFRZUEUgPT0gMjtcbiAgdmFyIElTX1NPTUUgPSBUWVBFID09IDM7XG4gIHZhciBJU19FVkVSWSA9IFRZUEUgPT0gNDtcbiAgdmFyIElTX0ZJTkRfSU5ERVggPSBUWVBFID09IDY7XG4gIHZhciBJU19GSUxURVJfUkVKRUNUID0gVFlQRSA9PSA3O1xuICB2YXIgTk9fSE9MRVMgPSBUWVBFID09IDUgfHwgSVNfRklORF9JTkRFWDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgY2FsbGJhY2tmbiwgdGhhdCwgc3BlY2lmaWNDcmVhdGUpIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgc2VsZiA9IEluZGV4ZWRPYmplY3QoTyk7XG4gICAgdmFyIGJvdW5kRnVuY3Rpb24gPSBiaW5kKGNhbGxiYWNrZm4sIHRoYXQpO1xuICAgIHZhciBsZW5ndGggPSBsZW5ndGhPZkFycmF5TGlrZShzZWxmKTtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBjcmVhdGUgPSBzcGVjaWZpY0NyZWF0ZSB8fCBhcnJheVNwZWNpZXNDcmVhdGU7XG4gICAgdmFyIHRhcmdldCA9IElTX01BUCA/IGNyZWF0ZSgkdGhpcywgbGVuZ3RoKSA6IElTX0ZJTFRFUiB8fCBJU19GSUxURVJfUkVKRUNUID8gY3JlYXRlKCR0aGlzLCAwKSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgdmFsdWUsIHJlc3VsdDtcbiAgICBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykgaWYgKE5PX0hPTEVTIHx8IGluZGV4IGluIHNlbGYpIHtcbiAgICAgIHZhbHVlID0gc2VsZltpbmRleF07XG4gICAgICByZXN1bHQgPSBib3VuZEZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgTyk7XG4gICAgICBpZiAoVFlQRSkge1xuICAgICAgICBpZiAoSVNfTUFQKSB0YXJnZXRbaW5kZXhdID0gcmVzdWx0OyAvLyBtYXBcbiAgICAgICAgZWxzZSBpZiAocmVzdWx0KSBzd2l0Y2ggKFRZUEUpIHtcbiAgICAgICAgICBjYXNlIDM6IHJldHVybiB0cnVlOyAgICAgICAgICAgICAgLy8gc29tZVxuICAgICAgICAgIGNhc2UgNTogcmV0dXJuIHZhbHVlOyAgICAgICAgICAgICAvLyBmaW5kXG4gICAgICAgICAgY2FzZSA2OiByZXR1cm4gaW5kZXg7ICAgICAgICAgICAgIC8vIGZpbmRJbmRleFxuICAgICAgICAgIGNhc2UgMjogcHVzaCh0YXJnZXQsIHZhbHVlKTsgICAgICAvLyBmaWx0ZXJcbiAgICAgICAgfSBlbHNlIHN3aXRjaCAoVFlQRSkge1xuICAgICAgICAgIGNhc2UgNDogcmV0dXJuIGZhbHNlOyAgICAgICAgICAgICAvLyBldmVyeVxuICAgICAgICAgIGNhc2UgNzogcHVzaCh0YXJnZXQsIHZhbHVlKTsgICAgICAvLyBmaWx0ZXJSZWplY3RcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSVNfRklORF9JTkRFWCA/IC0xIDogSVNfU09NRSB8fCBJU19FVkVSWSA/IElTX0VWRVJZIDogdGFyZ2V0O1xuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIGBBcnJheS5wcm90b3R5cGUuZm9yRWFjaGAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZvcmVhY2hcbiAgZm9yRWFjaDogY3JlYXRlTWV0aG9kKDApLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLm1hcGAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLm1hcFxuICBtYXA6IGNyZWF0ZU1ldGhvZCgxKSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5maWx0ZXJgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5maWx0ZXJcbiAgZmlsdGVyOiBjcmVhdGVNZXRob2QoMiksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUuc29tZWAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLnNvbWVcbiAgc29tZTogY3JlYXRlTWV0aG9kKDMpLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLmV2ZXJ5YCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuZXZlcnlcbiAgZXZlcnk6IGNyZWF0ZU1ldGhvZCg0KSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5maW5kYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuZmluZFxuICBmaW5kOiBjcmVhdGVNZXRob2QoNSksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUuZmluZEluZGV4YCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuZmluZEluZGV4XG4gIGZpbmRJbmRleDogY3JlYXRlTWV0aG9kKDYpLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLmZpbHRlclJlamVjdGAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLWFycmF5LWZpbHRlcmluZ1xuICBmaWx0ZXJSZWplY3Q6IGNyZWF0ZU1ldGhvZCg3KVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChNRVRIT0RfTkFNRSwgYXJndW1lbnQpIHtcbiAgdmFyIG1ldGhvZCA9IFtdW01FVEhPRF9OQU1FXTtcbiAgcmV0dXJuICEhbWV0aG9kICYmIGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdXNlbGVzcy1jYWxsIC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nXG4gICAgbWV0aG9kLmNhbGwobnVsbCwgYXJndW1lbnQgfHwgZnVuY3Rpb24gKCkgeyByZXR1cm4gMTsgfSwgMSk7XG4gIH0pO1xufTtcbiIsInZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWFycmF5Jyk7XG52YXIgaXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jb25zdHJ1Y3RvcicpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xuXG52YXIgU1BFQ0lFUyA9IHdlbGxLbm93blN5bWJvbCgnc3BlY2llcycpO1xudmFyICRBcnJheSA9IEFycmF5O1xuXG4vLyBhIHBhcnQgb2YgYEFycmF5U3BlY2llc0NyZWF0ZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5c3BlY2llc2NyZWF0ZVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3JpZ2luYWxBcnJheSkge1xuICB2YXIgQztcbiAgaWYgKGlzQXJyYXkob3JpZ2luYWxBcnJheSkpIHtcbiAgICBDID0gb3JpZ2luYWxBcnJheS5jb25zdHJ1Y3RvcjtcbiAgICAvLyBjcm9zcy1yZWFsbSBmYWxsYmFja1xuICAgIGlmIChpc0NvbnN0cnVjdG9yKEMpICYmIChDID09PSAkQXJyYXkgfHwgaXNBcnJheShDLnByb3RvdHlwZSkpKSBDID0gdW5kZWZpbmVkO1xuICAgIGVsc2UgaWYgKGlzT2JqZWN0KEMpKSB7XG4gICAgICBDID0gQ1tTUEVDSUVTXTtcbiAgICAgIGlmIChDID09PSBudWxsKSBDID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSByZXR1cm4gQyA9PT0gdW5kZWZpbmVkID8gJEFycmF5IDogQztcbn07XG4iLCJ2YXIgYXJyYXlTcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktc3BlY2llcy1jb25zdHJ1Y3RvcicpO1xuXG4vLyBgQXJyYXlTcGVjaWVzQ3JlYXRlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXlzcGVjaWVzY3JlYXRlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcmlnaW5hbEFycmF5LCBsZW5ndGgpIHtcbiAgcmV0dXJuIG5ldyAoYXJyYXlTcGVjaWVzQ29uc3RydWN0b3Iob3JpZ2luYWxBcnJheSkpKGxlbmd0aCA9PT0gMCA/IDAgOiBsZW5ndGgpO1xufTtcbiIsInZhciB1bmN1cnJ5VGhpcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMnKTtcblxudmFyIHRvU3RyaW5nID0gdW5jdXJyeVRoaXMoe30udG9TdHJpbmcpO1xudmFyIHN0cmluZ1NsaWNlID0gdW5jdXJyeVRoaXMoJycuc2xpY2UpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gc3RyaW5nU2xpY2UodG9TdHJpbmcoaXQpLCA4LCAtMSk7XG59O1xuIiwidmFyIFRPX1NUUklOR19UQUdfU1VQUE9SVCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1zdHJpbmctdGFnLXN1cHBvcnQnKTtcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgY2xhc3NvZlJhdyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jbGFzc29mLXJhdycpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xuXG52YXIgVE9fU1RSSU5HX1RBRyA9IHdlbGxLbm93blN5bWJvbCgndG9TdHJpbmdUYWcnKTtcbnZhciAkT2JqZWN0ID0gT2JqZWN0O1xuXG4vLyBFUzMgd3JvbmcgaGVyZVxudmFyIENPUlJFQ1RfQVJHVU1FTlRTID0gY2xhc3NvZlJhdyhmdW5jdGlvbiAoKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaCAoZXJyb3IpIHsgLyogZW1wdHkgKi8gfVxufTtcblxuLy8gZ2V0dGluZyB0YWcgZnJvbSBFUzYrIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYFxubW9kdWxlLmV4cG9ydHMgPSBUT19TVFJJTkdfVEFHX1NVUFBPUlQgPyBjbGFzc29mUmF3IDogZnVuY3Rpb24gKGl0KSB7XG4gIHZhciBPLCB0YWcsIHJlc3VsdDtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKHRhZyA9IHRyeUdldChPID0gJE9iamVjdChpdCksIFRPX1NUUklOR19UQUcpKSA9PSAnc3RyaW5nJyA/IHRhZ1xuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQ09SUkVDVF9BUkdVTUVOVFMgPyBjbGFzc29mUmF3KE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKHJlc3VsdCA9IGNsYXNzb2ZSYXcoTykpID09ICdPYmplY3QnICYmIGlzQ2FsbGFibGUoTy5jYWxsZWUpID8gJ0FyZ3VtZW50cycgOiByZXN1bHQ7XG59O1xuIiwidmFyIGhhc093biA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5Jyk7XG52YXIgb3duS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vd24ta2V5cycpO1xudmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvck1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yJyk7XG52YXIgZGVmaW5lUHJvcGVydHlNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSwgZXhjZXB0aW9ucykge1xuICB2YXIga2V5cyA9IG93bktleXMoc291cmNlKTtcbiAgdmFyIGRlZmluZVByb3BlcnR5ID0gZGVmaW5lUHJvcGVydHlNb2R1bGUuZjtcbiAgdmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvck1vZHVsZS5mO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICBpZiAoIWhhc093bih0YXJnZXQsIGtleSkgJiYgIShleGNlcHRpb25zICYmIGhhc093bihleGNlcHRpb25zLCBrZXkpKSkge1xuICAgICAgZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpO1xuICAgIH1cbiAgfVxufTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGRlZmluZVByb3BlcnR5TW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKTtcbnZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBERVNDUklQVE9SUyA/IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIGRlZmluZVByb3BlcnR5TW9kdWxlLmYob2JqZWN0LCBrZXksIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcigxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChiaXRtYXAsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZTogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGU6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWU6IHZhbHVlXG4gIH07XG59O1xuIiwidmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciBkZWZpbmVQcm9wZXJ0eU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5Jyk7XG52YXIgbWFrZUJ1aWx0SW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbWFrZS1idWlsdC1pbicpO1xudmFyIGRlZmluZUdsb2JhbFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RlZmluZS1nbG9iYWwtcHJvcGVydHknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywga2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcbiAgdmFyIHNpbXBsZSA9IG9wdGlvbnMuZW51bWVyYWJsZTtcbiAgdmFyIG5hbWUgPSBvcHRpb25zLm5hbWUgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubmFtZSA6IGtleTtcbiAgaWYgKGlzQ2FsbGFibGUodmFsdWUpKSBtYWtlQnVpbHRJbih2YWx1ZSwgbmFtZSwgb3B0aW9ucyk7XG4gIGlmIChvcHRpb25zLmdsb2JhbCkge1xuICAgIGlmIChzaW1wbGUpIE9ba2V5XSA9IHZhbHVlO1xuICAgIGVsc2UgZGVmaW5lR2xvYmFsUHJvcGVydHkoa2V5LCB2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICghb3B0aW9ucy51bnNhZmUpIGRlbGV0ZSBPW2tleV07XG4gICAgICBlbHNlIGlmIChPW2tleV0pIHNpbXBsZSA9IHRydWU7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHsgLyogZW1wdHkgKi8gfVxuICAgIGlmIChzaW1wbGUpIE9ba2V5XSA9IHZhbHVlO1xuICAgIGVsc2UgZGVmaW5lUHJvcGVydHlNb2R1bGUuZihPLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiAhb3B0aW9ucy5ub25Db25maWd1cmFibGUsXG4gICAgICB3cml0YWJsZTogIW9wdGlvbnMubm9uV3JpdGFibGVcbiAgICB9KTtcbiAgfSByZXR1cm4gTztcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWRlZmluZXByb3BlcnR5IC0tIHNhZmVcbnZhciBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICB0cnkge1xuICAgIGRlZmluZVByb3BlcnR5KGdsb2JhbCwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBnbG9iYWxba2V5XSA9IHZhbHVlO1xuICB9IHJldHVybiB2YWx1ZTtcbn07XG4iLCJ2YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcblxuLy8gRGV0ZWN0IElFOCdzIGluY29tcGxldGUgZGVmaW5lUHJvcGVydHkgaW1wbGVtZW50YXRpb25cbm1vZHVsZS5leHBvcnRzID0gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1kZWZpbmVwcm9wZXJ0eSAtLSByZXF1aXJlZCBmb3IgdGVzdGluZ1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAxLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KVsxXSAhPSA3O1xufSk7XG4iLCJ2YXIgZG9jdW1lbnRBbGwgPSB0eXBlb2YgZG9jdW1lbnQgPT0gJ29iamVjdCcgJiYgZG9jdW1lbnQuYWxsO1xuXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLUlzSFRNTEREQS1pbnRlcm5hbC1zbG90XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgdW5pY29ybi9uby10eXBlb2YtdW5kZWZpbmVkIC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nXG52YXIgSVNfSFRNTEREQSA9IHR5cGVvZiBkb2N1bWVudEFsbCA9PSAndW5kZWZpbmVkJyAmJiBkb2N1bWVudEFsbCAhPT0gdW5kZWZpbmVkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWxsOiBkb2N1bWVudEFsbCxcbiAgSVNfSFRNTEREQTogSVNfSFRNTEREQVxufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG5cbnZhciBkb2N1bWVudCA9IGdsb2JhbC5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIEVYSVNUUyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIEVYSVNUUyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59O1xuIiwiLy8gaXRlcmFibGUgRE9NIGNvbGxlY3Rpb25zXG4vLyBmbGFnIC0gYGl0ZXJhYmxlYCBpbnRlcmZhY2UgLSAnZW50cmllcycsICdrZXlzJywgJ3ZhbHVlcycsICdmb3JFYWNoJyBtZXRob2RzXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ1NTUnVsZUxpc3Q6IDAsXG4gIENTU1N0eWxlRGVjbGFyYXRpb246IDAsXG4gIENTU1ZhbHVlTGlzdDogMCxcbiAgQ2xpZW50UmVjdExpc3Q6IDAsXG4gIERPTVJlY3RMaXN0OiAwLFxuICBET01TdHJpbmdMaXN0OiAwLFxuICBET01Ub2tlbkxpc3Q6IDEsXG4gIERhdGFUcmFuc2Zlckl0ZW1MaXN0OiAwLFxuICBGaWxlTGlzdDogMCxcbiAgSFRNTEFsbENvbGxlY3Rpb246IDAsXG4gIEhUTUxDb2xsZWN0aW9uOiAwLFxuICBIVE1MRm9ybUVsZW1lbnQ6IDAsXG4gIEhUTUxTZWxlY3RFbGVtZW50OiAwLFxuICBNZWRpYUxpc3Q6IDAsXG4gIE1pbWVUeXBlQXJyYXk6IDAsXG4gIE5hbWVkTm9kZU1hcDogMCxcbiAgTm9kZUxpc3Q6IDEsXG4gIFBhaW50UmVxdWVzdExpc3Q6IDAsXG4gIFBsdWdpbjogMCxcbiAgUGx1Z2luQXJyYXk6IDAsXG4gIFNWR0xlbmd0aExpc3Q6IDAsXG4gIFNWR051bWJlckxpc3Q6IDAsXG4gIFNWR1BhdGhTZWdMaXN0OiAwLFxuICBTVkdQb2ludExpc3Q6IDAsXG4gIFNWR1N0cmluZ0xpc3Q6IDAsXG4gIFNWR1RyYW5zZm9ybUxpc3Q6IDAsXG4gIFNvdXJjZUJ1ZmZlckxpc3Q6IDAsXG4gIFN0eWxlU2hlZXRMaXN0OiAwLFxuICBUZXh0VHJhY2tDdWVMaXN0OiAwLFxuICBUZXh0VHJhY2tMaXN0OiAwLFxuICBUb3VjaExpc3Q6IDBcbn07XG4iLCIvLyBpbiBvbGQgV2ViS2l0IHZlcnNpb25zLCBgZWxlbWVudC5jbGFzc0xpc3RgIGlzIG5vdCBhbiBpbnN0YW5jZSBvZiBnbG9iYWwgYERPTVRva2VuTGlzdGBcbnZhciBkb2N1bWVudENyZWF0ZUVsZW1lbnQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZG9jdW1lbnQtY3JlYXRlLWVsZW1lbnQnKTtcblxudmFyIGNsYXNzTGlzdCA9IGRvY3VtZW50Q3JlYXRlRWxlbWVudCgnc3BhbicpLmNsYXNzTGlzdDtcbnZhciBET01Ub2tlbkxpc3RQcm90b3R5cGUgPSBjbGFzc0xpc3QgJiYgY2xhc3NMaXN0LmNvbnN0cnVjdG9yICYmIGNsYXNzTGlzdC5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gRE9NVG9rZW5MaXN0UHJvdG90eXBlID09PSBPYmplY3QucHJvdG90eXBlID8gdW5kZWZpbmVkIDogRE9NVG9rZW5MaXN0UHJvdG90eXBlO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB0eXBlb2YgbmF2aWdhdG9yICE9ICd1bmRlZmluZWQnICYmIFN0cmluZyhuYXZpZ2F0b3IudXNlckFnZW50KSB8fCAnJztcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgdXNlckFnZW50ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VuZ2luZS11c2VyLWFnZW50Jyk7XG5cbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgRGVubyA9IGdsb2JhbC5EZW5vO1xudmFyIHZlcnNpb25zID0gcHJvY2VzcyAmJiBwcm9jZXNzLnZlcnNpb25zIHx8IERlbm8gJiYgRGVuby52ZXJzaW9uO1xudmFyIHY4ID0gdmVyc2lvbnMgJiYgdmVyc2lvbnMudjg7XG52YXIgbWF0Y2gsIHZlcnNpb247XG5cbmlmICh2OCkge1xuICBtYXRjaCA9IHY4LnNwbGl0KCcuJyk7XG4gIC8vIGluIG9sZCBDaHJvbWUsIHZlcnNpb25zIG9mIFY4IGlzbid0IFY4ID0gQ2hyb21lIC8gMTBcbiAgLy8gYnV0IHRoZWlyIGNvcnJlY3QgdmVyc2lvbnMgYXJlIG5vdCBpbnRlcmVzdGluZyBmb3IgdXNcbiAgdmVyc2lvbiA9IG1hdGNoWzBdID4gMCAmJiBtYXRjaFswXSA8IDQgPyAxIDogKyhtYXRjaFswXSArIG1hdGNoWzFdKTtcbn1cblxuLy8gQnJvd3NlckZTIE5vZGVKUyBgcHJvY2Vzc2AgcG9seWZpbGwgaW5jb3JyZWN0bHkgc2V0IGAudjhgIHRvIGAwLjBgXG4vLyBzbyBjaGVjayBgdXNlckFnZW50YCBldmVuIGlmIGAudjhgIGV4aXN0cywgYnV0IDBcbmlmICghdmVyc2lvbiAmJiB1c2VyQWdlbnQpIHtcbiAgbWF0Y2ggPSB1c2VyQWdlbnQubWF0Y2goL0VkZ2VcXC8oXFxkKykvKTtcbiAgaWYgKCFtYXRjaCB8fCBtYXRjaFsxXSA+PSA3NCkge1xuICAgIG1hdGNoID0gdXNlckFnZW50Lm1hdGNoKC9DaHJvbWVcXC8oXFxkKykvKTtcbiAgICBpZiAobWF0Y2gpIHZlcnNpb24gPSArbWF0Y2hbMV07XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB2ZXJzaW9uO1xuIiwiLy8gSUU4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IFtcbiAgJ2NvbnN0cnVjdG9yJyxcbiAgJ2hhc093blByb3BlcnR5JyxcbiAgJ2lzUHJvdG90eXBlT2YnLFxuICAncHJvcGVydHlJc0VudW1lcmFibGUnLFxuICAndG9Mb2NhbGVTdHJpbmcnLFxuICAndG9TdHJpbmcnLFxuICAndmFsdWVPZidcbl07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yJykuZjtcbnZhciBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5Jyk7XG52YXIgZGVmaW5lQnVpbHRJbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZWZpbmUtYnVpbHQtaW4nKTtcbnZhciBkZWZpbmVHbG9iYWxQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZWZpbmUtZ2xvYmFsLXByb3BlcnR5Jyk7XG52YXIgY29weUNvbnN0cnVjdG9yUHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jb3B5LWNvbnN0cnVjdG9yLXByb3BlcnRpZXMnKTtcbnZhciBpc0ZvcmNlZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1mb3JjZWQnKTtcblxuLypcbiAgb3B0aW9ucy50YXJnZXQgICAgICAgICAtIG5hbWUgb2YgdGhlIHRhcmdldCBvYmplY3RcbiAgb3B0aW9ucy5nbG9iYWwgICAgICAgICAtIHRhcmdldCBpcyB0aGUgZ2xvYmFsIG9iamVjdFxuICBvcHRpb25zLnN0YXQgICAgICAgICAgIC0gZXhwb3J0IGFzIHN0YXRpYyBtZXRob2RzIG9mIHRhcmdldFxuICBvcHRpb25zLnByb3RvICAgICAgICAgIC0gZXhwb3J0IGFzIHByb3RvdHlwZSBtZXRob2RzIG9mIHRhcmdldFxuICBvcHRpb25zLnJlYWwgICAgICAgICAgIC0gcmVhbCBwcm90b3R5cGUgbWV0aG9kIGZvciB0aGUgYHB1cmVgIHZlcnNpb25cbiAgb3B0aW9ucy5mb3JjZWQgICAgICAgICAtIGV4cG9ydCBldmVuIGlmIHRoZSBuYXRpdmUgZmVhdHVyZSBpcyBhdmFpbGFibGVcbiAgb3B0aW9ucy5iaW5kICAgICAgICAgICAtIGJpbmQgbWV0aG9kcyB0byB0aGUgdGFyZ2V0LCByZXF1aXJlZCBmb3IgdGhlIGBwdXJlYCB2ZXJzaW9uXG4gIG9wdGlvbnMud3JhcCAgICAgICAgICAgLSB3cmFwIGNvbnN0cnVjdG9ycyB0byBwcmV2ZW50aW5nIGdsb2JhbCBwb2xsdXRpb24sIHJlcXVpcmVkIGZvciB0aGUgYHB1cmVgIHZlcnNpb25cbiAgb3B0aW9ucy51bnNhZmUgICAgICAgICAtIHVzZSB0aGUgc2ltcGxlIGFzc2lnbm1lbnQgb2YgcHJvcGVydHkgaW5zdGVhZCBvZiBkZWxldGUgKyBkZWZpbmVQcm9wZXJ0eVxuICBvcHRpb25zLnNoYW0gICAgICAgICAgIC0gYWRkIGEgZmxhZyB0byBub3QgY29tcGxldGVseSBmdWxsIHBvbHlmaWxsc1xuICBvcHRpb25zLmVudW1lcmFibGUgICAgIC0gZXhwb3J0IGFzIGVudW1lcmFibGUgcHJvcGVydHlcbiAgb3B0aW9ucy5kb250Q2FsbEdldFNldCAtIHByZXZlbnQgY2FsbGluZyBhIGdldHRlciBvbiB0YXJnZXRcbiAgb3B0aW9ucy5uYW1lICAgICAgICAgICAtIHRoZSAubmFtZSBvZiB0aGUgZnVuY3Rpb24gaWYgaXQgZG9lcyBub3QgbWF0Y2ggdGhlIGtleVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9wdGlvbnMsIHNvdXJjZSkge1xuICB2YXIgVEFSR0VUID0gb3B0aW9ucy50YXJnZXQ7XG4gIHZhciBHTE9CQUwgPSBvcHRpb25zLmdsb2JhbDtcbiAgdmFyIFNUQVRJQyA9IG9wdGlvbnMuc3RhdDtcbiAgdmFyIEZPUkNFRCwgdGFyZ2V0LCBrZXksIHRhcmdldFByb3BlcnR5LCBzb3VyY2VQcm9wZXJ0eSwgZGVzY3JpcHRvcjtcbiAgaWYgKEdMT0JBTCkge1xuICAgIHRhcmdldCA9IGdsb2JhbDtcbiAgfSBlbHNlIGlmIChTVEFUSUMpIHtcbiAgICB0YXJnZXQgPSBnbG9iYWxbVEFSR0VUXSB8fCBkZWZpbmVHbG9iYWxQcm9wZXJ0eShUQVJHRVQsIHt9KTtcbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQgPSAoZ2xvYmFsW1RBUkdFVF0gfHwge30pLnByb3RvdHlwZTtcbiAgfVxuICBpZiAodGFyZ2V0KSBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICBzb3VyY2VQcm9wZXJ0eSA9IHNvdXJjZVtrZXldO1xuICAgIGlmIChvcHRpb25zLmRvbnRDYWxsR2V0U2V0KSB7XG4gICAgICBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgICAgIHRhcmdldFByb3BlcnR5ID0gZGVzY3JpcHRvciAmJiBkZXNjcmlwdG9yLnZhbHVlO1xuICAgIH0gZWxzZSB0YXJnZXRQcm9wZXJ0eSA9IHRhcmdldFtrZXldO1xuICAgIEZPUkNFRCA9IGlzRm9yY2VkKEdMT0JBTCA/IGtleSA6IFRBUkdFVCArIChTVEFUSUMgPyAnLicgOiAnIycpICsga2V5LCBvcHRpb25zLmZvcmNlZCk7XG4gICAgLy8gY29udGFpbmVkIGluIHRhcmdldFxuICAgIGlmICghRk9SQ0VEICYmIHRhcmdldFByb3BlcnR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0eXBlb2Ygc291cmNlUHJvcGVydHkgPT0gdHlwZW9mIHRhcmdldFByb3BlcnR5KSBjb250aW51ZTtcbiAgICAgIGNvcHlDb25zdHJ1Y3RvclByb3BlcnRpZXMoc291cmNlUHJvcGVydHksIHRhcmdldFByb3BlcnR5KTtcbiAgICB9XG4gICAgLy8gYWRkIGEgZmxhZyB0byBub3QgY29tcGxldGVseSBmdWxsIHBvbHlmaWxsc1xuICAgIGlmIChvcHRpb25zLnNoYW0gfHwgKHRhcmdldFByb3BlcnR5ICYmIHRhcmdldFByb3BlcnR5LnNoYW0pKSB7XG4gICAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoc291cmNlUHJvcGVydHksICdzaGFtJywgdHJ1ZSk7XG4gICAgfVxuICAgIGRlZmluZUJ1aWx0SW4odGFyZ2V0LCBrZXksIHNvdXJjZVByb3BlcnR5LCBvcHRpb25zKTtcbiAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG4iLCJ2YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzLWNsYXVzZScpO1xudmFyIGFDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hLWNhbGxhYmxlJyk7XG52YXIgTkFUSVZFX0JJTkQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tYmluZC1uYXRpdmUnKTtcblxudmFyIGJpbmQgPSB1bmN1cnJ5VGhpcyh1bmN1cnJ5VGhpcy5iaW5kKTtcblxuLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbiwgdGhhdCkge1xuICBhQ2FsbGFibGUoZm4pO1xuICByZXR1cm4gdGhhdCA9PT0gdW5kZWZpbmVkID8gZm4gOiBOQVRJVkVfQklORCA/IGJpbmQoZm4sIHRoYXQpIDogZnVuY3Rpb24gKC8qIC4uLmFyZ3MgKi8pIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCJ2YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tZnVuY3Rpb24tcHJvdG90eXBlLWJpbmQgLS0gc2FmZVxuICB2YXIgdGVzdCA9IChmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH0pLmJpbmQoKTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGlucyAtLSBzYWZlXG4gIHJldHVybiB0eXBlb2YgdGVzdCAhPSAnZnVuY3Rpb24nIHx8IHRlc3QuaGFzT3duUHJvcGVydHkoJ3Byb3RvdHlwZScpO1xufSk7XG4iLCJ2YXIgTkFUSVZFX0JJTkQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tYmluZC1uYXRpdmUnKTtcblxudmFyIGNhbGwgPSBGdW5jdGlvbi5wcm90b3R5cGUuY2FsbDtcblxubW9kdWxlLmV4cG9ydHMgPSBOQVRJVkVfQklORCA/IGNhbGwuYmluZChjYWxsKSA6IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGNhbGwuYXBwbHkoY2FsbCwgYXJndW1lbnRzKTtcbn07XG4iLCJ2YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xuXG52YXIgRnVuY3Rpb25Qcm90b3R5cGUgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldG93bnByb3BlcnR5ZGVzY3JpcHRvciAtLSBzYWZlXG52YXIgZ2V0RGVzY3JpcHRvciA9IERFU0NSSVBUT1JTICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbnZhciBFWElTVFMgPSBoYXNPd24oRnVuY3Rpb25Qcm90b3R5cGUsICduYW1lJyk7XG4vLyBhZGRpdGlvbmFsIHByb3RlY3Rpb24gZnJvbSBtaW5pZmllZCAvIG1hbmdsZWQgLyBkcm9wcGVkIGZ1bmN0aW9uIG5hbWVzXG52YXIgUFJPUEVSID0gRVhJU1RTICYmIChmdW5jdGlvbiBzb21ldGhpbmcoKSB7IC8qIGVtcHR5ICovIH0pLm5hbWUgPT09ICdzb21ldGhpbmcnO1xudmFyIENPTkZJR1VSQUJMRSA9IEVYSVNUUyAmJiAoIURFU0NSSVBUT1JTIHx8IChERVNDUklQVE9SUyAmJiBnZXREZXNjcmlwdG9yKEZ1bmN0aW9uUHJvdG90eXBlLCAnbmFtZScpLmNvbmZpZ3VyYWJsZSkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgRVhJU1RTOiBFWElTVFMsXG4gIFBST1BFUjogUFJPUEVSLFxuICBDT05GSUdVUkFCTEU6IENPTkZJR1VSQUJMRVxufTtcbiIsInZhciBjbGFzc29mUmF3ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NsYXNzb2YtcmF3Jyk7XG52YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuKSB7XG4gIC8vIE5hc2hvcm4gYnVnOlxuICAvLyAgIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy8xMTI4XG4gIC8vICAgaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzExMzBcbiAgaWYgKGNsYXNzb2ZSYXcoZm4pID09PSAnRnVuY3Rpb24nKSByZXR1cm4gdW5jdXJyeVRoaXMoZm4pO1xufTtcbiIsInZhciBOQVRJVkVfQklORCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi1iaW5kLW5hdGl2ZScpO1xuXG52YXIgRnVuY3Rpb25Qcm90b3R5cGUgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG52YXIgY2FsbCA9IEZ1bmN0aW9uUHJvdG90eXBlLmNhbGw7XG52YXIgdW5jdXJyeVRoaXNXaXRoQmluZCA9IE5BVElWRV9CSU5EICYmIEZ1bmN0aW9uUHJvdG90eXBlLmJpbmQuYmluZChjYWxsLCBjYWxsKTtcblxubW9kdWxlLmV4cG9ydHMgPSBOQVRJVkVfQklORCA/IHVuY3VycnlUaGlzV2l0aEJpbmQgOiBmdW5jdGlvbiAoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2FsbC5hcHBseShmbiwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcblxudmFyIGFGdW5jdGlvbiA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gaXNDYWxsYWJsZShhcmd1bWVudCkgPyBhcmd1bWVudCA6IHVuZGVmaW5lZDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWVzcGFjZSwgbWV0aG9kKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoIDwgMiA/IGFGdW5jdGlvbihnbG9iYWxbbmFtZXNwYWNlXSkgOiBnbG9iYWxbbmFtZXNwYWNlXSAmJiBnbG9iYWxbbmFtZXNwYWNlXVttZXRob2RdO1xufTtcbiIsInZhciBhQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYS1jYWxsYWJsZScpO1xudmFyIGlzTnVsbE9yVW5kZWZpbmVkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW51bGwtb3ItdW5kZWZpbmVkJyk7XG5cbi8vIGBHZXRNZXRob2RgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1nZXRtZXRob2Rcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFYsIFApIHtcbiAgdmFyIGZ1bmMgPSBWW1BdO1xuICByZXR1cm4gaXNOdWxsT3JVbmRlZmluZWQoZnVuYykgPyB1bmRlZmluZWQgOiBhQ2FsbGFibGUoZnVuYyk7XG59O1xuIiwidmFyIGNoZWNrID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCAmJiBpdC5NYXRoID09IE1hdGggJiYgaXQ7XG59O1xuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxubW9kdWxlLmV4cG9ydHMgPVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tZ2xvYmFsLXRoaXMgLS0gc2FmZVxuICBjaGVjayh0eXBlb2YgZ2xvYmFsVGhpcyA9PSAnb2JqZWN0JyAmJiBnbG9iYWxUaGlzKSB8fFxuICBjaGVjayh0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvdykgfHxcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtZ2xvYmFscyAtLSBzYWZlXG4gIGNoZWNrKHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYpIHx8XG4gIGNoZWNrKHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsKSB8fFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmMgLS0gZmFsbGJhY2tcbiAgKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0pKCkgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbiIsInZhciB1bmN1cnJ5VGhpcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1vYmplY3QnKTtcblxudmFyIGhhc093blByb3BlcnR5ID0gdW5jdXJyeVRoaXMoe30uaGFzT3duUHJvcGVydHkpO1xuXG4vLyBgSGFzT3duUHJvcGVydHlgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1oYXNvd25wcm9wZXJ0eVxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1oYXNvd24gLS0gc2FmZVxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuaGFzT3duIHx8IGZ1bmN0aW9uIGhhc093bihpdCwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eSh0b09iamVjdChpdCksIGtleSk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgY3JlYXRlRWxlbWVudCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kb2N1bWVudC1jcmVhdGUtZWxlbWVudCcpO1xuXG4vLyBUaGFua3MgdG8gSUU4IGZvciBpdHMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIURFU0NSSVBUT1JTICYmICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZGVmaW5lcHJvcGVydHkgLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmdcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjcmVhdGVFbGVtZW50KCdkaXYnKSwgJ2EnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9XG4gIH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcycpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jbGFzc29mLXJhdycpO1xuXG52YXIgJE9iamVjdCA9IE9iamVjdDtcbnZhciBzcGxpdCA9IHVuY3VycnlUaGlzKCcnLnNwbGl0KTtcblxuLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3Ncbm1vZHVsZS5leHBvcnRzID0gZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyB0aHJvd3MgYW4gZXJyb3IgaW4gcmhpbm8sIHNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9yaGluby9pc3N1ZXMvMzQ2XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnMgLS0gc2FmZVxuICByZXR1cm4gISRPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKTtcbn0pID8gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBjbGFzc29mKGl0KSA9PSAnU3RyaW5nJyA/IHNwbGl0KGl0LCAnJykgOiAkT2JqZWN0KGl0KTtcbn0gOiAkT2JqZWN0O1xuIiwidmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcycpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciBzdG9yZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQtc3RvcmUnKTtcblxudmFyIGZ1bmN0aW9uVG9TdHJpbmcgPSB1bmN1cnJ5VGhpcyhGdW5jdGlvbi50b1N0cmluZyk7XG5cbi8vIHRoaXMgaGVscGVyIGJyb2tlbiBpbiBgY29yZS1qc0AzLjQuMS0zLjQuNGAsIHNvIHdlIGNhbid0IHVzZSBgc2hhcmVkYCBoZWxwZXJcbmlmICghaXNDYWxsYWJsZShzdG9yZS5pbnNwZWN0U291cmNlKSkge1xuICBzdG9yZS5pbnNwZWN0U291cmNlID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uVG9TdHJpbmcoaXQpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JlLmluc3BlY3RTb3VyY2U7XG4iLCJ2YXIgTkFUSVZFX1dFQUtfTUFQID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlYWstbWFwLWJhc2ljLWRldGVjdGlvbicpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5Jyk7XG52YXIgaGFzT3duID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcy1vd24tcHJvcGVydHknKTtcbnZhciBzaGFyZWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkLXN0b3JlJyk7XG52YXIgc2hhcmVkS2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1rZXknKTtcbnZhciBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hpZGRlbi1rZXlzJyk7XG5cbnZhciBPQkpFQ1RfQUxSRUFEWV9JTklUSUFMSVpFRCA9ICdPYmplY3QgYWxyZWFkeSBpbml0aWFsaXplZCc7XG52YXIgVHlwZUVycm9yID0gZ2xvYmFsLlR5cGVFcnJvcjtcbnZhciBXZWFrTWFwID0gZ2xvYmFsLldlYWtNYXA7XG52YXIgc2V0LCBnZXQsIGhhcztcblxudmFyIGVuZm9yY2UgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGhhcyhpdCkgPyBnZXQoaXQpIDogc2V0KGl0LCB7fSk7XG59O1xuXG52YXIgZ2V0dGVyRm9yID0gZnVuY3Rpb24gKFRZUEUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpdCkge1xuICAgIHZhciBzdGF0ZTtcbiAgICBpZiAoIWlzT2JqZWN0KGl0KSB8fCAoc3RhdGUgPSBnZXQoaXQpKS50eXBlICE9PSBUWVBFKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ0luY29tcGF0aWJsZSByZWNlaXZlciwgJyArIFRZUEUgKyAnIHJlcXVpcmVkJyk7XG4gICAgfSByZXR1cm4gc3RhdGU7XG4gIH07XG59O1xuXG5pZiAoTkFUSVZFX1dFQUtfTUFQIHx8IHNoYXJlZC5zdGF0ZSkge1xuICB2YXIgc3RvcmUgPSBzaGFyZWQuc3RhdGUgfHwgKHNoYXJlZC5zdGF0ZSA9IG5ldyBXZWFrTWFwKCkpO1xuICAvKiBlc2xpbnQtZGlzYWJsZSBuby1zZWxmLWFzc2lnbiAtLSBwcm90b3R5cGUgbWV0aG9kcyBwcm90ZWN0aW9uICovXG4gIHN0b3JlLmdldCA9IHN0b3JlLmdldDtcbiAgc3RvcmUuaGFzID0gc3RvcmUuaGFzO1xuICBzdG9yZS5zZXQgPSBzdG9yZS5zZXQ7XG4gIC8qIGVzbGludC1lbmFibGUgbm8tc2VsZi1hc3NpZ24gLS0gcHJvdG90eXBlIG1ldGhvZHMgcHJvdGVjdGlvbiAqL1xuICBzZXQgPSBmdW5jdGlvbiAoaXQsIG1ldGFkYXRhKSB7XG4gICAgaWYgKHN0b3JlLmhhcyhpdCkpIHRocm93IFR5cGVFcnJvcihPQkpFQ1RfQUxSRUFEWV9JTklUSUFMSVpFRCk7XG4gICAgbWV0YWRhdGEuZmFjYWRlID0gaXQ7XG4gICAgc3RvcmUuc2V0KGl0LCBtZXRhZGF0YSk7XG4gICAgcmV0dXJuIG1ldGFkYXRhO1xuICB9O1xuICBnZXQgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gc3RvcmUuZ2V0KGl0KSB8fCB7fTtcbiAgfTtcbiAgaGFzID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIHN0b3JlLmhhcyhpdCk7XG4gIH07XG59IGVsc2Uge1xuICB2YXIgU1RBVEUgPSBzaGFyZWRLZXkoJ3N0YXRlJyk7XG4gIGhpZGRlbktleXNbU1RBVEVdID0gdHJ1ZTtcbiAgc2V0ID0gZnVuY3Rpb24gKGl0LCBtZXRhZGF0YSkge1xuICAgIGlmIChoYXNPd24oaXQsIFNUQVRFKSkgdGhyb3cgVHlwZUVycm9yKE9CSkVDVF9BTFJFQURZX0lOSVRJQUxJWkVEKTtcbiAgICBtZXRhZGF0YS5mYWNhZGUgPSBpdDtcbiAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoaXQsIFNUQVRFLCBtZXRhZGF0YSk7XG4gICAgcmV0dXJuIG1ldGFkYXRhO1xuICB9O1xuICBnZXQgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gaGFzT3duKGl0LCBTVEFURSkgPyBpdFtTVEFURV0gOiB7fTtcbiAgfTtcbiAgaGFzID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIGhhc093bihpdCwgU1RBVEUpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBzZXQsXG4gIGdldDogZ2V0LFxuICBoYXM6IGhhcyxcbiAgZW5mb3JjZTogZW5mb3JjZSxcbiAgZ2V0dGVyRm9yOiBnZXR0ZXJGb3Jcbn07XG4iLCJ2YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jbGFzc29mLXJhdycpO1xuXG4vLyBgSXNBcnJheWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWlzYXJyYXlcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1hcnJheS1pc2FycmF5IC0tIHNhZmVcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZ3VtZW50KSB7XG4gIHJldHVybiBjbGFzc29mKGFyZ3VtZW50KSA9PSAnQXJyYXknO1xufTtcbiIsInZhciAkZG9jdW1lbnRBbGwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZG9jdW1lbnQtYWxsJyk7XG5cbnZhciBkb2N1bWVudEFsbCA9ICRkb2N1bWVudEFsbC5hbGw7XG5cbi8vIGBJc0NhbGxhYmxlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtaXNjYWxsYWJsZVxubW9kdWxlLmV4cG9ydHMgPSAkZG9jdW1lbnRBbGwuSVNfSFRNTEREQSA/IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gdHlwZW9mIGFyZ3VtZW50ID09ICdmdW5jdGlvbicgfHwgYXJndW1lbnQgPT09IGRvY3VtZW50QWxsO1xufSA6IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gdHlwZW9mIGFyZ3VtZW50ID09ICdmdW5jdGlvbic7XG59O1xuIiwidmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcycpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY2xhc3NvZicpO1xudmFyIGdldEJ1aWx0SW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2V0LWJ1aWx0LWluJyk7XG52YXIgaW5zcGVjdFNvdXJjZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnNwZWN0LXNvdXJjZScpO1xuXG52YXIgbm9vcCA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbnZhciBlbXB0eSA9IFtdO1xudmFyIGNvbnN0cnVjdCA9IGdldEJ1aWx0SW4oJ1JlZmxlY3QnLCAnY29uc3RydWN0Jyk7XG52YXIgY29uc3RydWN0b3JSZWdFeHAgPSAvXlxccyooPzpjbGFzc3xmdW5jdGlvbilcXGIvO1xudmFyIGV4ZWMgPSB1bmN1cnJ5VGhpcyhjb25zdHJ1Y3RvclJlZ0V4cC5leGVjKTtcbnZhciBJTkNPUlJFQ1RfVE9fU1RSSU5HID0gIWNvbnN0cnVjdG9yUmVnRXhwLmV4ZWMobm9vcCk7XG5cbnZhciBpc0NvbnN0cnVjdG9yTW9kZXJuID0gZnVuY3Rpb24gaXNDb25zdHJ1Y3Rvcihhcmd1bWVudCkge1xuICBpZiAoIWlzQ2FsbGFibGUoYXJndW1lbnQpKSByZXR1cm4gZmFsc2U7XG4gIHRyeSB7XG4gICAgY29uc3RydWN0KG5vb3AsIGVtcHR5LCBhcmd1bWVudCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG52YXIgaXNDb25zdHJ1Y3RvckxlZ2FjeSA9IGZ1bmN0aW9uIGlzQ29uc3RydWN0b3IoYXJndW1lbnQpIHtcbiAgaWYgKCFpc0NhbGxhYmxlKGFyZ3VtZW50KSkgcmV0dXJuIGZhbHNlO1xuICBzd2l0Y2ggKGNsYXNzb2YoYXJndW1lbnQpKSB7XG4gICAgY2FzZSAnQXN5bmNGdW5jdGlvbic6XG4gICAgY2FzZSAnR2VuZXJhdG9yRnVuY3Rpb24nOlxuICAgIGNhc2UgJ0FzeW5jR2VuZXJhdG9yRnVuY3Rpb24nOiByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdHJ5IHtcbiAgICAvLyB3ZSBjYW4ndCBjaGVjayAucHJvdG90eXBlIHNpbmNlIGNvbnN0cnVjdG9ycyBwcm9kdWNlZCBieSAuYmluZCBoYXZlbid0IGl0XG4gICAgLy8gYEZ1bmN0aW9uI3RvU3RyaW5nYCB0aHJvd3Mgb24gc29tZSBidWlsdC1pdCBmdW5jdGlvbiBpbiBzb21lIGxlZ2FjeSBlbmdpbmVzXG4gICAgLy8gKGZvciBleGFtcGxlLCBgRE9NUXVhZGAgYW5kIHNpbWlsYXIgaW4gRkY0MS0pXG4gICAgcmV0dXJuIElOQ09SUkVDVF9UT19TVFJJTkcgfHwgISFleGVjKGNvbnN0cnVjdG9yUmVnRXhwLCBpbnNwZWN0U291cmNlKGFyZ3VtZW50KSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cbmlzQ29uc3RydWN0b3JMZWdhY3kuc2hhbSA9IHRydWU7XG5cbi8vIGBJc0NvbnN0cnVjdG9yYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtaXNjb25zdHJ1Y3RvclxubW9kdWxlLmV4cG9ydHMgPSAhY29uc3RydWN0IHx8IGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNhbGxlZDtcbiAgcmV0dXJuIGlzQ29uc3RydWN0b3JNb2Rlcm4oaXNDb25zdHJ1Y3Rvck1vZGVybi5jYWxsKVxuICAgIHx8ICFpc0NvbnN0cnVjdG9yTW9kZXJuKE9iamVjdClcbiAgICB8fCAhaXNDb25zdHJ1Y3Rvck1vZGVybihmdW5jdGlvbiAoKSB7IGNhbGxlZCA9IHRydWU7IH0pXG4gICAgfHwgY2FsbGVkO1xufSkgPyBpc0NvbnN0cnVjdG9yTGVnYWN5IDogaXNDb25zdHJ1Y3Rvck1vZGVybjtcbiIsInZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcblxudmFyIHJlcGxhY2VtZW50ID0gLyN8XFwucHJvdG90eXBlXFwuLztcblxudmFyIGlzRm9yY2VkID0gZnVuY3Rpb24gKGZlYXR1cmUsIGRldGVjdGlvbikge1xuICB2YXIgdmFsdWUgPSBkYXRhW25vcm1hbGl6ZShmZWF0dXJlKV07XG4gIHJldHVybiB2YWx1ZSA9PSBQT0xZRklMTCA/IHRydWVcbiAgICA6IHZhbHVlID09IE5BVElWRSA/IGZhbHNlXG4gICAgOiBpc0NhbGxhYmxlKGRldGVjdGlvbikgPyBmYWlscyhkZXRlY3Rpb24pXG4gICAgOiAhIWRldGVjdGlvbjtcbn07XG5cbnZhciBub3JtYWxpemUgPSBpc0ZvcmNlZC5ub3JtYWxpemUgPSBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gIHJldHVybiBTdHJpbmcoc3RyaW5nKS5yZXBsYWNlKHJlcGxhY2VtZW50LCAnLicpLnRvTG93ZXJDYXNlKCk7XG59O1xuXG52YXIgZGF0YSA9IGlzRm9yY2VkLmRhdGEgPSB7fTtcbnZhciBOQVRJVkUgPSBpc0ZvcmNlZC5OQVRJVkUgPSAnTic7XG52YXIgUE9MWUZJTEwgPSBpc0ZvcmNlZC5QT0xZRklMTCA9ICdQJztcblxubW9kdWxlLmV4cG9ydHMgPSBpc0ZvcmNlZDtcbiIsIi8vIHdlIGNhbid0IHVzZSBqdXN0IGBpdCA9PSBudWxsYCBzaW5jZSBvZiBgZG9jdW1lbnQuYWxsYCBzcGVjaWFsIGNhc2Vcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtSXNIVE1MRERBLWludGVybmFsLXNsb3QtYWVjXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgPT09IG51bGwgfHwgaXQgPT09IHVuZGVmaW5lZDtcbn07XG4iLCJ2YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyICRkb2N1bWVudEFsbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kb2N1bWVudC1hbGwnKTtcblxudmFyIGRvY3VtZW50QWxsID0gJGRvY3VtZW50QWxsLmFsbDtcblxubW9kdWxlLmV4cG9ydHMgPSAkZG9jdW1lbnRBbGwuSVNfSFRNTEREQSA/IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiBpc0NhbGxhYmxlKGl0KSB8fCBpdCA9PT0gZG9jdW1lbnRBbGw7XG59IDogZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IGlzQ2FsbGFibGUoaXQpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZmFsc2U7XG4iLCJ2YXIgZ2V0QnVpbHRJbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtYnVpbHQtaW4nKTtcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgaXNQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtaXMtcHJvdG90eXBlLW9mJyk7XG52YXIgVVNFX1NZTUJPTF9BU19VSUQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdXNlLXN5bWJvbC1hcy11aWQnKTtcblxudmFyICRPYmplY3QgPSBPYmplY3Q7XG5cbm1vZHVsZS5leHBvcnRzID0gVVNFX1NZTUJPTF9BU19VSUQgPyBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJztcbn0gOiBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyICRTeW1ib2wgPSBnZXRCdWlsdEluKCdTeW1ib2wnKTtcbiAgcmV0dXJuIGlzQ2FsbGFibGUoJFN5bWJvbCkgJiYgaXNQcm90b3R5cGVPZigkU3ltYm9sLnByb3RvdHlwZSwgJE9iamVjdChpdCkpO1xufTtcbiIsInZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1sZW5ndGgnKTtcblxuLy8gYExlbmd0aE9mQXJyYXlMaWtlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtbGVuZ3Rob2ZhcnJheWxpa2Vcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdG9MZW5ndGgob2JqLmxlbmd0aCk7XG59O1xuIiwidmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcycpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIGhhc093biA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5Jyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBDT05GSUdVUkFCTEVfRlVOQ1RJT05fTkFNRSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi1uYW1lJykuQ09ORklHVVJBQkxFO1xudmFyIGluc3BlY3RTb3VyY2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaW5zcGVjdC1zb3VyY2UnKTtcbnZhciBJbnRlcm5hbFN0YXRlTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ludGVybmFsLXN0YXRlJyk7XG5cbnZhciBlbmZvcmNlSW50ZXJuYWxTdGF0ZSA9IEludGVybmFsU3RhdGVNb2R1bGUuZW5mb3JjZTtcbnZhciBnZXRJbnRlcm5hbFN0YXRlID0gSW50ZXJuYWxTdGF0ZU1vZHVsZS5nZXQ7XG52YXIgJFN0cmluZyA9IFN0cmluZztcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZGVmaW5lcHJvcGVydHkgLS0gc2FmZVxudmFyIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIHN0cmluZ1NsaWNlID0gdW5jdXJyeVRoaXMoJycuc2xpY2UpO1xudmFyIHJlcGxhY2UgPSB1bmN1cnJ5VGhpcygnJy5yZXBsYWNlKTtcbnZhciBqb2luID0gdW5jdXJyeVRoaXMoW10uam9pbik7XG5cbnZhciBDT05GSUdVUkFCTEVfTEVOR1RIID0gREVTQ1JJUFRPUlMgJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGRlZmluZVByb3BlcnR5KGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfSwgJ2xlbmd0aCcsIHsgdmFsdWU6IDggfSkubGVuZ3RoICE9PSA4O1xufSk7XG5cbnZhciBURU1QTEFURSA9IFN0cmluZyhTdHJpbmcpLnNwbGl0KCdTdHJpbmcnKTtcblxudmFyIG1ha2VCdWlsdEluID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodmFsdWUsIG5hbWUsIG9wdGlvbnMpIHtcbiAgaWYgKHN0cmluZ1NsaWNlKCRTdHJpbmcobmFtZSksIDAsIDcpID09PSAnU3ltYm9sKCcpIHtcbiAgICBuYW1lID0gJ1snICsgcmVwbGFjZSgkU3RyaW5nKG5hbWUpLCAvXlN5bWJvbFxcKChbXildKilcXCkvLCAnJDEnKSArICddJztcbiAgfVxuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmdldHRlcikgbmFtZSA9ICdnZXQgJyArIG5hbWU7XG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMuc2V0dGVyKSBuYW1lID0gJ3NldCAnICsgbmFtZTtcbiAgaWYgKCFoYXNPd24odmFsdWUsICduYW1lJykgfHwgKENPTkZJR1VSQUJMRV9GVU5DVElPTl9OQU1FICYmIHZhbHVlLm5hbWUgIT09IG5hbWUpKSB7XG4gICAgaWYgKERFU0NSSVBUT1JTKSBkZWZpbmVQcm9wZXJ0eSh2YWx1ZSwgJ25hbWUnLCB7IHZhbHVlOiBuYW1lLCBjb25maWd1cmFibGU6IHRydWUgfSk7XG4gICAgZWxzZSB2YWx1ZS5uYW1lID0gbmFtZTtcbiAgfVxuICBpZiAoQ09ORklHVVJBQkxFX0xFTkdUSCAmJiBvcHRpb25zICYmIGhhc093bihvcHRpb25zLCAnYXJpdHknKSAmJiB2YWx1ZS5sZW5ndGggIT09IG9wdGlvbnMuYXJpdHkpIHtcbiAgICBkZWZpbmVQcm9wZXJ0eSh2YWx1ZSwgJ2xlbmd0aCcsIHsgdmFsdWU6IG9wdGlvbnMuYXJpdHkgfSk7XG4gIH1cbiAgdHJ5IHtcbiAgICBpZiAob3B0aW9ucyAmJiBoYXNPd24ob3B0aW9ucywgJ2NvbnN0cnVjdG9yJykgJiYgb3B0aW9ucy5jb25zdHJ1Y3Rvcikge1xuICAgICAgaWYgKERFU0NSSVBUT1JTKSBkZWZpbmVQcm9wZXJ0eSh2YWx1ZSwgJ3Byb3RvdHlwZScsIHsgd3JpdGFibGU6IGZhbHNlIH0pO1xuICAgIC8vIGluIFY4IH4gQ2hyb21lIDUzLCBwcm90b3R5cGVzIG9mIHNvbWUgbWV0aG9kcywgbGlrZSBgQXJyYXkucHJvdG90eXBlLnZhbHVlc2AsIGFyZSBub24td3JpdGFibGVcbiAgICB9IGVsc2UgaWYgKHZhbHVlLnByb3RvdHlwZSkgdmFsdWUucHJvdG90eXBlID0gdW5kZWZpbmVkO1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG4gIHZhciBzdGF0ZSA9IGVuZm9yY2VJbnRlcm5hbFN0YXRlKHZhbHVlKTtcbiAgaWYgKCFoYXNPd24oc3RhdGUsICdzb3VyY2UnKSkge1xuICAgIHN0YXRlLnNvdXJjZSA9IGpvaW4oVEVNUExBVEUsIHR5cGVvZiBuYW1lID09ICdzdHJpbmcnID8gbmFtZSA6ICcnKTtcbiAgfSByZXR1cm4gdmFsdWU7XG59O1xuXG4vLyBhZGQgZmFrZSBGdW5jdGlvbiN0b1N0cmluZyBmb3IgY29ycmVjdCB3b3JrIHdyYXBwZWQgbWV0aG9kcyAvIGNvbnN0cnVjdG9ycyB3aXRoIG1ldGhvZHMgbGlrZSBMb0Rhc2ggaXNOYXRpdmVcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1leHRlbmQtbmF0aXZlIC0tIHJlcXVpcmVkXG5GdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcgPSBtYWtlQnVpbHRJbihmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuIGlzQ2FsbGFibGUodGhpcykgJiYgZ2V0SW50ZXJuYWxTdGF0ZSh0aGlzKS5zb3VyY2UgfHwgaW5zcGVjdFNvdXJjZSh0aGlzKTtcbn0sICd0b1N0cmluZycpO1xuIiwidmFyIGNlaWwgPSBNYXRoLmNlaWw7XG52YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xuXG4vLyBgTWF0aC50cnVuY2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW1hdGgudHJ1bmNcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1tYXRoLXRydW5jIC0tIHNhZmVcbm1vZHVsZS5leHBvcnRzID0gTWF0aC50cnVuYyB8fCBmdW5jdGlvbiB0cnVuYyh4KSB7XG4gIHZhciBuID0gK3g7XG4gIHJldHVybiAobiA+IDAgPyBmbG9vciA6IGNlaWwpKG4pO1xufTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2llOC1kb20tZGVmaW5lJyk7XG52YXIgVjhfUFJPVE9UWVBFX0RFRklORV9CVUcgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdjgtcHJvdG90eXBlLWRlZmluZS1idWcnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciB0b1Byb3BlcnR5S2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXByb3BlcnR5LWtleScpO1xuXG52YXIgJFR5cGVFcnJvciA9IFR5cGVFcnJvcjtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZGVmaW5lcHJvcGVydHkgLS0gc2FmZVxudmFyICRkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZ2V0b3ducHJvcGVydHlkZXNjcmlwdG9yIC0tIHNhZmVcbnZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbnZhciBFTlVNRVJBQkxFID0gJ2VudW1lcmFibGUnO1xudmFyIENPTkZJR1VSQUJMRSA9ICdjb25maWd1cmFibGUnO1xudmFyIFdSSVRBQkxFID0gJ3dyaXRhYmxlJztcblxuLy8gYE9iamVjdC5kZWZpbmVQcm9wZXJ0eWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5kZWZpbmVwcm9wZXJ0eVxuZXhwb3J0cy5mID0gREVTQ1JJUFRPUlMgPyBWOF9QUk9UT1RZUEVfREVGSU5FX0JVRyA/IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1Byb3BlcnR5S2V5KFApO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYgKHR5cGVvZiBPID09PSAnZnVuY3Rpb24nICYmIFAgPT09ICdwcm90b3R5cGUnICYmICd2YWx1ZScgaW4gQXR0cmlidXRlcyAmJiBXUklUQUJMRSBpbiBBdHRyaWJ1dGVzICYmICFBdHRyaWJ1dGVzW1dSSVRBQkxFXSkge1xuICAgIHZhciBjdXJyZW50ID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKTtcbiAgICBpZiAoY3VycmVudCAmJiBjdXJyZW50W1dSSVRBQkxFXSkge1xuICAgICAgT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gICAgICBBdHRyaWJ1dGVzID0ge1xuICAgICAgICBjb25maWd1cmFibGU6IENPTkZJR1VSQUJMRSBpbiBBdHRyaWJ1dGVzID8gQXR0cmlidXRlc1tDT05GSUdVUkFCTEVdIDogY3VycmVudFtDT05GSUdVUkFCTEVdLFxuICAgICAgICBlbnVtZXJhYmxlOiBFTlVNRVJBQkxFIGluIEF0dHJpYnV0ZXMgPyBBdHRyaWJ1dGVzW0VOVU1FUkFCTEVdIDogY3VycmVudFtFTlVNRVJBQkxFXSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlXG4gICAgICB9O1xuICAgIH1cbiAgfSByZXR1cm4gJGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpO1xufSA6ICRkZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1Byb3BlcnR5S2V5KFApO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiAkZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgJFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQnKTtcbiAgaWYgKCd2YWx1ZScgaW4gQXR0cmlidXRlcykgT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tY2FsbCcpO1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1wcm9wZXJ0eS1pcy1lbnVtZXJhYmxlJyk7XG52YXIgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1wcm9wZXJ0eS1kZXNjcmlwdG9yJyk7XG52YXIgdG9JbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0Jyk7XG52YXIgdG9Qcm9wZXJ0eUtleSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1wcm9wZXJ0eS1rZXknKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2llOC1kb20tZGVmaW5lJyk7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZ2V0b3ducHJvcGVydHlkZXNjcmlwdG9yIC0tIHNhZmVcbnZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcblxuLy8gYE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuZ2V0b3ducHJvcGVydHlkZXNjcmlwdG9yXG5leHBvcnRzLmYgPSBERVNDUklQVE9SUyA/ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUCkge1xuICBPID0gdG9JbmRleGVkT2JqZWN0KE8pO1xuICBQID0gdG9Qcm9wZXJ0eUtleShQKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApO1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG4gIGlmIChoYXNPd24oTywgUCkpIHJldHVybiBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IoIWNhbGwocHJvcGVydHlJc0VudW1lcmFibGVNb2R1bGUuZiwgTywgUCksIE9bUF0pO1xufTtcbiIsInZhciBpbnRlcm5hbE9iamVjdEtleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbnVtLWJ1Zy1rZXlzJyk7XG5cbnZhciBoaWRkZW5LZXlzID0gZW51bUJ1Z0tleXMuY29uY2F0KCdsZW5ndGgnLCAncHJvdG90eXBlJyk7XG5cbi8vIGBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5nZXRvd25wcm9wZXJ0eW5hbWVzXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldG93bnByb3BlcnR5bmFtZXMgLS0gc2FmZVxuZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgfHwgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhPKSB7XG4gIHJldHVybiBpbnRlcm5hbE9iamVjdEtleXMoTywgaGlkZGVuS2V5cyk7XG59O1xuIiwiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRvd25wcm9wZXJ0eXN5bWJvbHMgLS0gc2FmZVxuZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbiIsInZhciB1bmN1cnJ5VGhpcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB1bmN1cnJ5VGhpcyh7fS5pc1Byb3RvdHlwZU9mKTtcbiIsInZhciB1bmN1cnJ5VGhpcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMnKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIHRvSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbmRleGVkLW9iamVjdCcpO1xudmFyIGluZGV4T2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktaW5jbHVkZXMnKS5pbmRleE9mO1xudmFyIGhpZGRlbktleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGlkZGVuLWtleXMnKTtcblxudmFyIHB1c2ggPSB1bmN1cnJ5VGhpcyhbXS5wdXNoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lcykge1xuICB2YXIgTyA9IHRvSW5kZXhlZE9iamVjdChvYmplY3QpO1xuICB2YXIgaSA9IDA7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gTykgIWhhc093bihoaWRkZW5LZXlzLCBrZXkpICYmIGhhc093bihPLCBrZXkpICYmIHB1c2gocmVzdWx0LCBrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSBpZiAoaGFzT3duKE8sIGtleSA9IG5hbWVzW2krK10pKSB7XG4gICAgfmluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHB1c2gocmVzdWx0LCBrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3IgLS0gc2FmZVxudmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbi8vIE5hc2hvcm4gfiBKREs4IGJ1Z1xudmFyIE5BU0hPUk5fQlVHID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yICYmICEkcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh7IDE6IDIgfSwgMSk7XG5cbi8vIGBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlYCBtZXRob2QgaW1wbGVtZW50YXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eWlzZW51bWVyYWJsZVxuZXhwb3J0cy5mID0gTkFTSE9STl9CVUcgPyBmdW5jdGlvbiBwcm9wZXJ0eUlzRW51bWVyYWJsZShWKSB7XG4gIHZhciBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXMsIFYpO1xuICByZXR1cm4gISFkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3IuZW51bWVyYWJsZTtcbn0gOiAkcHJvcGVydHlJc0VudW1lcmFibGU7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgVE9fU1RSSU5HX1RBR19TVVBQT1JUID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXN0cmluZy10YWctc3VwcG9ydCcpO1xudmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY2xhc3NvZicpO1xuXG4vLyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AgbWV0aG9kIGltcGxlbWVudGF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gVE9fU1RSSU5HX1RBR19TVVBQT1JUID8ge30udG9TdHJpbmcgOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuICdbb2JqZWN0ICcgKyBjbGFzc29mKHRoaXMpICsgJ10nO1xufTtcbiIsInZhciBjYWxsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLWNhbGwnKTtcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG5cbnZhciAkVHlwZUVycm9yID0gVHlwZUVycm9yO1xuXG4vLyBgT3JkaW5hcnlUb1ByaW1pdGl2ZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9yZGluYXJ5dG9wcmltaXRpdmVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGlucHV0LCBwcmVmKSB7XG4gIHZhciBmbiwgdmFsO1xuICBpZiAocHJlZiA9PT0gJ3N0cmluZycgJiYgaXNDYWxsYWJsZShmbiA9IGlucHV0LnRvU3RyaW5nKSAmJiAhaXNPYmplY3QodmFsID0gY2FsbChmbiwgaW5wdXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKGlzQ2FsbGFibGUoZm4gPSBpbnB1dC52YWx1ZU9mKSAmJiAhaXNPYmplY3QodmFsID0gY2FsbChmbiwgaW5wdXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKHByZWYgIT09ICdzdHJpbmcnICYmIGlzQ2FsbGFibGUoZm4gPSBpbnB1dC50b1N0cmluZykgJiYgIWlzT2JqZWN0KHZhbCA9IGNhbGwoZm4sIGlucHV0KSkpIHJldHVybiB2YWw7XG4gIHRocm93ICRUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGdldEJ1aWx0SW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2V0LWJ1aWx0LWluJyk7XG52YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG52YXIgZ2V0T3duUHJvcGVydHlOYW1lc01vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1uYW1lcycpO1xudmFyIGdldE93blByb3BlcnR5U3ltYm9sc01vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG5cbnZhciBjb25jYXQgPSB1bmN1cnJ5VGhpcyhbXS5jb25jYXQpO1xuXG4vLyBhbGwgb2JqZWN0IGtleXMsIGluY2x1ZGVzIG5vbi1lbnVtZXJhYmxlIGFuZCBzeW1ib2xzXG5tb2R1bGUuZXhwb3J0cyA9IGdldEJ1aWx0SW4oJ1JlZmxlY3QnLCAnb3duS2V5cycpIHx8IGZ1bmN0aW9uIG93bktleXMoaXQpIHtcbiAgdmFyIGtleXMgPSBnZXRPd25Qcm9wZXJ0eU5hbWVzTW9kdWxlLmYoYW5PYmplY3QoaXQpKTtcbiAgdmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9sc01vZHVsZS5mO1xuICByZXR1cm4gZ2V0T3duUHJvcGVydHlTeW1ib2xzID8gY29uY2F0KGtleXMsIGdldE93blByb3BlcnR5U3ltYm9scyhpdCkpIDoga2V5cztcbn07XG4iLCJ2YXIgaXNOdWxsT3JVbmRlZmluZWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtbnVsbC1vci11bmRlZmluZWQnKTtcblxudmFyICRUeXBlRXJyb3IgPSBUeXBlRXJyb3I7XG5cbi8vIGBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtcmVxdWlyZW9iamVjdGNvZXJjaWJsZVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGlzTnVsbE9yVW5kZWZpbmVkKGl0KSkgdGhyb3cgJFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdWlkJyk7XG5cbnZhciBrZXlzID0gc2hhcmVkKCdrZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4ga2V5c1trZXldIHx8IChrZXlzW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBkZWZpbmVHbG9iYWxQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZWZpbmUtZ2xvYmFsLXByb3BlcnR5Jyk7XG5cbnZhciBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJztcbnZhciBzdG9yZSA9IGdsb2JhbFtTSEFSRURdIHx8IGRlZmluZUdsb2JhbFByb3BlcnR5KFNIQVJFRCwge30pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JlO1xuIiwidmFyIElTX1BVUkUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtcHVyZScpO1xudmFyIHN0b3JlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1zdG9yZScpO1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHt9KTtcbn0pKCd2ZXJzaW9ucycsIFtdKS5wdXNoKHtcbiAgdmVyc2lvbjogJzMuMzAuMScsXG4gIG1vZGU6IElTX1BVUkUgPyAncHVyZScgOiAnZ2xvYmFsJyxcbiAgY29weXJpZ2h0OiAnwqkgMjAxNC0yMDIzIERlbmlzIFB1c2hrYXJldiAoemxvaXJvY2sucnUpJyxcbiAgbGljZW5zZTogJ2h0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2Jsb2IvdjMuMzAuMS9MSUNFTlNFJyxcbiAgc291cmNlOiAnaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMnXG59KTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIGVzL25vLXN5bWJvbCAtLSByZXF1aXJlZCBmb3IgdGVzdGluZyAqL1xudmFyIFY4X1ZFUlNJT04gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW5naW5lLXY4LXZlcnNpb24nKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldG93bnByb3BlcnR5c3ltYm9scyAtLSByZXF1aXJlZCBmb3IgdGVzdGluZ1xubW9kdWxlLmV4cG9ydHMgPSAhIU9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHN5bWJvbCA9IFN5bWJvbCgpO1xuICAvLyBDaHJvbWUgMzggU3ltYm9sIGhhcyBpbmNvcnJlY3QgdG9TdHJpbmcgY29udmVyc2lvblxuICAvLyBgZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzYCBwb2x5ZmlsbCBzeW1ib2xzIGNvbnZlcnRlZCB0byBvYmplY3QgYXJlIG5vdCBTeW1ib2wgaW5zdGFuY2VzXG4gIHJldHVybiAhU3RyaW5nKHN5bWJvbCkgfHwgIShPYmplY3Qoc3ltYm9sKSBpbnN0YW5jZW9mIFN5bWJvbCkgfHxcbiAgICAvLyBDaHJvbWUgMzgtNDAgc3ltYm9scyBhcmUgbm90IGluaGVyaXRlZCBmcm9tIERPTSBjb2xsZWN0aW9ucyBwcm90b3R5cGVzIHRvIGluc3RhbmNlc1xuICAgICFTeW1ib2wuc2hhbSAmJiBWOF9WRVJTSU9OICYmIFY4X1ZFUlNJT04gPCA0MTtcbn0pO1xuIiwidmFyIHRvSW50ZWdlck9ySW5maW5pdHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW50ZWdlci1vci1pbmZpbml0eScpO1xuXG52YXIgbWF4ID0gTWF0aC5tYXg7XG52YXIgbWluID0gTWF0aC5taW47XG5cbi8vIEhlbHBlciBmb3IgYSBwb3B1bGFyIHJlcGVhdGluZyBjYXNlIG9mIHRoZSBzcGVjOlxuLy8gTGV0IGludGVnZXIgYmUgPyBUb0ludGVnZXIoaW5kZXgpLlxuLy8gSWYgaW50ZWdlciA8IDAsIGxldCByZXN1bHQgYmUgbWF4KChsZW5ndGggKyBpbnRlZ2VyKSwgMCk7IGVsc2UgbGV0IHJlc3VsdCBiZSBtaW4oaW50ZWdlciwgbGVuZ3RoKS5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgdmFyIGludGVnZXIgPSB0b0ludGVnZXJPckluZmluaXR5KGluZGV4KTtcbiAgcmV0dXJuIGludGVnZXIgPCAwID8gbWF4KGludGVnZXIgKyBsZW5ndGgsIDApIDogbWluKGludGVnZXIsIGxlbmd0aCk7XG59O1xuIiwiLy8gdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luZGV4ZWQtb2JqZWN0Jyk7XG52YXIgcmVxdWlyZU9iamVjdENvZXJjaWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIEluZGV4ZWRPYmplY3QocmVxdWlyZU9iamVjdENvZXJjaWJsZShpdCkpO1xufTtcbiIsInZhciB0cnVuYyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9tYXRoLXRydW5jJyk7XG5cbi8vIGBUb0ludGVnZXJPckluZmluaXR5YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9pbnRlZ2Vyb3JpbmZpbml0eVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgdmFyIG51bWJlciA9ICthcmd1bWVudDtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZSAtLSBOYU4gY2hlY2tcbiAgcmV0dXJuIG51bWJlciAhPT0gbnVtYmVyIHx8IG51bWJlciA9PT0gMCA/IDAgOiB0cnVuYyhudW1iZXIpO1xufTtcbiIsInZhciB0b0ludGVnZXJPckluZmluaXR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWludGVnZXItb3ItaW5maW5pdHknKTtcblxudmFyIG1pbiA9IE1hdGgubWluO1xuXG4vLyBgVG9MZW5ndGhgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10b2xlbmd0aFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgcmV0dXJuIGFyZ3VtZW50ID4gMCA/IG1pbih0b0ludGVnZXJPckluZmluaXR5KGFyZ3VtZW50KSwgMHgxRkZGRkZGRkZGRkZGRikgOiAwOyAvLyAyICoqIDUzIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuIiwidmFyIHJlcXVpcmVPYmplY3RDb2VyY2libGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlJyk7XG5cbnZhciAkT2JqZWN0ID0gT2JqZWN0O1xuXG4vLyBgVG9PYmplY3RgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10b29iamVjdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgcmV0dXJuICRPYmplY3QocmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudCkpO1xufTtcbiIsInZhciBjYWxsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLWNhbGwnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBpc1N5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1zeW1ib2wnKTtcbnZhciBnZXRNZXRob2QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2V0LW1ldGhvZCcpO1xudmFyIG9yZGluYXJ5VG9QcmltaXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb3JkaW5hcnktdG8tcHJpbWl0aXZlJyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciAkVHlwZUVycm9yID0gVHlwZUVycm9yO1xudmFyIFRPX1BSSU1JVElWRSA9IHdlbGxLbm93blN5bWJvbCgndG9QcmltaXRpdmUnKTtcblxuLy8gYFRvUHJpbWl0aXZlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9wcmltaXRpdmVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGlucHV0LCBwcmVmKSB7XG4gIGlmICghaXNPYmplY3QoaW5wdXQpIHx8IGlzU3ltYm9sKGlucHV0KSkgcmV0dXJuIGlucHV0O1xuICB2YXIgZXhvdGljVG9QcmltID0gZ2V0TWV0aG9kKGlucHV0LCBUT19QUklNSVRJVkUpO1xuICB2YXIgcmVzdWx0O1xuICBpZiAoZXhvdGljVG9QcmltKSB7XG4gICAgaWYgKHByZWYgPT09IHVuZGVmaW5lZCkgcHJlZiA9ICdkZWZhdWx0JztcbiAgICByZXN1bHQgPSBjYWxsKGV4b3RpY1RvUHJpbSwgaW5wdXQsIHByZWYpO1xuICAgIGlmICghaXNPYmplY3QocmVzdWx0KSB8fCBpc1N5bWJvbChyZXN1bHQpKSByZXR1cm4gcmVzdWx0O1xuICAgIHRocm93ICRUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG4gIH1cbiAgaWYgKHByZWYgPT09IHVuZGVmaW5lZCkgcHJlZiA9ICdudW1iZXInO1xuICByZXR1cm4gb3JkaW5hcnlUb1ByaW1pdGl2ZShpbnB1dCwgcHJlZik7XG59O1xuIiwidmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXByaW1pdGl2ZScpO1xudmFyIGlzU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLXN5bWJvbCcpO1xuXG4vLyBgVG9Qcm9wZXJ0eUtleWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvcHJvcGVydHlrZXlcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHZhciBrZXkgPSB0b1ByaW1pdGl2ZShhcmd1bWVudCwgJ3N0cmluZycpO1xuICByZXR1cm4gaXNTeW1ib2woa2V5KSA/IGtleSA6IGtleSArICcnO1xufTtcbiIsInZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcblxudmFyIFRPX1NUUklOR19UQUcgPSB3ZWxsS25vd25TeW1ib2woJ3RvU3RyaW5nVGFnJyk7XG52YXIgdGVzdCA9IHt9O1xuXG50ZXN0W1RPX1NUUklOR19UQUddID0gJ3onO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0cmluZyh0ZXN0KSA9PT0gJ1tvYmplY3Qgel0nO1xuIiwidmFyICRTdHJpbmcgPSBTdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICRTdHJpbmcoYXJndW1lbnQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiAnT2JqZWN0JztcbiAgfVxufTtcbiIsInZhciB1bmN1cnJ5VGhpcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMnKTtcblxudmFyIGlkID0gMDtcbnZhciBwb3N0Zml4ID0gTWF0aC5yYW5kb20oKTtcbnZhciB0b1N0cmluZyA9IHVuY3VycnlUaGlzKDEuMC50b1N0cmluZyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnICsgKGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXkpICsgJylfJyArIHRvU3RyaW5nKCsraWQgKyBwb3N0Zml4LCAzNik7XG59O1xuIiwiLyogZXNsaW50LWRpc2FibGUgZXMvbm8tc3ltYm9sIC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nICovXG52YXIgTkFUSVZFX1NZTUJPTCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zeW1ib2wtY29uc3RydWN0b3ItZGV0ZWN0aW9uJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gTkFUSVZFX1NZTUJPTFxuICAmJiAhU3ltYm9sLnNoYW1cbiAgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PSAnc3ltYm9sJztcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbi8vIFY4IH4gQ2hyb21lIDM2LVxuLy8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzMzNFxubW9kdWxlLmV4cG9ydHMgPSBERVNDUklQVE9SUyAmJiBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZGVmaW5lcHJvcGVydHkgLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmdcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH0sICdwcm90b3R5cGUnLCB7XG4gICAgdmFsdWU6IDQyLFxuICAgIHdyaXRhYmxlOiBmYWxzZVxuICB9KS5wcm90b3R5cGUgIT0gNDI7XG59KTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xuXG52YXIgV2Vha01hcCA9IGdsb2JhbC5XZWFrTWFwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQ2FsbGFibGUoV2Vha01hcCkgJiYgL25hdGl2ZSBjb2RlLy50ZXN0KFN0cmluZyhXZWFrTWFwKSk7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQnKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91aWQnKTtcbnZhciBOQVRJVkVfU1lNQk9MID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3N5bWJvbC1jb25zdHJ1Y3Rvci1kZXRlY3Rpb24nKTtcbnZhciBVU0VfU1lNQk9MX0FTX1VJRCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91c2Utc3ltYm9sLWFzLXVpZCcpO1xuXG52YXIgU3ltYm9sID0gZ2xvYmFsLlN5bWJvbDtcbnZhciBXZWxsS25vd25TeW1ib2xzU3RvcmUgPSBzaGFyZWQoJ3drcycpO1xudmFyIGNyZWF0ZVdlbGxLbm93blN5bWJvbCA9IFVTRV9TWU1CT0xfQVNfVUlEID8gU3ltYm9sWydmb3InXSB8fCBTeW1ib2wgOiBTeW1ib2wgJiYgU3ltYm9sLndpdGhvdXRTZXR0ZXIgfHwgdWlkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIGlmICghaGFzT3duKFdlbGxLbm93blN5bWJvbHNTdG9yZSwgbmFtZSkpIHtcbiAgICBXZWxsS25vd25TeW1ib2xzU3RvcmVbbmFtZV0gPSBOQVRJVkVfU1lNQk9MICYmIGhhc093bihTeW1ib2wsIG5hbWUpXG4gICAgICA/IFN5bWJvbFtuYW1lXVxuICAgICAgOiBjcmVhdGVXZWxsS25vd25TeW1ib2woJ1N5bWJvbC4nICsgbmFtZSk7XG4gIH0gcmV0dXJuIFdlbGxLbm93blN5bWJvbHNTdG9yZVtuYW1lXTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBmb3JFYWNoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWZvci1lYWNoJyk7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUuZm9yRWFjaGAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5mb3JlYWNoXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tYXJyYXktcHJvdG90eXBlLWZvcmVhY2ggLS0gc2FmZVxuJCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogW10uZm9yRWFjaCAhPSBmb3JFYWNoIH0sIHtcbiAgZm9yRWFjaDogZm9yRWFjaFxufSk7XG4iLCJ2YXIgVE9fU1RSSU5HX1RBR19TVVBQT1JUID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXN0cmluZy10YWctc3VwcG9ydCcpO1xudmFyIGRlZmluZUJ1aWx0SW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVmaW5lLWJ1aWx0LWluJyk7XG52YXIgdG9TdHJpbmcgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LXRvLXN0cmluZycpO1xuXG4vLyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmdcbmlmICghVE9fU1RSSU5HX1RBR19TVVBQT1JUKSB7XG4gIGRlZmluZUJ1aWx0SW4oT2JqZWN0LnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgdG9TdHJpbmcsIHsgdW5zYWZlOiB0cnVlIH0pO1xufVxuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBET01JdGVyYWJsZXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZG9tLWl0ZXJhYmxlcycpO1xudmFyIERPTVRva2VuTGlzdFByb3RvdHlwZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kb20tdG9rZW4tbGlzdC1wcm90b3R5cGUnKTtcbnZhciBmb3JFYWNoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWZvci1lYWNoJyk7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xuXG52YXIgaGFuZGxlUHJvdG90eXBlID0gZnVuY3Rpb24gKENvbGxlY3Rpb25Qcm90b3R5cGUpIHtcbiAgLy8gc29tZSBDaHJvbWUgdmVyc2lvbnMgaGF2ZSBub24tY29uZmlndXJhYmxlIG1ldGhvZHMgb24gRE9NVG9rZW5MaXN0XG4gIGlmIChDb2xsZWN0aW9uUHJvdG90eXBlICYmIENvbGxlY3Rpb25Qcm90b3R5cGUuZm9yRWFjaCAhPT0gZm9yRWFjaCkgdHJ5IHtcbiAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoQ29sbGVjdGlvblByb3RvdHlwZSwgJ2ZvckVhY2gnLCBmb3JFYWNoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBDb2xsZWN0aW9uUHJvdG90eXBlLmZvckVhY2ggPSBmb3JFYWNoO1xuICB9XG59O1xuXG5mb3IgKHZhciBDT0xMRUNUSU9OX05BTUUgaW4gRE9NSXRlcmFibGVzKSB7XG4gIGlmIChET01JdGVyYWJsZXNbQ09MTEVDVElPTl9OQU1FXSkge1xuICAgIGhhbmRsZVByb3RvdHlwZShnbG9iYWxbQ09MTEVDVElPTl9OQU1FXSAmJiBnbG9iYWxbQ09MTEVDVElPTl9OQU1FXS5wcm90b3R5cGUpO1xuICB9XG59XG5cbmhhbmRsZVByb3RvdHlwZShET01Ub2tlbkxpc3RQcm90b3R5cGUpO1xuIiwiaW1wb3J0IHsgRXZlbnRzIGFzIHh0LCBnZXRPcHRpb25zIGFzIHZ0LCBjcmVhdGVQaWNrZXIgYXMgYnQsIEZvY3VzVHJhcCBhcyBFdCwgYW5pbWF0ZSBhcyBaLCBjcmVhdGVTdHlsZUluamVjdG9yIGFzIEN0IH0gZnJvbSBcInBpY21vXCI7XG5mdW5jdGlvbiBWKHQpIHtcbiAgcmV0dXJuIHQuc3BsaXQoXCItXCIpWzBdO1xufVxuZnVuY3Rpb24gTih0KSB7XG4gIHJldHVybiB0LnNwbGl0KFwiLVwiKVsxXTtcbn1cbmZ1bmN0aW9uIEsodCkge1xuICByZXR1cm4gW1widG9wXCIsIFwiYm90dG9tXCJdLmluY2x1ZGVzKFYodCkpID8gXCJ4XCIgOiBcInlcIjtcbn1cbmZ1bmN0aW9uIGF0KHQpIHtcbiAgcmV0dXJuIHQgPT09IFwieVwiID8gXCJoZWlnaHRcIiA6IFwid2lkdGhcIjtcbn1cbmZ1bmN0aW9uIHR0KHQsIGUsIG4pIHtcbiAgbGV0IHtcbiAgICByZWZlcmVuY2U6IGksXG4gICAgZmxvYXRpbmc6IG9cbiAgfSA9IHQ7XG4gIGNvbnN0IGMgPSBpLnggKyBpLndpZHRoIC8gMiAtIG8ud2lkdGggLyAyLCByID0gaS55ICsgaS5oZWlnaHQgLyAyIC0gby5oZWlnaHQgLyAyLCBzID0gSyhlKSwgbCA9IGF0KHMpLCBhID0gaVtsXSAvIDIgLSBvW2xdIC8gMiwgZCA9IFYoZSksIGYgPSBzID09PSBcInhcIjtcbiAgbGV0IHU7XG4gIHN3aXRjaCAoZCkge1xuICAgIGNhc2UgXCJ0b3BcIjpcbiAgICAgIHUgPSB7XG4gICAgICAgIHg6IGMsXG4gICAgICAgIHk6IGkueSAtIG8uaGVpZ2h0XG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImJvdHRvbVwiOlxuICAgICAgdSA9IHtcbiAgICAgICAgeDogYyxcbiAgICAgICAgeTogaS55ICsgaS5oZWlnaHRcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgIHUgPSB7XG4gICAgICAgIHg6IGkueCArIGkud2lkdGgsXG4gICAgICAgIHk6IHJcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgdSA9IHtcbiAgICAgICAgeDogaS54IC0gby53aWR0aCxcbiAgICAgICAgeTogclxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB1ID0ge1xuICAgICAgICB4OiBpLngsXG4gICAgICAgIHk6IGkueVxuICAgICAgfTtcbiAgfVxuICBzd2l0Y2ggKE4oZSkpIHtcbiAgICBjYXNlIFwic3RhcnRcIjpcbiAgICAgIHVbc10gLT0gYSAqIChuICYmIGYgPyAtMSA6IDEpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImVuZFwiOlxuICAgICAgdVtzXSArPSBhICogKG4gJiYgZiA/IC0xIDogMSk7XG4gICAgICBicmVhaztcbiAgfVxuICByZXR1cm4gdTtcbn1cbmNvbnN0IFB0ID0gYXN5bmMgKHQsIGUsIG4pID0+IHtcbiAgY29uc3Qge1xuICAgIHBsYWNlbWVudDogaSA9IFwiYm90dG9tXCIsXG4gICAgc3RyYXRlZ3k6IG8gPSBcImFic29sdXRlXCIsXG4gICAgbWlkZGxld2FyZTogYyA9IFtdLFxuICAgIHBsYXRmb3JtOiByXG4gIH0gPSBuLCBzID0gYXdhaXQgKHIuaXNSVEwgPT0gbnVsbCA/IHZvaWQgMCA6IHIuaXNSVEwoZSkpO1xuICBsZXQgbCA9IGF3YWl0IHIuZ2V0RWxlbWVudFJlY3RzKHtcbiAgICByZWZlcmVuY2U6IHQsXG4gICAgZmxvYXRpbmc6IGUsXG4gICAgc3RyYXRlZ3k6IG9cbiAgfSksIHtcbiAgICB4OiBhLFxuICAgIHk6IGRcbiAgfSA9IHR0KGwsIGksIHMpLCBmID0gaSwgdSA9IHt9LCBwID0gMDtcbiAgZm9yIChsZXQgbSA9IDA7IG0gPCBjLmxlbmd0aDsgbSsrKSB7XG4gICAgY29uc3Qge1xuICAgICAgbmFtZTogaCxcbiAgICAgIGZuOiB3XG4gICAgfSA9IGNbbV0sIHtcbiAgICAgIHg6IHksXG4gICAgICB5OiBnLFxuICAgICAgZGF0YTogdixcbiAgICAgIHJlc2V0OiB4XG4gICAgfSA9IGF3YWl0IHcoe1xuICAgICAgeDogYSxcbiAgICAgIHk6IGQsXG4gICAgICBpbml0aWFsUGxhY2VtZW50OiBpLFxuICAgICAgcGxhY2VtZW50OiBmLFxuICAgICAgc3RyYXRlZ3k6IG8sXG4gICAgICBtaWRkbGV3YXJlRGF0YTogdSxcbiAgICAgIHJlY3RzOiBsLFxuICAgICAgcGxhdGZvcm06IHIsXG4gICAgICBlbGVtZW50czoge1xuICAgICAgICByZWZlcmVuY2U6IHQsXG4gICAgICAgIGZsb2F0aW5nOiBlXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKGEgPSB5ICE9IG51bGwgPyB5IDogYSwgZCA9IGcgIT0gbnVsbCA/IGcgOiBkLCB1ID0ge1xuICAgICAgLi4udSxcbiAgICAgIFtoXToge1xuICAgICAgICAuLi51W2hdLFxuICAgICAgICAuLi52XG4gICAgICB9XG4gICAgfSwgeCAmJiBwIDw9IDUwKSB7XG4gICAgICBwKyssIHR5cGVvZiB4ID09IFwib2JqZWN0XCIgJiYgKHgucGxhY2VtZW50ICYmIChmID0geC5wbGFjZW1lbnQpLCB4LnJlY3RzICYmIChsID0geC5yZWN0cyA9PT0gITAgPyBhd2FpdCByLmdldEVsZW1lbnRSZWN0cyh7XG4gICAgICAgIHJlZmVyZW5jZTogdCxcbiAgICAgICAgZmxvYXRpbmc6IGUsXG4gICAgICAgIHN0cmF0ZWd5OiBvXG4gICAgICB9KSA6IHgucmVjdHMpLCB7XG4gICAgICAgIHg6IGEsXG4gICAgICAgIHk6IGRcbiAgICAgIH0gPSB0dChsLCBmLCBzKSksIG0gPSAtMTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIHg6IGEsXG4gICAgeTogZCxcbiAgICBwbGFjZW1lbnQ6IGYsXG4gICAgc3RyYXRlZ3k6IG8sXG4gICAgbWlkZGxld2FyZURhdGE6IHVcbiAgfTtcbn07XG5mdW5jdGlvbiBBdCh0KSB7XG4gIHJldHVybiB7XG4gICAgdG9wOiAwLFxuICAgIHJpZ2h0OiAwLFxuICAgIGJvdHRvbTogMCxcbiAgICBsZWZ0OiAwLFxuICAgIC4uLnRcbiAgfTtcbn1cbmZ1bmN0aW9uIEx0KHQpIHtcbiAgcmV0dXJuIHR5cGVvZiB0ICE9IFwibnVtYmVyXCIgPyBBdCh0KSA6IHtcbiAgICB0b3A6IHQsXG4gICAgcmlnaHQ6IHQsXG4gICAgYm90dG9tOiB0LFxuICAgIGxlZnQ6IHRcbiAgfTtcbn1cbmZ1bmN0aW9uIEkodCkge1xuICByZXR1cm4ge1xuICAgIC4uLnQsXG4gICAgdG9wOiB0LnksXG4gICAgbGVmdDogdC54LFxuICAgIHJpZ2h0OiB0LnggKyB0LndpZHRoLFxuICAgIGJvdHRvbTogdC55ICsgdC5oZWlnaHRcbiAgfTtcbn1cbmFzeW5jIGZ1bmN0aW9uIFEodCwgZSkge1xuICB2YXIgbjtcbiAgZSA9PT0gdm9pZCAwICYmIChlID0ge30pO1xuICBjb25zdCB7XG4gICAgeDogaSxcbiAgICB5OiBvLFxuICAgIHBsYXRmb3JtOiBjLFxuICAgIHJlY3RzOiByLFxuICAgIGVsZW1lbnRzOiBzLFxuICAgIHN0cmF0ZWd5OiBsXG4gIH0gPSB0LCB7XG4gICAgYm91bmRhcnk6IGEgPSBcImNsaXBwaW5nQW5jZXN0b3JzXCIsXG4gICAgcm9vdEJvdW5kYXJ5OiBkID0gXCJ2aWV3cG9ydFwiLFxuICAgIGVsZW1lbnRDb250ZXh0OiBmID0gXCJmbG9hdGluZ1wiLFxuICAgIGFsdEJvdW5kYXJ5OiB1ID0gITEsXG4gICAgcGFkZGluZzogcCA9IDBcbiAgfSA9IGUsIG0gPSBMdChwKSwgdyA9IHNbdSA/IGYgPT09IFwiZmxvYXRpbmdcIiA/IFwicmVmZXJlbmNlXCIgOiBcImZsb2F0aW5nXCIgOiBmXSwgeSA9IEkoYXdhaXQgYy5nZXRDbGlwcGluZ1JlY3Qoe1xuICAgIGVsZW1lbnQ6IChuID0gYXdhaXQgKGMuaXNFbGVtZW50ID09IG51bGwgPyB2b2lkIDAgOiBjLmlzRWxlbWVudCh3KSkpID09IG51bGwgfHwgbiA/IHcgOiB3LmNvbnRleHRFbGVtZW50IHx8IGF3YWl0IChjLmdldERvY3VtZW50RWxlbWVudCA9PSBudWxsID8gdm9pZCAwIDogYy5nZXREb2N1bWVudEVsZW1lbnQocy5mbG9hdGluZykpLFxuICAgIGJvdW5kYXJ5OiBhLFxuICAgIHJvb3RCb3VuZGFyeTogZCxcbiAgICBzdHJhdGVneTogbFxuICB9KSksIGcgPSBJKGMuY29udmVydE9mZnNldFBhcmVudFJlbGF0aXZlUmVjdFRvVmlld3BvcnRSZWxhdGl2ZVJlY3QgPyBhd2FpdCBjLmNvbnZlcnRPZmZzZXRQYXJlbnRSZWxhdGl2ZVJlY3RUb1ZpZXdwb3J0UmVsYXRpdmVSZWN0KHtcbiAgICByZWN0OiBmID09PSBcImZsb2F0aW5nXCIgPyB7XG4gICAgICAuLi5yLmZsb2F0aW5nLFxuICAgICAgeDogaSxcbiAgICAgIHk6IG9cbiAgICB9IDogci5yZWZlcmVuY2UsXG4gICAgb2Zmc2V0UGFyZW50OiBhd2FpdCAoYy5nZXRPZmZzZXRQYXJlbnQgPT0gbnVsbCA/IHZvaWQgMCA6IGMuZ2V0T2Zmc2V0UGFyZW50KHMuZmxvYXRpbmcpKSxcbiAgICBzdHJhdGVneTogbFxuICB9KSA6IHJbZl0pO1xuICByZXR1cm4ge1xuICAgIHRvcDogeS50b3AgLSBnLnRvcCArIG0udG9wLFxuICAgIGJvdHRvbTogZy5ib3R0b20gLSB5LmJvdHRvbSArIG0uYm90dG9tLFxuICAgIGxlZnQ6IHkubGVmdCAtIGcubGVmdCArIG0ubGVmdCxcbiAgICByaWdodDogZy5yaWdodCAtIHkucmlnaHQgKyBtLnJpZ2h0XG4gIH07XG59XG5jb25zdCBPdCA9IE1hdGgubWluLCBSdCA9IE1hdGgubWF4O1xuZnVuY3Rpb24gZXQodCwgZSwgbikge1xuICByZXR1cm4gUnQodCwgT3QoZSwgbikpO1xufVxuY29uc3Qga3QgPSB7XG4gIGxlZnQ6IFwicmlnaHRcIixcbiAgcmlnaHQ6IFwibGVmdFwiLFxuICBib3R0b206IFwidG9wXCIsXG4gIHRvcDogXCJib3R0b21cIlxufTtcbmZ1bmN0aW9uIHoodCkge1xuICByZXR1cm4gdC5yZXBsYWNlKC9sZWZ0fHJpZ2h0fGJvdHRvbXx0b3AvZywgKGUpID0+IGt0W2VdKTtcbn1cbmZ1bmN0aW9uIGZ0KHQsIGUsIG4pIHtcbiAgbiA9PT0gdm9pZCAwICYmIChuID0gITEpO1xuICBjb25zdCBpID0gTih0KSwgbyA9IEsodCksIGMgPSBhdChvKTtcbiAgbGV0IHIgPSBvID09PSBcInhcIiA/IGkgPT09IChuID8gXCJlbmRcIiA6IFwic3RhcnRcIikgPyBcInJpZ2h0XCIgOiBcImxlZnRcIiA6IGkgPT09IFwic3RhcnRcIiA/IFwiYm90dG9tXCIgOiBcInRvcFwiO1xuICByZXR1cm4gZS5yZWZlcmVuY2VbY10gPiBlLmZsb2F0aW5nW2NdICYmIChyID0geihyKSksIHtcbiAgICBtYWluOiByLFxuICAgIGNyb3NzOiB6KHIpXG4gIH07XG59XG5jb25zdCBUdCA9IHtcbiAgc3RhcnQ6IFwiZW5kXCIsXG4gIGVuZDogXCJzdGFydFwiXG59O1xuZnVuY3Rpb24gRyh0KSB7XG4gIHJldHVybiB0LnJlcGxhY2UoL3N0YXJ0fGVuZC9nLCAoZSkgPT4gVHRbZV0pO1xufVxuY29uc3QgQnQgPSBbXCJ0b3BcIiwgXCJyaWdodFwiLCBcImJvdHRvbVwiLCBcImxlZnRcIl0sIFN0ID0gLyogQF9fUFVSRV9fICovIEJ0LnJlZHVjZSgodCwgZSkgPT4gdC5jb25jYXQoZSwgZSArIFwiLXN0YXJ0XCIsIGUgKyBcIi1lbmRcIiksIFtdKTtcbmZ1bmN0aW9uIER0KHQsIGUsIG4pIHtcbiAgcmV0dXJuICh0ID8gWy4uLm4uZmlsdGVyKChvKSA9PiBOKG8pID09PSB0KSwgLi4ubi5maWx0ZXIoKG8pID0+IE4obykgIT09IHQpXSA6IG4uZmlsdGVyKChvKSA9PiBWKG8pID09PSBvKSkuZmlsdGVyKChvKSA9PiB0ID8gTihvKSA9PT0gdCB8fCAoZSA/IEcobykgIT09IG8gOiAhMSkgOiAhMCk7XG59XG5jb25zdCBWdCA9IGZ1bmN0aW9uKHQpIHtcbiAgcmV0dXJuIHQgPT09IHZvaWQgMCAmJiAodCA9IHt9KSwge1xuICAgIG5hbWU6IFwiYXV0b1BsYWNlbWVudFwiLFxuICAgIG9wdGlvbnM6IHQsXG4gICAgYXN5bmMgZm4oZSkge1xuICAgICAgdmFyIG4sIGksIG8sIGMsIHI7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHg6IHMsXG4gICAgICAgIHk6IGwsXG4gICAgICAgIHJlY3RzOiBhLFxuICAgICAgICBtaWRkbGV3YXJlRGF0YTogZCxcbiAgICAgICAgcGxhY2VtZW50OiBmLFxuICAgICAgICBwbGF0Zm9ybTogdSxcbiAgICAgICAgZWxlbWVudHM6IHBcbiAgICAgIH0gPSBlLCB7XG4gICAgICAgIGFsaWdubWVudDogbSA9IG51bGwsXG4gICAgICAgIGFsbG93ZWRQbGFjZW1lbnRzOiBoID0gU3QsXG4gICAgICAgIGF1dG9BbGlnbm1lbnQ6IHcgPSAhMCxcbiAgICAgICAgLi4ueVxuICAgICAgfSA9IHQsIGcgPSBEdChtLCB3LCBoKSwgdiA9IGF3YWl0IFEoZSwgeSksIHggPSAobiA9IChpID0gZC5hdXRvUGxhY2VtZW50KSA9PSBudWxsID8gdm9pZCAwIDogaS5pbmRleCkgIT0gbnVsbCA/IG4gOiAwLCBiID0gZ1t4XTtcbiAgICAgIGlmIChiID09IG51bGwpXG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgbWFpbjogSCxcbiAgICAgICAgY3Jvc3M6IGpcbiAgICAgIH0gPSBmdChiLCBhLCBhd2FpdCAodS5pc1JUTCA9PSBudWxsID8gdm9pZCAwIDogdS5pc1JUTChwLmZsb2F0aW5nKSkpO1xuICAgICAgaWYgKGYgIT09IGIpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgeDogcyxcbiAgICAgICAgICB5OiBsLFxuICAgICAgICAgIHJlc2V0OiB7XG4gICAgICAgICAgICBwbGFjZW1lbnQ6IGdbMF1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICBjb25zdCBfID0gW3ZbVihiKV0sIHZbSF0sIHZbal1dLCBFID0gWy4uLihvID0gKGMgPSBkLmF1dG9QbGFjZW1lbnQpID09IG51bGwgPyB2b2lkIDAgOiBjLm92ZXJmbG93cykgIT0gbnVsbCA/IG8gOiBbXSwge1xuICAgICAgICBwbGFjZW1lbnQ6IGIsXG4gICAgICAgIG92ZXJmbG93czogX1xuICAgICAgfV0sIEIgPSBnW3ggKyAxXTtcbiAgICAgIGlmIChCKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGluZGV4OiB4ICsgMSxcbiAgICAgICAgICAgIG92ZXJmbG93czogRVxuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVzZXQ6IHtcbiAgICAgICAgICAgIHBsYWNlbWVudDogQlxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIGNvbnN0IFMgPSBFLnNsaWNlKCkuc29ydCgoQSwgVykgPT4gQS5vdmVyZmxvd3NbMF0gLSBXLm92ZXJmbG93c1swXSksICQgPSAociA9IFMuZmluZCgoQSkgPT4ge1xuICAgICAgICBsZXQge1xuICAgICAgICAgIG92ZXJmbG93czogV1xuICAgICAgICB9ID0gQTtcbiAgICAgICAgcmV0dXJuIFcuZXZlcnkoKHl0KSA9PiB5dCA8PSAwKTtcbiAgICAgIH0pKSA9PSBudWxsID8gdm9pZCAwIDogci5wbGFjZW1lbnQsIEQgPSAkICE9IG51bGwgPyAkIDogU1swXS5wbGFjZW1lbnQ7XG4gICAgICByZXR1cm4gRCAhPT0gZiA/IHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGluZGV4OiB4ICsgMSxcbiAgICAgICAgICBvdmVyZmxvd3M6IEVcbiAgICAgICAgfSxcbiAgICAgICAgcmVzZXQ6IHtcbiAgICAgICAgICBwbGFjZW1lbnQ6IERcbiAgICAgICAgfVxuICAgICAgfSA6IHt9O1xuICAgIH1cbiAgfTtcbn07XG5mdW5jdGlvbiBOdCh0KSB7XG4gIGNvbnN0IGUgPSB6KHQpO1xuICByZXR1cm4gW0codCksIGUsIEcoZSldO1xufVxuY29uc3QgRnQgPSBmdW5jdGlvbih0KSB7XG4gIHJldHVybiB0ID09PSB2b2lkIDAgJiYgKHQgPSB7fSksIHtcbiAgICBuYW1lOiBcImZsaXBcIixcbiAgICBvcHRpb25zOiB0LFxuICAgIGFzeW5jIGZuKGUpIHtcbiAgICAgIHZhciBuO1xuICAgICAgY29uc3Qge1xuICAgICAgICBwbGFjZW1lbnQ6IGksXG4gICAgICAgIG1pZGRsZXdhcmVEYXRhOiBvLFxuICAgICAgICByZWN0czogYyxcbiAgICAgICAgaW5pdGlhbFBsYWNlbWVudDogcixcbiAgICAgICAgcGxhdGZvcm06IHMsXG4gICAgICAgIGVsZW1lbnRzOiBsXG4gICAgICB9ID0gZSwge1xuICAgICAgICBtYWluQXhpczogYSA9ICEwLFxuICAgICAgICBjcm9zc0F4aXM6IGQgPSAhMCxcbiAgICAgICAgZmFsbGJhY2tQbGFjZW1lbnRzOiBmLFxuICAgICAgICBmYWxsYmFja1N0cmF0ZWd5OiB1ID0gXCJiZXN0Rml0XCIsXG4gICAgICAgIGZsaXBBbGlnbm1lbnQ6IHAgPSAhMCxcbiAgICAgICAgLi4ubVxuICAgICAgfSA9IHQsIGggPSBWKGkpLCB5ID0gZiB8fCAoaCA9PT0gciB8fCAhcCA/IFt6KHIpXSA6IE50KHIpKSwgZyA9IFtyLCAuLi55XSwgdiA9IGF3YWl0IFEoZSwgbSksIHggPSBbXTtcbiAgICAgIGxldCBiID0gKChuID0gby5mbGlwKSA9PSBudWxsID8gdm9pZCAwIDogbi5vdmVyZmxvd3MpIHx8IFtdO1xuICAgICAgaWYgKGEgJiYgeC5wdXNoKHZbaF0pLCBkKSB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICBtYWluOiBFLFxuICAgICAgICAgIGNyb3NzOiBCXG4gICAgICAgIH0gPSBmdChpLCBjLCBhd2FpdCAocy5pc1JUTCA9PSBudWxsID8gdm9pZCAwIDogcy5pc1JUTChsLmZsb2F0aW5nKSkpO1xuICAgICAgICB4LnB1c2godltFXSwgdltCXSk7XG4gICAgICB9XG4gICAgICBpZiAoYiA9IFsuLi5iLCB7XG4gICAgICAgIHBsYWNlbWVudDogaSxcbiAgICAgICAgb3ZlcmZsb3dzOiB4XG4gICAgICB9XSwgIXguZXZlcnkoKEUpID0+IEUgPD0gMCkpIHtcbiAgICAgICAgdmFyIEgsIGo7XG4gICAgICAgIGNvbnN0IEUgPSAoKEggPSAoaiA9IG8uZmxpcCkgPT0gbnVsbCA/IHZvaWQgMCA6IGouaW5kZXgpICE9IG51bGwgPyBIIDogMCkgKyAxLCBCID0gZ1tFXTtcbiAgICAgICAgaWYgKEIpXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgaW5kZXg6IEUsXG4gICAgICAgICAgICAgIG92ZXJmbG93czogYlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc2V0OiB7XG4gICAgICAgICAgICAgIHBsYWNlbWVudDogQlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIGxldCBTID0gXCJib3R0b21cIjtcbiAgICAgICAgc3dpdGNoICh1KSB7XG4gICAgICAgICAgY2FzZSBcImJlc3RGaXRcIjoge1xuICAgICAgICAgICAgdmFyIF87XG4gICAgICAgICAgICBjb25zdCAkID0gKF8gPSBiLm1hcCgoRCkgPT4gW0QsIEQub3ZlcmZsb3dzLmZpbHRlcigoQSkgPT4gQSA+IDApLnJlZHVjZSgoQSwgVykgPT4gQSArIFcsIDApXSkuc29ydCgoRCwgQSkgPT4gRFsxXSAtIEFbMV0pWzBdKSA9PSBudWxsID8gdm9pZCAwIDogX1swXS5wbGFjZW1lbnQ7XG4gICAgICAgICAgICAkICYmIChTID0gJCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FzZSBcImluaXRpYWxQbGFjZW1lbnRcIjpcbiAgICAgICAgICAgIFMgPSByO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgIT09IFMpXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc2V0OiB7XG4gICAgICAgICAgICAgIHBsYWNlbWVudDogU1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9O1xufTtcbmFzeW5jIGZ1bmN0aW9uICR0KHQsIGUpIHtcbiAgY29uc3Qge1xuICAgIHBsYWNlbWVudDogbixcbiAgICBwbGF0Zm9ybTogaSxcbiAgICBlbGVtZW50czogb1xuICB9ID0gdCwgYyA9IGF3YWl0IChpLmlzUlRMID09IG51bGwgPyB2b2lkIDAgOiBpLmlzUlRMKG8uZmxvYXRpbmcpKSwgciA9IFYobiksIHMgPSBOKG4pLCBsID0gSyhuKSA9PT0gXCJ4XCIsIGEgPSBbXCJsZWZ0XCIsIFwidG9wXCJdLmluY2x1ZGVzKHIpID8gLTEgOiAxLCBkID0gYyAmJiBsID8gLTEgOiAxLCBmID0gdHlwZW9mIGUgPT0gXCJmdW5jdGlvblwiID8gZSh0KSA6IGU7XG4gIGxldCB7XG4gICAgbWFpbkF4aXM6IHUsXG4gICAgY3Jvc3NBeGlzOiBwLFxuICAgIGFsaWdubWVudEF4aXM6IG1cbiAgfSA9IHR5cGVvZiBmID09IFwibnVtYmVyXCIgPyB7XG4gICAgbWFpbkF4aXM6IGYsXG4gICAgY3Jvc3NBeGlzOiAwLFxuICAgIGFsaWdubWVudEF4aXM6IG51bGxcbiAgfSA6IHtcbiAgICBtYWluQXhpczogMCxcbiAgICBjcm9zc0F4aXM6IDAsXG4gICAgYWxpZ25tZW50QXhpczogbnVsbCxcbiAgICAuLi5mXG4gIH07XG4gIHJldHVybiBzICYmIHR5cGVvZiBtID09IFwibnVtYmVyXCIgJiYgKHAgPSBzID09PSBcImVuZFwiID8gbSAqIC0xIDogbSksIGwgPyB7XG4gICAgeDogcCAqIGQsXG4gICAgeTogdSAqIGFcbiAgfSA6IHtcbiAgICB4OiB1ICogYSxcbiAgICB5OiBwICogZFxuICB9O1xufVxuY29uc3QgbnQgPSBmdW5jdGlvbih0KSB7XG4gIHJldHVybiB0ID09PSB2b2lkIDAgJiYgKHQgPSAwKSwge1xuICAgIG5hbWU6IFwib2Zmc2V0XCIsXG4gICAgb3B0aW9uczogdCxcbiAgICBhc3luYyBmbihlKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHg6IG4sXG4gICAgICAgIHk6IGlcbiAgICAgIH0gPSBlLCBvID0gYXdhaXQgJHQoZSwgdCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiBuICsgby54LFxuICAgICAgICB5OiBpICsgby55LFxuICAgICAgICBkYXRhOiBvXG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn07XG5mdW5jdGlvbiBXdCh0KSB7XG4gIHJldHVybiB0ID09PSBcInhcIiA/IFwieVwiIDogXCJ4XCI7XG59XG5jb25zdCBvdCA9IGZ1bmN0aW9uKHQpIHtcbiAgcmV0dXJuIHQgPT09IHZvaWQgMCAmJiAodCA9IHt9KSwge1xuICAgIG5hbWU6IFwic2hpZnRcIixcbiAgICBvcHRpb25zOiB0LFxuICAgIGFzeW5jIGZuKGUpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgeDogbixcbiAgICAgICAgeTogaSxcbiAgICAgICAgcGxhY2VtZW50OiBvXG4gICAgICB9ID0gZSwge1xuICAgICAgICBtYWluQXhpczogYyA9ICEwLFxuICAgICAgICBjcm9zc0F4aXM6IHIgPSAhMSxcbiAgICAgICAgbGltaXRlcjogcyA9IHtcbiAgICAgICAgICBmbjogKHcpID0+IHtcbiAgICAgICAgICAgIGxldCB7XG4gICAgICAgICAgICAgIHg6IHksXG4gICAgICAgICAgICAgIHk6IGdcbiAgICAgICAgICAgIH0gPSB3O1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgeDogeSxcbiAgICAgICAgICAgICAgeTogZ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC4uLmxcbiAgICAgIH0gPSB0LCBhID0ge1xuICAgICAgICB4OiBuLFxuICAgICAgICB5OiBpXG4gICAgICB9LCBkID0gYXdhaXQgUShlLCBsKSwgZiA9IEsoVihvKSksIHUgPSBXdChmKTtcbiAgICAgIGxldCBwID0gYVtmXSwgbSA9IGFbdV07XG4gICAgICBpZiAoYykge1xuICAgICAgICBjb25zdCB3ID0gZiA9PT0gXCJ5XCIgPyBcInRvcFwiIDogXCJsZWZ0XCIsIHkgPSBmID09PSBcInlcIiA/IFwiYm90dG9tXCIgOiBcInJpZ2h0XCIsIGcgPSBwICsgZFt3XSwgdiA9IHAgLSBkW3ldO1xuICAgICAgICBwID0gZXQoZywgcCwgdik7XG4gICAgICB9XG4gICAgICBpZiAocikge1xuICAgICAgICBjb25zdCB3ID0gdSA9PT0gXCJ5XCIgPyBcInRvcFwiIDogXCJsZWZ0XCIsIHkgPSB1ID09PSBcInlcIiA/IFwiYm90dG9tXCIgOiBcInJpZ2h0XCIsIGcgPSBtICsgZFt3XSwgdiA9IG0gLSBkW3ldO1xuICAgICAgICBtID0gZXQoZywgbSwgdik7XG4gICAgICB9XG4gICAgICBjb25zdCBoID0gcy5mbih7XG4gICAgICAgIC4uLmUsXG4gICAgICAgIFtmXTogcCxcbiAgICAgICAgW3VdOiBtXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmgsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB4OiBoLnggLSBuLFxuICAgICAgICAgIHk6IGgueSAtIGlcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG59O1xuZnVuY3Rpb24gdXQodCkge1xuICByZXR1cm4gdCAmJiB0LmRvY3VtZW50ICYmIHQubG9jYXRpb24gJiYgdC5hbGVydCAmJiB0LnNldEludGVydmFsO1xufVxuZnVuY3Rpb24gUih0KSB7XG4gIGlmICh0ID09IG51bGwpXG4gICAgcmV0dXJuIHdpbmRvdztcbiAgaWYgKCF1dCh0KSkge1xuICAgIGNvbnN0IGUgPSB0Lm93bmVyRG9jdW1lbnQ7XG4gICAgcmV0dXJuIGUgJiYgZS5kZWZhdWx0VmlldyB8fCB3aW5kb3c7XG4gIH1cbiAgcmV0dXJuIHQ7XG59XG5mdW5jdGlvbiBDKHQpIHtcbiAgcmV0dXJuIFIodCkuZ2V0Q29tcHV0ZWRTdHlsZSh0KTtcbn1cbmZ1bmN0aW9uIEwodCkge1xuICByZXR1cm4gdXQodCkgPyBcIlwiIDogdCA/ICh0Lm5vZGVOYW1lIHx8IFwiXCIpLnRvTG93ZXJDYXNlKCkgOiBcIlwiO1xufVxuZnVuY3Rpb24gZHQoKSB7XG4gIGNvbnN0IHQgPSBuYXZpZ2F0b3IudXNlckFnZW50RGF0YTtcbiAgcmV0dXJuIHQgIT0gbnVsbCAmJiB0LmJyYW5kcyA/IHQuYnJhbmRzLm1hcCgoZSkgPT4gZS5icmFuZCArIFwiL1wiICsgZS52ZXJzaW9uKS5qb2luKFwiIFwiKSA6IG5hdmlnYXRvci51c2VyQWdlbnQ7XG59XG5mdW5jdGlvbiBQKHQpIHtcbiAgcmV0dXJuIHQgaW5zdGFuY2VvZiBSKHQpLkhUTUxFbGVtZW50O1xufVxuZnVuY3Rpb24gayh0KSB7XG4gIHJldHVybiB0IGluc3RhbmNlb2YgUih0KS5FbGVtZW50O1xufVxuZnVuY3Rpb24gTXQodCkge1xuICByZXR1cm4gdCBpbnN0YW5jZW9mIFIodCkuTm9kZTtcbn1cbmZ1bmN0aW9uIEYodCkge1xuICBpZiAodHlwZW9mIFNoYWRvd1Jvb3QgPiBcInVcIilcbiAgICByZXR1cm4gITE7XG4gIGNvbnN0IGUgPSBSKHQpLlNoYWRvd1Jvb3Q7XG4gIHJldHVybiB0IGluc3RhbmNlb2YgZSB8fCB0IGluc3RhbmNlb2YgU2hhZG93Um9vdDtcbn1cbmZ1bmN0aW9uIFUodCkge1xuICBjb25zdCB7XG4gICAgb3ZlcmZsb3c6IGUsXG4gICAgb3ZlcmZsb3dYOiBuLFxuICAgIG92ZXJmbG93WTogaVxuICB9ID0gQyh0KTtcbiAgcmV0dXJuIC9hdXRvfHNjcm9sbHxvdmVybGF5fGhpZGRlbi8udGVzdChlICsgaSArIG4pO1xufVxuZnVuY3Rpb24gSHQodCkge1xuICByZXR1cm4gW1widGFibGVcIiwgXCJ0ZFwiLCBcInRoXCJdLmluY2x1ZGVzKEwodCkpO1xufVxuZnVuY3Rpb24gaHQodCkge1xuICBjb25zdCBlID0gL2ZpcmVmb3gvaS50ZXN0KGR0KCkpLCBuID0gQyh0KTtcbiAgcmV0dXJuIG4udHJhbnNmb3JtICE9PSBcIm5vbmVcIiB8fCBuLnBlcnNwZWN0aXZlICE9PSBcIm5vbmVcIiB8fCBuLmNvbnRhaW4gPT09IFwicGFpbnRcIiB8fCBbXCJ0cmFuc2Zvcm1cIiwgXCJwZXJzcGVjdGl2ZVwiXS5pbmNsdWRlcyhuLndpbGxDaGFuZ2UpIHx8IGUgJiYgbi53aWxsQ2hhbmdlID09PSBcImZpbHRlclwiIHx8IGUgJiYgKG4uZmlsdGVyID8gbi5maWx0ZXIgIT09IFwibm9uZVwiIDogITEpO1xufVxuZnVuY3Rpb24gcHQoKSB7XG4gIHJldHVybiAhL14oKD8hY2hyb21lfGFuZHJvaWQpLikqc2FmYXJpL2kudGVzdChkdCgpKTtcbn1cbmNvbnN0IGl0ID0gTWF0aC5taW4sIE0gPSBNYXRoLm1heCwgWCA9IE1hdGgucm91bmQ7XG5mdW5jdGlvbiBPKHQsIGUsIG4pIHtcbiAgdmFyIGksIG8sIGMsIHI7XG4gIGUgPT09IHZvaWQgMCAmJiAoZSA9ICExKSwgbiA9PT0gdm9pZCAwICYmIChuID0gITEpO1xuICBjb25zdCBzID0gdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgbGV0IGwgPSAxLCBhID0gMTtcbiAgZSAmJiBQKHQpICYmIChsID0gdC5vZmZzZXRXaWR0aCA+IDAgJiYgWChzLndpZHRoKSAvIHQub2Zmc2V0V2lkdGggfHwgMSwgYSA9IHQub2Zmc2V0SGVpZ2h0ID4gMCAmJiBYKHMuaGVpZ2h0KSAvIHQub2Zmc2V0SGVpZ2h0IHx8IDEpO1xuICBjb25zdCBkID0gayh0KSA/IFIodCkgOiB3aW5kb3csIGYgPSAhcHQoKSAmJiBuLCB1ID0gKHMubGVmdCArIChmICYmIChpID0gKG8gPSBkLnZpc3VhbFZpZXdwb3J0KSA9PSBudWxsID8gdm9pZCAwIDogby5vZmZzZXRMZWZ0KSAhPSBudWxsID8gaSA6IDApKSAvIGwsIHAgPSAocy50b3AgKyAoZiAmJiAoYyA9IChyID0gZC52aXN1YWxWaWV3cG9ydCkgPT0gbnVsbCA/IHZvaWQgMCA6IHIub2Zmc2V0VG9wKSAhPSBudWxsID8gYyA6IDApKSAvIGEsIG0gPSBzLndpZHRoIC8gbCwgaCA9IHMuaGVpZ2h0IC8gYTtcbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogbSxcbiAgICBoZWlnaHQ6IGgsXG4gICAgdG9wOiBwLFxuICAgIHJpZ2h0OiB1ICsgbSxcbiAgICBib3R0b206IHAgKyBoLFxuICAgIGxlZnQ6IHUsXG4gICAgeDogdSxcbiAgICB5OiBwXG4gIH07XG59XG5mdW5jdGlvbiBUKHQpIHtcbiAgcmV0dXJuICgoTXQodCkgPyB0Lm93bmVyRG9jdW1lbnQgOiB0LmRvY3VtZW50KSB8fCB3aW5kb3cuZG9jdW1lbnQpLmRvY3VtZW50RWxlbWVudDtcbn1cbmZ1bmN0aW9uIHEodCkge1xuICByZXR1cm4gayh0KSA/IHtcbiAgICBzY3JvbGxMZWZ0OiB0LnNjcm9sbExlZnQsXG4gICAgc2Nyb2xsVG9wOiB0LnNjcm9sbFRvcFxuICB9IDoge1xuICAgIHNjcm9sbExlZnQ6IHQucGFnZVhPZmZzZXQsXG4gICAgc2Nyb2xsVG9wOiB0LnBhZ2VZT2Zmc2V0XG4gIH07XG59XG5mdW5jdGlvbiBtdCh0KSB7XG4gIHJldHVybiBPKFQodCkpLmxlZnQgKyBxKHQpLnNjcm9sbExlZnQ7XG59XG5mdW5jdGlvbiBqdCh0KSB7XG4gIGNvbnN0IGUgPSBPKHQpO1xuICByZXR1cm4gWChlLndpZHRoKSAhPT0gdC5vZmZzZXRXaWR0aCB8fCBYKGUuaGVpZ2h0KSAhPT0gdC5vZmZzZXRIZWlnaHQ7XG59XG5mdW5jdGlvbiBfdCh0LCBlLCBuKSB7XG4gIGNvbnN0IGkgPSBQKGUpLCBvID0gVChlKSwgYyA9IE8oXG4gICAgdCxcbiAgICBpICYmIGp0KGUpLFxuICAgIG4gPT09IFwiZml4ZWRcIlxuICApO1xuICBsZXQgciA9IHtcbiAgICBzY3JvbGxMZWZ0OiAwLFxuICAgIHNjcm9sbFRvcDogMFxuICB9O1xuICBjb25zdCBzID0ge1xuICAgIHg6IDAsXG4gICAgeTogMFxuICB9O1xuICBpZiAoaSB8fCAhaSAmJiBuICE9PSBcImZpeGVkXCIpXG4gICAgaWYgKChMKGUpICE9PSBcImJvZHlcIiB8fCBVKG8pKSAmJiAociA9IHEoZSkpLCBQKGUpKSB7XG4gICAgICBjb25zdCBsID0gTyhlLCAhMCk7XG4gICAgICBzLnggPSBsLnggKyBlLmNsaWVudExlZnQsIHMueSA9IGwueSArIGUuY2xpZW50VG9wO1xuICAgIH0gZWxzZVxuICAgICAgbyAmJiAocy54ID0gbXQobykpO1xuICByZXR1cm4ge1xuICAgIHg6IGMubGVmdCArIHIuc2Nyb2xsTGVmdCAtIHMueCxcbiAgICB5OiBjLnRvcCArIHIuc2Nyb2xsVG9wIC0gcy55LFxuICAgIHdpZHRoOiBjLndpZHRoLFxuICAgIGhlaWdodDogYy5oZWlnaHRcbiAgfTtcbn1cbmZ1bmN0aW9uIGd0KHQpIHtcbiAgcmV0dXJuIEwodCkgPT09IFwiaHRtbFwiID8gdCA6IHQuYXNzaWduZWRTbG90IHx8IHQucGFyZW50Tm9kZSB8fCAoRih0KSA/IHQuaG9zdCA6IG51bGwpIHx8IFQodCk7XG59XG5mdW5jdGlvbiBzdCh0KSB7XG4gIHJldHVybiAhUCh0KSB8fCBDKHQpLnBvc2l0aW9uID09PSBcImZpeGVkXCIgPyBudWxsIDogSXQodCk7XG59XG5mdW5jdGlvbiBJdCh0KSB7XG4gIGxldCB7XG4gICAgb2Zmc2V0UGFyZW50OiBlXG4gIH0gPSB0LCBuID0gdCwgaSA9ICExO1xuICBmb3IgKDsgbiAmJiBuICE9PSBlOyApIHtcbiAgICBjb25zdCB7XG4gICAgICBhc3NpZ25lZFNsb3Q6IG9cbiAgICB9ID0gbjtcbiAgICBpZiAobykge1xuICAgICAgbGV0IGMgPSBvLm9mZnNldFBhcmVudDtcbiAgICAgIGlmIChDKG8pLmRpc3BsYXkgPT09IFwiY29udGVudHNcIikge1xuICAgICAgICBjb25zdCByID0gby5oYXNBdHRyaWJ1dGUoXCJzdHlsZVwiKSwgcyA9IG8uc3R5bGUuZGlzcGxheTtcbiAgICAgICAgby5zdHlsZS5kaXNwbGF5ID0gQyhuKS5kaXNwbGF5LCBjID0gby5vZmZzZXRQYXJlbnQsIG8uc3R5bGUuZGlzcGxheSA9IHMsIHIgfHwgby5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcbiAgICAgIH1cbiAgICAgIG4gPSBvLCBlICE9PSBjICYmIChlID0gYywgaSA9ICEwKTtcbiAgICB9IGVsc2UgaWYgKEYobikgJiYgbi5ob3N0ICYmIGkpXG4gICAgICBicmVhaztcbiAgICBuID0gRihuKSAmJiBuLmhvc3QgfHwgbi5wYXJlbnROb2RlO1xuICB9XG4gIHJldHVybiBlO1xufVxuZnVuY3Rpb24genQodCkge1xuICBsZXQgZSA9IGd0KHQpO1xuICBmb3IgKEYoZSkgJiYgKGUgPSBlLmhvc3QpOyBQKGUpICYmICFbXCJodG1sXCIsIFwiYm9keVwiXS5pbmNsdWRlcyhMKGUpKTsgKSB7XG4gICAgaWYgKGh0KGUpKVxuICAgICAgcmV0dXJuIGU7XG4gICAge1xuICAgICAgY29uc3QgbiA9IGUucGFyZW50Tm9kZTtcbiAgICAgIGUgPSBGKG4pID8gbi5ob3N0IDogbjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5mdW5jdGlvbiBKKHQpIHtcbiAgY29uc3QgZSA9IFIodCk7XG4gIGxldCBuID0gc3QodCk7XG4gIGZvciAoOyBuICYmIEh0KG4pICYmIEMobikucG9zaXRpb24gPT09IFwic3RhdGljXCI7IClcbiAgICBuID0gc3Qobik7XG4gIHJldHVybiBuICYmIChMKG4pID09PSBcImh0bWxcIiB8fCBMKG4pID09PSBcImJvZHlcIiAmJiBDKG4pLnBvc2l0aW9uID09PSBcInN0YXRpY1wiICYmICFodChuKSkgPyBlIDogbiB8fCB6dCh0KSB8fCBlO1xufVxuZnVuY3Rpb24gcnQodCkge1xuICBpZiAoUCh0KSlcbiAgICByZXR1cm4ge1xuICAgICAgd2lkdGg6IHQub2Zmc2V0V2lkdGgsXG4gICAgICBoZWlnaHQ6IHQub2Zmc2V0SGVpZ2h0XG4gICAgfTtcbiAgY29uc3QgZSA9IE8odCk7XG4gIHJldHVybiB7XG4gICAgd2lkdGg6IGUud2lkdGgsXG4gICAgaGVpZ2h0OiBlLmhlaWdodFxuICB9O1xufVxuZnVuY3Rpb24gWHQodCkge1xuICBsZXQge1xuICAgIHJlY3Q6IGUsXG4gICAgb2Zmc2V0UGFyZW50OiBuLFxuICAgIHN0cmF0ZWd5OiBpXG4gIH0gPSB0O1xuICBjb25zdCBvID0gUChuKSwgYyA9IFQobik7XG4gIGlmIChuID09PSBjKVxuICAgIHJldHVybiBlO1xuICBsZXQgciA9IHtcbiAgICBzY3JvbGxMZWZ0OiAwLFxuICAgIHNjcm9sbFRvcDogMFxuICB9O1xuICBjb25zdCBzID0ge1xuICAgIHg6IDAsXG4gICAgeTogMFxuICB9O1xuICBpZiAoKG8gfHwgIW8gJiYgaSAhPT0gXCJmaXhlZFwiKSAmJiAoKEwobikgIT09IFwiYm9keVwiIHx8IFUoYykpICYmIChyID0gcShuKSksIFAobikpKSB7XG4gICAgY29uc3QgbCA9IE8obiwgITApO1xuICAgIHMueCA9IGwueCArIG4uY2xpZW50TGVmdCwgcy55ID0gbC55ICsgbi5jbGllbnRUb3A7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICAuLi5lLFxuICAgIHg6IGUueCAtIHIuc2Nyb2xsTGVmdCArIHMueCxcbiAgICB5OiBlLnkgLSByLnNjcm9sbFRvcCArIHMueVxuICB9O1xufVxuZnVuY3Rpb24gWXQodCwgZSkge1xuICBjb25zdCBuID0gUih0KSwgaSA9IFQodCksIG8gPSBuLnZpc3VhbFZpZXdwb3J0O1xuICBsZXQgYyA9IGkuY2xpZW50V2lkdGgsIHIgPSBpLmNsaWVudEhlaWdodCwgcyA9IDAsIGwgPSAwO1xuICBpZiAobykge1xuICAgIGMgPSBvLndpZHRoLCByID0gby5oZWlnaHQ7XG4gICAgY29uc3QgYSA9IHB0KCk7XG4gICAgKGEgfHwgIWEgJiYgZSA9PT0gXCJmaXhlZFwiKSAmJiAocyA9IG8ub2Zmc2V0TGVmdCwgbCA9IG8ub2Zmc2V0VG9wKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIHdpZHRoOiBjLFxuICAgIGhlaWdodDogcixcbiAgICB4OiBzLFxuICAgIHk6IGxcbiAgfTtcbn1cbmZ1bmN0aW9uIEt0KHQpIHtcbiAgdmFyIGU7XG4gIGNvbnN0IG4gPSBUKHQpLCBpID0gcSh0KSwgbyA9IChlID0gdC5vd25lckRvY3VtZW50KSA9PSBudWxsID8gdm9pZCAwIDogZS5ib2R5LCBjID0gTShuLnNjcm9sbFdpZHRoLCBuLmNsaWVudFdpZHRoLCBvID8gby5zY3JvbGxXaWR0aCA6IDAsIG8gPyBvLmNsaWVudFdpZHRoIDogMCksIHIgPSBNKG4uc2Nyb2xsSGVpZ2h0LCBuLmNsaWVudEhlaWdodCwgbyA/IG8uc2Nyb2xsSGVpZ2h0IDogMCwgbyA/IG8uY2xpZW50SGVpZ2h0IDogMCk7XG4gIGxldCBzID0gLWkuc2Nyb2xsTGVmdCArIG10KHQpO1xuICBjb25zdCBsID0gLWkuc2Nyb2xsVG9wO1xuICByZXR1cm4gQyhvIHx8IG4pLmRpcmVjdGlvbiA9PT0gXCJydGxcIiAmJiAocyArPSBNKG4uY2xpZW50V2lkdGgsIG8gPyBvLmNsaWVudFdpZHRoIDogMCkgLSBjKSwge1xuICAgIHdpZHRoOiBjLFxuICAgIGhlaWdodDogcixcbiAgICB4OiBzLFxuICAgIHk6IGxcbiAgfTtcbn1cbmZ1bmN0aW9uIHd0KHQpIHtcbiAgY29uc3QgZSA9IGd0KHQpO1xuICByZXR1cm4gW1wiaHRtbFwiLCBcImJvZHlcIiwgXCIjZG9jdW1lbnRcIl0uaW5jbHVkZXMoTChlKSkgPyB0Lm93bmVyRG9jdW1lbnQuYm9keSA6IFAoZSkgJiYgVShlKSA/IGUgOiB3dChlKTtcbn1cbmZ1bmN0aW9uIFkodCwgZSkge1xuICB2YXIgbjtcbiAgZSA9PT0gdm9pZCAwICYmIChlID0gW10pO1xuICBjb25zdCBpID0gd3QodCksIG8gPSBpID09PSAoKG4gPSB0Lm93bmVyRG9jdW1lbnQpID09IG51bGwgPyB2b2lkIDAgOiBuLmJvZHkpLCBjID0gUihpKSwgciA9IG8gPyBbY10uY29uY2F0KGMudmlzdWFsVmlld3BvcnQgfHwgW10sIFUoaSkgPyBpIDogW10pIDogaSwgcyA9IGUuY29uY2F0KHIpO1xuICByZXR1cm4gbyA/IHMgOiBzLmNvbmNhdChZKHIpKTtcbn1cbmZ1bmN0aW9uIFV0KHQsIGUpIHtcbiAgY29uc3QgbiA9IGUuZ2V0Um9vdE5vZGUgPT0gbnVsbCA/IHZvaWQgMCA6IGUuZ2V0Um9vdE5vZGUoKTtcbiAgaWYgKHQuY29udGFpbnMoZSkpXG4gICAgcmV0dXJuICEwO1xuICBpZiAobiAmJiBGKG4pKSB7XG4gICAgbGV0IGkgPSBlO1xuICAgIGRvIHtcbiAgICAgIGlmIChpICYmIHQgPT09IGkpXG4gICAgICAgIHJldHVybiAhMDtcbiAgICAgIGkgPSBpLnBhcmVudE5vZGUgfHwgaS5ob3N0O1xuICAgIH0gd2hpbGUgKGkpO1xuICB9XG4gIHJldHVybiAhMTtcbn1cbmZ1bmN0aW9uIHF0KHQsIGUpIHtcbiAgY29uc3QgbiA9IE8odCwgITEsIGUgPT09IFwiZml4ZWRcIiksIGkgPSBuLnRvcCArIHQuY2xpZW50VG9wLCBvID0gbi5sZWZ0ICsgdC5jbGllbnRMZWZ0O1xuICByZXR1cm4ge1xuICAgIHRvcDogaSxcbiAgICBsZWZ0OiBvLFxuICAgIHg6IG8sXG4gICAgeTogaSxcbiAgICByaWdodDogbyArIHQuY2xpZW50V2lkdGgsXG4gICAgYm90dG9tOiBpICsgdC5jbGllbnRIZWlnaHQsXG4gICAgd2lkdGg6IHQuY2xpZW50V2lkdGgsXG4gICAgaGVpZ2h0OiB0LmNsaWVudEhlaWdodFxuICB9O1xufVxuZnVuY3Rpb24gY3QodCwgZSwgbikge1xuICByZXR1cm4gZSA9PT0gXCJ2aWV3cG9ydFwiID8gSShZdCh0LCBuKSkgOiBrKGUpID8gcXQoZSwgbikgOiBJKEt0KFQodCkpKTtcbn1cbmZ1bmN0aW9uIEd0KHQpIHtcbiAgY29uc3QgZSA9IFkodCksIGkgPSBbXCJhYnNvbHV0ZVwiLCBcImZpeGVkXCJdLmluY2x1ZGVzKEModCkucG9zaXRpb24pICYmIFAodCkgPyBKKHQpIDogdDtcbiAgcmV0dXJuIGsoaSkgPyBlLmZpbHRlcigobykgPT4gayhvKSAmJiBVdChvLCBpKSAmJiBMKG8pICE9PSBcImJvZHlcIikgOiBbXTtcbn1cbmZ1bmN0aW9uIEp0KHQpIHtcbiAgbGV0IHtcbiAgICBlbGVtZW50OiBlLFxuICAgIGJvdW5kYXJ5OiBuLFxuICAgIHJvb3RCb3VuZGFyeTogaSxcbiAgICBzdHJhdGVneTogb1xuICB9ID0gdDtcbiAgY29uc3QgciA9IFsuLi5uID09PSBcImNsaXBwaW5nQW5jZXN0b3JzXCIgPyBHdChlKSA6IFtdLmNvbmNhdChuKSwgaV0sIHMgPSByWzBdLCBsID0gci5yZWR1Y2UoKGEsIGQpID0+IHtcbiAgICBjb25zdCBmID0gY3QoZSwgZCwgbyk7XG4gICAgcmV0dXJuIGEudG9wID0gTShmLnRvcCwgYS50b3ApLCBhLnJpZ2h0ID0gaXQoZi5yaWdodCwgYS5yaWdodCksIGEuYm90dG9tID0gaXQoZi5ib3R0b20sIGEuYm90dG9tKSwgYS5sZWZ0ID0gTShmLmxlZnQsIGEubGVmdCksIGE7XG4gIH0sIGN0KGUsIHMsIG8pKTtcbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogbC5yaWdodCAtIGwubGVmdCxcbiAgICBoZWlnaHQ6IGwuYm90dG9tIC0gbC50b3AsXG4gICAgeDogbC5sZWZ0LFxuICAgIHk6IGwudG9wXG4gIH07XG59XG5jb25zdCBRdCA9IHtcbiAgZ2V0Q2xpcHBpbmdSZWN0OiBKdCxcbiAgY29udmVydE9mZnNldFBhcmVudFJlbGF0aXZlUmVjdFRvVmlld3BvcnRSZWxhdGl2ZVJlY3Q6IFh0LFxuICBpc0VsZW1lbnQ6IGssXG4gIGdldERpbWVuc2lvbnM6IHJ0LFxuICBnZXRPZmZzZXRQYXJlbnQ6IEosXG4gIGdldERvY3VtZW50RWxlbWVudDogVCxcbiAgZ2V0RWxlbWVudFJlY3RzOiAodCkgPT4ge1xuICAgIGxldCB7XG4gICAgICByZWZlcmVuY2U6IGUsXG4gICAgICBmbG9hdGluZzogbixcbiAgICAgIHN0cmF0ZWd5OiBpXG4gICAgfSA9IHQ7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlZmVyZW5jZTogX3QoZSwgSihuKSwgaSksXG4gICAgICBmbG9hdGluZzoge1xuICAgICAgICAuLi5ydChuKSxcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMFxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIGdldENsaWVudFJlY3RzOiAodCkgPT4gQXJyYXkuZnJvbSh0LmdldENsaWVudFJlY3RzKCkpLFxuICBpc1JUTDogKHQpID0+IEModCkuZGlyZWN0aW9uID09PSBcInJ0bFwiXG59O1xuZnVuY3Rpb24gWnQodCwgZSwgbiwgaSkge1xuICBpID09PSB2b2lkIDAgJiYgKGkgPSB7fSk7XG4gIGNvbnN0IHtcbiAgICBhbmNlc3RvclNjcm9sbDogbyA9ICEwLFxuICAgIGFuY2VzdG9yUmVzaXplOiBjID0gITAsXG4gICAgZWxlbWVudFJlc2l6ZTogciA9ICEwLFxuICAgIGFuaW1hdGlvbkZyYW1lOiBzID0gITFcbiAgfSA9IGksIGwgPSBvICYmICFzLCBhID0gYyAmJiAhcywgZCA9IGwgfHwgYSA/IFsuLi5rKHQpID8gWSh0KSA6IFtdLCAuLi5ZKGUpXSA6IFtdO1xuICBkLmZvckVhY2goKGgpID0+IHtcbiAgICBsICYmIGguYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBuLCB7XG4gICAgICBwYXNzaXZlOiAhMFxuICAgIH0pLCBhICYmIGguYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBuKTtcbiAgfSk7XG4gIGxldCBmID0gbnVsbDtcbiAgaWYgKHIpIHtcbiAgICBsZXQgaCA9ICEwO1xuICAgIGYgPSBuZXcgUmVzaXplT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgaCB8fCBuKCksIGggPSAhMTtcbiAgICB9KSwgayh0KSAmJiAhcyAmJiBmLm9ic2VydmUodCksIGYub2JzZXJ2ZShlKTtcbiAgfVxuICBsZXQgdSwgcCA9IHMgPyBPKHQpIDogbnVsbDtcbiAgcyAmJiBtKCk7XG4gIGZ1bmN0aW9uIG0oKSB7XG4gICAgY29uc3QgaCA9IE8odCk7XG4gICAgcCAmJiAoaC54ICE9PSBwLnggfHwgaC55ICE9PSBwLnkgfHwgaC53aWR0aCAhPT0gcC53aWR0aCB8fCBoLmhlaWdodCAhPT0gcC5oZWlnaHQpICYmIG4oKSwgcCA9IGgsIHUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobSk7XG4gIH1cbiAgcmV0dXJuIG4oKSwgKCkgPT4ge1xuICAgIHZhciBoO1xuICAgIGQuZm9yRWFjaCgodykgPT4ge1xuICAgICAgbCAmJiB3LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgbiksIGEgJiYgdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG4pO1xuICAgIH0pLCAoaCA9IGYpID09IG51bGwgfHwgaC5kaXNjb25uZWN0KCksIGYgPSBudWxsLCBzICYmIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHUpO1xuICB9O1xufVxuY29uc3QgdGUgPSAodCwgZSwgbikgPT4gUHQodCwgZSwge1xuICBwbGF0Zm9ybTogUXQsXG4gIC4uLm5cbn0pO1xuYXN5bmMgZnVuY3Rpb24gZWUodCwgZSwgbiwgaSkge1xuICBpZiAoIWkpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBwcm92aWRlIGEgcG9zaXRpb25pbmcgb3B0aW9uXCIpO1xuICByZXR1cm4gYXdhaXQgKHR5cGVvZiBpID09IFwic3RyaW5nXCIgPyBuZSh0LCBlLCBuLCBpKSA6IG9lKGUsIGkpKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIG5lKHQsIGUsIG4sIGkpIHtcbiAgaWYgKCFuKVxuICAgIHRocm93IG5ldyBFcnJvcihcIlJlZmVyZW5jZSBlbGVtZW50IGlzIHJlcXVpcmVkIGZvciByZWxhdGl2ZSBwb3NpdGlvbmluZ1wiKTtcbiAgbGV0IG87XG4gIHJldHVybiBpID09PSBcImF1dG9cIiA/IG8gPSB7XG4gICAgbWlkZGxld2FyZTogW1xuICAgICAgVnQoKSxcbiAgICAgIG90KCksXG4gICAgICBudCh7IG1haW5BeGlzOiA1LCBjcm9zc0F4aXM6IDEyIH0pXG4gICAgXVxuICB9IDogbyA9IHtcbiAgICBwbGFjZW1lbnQ6IGksXG4gICAgbWlkZGxld2FyZTogW1xuICAgICAgRnQoKSxcbiAgICAgIG90KCksXG4gICAgICBudCg1KVxuICAgIF1cbiAgfSwgWnQobiwgZSwgYXN5bmMgKCkgPT4ge1xuICAgIGlmICgoIW4uaXNDb25uZWN0ZWQgfHwgIW4ub2Zmc2V0UGFyZW50KSAmJiBpZSh0KSlcbiAgICAgIHJldHVybjtcbiAgICBjb25zdCB7IHg6IGMsIHk6IHIgfSA9IGF3YWl0IHRlKG4sIGUsIG8pO1xuICAgIE9iamVjdC5hc3NpZ24oZS5zdHlsZSwge1xuICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIixcbiAgICAgIGxlZnQ6IGAke2N9cHhgLFxuICAgICAgdG9wOiBgJHtyfXB4YFxuICAgIH0pO1xuICB9KTtcbn1cbmZ1bmN0aW9uIG9lKHQsIGUpIHtcbiAgcmV0dXJuIHQuc3R5bGUucG9zaXRpb24gPSBcImZpeGVkXCIsIE9iamVjdC5lbnRyaWVzKGUpLmZvckVhY2goKFtuLCBpXSkgPT4ge1xuICAgIHQuc3R5bGVbbl0gPSBpO1xuICB9KSwgKCkgPT4ge1xuICB9O1xufVxuZnVuY3Rpb24gaWUodCkge1xuICBzd2l0Y2ggKHQub3B0aW9ucy5vblBvc2l0aW9uTG9zdCkge1xuICAgIGNhc2UgXCJjbG9zZVwiOlxuICAgICAgcmV0dXJuIHQuY2xvc2UoKSwgITA7XG4gICAgY2FzZSBcImRlc3Ryb3lcIjpcbiAgICAgIHJldHVybiB0LmRlc3Ryb3koKSwgITA7XG4gICAgY2FzZSBcImhvbGRcIjpcbiAgICAgIHJldHVybiAhMDtcbiAgfVxufVxuY29uc3Qgc2UgPSB7XG4gIGhpZGVPbkNsaWNrT3V0c2lkZTogITAsXG4gIGhpZGVPbkVtb2ppU2VsZWN0OiAhMCxcbiAgaGlkZU9uRXNjYXBlOiAhMCxcbiAgcG9zaXRpb246IFwiYXV0b1wiLFxuICBzaG93Q2xvc2VCdXR0b246ICEwLFxuICBvblBvc2l0aW9uTG9zdDogXCJub25lXCJcbn07XG5mdW5jdGlvbiByZSh0ID0ge30pIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5zZSxcbiAgICByb290RWxlbWVudDogZG9jdW1lbnQuYm9keSxcbiAgICAuLi50XG4gIH07XG59XG5jb25zdCBjZSA9ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDMyMCA1MTJcIj48IS0tISBGb250IEF3ZXNvbWUgUHJvIDYuMS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlIChDb21tZXJjaWFsIExpY2Vuc2UpIENvcHlyaWdodCAyMDIyIEZvbnRpY29ucywgSW5jLiAtLT48cGF0aCBkPVwiTTMxMC42IDM2MS40YzEyLjUgMTIuNSAxMi41IDMyLjc1IDAgNDUuMjVDMzA0LjQgNDEyLjkgMjk2LjIgNDE2IDI4OCA0MTZzLTE2LjM4LTMuMTI1LTIyLjYyLTkuMzc1TDE2MCAzMDEuM0w1NC42MyA0MDYuNkM0OC4zOCA0MTIuOSA0MC4xOSA0MTYgMzIgNDE2UzE1LjYzIDQxMi45IDkuMzc1IDQwNi42Yy0xMi41LTEyLjUtMTIuNS0zMi43NSAwLTQ1LjI1bDEwNS40LTEwNS40TDkuMzc1IDE1MC42Yy0xMi41LTEyLjUtMTIuNS0zMi43NSAwLTQ1LjI1czMyLjc1LTEyLjUgNDUuMjUgMEwxNjAgMjEwLjhsMTA1LjQtMTA1LjRjMTIuNS0xMi41IDMyLjc1LTEyLjUgNDUuMjUgMHMxMi41IDMyLjc1IDAgNDUuMjVsLTEwNS40IDEwNS40TDMxMC42IDM2MS40elwiLz48L3N2Zz4nLCBsdCA9IHtcbiAgcG9wdXBDb250YWluZXI6IFwicG9wdXBDb250YWluZXJcIixcbiAgY2xvc2VCdXR0b246IFwiY2xvc2VCdXR0b25cIlxufTtcbmNsYXNzIGxlIHtcbiAgY29uc3RydWN0b3IoZSwgbikge1xuICAgIHRoaXMuaXNPcGVuID0gITEsIHRoaXMuZXh0ZXJuYWxFdmVudHMgPSBuZXcgeHQoKSwgdGhpcy5vcHRpb25zID0geyAuLi5yZShuKSwgLi4udnQoZSkgfSwgdGhpcy5wb3B1cEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSwgdGhpcy5wb3B1cEVsLmNsYXNzTGlzdC5hZGQobHQucG9wdXBDb250YWluZXIpLCB0aGlzLnBvcHVwRWwuY2xhc3NMaXN0LmFkZCh0aGlzLm9wdGlvbnMudGhlbWUpLCBuLmNsYXNzTmFtZSAmJiB0aGlzLnBvcHVwRWwuY2xhc3NMaXN0LmFkZChuLmNsYXNzTmFtZSksIHRoaXMub3B0aW9ucy5zaG93Q2xvc2VCdXR0b24gJiYgKHRoaXMuY2xvc2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpLCB0aGlzLmNsb3NlQnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiLCB0aGlzLmNsb3NlQnV0dG9uLmNsYXNzTGlzdC5hZGQobHQuY2xvc2VCdXR0b24pLCB0aGlzLmNsb3NlQnV0dG9uLmlubmVySFRNTCA9IGNlLCB0aGlzLmNsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSksIHRoaXMucG9wdXBFbC5hcHBlbmRDaGlsZCh0aGlzLmNsb3NlQnV0dG9uKSk7XG4gICAgY29uc3QgaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdGhpcy5wb3B1cEVsLmFwcGVuZENoaWxkKGkpLCB0aGlzLnBpY2tlciA9IGJ0KHsgLi4udGhpcy5vcHRpb25zLCByb290RWxlbWVudDogaSB9KSwgdGhpcy5mb2N1c1RyYXAgPSBuZXcgRXQoKSwgdGhpcy5waWNrZXIuYWRkRXZlbnRMaXN0ZW5lcihcImRhdGE6cmVhZHlcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5mb2N1c1RyYXAuYWN0aXZhdGUodGhpcy5waWNrZXIuZWwpLCB0aGlzLnBpY2tlci5zZXRJbml0aWFsRm9jdXMoKTtcbiAgICB9KSwgdGhpcy5vcHRpb25zLmhpZGVPbkVtb2ppU2VsZWN0ICYmIHRoaXMucGlja2VyLmFkZEV2ZW50TGlzdGVuZXIoXCJlbW9qaTpzZWxlY3RcIiwgKCkgPT4ge1xuICAgICAgdmFyIG87XG4gICAgICB0aGlzLmNsb3NlKCksIChvID0gdGhpcy50cmlnZ2VyRWxlbWVudCkgPT0gbnVsbCB8fCBvLmZvY3VzKCk7XG4gICAgfSksIHRoaXMub3B0aW9ucy5oaWRlT25DbGlja091dHNpZGUgJiYgKHRoaXMub25Eb2N1bWVudENsaWNrID0gdGhpcy5vbkRvY3VtZW50Q2xpY2suYmluZCh0aGlzKSwgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMub25Eb2N1bWVudENsaWNrKSksIHRoaXMub3B0aW9ucy5oaWRlT25Fc2NhcGUgJiYgKHRoaXMuaGFuZGxlS2V5ZG93biA9IHRoaXMuaGFuZGxlS2V5ZG93bi5iaW5kKHRoaXMpLCB0aGlzLnBvcHVwRWwuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5oYW5kbGVLZXlkb3duKSksIHRoaXMucmVmZXJlbmNlRWxlbWVudCA9IHRoaXMub3B0aW9ucy5yZWZlcmVuY2VFbGVtZW50LCB0aGlzLnRyaWdnZXJFbGVtZW50ID0gdGhpcy5vcHRpb25zLnRyaWdnZXJFbGVtZW50O1xuICB9XG4gIGFkZEV2ZW50TGlzdGVuZXIoZSwgbikge1xuICAgIHRoaXMuZXh0ZXJuYWxFdmVudHMub24oZSwgbiksIHRoaXMucGlja2VyLmFkZEV2ZW50TGlzdGVuZXIoZSwgbik7XG4gIH1cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihlLCBuKSB7XG4gICAgdGhpcy5leHRlcm5hbEV2ZW50cy5vZmYoZSwgbiksIHRoaXMucGlja2VyLnJlbW92ZUV2ZW50TGlzdGVuZXIoZSwgbik7XG4gIH1cbiAgaGFuZGxlS2V5ZG93bihlKSB7XG4gICAgdmFyIG47XG4gICAgZS5rZXkgPT09IFwiRXNjYXBlXCIgJiYgKHRoaXMuY2xvc2UoKSwgKG4gPSB0aGlzLnRyaWdnZXJFbGVtZW50KSA9PSBudWxsIHx8IG4uZm9jdXMoKSk7XG4gIH1cbiAgYXN5bmMgZGVzdHJveSgpIHtcbiAgICB0aGlzLmlzT3BlbiAmJiBhd2FpdCB0aGlzLmNsb3NlKCksIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLm9uRG9jdW1lbnRDbGljayksIHRoaXMucGlja2VyLmRlc3Ryb3koKSwgdGhpcy5leHRlcm5hbEV2ZW50cy5yZW1vdmVBbGwoKTtcbiAgfVxuICB0b2dnbGUoZSkge1xuICAgIHJldHVybiB0aGlzLmlzT3BlbiA/IHRoaXMuY2xvc2UoKSA6IHRoaXMub3BlbihlKTtcbiAgfVxuICBhc3luYyBvcGVuKHsgdHJpZ2dlckVsZW1lbnQ6IGUsIHJlZmVyZW5jZUVsZW1lbnQ6IG4gfSA9IHt9KSB7XG4gICAgdGhpcy5pc09wZW4gfHwgKGUgJiYgKHRoaXMudHJpZ2dlckVsZW1lbnQgPSBlKSwgbiAmJiAodGhpcy5yZWZlcmVuY2VFbGVtZW50ID0gbiksIGF3YWl0IHRoaXMuaW5pdGlhdGVPcGVuU3RhdGVDaGFuZ2UoITApLCB0aGlzLnBvcHVwRWwuc3R5bGUub3BhY2l0eSA9IFwiMFwiLCB0aGlzLm9wdGlvbnMucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5wb3B1cEVsKSwgYXdhaXQgdGhpcy5zZXRQb3NpdGlvbigpLCB0aGlzLnBpY2tlci5yZXNldCghMSksIGF3YWl0IHRoaXMuYW5pbWF0ZVBvcHVwKCEwKSwgYXdhaXQgdGhpcy5hbmltYXRlQ2xvc2VCdXR0b24oITApLCB0aGlzLnBpY2tlci5zZXRJbml0aWFsRm9jdXMoKSwgdGhpcy5leHRlcm5hbEV2ZW50cy5lbWl0KFwicGlja2VyOm9wZW5cIikpO1xuICB9XG4gIGFzeW5jIGNsb3NlKCkge1xuICAgIHZhciBlO1xuICAgICF0aGlzLmlzT3BlbiB8fCAoYXdhaXQgdGhpcy5pbml0aWF0ZU9wZW5TdGF0ZUNoYW5nZSghMSksIGF3YWl0IHRoaXMuYW5pbWF0ZUNsb3NlQnV0dG9uKCExKSwgYXdhaXQgdGhpcy5hbmltYXRlUG9wdXAoITEpLCB0aGlzLnBvcHVwRWwucmVtb3ZlKCksIHRoaXMucGlja2VyLnJlc2V0KCksIChlID0gdGhpcy5wb3NpdGlvbkNsZWFudXApID09IG51bGwgfHwgZS5jYWxsKHRoaXMpLCB0aGlzLmZvY3VzVHJhcC5kZWFjdGl2YXRlKCksIHRoaXMuZXh0ZXJuYWxFdmVudHMuZW1pdChcInBpY2tlcjpjbG9zZVwiKSk7XG4gIH1cbiAgZ2V0UnVubmluZ0FuaW1hdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMucGlja2VyLmVsLmdldEFuaW1hdGlvbnMoKS5maWx0ZXIoKGUpID0+IGUucGxheVN0YXRlID09PSBcInJ1bm5pbmdcIik7XG4gIH1cbiAgYXN5bmMgc2V0UG9zaXRpb24oKSB7XG4gICAgdmFyIGU7XG4gICAgKGUgPSB0aGlzLnBvc2l0aW9uQ2xlYW51cCkgPT0gbnVsbCB8fCBlLmNhbGwodGhpcyksIHRoaXMucG9zaXRpb25DbGVhbnVwID0gYXdhaXQgZWUoXG4gICAgICB0aGlzLFxuICAgICAgdGhpcy5wb3B1cEVsLFxuICAgICAgdGhpcy5yZWZlcmVuY2VFbGVtZW50LFxuICAgICAgdGhpcy5vcHRpb25zLnBvc2l0aW9uXG4gICAgKTtcbiAgfVxuICBhd2FpdFBlbmRpbmdBbmltYXRpb25zKCkge1xuICAgIHJldHVybiBQcm9taXNlLmFsbCh0aGlzLmdldFJ1bm5pbmdBbmltYXRpb25zKCkubWFwKChlKSA9PiBlLmZpbmlzaGVkKSk7XG4gIH1cbiAgb25Eb2N1bWVudENsaWNrKGUpIHtcbiAgICB2YXIgbztcbiAgICBjb25zdCBuID0gZS50YXJnZXQsIGkgPSAobyA9IHRoaXMudHJpZ2dlckVsZW1lbnQpID09IG51bGwgPyB2b2lkIDAgOiBvLmNvbnRhaW5zKG4pO1xuICAgIHRoaXMuaXNPcGVuICYmICF0aGlzLnBpY2tlci5pc1BpY2tlckNsaWNrKGUpICYmICFpICYmIHRoaXMuY2xvc2UoKTtcbiAgfVxuICBhbmltYXRlUG9wdXAoZSkge1xuICAgIHJldHVybiBaKFxuICAgICAgdGhpcy5wb3B1cEVsLFxuICAgICAge1xuICAgICAgICBvcGFjaXR5OiBbMCwgMV0sXG4gICAgICAgIHRyYW5zZm9ybTogW1wic2NhbGUoMC45KVwiLCBcInNjYWxlKDEpXCJdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBkdXJhdGlvbjogMTUwLFxuICAgICAgICBpZDogZSA/IFwic2hvdy1waWNrZXJcIiA6IFwiaGlkZS1waWNrZXJcIixcbiAgICAgICAgZWFzaW5nOiBcImVhc2UtaW4tb3V0XCIsXG4gICAgICAgIGRpcmVjdGlvbjogZSA/IFwibm9ybWFsXCIgOiBcInJldmVyc2VcIixcbiAgICAgICAgZmlsbDogXCJib3RoXCJcbiAgICAgIH0sXG4gICAgICB0aGlzLm9wdGlvbnNcbiAgICApO1xuICB9XG4gIGFuaW1hdGVDbG9zZUJ1dHRvbihlKSB7XG4gICAgaWYgKHRoaXMuY2xvc2VCdXR0b24pXG4gICAgICByZXR1cm4gWihcbiAgICAgICAgdGhpcy5jbG9zZUJ1dHRvbixcbiAgICAgICAge1xuICAgICAgICAgIG9wYWNpdHk6IFswLCAxXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZHVyYXRpb246IDI1LFxuICAgICAgICAgIGlkOiBlID8gXCJzaG93LWNsb3NlXCIgOiBcImhpZGUtY2xvc2VcIixcbiAgICAgICAgICBlYXNpbmc6IFwiZWFzZS1pbi1vdXRcIixcbiAgICAgICAgICBkaXJlY3Rpb246IGUgPyBcIm5vcm1hbFwiIDogXCJyZXZlcnNlXCIsXG4gICAgICAgICAgZmlsbDogXCJib3RoXCJcbiAgICAgICAgfSxcbiAgICAgICAgdGhpcy5vcHRpb25zXG4gICAgICApO1xuICB9XG4gIGFzeW5jIGluaXRpYXRlT3BlblN0YXRlQ2hhbmdlKGUpIHtcbiAgICB0aGlzLmlzT3BlbiA9IGUsIGF3YWl0IHRoaXMuYXdhaXRQZW5kaW5nQW5pbWF0aW9ucygpO1xuICB9XG59XG5jb25zdCBhZSA9IGAucG9wdXBDb250YWluZXJ7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtwb3NpdGlvbjphYnNvbHV0ZX0ucG9wdXBDb250YWluZXIgLmNsb3NlQnV0dG9ue3Bvc2l0aW9uOmFic29sdXRlO29wYWNpdHk6MDtiYWNrZ3JvdW5kOnRyYW5zcGFyZW50O2JvcmRlcjpub25lO3otaW5kZXg6MTtyaWdodDowO3RvcDowO2N1cnNvcjpwb2ludGVyO3BhZGRpbmc6NHB4O2FsaWduLXNlbGY6ZmxleC1lbmQ7dHJhbnNmb3JtOnRyYW5zbGF0ZSg1MCUsLTUwJSk7YmFja2dyb3VuZDojOTk5OTk5O3dpZHRoOjEuNXJlbTtoZWlnaHQ6MS41cmVtO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtib3JkZXItcmFkaXVzOjUwJX0ucG9wdXBDb250YWluZXIgLmNsb3NlQnV0dG9uOmhvdmVye2JhY2tncm91bmQ6dmFyKC0tYWNjZW50LWNvbG9yKX0ucG9wdXBDb250YWluZXIgLmNsb3NlQnV0dG9uIHN2Z3tmaWxsOiNmZmY7d2lkdGg6MS4yNXJlbTtoZWlnaHQ6MS4yNXJlbX1cbmAsIGZlID0gQ3QoKTtcbmZ1bmN0aW9uIGRlKHQsIGUpIHtcbiAgcmV0dXJuIGZlKGFlKSwgbmV3IGxlKHtcbiAgICBhdXRvRm9jdXM6IFwiYXV0b1wiLFxuICAgIC4uLnRcbiAgfSwgZSk7XG59XG5leHBvcnQge1xuICBsZSBhcyBQb3B1cFBpY2tlckNvbnRyb2xsZXIsXG4gIGRlIGFzIGNyZWF0ZVBvcHVwXG59O1xuIiwidmFyIE8gPSAoaSwgZSwgdCkgPT4ge1xuICBpZiAoIWUuaGFzKGkpKVxuICAgIHRocm93IFR5cGVFcnJvcihcIkNhbm5vdCBcIiArIHQpO1xufTtcbnZhciB5ID0gKGksIGUsIHQpID0+IChPKGksIGUsIFwicmVhZCBmcm9tIHByaXZhdGUgZmllbGRcIiksIHQgPyB0LmNhbGwoaSkgOiBlLmdldChpKSksIGYgPSAoaSwgZSwgdCkgPT4ge1xuICBpZiAoZS5oYXMoaSkpXG4gICAgdGhyb3cgVHlwZUVycm9yKFwiQ2Fubm90IGFkZCB0aGUgc2FtZSBwcml2YXRlIG1lbWJlciBtb3JlIHRoYW4gb25jZVwiKTtcbiAgZSBpbnN0YW5jZW9mIFdlYWtTZXQgPyBlLmFkZChpKSA6IGUuc2V0KGksIHQpO1xufSwgQSA9IChpLCBlLCB0LCBzKSA9PiAoTyhpLCBlLCBcIndyaXRlIHRvIHByaXZhdGUgZmllbGRcIiksIHMgPyBzLmNhbGwoaSwgdCkgOiBlLnNldChpLCB0KSwgdCk7XG52YXIgcCA9IChpLCBlLCB0KSA9PiAoTyhpLCBlLCBcImFjY2VzcyBwcml2YXRlIG1ldGhvZFwiKSwgdCk7XG5jb25zdCAkZSA9IFwiMTQuMFwiO1xuZnVuY3Rpb24gTGUoaSwgZSwgdCkge1xuICBsZXQgcyA9IGBodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2Vtb2ppYmFzZS1kYXRhQCR7ZX0vJHtpfWA7XG4gIHJldHVybiB0eXBlb2YgdCA9PSBcImZ1bmN0aW9uXCIgPyBzID0gdChpLCBlKSA6IHR5cGVvZiB0ID09IFwic3RyaW5nXCIgJiYgKHMgPSBgJHt0fS8ke2l9YCksIHM7XG59XG5hc3luYyBmdW5jdGlvbiBpZShpLCBlID0ge30pIHtcbiAgY29uc3Qge1xuICAgIGxvY2FsOiB0ID0gITEsXG4gICAgdmVyc2lvbjogcyA9IFwibGF0ZXN0XCIsXG4gICAgY2RuVXJsOiBvLFxuICAgIC4uLnJcbiAgfSA9IGUsIGEgPSBMZShpLCBzLCBvKSwgbiA9IHQgPyBsb2NhbFN0b3JhZ2UgOiBzZXNzaW9uU3RvcmFnZSwgbCA9IGBlbW9qaWJhc2UvJHtzfS8ke2l9YCwgbSA9IG4uZ2V0SXRlbShsKTtcbiAgaWYgKG0pXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShKU09OLnBhcnNlKG0pKTtcbiAgY29uc3QgZCA9IGF3YWl0IGZldGNoKGEsIHtcbiAgICBjcmVkZW50aWFsczogXCJvbWl0XCIsXG4gICAgbW9kZTogXCJjb3JzXCIsXG4gICAgcmVkaXJlY3Q6IFwiZXJyb3JcIixcbiAgICAuLi5yXG4gIH0pO1xuICBpZiAoIWQub2spXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGxvYWQgRW1vamliYXNlIGRhdGFzZXQuXCIpO1xuICBjb25zdCBoID0gYXdhaXQgZC5qc29uKCk7XG4gIHRyeSB7XG4gICAgbi5zZXRJdGVtKGwsIEpTT04uc3RyaW5naWZ5KGgpKTtcbiAgfSBjYXRjaCB7XG4gIH1cbiAgcmV0dXJuIGg7XG59XG5jb25zdCBGZSA9IHtcbiAgZGlzY29yZDogXCJqb3lwaXhlbHNcIixcbiAgc2xhY2s6IFwiaWFtY2FsXCJcbn07XG5hc3luYyBmdW5jdGlvbiBsZShpLCBlLCB0KSB7XG4gIHZhciBzO1xuICByZXR1cm4gaWUoYCR7aX0vc2hvcnRjb2Rlcy8keyhzID0gRmVbZV0pICE9PSBudWxsICYmIHMgIT09IHZvaWQgMCA/IHMgOiBlfS5qc29uYCwgdCk7XG59XG5mdW5jdGlvbiBrKGksIGUpIHtcbiAgaWYgKGUubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiBpO1xuICBjb25zdCB0ID0gbmV3IFNldChpLnNob3J0Y29kZXMpO1xuICByZXR1cm4gZS5mb3JFYWNoKChzKSA9PiB7XG4gICAgY29uc3QgbyA9IHNbaS5oZXhjb2RlXTtcbiAgICBBcnJheS5pc0FycmF5KG8pID8gby5mb3JFYWNoKChyKSA9PiB0LmFkZChyKSkgOiBvICYmIHQuYWRkKG8pO1xuICB9KSwgaS5zaG9ydGNvZGVzID0gWy4uLnRdLCBpLnNraW5zICYmIGkuc2tpbnMuZm9yRWFjaCgocykgPT4ge1xuICAgIGsocywgZSk7XG4gIH0pLCBpO1xufVxuZnVuY3Rpb24gQWUoaSwgZSA9IFtdKSB7XG4gIGNvbnN0IHQgPSBbXTtcbiAgcmV0dXJuIGkuZm9yRWFjaCgocykgPT4ge1xuICAgIGlmIChzLnNraW5zKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHNraW5zOiBvLFxuICAgICAgICAuLi5yXG4gICAgICB9ID0gcztcbiAgICAgIHQucHVzaChrKHIsIGUpKSwgby5mb3JFYWNoKChhKSA9PiB7XG4gICAgICAgIGNvbnN0IG4gPSB7XG4gICAgICAgICAgLi4uYVxuICAgICAgICB9O1xuICAgICAgICByLnRhZ3MgJiYgKG4udGFncyA9IFsuLi5yLnRhZ3NdKSwgdC5wdXNoKGsobiwgZSkpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlXG4gICAgICB0LnB1c2goayhzLCBlKSk7XG4gIH0pLCB0O1xufVxuZnVuY3Rpb24gSWUoaSwgZSkge1xuICByZXR1cm4gZS5sZW5ndGggPT09IDAgfHwgaS5mb3JFYWNoKCh0KSA9PiB7XG4gICAgayh0LCBlKTtcbiAgfSksIGk7XG59XG5hc3luYyBmdW5jdGlvbiB2ZShpLCBlID0ge30pIHtcbiAgY29uc3Qge1xuICAgIGNvbXBhY3Q6IHQgPSAhMSxcbiAgICBmbGF0OiBzID0gITEsXG4gICAgc2hvcnRjb2RlczogbyA9IFtdLFxuICAgIC4uLnJcbiAgfSA9IGUsIGEgPSBhd2FpdCBpZShgJHtpfS8ke3QgPyBcImNvbXBhY3RcIiA6IFwiZGF0YVwifS5qc29uYCwgcik7XG4gIGxldCBuID0gW107XG4gIHJldHVybiBvLmxlbmd0aCA+IDAgJiYgKG4gPSBhd2FpdCBQcm9taXNlLmFsbChvLm1hcCgobCkgPT4ge1xuICAgIGxldCBtO1xuICAgIGlmIChsLmluY2x1ZGVzKFwiL1wiKSkge1xuICAgICAgY29uc3QgW2QsIGhdID0gbC5zcGxpdChcIi9cIik7XG4gICAgICBtID0gbGUoZCwgaCwgcik7XG4gICAgfSBlbHNlXG4gICAgICBtID0gbGUoaSwgbCwgcik7XG4gICAgcmV0dXJuIG0uY2F0Y2goKCkgPT4gKHt9KSk7XG4gIH0pKSksIHMgPyBBZShhLCBuKSA6IEllKGEsIG4pO1xufVxuYXN5bmMgZnVuY3Rpb24gd2UoaSwgZSkge1xuICByZXR1cm4gaWUoYCR7aX0vbWVzc2FnZXMuanNvbmAsIGUpO1xufVxuZnVuY3Rpb24gVShpLCBlKSB7XG4gIGNvbnN0IHMgPSBpLnRhcmdldC5jbG9zZXN0KFwiW2RhdGEtZW1vamldXCIpO1xuICBpZiAocykge1xuICAgIGNvbnN0IG8gPSBlLmZpbmQoKHIpID0+IHIuZW1vamkgPT09IHMuZGF0YXNldC5lbW9qaSk7XG4gICAgaWYgKG8pXG4gICAgICByZXR1cm4gbztcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cbmZ1bmN0aW9uIGJlKGkpIHtcbiAgdmFyIHQ7XG4gIGNvbnN0IGUgPSAodCA9IHdpbmRvdy5tYXRjaE1lZGlhKSA9PSBudWxsID8gdm9pZCAwIDogdC5jYWxsKHdpbmRvdywgXCIocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjogcmVkdWNlKVwiKTtcbiAgcmV0dXJuIGkuYW5pbWF0ZSAmJiAhKGUgIT0gbnVsbCAmJiBlLm1hdGNoZXMpO1xufVxuZnVuY3Rpb24gaGUoaSwgZSkge1xuICByZXR1cm4gaS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGUudG9Mb3dlckNhc2UoKSk7XG59XG5mdW5jdGlvbiBUZShpLCBlKSB7XG4gIGxldCB0ID0gbnVsbDtcbiAgcmV0dXJuICgpID0+IHtcbiAgICB0IHx8ICh0ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaSgpLCB0ID0gbnVsbDtcbiAgICB9LCBlKSk7XG4gIH07XG59XG5mdW5jdGlvbiBSZShpLCBlKSB7XG4gIGxldCB0ID0gbnVsbDtcbiAgcmV0dXJuICguLi5zKSA9PiB7XG4gICAgdCAmJiB3aW5kb3cuY2xlYXJUaW1lb3V0KHQpLCB0ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaSguLi5zKSwgdCA9IG51bGw7XG4gICAgfSwgZSk7XG4gIH07XG59XG5mdW5jdGlvbiBJKGksIGUsIHQsIHMpIHtcbiAgaWYgKGJlKHMpICYmIGkuYW5pbWF0ZSlcbiAgICByZXR1cm4gaS5hbmltYXRlKGUsIHQpLmZpbmlzaGVkO1xuICBjb25zdCBvID0gdC5kaXJlY3Rpb24gPT09IFwibm9ybWFsXCIgPyAxIDogMCwgciA9IE9iamVjdC5lbnRyaWVzKGUpLnJlZHVjZSgoYSwgW24sIGxdKSA9PiAoe1xuICAgIC4uLmEsXG4gICAgW25dOiBsW29dXG4gIH0pLCB7fSk7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKGkuc3R5bGUsIHIpLCBQcm9taXNlLnJlc29sdmUoKTtcbn1cbmZ1bmN0aW9uIEooaSkge1xuICB2YXIgdDtcbiAgY29uc3QgZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZW1wbGF0ZVwiKTtcbiAgcmV0dXJuIGUuaW5uZXJIVE1MID0gaSwgKHQgPSBlLmNvbnRlbnQpID09IG51bGwgPyB2b2lkIDAgOiB0LmZpcnN0RWxlbWVudENoaWxkO1xufVxuYXN5bmMgZnVuY3Rpb24gVmUoaSkge1xuICBjb25zdCBlID0gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKGkpLCB0ID0gYXdhaXQgY3J5cHRvLnN1YnRsZS5kaWdlc3QoXCJTSEEtMjU2XCIsIGUpO1xuICByZXR1cm4gQXJyYXkuZnJvbShuZXcgVWludDhBcnJheSh0KSkubWFwKChvKSA9PiBvLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCBcIjBcIikpLmpvaW4oXCJcIik7XG59XG5mdW5jdGlvbiBnKC4uLmkpIHtcbiAgcmV0dXJuIGkucmVkdWNlKChlLCB0KSA9PiAoe1xuICAgIC4uLmUsXG4gICAgW3RdOiBvZSh0KVxuICB9KSwge30pO1xufVxuZnVuY3Rpb24gb2UoaSkge1xuICByZXR1cm4gYCR7aX1gO1xufVxuZnVuY3Rpb24gTWUoaSwgZSkge1xuICBjb25zdCB0ID0gYGh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vZW1vamliYXNlLWRhdGFAJHtpfS8ke2V9YDtcbiAgcmV0dXJuIHtcbiAgICBlbW9qaXNVcmw6IGAke3R9L2RhdGEuanNvbmAsXG4gICAgbWVzc2FnZXNVcmw6IGAke3R9L21lc3NhZ2VzLmpzb25gXG4gIH07XG59XG5hc3luYyBmdW5jdGlvbiBkZShpKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIChhd2FpdCBmZXRjaChpLCB7IG1ldGhvZDogXCJIRUFEXCIgfSkpLmhlYWRlcnMuZ2V0KFwiZXRhZ1wiKTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbmZ1bmN0aW9uIEJlKGkpIHtcbiAgY29uc3QgeyBlbW9qaXNVcmw6IGUsIG1lc3NhZ2VzVXJsOiB0IH0gPSBNZShcImxhdGVzdFwiLCBpKTtcbiAgdHJ5IHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgZGUoZSksXG4gICAgICBkZSh0KVxuICAgIF0pO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoW251bGwsIG51bGxdKTtcbiAgfVxufVxuYXN5bmMgZnVuY3Rpb24gRGUoaSwgZSwgdCkge1xuICBsZXQgcztcbiAgdHJ5IHtcbiAgICBzID0gYXdhaXQgaS5nZXRFdGFncygpO1xuICB9IGNhdGNoIHtcbiAgICBzID0ge307XG4gIH1cbiAgY29uc3QgeyBzdG9yZWRFbW9qaXNFdGFnOiBvLCBzdG9yZWRNZXNzYWdlc0V0YWc6IHIgfSA9IHM7XG4gIGlmICh0ICE9PSByIHx8IGUgIT09IG8pIHtcbiAgICBjb25zdCBbYSwgbl0gPSBhd2FpdCBQcm9taXNlLmFsbChbd2UoaS5sb2NhbGUpLCB2ZShpLmxvY2FsZSldKTtcbiAgICBhd2FpdCBpLnBvcHVsYXRlKHtcbiAgICAgIGdyb3VwczogYS5ncm91cHMsXG4gICAgICBlbW9qaXM6IG4sXG4gICAgICBlbW9qaXNFdGFnOiBlLFxuICAgICAgbWVzc2FnZXNFdGFnOiB0XG4gICAgfSk7XG4gIH1cbn1cbmFzeW5jIGZ1bmN0aW9uIEhlKGksIGUpIHtcbiAgY29uc3QgdCA9IGF3YWl0IGkuZ2V0SGFzaCgpO1xuICByZXR1cm4gZSAhPT0gdDtcbn1cbmFzeW5jIGZ1bmN0aW9uIENlKGksIGUsIHQpIHtcbiAgY29uc3QgcyA9IHQgfHwgZShpKTtcbiAgcmV0dXJuIGF3YWl0IHMub3BlbigpLCBzO1xufVxuYXN5bmMgZnVuY3Rpb24gTmUoaSwgZSwgdCkge1xuICBjb25zdCBzID0gYXdhaXQgQ2UoaSwgZSwgdCksIFtvLCByXSA9IGF3YWl0IEJlKGkpO1xuICBpZiAoYXdhaXQgcy5pc1BvcHVsYXRlZCgpKVxuICAgIG8gJiYgciAmJiBhd2FpdCBEZShzLCBvLCByKTtcbiAgZWxzZSB7XG4gICAgY29uc3QgW2EsIG5dID0gYXdhaXQgUHJvbWlzZS5hbGwoW3dlKGkpLCB2ZShpKV0pO1xuICAgIGF3YWl0IHMucG9wdWxhdGUoeyBncm91cHM6IGEuZ3JvdXBzLCBlbW9qaXM6IG4sIGVtb2ppc0V0YWc6IG8sIG1lc3NhZ2VzRXRhZzogciB9KTtcbiAgfVxuICByZXR1cm4gcztcbn1cbmFzeW5jIGZ1bmN0aW9uIE9lKGksIGUsIHQsIHMsIG8pIHtcbiAgY29uc3QgciA9IGF3YWl0IENlKGksIGUsIG8pLCBhID0gYXdhaXQgVmUocyk7XG4gIHJldHVybiAoIWF3YWl0IHIuaXNQb3B1bGF0ZWQoKSB8fCBhd2FpdCBIZShyLCBhKSkgJiYgYXdhaXQgci5wb3B1bGF0ZSh7IGdyb3VwczogdC5ncm91cHMsIGVtb2ppczogcywgaGFzaDogYSB9KSwgcjtcbn1cbmFzeW5jIGZ1bmN0aW9uIHJlKGksIGUsIHQsIHMsIG8pIHtcbiAgcmV0dXJuIHQgJiYgcyA/IE9lKGksIGUsIHQsIHMsIG8pIDogTmUoaSwgZSwgbyk7XG59XG5mdW5jdGlvbiBQcyhpLCBlKSB7XG4gIGkuZGVsZXRlRGF0YWJhc2UoZSk7XG59XG5jbGFzcyBVZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaGFuZGxlS2V5RG93biA9IHRoaXMuaGFuZGxlS2V5RG93bi5iaW5kKHRoaXMpO1xuICB9XG4gIGFjdGl2YXRlKGUpIHtcbiAgICB0aGlzLnJvb3RFbGVtZW50ID0gZSwgdGhpcy5yb290RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLmhhbmRsZUtleURvd24pO1xuICB9XG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdmFyIGU7XG4gICAgKGUgPSB0aGlzLnJvb3RFbGVtZW50KSA9PSBudWxsIHx8IGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5oYW5kbGVLZXlEb3duKTtcbiAgfVxuICBnZXQgZm9jdXNhYmxlRWxlbWVudHMoKSB7XG4gICAgcmV0dXJuIHRoaXMucm9vdEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQsIFt0YWJpbmRleD1cIjBcIl0nKTtcbiAgfVxuICBnZXQgbGFzdEZvY3VzYWJsZUVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9jdXNhYmxlRWxlbWVudHNbdGhpcy5mb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxXTtcbiAgfVxuICBnZXQgZmlyc3RGb2N1c2FibGVFbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLmZvY3VzYWJsZUVsZW1lbnRzWzBdO1xuICB9XG4gIGNoZWNrRm9jdXMoZSwgdCwgcykge1xuICAgIGUudGFyZ2V0ID09PSB0ICYmIChzLmZvY3VzKCksIGUucHJldmVudERlZmF1bHQoKSk7XG4gIH1cbiAgaGFuZGxlS2V5RG93bihlKSB7XG4gICAgZS5rZXkgPT09IFwiVGFiXCIgJiYgdGhpcy5jaGVja0ZvY3VzKFxuICAgICAgZSxcbiAgICAgIGUuc2hpZnRLZXkgPyB0aGlzLmZpcnN0Rm9jdXNhYmxlRWxlbWVudCA6IHRoaXMubGFzdEZvY3VzYWJsZUVsZW1lbnQsXG4gICAgICBlLnNoaWZ0S2V5ID8gdGhpcy5sYXN0Rm9jdXNhYmxlRWxlbWVudCA6IHRoaXMuZmlyc3RGb2N1c2FibGVFbGVtZW50XG4gICAgKTtcbiAgfVxufVxuY29uc3Qge1xuICBsaWdodDogS2UsXG4gIGRhcms6IHpzLFxuICBhdXRvOiAkc1xufSA9IGcoXCJsaWdodFwiLCBcImRhcmtcIiwgXCJhdXRvXCIpO1xuY2xhc3MgYyB7XG4gIGNvbnN0cnVjdG9yKHsgdGVtcGxhdGU6IGUsIGNsYXNzZXM6IHQsIHBhcmVudDogcyB9KSB7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9ICExLCB0aGlzLmFwcEV2ZW50cyA9IHt9LCB0aGlzLnVpRXZlbnRzID0gW10sIHRoaXMudWlFbGVtZW50cyA9IHt9LCB0aGlzLnVpID0ge30sIHRoaXMudGVtcGxhdGUgPSBlLCB0aGlzLmNsYXNzZXMgPSB0LCB0aGlzLnBhcmVudCA9IHMsIHRoaXMua2V5QmluZGluZ0hhbmRsZXIgPSB0aGlzLmtleUJpbmRpbmdIYW5kbGVyLmJpbmQodGhpcyk7XG4gIH1cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLmJpbmRBcHBFdmVudHMoKTtcbiAgfVxuICBzZXRDdXN0b21FbW9qaXMoZSkge1xuICAgIHRoaXMuY3VzdG9tRW1vamlzID0gZTtcbiAgfVxuICBzZXRFdmVudHMoZSkge1xuICAgIHRoaXMuZXZlbnRzID0gZTtcbiAgfVxuICBzZXRQaWNrZXJJZChlKSB7XG4gICAgdGhpcy5waWNrZXJJZCA9IGU7XG4gIH1cbiAgZW1pdChlLCAuLi50KSB7XG4gICAgdGhpcy5ldmVudHMuZW1pdChlLCAuLi50KTtcbiAgfVxuICBzZXRJMThuKGUpIHtcbiAgICB0aGlzLmkxOG4gPSBlO1xuICB9XG4gIHNldFJlbmRlcmVyKGUpIHtcbiAgICB0aGlzLnJlbmRlcmVyID0gZTtcbiAgfVxuICBzZXRFbW9qaURhdGEoZSkge1xuICAgIHRoaXMuZW1vamlEYXRhUHJvbWlzZSA9IGUsIGUudGhlbigodCkgPT4ge1xuICAgICAgdGhpcy5lbW9qaURhdGEgPSB0O1xuICAgIH0pO1xuICB9XG4gIHVwZGF0ZUVtb2ppRGF0YShlKSB7XG4gICAgdGhpcy5lbW9qaURhdGEgPSBlLCB0aGlzLmVtb2ppRGF0YVByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoZSk7XG4gIH1cbiAgc2V0T3B0aW9ucyhlKSB7XG4gICAgdGhpcy5vcHRpb25zID0gZTtcbiAgfVxuICByZW5kZXJTeW5jKGUgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmVsID0gdGhpcy50ZW1wbGF0ZS5yZW5kZXJTeW5jKHtcbiAgICAgIGNsYXNzZXM6IHRoaXMuY2xhc3NlcyxcbiAgICAgIGkxOG46IHRoaXMuaTE4bixcbiAgICAgIHBpY2tlcklkOiB0aGlzLnBpY2tlcklkLFxuICAgICAgLi4uZVxuICAgIH0pLCB0aGlzLnBvc3RSZW5kZXIoKSwgdGhpcy5lbDtcbiAgfVxuICBhc3luYyByZW5kZXIoZSA9IHt9KSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZW1vamlEYXRhUHJvbWlzZSwgdGhpcy5lbCA9IGF3YWl0IHRoaXMudGVtcGxhdGUucmVuZGVyQXN5bmMoe1xuICAgICAgY2xhc3NlczogdGhpcy5jbGFzc2VzLFxuICAgICAgaTE4bjogdGhpcy5pMThuLFxuICAgICAgcGlja2VySWQ6IHRoaXMucGlja2VySWQsXG4gICAgICAuLi5lXG4gICAgfSksIHRoaXMucG9zdFJlbmRlcigpLCB0aGlzLmVsO1xuICB9XG4gIHBvc3RSZW5kZXIoKSB7XG4gICAgdGhpcy5iaW5kVUlFbGVtZW50cygpLCB0aGlzLmJpbmRLZXlCaW5kaW5ncygpLCB0aGlzLmJpbmRVSUV2ZW50cygpLCB0aGlzLnNjaGVkdWxlU2hvd0FuaW1hdGlvbigpO1xuICB9XG4gIGJpbmRBcHBFdmVudHMoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5hcHBFdmVudHMpLmZvckVhY2goKGUpID0+IHtcbiAgICAgIHRoaXMuZXZlbnRzLm9uKGUsIHRoaXMuYXBwRXZlbnRzW2VdLCB0aGlzKTtcbiAgICB9KSwgdGhpcy5ldmVudHMub24oXCJkYXRhOnJlYWR5XCIsIHRoaXMudXBkYXRlRW1vamlEYXRhLCB0aGlzKTtcbiAgfVxuICB1bmJpbmRBcHBFdmVudHMoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5hcHBFdmVudHMpLmZvckVhY2goKGUpID0+IHtcbiAgICAgIHRoaXMuZXZlbnRzLm9mZihlLCB0aGlzLmFwcEV2ZW50c1tlXSk7XG4gICAgfSksIHRoaXMuZXZlbnRzLm9mZihcImRhdGE6cmVhZHlcIiwgdGhpcy51cGRhdGVFbW9qaURhdGEpO1xuICB9XG4gIGtleUJpbmRpbmdIYW5kbGVyKGUpIHtcbiAgICBjb25zdCB0ID0gdGhpcy5rZXlCaW5kaW5nc1tlLmtleV07XG4gICAgdCAmJiB0LmNhbGwodGhpcywgZSk7XG4gIH1cbiAgYmluZEtleUJpbmRpbmdzKCkge1xuICAgIHRoaXMua2V5QmluZGluZ3MgJiYgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLmtleUJpbmRpbmdIYW5kbGVyKTtcbiAgfVxuICB1bmJpbmRLZXlCaW5kaW5ncygpIHtcbiAgICB0aGlzLmtleUJpbmRpbmdzICYmIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5rZXlCaW5kaW5nSGFuZGxlcik7XG4gIH1cbiAgYmluZFVJRWxlbWVudHMoKSB7XG4gICAgdGhpcy51aSA9IE9iamVjdC5rZXlzKHRoaXMudWlFbGVtZW50cykucmVkdWNlKChlLCB0KSA9PiAoe1xuICAgICAgLi4uZSxcbiAgICAgIFt0XTogdGhpcy5lbC5xdWVyeVNlbGVjdG9yKHRoaXMudWlFbGVtZW50c1t0XSlcbiAgICB9KSwge30pO1xuICB9XG4gIGJpbmRVSUV2ZW50cygpIHtcbiAgICB0aGlzLnVpRXZlbnRzLmZvckVhY2goKGUpID0+IHtcbiAgICAgIGUuaGFuZGxlciA9IGUuaGFuZGxlci5iaW5kKHRoaXMpLCAoZS50YXJnZXQgPyB0aGlzLnVpW2UudGFyZ2V0XSA6IHRoaXMuZWwpLmFkZEV2ZW50TGlzdGVuZXIoZS5ldmVudCwgZS5oYW5kbGVyLCBlLm9wdGlvbnMpO1xuICAgIH0pO1xuICB9XG4gIHVuYmluZFVJRXZlbnRzKCkge1xuICAgIHRoaXMudWlFdmVudHMuZm9yRWFjaCgoZSkgPT4ge1xuICAgICAgKGUudGFyZ2V0ID8gdGhpcy51aVtlLnRhcmdldF0gOiB0aGlzLmVsKS5yZW1vdmVFdmVudExpc3RlbmVyKGUuZXZlbnQsIGUuaGFuZGxlcik7XG4gICAgfSk7XG4gIH1cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLnVuYmluZEFwcEV2ZW50cygpLCB0aGlzLnVuYmluZFVJRXZlbnRzKCksIHRoaXMudW5iaW5kS2V5QmluZGluZ3MoKSwgdGhpcy5lbC5yZW1vdmUoKSwgdGhpcy5pc0Rlc3Ryb3llZCA9ICEwO1xuICB9XG4gIHNjaGVkdWxlU2hvd0FuaW1hdGlvbigpIHtcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIGNvbnN0IGUgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigodCkgPT4ge1xuICAgICAgICBjb25zdCBbc10gPSB0O1xuICAgICAgICBzLnR5cGUgPT09IFwiY2hpbGRMaXN0XCIgJiYgcy5hZGRlZE5vZGVzWzBdID09PSB0aGlzLmVsICYmIChiZSh0aGlzLm9wdGlvbnMpICYmIHRoaXMuYW5pbWF0ZVNob3cgJiYgdGhpcy5hbmltYXRlU2hvdygpLCBlLmRpc2Nvbm5lY3QpO1xuICAgICAgfSk7XG4gICAgICBlLm9ic2VydmUodGhpcy5wYXJlbnQsIHsgY2hpbGRMaXN0OiAhMCB9KTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGNoaWxkRXZlbnQoZSwgdCwgcywgbyA9IHt9KSB7XG4gICAgcmV0dXJuIHsgdGFyZ2V0OiBlLCBldmVudDogdCwgaGFuZGxlcjogcywgb3B0aW9uczogbyB9O1xuICB9XG4gIHN0YXRpYyB1aUV2ZW50KGUsIHQsIHMgPSB7fSkge1xuICAgIHJldHVybiB7IGV2ZW50OiBlLCBoYW5kbGVyOiB0LCBvcHRpb25zOiBzIH07XG4gIH1cbiAgc3RhdGljIGJ5Q2xhc3MoZSkge1xuICAgIHJldHVybiBgLiR7ZX1gO1xuICB9XG59XG5jb25zdCBxZSA9ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDUxMiA1MTJcIj48IS0tISBGb250IEF3ZXNvbWUgUHJvIDYuMS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlIChDb21tZXJjaWFsIExpY2Vuc2UpIENvcHlyaWdodCAyMDIyIEZvbnRpY29ucywgSW5jLiAtLT48cGF0aCBkPVwiTTI1NiA1MTJDMTE0LjYgNTEyIDAgMzk3LjQgMCAyNTZDMCAxMTQuNiAxMTQuNiAwIDI1NiAwQzM5Ny40IDAgNTEyIDExNC42IDUxMiAyNTZDNTEyIDM5Ny40IDM5Ny40IDUxMiAyNTYgNTEyek0yMzIgMjU2QzIzMiAyNjQgMjM2IDI3MS41IDI0Mi43IDI3NS4xTDMzOC43IDMzOS4xQzM0OS43IDM0Ny4zIDM2NC42IDM0NC4zIDM3MS4xIDMzMy4zQzM3OS4zIDMyMi4zIDM3Ni4zIDMwNy40IDM2NS4zIDMwMEwyODAgMjQzLjJWMTIwQzI4MCAxMDYuNyAyNjkuMyA5NiAyNTUuMSA5NkMyNDIuNyA5NiAyMzEuMSAxMDYuNyAyMzEuMSAxMjBMMjMyIDI1NnpcIi8+PC9zdmc+JywgR2UgPSAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCA1MTIgNTEyXCI+PCEtLSEgRm9udCBBd2Vzb21lIFBybyA2LjEuMSBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZSAoQ29tbWVyY2lhbCBMaWNlbnNlKSBDb3B5cmlnaHQgMjAyMiBGb250aWNvbnMsIEluYy4gLS0+PHBhdGggZD1cIk02NCA0OTZDNjQgNTA0LjggNTYuNzUgNTEyIDQ4IDUxMmgtMzJDNy4yNSA1MTIgMCA1MDQuOCAwIDQ5NlYzMmMwLTE3Ljc1IDE0LjI1LTMyIDMyLTMyczMyIDE0LjI1IDMyIDMyVjQ5NnpNNDc2LjMgMGMtNi4zNjUgMC0xMy4wMSAxLjM1LTE5LjM0IDQuMjMzYy00NS42OSAyMC44Ni03OS41NiAyNy45NC0xMDcuOCAyNy45NGMtNTkuOTYgMC05NC44MS0zMS44Ni0xNjMuOS0zMS44N0MxNjAuOSAuMzA1NSAxMzEuNiA0Ljg2NyA5NiAxNS43NXYzNTAuNWMzMi05Ljk4NCA1OS44Ny0xNC4xIDg0Ljg1LTE0LjFjNzMuNjMgMCAxMjQuOSAzMS43OCAxOTguNiAzMS43OGMzMS45MSAwIDY4LjAyLTUuOTcxIDExMS4xLTIzLjA5QzUwNC4xIDM1NS45IDUxMiAzNDQuNCA1MTIgMzMyLjFWMzAuNzNDNTEyIDExLjEgNDk1LjMgMCA0NzYuMyAwelwiLz48L3N2Zz4nLCBXZSA9ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDUxMiA1MTJcIj48IS0tISBGb250IEF3ZXNvbWUgUHJvIDYuMS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlIChDb21tZXJjaWFsIExpY2Vuc2UpIENvcHlyaWdodCAyMDIyIEZvbnRpY29ucywgSW5jLiAtLT48cGF0aCBkPVwiTTAgMjU2QzAgMTE0LjYgMTE0LjYgMCAyNTYgMEMzOTcuNCAwIDUxMiAxMTQuNiA1MTIgMjU2QzUxMiAzOTcuNCAzOTcuNCA1MTIgMjU2IDUxMkMxMTQuNiA1MTIgMCAzOTcuNCAwIDI1NnpNMTc2LjQgMjQwQzE5NCAyNDAgMjA4LjQgMjI1LjcgMjA4LjQgMjA4QzIwOC40IDE5MC4zIDE5NCAxNzYgMTc2LjQgMTc2QzE1OC43IDE3NiAxNDQuNCAxOTAuMyAxNDQuNCAyMDhDMTQ0LjQgMjI1LjcgMTU4LjcgMjQwIDE3Ni40IDI0MHpNMzM2LjQgMTc2QzMxOC43IDE3NiAzMDQuNCAxOTAuMyAzMDQuNCAyMDhDMzA0LjQgMjI1LjcgMzE4LjcgMjQwIDMzNi40IDI0MEMzNTQgMjQwIDM2OC40IDIyNS43IDM2OC40IDIwOEMzNjguNCAxOTAuMyAzNTQgMTc2IDMzNi40IDE3NnpNMjU5LjkgMzY5LjRDMjg4LjggMzY5LjQgMzE2LjIgMzc1LjIgMzQwLjYgMzg1LjVDMzUyLjkgMzkwLjcgMzY2LjcgMzgxLjMgMzYxLjQgMzY5LjFDMzQ0LjggMzMwLjkgMzA1LjYgMzAzLjEgMjU5LjkgMzAzLjFDMjE0LjMgMzAzLjEgMTc1LjEgMzMwLjggMTU4LjQgMzY5LjFDMTUzLjEgMzgxLjMgMTY2LjEgMzkwLjYgMTc5LjMgMzg1LjRDMjAzLjcgMzc1LjEgMjMxIDM2OS40IDI1OS45IDM2OS40TDI1OS45IDM2OS40elwiLz48L3N2Zz4nLCBfZSA9ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDY0MCA1MTJcIj48IS0tISBGb250IEF3ZXNvbWUgUHJvIDYuMS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlIChDb21tZXJjaWFsIExpY2Vuc2UpIENvcHlyaWdodCAyMDIyIEZvbnRpY29ucywgSW5jLiAtLT48cGF0aCBkPVwiTTQ0OCA2NEgxOTJDODUuOTYgNjQgMCAxNDkuMSAwIDI1NnM4NS45NiAxOTIgMTkyIDE5MmgyNTZjMTA2IDAgMTkyLTg1Ljk2IDE5Mi0xOTJTNTU0IDY0IDQ0OCA2NHpNMjQ3LjEgMjgwaC0zMnYzMmMwIDEzLjItMTAuNzggMjQtMjMuOTggMjRjLTEzLjIgMC0yNC4wMi0xMC44LTI0LjAyLTI0di0zMkwxMzYgMjc5LjFDMTIyLjggMjc5LjEgMTExLjEgMjY5LjIgMTExLjEgMjU2YzAtMTMuMiAxMC44NS0yNC4wMSAyNC4wNS0yNC4wMUwxNjcuMSAyMzJ2LTMyYzAtMTMuMiAxMC44Mi0yNCAyNC4wMi0yNGMxMy4yIDAgMjMuOTggMTAuOCAyMy45OCAyNHYzMmgzMmMxMy4yIDAgMjQuMDIgMTAuOCAyNC4wMiAyNEMyNzEuMSAyNjkuMiAyNjEuMiAyODAgMjQ3LjEgMjgwek00MzEuMSAzNDRjLTIyLjEyIDAtMzkuMS0xNy44Ny0zOS4xLTM5LjFzMTcuODctNDAgMzkuMS00MHMzOS4xIDE3Ljg4IDM5LjEgNDBTNDU0LjEgMzQ0IDQzMS4xIDM0NHpNNDk1LjEgMjQ4Yy0yMi4xMiAwLTM5LjEtMTcuODctMzkuMS0zOS4xczE3Ljg3LTQwIDM5LjEtNDBjMjIuMTIgMCAzOS4xIDE3Ljg4IDM5LjEgNDBTNTE4LjEgMjQ4IDQ5NS4xIDI0OHpcIi8+PC9zdmc+JywgSmUgPSAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAzODQgNTEyXCI+PCEtLSEgRm9udCBBd2Vzb21lIFBybyA2LjEuMSBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZSAoQ29tbWVyY2lhbCBMaWNlbnNlKSBDb3B5cmlnaHQgMjAyMiBGb250aWNvbnMsIEluYy4gLS0+PHBhdGggZD1cIk0xMTIuMSA0NTQuM2MwIDYuMjk3IDEuODE2IDEyLjQ0IDUuMjg0IDE3LjY5bDE3LjE0IDI1LjY5YzUuMjUgNy44NzUgMTcuMTcgMTQuMjggMjYuNjQgMTQuMjhoNjEuNjdjOS40MzggMCAyMS4zNi02LjQwMSAyNi42MS0xNC4yOGwxNy4wOC0yNS42OGMyLjkzOC00LjQzOCA1LjM0OC0xMi4zNyA1LjM0OC0xNy43TDI3MiA0MTUuMWgtMTYwTDExMi4xIDQ1NC4zek0xOTEuNCAuMDEzMkM4OS40NCAuMzI1NyAxNiA4Mi45NyAxNiAxNzUuMWMwIDQ0LjM4IDE2LjQ0IDg0Ljg0IDQzLjU2IDExNS44YzE2LjUzIDE4Ljg0IDQyLjM0IDU4LjIzIDUyLjIyIDkxLjQ1Yy4wMzEzIC4yNSAuMDkzOCAuNTE2NiAuMTI1IC43ODIzaDE2MC4yYy4wMzEzLS4yNjU2IC4wOTM4LS41MTY2IC4xMjUtLjc4MjNjOS44NzUtMzMuMjIgMzUuNjktNzIuNjEgNTIuMjItOTEuNDVDMzUxLjYgMjYwLjggMzY4IDIyMC40IDM2OCAxNzUuMUMzNjggNzguNjEgMjg4LjktLjI4MzcgMTkxLjQgLjAxMzJ6TTE5MiA5Ni4wMWMtNDQuMTMgMC04MCAzNS44OS04MCA3OS4xQzExMiAxODQuOCAxMDQuOCAxOTIgOTYgMTkyUzgwIDE4NC44IDgwIDE3NmMwLTYxLjc2IDUwLjI1LTExMS4xIDExMi0xMTEuMWM4Ljg0NCAwIDE2IDcuMTU5IDE2IDE2UzIwMC44IDk2LjAxIDE5MiA5Ni4wMXpcIi8+PC9zdmc+JywgWWUgPSAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCA2NDAgNTEyXCI+PCEtLSEgRm9udCBBd2Vzb21lIFBybyA2LjEuMSBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZSAoQ29tbWVyY2lhbCBMaWNlbnNlKSBDb3B5cmlnaHQgMjAyMiBGb250aWNvbnMsIEluYy4gLS0+PHBhdGggZD1cIk01MTIgMzJIMTIwYy0xMy4yNSAwLTI0IDEwLjc1LTI0IDI0TDk2LjAxIDI4OGMwIDUzIDQzIDk2IDk2IDk2aDE5MkM0MzcgMzg0IDQ4MCAzNDEgNDgwIDI4OGgzMmM3MC42MyAwIDEyOC01Ny4zOCAxMjgtMTI4UzU4Mi42IDMyIDUxMiAzMnpNNTEyIDIyNGgtMzJWOTZoMzJjMzUuMjUgMCA2NCAyOC43NSA2NCA2NFM1NDcuMyAyMjQgNTEyIDIyNHpNNTYwIDQxNmgtNTQ0QzcuMTY0IDQxNiAwIDQyMy4yIDAgNDMyQzAgNDU4LjUgMjEuNDkgNDgwIDQ4IDQ4MGg0ODBjMjYuNTEgMCA0OC0yMS40OSA0OC00OEM1NzYgNDIzLjIgNTY4LjggNDE2IDU2MCA0MTZ6XCIvPjwvc3ZnPicsIFFlID0gJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgNTc2IDUxMlwiPjwhLS0hIEZvbnQgQXdlc29tZSBQcm8gNi4xLjEgYnkgQGZvbnRhd2Vzb21lIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20gTGljZW5zZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tL2xpY2Vuc2UgKENvbW1lcmNpYWwgTGljZW5zZSkgQ29weXJpZ2h0IDIwMjIgRm9udGljb25zLCBJbmMuIC0tPjxwYXRoIGQ9XCJNNDgyLjMgMTkyQzUxNi41IDE5MiA1NzYgMjIxIDU3NiAyNTZDNTc2IDI5MiA1MTYuNSAzMjAgNDgyLjMgMzIwSDM2NS43TDI2NS4yIDQ5NS45QzI1OS41IDUwNS44IDI0OC45IDUxMiAyMzcuNCA1MTJIMTgxLjJDMTcwLjYgNTEyIDE2Mi45IDUwMS44IDE2NS44IDQ5MS42TDIxNC45IDMyMEgxMTJMNjguOCAzNzcuNkM2NS43OCAzODEuNiA2MS4wNCAzODQgNTYgMzg0SDE0LjAzQzYuMjg0IDM4NCAwIDM3Ny43IDAgMzY5LjFDMCAzNjguNyAuMTgxOCAzNjcuNCAuNTM5OCAzNjYuMUwzMiAyNTZMLjUzOTggMTQ1LjlDLjE4MTggMTQ0LjYgMCAxNDMuMyAwIDE0MkMwIDEzNC4zIDYuMjg0IDEyOCAxNC4wMyAxMjhINTZDNjEuMDQgMTI4IDY1Ljc4IDEzMC40IDY4LjggMTM0LjRMMTEyIDE5MkgyMTQuOUwxNjUuOCAyMC40QzE2Mi45IDEwLjE3IDE3MC42IDAgMTgxLjIgMEgyMzcuNEMyNDguOSAwIDI1OS41IDYuMTUzIDI2NS4yIDE2LjEyTDM2NS43IDE5Mkg0ODIuM3pcIi8+PC9zdmc+JywgWGUgPSAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCA2NDAgNTEyXCI+PCEtLSEgRm9udCBBd2Vzb21lIFBybyA2LjEuMSBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZSAoQ29tbWVyY2lhbCBMaWNlbnNlKSBDb3B5cmlnaHQgMjAyMiBGb250aWNvbnMsIEluYy4gLS0+PHBhdGggZD1cIk05LjM3NSAyMzMuNEMzLjM3NSAyMzkuNCAwIDI0Ny41IDAgMjU2djEyOGMwIDguNSAzLjM3NSAxNi42MiA5LjM3NSAyMi42MlMyMy41IDQxNiAzMiA0MTZoMzJWMjI0SDMyQzIzLjUgMjI0IDE1LjM4IDIyNy40IDkuMzc1IDIzMy40ek00NjQgOTZIMzUyVjMyYzAtMTcuNjItMTQuMzgtMzItMzItMzJTMjg4IDE0LjM4IDI4OCAzMnY2NEgxNzZDMTMxLjggOTYgOTYgMTMxLjggOTYgMTc2VjQ0OGMwIDM1LjM4IDI4LjYyIDY0IDY0IDY0aDMyMGMzNS4zOCAwIDY0LTI4LjYyIDY0LTY0VjE3NkM1NDQgMTMxLjggNTA4LjMgOTYgNDY0IDk2ek0yNTYgNDE2SDE5MnYtMzJoNjRWNDE2ek0yMjQgMjk2QzIwMS45IDI5NiAxODQgMjc4LjEgMTg0IDI1NlMyMDEuOSAyMTYgMjI0IDIxNlMyNjQgMjMzLjkgMjY0IDI1NlMyNDYuMSAyOTYgMjI0IDI5NnpNMzUyIDQxNkgyODh2LTMyaDY0VjQxNnpNNDQ4IDQxNmgtNjR2LTMyaDY0VjQxNnpNNDE2IDI5NmMtMjIuMTIgMC00MC0xNy44OC00MC00MFMzOTMuOSAyMTYgNDE2IDIxNlM0NTYgMjMzLjkgNDU2IDI1NlM0MzguMSAyOTYgNDE2IDI5NnpNNjMwLjYgMjMzLjRDNjI0LjYgMjI3LjQgNjE2LjUgMjI0IDYwOCAyMjRoLTMydjE5MmgzMmM4LjUgMCAxNi42Mi0zLjM3NSAyMi42Mi05LjM3NVM2NDAgMzkyLjUgNjQwIDM4NFYyNTZDNjQwIDI0Ny41IDYzNi42IDIzOS40IDYzMC42IDIzMy40elwiLz48L3N2Zz4nLCBaZSA9IGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDUxMiA1MTJcIj5cbiAgPGRlZnM+XG4gICAgPHJhZGlhbEdyYWRpZW50IGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiIGN5PVwiMTAlXCIgaWQ9XCJncmFkaWVudC0wXCI+XG4gICAgICA8c3RvcCBvZmZzZXQ9XCIwXCIgc3RvcC1jb2xvcj1cImhzbCg1MCwgMTAwJSwgNTAlKVwiIC8+XG4gICAgICA8c3RvcCBvZmZzZXQ9XCIxXCIgc3RvcC1jb2xvcj1cImhzbCg1MCwgMTAwJSwgNjAlKVwiIC8+XG4gICAgPC9yYWRpYWxHcmFkaWVudD5cbiAgPC9kZWZzPlxuICA8IS0tISBGb250IEF3ZXNvbWUgUHJvIDYuMS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlIChDb21tZXJjaWFsIExpY2Vuc2UpIENvcHlyaWdodCAyMDIyIEZvbnRpY29ucywgSW5jLiAtLT5cbiAgPGVsbGlwc2Ugc3Ryb2tlPVwiIzAwMFwiIGZpbGw9XCJyZ2JhKDAsIDAsIDAsIDAuNilcIiBjeD1cIjE3Mi41ODZcIiBjeT1cIjIwNy4wMDZcIiByeD1cIjM5Ljk3NFwiIHJ5PVwiMzkuOTc0XCIvPlxuICA8ZWxsaXBzZSBzdHJva2U9XCIjMDAwXCIgZmlsbD1cInJnYmEoMCwgMCwgMCwgMC42KVwiIGN4PVwiMzM0LjUyM1wiIGN5PVwiMjA3LjQ4MVwiIHJ4PVwiMzkuOTc0XCIgcnk9XCIzOS45NzRcIi8+XG4gIDxlbGxpcHNlIHN0cm9rZT1cIiMwMDBcIiBmaWxsPVwicmdiYSgwLCAwLCAwLCAwLjYpXCIgY3g9XCIzMTMuMzI1XCIgY3k9XCIzNTYuMjA4XCIgcng9XCI5MS40OTdcIiByeT1cIjU5Ljg5M1wiLz5cbiAgPHBhdGggZmlsbD1cIiM1NWE3ZmZcIiBkPVwiTSAxNTkuNDI3IDI3NC4wNiBMIDEwMi4xNTggMzYzLjI4NiBMIDEyNC4zNjYgNDE3LjAxMSBMIDE2MC40NzYgNDIzLjMzOCBMIDE5Ni45MzcgNDE0LjczNiBMIDIxOC41MDIgMzc1LjIxNFwiPjwvcGF0aD5cbiAgPHBhdGggZmlsbD1cInVybCgjZ3JhZGllbnQtMClcIiBkPVwiTTI1NiAwQzM5Ny40IDAgNTEyIDExNC42IDUxMiAyNTZDNTEyIDM5Ny40IDM5Ny40IDUxMiAyNTYgNTEyQzExNC42IDUxMiAwIDM5Ny40IDAgMjU2QzAgMTE0LjYgMTE0LjYgMCAyNTYgMHpNMjU2IDM1MkMyOTAuOSAzNTIgMzIzLjIgMzY3LjggMzQ4LjMgMzk0LjlDMzU0LjMgNDAxLjQgMzY0LjQgNDAxLjcgMzcwLjkgMzk1LjdDMzc3LjQgMzg5LjcgMzc3LjcgMzc5LjYgMzcxLjcgMzczLjFDMzQxLjYgMzQwLjUgMzAxIDMyMCAyNTYgMzIwQzI0Ny4yIDMyMCAyNDAgMzI3LjIgMjQwIDMzNkMyNDAgMzQ0LjggMjQ3LjIgMzUyIDI1NiAzNTJIMjU2ek0yMDggMzY5QzIwOCAzNDkgMTc5LjYgMzA4LjYgMTY2LjQgMjkxLjNDMTYzLjIgMjg2LjkgMTU2LjggMjg2LjkgMTUzLjYgMjkxLjNDMTQwLjYgMzA4LjYgMTEyIDM0OSAxMTIgMzY5QzExMiAzOTUgMTMzLjUgNDE2IDE2MCA0MTZDMTg2LjUgNDE2IDIwOCAzOTUgMjA4IDM2OUgyMDh6TTMwMy42IDIwOEMzMDMuNiAyMjUuNyAzMTcuMSAyNDAgMzM1LjYgMjQwQzM1My4zIDI0MCAzNjcuNiAyMjUuNyAzNjcuNiAyMDhDMzY3LjYgMTkwLjMgMzUzLjMgMTc2IDMzNS42IDE3NkMzMTcuMSAxNzYgMzAzLjYgMTkwLjMgMzAzLjYgMjA4ek0yMDcuNiAyMDhDMjA3LjYgMTkwLjMgMTkzLjMgMTc2IDE3NS42IDE3NkMxNTcuMSAxNzYgMTQzLjYgMTkwLjMgMTQzLjYgMjA4QzE0My42IDIyNS43IDE1Ny4xIDI0MCAxNzUuNiAyNDBDMTkzLjMgMjQwIDIwNy42IDIyNS43IDIwNy42IDIwOHpcIiAvPlxuPC9zdmc+YCwgZXQgPSAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCA1MTIgNTEyXCI+PCEtLSEgRm9udCBBd2Vzb21lIFBybyA2LjEuMSBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZSAoQ29tbWVyY2lhbCBMaWNlbnNlKSBDb3B5cmlnaHQgMjAyMiBGb250aWNvbnMsIEluYy4gLS0+PHBhdGggZD1cIk01MDAuMyA0NDMuN2wtMTE5LjctMTE5LjdjMjcuMjItNDAuNDEgNDAuNjUtOTAuOSAzMy40Ni0xNDQuN0M0MDEuOCA4Ny43OSAzMjYuOCAxMy4zMiAyMzUuMiAxLjcyM0M5OS4wMS0xNS41MS0xNS41MSA5OS4wMSAxLjcyNCAyMzUuMmMxMS42IDkxLjY0IDg2LjA4IDE2Ni43IDE3Ny42IDE3OC45YzUzLjggNy4xODkgMTA0LjMtNi4yMzYgMTQ0LjctMzMuNDZsMTE5LjcgMTE5LjdjMTUuNjIgMTUuNjIgNDAuOTUgMTUuNjIgNTYuNTcgMEM1MTUuOSA0ODQuNyA1MTUuOSA0NTkuMyA1MDAuMyA0NDMuN3pNNzkuMSAyMDhjMC03MC41OCA1Ny40Mi0xMjggMTI4LTEyOHMxMjggNTcuNDIgMTI4IDEyOGMwIDcwLjU4LTU3LjQyIDEyOC0xMjggMTI4Uzc5LjEgMjc4LjYgNzkuMSAyMDh6XCIvPjwvc3ZnPicsIHR0ID0gJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgNTEyIDUxMlwiPjwhLS0hIEZvbnQgQXdlc29tZSBQcm8gNi4xLjEgYnkgQGZvbnRhd2Vzb21lIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20gTGljZW5zZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tL2xpY2Vuc2UgKENvbW1lcmNpYWwgTGljZW5zZSkgQ29weXJpZ2h0IDIwMjIgRm9udGljb25zLCBJbmMuIC0tPjxwYXRoIGQ9XCJNMCAyNTZDMCAxMTQuNiAxMTQuNiAwIDI1NiAwQzM5Ny40IDAgNTEyIDExNC42IDUxMiAyNTZDNTEyIDM5Ny40IDM5Ny40IDUxMiAyNTYgNTEyQzExNC42IDUxMiAwIDM5Ny40IDAgMjU2ek0yNTYuMyAzMzEuOEMyMDguOSAzMzEuOCAxNjQuMSAzMjQuOSAxMjQuNSAzMTIuOEMxMTIuMiAzMDkgMTAwLjIgMzE5LjcgMTA1LjIgMzMxLjVDMTMwLjEgMzkwLjYgMTg4LjQgNDMyIDI1Ni4zIDQzMkMzMjQuMiA0MzIgMzgyLjQgMzkwLjYgNDA3LjQgMzMxLjVDNDEyLjQgMzE5LjcgNDAwLjQgMzA5IDM4OC4xIDMxMi44QzM0OC40IDMyNC45IDMwMy43IDMzMS44IDI1Ni4zIDMzMS44SDI1Ni4zek0xNzYuNCAxNzZDMTU4LjcgMTc2IDE0NC40IDE5MC4zIDE0NC40IDIwOEMxNDQuNCAyMjUuNyAxNTguNyAyNDAgMTc2LjQgMjQwQzE5NCAyNDAgMjA4LjQgMjI1LjcgMjA4LjQgMjA4QzIwOC40IDE5MC4zIDE5NCAxNzYgMTc2LjQgMTc2ek0zMzYuNCAyNDBDMzU0IDI0MCAzNjguNCAyMjUuNyAzNjguNCAyMDhDMzY4LjQgMTkwLjMgMzU0IDE3NiAzMzYuNCAxNzZDMzE4LjcgMTc2IDMwNC40IDE5MC4zIDMwNC40IDIwOEMzMDQuNCAyMjUuNyAzMTguNyAyNDAgMzM2LjQgMjQwelwiLz48L3N2Zz4nLCBzdCA9ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDUxMiA1MTJcIj48IS0tISBGb250IEF3ZXNvbWUgUHJvIDYuMS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlIChDb21tZXJjaWFsIExpY2Vuc2UpIENvcHlyaWdodCAyMDIyIEZvbnRpY29ucywgSW5jLiAtLT48cGF0aCBkPVwiTTUwMC4zIDcuMjUxQzUwNy43IDEzLjMzIDUxMiAyMi40MSA1MTIgMzEuMVYxNzUuMUM1MTIgMjAyLjUgNDgzLjMgMjIzLjEgNDQ3LjEgMjIzLjFDNDEyLjcgMjIzLjEgMzgzLjEgMjAyLjUgMzgzLjEgMTc1LjFDMzgzLjEgMTQ5LjUgNDEyLjcgMTI3LjEgNDQ3LjEgMTI3LjFWNzEuMDNMMzUxLjEgOTAuMjNWMjA3LjFDMzUxLjEgMjM0LjUgMzIzLjMgMjU1LjEgMjg3LjEgMjU1LjFDMjUyLjcgMjU1LjEgMjIzLjEgMjM0LjUgMjIzLjEgMjA3LjFDMjIzLjEgMTgxLjUgMjUyLjcgMTU5LjEgMjg3LjEgMTU5LjFWNjMuMUMyODcuMSA0OC43NCAyOTguOCAzNS42MSAzMTMuNyAzMi42Mkw0NzMuNyAuNjE5OEM0ODMuMS0xLjI2MSA0OTIuOSAxLjE3MyA1MDAuMyA3LjI1MUg1MDAuM3pNNzQuNjYgMzAzLjFMODYuNSAyODYuMkM5Mi40MyAyNzcuMyAxMDIuNCAyNzEuMSAxMTMuMSAyNzEuMUgxNzQuOUMxODUuNiAyNzEuMSAxOTUuNiAyNzcuMyAyMDEuNSAyODYuMkwyMTMuMyAzMDMuMUgyMzkuMUMyNjYuNSAzMDMuMSAyODcuMSAzMjUuNSAyODcuMSAzNTEuMVY0NjMuMUMyODcuMSA0OTAuNSAyNjYuNSA1MTEuMSAyMzkuMSA1MTEuMUg0Ny4xQzIxLjQ5IDUxMS4xLS4wMDE5IDQ5MC41LS4wMDE5IDQ2My4xVjM1MS4xQy0uMDAxOSAzMjUuNSAyMS40OSAzMDMuMSA0Ny4xIDMwMy4xSDc0LjY2ek0xNDMuMSAzNTkuMUMxMTcuNSAzNTkuMSA5NS4xIDM4MS41IDk1LjEgNDA3LjFDOTUuMSA0MzQuNSAxMTcuNSA0NTUuMSAxNDMuMSA0NTUuMUMxNzAuNSA0NTUuMSAxOTEuMSA0MzQuNSAxOTEuMSA0MDcuMUMxOTEuMSAzODEuNSAxNzAuNSAzNTkuMSAxNDMuMSAzNTkuMXpNNDQwLjMgMzY3LjFINDk2QzUwMi43IDM2Ny4xIDUwOC42IDM3Mi4xIDUxMC4xIDM3OC40QzUxMy4zIDM4NC42IDUxMS42IDM5MS43IDUwNi41IDM5NkwzNzguNSA1MDhDMzcyLjkgNTEyLjEgMzY0LjYgNTEzLjMgMzU4LjYgNTA4LjlDMzUyLjYgNTA0LjYgMzUwLjMgNDk2LjYgMzUzLjMgNDg5LjdMMzkxLjcgMzk5LjFIMzM2QzMyOS4zIDM5OS4xIDMyMy40IDM5NS45IDMyMSAzODkuNkMzMTguNyAzODMuNCAzMjAuNCAzNzYuMyAzMjUuNSAzNzEuMUw0NTMuNSAyNTkuMUM0NTkuMSAyNTUgNDY3LjQgMjU0LjcgNDczLjQgMjU5LjFDNDc5LjQgMjYzLjQgNDgxLjYgMjcxLjQgNDc4LjcgMjc4LjNMNDQwLjMgMzY3LjF6TTExNi43IDIxOS4xTDE5Ljg1IDExOS4yQy04LjExMiA5MC4yNi02LjYxNCA0Mi4zMSAyNC44NSAxNS4zNEM1MS44Mi04LjEzNyA5My4yNi0zLjY0MiAxMTguMiAyMS44M0wxMjguMiAzMi4zMkwxMzcuNyAyMS44M0MxNjIuNy0zLjY0MiAyMDMuNi04LjEzNyAyMzEuNiAxNS4zNEMyNjIuNiA0Mi4zMSAyNjQuMSA5MC4yNiAyMzYuMSAxMTkuMkwxMzkuNyAyMTkuMUMxMzMuMiAyMjUuNiAxMjIuNyAyMjUuNiAxMTYuNyAyMTkuMUgxMTYuN3pcIi8+PC9zdmc+JywgaXQgPSAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCA0NDggNTEyXCI+PCEtLSEgRm9udCBBd2Vzb21lIFBybyA2LjEuMSBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZSAoQ29tbWVyY2lhbCBMaWNlbnNlKSBDb3B5cmlnaHQgMjAyMiBGb250aWNvbnMsIEluYy4gLS0+PHBhdGggZD1cIk00MTMuOCA0NDcuMUwyNTYgNDQ4bDAgMzEuOTlDMjU2IDQ5Ny43IDI0MS44IDUxMiAyMjQuMSA1MTJjLTE3LjY3IDAtMzIuMS0xNC4zMi0zMi4xLTMxLjk5bDAtMzEuOTlsLTE1OC45LS4wMDk5Yy0yOC41IDAtNDMuNjktMzQuNDktMjQuNjktNTYuNGw2OC45OC03OS41OUg2Mi4yMmMtMjUuNDEgMC0zOS4xNS0yOS44LTIyLjY3LTQ5LjEzbDYwLjQxLTcwLjg1SDg5LjIxYy0yMS4yOCAwLTMyLjg3LTIyLjUtMTkuMjgtMzcuMzFsMTM0LjgtMTQ2LjVjMTAuNC0xMS4zIDI4LjIyLTExLjMgMzguNjItLjAwMzNsMTM0LjkgMTQ2LjVjMTMuNjIgMTQuODEgMi4wMDEgMzcuMzEtMTkuMjggMzcuMzFoLTEwLjc3bDYwLjM1IDcwLjg2YzE2LjQ2IDE5LjM0IDIuNzE2IDQ5LjEyLTIyLjY4IDQ5LjEyaC0xNS4ybDY4Ljk4IDc5LjU5QzQ1OC43IDQxMy43IDQ0My4xIDQ0Ny4xIDQxMy44IDQ0Ny4xelwiLz48L3N2Zz4nLCBvdCA9ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDY0MCA1MTJcIj48IS0tISBGb250IEF3ZXNvbWUgUHJvIDYuMS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlIChDb21tZXJjaWFsIExpY2Vuc2UpIENvcHlyaWdodCAyMDIyIEZvbnRpY29ucywgSW5jLiAtLT48cGF0aCBkPVwiTTIyNCAyNTZjNzAuNyAwIDEyOC01Ny4zMSAxMjgtMTI4UzI5NC43IDAgMjI0IDBDMTUzLjMgMCA5NiA1Ny4zMSA5NiAxMjhTMTUzLjMgMjU2IDIyNCAyNTZ6TTI3NC43IDMwNEgxNzMuM2MtOTUuNzMgMC0xNzMuMyA3Ny42LTE3My4zIDE3My4zQzAgNDk2LjUgMTUuNTIgNTEyIDM0LjY2IDUxMkg0MTMuM0M0MzIuNSA1MTIgNDQ4IDQ5Ni41IDQ0OCA0NzcuM0M0NDggMzgxLjYgMzcwLjQgMzA0IDI3NC43IDMwNHpNNDc5LjEgMzIwaC03My44NUM0NTEuMiAzNTcuNyA0ODAgNDE0LjEgNDgwIDQ3Ny4zQzQ4MCA0OTAuMSA0NzYuMiA1MDEuOSA0NzAgNTEyaDEzOEM2MjUuNyA1MTIgNjQwIDQ5Ny42IDY0MCA0NzkuMUM2NDAgMzkxLjYgNTY4LjQgMzIwIDQ3OS4xIDMyMHpNNDMyIDI1NkM0OTMuOSAyNTYgNTQ0IDIwNS45IDU0NCAxNDRTNDkzLjkgMzIgNDMyIDMyYy0yNS4xMSAwLTQ4LjA0IDguNTU1LTY2LjcyIDIyLjUxQzM3Ni44IDc2LjYzIDM4NCAxMDEuNCAzODQgMTI4YzAgMzUuNTItMTEuOTMgNjguMTQtMzEuNTkgOTQuNzFDMzcyLjcgMjQzLjIgNDAwLjggMjU2IDQzMiAyNTZ6XCIvPjwvc3ZnPicsIHJ0ID0gYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgNTEyIDUxMlwiPlxuICA8ZGVmcz5cbiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9XCJyYWRpYWxcIiBjeT1cIjg1JVwiPlxuICAgICAgPHN0b3Agb2Zmc2V0PVwiMjAlXCIgc3RvcC1jb2xvcj1cInZhcigtLWNvbG9yLXNlY29uZGFyeSlcIiAvPlxuICAgICAgPHN0b3Agb2Zmc2V0PVwiMTAwJVwiIHN0b3AtY29sb3I9XCJ2YXIoLS1jb2xvci1wcmltYXJ5KVwiIC8+XG4gICAgPC9yYWRpYWxHcmFkaWVudD5cbiAgPC9kZWZzPlxuICA8IS0tISBGb250IEF3ZXNvbWUgUHJvIDYuMS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlIChDb21tZXJjaWFsIExpY2Vuc2UpIENvcHlyaWdodCAyMDIyIEZvbnRpY29ucywgSW5jLiAtLT5cbiAgPHBhdGggZmlsbD1cInVybCgnI3JhZGlhbCcpXCIgZD1cIk01MDYuMyA0MTdsLTIxMy4zLTM2NGMtMTYuMzMtMjgtNTcuNTQtMjgtNzMuOTggMGwtMjEzLjIgMzY0Qy0xMC41OSA0NDQuOSA5Ljg0OSA0ODAgNDIuNzQgNDgwaDQyNi42QzUwMi4xIDQ4MCA1MjIuNiA0NDUgNTA2LjMgNDE3ek0yMzIgMTY4YzAtMTMuMjUgMTAuNzUtMjQgMjQtMjRTMjgwIDE1NC44IDI4MCAxNjh2MTI4YzAgMTMuMjUtMTAuNzUgMjQtMjMuMSAyNFMyMzIgMzA5LjMgMjMyIDI5NlYxNjh6TTI1NiA0MTZjLTE3LjM2IDAtMzEuNDQtMTQuMDgtMzEuNDQtMzEuNDRjMC0xNy4zNiAxNC4wNy0zMS40NCAzMS40NC0zMS40NHMzMS40NCAxNC4wOCAzMS40NCAzMS40NEMyODcuNCA0MDEuOSAyNzMuNCA0MTYgMjU2IDQxNnpcIiAvPlxuPC9zdmc+YCwgYXQgPSAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAzMjAgNTEyXCI+PCEtLSEgRm9udCBBd2Vzb21lIFBybyA2LjEuMSBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZSAoQ29tbWVyY2lhbCBMaWNlbnNlKSBDb3B5cmlnaHQgMjAyMiBGb250aWNvbnMsIEluYy4gLS0+PHBhdGggZD1cIk0zMTAuNiAzNjEuNGMxMi41IDEyLjUgMTIuNSAzMi43NSAwIDQ1LjI1QzMwNC40IDQxMi45IDI5Ni4yIDQxNiAyODggNDE2cy0xNi4zOC0zLjEyNS0yMi42Mi05LjM3NUwxNjAgMzAxLjNMNTQuNjMgNDA2LjZDNDguMzggNDEyLjkgNDAuMTkgNDE2IDMyIDQxNlMxNS42MyA0MTIuOSA5LjM3NSA0MDYuNmMtMTIuNS0xMi41LTEyLjUtMzIuNzUgMC00NS4yNWwxMDUuNC0xMDUuNEw5LjM3NSAxNTAuNmMtMTIuNS0xMi41LTEyLjUtMzIuNzUgMC00NS4yNXMzMi43NS0xMi41IDQ1LjI1IDBMMTYwIDIxMC44bDEwNS40LTEwNS40YzEyLjUtMTIuNSAzMi43NS0xMi41IDQ1LjI1IDBzMTIuNSAzMi43NSAwIDQ1LjI1bC0xMDUuNCAxMDUuNEwzMTAuNiAzNjEuNHpcIi8+PC9zdmc+JztcbmZ1bmN0aW9uIG50KGksIGUpIHtcbiAgY29uc3QgdCA9IEooZSk7XG4gIHJldHVybiB0LmRhdGFzZXQuaWNvbiA9IGksIHQuY2xhc3NMaXN0LmFkZChvZShcImljb25cIikpLCB0O1xufVxuY29uc3QgbWUgPSB7XG4gIGNsb2NrOiBxZSxcbiAgZmxhZzogR2UsXG4gIGZyb3duOiBXZSxcbiAgZ2FtZXBhZDogX2UsXG4gIGxpZ2h0YnVsYjogSmUsXG4gIG11ZzogWWUsXG4gIHBsYW5lOiBRZSxcbiAgcm9ib3Q6IFhlLFxuICBzYWQ6IFplLFxuICBzZWFyY2g6IGV0LFxuICBzbWlsZXk6IHR0LFxuICBzeW1ib2xzOiBzdCxcbiAgdHJlZTogaXQsXG4gIHVzZXJzOiBvdCxcbiAgd2FybmluZzogcnQsXG4gIHhtYXJrOiBhdFxufSwgRCA9IHtcbiAgcmVjZW50czogXCJjbG9ja1wiLFxuICBcInNtaWxleXMtZW1vdGlvblwiOiBcInNtaWxleVwiLFxuICBcInBlb3BsZS1ib2R5XCI6IFwidXNlcnNcIixcbiAgXCJhbmltYWxzLW5hdHVyZVwiOiBcInRyZWVcIixcbiAgXCJmb29kLWRyaW5rXCI6IFwibXVnXCIsXG4gIGFjdGl2aXRpZXM6IFwiZ2FtZXBhZFwiLFxuICBcInRyYXZlbC1wbGFjZXNcIjogXCJwbGFuZVwiLFxuICBvYmplY3RzOiBcImxpZ2h0YnVsYlwiLFxuICBzeW1ib2xzOiBcInN5bWJvbHNcIixcbiAgZmxhZ3M6IFwiZmxhZ1wiLFxuICBjdXN0b206IFwicm9ib3RcIlxufTtcbmZ1bmN0aW9uIGplKGksIGUpIHtcbiAgaWYgKCEoaSBpbiBtZSkpXG4gICAgcmV0dXJuIGNvbnNvbGUud2FybihgVW5rbm93biBpY29uOiBcIiR7aX1cImApLCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBjb25zdCB0ID0gbnQoaSwgbWVbaV0pO1xuICByZXR1cm4gZSAmJiB0LmNsYXNzTGlzdC5hZGQob2UoYGljb24tJHtlfWApKSwgdDtcbn1cbmNvbnN0IGN0ID0ge1xuICBtb2RlOiBcInN5bmNcIlxufTtcbnZhciB3LCB4LCBTLCBZLCBQLCBRLCB6LCBYO1xuY2xhc3MgdSB7XG4gIGNvbnN0cnVjdG9yKGUsIHQgPSB7fSkge1xuICAgIGYodGhpcywgUyk7XG4gICAgZih0aGlzLCBQKTtcbiAgICBmKHRoaXMsIHopO1xuICAgIGYodGhpcywgdywgdm9pZCAwKTtcbiAgICBmKHRoaXMsIHgsIHZvaWQgMCk7XG4gICAgQSh0aGlzLCB3LCBlKSwgQSh0aGlzLCB4LCB0Lm1vZGUgfHwgY3QubW9kZSk7XG4gIH1cbiAgcmVuZGVyU3luYyhlID0ge30pIHtcbiAgICBjb25zdCB0ID0gSih5KHRoaXMsIHcpLmNhbGwodGhpcywgZSkpO1xuICAgIHJldHVybiBwKHRoaXMsIHosIFgpLmNhbGwodGhpcywgdCwgZSksIHAodGhpcywgUCwgUSkuY2FsbCh0aGlzLCB0KSwgcCh0aGlzLCBTLCBZKS5jYWxsKHRoaXMsIHQsIGUpLCB0O1xuICB9XG4gIGFzeW5jIHJlbmRlckFzeW5jKGUgPSB7fSkge1xuICAgIGNvbnN0IHQgPSBKKHkodGhpcywgdykuY2FsbCh0aGlzLCBlKSk7XG4gICAgcmV0dXJuIHAodGhpcywgeiwgWCkuY2FsbCh0aGlzLCB0LCBlKSwgcCh0aGlzLCBQLCBRKS5jYWxsKHRoaXMsIHQpLCBhd2FpdCBwKHRoaXMsIFMsIFkpLmNhbGwodGhpcywgdCwgZSksIHQ7XG4gIH1cbiAgcmVuZGVyKGUpIHtcbiAgICByZXR1cm4geSh0aGlzLCB4KSA9PT0gXCJzeW5jXCIgPyB0aGlzLnJlbmRlclN5bmMoZSkgOiB0aGlzLnJlbmRlckFzeW5jKGUpO1xuICB9XG59XG53ID0gbmV3IFdlYWtNYXAoKSwgeCA9IG5ldyBXZWFrTWFwKCksIFMgPSBuZXcgV2Vha1NldCgpLCBZID0gYXN5bmMgZnVuY3Rpb24oZSwgdCkge1xuICBjb25zdCBzID0gZS5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtdmlld11cIiksIG8gPSBbXTtcbiAgZm9yIChjb25zdCByIG9mIHMpIHtcbiAgICBjb25zdCBhID0gdFtyLmRhdGFzZXQudmlld107XG4gICAgYSA/IHIuZGF0YXNldC5yZW5kZXIgIT09IFwic3luY1wiID8gby5wdXNoKGEucmVuZGVyKCkudGhlbigobikgPT4gKHIucmVwbGFjZVdpdGgobiksIG4pKSkgOiByLnJlcGxhY2VXaXRoKGEucmVuZGVyU3luYygpKSA6IHIucmVtb3ZlKCk7XG4gIH1cbiAgcmV0dXJuIFByb21pc2UuYWxsKG8pO1xufSwgUCA9IG5ldyBXZWFrU2V0KCksIFEgPSBmdW5jdGlvbihlKSB7XG4gIGUucXVlcnlTZWxlY3RvckFsbChcImlbZGF0YS1pY29uXVwiKS5mb3JFYWNoKChzKSA9PiB7XG4gICAgY29uc3QgeyBpY29uOiBvLCBzaXplOiByIH0gPSBzLmRhdGFzZXQ7XG4gICAgcy5yZXBsYWNlV2l0aChqZShvLCByKSk7XG4gIH0pO1xufSwgeiA9IG5ldyBXZWFrU2V0KCksIFggPSBmdW5jdGlvbihlLCB0KSB7XG4gIHJldHVybiBlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1wbGFjZWhvbGRlcl1cIikuZm9yRWFjaCgobykgPT4ge1xuICAgIGNvbnN0IHIgPSBvLmRhdGFzZXQucGxhY2Vob2xkZXI7XG4gICAgaWYgKHIgJiYgdFtyXSkge1xuICAgICAgY29uc3QgYSA9IHRbcl07XG4gICAgICBvLnJlcGxhY2VXaXRoKC4uLlthXS5mbGF0KCkpO1xuICAgIH0gZWxzZVxuICAgICAgY29uc29sZS53YXJuKGBNaXNzaW5nIHBsYWNlaG9sZGVyIGVsZW1lbnQgZm9yIGtleSBcIiR7cn1cImApO1xuICB9KSwgZTtcbn07XG5jb25zdCBsdCA9IGcoXG4gIFwiaW1hZ2VQbGFjZWhvbGRlclwiLFxuICBcInBsYWNlaG9sZGVyXCJcbiksIGh0ID0gbmV3IHUoKHsgY2xhc3NlczogaSB9KSA9PiBgXG4gIDxkaXYgY2xhc3M9XCIke2kucGxhY2Vob2xkZXJ9ICR7aS5pbWFnZVBsYWNlaG9sZGVyfVwiPjwvZGl2PlxuYCk7XG5jbGFzcyBkdCBleHRlbmRzIGMge1xuICBjb25zdHJ1Y3Rvcih7IGNsYXNzTmFtZXM6IGUgfSA9IHt9KSB7XG4gICAgc3VwZXIoeyB0ZW1wbGF0ZTogaHQsIGNsYXNzZXM6IGx0IH0pLCB0aGlzLmNsYXNzTmFtZXMgPSBlO1xuICB9XG4gIGxvYWQoZSkge1xuICAgIGNvbnN0IHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgIHRoaXMuY2xhc3NOYW1lcyAmJiAodC5jbGFzc05hbWUgPSB0aGlzLmNsYXNzTmFtZXMpLCB0LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcbiAgICAgIHRoaXMuZWwucmVwbGFjZVdpdGgodCk7XG4gICAgfSwgeyBvbmNlOiAhMCB9KSwgUHJvbWlzZS5yZXNvbHZlKGUpLnRoZW4oKHMpID0+IHQuc3JjID0gcyk7XG4gIH1cbiAgcmVuZGVyU3luYygpIHtcbiAgICByZXR1cm4gc3VwZXIucmVuZGVyU3luYygpLCB0aGlzLmNsYXNzTmFtZXMgJiYgdGhpcy5jbGFzc05hbWVzLnNwbGl0KFwiIFwiKS5mb3JFYWNoKCh0KSA9PiB0aGlzLmVsLmNsYXNzTGlzdC5hZGQodCkpLCB0aGlzLmVsO1xuICB9XG59XG5jb25zdCBtdCA9IGcoXCJjdXN0b21FbW9qaVwiKTtcbmNsYXNzIHV0IHtcbiAgcmVuZGVyRWxlbWVudChlKSB7XG4gICAgcmV0dXJuIHsgY29udGVudDogZSB9O1xuICB9XG4gIHJlbmRlckltYWdlKGUgPSBcIlwiLCB0KSB7XG4gICAgY29uc3QgcyA9IG5ldyBkdCh7IGNsYXNzTmFtZXM6IGUgfSk7XG4gICAgcmV0dXJuIHMucmVuZGVyU3luYygpLCB7IGNvbnRlbnQ6IHMsIHJlc29sdmVyOiAoKSA9PiAocy5sb2FkKHQoKSksIHMuZWwpIH07XG4gIH1cbiAgZG9SZW5kZXIoZSwgdCwgcykge1xuICAgIGlmIChlLmN1c3RvbSlcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlckN1c3RvbShlLCB0LCBzKTtcbiAgICBjb25zdCB7IGNvbnRlbnQ6IG8sIHJlc29sdmVyOiByIH0gPSB0aGlzLnJlbmRlcihlLCBzKSwgYSA9IG8gaW5zdGFuY2VvZiBFbGVtZW50ID8gbyA6IG8uZWw7XG4gICAgcmV0dXJuIHIgJiYgcigpLCBhO1xuICB9XG4gIGRvRW1pdChlKSB7XG4gICAgcmV0dXJuIGUuY3VzdG9tID8gdGhpcy5lbWl0Q3VzdG9tKGUpIDogdGhpcy5lbWl0KGUpO1xuICB9XG4gIGVtaXRDdXN0b20oeyB1cmw6IGUsIGxhYmVsOiB0LCBlbW9qaTogcywgZGF0YTogbyB9KSB7XG4gICAgcmV0dXJuIHsgdXJsOiBlLCBsYWJlbDogdCwgZW1vamk6IHMsIGRhdGE6IG8gfTtcbiAgfVxuICByZW5kZXJDdXN0b20oZSwgdCwgcyA9IFwiXCIpIHtcbiAgICBjb25zdCBvID0gW210LmN1c3RvbUVtb2ppLCBzXS5qb2luKFwiIFwiKS50cmltKCksIHsgY29udGVudDogciwgcmVzb2x2ZXI6IGEgfSA9IHRoaXMucmVuZGVySW1hZ2UobywgKCkgPT4gZS51cmwpLCBuID0gciBpbnN0YW5jZW9mIEVsZW1lbnQgPyByIDogci5lbDtcbiAgICByZXR1cm4gYSAmJiBhKCksIG47XG4gIH1cbn1cbmNvbnN0IGd0ID0gbmV3IHUoKHsgZW1vamk6IGkgfSkgPT4gYDxzcGFuPiR7aX08L3NwYW4+YCk7XG5jbGFzcyBwdCBleHRlbmRzIHV0IHtcbiAgcmVuZGVyKGUpIHtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJFbGVtZW50KGd0LnJlbmRlclN5bmMoeyBlbW9qaTogZS5lbW9qaSB9KSk7XG4gIH1cbiAgZW1pdCh7IGVtb2ppOiBlLCBoZXhjb2RlOiB0LCBsYWJlbDogcyB9KSB7XG4gICAgcmV0dXJuIHsgZW1vamk6IGUsIGhleGNvZGU6IHQsIGxhYmVsOiBzIH07XG4gIH1cbn1cbmNvbnN0IHl0ID0ge1xuICBcImNhdGVnb3JpZXMuYWN0aXZpdGllc1wiOiBcIkFjdGl2aXRpZXNcIixcbiAgXCJjYXRlZ29yaWVzLmFuaW1hbHMtbmF0dXJlXCI6IFwiQW5pbWFscyAmIE5hdHVyZVwiLFxuICBcImNhdGVnb3JpZXMuY3VzdG9tXCI6IFwiQ3VzdG9tXCIsXG4gIFwiY2F0ZWdvcmllcy5mbGFnc1wiOiBcIkZsYWdzXCIsXG4gIFwiY2F0ZWdvcmllcy5mb29kLWRyaW5rXCI6IFwiRm9vZCAmIERyaW5rXCIsXG4gIFwiY2F0ZWdvcmllcy5vYmplY3RzXCI6IFwiT2JqZWN0c1wiLFxuICBcImNhdGVnb3JpZXMucGVvcGxlLWJvZHlcIjogXCJQZW9wbGUgJiBCb2R5XCIsXG4gIFwiY2F0ZWdvcmllcy5yZWNlbnRzXCI6IFwiUmVjZW50bHkgVXNlZFwiLFxuICBcImNhdGVnb3JpZXMuc21pbGV5cy1lbW90aW9uXCI6IFwiU21pbGV5cyAmIEVtb3Rpb25cIixcbiAgXCJjYXRlZ29yaWVzLnN5bWJvbHNcIjogXCJTeW1ib2xzXCIsXG4gIFwiY2F0ZWdvcmllcy50cmF2ZWwtcGxhY2VzXCI6IFwiVHJhdmVsICYgUGxhY2VzXCIsXG4gIFwiZXJyb3IubG9hZFwiOiBcIkZhaWxlZCB0byBsb2FkIGVtb2ppc1wiLFxuICBcInJlY2VudHMuY2xlYXJcIjogXCJDbGVhciByZWNlbnQgZW1vamlzXCIsXG4gIFwicmVjZW50cy5ub25lXCI6IFwiWW91IGhhdmVuJ3Qgc2VsZWN0ZWQgYW55IGVtb2ppcyB5ZXQuXCIsXG4gIHJldHJ5OiBcIlRyeSBhZ2FpblwiLFxuICBcInNlYXJjaC5jbGVhclwiOiBcIkNsZWFyIHNlYXJjaFwiLFxuICBcInNlYXJjaC5lcnJvclwiOiBcIkZhaWxlZCB0byBzZWFyY2ggZW1vamlzXCIsXG4gIFwic2VhcmNoLm5vdEZvdW5kXCI6IFwiTm8gcmVzdWx0cyBmb3VuZFwiLFxuICBzZWFyY2g6IFwiU2VhcmNoIGVtb2ppcy4uLlwiXG59LCBmdCA9IFtcbiAgKGksIGUpID0+IChpLmhleGNvZGUgPT09IFwiMUY5MURcIiAmJiBlIDwgMTQgJiYgKGkuc2tpbnMgPSBbXSksIGkpLFxuICAoaSwgZSkgPT4gKGkuc2tpbnMgJiYgKGkuc2tpbnMgPSBpLnNraW5zLmZpbHRlcigodCkgPT4gIXQudmVyc2lvbiB8fCB0LnZlcnNpb24gPD0gZSkpLCBpKVxuXTtcbmZ1bmN0aW9uIHZ0KGksIGUpIHtcbiAgcmV0dXJuIGZ0LnNvbWUoKHQpID0+IHQoaSwgZSkgPT09IG51bGwpID8gbnVsbCA6IGk7XG59XG5mdW5jdGlvbiBNKGksIGUpIHtcbiAgcmV0dXJuIGkuZmlsdGVyKCh0KSA9PiB2dCh0LCBlKSAhPT0gbnVsbCk7XG59XG5mdW5jdGlvbiBFKGkpIHtcbiAgdmFyIGU7XG4gIHJldHVybiB7XG4gICAgZW1vamk6IGkuZW1vamksXG4gICAgbGFiZWw6IGkubGFiZWwsXG4gICAgdGFnczogaS50YWdzLFxuICAgIHNraW5zOiAoZSA9IGkuc2tpbnMpID09IG51bGwgPyB2b2lkIDAgOiBlLm1hcCgodCkgPT4gRSh0KSksXG4gICAgb3JkZXI6IGkub3JkZXIsXG4gICAgY3VzdG9tOiAhMSxcbiAgICBoZXhjb2RlOiBpLmhleGNvZGUsXG4gICAgdmVyc2lvbjogaS52ZXJzaW9uXG4gIH07XG59XG5mdW5jdGlvbiBCKGksIGUsIHQpIHtcbiAgdmFyIHM7XG4gIHJldHVybiB0ICYmICF0LnNvbWUoKG8pID0+IG8ub3JkZXIgPT09IGkuZ3JvdXApID8gITEgOiBoZShpLmxhYmVsLCBlKSB8fCAoKHMgPSBpLnRhZ3MpID09IG51bGwgPyB2b2lkIDAgOiBzLnNvbWUoKG8pID0+IGhlKG8sIGUpKSk7XG59XG5jbGFzcyBrZSB7XG4gIGNvbnN0cnVjdG9yKGUgPSBcImVuXCIpIHtcbiAgICB0aGlzLmxvY2FsZSA9IGU7XG4gIH1cbn1cbmNvbnN0IFogPSBcIlBpY01vXCI7XG5mdW5jdGlvbiBFZShpKSB7XG4gIHJldHVybiBuZXcgd3QoaSk7XG59XG5FZS5kZWxldGVEYXRhYmFzZSA9IChpKSA9PiBuZXcgUHJvbWlzZSgoZSwgdCkgPT4ge1xuICBjb25zdCBzID0gaW5kZXhlZERCLmRlbGV0ZURhdGFiYXNlKGAke1p9LSR7aX1gKTtcbiAgcy5hZGRFdmVudExpc3RlbmVyKFwic3VjY2Vzc1wiLCBlKSwgcy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgdCk7XG59KTtcbmNsYXNzIHd0IGV4dGVuZHMga2Uge1xuICBhc3luYyBvcGVuKCkge1xuICAgIGNvbnN0IGUgPSBpbmRleGVkREIub3BlbihgJHtafS0ke3RoaXMubG9jYWxlfWApO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgodCwgcykgPT4ge1xuICAgICAgZS5hZGRFdmVudExpc3RlbmVyKFwic3VjY2Vzc1wiLCAobykgPT4ge1xuICAgICAgICB2YXIgcjtcbiAgICAgICAgdGhpcy5kYiA9IChyID0gby50YXJnZXQpID09IG51bGwgPyB2b2lkIDAgOiByLnJlc3VsdCwgdCgpO1xuICAgICAgfSksIGUuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIHMpLCBlLmFkZEV2ZW50TGlzdGVuZXIoXCJ1cGdyYWRlbmVlZGVkXCIsIGFzeW5jIChvKSA9PiB7XG4gICAgICAgIHZhciBhO1xuICAgICAgICB0aGlzLmRiID0gKGEgPSBvLnRhcmdldCkgPT0gbnVsbCA/IHZvaWQgMCA6IGEucmVzdWx0LCB0aGlzLmRiLmNyZWF0ZU9iamVjdFN0b3JlKFwiY2F0ZWdvcnlcIiwgeyBrZXlQYXRoOiBcIm9yZGVyXCIgfSk7XG4gICAgICAgIGNvbnN0IHIgPSB0aGlzLmRiLmNyZWF0ZU9iamVjdFN0b3JlKFwiZW1vamlcIiwgeyBrZXlQYXRoOiBcImVtb2ppXCIgfSk7XG4gICAgICAgIHIuY3JlYXRlSW5kZXgoXCJjYXRlZ29yeVwiLCBcImdyb3VwXCIpLCByLmNyZWF0ZUluZGV4KFwidmVyc2lvblwiLCBcInZlcnNpb25cIiksIHRoaXMuZGIuY3JlYXRlT2JqZWN0U3RvcmUoXCJtZXRhXCIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgYXN5bmMgZGVsZXRlKCkge1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgICBjb25zdCBlID0gaW5kZXhlZERCLmRlbGV0ZURhdGFiYXNlKGAke1p9LSR7dGhpcy5sb2NhbGV9YCk7XG4gICAgYXdhaXQgdGhpcy53YWl0Rm9yUmVxdWVzdChlKTtcbiAgfVxuICBjbG9zZSgpIHtcbiAgICB0aGlzLmRiLmNsb3NlKCk7XG4gIH1cbiAgYXN5bmMgZ2V0RW1vamlDb3VudCgpIHtcbiAgICBjb25zdCB0ID0gdGhpcy5kYi50cmFuc2FjdGlvbihcImVtb2ppXCIsIFwicmVhZG9ubHlcIikub2JqZWN0U3RvcmUoXCJlbW9qaVwiKTtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMud2FpdEZvclJlcXVlc3QodC5jb3VudCgpKSkudGFyZ2V0LnJlc3VsdDtcbiAgfVxuICBhc3luYyBnZXRFdGFncygpIHtcbiAgICBjb25zdCB0ID0gdGhpcy5kYi50cmFuc2FjdGlvbihcIm1ldGFcIiwgXCJyZWFkb25seVwiKS5vYmplY3RTdG9yZShcIm1ldGFcIiksIFtzLCBvXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIHRoaXMud2FpdEZvclJlcXVlc3QodC5nZXQoXCJlbW9qaXNFdGFnXCIpKSxcbiAgICAgIHRoaXMud2FpdEZvclJlcXVlc3QodC5nZXQoXCJtZXNzYWdlc0V0YWdcIikpXG4gICAgXSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0b3JlZEVtb2ppc0V0YWc6IHMudGFyZ2V0LnJlc3VsdCxcbiAgICAgIHN0b3JlZE1lc3NhZ2VzRXRhZzogby50YXJnZXQucmVzdWx0XG4gICAgfTtcbiAgfVxuICBhc3luYyBzZXRNZXRhKGUpIHtcbiAgICBjb25zdCB0ID0gdGhpcy5kYi50cmFuc2FjdGlvbihcIm1ldGFcIiwgXCJyZWFkd3JpdGVcIiksIHMgPSB0Lm9iamVjdFN0b3JlKFwibWV0YVwiKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKG8pID0+IHtcbiAgICAgIHQub25jb21wbGV0ZSA9IG8sIE9iamVjdC5rZXlzKGUpLmZpbHRlcihCb29sZWFuKS5mb3JFYWNoKChhKSA9PiB7XG4gICAgICAgIHMucHV0KGVbYV0sIGEpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgYXN5bmMgZ2V0SGFzaCgpIHtcbiAgICBjb25zdCB0ID0gdGhpcy5kYi50cmFuc2FjdGlvbihcIm1ldGFcIiwgXCJyZWFkb25seVwiKS5vYmplY3RTdG9yZShcIm1ldGFcIik7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLndhaXRGb3JSZXF1ZXN0KHQuZ2V0KFwiaGFzaFwiKSkpLnRhcmdldC5yZXN1bHQ7XG4gIH1cbiAgYXN5bmMgaXNQb3B1bGF0ZWQoKSB7XG4gICAgY29uc3QgdCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oXCJjYXRlZ29yeVwiLCBcInJlYWRvbmx5XCIpLm9iamVjdFN0b3JlKFwiY2F0ZWdvcnlcIik7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLndhaXRGb3JSZXF1ZXN0KHQuY291bnQoKSkpLnRhcmdldC5yZXN1bHQgPiAwO1xuICB9XG4gIGFzeW5jIHBvcHVsYXRlKHtcbiAgICBncm91cHM6IGUsXG4gICAgZW1vamlzOiB0LFxuICAgIGVtb2ppc0V0YWc6IHMsXG4gICAgbWVzc2FnZXNFdGFnOiBvLFxuICAgIGhhc2g6IHJcbiAgfSkge1xuICAgIGF3YWl0IHRoaXMucmVtb3ZlQWxsT2JqZWN0cyhcImNhdGVnb3J5XCIsIFwiZW1vamlcIik7XG4gICAgY29uc3QgYSA9IFtcbiAgICAgIHRoaXMuYWRkT2JqZWN0cyhcImNhdGVnb3J5XCIsIGUpLFxuICAgICAgdGhpcy5hZGRPYmplY3RzKFwiZW1vamlcIiwgdCksXG4gICAgICB0aGlzLnNldE1ldGEoeyBlbW9qaXNFdGFnOiBzLCBtZXNzYWdlc0V0YWc6IG8sIGhhc2g6IHIgfSlcbiAgICBdO1xuICAgIGF3YWl0IFByb21pc2UuYWxsKGEpO1xuICB9XG4gIGFzeW5jIGdldENhdGVnb3JpZXMoZSkge1xuICAgIHZhciBhO1xuICAgIGNvbnN0IHMgPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFwiY2F0ZWdvcnlcIiwgXCJyZWFkb25seVwiKS5vYmplY3RTdG9yZShcImNhdGVnb3J5XCIpO1xuICAgIGxldCByID0gKGF3YWl0IHRoaXMud2FpdEZvclJlcXVlc3Qocy5nZXRBbGwoKSkpLnRhcmdldC5yZXN1bHQuZmlsdGVyKChuKSA9PiBuLmtleSAhPT0gXCJjb21wb25lbnRcIik7XG4gICAgaWYgKGUuc2hvd1JlY2VudHMgJiYgci51bnNoaWZ0KHsga2V5OiBcInJlY2VudHNcIiwgb3JkZXI6IC0xIH0pLCAoYSA9IGUuY3VzdG9tKSAhPSBudWxsICYmIGEubGVuZ3RoICYmIHIucHVzaCh7IGtleTogXCJjdXN0b21cIiwgb3JkZXI6IDEwIH0pLCBlLmNhdGVnb3JpZXMpIHtcbiAgICAgIGNvbnN0IG4gPSBlLmNhdGVnb3JpZXM7XG4gICAgICByID0gci5maWx0ZXIoKGwpID0+IG4uaW5jbHVkZXMobC5rZXkpKSwgci5zb3J0KChsLCBtKSA9PiBuLmluZGV4T2YobC5rZXkpIC0gbi5pbmRleE9mKG0ua2V5KSk7XG4gICAgfSBlbHNlXG4gICAgICByLnNvcnQoKG4sIGwpID0+IG4ub3JkZXIgLSBsLm9yZGVyKTtcbiAgICByZXR1cm4gcjtcbiAgfVxuICBhc3luYyBnZXRFbW9qaXMoZSwgdCkge1xuICAgIGNvbnN0IHIgPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFwiZW1vamlcIiwgXCJyZWFkb25seVwiKS5vYmplY3RTdG9yZShcImVtb2ppXCIpLmluZGV4KFwiY2F0ZWdvcnlcIiksIGwgPSAoYXdhaXQgdGhpcy53YWl0Rm9yUmVxdWVzdChyLmdldEFsbChlLm9yZGVyKSkpLnRhcmdldC5yZXN1bHQuZmlsdGVyKChtKSA9PiBtLnZlcnNpb24gPD0gdCkuc29ydCgobSwgZCkgPT4gbS5vcmRlciAhPSBudWxsICYmIGQub3JkZXIgIT0gbnVsbCA/IG0ub3JkZXIgLSBkLm9yZGVyIDogMCkubWFwKEUpO1xuICAgIHJldHVybiBNKGwsIHQpO1xuICB9XG4gIGFzeW5jIHNlYXJjaEVtb2ppcyhlLCB0LCBzLCBvKSB7XG4gICAgY29uc3QgciA9IFtdO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgoYSwgbikgPT4ge1xuICAgICAgY29uc3QgZCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oXCJlbW9qaVwiLCBcInJlYWRvbmx5XCIpLm9iamVjdFN0b3JlKFwiZW1vamlcIikub3BlbkN1cnNvcigpO1xuICAgICAgZC5hZGRFdmVudExpc3RlbmVyKFwic3VjY2Vzc1wiLCAoaCkgPT4ge1xuICAgICAgICB2YXIgY2U7XG4gICAgICAgIGNvbnN0IEggPSAoY2UgPSBoLnRhcmdldCkgPT0gbnVsbCA/IHZvaWQgMCA6IGNlLnJlc3VsdDtcbiAgICAgICAgaWYgKCFIKVxuICAgICAgICAgIHJldHVybiBhKFtcbiAgICAgICAgICAgIC4uLk0ociwgcyksXG4gICAgICAgICAgICAuLi50LmZpbHRlcigoemUpID0+IEIoemUsIGUpKVxuICAgICAgICAgIF0pO1xuICAgICAgICBjb25zdCBOID0gSC52YWx1ZTtcbiAgICAgICAgQihOLCBlLCBvKSAmJiBOLnZlcnNpb24gPD0gcyAmJiByLnB1c2goRShOKSksIEguY29udGludWUoKTtcbiAgICAgIH0pLCBkLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoaCkgPT4ge1xuICAgICAgICBuKGgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgYXN5bmMgd2FpdEZvclJlcXVlc3QoZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgodCwgcykgPT4ge1xuICAgICAgZS5vbnN1Y2Nlc3MgPSB0LCBlLm9uZXJyb3IgPSBzO1xuICAgIH0pO1xuICB9XG4gIHdpdGhUcmFuc2FjdGlvbihlLCB0ID0gXCJyZWFkd3JpdGVcIiwgcykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgobywgcikgPT4ge1xuICAgICAgY29uc3QgYSA9IHRoaXMuZGIudHJhbnNhY3Rpb24oZSwgdCk7XG4gICAgICBhLm9uY29tcGxldGUgPSBvLCBhLm9uZXJyb3IgPSByLCBzKGEpO1xuICAgIH0pO1xuICB9XG4gIGFzeW5jIHJlbW92ZUFsbE9iamVjdHMoLi4uZSkge1xuICAgIGNvbnN0IHQgPSB0aGlzLmRiLnRyYW5zYWN0aW9uKGUsIFwicmVhZHdyaXRlXCIpLCBzID0gZS5tYXAoKG8pID0+IHQub2JqZWN0U3RvcmUobykpO1xuICAgIGF3YWl0IFByb21pc2UuYWxsKHMubWFwKChvKSA9PiB0aGlzLndhaXRGb3JSZXF1ZXN0KG8uY2xlYXIoKSkpKTtcbiAgfVxuICBhc3luYyBhZGRPYmplY3RzKGUsIHQpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoVHJhbnNhY3Rpb24oZSwgXCJyZWFkd3JpdGVcIiwgKHMpID0+IHtcbiAgICAgIGNvbnN0IG8gPSBzLm9iamVjdFN0b3JlKGUpO1xuICAgICAgdC5mb3JFYWNoKChyKSA9PiB7XG4gICAgICAgIG8uYWRkKHIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbmNsYXNzIGJ0IHtcbn1cbmNvbnN0IEsgPSBcIlBpY01vOnJlY2VudHNcIjtcbmNsYXNzIHhlIGV4dGVuZHMgYnQge1xuICBjb25zdHJ1Y3RvcihlKSB7XG4gICAgc3VwZXIoKSwgdGhpcy5zdG9yYWdlID0gZTtcbiAgfVxuICBjbGVhcigpIHtcbiAgICB0aGlzLnN0b3JhZ2UucmVtb3ZlSXRlbShLKTtcbiAgfVxuICBnZXRSZWNlbnRzKGUpIHtcbiAgICB2YXIgdDtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoKHQgPSB0aGlzLnN0b3JhZ2UuZ2V0SXRlbShLKSkgIT0gbnVsbCA/IHQgOiBcIltdXCIpLnNsaWNlKDAsIGUpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgfVxuICBhZGRPclVwZGF0ZVJlY2VudChlLCB0KSB7XG4gICAgY29uc3QgcyA9IFtcbiAgICAgIGUsXG4gICAgICAuLi50aGlzLmdldFJlY2VudHModCkuZmlsdGVyKChvKSA9PiBvLmhleGNvZGUgIT09IGUuaGV4Y29kZSlcbiAgICBdLnNsaWNlKDAsIHQpO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnN0b3JhZ2Uuc2V0SXRlbShLLCBKU09OLnN0cmluZ2lmeShzKSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICBjb25zb2xlLndhcm4oXCJzdG9yYWdlIGlzIG5vdCBhdmFpbGFibGUsIHJlY2VudCBlbW9qaXMgd2lsbCBub3QgYmUgc2F2ZWRcIik7XG4gICAgfVxuICB9XG59XG5jbGFzcyBDdCBleHRlbmRzIHhlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIobG9jYWxTdG9yYWdlKTtcbiAgfVxufVxuY29uc3QganQgPSB7XG4gIGRhdGFTdG9yZTogRWUsXG4gIHRoZW1lOiBLZSxcbiAgYW5pbWF0ZTogITAsXG4gIHNob3dDYXRlZ29yeVRhYnM6ICEwLFxuICBzaG93UHJldmlldzogITAsXG4gIHNob3dSZWNlbnRzOiAhMCxcbiAgc2hvd1NlYXJjaDogITAsXG4gIHNob3dWYXJpYW50czogITAsXG4gIGVtb2ppc1BlclJvdzogOCxcbiAgdmlzaWJsZVJvd3M6IDYsXG4gIGVtb2ppVmVyc2lvbjogXCJhdXRvXCIsXG4gIGkxOG46IHl0LFxuICBsb2NhbGU6IFwiZW5cIixcbiAgbWF4UmVjZW50czogNTAsXG4gIGN1c3RvbTogW11cbn07XG5mdW5jdGlvbiBrdChpID0ge30pIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5qdCxcbiAgICAuLi5pLFxuICAgIHJlbmRlcmVyOiBpLnJlbmRlcmVyIHx8IG5ldyBwdCgpLFxuICAgIHJlY2VudHNQcm92aWRlcjogaS5yZWNlbnRzUHJvdmlkZXIgfHwgbmV3IEN0KClcbiAgfTtcbn1cbnZhciB2LCBiLCBWLCAkLCBlZTtcbmNsYXNzIGFlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgZih0aGlzLCBiKTtcbiAgICBmKHRoaXMsICQpO1xuICAgIGYodGhpcywgdiwgLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKSk7XG4gIH1cbiAgb24oZSwgdCwgcykge1xuICAgIHAodGhpcywgJCwgZWUpLmNhbGwodGhpcywgZSwgdCwgcyk7XG4gIH1cbiAgb25jZShlLCB0LCBzKSB7XG4gICAgcCh0aGlzLCAkLCBlZSkuY2FsbCh0aGlzLCBlLCB0LCBzLCAhMCk7XG4gIH1cbiAgb2ZmKGUsIHQpIHtcbiAgICBjb25zdCBzID0gcCh0aGlzLCBiLCBWKS5jYWxsKHRoaXMsIGUpO1xuICAgIHkodGhpcywgdikuc2V0KGUsIHMuZmlsdGVyKChvKSA9PiBvLmhhbmRsZXIgIT09IHQpKTtcbiAgfVxuICBlbWl0KGUsIC4uLnQpIHtcbiAgICBwKHRoaXMsIGIsIFYpLmNhbGwodGhpcywgZSkuZm9yRWFjaCgobykgPT4ge1xuICAgICAgby5oYW5kbGVyLmFwcGx5KG8uY29udGV4dCwgdCksIG8ub25jZSAmJiB0aGlzLm9mZihlLCBvLmhhbmRsZXIpO1xuICAgIH0pO1xuICB9XG4gIHJlbW92ZUFsbCgpIHtcbiAgICB5KHRoaXMsIHYpLmNsZWFyKCk7XG4gIH1cbn1cbnYgPSBuZXcgV2Vha01hcCgpLCBiID0gbmV3IFdlYWtTZXQoKSwgViA9IGZ1bmN0aW9uKGUpIHtcbiAgcmV0dXJuIHkodGhpcywgdikuaGFzKGUpIHx8IHkodGhpcywgdikuc2V0KGUsIFtdKSwgeSh0aGlzLCB2KS5nZXQoZSk7XG59LCAkID0gbmV3IFdlYWtTZXQoKSwgZWUgPSBmdW5jdGlvbihlLCB0LCBzLCBvID0gITEpIHtcbiAgcCh0aGlzLCBiLCBWKS5jYWxsKHRoaXMsIGUpLnB1c2goeyBjb250ZXh0OiBzLCBoYW5kbGVyOiB0LCBvbmNlOiBvIH0pO1xufTtcbmNvbnN0IEV0ID0ge1xuICBpbmplY3RTdHlsZXM6ICEwXG59O1xuY2xhc3MgeHQgZXh0ZW5kcyBhZSB7XG59XG5jbGFzcyBTdCBleHRlbmRzIGFlIHtcbn1cbmNvbnN0IHRlID0gZyhcbiAgXCJlbW9qaUNhdGVnb3J5XCIsXG4gIFwiY2F0ZWdvcnlOYW1lXCIsXG4gIFwibm9SZWNlbnRzXCIsXG4gIFwicmVjZW50RW1vamlzXCJcbik7XG5jbGFzcyBuZSBleHRlbmRzIGMge1xuICBjb25zdHJ1Y3Rvcih7IHRlbXBsYXRlOiBlLCBjYXRlZ29yeTogdCwgc2hvd1ZhcmlhbnRzOiBzLCBsYXp5TG9hZGVyOiBvIH0pIHtcbiAgICBzdXBlcih7IHRlbXBsYXRlOiBlLCBjbGFzc2VzOiB0ZSB9KSwgdGhpcy5iYXNlVUlFbGVtZW50cyA9IHtcbiAgICAgIGNhdGVnb3J5TmFtZTogYy5ieUNsYXNzKHRlLmNhdGVnb3J5TmFtZSlcbiAgICB9LCB0aGlzLmNhdGVnb3J5ID0gdCwgdGhpcy5zaG93VmFyaWFudHMgPSBzLCB0aGlzLmxhenlMb2FkZXIgPSBvO1xuICB9XG4gIHNldEFjdGl2ZShlLCB0LCBzKSB7XG4gICAgdGhpcy5lbW9qaUNvbnRhaW5lci5zZXRBY3RpdmUoZSwgdCwgcyk7XG4gIH1cbn1cbmNvbnN0IFB0ID0gbmV3IHUoKHsgY2xhc3NlczogaSwgZW1vamk6IGUgfSkgPT4gYFxuICA8YnV0dG9uXG4gICAgdHlwZT1cImJ1dHRvblwiXG4gICAgY2xhc3M9XCIke2kuZW1vamlCdXR0b259XCJcbiAgICB0aXRsZT1cIiR7ZS5sYWJlbH1cIlxuICAgIGRhdGEtZW1vamk9XCIke2UuZW1vaml9XCJcbiAgICB0YWJpbmRleD1cIi0xXCI+XG4gICAgPGRpdiBkYXRhLXBsYWNlaG9sZGVyPVwiZW1vamlDb250ZW50XCI+PC9kaXY+XG4gIDwvYnV0dG9uPlxuYCksIHp0ID0gZyhcImVtb2ppQnV0dG9uXCIpO1xuY2xhc3MgU2UgZXh0ZW5kcyBjIHtcbiAgY29uc3RydWN0b3IoeyBlbW9qaTogZSwgbGF6eUxvYWRlcjogdCwgY2F0ZWdvcnk6IHMgfSkge1xuICAgIHN1cGVyKHsgdGVtcGxhdGU6IFB0LCBjbGFzc2VzOiB6dCB9KSwgdGhpcy5lbW9qaSA9IGUsIHRoaXMubGF6eUxvYWRlciA9IHQsIHRoaXMuY2F0ZWdvcnkgPSBzO1xuICB9XG4gIGluaXRpYWxpemUoKSB7XG4gICAgdGhpcy51aUV2ZW50cyA9IFtcbiAgICAgIGMudWlFdmVudChcImZvY3VzXCIsIHRoaXMuaGFuZGxlRm9jdXMpXG4gICAgXSwgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICB9XG4gIGhhbmRsZUZvY3VzKCkge1xuICAgIHRoaXMuY2F0ZWdvcnkgJiYgdGhpcy5ldmVudHMuZW1pdChcImZvY3VzOmNoYW5nZVwiLCB0aGlzLmNhdGVnb3J5KTtcbiAgfVxuICBhY3RpdmF0ZUZvY3VzKGUpIHtcbiAgICB0aGlzLmVsLnRhYkluZGV4ID0gMCwgZSAmJiB0aGlzLmVsLmZvY3VzKCk7XG4gIH1cbiAgZGVhY3RpdmF0ZUZvY3VzKCkge1xuICAgIHRoaXMuZWwudGFiSW5kZXggPSAtMTtcbiAgfVxuICByZW5kZXJTeW5jKCkge1xuICAgIHJldHVybiBzdXBlci5yZW5kZXJTeW5jKHtcbiAgICAgIGVtb2ppOiB0aGlzLmVtb2ppLFxuICAgICAgZW1vamlDb250ZW50OiB0aGlzLnJlbmRlcmVyLmRvUmVuZGVyKHRoaXMuZW1vamksIHRoaXMubGF6eUxvYWRlcilcbiAgICB9KTtcbiAgfVxufVxuY2xhc3MgJHQge1xuICBjb25zdHJ1Y3RvcihlLCB0LCBzID0gMCwgbyA9IDAsIHIgPSAhMSkge1xuICAgIHRoaXMuZXZlbnRzID0gbmV3IGFlKCksIHRoaXMua2V5SGFuZGxlcnMgPSB7XG4gICAgICBBcnJvd0xlZnQ6IHRoaXMuZm9jdXNQcmV2aW91cy5iaW5kKHRoaXMpLFxuICAgICAgQXJyb3dSaWdodDogdGhpcy5mb2N1c05leHQuYmluZCh0aGlzKSxcbiAgICAgIEFycm93VXA6IHRoaXMuZm9jdXNVcC5iaW5kKHRoaXMpLFxuICAgICAgQXJyb3dEb3duOiB0aGlzLmZvY3VzRG93bi5iaW5kKHRoaXMpXG4gICAgfSwgdGhpcy5yb3dDb3VudCA9IE1hdGguY2VpbCh0IC8gZSksIHRoaXMuY29sdW1uQ291bnQgPSBlLCB0aGlzLmZvY3VzZWRSb3cgPSBzLCB0aGlzLmZvY3VzZWRDb2x1bW4gPSBvLCB0aGlzLmVtb2ppQ291bnQgPSB0LCB0aGlzLndyYXAgPSByLCB0aGlzLmhhbmRsZUtleURvd24gPSB0aGlzLmhhbmRsZUtleURvd24uYmluZCh0aGlzKTtcbiAgfVxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZXZlbnRzLnJlbW92ZUFsbCgpO1xuICB9XG4gIG9uKGUsIHQpIHtcbiAgICB0aGlzLmV2ZW50cy5vbihlLCB0KTtcbiAgfVxuICBoYW5kbGVLZXlEb3duKGUpIHtcbiAgICBlLmtleSBpbiB0aGlzLmtleUhhbmRsZXJzICYmIChlLnByZXZlbnREZWZhdWx0KCksIHRoaXMua2V5SGFuZGxlcnNbZS5rZXldKCkpO1xuICB9XG4gIHNldENlbGwoZSwgdCwgcyA9ICEwKSB7XG4gICAgY29uc3QgbyA9IHRoaXMuZ2V0SW5kZXgoKTtcbiAgICB0aGlzLmZvY3VzZWRSb3cgPSBlLCB0ICE9PSB2b2lkIDAgJiYgKHRoaXMuZm9jdXNlZENvbHVtbiA9IE1hdGgubWluKHRoaXMuY29sdW1uQ291bnQsIHQpKSwgKHRoaXMuZm9jdXNlZFJvdyA+PSB0aGlzLnJvd0NvdW50IHx8IHRoaXMuZ2V0SW5kZXgoKSA+PSB0aGlzLmVtb2ppQ291bnQpICYmICh0aGlzLmZvY3VzZWRSb3cgPSB0aGlzLnJvd0NvdW50IC0gMSwgdGhpcy5mb2N1c2VkQ29sdW1uID0gdGhpcy5lbW9qaUNvdW50ICUgdGhpcy5jb2x1bW5Db3VudCAtIDEpLCB0aGlzLmV2ZW50cy5lbWl0KFwiZm9jdXM6Y2hhbmdlXCIsIHsgZnJvbTogbywgdG86IHRoaXMuZ2V0SW5kZXgoKSwgcGVyZm9ybUZvY3VzOiBzIH0pO1xuICB9XG4gIHNldEZvY3VzZWRJbmRleChlLCB0ID0gITApIHtcbiAgICBjb25zdCBzID0gTWF0aC5mbG9vcihlIC8gdGhpcy5jb2x1bW5Db3VudCksIG8gPSBlICUgdGhpcy5jb2x1bW5Db3VudDtcbiAgICB0aGlzLnNldENlbGwocywgbywgdCk7XG4gIH1cbiAgZm9jdXNOZXh0KCkge1xuICAgIHRoaXMuZm9jdXNlZENvbHVtbiA8IHRoaXMuY29sdW1uQ291bnQgLSAxICYmIHRoaXMuZ2V0SW5kZXgoKSA8IHRoaXMuZW1vamlDb3VudCAtIDEgPyB0aGlzLnNldENlbGwodGhpcy5mb2N1c2VkUm93LCB0aGlzLmZvY3VzZWRDb2x1bW4gKyAxKSA6IHRoaXMuZm9jdXNlZFJvdyA8IHRoaXMucm93Q291bnQgLSAxID8gdGhpcy5zZXRDZWxsKHRoaXMuZm9jdXNlZFJvdyArIDEsIDApIDogdGhpcy53cmFwID8gdGhpcy5zZXRDZWxsKDAsIDApIDogdGhpcy5ldmVudHMuZW1pdChcImZvY3VzOm92ZXJmbG93XCIsIDApO1xuICB9XG4gIGZvY3VzUHJldmlvdXMoKSB7XG4gICAgdGhpcy5mb2N1c2VkQ29sdW1uID4gMCA/IHRoaXMuc2V0Q2VsbCh0aGlzLmZvY3VzZWRSb3csIHRoaXMuZm9jdXNlZENvbHVtbiAtIDEpIDogdGhpcy5mb2N1c2VkUm93ID4gMCA/IHRoaXMuc2V0Q2VsbCh0aGlzLmZvY3VzZWRSb3cgLSAxLCB0aGlzLmNvbHVtbkNvdW50IC0gMSkgOiB0aGlzLndyYXAgPyB0aGlzLnNldENlbGwodGhpcy5yb3dDb3VudCAtIDEsIHRoaXMuY29sdW1uQ291bnQgLSAxKSA6IHRoaXMuZXZlbnRzLmVtaXQoXCJmb2N1czp1bmRlcmZsb3dcIiwgdGhpcy5jb2x1bW5Db3VudCAtIDEpO1xuICB9XG4gIGZvY3VzVXAoKSB7XG4gICAgdGhpcy5mb2N1c2VkUm93ID4gMCA/IHRoaXMuc2V0Q2VsbCh0aGlzLmZvY3VzZWRSb3cgLSAxLCB0aGlzLmZvY3VzZWRDb2x1bW4pIDogdGhpcy5ldmVudHMuZW1pdChcImZvY3VzOnVuZGVyZmxvd1wiLCB0aGlzLmZvY3VzZWRDb2x1bW4pO1xuICB9XG4gIGZvY3VzRG93bigpIHtcbiAgICB0aGlzLmZvY3VzZWRSb3cgPCB0aGlzLnJvd0NvdW50IC0gMSA/IHRoaXMuc2V0Q2VsbCh0aGlzLmZvY3VzZWRSb3cgKyAxLCB0aGlzLmZvY3VzZWRDb2x1bW4pIDogdGhpcy5ldmVudHMuZW1pdChcImZvY3VzOm92ZXJmbG93XCIsIHRoaXMuZm9jdXNlZENvbHVtbik7XG4gIH1cbiAgZm9jdXNUb0luZGV4KGUpIHtcbiAgICB0aGlzLnNldENlbGwoTWF0aC5mbG9vcihlIC8gdGhpcy5jb2x1bW5Db3VudCksIGUgJSB0aGlzLmNvbHVtbkNvdW50KTtcbiAgfVxuICBnZXRJbmRleCgpIHtcbiAgICByZXR1cm4gdGhpcy5mb2N1c2VkUm93ICogdGhpcy5jb2x1bW5Db3VudCArIHRoaXMuZm9jdXNlZENvbHVtbjtcbiAgfVxuICBnZXRDZWxsKCkge1xuICAgIHJldHVybiB7IHJvdzogdGhpcy5mb2N1c2VkUm93LCBjb2x1bW46IHRoaXMuZm9jdXNlZENvbHVtbiB9O1xuICB9XG4gIGdldFJvd0NvdW50KCkge1xuICAgIHJldHVybiB0aGlzLnJvd0NvdW50O1xuICB9XG59XG5jb25zdCBMdCA9IG5ldyB1KCh7IGNsYXNzZXM6IGkgfSkgPT4gYFxuICA8ZGl2IGNsYXNzPVwiJHtpLmVtb2ppQ29udGFpbmVyfVwiPlxuICAgIDxkaXYgZGF0YS1wbGFjZWhvbGRlcj1cImVtb2ppc1wiPjwvZGl2PlxuICA8L2Rpdj5cbmApLCBGdCA9IGcoXCJlbW9qaUNvbnRhaW5lclwiKTtcbmNsYXNzIEYgZXh0ZW5kcyBjIHtcbiAgY29uc3RydWN0b3IoeyBlbW9qaXM6IGUsIHNob3dWYXJpYW50czogdCwgcHJldmlldzogcyA9ICEwLCBsYXp5TG9hZGVyOiBvLCBjYXRlZ29yeTogciwgZnVsbEhlaWdodDogYSA9ICExIH0pIHtcbiAgICBzdXBlcih7IHRlbXBsYXRlOiBMdCwgY2xhc3NlczogRnQgfSksIHRoaXMuZnVsbEhlaWdodCA9ICExLCB0aGlzLnNob3dWYXJpYW50cyA9IHQsIHRoaXMubGF6eUxvYWRlciA9IG8sIHRoaXMucHJldmlldyA9IHMsIHRoaXMuZW1vamlzID0gZSwgdGhpcy5jYXRlZ29yeSA9IHIsIHRoaXMuZnVsbEhlaWdodCA9IGEsIHRoaXMuc2V0Rm9jdXMgPSB0aGlzLnNldEZvY3VzLmJpbmQodGhpcyksIHRoaXMudHJpZ2dlck5leHRDYXRlZ29yeSA9IHRoaXMudHJpZ2dlck5leHRDYXRlZ29yeS5iaW5kKHRoaXMpLCB0aGlzLnRyaWdnZXJQcmV2aW91c0NhdGVnb3J5ID0gdGhpcy50cmlnZ2VyUHJldmlvdXNDYXRlZ29yeS5iaW5kKHRoaXMpO1xuICB9XG4gIGluaXRpYWxpemUoKSB7XG4gICAgdGhpcy5ncmlkID0gbmV3ICR0KHRoaXMub3B0aW9ucy5lbW9qaXNQZXJSb3csIHRoaXMuZW1vamlDb3VudCwgMCwgMCwgIXRoaXMuY2F0ZWdvcnkpLCB0aGlzLmdyaWQub24oXCJmb2N1czpjaGFuZ2VcIiwgdGhpcy5zZXRGb2N1cyksIHRoaXMuZ3JpZC5vbihcImZvY3VzOm92ZXJmbG93XCIsIHRoaXMudHJpZ2dlck5leHRDYXRlZ29yeSksIHRoaXMuZ3JpZC5vbihcImZvY3VzOnVuZGVyZmxvd1wiLCB0aGlzLnRyaWdnZXJQcmV2aW91c0NhdGVnb3J5KSwgdGhpcy51aUV2ZW50cyA9IFtcbiAgICAgIGMudWlFdmVudChcImNsaWNrXCIsIHRoaXMuc2VsZWN0RW1vamkpLFxuICAgICAgYy51aUV2ZW50KFwia2V5ZG93blwiLCB0aGlzLmdyaWQuaGFuZGxlS2V5RG93bilcbiAgICBdLCB0aGlzLnByZXZpZXcgJiYgdGhpcy51aUV2ZW50cy5wdXNoKFxuICAgICAgYy51aUV2ZW50KFwibW91c2VvdmVyXCIsIHRoaXMuc2hvd1ByZXZpZXcpLFxuICAgICAgYy51aUV2ZW50KFwibW91c2VvdXRcIiwgdGhpcy5oaWRlUHJldmlldyksXG4gICAgICBjLnVpRXZlbnQoXCJmb2N1c1wiLCB0aGlzLnNob3dQcmV2aWV3LCB7IGNhcHR1cmU6ICEwIH0pLFxuICAgICAgYy51aUV2ZW50KFwiYmx1clwiLCB0aGlzLmhpZGVQcmV2aWV3LCB7IGNhcHR1cmU6ICEwIH0pXG4gICAgKSwgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICB9XG4gIHNldEZvY3VzZWRWaWV3KGUsIHQpIHtcbiAgICBpZiAoISFlKVxuICAgICAgaWYgKHR5cGVvZiBlID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgY29uc3QgcyA9IHRoaXMuZW1vamlzLmZpbmRJbmRleCgobykgPT4gby5lbW9qaSA9PT0gZSk7XG4gICAgICAgIHRoaXMuZ3JpZC5zZXRGb2N1c2VkSW5kZXgocywgITEpLCBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB2YXIgbiwgbCwgbSwgZDtcbiAgICAgICAgICBjb25zdCBvID0gdGhpcy5lbW9qaVZpZXdzW3NdLmVsO1xuICAgICAgICAgIG8uc2Nyb2xsSW50b1ZpZXcoKTtcbiAgICAgICAgICBjb25zdCByID0gKG4gPSBvLnBhcmVudEVsZW1lbnQpID09IG51bGwgPyB2b2lkIDAgOiBuLnByZXZpb3VzRWxlbWVudFNpYmxpbmcsIGEgPSAobSA9IChsID0gby5wYXJlbnRFbGVtZW50KSA9PSBudWxsID8gdm9pZCAwIDogbC5wYXJlbnRFbGVtZW50KSA9PSBudWxsID8gdm9pZCAwIDogbS5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgIGEuc2Nyb2xsVG9wIC09IChkID0gciA9PSBudWxsID8gdm9pZCAwIDogci5vZmZzZXRIZWlnaHQpICE9IG51bGwgPyBkIDogMDtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2VcbiAgICAgICAgZS5yb3cgPT09IFwiZmlyc3RcIiB8fCBlLnJvdyA9PT0gMCA/IHRoaXMuZ3JpZC5zZXRDZWxsKDAsIGUub2Zmc2V0LCB0KSA6IGUucm93ID09PSBcImxhc3RcIiAmJiB0aGlzLmdyaWQuc2V0Q2VsbCh0aGlzLmdyaWQuZ2V0Um93Q291bnQoKSAtIDEsIGUub2Zmc2V0LCB0KTtcbiAgfVxuICBzZXRBY3RpdmUoZSwgdCwgcykge1xuICAgIHZhciBvO1xuICAgIGUgPyB0aGlzLnNldEZvY3VzZWRWaWV3KHQsIHMpIDogKG8gPSB0aGlzLmVtb2ppVmlld3NbdGhpcy5ncmlkLmdldEluZGV4KCldKSA9PSBudWxsIHx8IG8uZGVhY3RpdmF0ZUZvY3VzKCk7XG4gIH1cbiAgcmVuZGVyU3luYygpIHtcbiAgICByZXR1cm4gdGhpcy5lbW9qaVZpZXdzID0gdGhpcy5lbW9qaXMubWFwKFxuICAgICAgKGUpID0+IHRoaXMudmlld0ZhY3RvcnkuY3JlYXRlKFNlLCB7XG4gICAgICAgIGVtb2ppOiBlLFxuICAgICAgICBjYXRlZ29yeTogdGhpcy5jYXRlZ29yeSxcbiAgICAgICAgbGF6eUxvYWRlcjogdGhpcy5sYXp5TG9hZGVyLFxuICAgICAgICByZW5kZXJlcjogdGhpcy5yZW5kZXJlclxuICAgICAgfSlcbiAgICApLCB0aGlzLmVtb2ppRWxlbWVudHMgPSB0aGlzLmVtb2ppVmlld3MubWFwKChlKSA9PiBlLnJlbmRlclN5bmMoKSksIHN1cGVyLnJlbmRlclN5bmMoe1xuICAgICAgZW1vamlzOiB0aGlzLmVtb2ppRWxlbWVudHMsXG4gICAgICBpMThuOiB0aGlzLmkxOG5cbiAgICB9KTtcbiAgfVxuICBkZXN0cm95KCkge1xuICAgIHN1cGVyLmRlc3Ryb3koKSwgdGhpcy5lbW9qaVZpZXdzLmZvckVhY2goKGUpID0+IGUuZGVzdHJveSgpKSwgdGhpcy5ncmlkLmRlc3Ryb3koKTtcbiAgfVxuICB0cmlnZ2VyUHJldmlvdXNDYXRlZ29yeShlKSB7XG4gICAgdGhpcy5ldmVudHMuZW1pdChcImNhdGVnb3J5OnByZXZpb3VzXCIsIGUpO1xuICB9XG4gIHRyaWdnZXJOZXh0Q2F0ZWdvcnkoZSkge1xuICAgIHRoaXMuY2F0ZWdvcnkgJiYgdGhpcy5ldmVudHMuZW1pdChcImNhdGVnb3J5Om5leHRcIiwgZSk7XG4gIH1cbiAgc2V0Rm9jdXMoeyBmcm9tOiBlLCB0bzogdCwgcGVyZm9ybUZvY3VzOiBzIH0pIHtcbiAgICB2YXIgbywgcjtcbiAgICAobyA9IHRoaXMuZW1vamlWaWV3c1tlXSkgPT0gbnVsbCB8fCBvLmRlYWN0aXZhdGVGb2N1cygpLCAociA9IHRoaXMuZW1vamlWaWV3c1t0XSkgPT0gbnVsbCB8fCByLmFjdGl2YXRlRm9jdXMocyk7XG4gIH1cbiAgc2VsZWN0RW1vamkoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgY29uc3QgdCA9IFUoZSwgdGhpcy5lbW9qaXMpO1xuICAgIHQgJiYgdGhpcy5ldmVudHMuZW1pdChcImVtb2ppOnNlbGVjdFwiLCB7XG4gICAgICBlbW9qaTogdCxcbiAgICAgIHNob3dWYXJpYW50czogdGhpcy5zaG93VmFyaWFudHNcbiAgICB9KTtcbiAgfVxuICBzaG93UHJldmlldyhlKSB7XG4gICAgY29uc3QgcyA9IGUudGFyZ2V0LmNsb3Nlc3QoXCJidXR0b25cIiksIG8gPSBzID09IG51bGwgPyB2b2lkIDAgOiBzLmZpcnN0RWxlbWVudENoaWxkLCByID0gVShlLCB0aGlzLmVtb2ppcyk7XG4gICAgciAmJiB0aGlzLmV2ZW50cy5lbWl0KFwicHJldmlldzpzaG93XCIsIHIsIG8gPT0gbnVsbCA/IHZvaWQgMCA6IG8uY2xvbmVOb2RlKCEwKSk7XG4gIH1cbiAgaGlkZVByZXZpZXcoZSkge1xuICAgIFUoZSwgdGhpcy5lbW9qaXMpICYmIHRoaXMuZXZlbnRzLmVtaXQoXCJwcmV2aWV3OmhpZGVcIik7XG4gIH1cbiAgZ2V0IGVtb2ppQ291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1vamlzLmxlbmd0aDtcbiAgfVxufVxuY29uc3QgQXQgPSBuZXcgdSgoeyBjbGFzc2VzOiBpLCBjYXRlZ29yeTogZSwgcGlja2VySWQ6IHQsIGljb246IHMsIGkxOG46IG8gfSkgPT4gYFxuICA8c2VjdGlvbiBjbGFzcz1cIiR7aS5lbW9qaUNhdGVnb3J5fVwiIHJvbGU9XCJ0YWJwYW5lbFwiIGFyaWEtbGFiZWxsZWRieT1cIiR7dH0tY2F0ZWdvcnktJHtlLmtleX1cIj5cbiAgICA8aDMgZGF0YS1jYXRlZ29yeT1cIiR7ZS5rZXl9XCIgY2xhc3M9XCIke2kuY2F0ZWdvcnlOYW1lfVwiPlxuICAgICAgPGkgZGF0YS1pY29uPVwiJHtzfVwiPjwvaT5cbiAgICAgICR7by5nZXQoYGNhdGVnb3JpZXMuJHtlLmtleX1gLCBlLm1lc3NhZ2UgfHwgZS5rZXkpfVxuICAgIDwvaDM+XG4gICAgPGRpdiBkYXRhLXZpZXc9XCJlbW9qaXNcIiBkYXRhLXJlbmRlcj1cInN5bmNcIj48L2Rpdj5cbiAgPC9zZWN0aW9uPlxuYCk7XG5jbGFzcyBJdCBleHRlbmRzIG5lIHtcbiAgY29uc3RydWN0b3IoeyBjYXRlZ29yeTogZSwgc2hvd1ZhcmlhbnRzOiB0LCBsYXp5TG9hZGVyOiBzLCBlbW9qaVZlcnNpb246IG8gfSkge1xuICAgIHN1cGVyKHsgY2F0ZWdvcnk6IGUsIHNob3dWYXJpYW50czogdCwgbGF6eUxvYWRlcjogcywgdGVtcGxhdGU6IEF0IH0pLCB0aGlzLnNob3dWYXJpYW50cyA9IHQsIHRoaXMubGF6eUxvYWRlciA9IHMsIHRoaXMuZW1vamlWZXJzaW9uID0gbztcbiAgfVxuICBpbml0aWFsaXplKCkge1xuICAgIHRoaXMudWlFbGVtZW50cyA9IHsgLi4udGhpcy5iYXNlVUlFbGVtZW50cyB9LCBzdXBlci5pbml0aWFsaXplKCk7XG4gIH1cbiAgYXN5bmMgcmVuZGVyKCkge1xuICAgIGF3YWl0IHRoaXMuZW1vamlEYXRhUHJvbWlzZTtcbiAgICBjb25zdCBlID0gYXdhaXQgdGhpcy5lbW9qaURhdGEuZ2V0RW1vamlzKHRoaXMuY2F0ZWdvcnksIHRoaXMuZW1vamlWZXJzaW9uKTtcbiAgICByZXR1cm4gdGhpcy5lbW9qaUNvbnRhaW5lciA9IHRoaXMudmlld0ZhY3RvcnkuY3JlYXRlKEYsIHtcbiAgICAgIGVtb2ppczogZSxcbiAgICAgIHNob3dWYXJpYW50czogdGhpcy5zaG93VmFyaWFudHMsXG4gICAgICBsYXp5TG9hZGVyOiB0aGlzLmxhenlMb2FkZXIsXG4gICAgICBjYXRlZ29yeTogdGhpcy5jYXRlZ29yeS5rZXlcbiAgICB9KSwgc3VwZXIucmVuZGVyKHtcbiAgICAgIGNhdGVnb3J5OiB0aGlzLmNhdGVnb3J5LFxuICAgICAgZW1vamlzOiB0aGlzLmVtb2ppQ29udGFpbmVyLFxuICAgICAgZW1vamlDb3VudDogZS5sZW5ndGgsXG4gICAgICBpY29uOiBEW3RoaXMuY2F0ZWdvcnkua2V5XVxuICAgIH0pO1xuICB9XG59XG5jbGFzcyBUdCBleHRlbmRzIEYge1xuICBjb25zdHJ1Y3Rvcih7IGNhdGVnb3J5OiBlLCBlbW9qaXM6IHQsIHByZXZpZXc6IHMgPSAhMCwgbGF6eUxvYWRlcjogbyB9KSB7XG4gICAgc3VwZXIoeyBjYXRlZ29yeTogZSwgZW1vamlzOiB0LCBzaG93VmFyaWFudHM6ICExLCBwcmV2aWV3OiBzLCBsYXp5TG9hZGVyOiBvIH0pO1xuICB9XG4gIGFzeW5jIGFkZE9yVXBkYXRlKGUpIHtcbiAgICBjb25zdCB0ID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1lbW9qaT1cIiR7ZS5lbW9qaX1cIl1gKTtcbiAgICB0ICYmICh0aGlzLmVsLnJlbW92ZUNoaWxkKHQpLCB0aGlzLmVtb2ppcyA9IHRoaXMuZW1vamlzLmZpbHRlcigobykgPT4gbyAhPT0gZSkpO1xuICAgIGNvbnN0IHMgPSB0aGlzLnZpZXdGYWN0b3J5LmNyZWF0ZShTZSwgeyBlbW9qaTogZSB9KTtcbiAgICBpZiAodGhpcy5lbC5pbnNlcnRCZWZvcmUocy5yZW5kZXJTeW5jKCksIHRoaXMuZWwuZmlyc3RDaGlsZCksIHRoaXMuZW1vamlzID0gW1xuICAgICAgZSxcbiAgICAgIC4uLnRoaXMuZW1vamlzLmZpbHRlcigobykgPT4gbyAhPT0gZSlcbiAgICBdLCB0aGlzLmVtb2ppcy5sZW5ndGggPiB0aGlzLm9wdGlvbnMubWF4UmVjZW50cykge1xuICAgICAgdGhpcy5lbW9qaXMgPSB0aGlzLmVtb2ppcy5zbGljZSgwLCB0aGlzLm9wdGlvbnMubWF4UmVjZW50cyk7XG4gICAgICBjb25zdCBvID0gdGhpcy5lbC5jaGlsZEVsZW1lbnRDb3VudCAtIHRoaXMub3B0aW9ucy5tYXhSZWNlbnRzO1xuICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCBvOyByKyspXG4gICAgICAgIHRoaXMuZWwubGFzdEVsZW1lbnRDaGlsZCAmJiB0aGlzLmVsLnJlbW92ZUNoaWxkKHRoaXMuZWwubGFzdEVsZW1lbnRDaGlsZCk7XG4gICAgfVxuICB9XG59XG5jb25zdCBSdCA9IG5ldyB1KCh7IGVtb2ppQ291bnQ6IGksIGNsYXNzZXM6IGUsIGNhdGVnb3J5OiB0LCBwaWNrZXJJZDogcywgaWNvbjogbywgaTE4bjogciB9KSA9PiBgXG4gIDxzZWN0aW9uIGNsYXNzPVwiJHtlLmVtb2ppQ2F0ZWdvcnl9XCIgcm9sZT1cInRhYnBhbmVsXCIgYXJpYS1sYWJlbGxlZGJ5PVwiJHtzfS1jYXRlZ29yeS0ke3Qua2V5fVwiPlxuICAgIDxoMyBkYXRhLWNhdGVnb3J5PVwiJHt0LmtleX1cIiBjbGFzcz1cIiR7ZS5jYXRlZ29yeU5hbWV9XCI+XG4gICAgICA8aSBkYXRhLWljb249XCIke299XCI+PC9pPlxuICAgICAgJHtyLmdldChgY2F0ZWdvcmllcy4ke3Qua2V5fWAsIHQubWVzc2FnZSB8fCB0LmtleSl9XG4gICAgPC9oMz5cbiAgICA8ZGl2IGRhdGEtZW1wdHk9XCIke2kgPT09IDB9XCIgY2xhc3M9XCIke2UucmVjZW50RW1vamlzfVwiPlxuICAgICAgPGRpdiBkYXRhLXZpZXc9XCJlbW9qaXNcIiBkYXRhLXJlbmRlcj1cInN5bmNcIj48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiJHtlLm5vUmVjZW50c31cIj5cbiAgICAgICR7ci5nZXQoXCJyZWNlbnRzLm5vbmVcIil9XG4gICAgPC9kaXY+XG4gIDwvc2VjdGlvbj5cbmAsIHsgbW9kZTogXCJhc3luY1wiIH0pO1xuY2xhc3MgVnQgZXh0ZW5kcyBuZSB7XG4gIGNvbnN0cnVjdG9yKHsgY2F0ZWdvcnk6IGUsIGxhenlMb2FkZXI6IHQsIHByb3ZpZGVyOiBzIH0pIHtcbiAgICBzdXBlcih7IGNhdGVnb3J5OiBlLCBzaG93VmFyaWFudHM6ICExLCBsYXp5TG9hZGVyOiB0LCB0ZW1wbGF0ZTogUnQgfSksIHRoaXMucHJvdmlkZXIgPSBzO1xuICB9XG4gIGluaXRpYWxpemUoKSB7XG4gICAgdGhpcy51aUVsZW1lbnRzID0ge1xuICAgICAgLi4udGhpcy5iYXNlVUlFbGVtZW50cyxcbiAgICAgIHJlY2VudHM6IGMuYnlDbGFzcyh0ZS5yZWNlbnRFbW9qaXMpXG4gICAgfSwgdGhpcy5hcHBFdmVudHMgPSB7XG4gICAgICBcInJlY2VudDphZGRcIjogdGhpcy5hZGRSZWNlbnRcbiAgICB9LCBzdXBlci5pbml0aWFsaXplKCk7XG4gIH1cbiAgYXN5bmMgYWRkUmVjZW50KGUpIHtcbiAgICBhd2FpdCB0aGlzLmVtb2ppQ29udGFpbmVyLmFkZE9yVXBkYXRlKGUpLCB0aGlzLnVpLnJlY2VudHMuZGF0YXNldC5lbXB0eSA9IFwiZmFsc2VcIjtcbiAgfVxuICBhc3luYyByZW5kZXIoKSB7XG4gICAgdmFyIHQ7XG4gICAgY29uc3QgZSA9ICh0ID0gdGhpcy5wcm92aWRlcikgPT0gbnVsbCA/IHZvaWQgMCA6IHQuZ2V0UmVjZW50cyh0aGlzLm9wdGlvbnMubWF4UmVjZW50cyk7XG4gICAgcmV0dXJuIHRoaXMuZW1vamlDb250YWluZXIgPSB0aGlzLnZpZXdGYWN0b3J5LmNyZWF0ZShUdCwge1xuICAgICAgZW1vamlzOiBlLFxuICAgICAgc2hvd1ZhcmlhbnRzOiAhMSxcbiAgICAgIGxhenlMb2FkZXI6IHRoaXMubGF6eUxvYWRlcixcbiAgICAgIGNhdGVnb3J5OiB0aGlzLmNhdGVnb3J5LmtleVxuICAgIH0pLCBhd2FpdCBzdXBlci5yZW5kZXIoe1xuICAgICAgY2F0ZWdvcnk6IHRoaXMuY2F0ZWdvcnksXG4gICAgICBlbW9qaXM6IHRoaXMuZW1vamlDb250YWluZXIsXG4gICAgICBlbW9qaUNvdW50OiBlLmxlbmd0aCxcbiAgICAgIGljb246IERbdGhpcy5jYXRlZ29yeS5rZXldXG4gICAgfSksIHRoaXMuZWw7XG4gIH1cbn1cbmNvbnN0IE10ID0gbmV3IHUoKHsgY2xhc3NlczogaSwgY2F0ZWdvcnk6IGUsIHBpY2tlcklkOiB0LCBpY29uOiBzLCBpMThuOiBvIH0pID0+IGBcbiAgPHNlY3Rpb24gY2xhc3M9XCIke2kuZW1vamlDYXRlZ29yeX1cIiByb2xlPVwidGFicGFuZWxcIiBhcmlhLWxhYmVsbGVkYnk9XCIke3R9LWNhdGVnb3J5LSR7ZS5rZXl9XCI+XG4gICAgPGgzIGRhdGEtY2F0ZWdvcnk9XCIke2Uua2V5fVwiIGNsYXNzPVwiJHtpLmNhdGVnb3J5TmFtZX1cIj5cbiAgICAgIDxpIGRhdGEtaWNvbj1cIiR7c31cIj48L2k+XG4gICAgICAke28uZ2V0KGBjYXRlZ29yaWVzLiR7ZS5rZXl9YCwgZS5tZXNzYWdlIHx8IGUua2V5KX1cbiAgICA8L2gzPlxuICAgIDxkaXYgZGF0YS12aWV3PVwiZW1vamlzXCIgZGF0YS1yZW5kZXI9XCJzeW5jXCI+PC9kaXY+XG4gIDwvc2VjdGlvbj5cbmApO1xuY2xhc3MgQnQgZXh0ZW5kcyBuZSB7XG4gIGNvbnN0cnVjdG9yKHsgY2F0ZWdvcnk6IGUsIGxhenlMb2FkZXI6IHQgfSkge1xuICAgIHN1cGVyKHsgdGVtcGxhdGU6IE10LCBzaG93VmFyaWFudHM6ICExLCBsYXp5TG9hZGVyOiB0LCBjYXRlZ29yeTogZSB9KTtcbiAgfVxuICBpbml0aWFsaXplKCkge1xuICAgIHRoaXMudWlFbGVtZW50cyA9IHsgLi4udGhpcy5iYXNlVUlFbGVtZW50cyB9LCBzdXBlci5pbml0aWFsaXplKCk7XG4gIH1cbiAgYXN5bmMgcmVuZGVyKCkge1xuICAgIHJldHVybiB0aGlzLmVtb2ppQ29udGFpbmVyID0gdGhpcy52aWV3RmFjdG9yeS5jcmVhdGUoRiwge1xuICAgICAgZW1vamlzOiB0aGlzLmN1c3RvbUVtb2ppcyxcbiAgICAgIHNob3dWYXJpYW50czogdGhpcy5zaG93VmFyaWFudHMsXG4gICAgICBsYXp5TG9hZGVyOiB0aGlzLmxhenlMb2FkZXIsXG4gICAgICBjYXRlZ29yeTogdGhpcy5jYXRlZ29yeS5rZXlcbiAgICB9KSwgc3VwZXIucmVuZGVyKHtcbiAgICAgIGNhdGVnb3J5OiB0aGlzLmNhdGVnb3J5LFxuICAgICAgZW1vamlzOiB0aGlzLmVtb2ppQ29udGFpbmVyLFxuICAgICAgZW1vamlDb3VudDogdGhpcy5jdXN0b21FbW9qaXMubGVuZ3RoLFxuICAgICAgaWNvbjogRFt0aGlzLmNhdGVnb3J5LmtleV1cbiAgICB9KTtcbiAgfVxufVxuY2xhc3MgUGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVsZW1lbnRzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbiAgfVxuICBsYXp5TG9hZChlLCB0KSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudHMuc2V0KGUsIHQpLCBlO1xuICB9XG4gIG9ic2VydmUoZSkge1xuICAgIGlmICh3aW5kb3cuSW50ZXJzZWN0aW9uT2JzZXJ2ZXIpIHtcbiAgICAgIGNvbnN0IHQgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoXG4gICAgICAgIChzKSA9PiB7XG4gICAgICAgICAgcy5maWx0ZXIoKG8pID0+IG8uaW50ZXJzZWN0aW9uUmF0aW8gPiAwKS5tYXAoKG8pID0+IG8udGFyZ2V0KS5mb3JFYWNoKChvKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByID0gdGhpcy5lbGVtZW50cy5nZXQobyk7XG4gICAgICAgICAgICByID09IG51bGwgfHwgcigpLCB0LnVub2JzZXJ2ZShvKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHJvb3Q6IGVcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICAgIHRoaXMuZWxlbWVudHMuZm9yRWFjaCgocywgbykgPT4ge1xuICAgICAgICB0Lm9ic2VydmUobyk7XG4gICAgICB9KTtcbiAgICB9IGVsc2VcbiAgICAgIHRoaXMuZWxlbWVudHMuZm9yRWFjaCgodCkgPT4ge1xuICAgICAgICB0KCk7XG4gICAgICB9KTtcbiAgfVxufVxuY29uc3QgdWUgPSBnKFwiZW1vamlBcmVhXCIpLCBEdCA9IG5ldyB1KCh7IGNsYXNzZXM6IGkgfSkgPT4gYFxuICA8ZGl2IGNsYXNzPVwiJHtpLmVtb2ppQXJlYX1cIj5cbiAgICA8ZGl2IGRhdGEtcGxhY2Vob2xkZXI9XCJlbW9qaXNcIj48L2Rpdj5cbiAgPC9kaXY+XG5gLCB7IG1vZGU6IFwiYXN5bmNcIiB9KSwgSHQgPSB7XG4gIHJlY2VudHM6IFZ0LFxuICBjdXN0b206IEJ0XG59O1xuZnVuY3Rpb24gTnQoaSkge1xuICByZXR1cm4gSHRbaS5rZXldIHx8IEl0O1xufVxuZnVuY3Rpb24gT3QoaSkge1xuICByZXR1cm4gIWkgfHwgaSA9PT0gXCJidXR0b25cIiA/IHtcbiAgICByb3c6IFwiZmlyc3RcIixcbiAgICBvZmZzZXQ6IDBcbiAgfSA6IGk7XG59XG5jbGFzcyBVdCBleHRlbmRzIGMge1xuICBjb25zdHJ1Y3Rvcih7IGNhdGVnb3J5VGFiczogZSwgY2F0ZWdvcmllczogdCwgZW1vamlWZXJzaW9uOiBzIH0pIHtcbiAgICBzdXBlcih7IHRlbXBsYXRlOiBEdCwgY2xhc3NlczogdWUgfSksIHRoaXMuc2VsZWN0ZWRDYXRlZ29yeSA9IDAsIHRoaXMuc2Nyb2xsTGlzdGVuZXJTdGF0ZSA9IFwiYWN0aXZlXCIsIHRoaXMubGF6eUxvYWRlciA9IG5ldyBQZSgpLCB0aGlzLmNhdGVnb3J5VGFicyA9IGUsIHRoaXMuY2F0ZWdvcmllcyA9IHQsIHRoaXMuZW1vamlWZXJzaW9uID0gcywgdGhpcy5oYW5kbGVTY3JvbGwgPSBUZSh0aGlzLmhhbmRsZVNjcm9sbC5iaW5kKHRoaXMpLCAxMDApO1xuICB9XG4gIGluaXRpYWxpemUoKSB7XG4gICAgdGhpcy5hcHBFdmVudHMgPSB7XG4gICAgICBcImNhdGVnb3J5OnNlbGVjdFwiOiB0aGlzLmhhbmRsZUNhdGVnb3J5U2VsZWN0LFxuICAgICAgXCJjYXRlZ29yeTpwcmV2aW91c1wiOiB0aGlzLmZvY3VzUHJldmlvdXNDYXRlZ29yeSxcbiAgICAgIFwiY2F0ZWdvcnk6bmV4dFwiOiB0aGlzLmZvY3VzTmV4dENhdGVnb3J5LFxuICAgICAgXCJmb2N1czpjaGFuZ2VcIjogdGhpcy51cGRhdGVGb2N1c2VkQ2F0ZWdvcnlcbiAgICB9LCB0aGlzLnVpRWxlbWVudHMgPSB7IGVtb2ppczogYy5ieUNsYXNzKHVlLmVtb2ppQXJlYSkgfSwgdGhpcy51aUV2ZW50cyA9IFtjLnVpRXZlbnQoXCJzY3JvbGxcIiwgdGhpcy5oYW5kbGVTY3JvbGwpXSwgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICB9XG4gIGdldCBmb2N1c2FibGVFbW9qaSgpIHtcbiAgICByZXR1cm4gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCdbdGFiaW5kZXg9XCIwXCJdJyk7XG4gIH1cbiAgYXN5bmMgcmVuZGVyKCkge1xuICAgIHRoaXMuZW1vamlDYXRlZ29yaWVzID0gdGhpcy5jYXRlZ29yaWVzLm1hcCh0aGlzLmNyZWF0ZUNhdGVnb3J5LCB0aGlzKTtcbiAgICBjb25zdCBlID0ge307XG4gICAgcmV0dXJuIHRoaXMuY2F0ZWdvcmllcy5mb3JFYWNoKCh0LCBzKSA9PiB7XG4gICAgICBlW2BlbW9qaXMtJHt0LmtleX1gXSA9IHRoaXMuZW1vamlDYXRlZ29yaWVzW3NdO1xuICAgIH0pLCBhd2FpdCBzdXBlci5yZW5kZXIoe1xuICAgICAgZW1vamlzOiBhd2FpdCBQcm9taXNlLmFsbCh0aGlzLmVtb2ppQ2F0ZWdvcmllcy5tYXAoKHQpID0+IHQucmVuZGVyKCkpKVxuICAgIH0pLCB0aGlzLmxhenlMb2FkZXIub2JzZXJ2ZSh0aGlzLmVsKSwgd2luZG93LlJlc2l6ZU9ic2VydmVyICYmICh0aGlzLm9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKCgpID0+IHtcbiAgICAgIGNvbnN0IHQgPSB0aGlzLmVsLnNjcm9sbEhlaWdodCAtIHRoaXMuc2Nyb2xsSGVpZ2h0O1xuICAgICAgdGhpcy5lbC5zY3JvbGxUb3AgLSB0aGlzLnNjcm9sbFRvcCA9PT0gMCAmJiB0ID4gMCAmJiAodGhpcy5lbC5zY3JvbGxUb3AgKz0gdCksIHRoaXMuc2Nyb2xsSGVpZ2h0ID0gdGhpcy5lbC5zY3JvbGxIZWlnaHQsIHRoaXMuc2Nyb2xsVG9wID0gdGhpcy5lbC5zY3JvbGxUb3A7XG4gICAgfSksIHRoaXMuZW1vamlDYXRlZ29yaWVzLmZvckVhY2goKHQpID0+IHtcbiAgICAgIHRoaXMub2JzZXJ2ZXIub2JzZXJ2ZSh0LmVsKTtcbiAgICB9KSksIHRoaXMuZWw7XG4gIH1cbiAgZGVzdHJveSgpIHtcbiAgICBzdXBlci5kZXN0cm95KCksIHRoaXMuZW1vamlDYXRlZ29yaWVzLmZvckVhY2goKGUpID0+IHtcbiAgICAgIHZhciB0O1xuICAgICAgKHQgPSB0aGlzLm9ic2VydmVyKSA9PSBudWxsIHx8IHQudW5vYnNlcnZlKGUuZWwpLCBlLmRlc3Ryb3koKTtcbiAgICB9KTtcbiAgfVxuICBoYW5kbGVDYXRlZ29yeVNlbGVjdChlLCB0KSB7XG4gICAgdGhpcy5zZWxlY3RDYXRlZ29yeShlLCB0KTtcbiAgfVxuICBjcmVhdGVDYXRlZ29yeShlKSB7XG4gICAgY29uc3QgdCA9IE50KGUpO1xuICAgIHJldHVybiB0aGlzLnZpZXdGYWN0b3J5LmNyZWF0ZSh0LCB7XG4gICAgICBjYXRlZ29yeTogZSxcbiAgICAgIHNob3dWYXJpYW50czogITAsXG4gICAgICBsYXp5TG9hZGVyOiB0aGlzLmxhenlMb2FkZXIsXG4gICAgICBlbW9qaVZlcnNpb246IHRoaXMuZW1vamlWZXJzaW9uLFxuICAgICAgcHJvdmlkZXI6IHRoaXMub3B0aW9ucy5yZWNlbnRzUHJvdmlkZXJcbiAgICB9KTtcbiAgfVxuICBkZXRlcm1pbmVJbml0aWFsQ2F0ZWdvcnkoKSB7XG4gICAgdmFyIGU7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5pbml0aWFsQ2F0ZWdvcnkgJiYgdGhpcy5jYXRlZ29yaWVzLmZpbmQoKHQpID0+IHQua2V5ID09PSB0aGlzLm9wdGlvbnMuaW5pdGlhbENhdGVnb3J5KSA/IHRoaXMub3B0aW9ucy5pbml0aWFsQ2F0ZWdvcnkgOiAoZSA9IHRoaXMuY2F0ZWdvcmllcy5maW5kKCh0KSA9PiB0LmtleSAhPT0gXCJyZWNlbnRzXCIpKSA9PSBudWxsID8gdm9pZCAwIDogZS5rZXk7XG4gIH1cbiAgZGV0ZXJtaW5lRm9jdXNUYXJnZXQoZSkge1xuICAgIGNvbnN0IHQgPSB0aGlzLmVtb2ppQ2F0ZWdvcmllcy5maW5kKChzKSA9PiBzLmNhdGVnb3J5LmtleSA9PT0gZSk7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5pbml0aWFsRW1vamkgJiYgKHQgPT0gbnVsbCA/IHZvaWQgMCA6IHQuZWwucXVlcnlTZWxlY3RvcihgW2RhdGEtZW1vamk9XCIke3RoaXMub3B0aW9ucy5pbml0aWFsRW1vaml9XCJdYCkpID8gdGhpcy5vcHRpb25zLmluaXRpYWxFbW9qaSA6IFwiYnV0dG9uXCI7XG4gIH1cbiAgcmVzZXQoZSA9ICEwKSB7XG4gICAgdGhpcy5ldmVudHMuZW1pdChcInByZXZpZXc6aGlkZVwiKSwgdGhpcy5zY3JvbGxIZWlnaHQgPSB0aGlzLmVsLnNjcm9sbEhlaWdodDtcbiAgICBjb25zdCB0ID0gdGhpcy5kZXRlcm1pbmVJbml0aWFsQ2F0ZWdvcnkoKTtcbiAgICB0ICYmICh0aGlzLnNlbGVjdENhdGVnb3J5KHQsIHtcbiAgICAgIGZvY3VzOiB0aGlzLmRldGVybWluZUZvY3VzVGFyZ2V0KHQpLFxuICAgICAgcGVyZm9ybUZvY3VzOiBlLFxuICAgICAgc2Nyb2xsOiBcImp1bXBcIlxuICAgIH0pLCB0aGlzLnNlbGVjdGVkQ2F0ZWdvcnkgPSB0aGlzLmdldENhdGVnb3J5SW5kZXgodCkpO1xuICB9XG4gIGdldENhdGVnb3J5SW5kZXgoZSkge1xuICAgIHJldHVybiB0aGlzLmNhdGVnb3JpZXMuZmluZEluZGV4KCh0KSA9PiB0LmtleSA9PT0gZSk7XG4gIH1cbiAgZm9jdXNQcmV2aW91c0NhdGVnb3J5KGUpIHtcbiAgICB0aGlzLnNlbGVjdGVkQ2F0ZWdvcnkgPiAwICYmIHRoaXMuZm9jdXNDYXRlZ29yeSh0aGlzLnNlbGVjdGVkQ2F0ZWdvcnkgLSAxLCB7IHJvdzogXCJsYXN0XCIsIG9mZnNldDogZSAhPSBudWxsID8gZSA6IHRoaXMub3B0aW9ucy5lbW9qaXNQZXJSb3cgfSk7XG4gIH1cbiAgZm9jdXNOZXh0Q2F0ZWdvcnkoZSkge1xuICAgIHRoaXMuc2VsZWN0ZWRDYXRlZ29yeSA8IHRoaXMuY2F0ZWdvcmllcy5sZW5ndGggLSAxICYmIHRoaXMuZm9jdXNDYXRlZ29yeSh0aGlzLnNlbGVjdGVkQ2F0ZWdvcnkgKyAxLCB7IHJvdzogXCJmaXJzdFwiLCBvZmZzZXQ6IGUgIT0gbnVsbCA/IGUgOiAwIH0pO1xuICB9XG4gIGZvY3VzQ2F0ZWdvcnkoZSwgdCkge1xuICAgIHRoaXMuc2VsZWN0Q2F0ZWdvcnkoZSwge1xuICAgICAgZm9jdXM6IHQsXG4gICAgICBwZXJmb3JtRm9jdXM6ICEwXG4gICAgfSk7XG4gIH1cbiAgYXN5bmMgc2VsZWN0Q2F0ZWdvcnkoZSwgdCA9IHt9KSB7XG4gICAgdmFyIGw7XG4gICAgdGhpcy5zY3JvbGxMaXN0ZW5lclN0YXRlID0gXCJzdXNwZW5kXCI7XG4gICAgY29uc3QgeyBmb2N1czogcywgcGVyZm9ybUZvY3VzOiBvLCBzY3JvbGw6IHIgfSA9IHtcbiAgICAgIHBlcmZvcm1Gb2N1czogITEsXG4gICAgICAuLi50XG4gICAgfTtcbiAgICB0aGlzLmVtb2ppQ2F0ZWdvcmllc1t0aGlzLnNlbGVjdGVkQ2F0ZWdvcnldLnNldEFjdGl2ZSghMSk7XG4gICAgY29uc3QgYSA9IHRoaXMuc2VsZWN0ZWRDYXRlZ29yeSA9IHR5cGVvZiBlID09IFwibnVtYmVyXCIgPyBlIDogdGhpcy5nZXRDYXRlZ29yeUluZGV4KGUpO1xuICAgIChsID0gdGhpcy5jYXRlZ29yeVRhYnMpID09IG51bGwgfHwgbC5zZXRBY3RpdmVUYWIodGhpcy5zZWxlY3RlZENhdGVnb3J5LCB7XG4gICAgICBwZXJmb3JtRm9jdXM6IG8sXG4gICAgICBzY3JvbGw6IHMgPT09IFwiYnV0dG9uXCJcbiAgICB9KTtcbiAgICBjb25zdCBuID0gdGhpcy5lbW9qaUNhdGVnb3JpZXNbYV0uZWwub2Zmc2V0VG9wO1xuICAgIHRoaXMuZW1vamlDYXRlZ29yaWVzW2FdLnNldEFjdGl2ZSghMCwgT3QocyksIHMgIT09IFwiYnV0dG9uXCIgJiYgbyksIHIgJiYgKHRoaXMuZWwuc2Nyb2xsVG9wID0gbiksIHRoaXMuc2Nyb2xsTGlzdGVuZXJTdGF0ZSA9IFwicmVzdW1lXCI7XG4gIH1cbiAgdXBkYXRlRm9jdXNlZENhdGVnb3J5KGUpIHtcbiAgICB2YXIgdDtcbiAgICB0aGlzLmNhdGVnb3JpZXNbdGhpcy5zZWxlY3RlZENhdGVnb3J5XS5rZXkgIT09IGUgJiYgKHRoaXMuc2Nyb2xsTGlzdGVuZXJTdGF0ZSA9IFwic3VzcGVuZFwiLCB0aGlzLnNlbGVjdGVkQ2F0ZWdvcnkgPSB0aGlzLmdldENhdGVnb3J5SW5kZXgoZSksICh0ID0gdGhpcy5jYXRlZ29yeVRhYnMpID09IG51bGwgfHwgdC5zZXRBY3RpdmVUYWIodGhpcy5zZWxlY3RlZENhdGVnb3J5LCB7XG4gICAgICBjaGFuZ2VGb2N1c2FibGU6ICExLFxuICAgICAgcGVyZm9ybUZvY3VzOiAhMVxuICAgIH0pLCB0aGlzLnNjcm9sbExpc3RlbmVyU3RhdGUgPSBcInJlc3VtZVwiKTtcbiAgfVxuICBoYW5kbGVTY3JvbGwoKSB7XG4gICAgaWYgKHRoaXMuc2Nyb2xsTGlzdGVuZXJTdGF0ZSA9PT0gXCJzdXNwZW5kXCIgfHwgIXRoaXMuY2F0ZWdvcnlUYWJzKVxuICAgICAgcmV0dXJuO1xuICAgIGlmICh0aGlzLnNjcm9sbExpc3RlbmVyU3RhdGUgPT09IFwicmVzdW1lXCIpIHtcbiAgICAgIHRoaXMuc2Nyb2xsTGlzdGVuZXJTdGF0ZSA9IFwiYWN0aXZlXCI7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGUgPSB0aGlzLmVsLnNjcm9sbFRvcCwgdCA9IHRoaXMuZWwuc2Nyb2xsSGVpZ2h0IC0gdGhpcy5lbC5vZmZzZXRIZWlnaHQsIHMgPSB0aGlzLmVtb2ppQ2F0ZWdvcmllcy5maW5kSW5kZXgoKHIsIGEpID0+IHtcbiAgICAgIHZhciBuO1xuICAgICAgcmV0dXJuIGUgPCAoKG4gPSB0aGlzLmVtb2ppQ2F0ZWdvcmllc1thICsgMV0pID09IG51bGwgPyB2b2lkIDAgOiBuLmVsLm9mZnNldFRvcCk7XG4gICAgfSksIG8gPSB7XG4gICAgICBjaGFuZ2VGb2N1c2FibGU6ICExLFxuICAgICAgcGVyZm9ybUZvY3VzOiAhMSxcbiAgICAgIHNjcm9sbDogITFcbiAgICB9O1xuICAgIGUgPT09IDAgPyB0aGlzLmNhdGVnb3J5VGFicy5zZXRBY3RpdmVUYWIoMCwgbykgOiBNYXRoLmZsb29yKGUpID09PSBNYXRoLmZsb29yKHQpIHx8IHMgPCAwID8gdGhpcy5jYXRlZ29yeVRhYnMuc2V0QWN0aXZlVGFiKHRoaXMuY2F0ZWdvcmllcy5sZW5ndGggLSAxLCBvKSA6IHRoaXMuY2F0ZWdvcnlUYWJzLnNldEFjdGl2ZVRhYihzLCBvKTtcbiAgfVxufVxuY29uc3QgS3QgPSBuZXcgdSgoeyBjbGFzc0xpc3Q6IGksIGNsYXNzZXM6IGUsIGljb246IHQsIG1lc3NhZ2U6IHMgfSkgPT4gYFxuPGRpdiBjbGFzcz1cIiR7aX1cIiByb2xlPVwiYWxlcnRcIj5cbiAgPGRpdiBjbGFzcz1cIiR7ZS5pY29uQ29udGFpbmVyfVwiPjxpIGRhdGEtc2l6ZT1cIjEweFwiIGRhdGEtaWNvbj1cIiR7dH1cIj48L2k+PC9kaXY+XG4gIDxoMyBjbGFzcz1cIiR7ZS50aXRsZX1cIj4ke3N9PC9oMz5cbjwvZGl2PlxuYCksIGdlID0gZyhcImVycm9yXCIsIFwiaWNvbkNvbnRhaW5lclwiLCBcInRpdGxlXCIpO1xuY2xhc3Mgc2UgZXh0ZW5kcyBjIHtcbiAgY29uc3RydWN0b3IoeyBtZXNzYWdlOiBlLCBpY29uOiB0ID0gXCJ3YXJuaW5nXCIsIHRlbXBsYXRlOiBzID0gS3QsIGNsYXNzTmFtZTogbyB9KSB7XG4gICAgc3VwZXIoeyB0ZW1wbGF0ZTogcywgY2xhc3NlczogZ2UgfSksIHRoaXMubWVzc2FnZSA9IGUsIHRoaXMuaWNvbiA9IHQsIHRoaXMuY2xhc3NOYW1lID0gbztcbiAgfVxuICByZW5kZXJTeW5jKCkge1xuICAgIGNvbnN0IGUgPSBbZ2UuZXJyb3IsIHRoaXMuY2xhc3NOYW1lXS5qb2luKFwiIFwiKS50cmltKCk7XG4gICAgcmV0dXJuIHN1cGVyLnJlbmRlclN5bmMoeyBtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsIGljb246IHRoaXMuaWNvbiwgY2xhc3NMaXN0OiBlIH0pO1xuICB9XG59XG5jb25zdCBxdCA9IG5ldyB1KCh7IGNsYXNzTGlzdDogaSwgY2xhc3NlczogZSwgaWNvbjogdCwgaTE4bjogcywgbWVzc2FnZTogbyB9KSA9PiBgXG4gIDxkaXYgY2xhc3M9XCIke2l9XCIgcm9sZT1cImFsZXJ0XCI+XG4gICAgPGRpdiBjbGFzcz1cIiR7ZS5pY29ufVwiPjxpIGRhdGEtc2l6ZT1cIjEweFwiIGRhdGEtaWNvbj1cIiR7dH1cIj48L2k+PC9kaXY+XG4gICAgPGgzIGNsYXNzPVwiJHtlLnRpdGxlfVwiPiR7b308L2gzPlxuICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiPiR7cy5nZXQoXCJyZXRyeVwiKX08L2J1dHRvbj5cbiAgPC9kaXY+XG5gKSwgR3QgPSBnKFwiZGF0YUVycm9yXCIpO1xuY2xhc3MgV3QgZXh0ZW5kcyBzZSB7XG4gIGNvbnN0cnVjdG9yKHsgbWVzc2FnZTogZSB9KSB7XG4gICAgc3VwZXIoeyBtZXNzYWdlOiBlLCB0ZW1wbGF0ZTogcXQsIGNsYXNzTmFtZTogR3QuZGF0YUVycm9yIH0pO1xuICB9XG4gIGluaXRpYWxpemUoKSB7XG4gICAgdGhpcy51aUVsZW1lbnRzID0geyByZXRyeUJ1dHRvbjogXCJidXR0b25cIiB9LCB0aGlzLnVpRXZlbnRzID0gW2MuY2hpbGRFdmVudChcInJldHJ5QnV0dG9uXCIsIFwiY2xpY2tcIiwgdGhpcy5vblJldHJ5KV0sIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgfVxuICBhc3luYyBvblJldHJ5KCkge1xuICAgIHRoaXMuZW1vamlEYXRhID8gYXdhaXQgdGhpcy5lbW9qaURhdGEuZGVsZXRlKCkgOiBhd2FpdCB0aGlzLm9wdGlvbnMuZGF0YVN0b3JlLmRlbGV0ZURhdGFiYXNlKHRoaXMub3B0aW9ucy5sb2NhbGUpLCB0aGlzLmV2ZW50cy5lbWl0KFwicmVpbml0aWFsaXplXCIpO1xuICAgIGNvbnN0IGUgPSBhd2FpdCByZSh0aGlzLm9wdGlvbnMubG9jYWxlLCB0aGlzLm9wdGlvbnMuZGF0YVN0b3JlLCB0aGlzLm9wdGlvbnMubWVzc2FnZXMsIHRoaXMub3B0aW9ucy5lbW9qaURhdGEsIHRoaXMuZW1vamlEYXRhKTtcbiAgICB0aGlzLnZpZXdGYWN0b3J5LnNldEVtb2ppRGF0YShlKSwgdGhpcy5ldmVudHMuZW1pdChcImRhdGE6cmVhZHlcIiwgZSk7XG4gIH1cbn1cbmNvbnN0IEMgPSBnKFxuICBcInByZXZpZXdcIixcbiAgXCJwcmV2aWV3RW1vamlcIixcbiAgXCJwcmV2aWV3TmFtZVwiLFxuICBcInRhZ0xpc3RcIixcbiAgXCJ0YWdcIlxuKSwgX3QgPSBuZXcgdSgoeyBjbGFzc2VzOiBpLCB0YWc6IGUgfSkgPT4gYFxuICA8bGkgY2xhc3M9XCIke2kudGFnfVwiPiR7ZX08L2xpPlxuYCksIEp0ID0gbmV3IHUoKHsgY2xhc3NlczogaSB9KSA9PiBgXG4gIDxkaXYgY2xhc3M9XCIke2kucHJldmlld31cIj5cbiAgICA8ZGl2IGNsYXNzPVwiJHtpLnByZXZpZXdFbW9qaX1cIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiJHtpLnByZXZpZXdOYW1lfVwiPjwvZGl2PlxuICAgIDx1bCBjbGFzcz1cIiR7aS50YWdMaXN0fVwiPjwvdWw+XG4gIDwvZGl2PlxuYCk7XG5jbGFzcyBZdCBleHRlbmRzIGMge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7IHRlbXBsYXRlOiBKdCwgY2xhc3NlczogQyB9KTtcbiAgfVxuICBpbml0aWFsaXplKCkge1xuICAgIHRoaXMudWlFbGVtZW50cyA9IHtcbiAgICAgIGVtb2ppOiBjLmJ5Q2xhc3MoQy5wcmV2aWV3RW1vamkpLFxuICAgICAgbmFtZTogYy5ieUNsYXNzKEMucHJldmlld05hbWUpLFxuICAgICAgdGFnTGlzdDogYy5ieUNsYXNzKEMudGFnTGlzdClcbiAgICB9LCB0aGlzLmFwcEV2ZW50cyA9IHtcbiAgICAgIFwicHJldmlldzpzaG93XCI6IHRoaXMuc2hvd1ByZXZpZXcsXG4gICAgICBcInByZXZpZXc6aGlkZVwiOiB0aGlzLmhpZGVQcmV2aWV3XG4gICAgfSwgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICB9XG4gIHNob3dQcmV2aWV3KGUsIHQpIHtcbiAgICBpZiAodGhpcy51aS5lbW9qaS5yZXBsYWNlQ2hpbGRyZW4odCksIHRoaXMudWkubmFtZS50ZXh0Q29udGVudCA9IGUubGFiZWwsIGUudGFncykge1xuICAgICAgdGhpcy51aS50YWdMaXN0LnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICAgIGNvbnN0IHMgPSBlLnRhZ3MubWFwKChvKSA9PiBfdC5yZW5kZXJTeW5jKHsgdGFnOiBvLCBjbGFzc2VzOiBDIH0pKTtcbiAgICAgIHRoaXMudWkudGFnTGlzdC5yZXBsYWNlQ2hpbGRyZW4oLi4ucyk7XG4gICAgfVxuICB9XG4gIGhpZGVQcmV2aWV3KCkge1xuICAgIHRoaXMudWkuZW1vamkucmVwbGFjZUNoaWxkcmVuKCksIHRoaXMudWkubmFtZS50ZXh0Q29udGVudCA9IFwiXCIsIHRoaXMudWkudGFnTGlzdC5yZXBsYWNlQ2hpbGRyZW4oKTtcbiAgfVxufVxuY29uc3QgUXQgPSBuZXcgdSgoeyBjbGFzc2VzOiBpLCBpMThuOiBlIH0pID0+IGBcbiAgPGJ1dHRvbiB0aXRsZT1cIiR7ZS5nZXQoXCJzZWFyY2guY2xlYXJcIil9XCIgY2xhc3M9XCIke2kuY2xlYXJTZWFyY2hCdXR0b259XCI+XG4gICAgPGkgZGF0YS1pY29uPVwieG1hcmtcIj48L2k+XG4gIDwvYnV0dG9uPlxuYCksIFh0ID0gbmV3IHUoKHsgY2xhc3NlczogaSwgaTE4bjogZSB9KSA9PiBgXG48ZGl2IGNsYXNzPVwiJHtpLnNlYXJjaENvbnRhaW5lcn1cIj5cbiAgPGlucHV0IGNsYXNzPVwiJHtpLnNlYXJjaEZpZWxkfVwiIHBsYWNlaG9sZGVyPVwiJHtlLmdldChcInNlYXJjaFwiKX1cIj5cbiAgPHNwYW4gY2xhc3M9XCIke2kuc2VhcmNoQWNjZXNzb3J5fVwiPjwvc3Bhbj5cbjwvZGl2PlxuYCwgeyBtb2RlOiBcImFzeW5jXCIgfSksIGogPSBnKFxuICBcInNlYXJjaENvbnRhaW5lclwiLFxuICBcInNlYXJjaEZpZWxkXCIsXG4gIFwiY2xlYXJCdXR0b25cIixcbiAgXCJzZWFyY2hBY2Nlc3NvcnlcIixcbiAgXCJjbGVhclNlYXJjaEJ1dHRvblwiLFxuICBcIm5vdEZvdW5kXCJcbik7XG5jbGFzcyBadCBleHRlbmRzIGMge1xuICBjb25zdHJ1Y3Rvcih7IGNhdGVnb3JpZXM6IGUsIGVtb2ppVmVyc2lvbjogdCB9KSB7XG4gICAgc3VwZXIoeyB0ZW1wbGF0ZTogWHQsIGNsYXNzZXM6IGogfSksIHRoaXMuY2F0ZWdvcmllcyA9IGUuZmlsdGVyKChzKSA9PiBzLmtleSAhPT0gXCJyZWNlbnRzXCIpLCB0aGlzLmVtb2ppVmVyc2lvbiA9IHQsIHRoaXMuc2VhcmNoID0gUmUodGhpcy5zZWFyY2guYmluZCh0aGlzKSwgMTAwKTtcbiAgfVxuICBpbml0aWFsaXplKCkge1xuICAgIHRoaXMudWlFbGVtZW50cyA9IHtcbiAgICAgIHNlYXJjaEZpZWxkOiBjLmJ5Q2xhc3Moai5zZWFyY2hGaWVsZCksXG4gICAgICBzZWFyY2hBY2Nlc3Nvcnk6IGMuYnlDbGFzcyhqLnNlYXJjaEFjY2Vzc29yeSlcbiAgICB9LCB0aGlzLnVpRXZlbnRzID0gW1xuICAgICAgYy5jaGlsZEV2ZW50KFwic2VhcmNoRmllbGRcIiwgXCJrZXlkb3duXCIsIHRoaXMub25LZXlEb3duKSxcbiAgICAgIGMuY2hpbGRFdmVudChcInNlYXJjaEZpZWxkXCIsIFwiaW5wdXRcIiwgdGhpcy5vblNlYXJjaElucHV0KVxuICAgIF0sIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgfVxuICBhc3luYyByZW5kZXIoKSB7XG4gICAgcmV0dXJuIGF3YWl0IHN1cGVyLnJlbmRlcigpLCB0aGlzLnNlYXJjaEljb24gPSBqZShcInNlYXJjaFwiKSwgdGhpcy5ub3RGb3VuZE1lc3NhZ2UgPSB0aGlzLnZpZXdGYWN0b3J5LmNyZWF0ZShzZSwge1xuICAgICAgbWVzc2FnZTogdGhpcy5pMThuLmdldChcInNlYXJjaC5ub3RGb3VuZFwiKSxcbiAgICAgIGNsYXNzTmFtZTogai5ub3RGb3VuZCxcbiAgICAgIGljb246IFwic2FkXCJcbiAgICB9KSwgdGhpcy5ub3RGb3VuZE1lc3NhZ2UucmVuZGVyU3luYygpLCB0aGlzLmVycm9yTWVzc2FnZSA9IHRoaXMudmlld0ZhY3RvcnkuY3JlYXRlKHNlLCB7IG1lc3NhZ2U6IHRoaXMuaTE4bi5nZXQoXCJzZWFyY2guZXJyb3JcIikgfSksIHRoaXMuZXJyb3JNZXNzYWdlLnJlbmRlclN5bmMoKSwgdGhpcy5jbGVhclNlYXJjaEJ1dHRvbiA9IFF0LnJlbmRlcih7XG4gICAgICBjbGFzc2VzOiBqLFxuICAgICAgaTE4bjogdGhpcy5pMThuXG4gICAgfSksIHRoaXMuY2xlYXJTZWFyY2hCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB0aGlzLm9uQ2xlYXJTZWFyY2goZSkpLCB0aGlzLnNlYXJjaEZpZWxkID0gdGhpcy51aS5zZWFyY2hGaWVsZCwgdGhpcy5zaG93U2VhcmNoSWNvbigpLCB0aGlzLmVsO1xuICB9XG4gIHNob3dTZWFyY2hJY29uKCkge1xuICAgIHRoaXMuc2hvd1NlYXJjaEFjY2Vzc29yeSh0aGlzLnNlYXJjaEljb24pO1xuICB9XG4gIHNob3dDbGVhclNlYXJjaEJ1dHRvbigpIHtcbiAgICB0aGlzLnNob3dTZWFyY2hBY2Nlc3NvcnkodGhpcy5jbGVhclNlYXJjaEJ1dHRvbik7XG4gIH1cbiAgc2hvd1NlYXJjaEFjY2Vzc29yeShlKSB7XG4gICAgdGhpcy51aS5zZWFyY2hBY2Nlc3NvcnkucmVwbGFjZUNoaWxkcmVuKGUpO1xuICB9XG4gIGNsZWFyKCkge1xuICAgIHRoaXMuc2VhcmNoRmllbGQudmFsdWUgPSBcIlwiLCB0aGlzLnNob3dTZWFyY2hJY29uKCk7XG4gIH1cbiAgZm9jdXMoKSB7XG4gICAgdGhpcy5zZWFyY2hGaWVsZC5mb2N1cygpO1xuICB9XG4gIG9uQ2xlYXJTZWFyY2goZSkge1xuICAgIHZhciB0O1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCksIHRoaXMuc2VhcmNoRmllbGQudmFsdWUgPSBcIlwiLCAodCA9IHRoaXMucmVzdWx0c0NvbnRhaW5lcikgPT0gbnVsbCB8fCB0LmRlc3Ryb3koKSwgdGhpcy5yZXN1bHRzQ29udGFpbmVyID0gbnVsbCwgdGhpcy5zaG93U2VhcmNoSWNvbigpLCB0aGlzLmV2ZW50cy5lbWl0KFwiY29udGVudDpzaG93XCIpLCB0aGlzLnNlYXJjaEZpZWxkLmZvY3VzKCk7XG4gIH1cbiAgaGFuZGxlUmVzdWx0c0tleWRvd24oZSkge1xuICAgIHRoaXMucmVzdWx0c0NvbnRhaW5lciAmJiBlLmtleSA9PT0gXCJFc2NhcGVcIiAmJiB0aGlzLm9uQ2xlYXJTZWFyY2goZSk7XG4gIH1cbiAgb25LZXlEb3duKGUpIHtcbiAgICB2YXIgdDtcbiAgICBlLmtleSA9PT0gXCJFc2NhcGVcIiAmJiB0aGlzLnNlYXJjaEZpZWxkLnZhbHVlID8gdGhpcy5vbkNsZWFyU2VhcmNoKGUpIDogKGUua2V5ID09PSBcIkVudGVyXCIgfHwgZS5rZXkgPT09IFwiQXJyb3dEb3duXCIpICYmIHRoaXMucmVzdWx0c0NvbnRhaW5lciAmJiAoZS5wcmV2ZW50RGVmYXVsdCgpLCAodCA9IHRoaXMucmVzdWx0c0NvbnRhaW5lci5lbC5xdWVyeVNlbGVjdG9yKCdbdGFiaW5kZXg9XCIwXCJdJykpID09IG51bGwgfHwgdC5mb2N1cygpKTtcbiAgfVxuICBvblNlYXJjaElucHV0KGUpIHtcbiAgICB0aGlzLnNlYXJjaEZpZWxkLnZhbHVlID8gKHRoaXMuc2hvd0NsZWFyU2VhcmNoQnV0dG9uKCksIHRoaXMuc2VhcmNoKCkpIDogdGhpcy5vbkNsZWFyU2VhcmNoKGUpO1xuICB9XG4gIGFzeW5jIHNlYXJjaCgpIHtcbiAgICB2YXIgZTtcbiAgICBpZiAoISF0aGlzLnNlYXJjaEZpZWxkLnZhbHVlKVxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdCA9IGF3YWl0IHRoaXMuZW1vamlEYXRhLnNlYXJjaEVtb2ppcyhcbiAgICAgICAgICB0aGlzLnNlYXJjaEZpZWxkLnZhbHVlLFxuICAgICAgICAgIHRoaXMuY3VzdG9tRW1vamlzLFxuICAgICAgICAgIHRoaXMuZW1vamlWZXJzaW9uLFxuICAgICAgICAgIHRoaXMuY2F0ZWdvcmllc1xuICAgICAgICApO1xuICAgICAgICBpZiAodGhpcy5ldmVudHMuZW1pdChcInByZXZpZXc6aGlkZVwiKSwgdC5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBzID0gbmV3IFBlKCk7XG4gICAgICAgICAgdGhpcy5yZXN1bHRzQ29udGFpbmVyID0gdGhpcy52aWV3RmFjdG9yeS5jcmVhdGUoRiwge1xuICAgICAgICAgICAgZW1vamlzOiB0LFxuICAgICAgICAgICAgZnVsbEhlaWdodDogITAsXG4gICAgICAgICAgICBzaG93VmFyaWFudHM6ICEwLFxuICAgICAgICAgICAgbGF6eUxvYWRlcjogc1xuICAgICAgICAgIH0pLCB0aGlzLnJlc3VsdHNDb250YWluZXIucmVuZGVyU3luYygpLCAoZSA9IHRoaXMucmVzdWx0c0NvbnRhaW5lcikgIT0gbnVsbCAmJiBlLmVsICYmIChzLm9ic2VydmUodGhpcy5yZXN1bHRzQ29udGFpbmVyLmVsKSwgdGhpcy5yZXN1bHRzQ29udGFpbmVyLnNldEFjdGl2ZSghMCwgeyByb3c6IDAsIG9mZnNldDogMCB9LCAhMSksIHRoaXMucmVzdWx0c0NvbnRhaW5lci5lbC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAobykgPT4gdGhpcy5oYW5kbGVSZXN1bHRzS2V5ZG93bihvKSksIHRoaXMuZXZlbnRzLmVtaXQoXCJjb250ZW50OnNob3dcIiwgdGhpcy5yZXN1bHRzQ29udGFpbmVyKSk7XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoXCJjb250ZW50OnNob3dcIiwgdGhpcy5ub3RGb3VuZE1lc3NhZ2UpO1xuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoXCJjb250ZW50OnNob3dcIiwgdGhpcy5lcnJvck1lc3NhZ2UpO1xuICAgICAgfVxuICB9XG59XG5jb25zdCBlcyA9IG5ldyB1KCh7IGNsYXNzZXM6IGkgfSkgPT4gYFxuICA8ZGl2IGNsYXNzPVwiJHtpLnZhcmlhbnRPdmVybGF5fVwiPlxuICAgIDxkaXYgY2xhc3M9XCIke2kudmFyaWFudFBvcHVwfVwiPlxuICAgICAgPGRpdiBkYXRhLXZpZXc9XCJlbW9qaXNcIiBkYXRhLXJlbmRlcj1cInN5bmNcIj48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5gKSwgcGUgPSBnKFxuICBcInZhcmlhbnRPdmVybGF5XCIsXG4gIFwidmFyaWFudFBvcHVwXCJcbiksIHEgPSB7XG4gIGVhc2luZzogXCJlYXNlLWluLW91dFwiLFxuICBkdXJhdGlvbjogMjUwLFxuICBmaWxsOiBcImJvdGhcIlxufSwgeWUgPSB7XG4gIG9wYWNpdHk6IFswLCAxXVxufSwgZmUgPSB7XG4gIG9wYWNpdHk6IFswLCAxXSxcbiAgdHJhbnNmb3JtOiBbXCJzY2FsZTNkKDAuOCwgMC44LCAwLjgpXCIsIFwic2NhbGUzZCgxLCAxLCAxKVwiXVxufTtcbmNsYXNzIHRzIGV4dGVuZHMgYyB7XG4gIGNvbnN0cnVjdG9yKHsgZW1vamk6IGUsIHBhcmVudDogdCB9KSB7XG4gICAgc3VwZXIoeyB0ZW1wbGF0ZTogZXMsIGNsYXNzZXM6IHBlLCBwYXJlbnQ6IHQgfSksIHRoaXMuZm9jdXNlZEVtb2ppSW5kZXggPSAwLCB0aGlzLmZvY3VzVHJhcCA9IG5ldyBVZSgpLCB0aGlzLmFuaW1hdGVTaG93ID0gKCkgPT4gUHJvbWlzZS5hbGwoW1xuICAgICAgSSh0aGlzLmVsLCB5ZSwgcSwgdGhpcy5vcHRpb25zKSxcbiAgICAgIEkodGhpcy51aS5wb3B1cCwgZmUsIHEsIHRoaXMub3B0aW9ucylcbiAgICBdKSwgdGhpcy5lbW9qaSA9IGU7XG4gIH1cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLnVpRWxlbWVudHMgPSB7XG4gICAgICBwb3B1cDogYy5ieUNsYXNzKHBlLnZhcmlhbnRQb3B1cClcbiAgICB9LCB0aGlzLnVpRXZlbnRzID0gW1xuICAgICAgYy51aUV2ZW50KFwiY2xpY2tcIiwgdGhpcy5oYW5kbGVDbGljayksXG4gICAgICBjLnVpRXZlbnQoXCJrZXlkb3duXCIsIHRoaXMuaGFuZGxlS2V5ZG93bilcbiAgICBdLCBzdXBlci5pbml0aWFsaXplKCk7XG4gIH1cbiAgYW5pbWF0ZUhpZGUoKSB7XG4gICAgY29uc3QgZSA9IHsgLi4ucSwgZGlyZWN0aW9uOiBcInJldmVyc2VcIiB9O1xuICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICBJKHRoaXMuZWwsIHllLCBlLCB0aGlzLm9wdGlvbnMpLFxuICAgICAgSSh0aGlzLnVpLnBvcHVwLCBmZSwgZSwgdGhpcy5vcHRpb25zKVxuICAgIF0pO1xuICB9XG4gIGFzeW5jIGhpZGUoKSB7XG4gICAgYXdhaXQgdGhpcy5hbmltYXRlSGlkZSgpLCB0aGlzLmV2ZW50cy5lbWl0KFwidmFyaWFudFBvcHVwOmhpZGVcIik7XG4gIH1cbiAgaGFuZGxlS2V5ZG93bihlKSB7XG4gICAgZS5rZXkgPT09IFwiRXNjYXBlXCIgJiYgKHRoaXMuaGlkZSgpLCBlLnN0b3BQcm9wYWdhdGlvbigpKTtcbiAgfVxuICBoYW5kbGVDbGljayhlKSB7XG4gICAgdGhpcy51aS5wb3B1cC5jb250YWlucyhlLnRhcmdldCkgfHwgdGhpcy5oaWRlKCk7XG4gIH1cbiAgZ2V0RW1vamkoZSkge1xuICAgIHJldHVybiB0aGlzLnJlbmRlcmVkRW1vamlzW2VdO1xuICB9XG4gIHNldEZvY3VzZWRFbW9qaShlKSB7XG4gICAgY29uc3QgdCA9IHRoaXMuZ2V0RW1vamkodGhpcy5mb2N1c2VkRW1vamlJbmRleCk7XG4gICAgdC50YWJJbmRleCA9IC0xLCB0aGlzLmZvY3VzZWRFbW9qaUluZGV4ID0gZTtcbiAgICBjb25zdCBzID0gdGhpcy5nZXRFbW9qaSh0aGlzLmZvY3VzZWRFbW9qaUluZGV4KTtcbiAgICBzLnRhYkluZGV4ID0gMCwgcy5mb2N1cygpO1xuICB9XG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5lbW9qaUNvbnRhaW5lci5kZXN0cm95KCksIHRoaXMuZm9jdXNUcmFwLmRlYWN0aXZhdGUoKSwgc3VwZXIuZGVzdHJveSgpO1xuICB9XG4gIHJlbmRlclN5bmMoKSB7XG4gICAgY29uc3QgZSA9IHtcbiAgICAgIC4uLnRoaXMuZW1vamksXG4gICAgICBza2luczogbnVsbFxuICAgIH0sIHQgPSAodGhpcy5lbW9qaS5za2lucyB8fCBbXSkubWFwKChvKSA9PiAoe1xuICAgICAgLi4ubyxcbiAgICAgIGxhYmVsOiB0aGlzLmVtb2ppLmxhYmVsLFxuICAgICAgdGFnczogdGhpcy5lbW9qaS50YWdzXG4gICAgfSkpLCBzID0gW2UsIC4uLnRdO1xuICAgIHJldHVybiB0aGlzLmVtb2ppQ29udGFpbmVyID0gdGhpcy52aWV3RmFjdG9yeS5jcmVhdGUoRiwge1xuICAgICAgZW1vamlzOiBzLFxuICAgICAgcHJldmlldzogITFcbiAgICB9KSwgc3VwZXIucmVuZGVyU3luYyh7IGVtb2ppczogdGhpcy5lbW9qaUNvbnRhaW5lciB9KSwgcy5sZW5ndGggPCB0aGlzLm9wdGlvbnMuZW1vamlzUGVyUm93ICYmIHRoaXMuZWwuc3R5bGUuc2V0UHJvcGVydHkoXCItLWVtb2ppcy1wZXItcm93XCIsIHMubGVuZ3RoLnRvU3RyaW5nKCkpLCB0aGlzLmVsO1xuICB9XG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuZW1vamlDb250YWluZXIuc2V0QWN0aXZlKCEwLCB7IHJvdzogMCwgb2Zmc2V0OiAwIH0sICEwKSwgdGhpcy5mb2N1c1RyYXAuYWN0aXZhdGUodGhpcy5lbCk7XG4gIH1cbn1cbmNvbnN0IHNzID0gbmV3IHUoKHsgY2xhc3NlczogaSwgaTE4bjogZSwgY2F0ZWdvcnk6IHQsIHBpY2tlcklkOiBzLCBpY29uOiBvIH0pID0+IGBcbjxsaSBjbGFzcz1cIiR7aS5jYXRlZ29yeVRhYn1cIj5cbiAgPGJ1dHRvblxuICAgIGFyaWEtc2VsZWN0ZWQ9XCJmYWxzZVwiXG4gICAgcm9sZT1cInRhYlwiXG4gICAgY2xhc3M9XCIke2kuY2F0ZWdvcnlCdXR0b259XCJcbiAgICB0YWJpbmRleD1cIi0xXCJcbiAgICB0aXRsZT1cIiR7ZS5nZXQoYGNhdGVnb3JpZXMuJHt0LmtleX1gLCB0Lm1lc3NhZ2UgfHwgdC5rZXkpfVwiXG4gICAgdHlwZT1cImJ1dHRvblwiXG4gICAgZGF0YS1jYXRlZ29yeT1cIiR7dC5rZXl9XCJcbiAgICBpZD1cIiR7c30tY2F0ZWdvcnktJHt0LmtleX1cIlxuICA+XG4gICAgPGkgZGF0YS1pY29uPVwiJHtvfVwiPjwvaT5cbjwvbGk+XG5gKSwgRyA9IGcoXG4gIFwiY2F0ZWdvcnlUYWJcIixcbiAgXCJjYXRlZ29yeVRhYkFjdGl2ZVwiLFxuICBcImNhdGVnb3J5QnV0dG9uXCJcbik7XG5jbGFzcyBpcyBleHRlbmRzIGMge1xuICBjb25zdHJ1Y3Rvcih7IGNhdGVnb3J5OiBlLCBpY29uOiB0IH0pIHtcbiAgICBzdXBlcih7IHRlbXBsYXRlOiBzcywgY2xhc3NlczogRyB9KSwgdGhpcy5pc0FjdGl2ZSA9ICExLCB0aGlzLmNhdGVnb3J5ID0gZSwgdGhpcy5pY29uID0gdDtcbiAgfVxuICBpbml0aWFsaXplKCkge1xuICAgIHRoaXMudWlFbGVtZW50cyA9IHtcbiAgICAgIGJ1dHRvbjogYy5ieUNsYXNzKEcuY2F0ZWdvcnlCdXR0b24pXG4gICAgfSwgdGhpcy51aUV2ZW50cyA9IFtcbiAgICAgIGMuY2hpbGRFdmVudChcImJ1dHRvblwiLCBcImNsaWNrXCIsIHRoaXMuc2VsZWN0Q2F0ZWdvcnkpLFxuICAgICAgYy5jaGlsZEV2ZW50KFwiYnV0dG9uXCIsIFwiZm9jdXNcIiwgdGhpcy5zZWxlY3RDYXRlZ29yeSlcbiAgICBdLCBzdXBlci5pbml0aWFsaXplKCk7XG4gIH1cbiAgcmVuZGVyU3luYygpIHtcbiAgICByZXR1cm4gc3VwZXIucmVuZGVyU3luYyh7XG4gICAgICBjYXRlZ29yeTogdGhpcy5jYXRlZ29yeSxcbiAgICAgIGljb246IHRoaXMuaWNvblxuICAgIH0pLCB0aGlzLnVpLmJ1dHRvbi5hcmlhU2VsZWN0ZWQgPSBcImZhbHNlXCIsIHRoaXMuZWw7XG4gIH1cbiAgc2V0QWN0aXZlKGUsIHQgPSB7fSkge1xuICAgIGNvbnN0IHsgY2hhbmdlRm9jdXNhYmxlOiBzLCBwZXJmb3JtRm9jdXM6IG8sIHNjcm9sbDogciB9ID0ge1xuICAgICAgY2hhbmdlRm9jdXNhYmxlOiAhMCxcbiAgICAgIHBlcmZvcm1Gb2N1czogITAsXG4gICAgICBzY3JvbGw6ICEwLFxuICAgICAgLi4udFxuICAgIH07XG4gICAgdGhpcy5lbC5jbGFzc0xpc3QudG9nZ2xlKEcuY2F0ZWdvcnlUYWJBY3RpdmUsIGUpLCBzICYmICh0aGlzLnVpLmJ1dHRvbi50YWJJbmRleCA9IGUgPyAwIDogLTEsIHRoaXMudWkuYnV0dG9uLmFyaWFTZWxlY3RlZCA9IGUudG9TdHJpbmcoKSksIGUgJiYgbyAmJiAodGhpcy51aS5idXR0b24uZm9jdXMoKSwgciAmJiB0aGlzLmV2ZW50cy5lbWl0KFwiY2F0ZWdvcnk6c2VsZWN0XCIsIHRoaXMuY2F0ZWdvcnkua2V5LCB7IHNjcm9sbDogXCJhbmltYXRlXCIsIGZvY3VzOiBcImJ1dHRvblwiLCBwZXJmb3JtRm9jdXM6ICExIH0pKSwgdGhpcy5pc0FjdGl2ZSA9IGU7XG4gIH1cbiAgc2VsZWN0Q2F0ZWdvcnkoKSB7XG4gICAgdGhpcy5pc0FjdGl2ZSB8fCB0aGlzLmV2ZW50cy5lbWl0KFwiY2F0ZWdvcnk6c2VsZWN0XCIsIHRoaXMuY2F0ZWdvcnkua2V5LCB7IHNjcm9sbDogXCJhbmltYXRlXCIsIGZvY3VzOiBcImJ1dHRvblwiLCBwZXJmb3JtRm9jdXM6ICEwIH0pO1xuICB9XG59XG5jb25zdCBvcyA9IG5ldyB1KCh7IGNsYXNzZXM6IGkgfSkgPT4gYFxuICA8ZGl2IGNsYXNzPVwiJHtpLmNhdGVnb3J5QnV0dG9uc0NvbnRhaW5lcn1cIj5cbiAgICA8dWwgcm9sZT1cInRhYmxpc3RcIiBjbGFzcz1cIiR7aS5jYXRlZ29yeUJ1dHRvbnN9XCI+XG4gICAgICA8ZGl2IGRhdGEtcGxhY2Vob2xkZXI9XCJ0YWJzXCI+PC9kaXY+XG4gICAgPC91bD5cbiAgPC9kaXY+XG5gKSwgcnMgPSBnKFwiY2F0ZWdvcnlCdXR0b25zXCIsIFwiY2F0ZWdvcnlCdXR0b25zQ29udGFpbmVyXCIpO1xuY2xhc3MgYXMgZXh0ZW5kcyBjIHtcbiAgY29uc3RydWN0b3IoeyBjYXRlZ29yaWVzOiBlIH0pIHtcbiAgICBzdXBlcih7IHRlbXBsYXRlOiBvcywgY2xhc3NlczogcnMgfSksIHRoaXMuYWN0aXZlQ2F0ZWdvcnlJbmRleCA9IDAsIHRoaXMuY2F0ZWdvcmllcyA9IGU7XG4gIH1cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLmtleUJpbmRpbmdzID0ge1xuICAgICAgQXJyb3dMZWZ0OiB0aGlzLnN0ZXBTZWxlY3RlZFRhYigtMSksXG4gICAgICBBcnJvd1JpZ2h0OiB0aGlzLnN0ZXBTZWxlY3RlZFRhYigxKVxuICAgIH0sIHRoaXMudWlFdmVudHMgPSBbXG4gICAgICBjLnVpRXZlbnQoXCJzY3JvbGxcIiwgdGhpcy5jaGVja092ZXJmbG93KVxuICAgIF0sIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgfVxuICBjaGVja092ZXJmbG93KCkge1xuICAgIGNvbnN0IGUgPSBNYXRoLmFicyh0aGlzLmVsLnNjcm9sbExlZnQgLSAodGhpcy5lbC5zY3JvbGxXaWR0aCAtIHRoaXMuZWwub2Zmc2V0V2lkdGgpKSA+IDEsIHQgPSB0aGlzLmVsLnNjcm9sbExlZnQgPiAwO1xuICAgIHRoaXMuZWwuY2xhc3NOYW1lID0gXCJjYXRlZ29yeUJ1dHRvbnNDb250YWluZXJcIiwgdCAmJiBlID8gdGhpcy5lbC5jbGFzc0xpc3QuYWRkKFwiaGFzLW92ZXJmbG93LWJvdGhcIikgOiB0ID8gdGhpcy5lbC5jbGFzc0xpc3QuYWRkKFwiaGFzLW92ZXJmbG93LWxlZnRcIikgOiBlICYmIHRoaXMuZWwuY2xhc3NMaXN0LmFkZChcImhhcy1vdmVyZmxvdy1yaWdodFwiKTtcbiAgfVxuICByZW5kZXJTeW5jKCkge1xuICAgIHJldHVybiB0aGlzLnRhYlZpZXdzID0gdGhpcy5jYXRlZ29yaWVzLm1hcCgoZSkgPT4gdGhpcy52aWV3RmFjdG9yeS5jcmVhdGUoaXMsIHsgY2F0ZWdvcnk6IGUsIGljb246IERbZS5rZXldIH0pKSwgc3VwZXIucmVuZGVyU3luYyh7XG4gICAgICB0YWJzOiB0aGlzLnRhYlZpZXdzLm1hcCgoZSkgPT4gZS5yZW5kZXJTeW5jKCkpXG4gICAgfSksIHRoaXMuZWw7XG4gIH1cbiAgZ2V0IGN1cnJlbnRDYXRlZ29yeSgpIHtcbiAgICByZXR1cm4gdGhpcy5jYXRlZ29yaWVzW3RoaXMuYWN0aXZlQ2F0ZWdvcnlJbmRleF07XG4gIH1cbiAgZ2V0IGN1cnJlbnRUYWJWaWV3KCkge1xuICAgIHJldHVybiB0aGlzLnRhYlZpZXdzW3RoaXMuYWN0aXZlQ2F0ZWdvcnlJbmRleF07XG4gIH1cbiAgc2V0QWN0aXZlVGFiKGUsIHQgPSB7fSkge1xuICAgIHRoaXMuY2hlY2tPdmVyZmxvdygpO1xuICAgIGNvbnN0IHMgPSB0aGlzLmN1cnJlbnRUYWJWaWV3LCBvID0gdGhpcy50YWJWaWV3c1tlXTtcbiAgICBzLnNldEFjdGl2ZSghMSwgdCksIG8uc2V0QWN0aXZlKCEwLCB0KSwgdGhpcy5hY3RpdmVDYXRlZ29yeUluZGV4ID0gZTtcbiAgfVxuICBnZXRUYXJnZXRDYXRlZ29yeShlKSB7XG4gICAgcmV0dXJuIGUgPCAwID8gdGhpcy5jYXRlZ29yaWVzLmxlbmd0aCAtIDEgOiBlID49IHRoaXMuY2F0ZWdvcmllcy5sZW5ndGggPyAwIDogZTtcbiAgfVxuICBzdGVwU2VsZWN0ZWRUYWIoZSkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb25zdCB0ID0gdGhpcy5hY3RpdmVDYXRlZ29yeUluZGV4ICsgZTtcbiAgICAgIHRoaXMuc2V0QWN0aXZlVGFiKHRoaXMuZ2V0VGFyZ2V0Q2F0ZWdvcnkodCksIHtcbiAgICAgICAgY2hhbmdlRm9jdXNhYmxlOiAhMCxcbiAgICAgICAgcGVyZm9ybUZvY3VzOiAhMFxuICAgICAgfSk7XG4gICAgfTtcbiAgfVxufVxuY29uc3QgbnMgPSBbXG4gIHsgdmVyc2lvbjogMTUsIGVtb2ppOiBTdHJpbmcuZnJvbUNvZGVQb2ludCgxMjk3NjgpIH0sXG4gIHsgdmVyc2lvbjogMTQsIGVtb2ppOiBTdHJpbmcuZnJvbUNvZGVQb2ludCgxMjg3MzMpIH0sXG4gIHsgdmVyc2lvbjogMTMsIGVtb2ppOiBTdHJpbmcuZnJvbUNvZGVQb2ludCgxMjk3MjkpIH0sXG4gIHsgdmVyc2lvbjogMTIsIGVtb2ppOiBTdHJpbmcuZnJvbUNvZGVQb2ludCgxMjk0NDkpIH0sXG4gIHsgdmVyc2lvbjogMTEsIGVtb2ppOiBTdHJpbmcuZnJvbUNvZGVQb2ludCgxMjk0NjMpIH0sXG4gIHsgdmVyc2lvbjogNSwgZW1vamk6IFN0cmluZy5mcm9tQ29kZVBvaW50KDEyOTMyMikgfSxcbiAgeyB2ZXJzaW9uOiA0LCBlbW9qaTogU3RyaW5nLmZyb21Db2RlUG9pbnQoOTg3NykgfSxcbiAgeyB2ZXJzaW9uOiAzLCBlbW9qaTogU3RyaW5nLmZyb21Db2RlUG9pbnQoMTI5MzE0KSB9LFxuICB7IHZlcnNpb246IDIsIGVtb2ppOiBTdHJpbmcuZnJvbUNvZGVQb2ludCgxMjg0ODgpIH0sXG4gIHsgdmVyc2lvbjogMSwgZW1vamk6IFN0cmluZy5mcm9tQ29kZVBvaW50KDEyODUxMikgfVxuXTtcbmZ1bmN0aW9uIGNzKCkge1xuICB2YXIgZTtcbiAgY29uc3QgaSA9IG5zLmZpbmQoKHQpID0+IGxzKHQuZW1vamkpKTtcbiAgcmV0dXJuIChlID0gaSA9PSBudWxsID8gdm9pZCAwIDogaS52ZXJzaW9uKSAhPSBudWxsID8gZSA6IDE7XG59XG5mdW5jdGlvbiBscyhpKSB7XG4gIGNvbnN0IGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLmdldENvbnRleHQoXCIyZFwiKTtcbiAgaWYgKGUpXG4gICAgcmV0dXJuIGUudGV4dEJhc2VsaW5lID0gXCJ0b3BcIiwgZS5mb250ID0gXCIzMnB4IEFyaWFsXCIsIGUuZmlsbFRleHQoaSwgMCwgMCksIGUuZ2V0SW1hZ2VEYXRhKDE2LCAxNiwgMSwgMSkuZGF0YVswXSAhPT0gMDtcbn1cbmZ1bmN0aW9uIFcoaSwgZSkge1xuICByZXR1cm4gQXJyYXkuZnJvbSh7IGxlbmd0aDogaSB9LCAoKSA9PiBlKS5qb2luKFwiXCIpO1xufVxuZnVuY3Rpb24gaHMoeyBzaG93SGVhZGVyOiBpLCBjbGFzc2VzOiBlIH0pIHtcbiAgcmV0dXJuIGkgPyBgXG4gICAgPGhlYWRlciBjbGFzcz1cIiR7ZS5oZWFkZXJ9XCI+XG4gICAgICA8ZGl2IGRhdGEtdmlldz1cInNlYXJjaFwiPjwvZGl2PlxuICAgICAgPGRpdiBkYXRhLXZpZXc9XCJjYXRlZ29yeVRhYnNcIiBkYXRhLXJlbmRlcj1cInN5bmNcIj48L2Rpdj5cbiAgICA8L2hlYWRlcj5cbiAgYCA6IFwiXCI7XG59XG5mdW5jdGlvbiBkcyhpKSB7XG4gIGNvbnN0IHsgY2xhc3NlczogZSwgdGhlbWU6IHQsIGNsYXNzTmFtZTogcyA9IFwiXCIgfSA9IGk7XG4gIHJldHVybiBgXG4gICAgPGRpdiBjbGFzcz1cInBpY21vLXBpY2tlciAke2UucGlja2VyfSAke3R9ICR7c31cIj5cbiAgICAgICR7aHMoaSl9XG4gICAgICA8ZGl2IGNsYXNzPVwiJHtlLmNvbnRlbnR9XCI+XG4gICAgICAgIDxkaXYgZGF0YS12aWV3PVwiZW1vamlBcmVhXCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgZGF0YS12aWV3PVwicHJldmlld1wiPjwvZGl2PlxuICAgIDwvZGl2PlxuICBgO1xufVxuZnVuY3Rpb24gbXMoaSkge1xuICBjb25zdCB7IGVtb2ppQ291bnQ6IGUsIGNsYXNzZXM6IHQsIHRoZW1lOiBzLCBjbGFzc05hbWU6IG8sIGNhdGVnb3J5Q291bnQ6IHIgfSA9IGksIGEgPSAoeyBzaG93U2VhcmNoOiBkLCBjbGFzc2VzOiBoIH0pID0+IGQgPyBgXG4gICAgPGRpdiBjbGFzcz1cIiR7aC5zZWFyY2hTa2VsZXRvbn1cIj5cbiAgICAgIDxkaXYgY2xhc3M9XCIke2guc2VhcmNoSW5wdXR9ICR7aC5wbGFjZWhvbGRlcn1cIj48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYCA6IFwiXCIsIG4gPSAoeyBzaG93Q2F0ZWdvcnlUYWJzOiBkLCBjbGFzc2VzOiBoIH0pID0+IGQgPyBgXG4gICAgPGRpdiBjbGFzcz1cIiR7aC5jYXRlZ29yeVRhYnNTa2VsZXRvbn1cIj5cbiAgICAgICR7VyhyLCBgPGRpdiBjbGFzcz1cIiR7aC5wbGFjZWhvbGRlcn0gJHtoLmNhdGVnb3J5VGFifVwiPjwvZGl2PmApfVxuICAgIDwvZGl2PlxuICBgIDogXCJcIiwgbCA9ICh7IHNob3dIZWFkZXI6IGQsIGNsYXNzZXM6IGggfSkgPT4gZCA/IGBcbiAgICA8aGVhZGVyIGNsYXNzPVwiJHtoLmhlYWRlclNrZWxldG9ufVwiPlxuICAgICAgJHthKGkpfVxuICAgICAgJHtuKGkpfVxuICAgIDwvaGVhZGVyPlxuICBgIDogXCJcIiwgbSA9ICh7IHNob3dQcmV2aWV3OiBkLCBjbGFzc2VzOiBoIH0pID0+IGQgPyBgXG4gICAgPGRpdiBjbGFzcz1cIiR7aC5wcmV2aWV3U2tlbGV0b259XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiJHtoLnBsYWNlaG9sZGVyfSAke2gucHJldmlld0Vtb2ppfVwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cIiR7aC5wbGFjZWhvbGRlcn0gJHtoLnByZXZpZXdOYW1lfVwiPjwvZGl2PlxuICAgICAgPHVsIGNsYXNzPVwiJHtoLnRhZ0xpc3R9XCI+XG4gICAgICAgICR7VygzLCBgPGxpIGNsYXNzPVwiJHtoLnBsYWNlaG9sZGVyfSAke2gudGFnfVwiPjwvbGk+YCl9XG4gICAgICA8L3VsPlxuICAgIDwvZGl2PlxuICBgIDogXCJcIjtcbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGNsYXNzPVwicGljbW8tcGlja2VyICR7dC5za2VsZXRvbn0gJHt0LnBpY2tlcn0gJHtzfSAke299XCI+XG4gICAgICAke2woaSl9XG4gICAgICA8ZGl2IGNsYXNzPVwiJHt0LmNvbnRlbnRTa2VsZXRvbn1cIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7dC5wbGFjZWhvbGRlcn0gJHt0LmNhdGVnb3J5TmFtZX1cIj48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7dC5lbW9qaUdyaWR9XCI+XG4gICAgICAgICAgJHtXKGUsIGA8ZGl2IGNsYXNzPVwiJHt0LnBsYWNlaG9sZGVyfSAke3QuZW1vaml9XCI+PC9kaXY+YCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICAke20oaSl9XG4gICAgPC9kaXY+XG4gIGA7XG59XG5jb25zdCB1cyA9IG5ldyB1KChpKSA9PiBpLmlzTG9hZGVkID8gZHMoaSkgOiBtcyhpKSksIFQgPSBnKFxuICBcInBpY2tlclwiLFxuICBcInNrZWxldG9uXCIsXG4gIFwicGxhY2Vob2xkZXJcIixcbiAgXCJzZWFyY2hTa2VsZXRvblwiLFxuICBcInNlYXJjaElucHV0XCIsXG4gIFwiY2F0ZWdvcnlUYWJzU2tlbGV0b25cIixcbiAgXCJoZWFkZXJTa2VsZXRvblwiLFxuICBcImNhdGVnb3J5VGFiXCIsXG4gIFwiY29udGVudFNrZWxldG9uXCIsXG4gIFwiY2F0ZWdvcnlOYW1lXCIsXG4gIFwiZW1vamlHcmlkXCIsXG4gIFwiZW1vamlcIixcbiAgXCJwcmV2aWV3U2tlbGV0b25cIixcbiAgXCJwcmV2aWV3RW1vamlcIixcbiAgXCJwcmV2aWV3TmFtZVwiLFxuICBcInRhZ0xpc3RcIixcbiAgXCJ0YWdcIixcbiAgXCJvdmVybGF5XCIsXG4gIFwiY29udGVudFwiLFxuICBcImZ1bGxIZWlnaHRcIixcbiAgXCJwbHVnaW5Db250YWluZXJcIixcbiAgXCJoZWFkZXJcIlxuKSwgUiA9IHtcbiAgZW1vamlzUGVyUm93OiBcIi0tZW1vamlzLXBlci1yb3dcIixcbiAgdmlzaWJsZVJvd3M6IFwiLS1yb3ctY291bnRcIixcbiAgZW1vamlTaXplOiBcIi0tZW1vamktc2l6ZVwiXG59O1xuY2xhc3MgZ3MgZXh0ZW5kcyBjIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoeyB0ZW1wbGF0ZTogdXMsIGNsYXNzZXM6IFQgfSksIHRoaXMucGlja2VyUmVhZHkgPSAhMSwgdGhpcy5leHRlcm5hbEV2ZW50cyA9IG5ldyBTdCgpLCB0aGlzLnVwZGF0ZXJzID0ge1xuICAgICAgc3R5bGVQcm9wZXJ0eTogKGUpID0+ICh0KSA9PiB0aGlzLmVsLnN0eWxlLnNldFByb3BlcnR5KFJbZV0sIHQudG9TdHJpbmcoKSksXG4gICAgICB0aGVtZTogKGUpID0+IHtcbiAgICAgICAgY29uc3QgdCA9IHRoaXMub3B0aW9ucy50aGVtZSwgcyA9IHRoaXMuZWwuY2xvc2VzdChgLiR7dH1gKTtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKHQpLCBzID09IG51bGwgfHwgcy5jbGFzc0xpc3QucmVtb3ZlKHQpLCB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoZSksIHMgPT0gbnVsbCB8fCBzLmNsYXNzTGlzdC5hZGQoZSk7XG4gICAgICB9LFxuICAgICAgY2xhc3NOYW1lOiAoZSkgPT4ge1xuICAgICAgICB0aGlzLm9wdGlvbnMuY2xhc3NOYW1lICYmIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLm9wdGlvbnMuY2xhc3NOYW1lKSwgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKGUpO1xuICAgICAgfSxcbiAgICAgIGVtb2ppc1BlclJvdzogdGhpcy51cGRhdGVTdHlsZVByb3BlcnR5LmJpbmQodGhpcywgXCJlbW9qaXNQZXJSb3dcIiksXG4gICAgICBlbW9qaVNpemU6IHRoaXMudXBkYXRlU3R5bGVQcm9wZXJ0eS5iaW5kKHRoaXMsIFwiZW1vamlTaXplXCIpLFxuICAgICAgdmlzaWJsZVJvd3M6IHRoaXMudXBkYXRlU3R5bGVQcm9wZXJ0eS5iaW5kKHRoaXMsIFwidmlzaWJsZVJvd3NcIilcbiAgICB9O1xuICB9XG4gIGluaXRpYWxpemUoKSB7XG4gICAgdGhpcy51aUVsZW1lbnRzID0ge1xuICAgICAgcGlja2VyQ29udGVudDogYy5ieUNsYXNzKFQuY29udGVudCksXG4gICAgICBoZWFkZXI6IGMuYnlDbGFzcyhULmhlYWRlcilcbiAgICB9LCB0aGlzLnVpRXZlbnRzID0gW1xuICAgICAgYy51aUV2ZW50KFwia2V5ZG93blwiLCB0aGlzLmhhbmRsZUtleURvd24pXG4gICAgXSwgdGhpcy5hcHBFdmVudHMgPSB7XG4gICAgICBlcnJvcjogdGhpcy5vbkVycm9yLFxuICAgICAgcmVpbml0aWFsaXplOiB0aGlzLnJlaW5pdGlhbGl6ZSxcbiAgICAgIFwiZGF0YTpyZWFkeVwiOiB0aGlzLm9uRGF0YVJlYWR5LFxuICAgICAgXCJjb250ZW50OnNob3dcIjogdGhpcy5zaG93Q29udGVudCxcbiAgICAgIFwidmFyaWFudFBvcHVwOmhpZGVcIjogdGhpcy5oaWRlVmFyaWFudFBvcHVwLFxuICAgICAgXCJlbW9qaTpzZWxlY3RcIjogdGhpcy5zZWxlY3RFbW9qaVxuICAgIH0sIHN1cGVyLmluaXRpYWxpemUoKSwgdGhpcy5vcHRpb25zLnJlY2VudHNQcm92aWRlcjtcbiAgfVxuICBkZXN0cm95KCkge1xuICAgIHZhciBlLCB0O1xuICAgIHN1cGVyLmRlc3Ryb3koKSwgKGUgPSB0aGlzLnNlYXJjaCkgPT0gbnVsbCB8fCBlLmRlc3Ryb3koKSwgdGhpcy5lbW9qaUFyZWEuZGVzdHJveSgpLCAodCA9IHRoaXMuY2F0ZWdvcnlUYWJzKSA9PSBudWxsIHx8IHQuZGVzdHJveSgpLCB0aGlzLmV2ZW50cy5yZW1vdmVBbGwoKSwgdGhpcy5leHRlcm5hbEV2ZW50cy5yZW1vdmVBbGwoKTtcbiAgfVxuICBjbGVhclJlY2VudHMoKSB7XG4gICAgdGhpcy5vcHRpb25zLnJlY2VudHNQcm92aWRlci5jbGVhcigpO1xuICB9XG4gIGFkZEV2ZW50TGlzdGVuZXIoZSwgdCkge1xuICAgIHRoaXMuZXh0ZXJuYWxFdmVudHMub24oZSwgdCk7XG4gIH1cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihlLCB0KSB7XG4gICAgdGhpcy5leHRlcm5hbEV2ZW50cy5vZmYoZSwgdCk7XG4gIH1cbiAgaW5pdGlhbGl6ZVBpY2tlclZpZXcoKSB7XG4gICAgdGhpcy5waWNrZXJSZWFkeSAmJiAodGhpcy5zaG93Q29udGVudCgpLCB0aGlzLmVtb2ppQXJlYS5yZXNldCghMSkpO1xuICB9XG4gIGhhbmRsZUtleURvd24oZSkge1xuICAgIGNvbnN0IHQgPSBlLmN0cmxLZXkgfHwgZS5tZXRhS2V5O1xuICAgIGUua2V5ID09PSBcInNcIiAmJiB0ICYmIHRoaXMuc2VhcmNoICYmIChlLnByZXZlbnREZWZhdWx0KCksIHRoaXMuc2VhcmNoLmZvY3VzKCkpO1xuICB9XG4gIGJ1aWxkQ2hpbGRWaWV3cygpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLnNob3dQcmV2aWV3ICYmICh0aGlzLnByZXZpZXcgPSB0aGlzLnZpZXdGYWN0b3J5LmNyZWF0ZShZdCkpLCB0aGlzLm9wdGlvbnMuc2hvd1NlYXJjaCAmJiAodGhpcy5zZWFyY2ggPSB0aGlzLnZpZXdGYWN0b3J5LmNyZWF0ZShadCwge1xuICAgICAgY2F0ZWdvcmllczogdGhpcy5jYXRlZ29yaWVzLFxuICAgICAgZW1vamlWZXJzaW9uOiB0aGlzLmVtb2ppVmVyc2lvblxuICAgIH0pKSwgdGhpcy5vcHRpb25zLnNob3dDYXRlZ29yeVRhYnMgJiYgKHRoaXMuY2F0ZWdvcnlUYWJzID0gdGhpcy52aWV3RmFjdG9yeS5jcmVhdGUoYXMsIHtcbiAgICAgIGNhdGVnb3JpZXM6IHRoaXMuY2F0ZWdvcmllc1xuICAgIH0pKSwgdGhpcy5jdXJyZW50VmlldyA9IHRoaXMuZW1vamlBcmVhID0gdGhpcy52aWV3RmFjdG9yeS5jcmVhdGUoVXQsIHtcbiAgICAgIGNhdGVnb3J5VGFiczogdGhpcy5jYXRlZ29yeVRhYnMsXG4gICAgICBjYXRlZ29yaWVzOiB0aGlzLmNhdGVnb3JpZXMsXG4gICAgICBlbW9qaVZlcnNpb246IHRoaXMuZW1vamlWZXJzaW9uXG4gICAgfSksIFt0aGlzLnByZXZpZXcsIHRoaXMuc2VhcmNoLCB0aGlzLmVtb2ppQXJlYSwgdGhpcy5jYXRlZ29yeVRhYnNdO1xuICB9XG4gIHNldFN0eWxlUHJvcGVydGllcygpIHtcbiAgICB0aGlzLm9wdGlvbnMuc2hvd1NlYXJjaCB8fCB0aGlzLmVsLnN0eWxlLnNldFByb3BlcnR5KFwiLS1zZWFyY2gtaGVpZ2h0LWZ1bGxcIiwgXCIwcHhcIiksIHRoaXMub3B0aW9ucy5zaG93Q2F0ZWdvcnlUYWJzIHx8ICh0aGlzLmVsLnN0eWxlLnNldFByb3BlcnR5KFwiLS1jYXRlZ29yeS10YWJzLWhlaWdodFwiLCBcIjBweFwiKSwgdGhpcy5lbC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tY2F0ZWdvcnktdGFicy1vZmZzZXRcIiwgXCIwcHhcIikpLCB0aGlzLm9wdGlvbnMuc2hvd1ByZXZpZXcgfHwgdGhpcy5lbC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tZW1vamktcHJldmlldy1oZWlnaHQtZnVsbFwiLCBcIjBweFwiKSwgT2JqZWN0LmtleXMoUikuZm9yRWFjaCgoZSkgPT4ge1xuICAgICAgdGhpcy5vcHRpb25zW2VdICYmIHRoaXMuZWwuc3R5bGUuc2V0UHJvcGVydHkoUltlXSwgdGhpcy5vcHRpb25zW2VdLnRvU3RyaW5nKCkpO1xuICAgIH0pO1xuICB9XG4gIHVwZGF0ZVN0eWxlUHJvcGVydHkoZSwgdCkge1xuICAgIHRoaXMuZWwuc3R5bGUuc2V0UHJvcGVydHkoUltlXSwgdC50b1N0cmluZygpKTtcbiAgfVxuICByZWluaXRpYWxpemUoKSB7XG4gICAgdGhpcy5yZW5kZXJTeW5jKCk7XG4gIH1cbiAgb25FcnJvcihlKSB7XG4gICAgY29uc3QgdCA9IHRoaXMudmlld0ZhY3RvcnkuY3JlYXRlKFd0LCB7IG1lc3NhZ2U6IHRoaXMuaTE4bi5nZXQoXCJlcnJvci5sb2FkXCIpIH0pLCBzID0gdGhpcy5lbC5vZmZzZXRIZWlnaHQgfHwgMzc1O1xuICAgIHRocm93IHRoaXMuZWwuc3R5bGUuaGVpZ2h0ID0gYCR7c31weGAsIHRoaXMuZWwucmVwbGFjZUNoaWxkcmVuKHQucmVuZGVyU3luYygpKSwgZTtcbiAgfVxuICBhc3luYyBvbkRhdGFSZWFkeShlKSB7XG4gICAgY29uc3QgdCA9IHRoaXMuZWw7XG4gICAgdHJ5IHtcbiAgICAgIGUgPyB0aGlzLmVtb2ppRGF0YSA9IGUgOiBhd2FpdCB0aGlzLmVtb2ppRGF0YVByb21pc2UsIHRoaXMub3B0aW9ucy5lbW9qaVZlcnNpb24gPT09IFwiYXV0b1wiID8gdGhpcy5lbW9qaVZlcnNpb24gPSBjcygpIHx8IHBhcnNlRmxvYXQoJGUpIDogdGhpcy5lbW9qaVZlcnNpb24gPSB0aGlzLm9wdGlvbnMuZW1vamlWZXJzaW9uLCB0aGlzLmNhdGVnb3JpZXMgPSBhd2FpdCB0aGlzLmVtb2ppRGF0YS5nZXRDYXRlZ29yaWVzKHRoaXMub3B0aW9ucyk7XG4gICAgICBjb25zdCBbcywgbywgciwgYV0gPSB0aGlzLmJ1aWxkQ2hpbGRWaWV3cygpO1xuICAgICAgYXdhaXQgc3VwZXIucmVuZGVyKHtcbiAgICAgICAgaXNMb2FkZWQ6ICEwLFxuICAgICAgICBzZWFyY2g6IG8sXG4gICAgICAgIGNhdGVnb3J5VGFiczogYSxcbiAgICAgICAgZW1vamlBcmVhOiByLFxuICAgICAgICBwcmV2aWV3OiBzLFxuICAgICAgICBzaG93SGVhZGVyOiBCb29sZWFuKHRoaXMuc2VhcmNoIHx8IHRoaXMuY2F0ZWdvcnlUYWJzKSxcbiAgICAgICAgdGhlbWU6IHRoaXMub3B0aW9ucy50aGVtZSxcbiAgICAgICAgY2xhc3NOYW1lOiB0aGlzLm9wdGlvbnMuY2xhc3NOYW1lXG4gICAgICB9KSwgdGhpcy5lbC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tY2F0ZWdvcnktY291bnRcIiwgdGhpcy5jYXRlZ29yaWVzLmxlbmd0aC50b1N0cmluZygpKSwgdGhpcy5waWNrZXJSZWFkeSA9ICEwLCB0LnJlcGxhY2VXaXRoKHRoaXMuZWwpLCB0aGlzLnNldFN0eWxlUHJvcGVydGllcygpLCB0aGlzLmluaXRpYWxpemVQaWNrZXJWaWV3KCksIHRoaXMuc2V0SW5pdGlhbEZvY3VzKCksIHRoaXMuZXh0ZXJuYWxFdmVudHMuZW1pdChcImRhdGE6cmVhZHlcIik7XG4gICAgfSBjYXRjaCAocykge1xuICAgICAgdGhpcy5ldmVudHMuZW1pdChcImVycm9yXCIsIHMpO1xuICAgIH1cbiAgfVxuICByZW5kZXJTeW5jKCkge1xuICAgIHZhciB0O1xuICAgIGxldCBlID0gKCh0ID0gdGhpcy5vcHRpb25zLmNhdGVnb3JpZXMpID09IG51bGwgPyB2b2lkIDAgOiB0Lmxlbmd0aCkgfHwgMTA7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaG93UmVjZW50cyAmJiAoZSArPSAxKSwgc3VwZXIucmVuZGVyU3luYyh7XG4gICAgICBpc0xvYWRlZDogITEsXG4gICAgICB0aGVtZTogdGhpcy5vcHRpb25zLnRoZW1lLFxuICAgICAgc2hvd1NlYXJjaDogdGhpcy5vcHRpb25zLnNob3dTZWFyY2gsXG4gICAgICBzaG93UHJldmlldzogdGhpcy5vcHRpb25zLnNob3dQcmV2aWV3LFxuICAgICAgc2hvd0NhdGVnb3J5VGFiczogdGhpcy5vcHRpb25zLnNob3dDYXRlZ29yeVRhYnMsXG4gICAgICBzaG93SGVhZGVyOiB0aGlzLm9wdGlvbnMuc2hvd1NlYXJjaCB8fCB0aGlzLm9wdGlvbnMuc2hvd0NhdGVnb3J5VGFicyxcbiAgICAgIGVtb2ppQ291bnQ6IHRoaXMub3B0aW9ucy5lbW9qaXNQZXJSb3cgKiB0aGlzLm9wdGlvbnMudmlzaWJsZVJvd3MsXG4gICAgICBjYXRlZ29yeUNvdW50OiBlXG4gICAgfSksIHRoaXMuZWwuc3R5bGUuc2V0UHJvcGVydHkoXCItLWNhdGVnb3J5LWNvdW50XCIsIGUudG9TdHJpbmcoKSksICF0aGlzLm9wdGlvbnMucm9vdEVsZW1lbnQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQaWNrZXIgbXVzdCBiZSBnaXZlbiBhIHJvb3QgZWxlbWVudCB2aWEgdGhlIHJvb3RFbGVtZW50IG9wdGlvblwiKTtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLnJvb3RFbGVtZW50LnJlcGxhY2VDaGlsZHJlbih0aGlzLmVsKSwgdGhpcy5zZXRTdHlsZVByb3BlcnRpZXMoKSwgdGhpcy5waWNrZXJSZWFkeSAmJiB0aGlzLmluaXRpYWxpemVQaWNrZXJWaWV3KCksIHRoaXMuZWw7XG4gIH1cbiAgZ2V0SW5pdGlhbEZvY3VzVGFyZ2V0KCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmF1dG9Gb2N1cyA8IFwidVwiKVxuICAgICAgc3dpdGNoICh0aGlzLm9wdGlvbnMuYXV0b0ZvY3VzKSB7XG4gICAgICAgIGNhc2UgXCJlbW9qaXNcIjpcbiAgICAgICAgICByZXR1cm4gdGhpcy5lbW9qaUFyZWEuZm9jdXNhYmxlRW1vamk7XG4gICAgICAgIGNhc2UgXCJzZWFyY2hcIjpcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2g7XG4gICAgICAgIGNhc2UgXCJhdXRvXCI6XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoIHx8IHRoaXMuZW1vamlBcmVhLmZvY3VzYWJsZUVtb2ppO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b0ZvY3VzU2VhcmNoID09PSAhMClcbiAgICAgIHJldHVybiBjb25zb2xlLndhcm4oXCJvcHRpb25zLmF1dG9Gb2N1c1NlYXJjaCBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIG9wdGlvbnMuZm9jdXNUYXJnZXQgaW5zdGVhZFwiKSwgdGhpcy5zZWFyY2g7XG4gIH1cbiAgc2V0SW5pdGlhbEZvY3VzKCkge1xuICAgIHZhciBlO1xuICAgICF0aGlzLnBpY2tlclJlYWR5IHx8IChlID0gdGhpcy5nZXRJbml0aWFsRm9jdXNUYXJnZXQoKSkgPT0gbnVsbCB8fCBlLmZvY3VzKCk7XG4gIH1cbiAgcmVzZXQoZSA9ICEwKSB7XG4gICAgdmFyIHQ7XG4gICAgdGhpcy5waWNrZXJSZWFkeSAmJiAodGhpcy5lbW9qaUFyZWEucmVzZXQoZSksIHRoaXMuc2hvd0NvbnRlbnQodGhpcy5lbW9qaUFyZWEpKSwgKHQgPSB0aGlzLnNlYXJjaCkgPT0gbnVsbCB8fCB0LmNsZWFyKCksIHRoaXMuaGlkZVZhcmlhbnRQb3B1cCgpO1xuICB9XG4gIHNob3dDb250ZW50KGUgPSB0aGlzLmVtb2ppQXJlYSkge1xuICAgIHZhciB0LCBzO1xuICAgIGUgIT09IHRoaXMuY3VycmVudFZpZXcgJiYgKHRoaXMuY3VycmVudFZpZXcgIT09IHRoaXMuZW1vamlBcmVhICYmICgodCA9IHRoaXMuY3VycmVudFZpZXcpID09IG51bGwgfHwgdC5kZXN0cm95KCkpLCB0aGlzLnVpLnBpY2tlckNvbnRlbnQuY2xhc3NMaXN0LnRvZ2dsZShULmZ1bGxIZWlnaHQsIGUgIT09IHRoaXMuZW1vamlBcmVhKSwgdGhpcy51aS5waWNrZXJDb250ZW50LnJlcGxhY2VDaGlsZHJlbihlLmVsKSwgdGhpcy5jdXJyZW50VmlldyA9IGUsIGUgPT09IHRoaXMuZW1vamlBcmVhID8gKHRoaXMuZW1vamlBcmVhLnJlc2V0KCksIHRoaXMuY2F0ZWdvcnlUYWJzICYmIHRoaXMudWkuaGVhZGVyLmFwcGVuZENoaWxkKHRoaXMuY2F0ZWdvcnlUYWJzLmVsKSkgOiAocyA9IHRoaXMuY2F0ZWdvcnlUYWJzKSA9PSBudWxsIHx8IHMuZWwucmVtb3ZlKCkpO1xuICB9XG4gIGhpZGVWYXJpYW50UG9wdXAoKSB7XG4gICAgdmFyIGU7XG4gICAgKGUgPSB0aGlzLnZhcmlhbnRQb3B1cCkgPT0gbnVsbCB8fCBlLmRlc3Ryb3koKTtcbiAgfVxuICBpc1BpY2tlckNsaWNrKGUpIHtcbiAgICB2YXIgciwgYTtcbiAgICBjb25zdCB0ID0gZS50YXJnZXQsIHMgPSB0aGlzLmVsLmNvbnRhaW5zKHQpLCBvID0gKGEgPSAociA9IHRoaXMudmFyaWFudFBvcHVwKSA9PSBudWxsID8gdm9pZCAwIDogci5lbCkgPT0gbnVsbCA/IHZvaWQgMCA6IGEuY29udGFpbnModCk7XG4gICAgcmV0dXJuIHMgfHwgbztcbiAgfVxuICBhc3luYyBzZWxlY3RFbW9qaSh7IGVtb2ppOiBlIH0pIHtcbiAgICB2YXIgdCwgcztcbiAgICAoKHQgPSBlLnNraW5zKSA9PSBudWxsID8gdm9pZCAwIDogdC5sZW5ndGgpICYmIHRoaXMub3B0aW9ucy5zaG93VmFyaWFudHMgJiYgIXRoaXMuaXNWYXJpYW50UG9wdXBPcGVuID8gdGhpcy5zaG93VmFyaWFudFBvcHVwKGUpIDogKGF3YWl0ICgocyA9IHRoaXMudmFyaWFudFBvcHVwKSA9PSBudWxsID8gdm9pZCAwIDogcy5hbmltYXRlSGlkZSgpKSwgdGhpcy5ldmVudHMuZW1pdChcInZhcmlhbnRQb3B1cDpoaWRlXCIpLCBhd2FpdCB0aGlzLmVtaXRFbW9qaShlKSk7XG4gIH1cbiAgZ2V0IGlzVmFyaWFudFBvcHVwT3BlbigpIHtcbiAgICByZXR1cm4gdGhpcy52YXJpYW50UG9wdXAgJiYgIXRoaXMudmFyaWFudFBvcHVwLmlzRGVzdHJveWVkO1xuICB9XG4gIGFzeW5jIHNob3dWYXJpYW50UG9wdXAoZSkge1xuICAgIGNvbnN0IHQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIHRoaXMuZXZlbnRzLm9uY2UoXCJ2YXJpYW50UG9wdXA6aGlkZVwiLCAoKSA9PiB7XG4gICAgICB0ID09IG51bGwgfHwgdC5mb2N1cygpO1xuICAgIH0pLCB0aGlzLnZhcmlhbnRQb3B1cCA9IHRoaXMudmlld0ZhY3RvcnkuY3JlYXRlKHRzLCB7IGVtb2ppOiBlLCBwYXJlbnQ6IHRoaXMuZWwgfSksIHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy52YXJpYW50UG9wdXAucmVuZGVyU3luYygpKSwgdGhpcy52YXJpYW50UG9wdXAuYWN0aXZhdGUoKTtcbiAgfVxuICBhc3luYyBlbWl0RW1vamkoZSkge1xuICAgIHRoaXMuZXh0ZXJuYWxFdmVudHMuZW1pdChcImVtb2ppOnNlbGVjdFwiLCBhd2FpdCB0aGlzLnJlbmRlcmVyLmRvRW1pdChlKSksIHRoaXMub3B0aW9ucy5yZWNlbnRzUHJvdmlkZXIuYWRkT3JVcGRhdGVSZWNlbnQoZSwgdGhpcy5vcHRpb25zLm1heFJlY2VudHMpLCB0aGlzLmV2ZW50cy5lbWl0KFwicmVjZW50OmFkZFwiLCBlKTtcbiAgfVxuICB1cGRhdGVPcHRpb25zKGUpIHtcbiAgICBPYmplY3Qua2V5cyhlKS5mb3JFYWNoKCh0KSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZXJzW3RdKGVbdF0pO1xuICAgIH0pLCBPYmplY3QuYXNzaWduKHRoaXMub3B0aW9ucywgZSk7XG4gIH1cbn1cbmNsYXNzIHBzIHtcbiAgY29uc3RydWN0b3IoeyBldmVudHM6IGUsIGkxOG46IHQsIHJlbmRlcmVyOiBzLCBlbW9qaURhdGE6IG8sIG9wdGlvbnM6IHIsIGN1c3RvbUVtb2ppczogYSA9IFtdLCBwaWNrZXJJZDogbiB9KSB7XG4gICAgdGhpcy5ldmVudHMgPSBlLCB0aGlzLmkxOG4gPSB0LCB0aGlzLnJlbmRlcmVyID0gcywgdGhpcy5lbW9qaURhdGEgPSBvLCB0aGlzLm9wdGlvbnMgPSByLCB0aGlzLmN1c3RvbUVtb2ppcyA9IGEsIHRoaXMucGlja2VySWQgPSBuO1xuICB9XG4gIHNldEVtb2ppRGF0YShlKSB7XG4gICAgdGhpcy5lbW9qaURhdGEgPSBQcm9taXNlLnJlc29sdmUoZSk7XG4gIH1cbiAgY3JlYXRlKGUsIC4uLnQpIHtcbiAgICBjb25zdCBzID0gbmV3IGUoLi4udCk7XG4gICAgcmV0dXJuIHMuc2V0UGlja2VySWQodGhpcy5waWNrZXJJZCksIHMuc2V0RXZlbnRzKHRoaXMuZXZlbnRzKSwgcy5zZXRJMThuKHRoaXMuaTE4biksIHMuc2V0UmVuZGVyZXIodGhpcy5yZW5kZXJlciksIHMuc2V0RW1vamlEYXRhKHRoaXMuZW1vamlEYXRhKSwgcy5zZXRPcHRpb25zKHRoaXMub3B0aW9ucyksIHMuc2V0Q3VzdG9tRW1vamlzKHRoaXMuY3VzdG9tRW1vamlzKSwgcy52aWV3RmFjdG9yeSA9IHRoaXMsIHMuaW5pdGlhbGl6ZSgpLCBzO1xuICB9XG59XG52YXIgTDtcbmNsYXNzIHlzIHtcbiAgY29uc3RydWN0b3IoZSA9IHt9KSB7XG4gICAgZih0aGlzLCBMLCB2b2lkIDApO1xuICAgIEEodGhpcywgTCwgbmV3IE1hcChPYmplY3QuZW50cmllcyhlKSkpO1xuICB9XG4gIGdldChlLCB0ID0gZSkge1xuICAgIHJldHVybiB5KHRoaXMsIEwpLmdldChlKSB8fCB0O1xuICB9XG59XG5MID0gbmV3IFdlYWtNYXAoKTtcbmZ1bmN0aW9uIGZzKGksIGUpIHtcbiAgZSA9PT0gdm9pZCAwICYmIChlID0ge30pO1xuICB2YXIgdCA9IGUuaW5zZXJ0QXQ7XG4gIGlmICghKCFpIHx8IHR5cGVvZiBkb2N1bWVudCA+IFwidVwiKSkge1xuICAgIHZhciBzID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0sIG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gICAgby50eXBlID0gXCJ0ZXh0L2Nzc1wiLCB0ID09PSBcInRvcFwiICYmIHMuZmlyc3RDaGlsZCA/IHMuaW5zZXJ0QmVmb3JlKG8sIHMuZmlyc3RDaGlsZCkgOiBzLmFwcGVuZENoaWxkKG8pLCBvLnN0eWxlU2hlZXQgPyBvLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGkgOiBvLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGkpKTtcbiAgfVxufVxuZnVuY3Rpb24gdnMoKSB7XG4gIGxldCBpID0gITE7XG4gIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgRXQuaW5qZWN0U3R5bGVzICYmICFpICYmIChmcyh0KSwgaSA9ICEwKTtcbiAgfTtcbn1cbmNvbnN0IHdzID0gYC5waWNtby1waWNrZXIgLmljb257d2lkdGg6MS4yNWVtO2hlaWdodDoxZW07ZmlsbDpjdXJyZW50Q29sb3J9Lmljb24tc21hbGx7Zm9udC1zaXplOi44ZW19Lmljb24tbWVkaXVte2ZvbnQtc2l6ZToxZW19Lmljb24tbGFyZ2V7Zm9udC1zaXplOjEuMjVlbX0uaWNvbi0yeHtmb250LXNpemU6MmVtfS5pY29uLTN4e2ZvbnQtc2l6ZTozZW19Lmljb24tNHh7Zm9udC1zaXplOjRlbX0uaWNvbi01eHtmb250LXNpemU6NWVtfS5pY29uLTh4e2ZvbnQtc2l6ZTo4ZW19Lmljb24tMTB4e2ZvbnQtc2l6ZToxMGVtfS5saWdodCwuYXV0b3tjb2xvci1zY2hlbWU6bGlnaHQ7LS1hY2NlbnQtY29sb3I6ICM0ZjQ2ZTU7LS1iYWNrZ3JvdW5kLWNvbG9yOiAjZjlmYWZiOy0tYm9yZGVyLWNvbG9yOiAjY2NjY2NjOy0tY2F0ZWdvcnktbmFtZS1iYWNrZ3JvdW5kLWNvbG9yOiAjZjlmYWZiOy0tY2F0ZWdvcnktbmFtZS1idXR0b24tY29sb3I6ICM5OTk5OTk7LS1jYXRlZ29yeS1uYW1lLXRleHQtY29sb3I6IGhzbCgyMTQsIDMwJSwgNTAlKTstLWNhdGVnb3J5LXRhYi1hY3RpdmUtYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAuNik7LS1jYXRlZ29yeS10YWItYWN0aXZlLWNvbG9yOiB2YXIoLS1hY2NlbnQtY29sb3IpOy0tY2F0ZWdvcnktdGFiLWNvbG9yOiAjNjY2Oy0tY2F0ZWdvcnktdGFiLWhpZ2hsaWdodC1iYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIC4xNSk7LS1lcnJvci1jb2xvci1kYXJrOiBoc2woMCwgMTAwJSwgNDUlKTstLWVycm9yLWNvbG9yOiBoc2woMCwgMTAwJSwgNDAlKTstLWZvY3VzLWluZGljYXRvci1iYWNrZ3JvdW5kLWNvbG9yOiBoc2woMTk4LCA2NSUsIDg1JSk7LS1mb2N1cy1pbmRpY2F0b3ItY29sb3I6ICMzMzMzMzM7LS1ob3Zlci1iYWNrZ3JvdW5kLWNvbG9yOiAjYzdkMmZlOy0tcGxhY2Vob2xkZXItYmFja2dyb3VuZC1jb2xvcjogI2NjY2NjYzstLXNlYXJjaC1iYWNrZ3JvdW5kLWNvbG9yOiAjZjlmYWZiOy0tc2VhcmNoLWZvY3VzLWJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7LS1zZWFyY2gtaWNvbi1jb2xvcjogIzk5OTk5OTstLXNlYXJjaC1wbGFjZWhvbGRlci1jb2xvcjogIzcxNzE3YTstLXNlY29uZGFyeS1iYWNrZ3JvdW5kLWNvbG9yOiAjZTJlOGYwOy0tc2Vjb25kYXJ5LXRleHQtY29sb3I6ICM2NjY2NjY7LS10YWctYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxNjIsIDE5MCwgMjQ1LCAuMyk7LS10ZXh0LWNvbG9yOiAjMDAwMDAwOy0tdmFyaWFudC1wb3B1cC1iYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmfS5kYXJre2NvbG9yLXNjaGVtZTpkYXJrOy0tYWNjZW50LWNvbG9yOiAjQTU4MEY5Oy0tYmFja2dyb3VuZC1jb2xvcjogIzMzMzMzMzstLWJvcmRlci1jb2xvcjogIzY2NjY2NjstLWNhdGVnb3J5LW5hbWUtYmFja2dyb3VuZC1jb2xvcjogIzMzMzMzMzstLWNhdGVnb3J5LW5hbWUtYnV0dG9uLWNvbG9yOiAjZWVlZWVlOy0tY2F0ZWdvcnktbmFtZS10ZXh0LWNvbG9yOiAjZmZmZmZmOy0tY2F0ZWdvcnktdGFiLWFjdGl2ZS1iYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwOy0tY2F0ZWdvcnktdGFiLWFjdGl2ZS1jb2xvcjogdmFyKC0tYWNjZW50LWNvbG9yKTstLWNhdGVnb3J5LXRhYi1jb2xvcjogI2NjY2NjYzstLWNhdGVnb3J5LXRhYi1oaWdobGlnaHQtYmFja2dyb3VuZC1jb2xvcjogIzRBNEE0QTstLWVycm9yLWNvbG9yLWRhcms6IGhzbCgwLCA3JSwgMyUpOy0tZXJyb3ItY29sb3I6IGhzbCgwLCAzMCUsIDYwJSk7LS1mb2N1cy1pbmRpY2F0b3ItYmFja2dyb3VuZC1jb2xvcjogaHNsKDAsIDAlLCA1MCUpOy0tZm9jdXMtaW5kaWNhdG9yLWNvbG9yOiAjOTk5OTk5Oy0taG92ZXItYmFja2dyb3VuZC1jb2xvcjogaHNsYSgwLCAwJSwgNDAlLCAuODUpOy0taW1hZ2UtcGxhY2Vob2xkZXItY29sb3I6ICNmZmZmZmY7LS1wbGFjZWhvbGRlci1iYWNrZ3JvdW5kLWNvbG9yOiAjNjY2NjY2Oy0tc2VhcmNoLWJhY2tncm91bmQtY29sb3I6ICM3MTcxN2E7LS1zZWFyY2gtZm9jdXMtYmFja2dyb3VuZC1jb2xvcjogIzUyNTI1YjstLXNlYXJjaC1pY29uLWNvbG9yOiAjY2NjY2NjOy0tc2VhcmNoLXBsYWNlaG9sZGVyLWNvbG9yOiAjZDRkNGQ4Oy0tc2Vjb25kYXJ5LWJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7LS1zZWNvbmRhcnktdGV4dC1jb2xvcjogIzk5OTk5OTstLXRhZy1iYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDE2MiwgMTkwLCAyNDUsIC4zKTstLXRleHQtY29sb3I6ICNmZmZmZmY7LS12YXJpYW50LXBvcHVwLWJhY2tncm91bmQtY29sb3I6ICMzMzMzMzN9QG1lZGlhIChwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyayl7LmF1dG97Y29sb3Itc2NoZW1lOmRhcms7LS1hY2NlbnQtY29sb3I6ICNBNTgwRjk7LS1iYWNrZ3JvdW5kLWNvbG9yOiAjMzMzMzMzOy0tYm9yZGVyLWNvbG9yOiAjNjY2NjY2Oy0tY2F0ZWdvcnktbmFtZS1iYWNrZ3JvdW5kLWNvbG9yOiAjMzMzMzMzOy0tY2F0ZWdvcnktbmFtZS1idXR0b24tY29sb3I6ICNlZWVlZWU7LS1jYXRlZ29yeS1uYW1lLXRleHQtY29sb3I6ICNmZmZmZmY7LS1jYXRlZ29yeS10YWItYWN0aXZlLWJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7LS1jYXRlZ29yeS10YWItYWN0aXZlLWNvbG9yOiB2YXIoLS1hY2NlbnQtY29sb3IpOy0tY2F0ZWdvcnktdGFiLWNvbG9yOiAjY2NjY2NjOy0tY2F0ZWdvcnktdGFiLWhpZ2hsaWdodC1iYWNrZ3JvdW5kLWNvbG9yOiAjNEE0QTRBOy0tZXJyb3ItY29sb3ItZGFyazogaHNsKDAsIDclLCAzJSk7LS1lcnJvci1jb2xvcjogaHNsKDAsIDMwJSwgNjAlKTstLWZvY3VzLWluZGljYXRvci1iYWNrZ3JvdW5kLWNvbG9yOiBoc2woMCwgMCUsIDUwJSk7LS1mb2N1cy1pbmRpY2F0b3ItY29sb3I6ICM5OTk5OTk7LS1ob3Zlci1iYWNrZ3JvdW5kLWNvbG9yOiBoc2xhKDAsIDAlLCA0MCUsIC44NSk7LS1pbWFnZS1wbGFjZWhvbGRlci1jb2xvcjogI2ZmZmZmZjstLXBsYWNlaG9sZGVyLWJhY2tncm91bmQtY29sb3I6ICM2NjY2NjY7LS1zZWFyY2gtYmFja2dyb3VuZC1jb2xvcjogIzcxNzE3YTstLXNlYXJjaC1mb2N1cy1iYWNrZ3JvdW5kLWNvbG9yOiAjNTI1MjViOy0tc2VhcmNoLWljb24tY29sb3I6ICNjY2NjY2M7LS1zZWFyY2gtcGxhY2Vob2xkZXItY29sb3I6ICNkNGQ0ZDg7LS1zZWNvbmRhcnktYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDstLXNlY29uZGFyeS10ZXh0LWNvbG9yOiAjOTk5OTk5Oy0tdGFnLWJhY2tncm91bmQtY29sb3I6IHJnYmEoMTYyLCAxOTAsIDI0NSwgLjMpOy0tdGV4dC1jb2xvcjogI2ZmZmZmZjstLXZhcmlhbnQtcG9wdXAtYmFja2dyb3VuZC1jb2xvcjogIzMzMzMzM319LnBpY21vLXBpY2tlciAuY2F0ZWdvcnlCdXR0b25zQ29udGFpbmVye292ZXJmbG93OmF1dG87cGFkZGluZzoycHggMH0ucGljbW8tcGlja2VyIC5jYXRlZ29yeUJ1dHRvbnNDb250YWluZXIuaGFzLW92ZXJmbG93LXJpZ2h0e21hc2staW1hZ2U6bGluZWFyLWdyYWRpZW50KDI3MGRlZyxyZ2JhKDI1NSwyNTUsMjU1LDApIDAlLHJnYmEoMjU1LDI1NSwyNTUsMSkgMTAlKTstd2Via2l0LW1hc2staW1hZ2U6bGluZWFyLWdyYWRpZW50KDI3MGRlZyxyZ2JhKDI1NSwyNTUsMjU1LDApIDAlLHJnYmEoMjU1LDI1NSwyNTUsMSkgMTAlKX0ucGljbW8tcGlja2VyIC5jYXRlZ29yeUJ1dHRvbnNDb250YWluZXIuaGFzLW92ZXJmbG93LWxlZnR7bWFzay1pbWFnZTpsaW5lYXItZ3JhZGllbnQoOTBkZWcscmdiYSgyNTUsMjU1LDI1NSwwKSAwJSxyZ2JhKDI1NSwyNTUsMjU1LDEpIDEwJSk7LXdlYmtpdC1tYXNrLWltYWdlOmxpbmVhci1ncmFkaWVudCg5MGRlZyxyZ2JhKDI1NSwyNTUsMjU1LDApIDAlLHJnYmEoMjU1LDI1NSwyNTUsMSkgMTAlKX0ucGljbW8tcGlja2VyIC5jYXRlZ29yeUJ1dHRvbnNDb250YWluZXIuaGFzLW92ZXJmbG93LWJvdGh7bWFzay1pbWFnZTpsaW5lYXItZ3JhZGllbnQoOTBkZWcscmdiYSgyNTUsMjU1LDI1NSwwKSAwJSxyZ2JhKDI1NSwyNTUsMjU1LDEpIDEwJSxyZ2JhKDI1NSwyNTUsMjU1LDEpIDkwJSxyZ2JhKDI1NSwyNTUsMjU1LDApIDEwMCUpOy13ZWJraXQtbWFzay1pbWFnZTpsaW5lYXItZ3JhZGllbnQoOTBkZWcscmdiYSgyNTUsMjU1LDI1NSwwKSAwJSxyZ2JhKDI1NSwyNTUsMjU1LDEpIDEwJSxyZ2JhKDI1NSwyNTUsMjU1LDEpIDkwJSxyZ2JhKDI1NSwyNTUsMjU1LDApIDEwMCUpfS5waWNtby1waWNrZXIgLmNhdGVnb3J5QnV0dG9uc3tkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246cm93O2dhcDp2YXIoLS10YWItZ2FwKTttYXJnaW46MDtwYWRkaW5nOjAgLjVlbTthbGlnbi1pdGVtczpjZW50ZXI7aGVpZ2h0OnZhcigtLWNhdGVnb3J5LXRhYnMtaGVpZ2h0KTtib3gtc2l6aW5nOmJvcmRlci1ib3g7d2lkdGg6MTAwJTtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2Vlbjtwb3NpdGlvbjpyZWxhdGl2ZTtsaXN0LXN0eWxlLXR5cGU6bm9uZTtqdXN0aWZ5LXNlbGY6Y2VudGVyO21heC13aWR0aDptaW4oMjMuNTVyZW0sY2FsYyh2YXIoLS1jYXRlZ29yeS1jb3VudCwgMSkgKiAyLjVyZW0pKX0ucGljbW8tcGlja2VyIC5jYXRlZ29yeUJ1dHRvbnMgLmNhdGVnb3J5VGFie2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7dHJhbnNpdGlvbjphbGwgLjFzO3dpZHRoOjJlbX0ucGljbW8tcGlja2VyIC5jYXRlZ29yeUJ1dHRvbnMgLmNhdGVnb3J5VGFiLmNhdGVnb3J5VGFiQWN0aXZlIC5jYXRlZ29yeUJ1dHRvbntjb2xvcjp2YXIoLS1jYXRlZ29yeS10YWItYWN0aXZlLWNvbG9yKTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LC43NSkgMCUscmdiYSgyNTUsMjU1LDI1NSwuNzUpIDEwMCUpLGxpbmVhci1ncmFkaWVudCh2YXIoLS1jYXRlZ29yeS10YWItYWN0aXZlLWNvbG9yKSAwJSx2YXIoLS1jYXRlZ29yeS10YWItYWN0aXZlLWNvbG9yKSAxMDAlKTtib3JkZXI6MnB4IHNvbGlkIHZhcigtLWNhdGVnb3J5LXRhYi1hY3RpdmUtY29sb3IpfS5waWNtby1waWNrZXIgLmNhdGVnb3J5QnV0dG9ucyAuY2F0ZWdvcnlUYWIuY2F0ZWdvcnlUYWJBY3RpdmUgLmNhdGVnb3J5QnV0dG9uOmhvdmVye2JhY2tncm91bmQtY29sb3I6dmFyKC0tY2F0ZWdvcnktdGFiLWFjdGl2ZS1iYWNrZ3JvdW5kLWNvbG9yKX0ucGljbW8tcGlja2VyIC5jYXRlZ29yeUJ1dHRvbnMgLmNhdGVnb3J5VGFiIGJ1dHRvbi5jYXRlZ29yeUJ1dHRvbntib3JkZXItcmFkaXVzOjVweDtiYWNrZ3JvdW5kOnRyYW5zcGFyZW50O2JvcmRlcjoycHggc29saWQgdHJhbnNwYXJlbnQ7Y29sb3I6dmFyKC0tY2F0ZWdvcnktdGFiLWNvbG9yKTtjdXJzb3I6cG9pbnRlcjtwYWRkaW5nOjJweDt2ZXJ0aWNhbC1hbGlnbjptaWRkbGU7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2ZvbnQtc2l6ZToxLjJyZW07d2lkdGg6MS42ZW07aGVpZ2h0OjEuNmVtO3RyYW5zaXRpb246YWxsIC4xc30ucGljbW8tcGlja2VyIC5jYXRlZ29yeUJ1dHRvbnMgLmNhdGVnb3J5VGFiIGJ1dHRvbi5jYXRlZ29yeUJ1dHRvbjppcyhpbWcpe3dpZHRoOnZhcigtLWNhdGVnb3J5LXRhYi1zaXplKTtoZWlnaHQ6dmFyKC0tY2F0ZWdvcnktdGFiLXNpemUpfS5waWNtby1waWNrZXIgLmNhdGVnb3J5QnV0dG9ucyAuY2F0ZWdvcnlUYWIgYnV0dG9uLmNhdGVnb3J5QnV0dG9uOmhvdmVye2JhY2tncm91bmQ6dmFyKC0tY2F0ZWdvcnktdGFiLWhpZ2hsaWdodC1iYWNrZ3JvdW5kLWNvbG9yKX0uZGF0YUVycm9yIFtkYXRhLWljb25de29wYWNpdHk6Ljh9QGtleWZyYW1lcyBhcHBlYXJ7MCV7b3BhY2l0eTowfXRve29wYWNpdHk6Ljh9fUBrZXlmcmFtZXMgYXBwZWFyLWdyb3d7MCV7b3BhY2l0eTowO3RyYW5zZm9ybTpzY2FsZSguOCl9dG97b3BhY2l0eTouODt0cmFuc2Zvcm06c2NhbGUoMSl9fS5waWNtby1waWNrZXIgLmVycm9ye2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7aGVpZ2h0OjEwMCU7Y29sb3I6dmFyKC0tc2Vjb25kYXJ5LXRleHQtY29sb3IpfS5waWNtby1waWNrZXIgLmVycm9yIC5pY29uQ29udGFpbmVye29wYWNpdHk6Ljg7YW5pbWF0aW9uOmFwcGVhci1ncm93IC4yNXMgY3ViaWMtYmV6aWVyKC4xNzUsLjg4NSwuMzIsMS4yNzUpOy0tY29sb3ItcHJpbWFyeTogdmFyKC0tZXJyb3ItY29sb3IpOy0tY29sb3Itc2Vjb25kYXJ5OiB2YXIoLS1lcnJvci1jb2xvci1kYXJrKX0ucGljbW8tcGlja2VyIC5lcnJvciAudGl0bGV7YW5pbWF0aW9uOmFwcGVhciAuMjVzO2FuaW1hdGlvbi1kZWxheTo1MG1zO2FuaW1hdGlvbi1maWxsLW1vZGU6Ym90aH0ucGljbW8tcGlja2VyIC5lcnJvciBidXR0b257cGFkZGluZzo4cHggMTZweDtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOnZhcigtLWJhY2tncm91bmQtY29sb3IpO2JvcmRlcjoxcHggc29saWQgdmFyKC0tdGV4dC1jb2xvcik7Ym9yZGVyLXJhZGl1czo1cHg7Y29sb3I6dmFyKC0tdGV4dC1jb2xvcil9LnBpY21vLXBpY2tlciAuZXJyb3IgYnV0dG9uOmhvdmVye2JhY2tncm91bmQ6dmFyKC0tdGV4dC1jb2xvcik7Y29sb3I6dmFyKC0tYmFja2dyb3VuZC1jb2xvcil9LmVtb2ppQnV0dG9ue2JhY2tncm91bmQ6dHJhbnNwYXJlbnQ7Ym9yZGVyOm5vbmU7Ym9yZGVyLXJhZGl1czoxNXB4O2N1cnNvcjpwb2ludGVyO2Rpc3BsYXk6ZmxleDtmb250LWZhbWlseTp2YXIoLS1lbW9qaS1mb250KTtmb250LXNpemU6dmFyKC0tZW1vamktc2l6ZSk7aGVpZ2h0OjEwMCU7anVzdGlmeS1jb250ZW50OmNlbnRlcjthbGlnbi1pdGVtczpjZW50ZXI7bWFyZ2luOjA7b3ZlcmZsb3c6aGlkZGVuO3BhZGRpbmc6MDt3aWR0aDoxMDAlfS5lbW9qaUJ1dHRvbjpob3ZlcntiYWNrZ3JvdW5kOnZhcigtLWhvdmVyLWJhY2tncm91bmQtY29sb3IpfS5lbW9qaUJ1dHRvbjpmb2N1c3tib3JkZXItcmFkaXVzOjA7YmFja2dyb3VuZDp2YXIoLS1mb2N1cy1pbmRpY2F0b3ItYmFja2dyb3VuZC1jb2xvcik7b3V0bGluZToxcHggc29saWQgdmFyKC0tZm9jdXMtaW5kaWNhdG9yLWNvbG9yKX0ucGljbW8tcGlja2VyIC5lbW9qaUFyZWF7aGVpZ2h0OnZhcigtLWVtb2ppLWFyZWEtaGVpZ2h0KTtvdmVyZmxvdy15OmF1dG87cG9zaXRpb246cmVsYXRpdmV9LnBpY21vLXBpY2tlciAuZW1vamlDYXRlZ29yeXtwb3NpdGlvbjpyZWxhdGl2ZX0ucGljbW8tcGlja2VyIC5lbW9qaUNhdGVnb3J5IC5jYXRlZ29yeU5hbWV7Zm9udC1zaXplOi45ZW07cGFkZGluZzouNXJlbTttYXJnaW46MDtiYWNrZ3JvdW5kOnZhcigtLWNhdGVnb3J5LW5hbWUtYmFja2dyb3VuZC1jb2xvcik7Y29sb3I6dmFyKC0tY2F0ZWdvcnktbmFtZS10ZXh0LWNvbG9yKTt0b3A6MDt6LWluZGV4OjE7ZGlzcGxheTpncmlkO2dhcDo0cHg7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOmF1dG8gMWZyIGF1dG87YWxpZ24taXRlbXM6Y2VudGVyO2xpbmUtaGVpZ2h0OjE7Ym94LXNpemluZzpib3JkZXItYm94O2hlaWdodDp2YXIoLS1jYXRlZ29yeS1uYW1lLWhlaWdodCk7anVzdGlmeS1jb250ZW50OmZsZXgtc3RhcnQ7dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlfS5waWNtby1waWNrZXIgLmVtb2ppQ2F0ZWdvcnkgLmNhdGVnb3J5TmFtZSBidXR0b257YmFja2dyb3VuZDp0cmFuc3BhcmVudDtib3JkZXI6bm9uZTtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2N1cnNvcjpwb2ludGVyO2NvbG9yOnZhcigtLWNhdGVnb3J5LW5hbWUtYnV0dG9uLWNvbG9yKX0ucGljbW8tcGlja2VyIC5lbW9qaUNhdGVnb3J5IC5jYXRlZ29yeU5hbWUgYnV0dG9uOmhvdmVye29wYWNpdHk6MX0ucGljbW8tcGlja2VyIC5lbW9qaUNhdGVnb3J5IC5ub1JlY2VudHN7Y29sb3I6dmFyKC0tc2Vjb25kYXJ5LXRleHQtY29sb3IpO2dyaWQtY29sdW1uOjEgLyBzcGFuIHZhcigtLWVtb2ppcy1wZXItcm93KTtmb250LXNpemU6LjllbTt0ZXh0LWFsaWduOmNlbnRlcjtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7bWluLWhlaWdodDpjYWxjKHZhcigtLWVtb2ppLXNpemUpICogdmFyKC0tZW1vamktc2l6ZS1tdWx0aXBsaWVyKSl9LnBpY21vLXBpY2tlciAuZW1vamlDYXRlZ29yeSAucmVjZW50RW1vamlzW2RhdGEtZW1wdHk9dHJ1ZV17ZGlzcGxheTpub25lfTppcygucGljbW8tcGlja2VyIC5lbW9qaUNhdGVnb3J5KSAucmVjZW50RW1vamlzW2RhdGEtZW1wdHk9ZmFsc2VdK2RpdntkaXNwbGF5Om5vbmV9LnBpY21vLXBpY2tlciAuZW1vamlDb250YWluZXJ7ZGlzcGxheTpncmlkO2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2dhcDoxcHg7cGFkZGluZzowIC41ZW07Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCh2YXIoLS1lbW9qaXMtcGVyLXJvdyksY2FsYyh2YXIoLS1lbW9qaS1zaXplKSAqIHZhcigtLWVtb2ppLXNpemUtbXVsdGlwbGllcikpKTtncmlkLWF1dG8tcm93czpjYWxjKHZhcigtLWVtb2ppLXNpemUpICogdmFyKC0tZW1vamktc2l6ZS1tdWx0aXBsaWVyKSk7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktaXRlbXM6Y2VudGVyfS5waWNtby1waWNrZXIucGlja2Vyey0tYm9yZGVyLXJhZGl1czogNXB4Oy0tZW1vamktYXJlYS1oZWlnaHQ6IGNhbGMoICh2YXIoLS1yb3ctY291bnQpICogdmFyKC0tZW1vamktc2l6ZSkgKiB2YXIoLS1lbW9qaS1zaXplLW11bHRpcGxpZXIpKSArIHZhcigtLWNhdGVnb3J5LW5hbWUtaGVpZ2h0KSApOy0tY29udGVudC1oZWlnaHQ6IHZhcigtLWVtb2ppLWFyZWEtaGVpZ2h0KTstLWVtb2ppcy1wZXItcm93OiA4Oy0tcm93LWNvdW50OiA2Oy0tZW1vamktcHJldmlldy1tYXJnaW46IDRweDstLWVtb2ppLXByZXZpZXctaGVpZ2h0OiBjYWxjKHZhcigtLWVtb2ppLXByZXZpZXctc2l6ZSkgKyAxZW0gKyAxcHgpOy0tZW1vamktcHJldmlldy1oZWlnaHQtZnVsbDogY2FsYyh2YXIoLS1lbW9qaS1wcmV2aWV3LWhlaWdodCkgKyB2YXIoLS1lbW9qaS1wcmV2aWV3LW1hcmdpbikpOy0tZW1vamktcHJldmlldy1zaXplOiAyLjc1ZW07LS1lbW9qaS1zaXplOiAycmVtOy0tZW1vamktc2l6ZS1tdWx0aXBsaWVyOiAxLjM7LS1jb250ZW50LW1hcmdpbjogOHB4Oy0tY2F0ZWdvcnktdGFicy1oZWlnaHQ6Y2FsYygxLjVlbSArIDlweCk7LS1jYXRlZ29yeS10YWJzLW9mZnNldDogOHB4Oy0tY2F0ZWdvcnktdGFiLXNpemU6IDEuMnJlbTstLWNhdGVnb3J5LW5hbWUtaGVpZ2h0OiAycmVtOy0tY2F0ZWdvcnktbmFtZS1wYWRkaW5nLXk6IDZweDstLXNlYXJjaC1oZWlnaHQ6IDJlbTstLXNlYXJjaC1tYXJnaW46IC41ZW07LS1zZWFyY2gtbWFyZ2luLWJvdHRvbTogNHB4Oy0tc2VhcmNoLWhlaWdodC1mdWxsOiBjYWxjKHZhcigtLXNlYXJjaC1oZWlnaHQpICsgdmFyKC0tc2VhcmNoLW1hcmdpbikgKyB2YXIoLS1zZWFyY2gtbWFyZ2luLWJvdHRvbSkpOy0tb3ZlcmxheS1iYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIC44KTstLWVtb2ppLWZvbnQ6IFwiU2Vnb2UgVUkgRW1vamlcIiwgXCJTZWdvZSBVSSBTeW1ib2xcIiwgXCJTZWdvZSBVSVwiLCBcIkFwcGxlIENvbG9yIEVtb2ppXCIsIFwiVHdlbW9qaSBNb3ppbGxhXCIsIFwiTm90byBDb2xvciBFbW9qaVwiLCBcIkVtb2ppT25lIENvbG9yXCIsIFwiQW5kcm9pZCBFbW9qaVwiOy0tdWktZm9udDogLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBcIkhlbHZldGljYSBOZXVlXCIsIHNhbnMtc2VyaWY7LS11aS1mb250LXNpemU6IDE2cHg7LS1waWNrZXItd2lkdGg6IGNhbGModmFyKC0tZW1vamlzLXBlci1yb3cpICogdmFyKC0tZW1vamktc2l6ZSkgKiB2YXIoLS1lbW9qaS1zaXplLW11bHRpcGxpZXIpICsgMi43NXJlbSk7LS1wcmV2aWV3LWJhY2tncm91bmQtY29sb3I6IHZhcigtLXNlY29uZGFyeS1iYWNrZ3JvdW5kLWNvbG9yKTtiYWNrZ3JvdW5kOnZhcigtLWJhY2tncm91bmQtY29sb3IpO2JvcmRlci1yYWRpdXM6dmFyKC0tYm9yZGVyLXJhZGl1cyk7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1ib3JkZXItY29sb3IpO2ZvbnQtZmFtaWx5OnZhcigtLXVpLWZvbnQpO2ZvbnQtc2l6ZTp2YXIoLS11aS1mb250LXNpemUpO292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDp2YXIoLS1waWNrZXItd2lkdGgpO2Rpc3BsYXk6Z3JpZDtnYXA6OHB4fS5waWNtby1waWNrZXIucGlja2VyPip7Zm9udC1mYW1pbHk6dmFyKC0tdWktZm9udCl9LnBpY21vLXBpY2tlci5za2VsZXRvbntiYWNrZ3JvdW5kOnZhcigtLWJhY2tncm91bmQtY29sb3IpO2JvcmRlci1yYWRpdXM6dmFyKC0tYm9yZGVyLXJhZGl1cyk7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1ib3JkZXItY29sb3IpO2ZvbnQtZmFtaWx5OnZhcigtLXVpLWZvbnQpO3dpZHRoOnZhcigtLXBpY2tlci13aWR0aCk7Y29sb3I6dmFyKC0tc2Vjb25kYXJ5LXRleHQtY29sb3IpfS5waWNtby1waWNrZXIuc2tlbGV0b24gKntib3gtc2l6aW5nOmJvcmRlci1ib3h9LnBpY21vLXBpY2tlci5za2VsZXRvbiAucGxhY2Vob2xkZXJ7YmFja2dyb3VuZDp2YXIoLS1wbGFjZWhvbGRlci1iYWNrZ3JvdW5kLWNvbG9yKTtwb3NpdGlvbjpyZWxhdGl2ZTtvdmVyZmxvdzpoaWRkZW59LnBpY21vLXBpY2tlci5za2VsZXRvbiAucGxhY2Vob2xkZXI6YWZ0ZXJ7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7cmlnaHQ6MDtib3R0b206MDtsZWZ0OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtMTAwJSk7YmFja2dyb3VuZC1pbWFnZTpsaW5lYXItZ3JhZGllbnQoOTBkZWcscmdiYSgyNTUsMjU1LDI1NSwwKSAwLHJnYmEoMjU1LDI1NSwyNTUsLjIpIDIwJSxyZ2JhKDI1NSwyNTUsMjU1LC41KSA2MCUscmdiYSgyNTUsMjU1LDI1NSwwKSAxMDAlKTthbmltYXRpb246c2hpbmUgMnMgaW5maW5pdGU7Y29udGVudDpcIlwifS5waWNtby1waWNrZXIuc2tlbGV0b24gLmhlYWRlclNrZWxldG9ue2JhY2tncm91bmQtY29sb3I6dmFyKC0tc2Vjb25kYXJ5LWJhY2tncm91bmQtY29sb3IpO3BhZGRpbmctdG9wOjhweDtwYWRkaW5nLWJvdHRvbTo4cHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtvdmVyZmxvdzpoaWRkZW47Z2FwOjhweDtib3JkZXItYm90dG9tOjFweCBzb2xpZCB2YXIoLS1ib3JkZXItY29sb3IpO3dpZHRoOnZhcigtLXBpY2tlci13aWR0aCl9LnBpY21vLXBpY2tlci5za2VsZXRvbiAuc2VhcmNoU2tlbGV0b257cGFkZGluZzowIDhweDtoZWlnaHQ6dmFyKC0tc2VhcmNoLWhlaWdodCl9LnBpY21vLXBpY2tlci5za2VsZXRvbiAuc2VhcmNoU2tlbGV0b24gLnNlYXJjaElucHV0e3dpZHRoOjEwMCU7aGVpZ2h0OjI4cHg7Ym9yZGVyLXJhZGl1czozcHh9LnBpY21vLXBpY2tlci5za2VsZXRvbiAuY2F0ZWdvcnlUYWJzU2tlbGV0b257aGVpZ2h0OnZhcigtLWNhdGVnb3J5LXRhYnMtaGVpZ2h0KTtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246cm93O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LXNlbGY6Y2VudGVyO3dpZHRoOmNhbGMoMnJlbSAqIHZhcigtLWNhdGVnb3J5LWNvdW50LCAxKSl9LnBpY21vLXBpY2tlci5za2VsZXRvbiAuY2F0ZWdvcnlUYWJzU2tlbGV0b24gLmNhdGVnb3J5VGFie3dpZHRoOjI1cHg7aGVpZ2h0OjI1cHg7cGFkZGluZzoycHg7Ym9yZGVyLXJhZGl1czo1cHg7bWFyZ2luOi4yNWVtfS5waWNtby1waWNrZXIuc2tlbGV0b24gLmNvbnRlbnRTa2VsZXRvbntoZWlnaHQ6dmFyKC0tY29udGVudC1oZWlnaHQpO3BhZGRpbmctcmlnaHQ6OHB4O29wYWNpdHk6Ljd9LnBpY21vLXBpY2tlci5za2VsZXRvbiAuY29udGVudFNrZWxldG9uIC5jYXRlZ29yeU5hbWV7d2lkdGg6NTAlO2hlaWdodDoxcmVtO21hcmdpbjouNXJlbTtib3gtc2l6aW5nOmJvcmRlci1ib3h9LnBpY21vLXBpY2tlci5za2VsZXRvbiAuY29udGVudFNrZWxldG9uIC5lbW9qaUdyaWR7ZGlzcGxheTpncmlkO2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2dhcDoxcHg7cGFkZGluZzowIC41ZW07Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCh2YXIoLS1lbW9qaXMtcGVyLXJvdyksY2FsYyh2YXIoLS1lbW9qaS1zaXplKSAqIHZhcigtLWVtb2ppLXNpemUtbXVsdGlwbGllcikpKTtncmlkLWF1dG8tcm93czpjYWxjKHZhcigtLWVtb2ppLXNpemUpICogdmFyKC0tZW1vamktc2l6ZS1tdWx0aXBsaWVyKSk7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktaXRlbXM6Y2VudGVyO3dpZHRoOnZhcigtLXBpY2tlci13aWR0aCl9LnBpY21vLXBpY2tlci5za2VsZXRvbiAuY29udGVudFNrZWxldG9uIC5lbW9qaUdyaWQgLmVtb2ppe3dpZHRoOnZhcigtLWVtb2ppLXNpemUpO2hlaWdodDp2YXIoLS1lbW9qaS1zaXplKTtib3JkZXItcmFkaXVzOjUwJX0ucGljbW8tcGlja2VyLnNrZWxldG9uIC5wcmV2aWV3U2tlbGV0b257aGVpZ2h0OnZhcigtLWVtb2ppLXByZXZpZXctaGVpZ2h0KTtib3JkZXItdG9wOjFweCBzb2xpZCB2YXIoLS1ib3JkZXItY29sb3IpO2Rpc3BsYXk6Z3JpZDthbGlnbi1pdGVtczpjZW50ZXI7cGFkZGluZzouNWVtO2dhcDo2cHg7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOmF1dG8gMWZyO2dyaWQtdGVtcGxhdGUtcm93czphdXRvIDFmcjtncmlkLXRlbXBsYXRlLWFyZWFzOlwiZW1vamkgbmFtZVwiIFwiZW1vamkgdGFnc1wifS5waWNtby1waWNrZXIuc2tlbGV0b24gLnByZXZpZXdTa2VsZXRvbiAucHJldmlld0Vtb2ppe2dyaWQtYXJlYTplbW9qaTtib3JkZXItcmFkaXVzOjUwJTt3aWR0aDp2YXIoLS1lbW9qaS1wcmV2aWV3LXNpemUpO2hlaWdodDp2YXIoLS1lbW9qaS1wcmV2aWV3LXNpemUpfS5waWNtby1waWNrZXIuc2tlbGV0b24gLnByZXZpZXdTa2VsZXRvbiAucHJldmlld05hbWV7Z3JpZC1hcmVhOm5hbWU7aGVpZ2h0Oi44ZW07d2lkdGg6ODAlfS5waWNtby1waWNrZXIuc2tlbGV0b24gLnByZXZpZXdTa2VsZXRvbiAudGFnTGlzdHtncmlkLWFyZWE6dGFncztsaXN0LXN0eWxlLXR5cGU6bm9uZTtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246cm93O3BhZGRpbmc6MDttYXJnaW46MH0ucGljbW8tcGlja2VyLnNrZWxldG9uIC5wcmV2aWV3U2tlbGV0b24gLnRhZ0xpc3QgLnRhZ3tib3JkZXItcmFkaXVzOjNweDtwYWRkaW5nOjJweCA4cHg7bWFyZ2luLXJpZ2h0Oi4yNWVtO2hlaWdodDoxZW07d2lkdGg6MjAlfS5vdmVybGF5e2JhY2tncm91bmQ6cmdiYSgwLDAsMCwuNzUpO2hlaWdodDoxMDAlO2xlZnQ6MDtwb3NpdGlvbjpmaXhlZDt0b3A6MDt3aWR0aDoxMDAlO3otaW5kZXg6MTAwMH0uY29udGVudHtwb3NpdGlvbjpyZWxhdGl2ZTtvdmVyZmxvdzpoaWRkZW47aGVpZ2h0OnZhcigtLWNvbnRlbnQtaGVpZ2h0KX0uY29udGVudC5mdWxsSGVpZ2h0e2hlaWdodDpjYWxjKHZhcigtLWNvbnRlbnQtaGVpZ2h0KSArIHZhcigtLWNhdGVnb3J5LXRhYnMtaGVpZ2h0KSArIHZhcigtLWNhdGVnb3J5LXRhYnMtb2Zmc2V0KSk7b3ZlcmZsb3cteTphdXRvfS5wbHVnaW5Db250YWluZXJ7bWFyZ2luOi41ZW07ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOnJvd30uaGVhZGVye2JhY2tncm91bmQtY29sb3I6dmFyKC0tc2Vjb25kYXJ5LWJhY2tncm91bmQtY29sb3IpO3BhZGRpbmctdG9wOjhweDtwYWRkaW5nLWJvdHRvbTo4cHg7ZGlzcGxheTpncmlkO2dhcDo4cHg7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgdmFyKC0tYm9yZGVyLWNvbG9yKX1AbWVkaWEgKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSl7LnBsYWNlaG9sZGVye2JhY2tncm91bmQ6dmFyKC0tcGxhY2Vob2xkZXItYmFja2dyb3VuZC1jb2xvcik7cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6aGlkZGVufS5wbGFjZWhvbGRlcjphZnRlcntkaXNwbGF5Om5vbmV9fS5waWNtby1waWNrZXIgLnByZXZpZXd7Ym9yZGVyLXRvcDoxcHggc29saWQgdmFyKC0tYm9yZGVyLWNvbG9yKTtkaXNwbGF5OmdyaWQ7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOmF1dG8gMWZyO2dyaWQtdGVtcGxhdGUtcm93czphdXRvIDFmcjtncmlkLXRlbXBsYXRlLWFyZWFzOlwiZW1vamkgbmFtZVwiIFwiZW1vamkgdGFnc1wiO2hlaWdodDp2YXIoLS1lbW9qaS1wcmV2aWV3LWhlaWdodCk7Ym94LXNpemluZzpib3JkZXItYm94O3BhZGRpbmc6LjVlbTtwb3NpdGlvbjpyZWxhdGl2ZTtiYWNrZ3JvdW5kOnZhcigtLXByZXZpZXctYmFja2dyb3VuZC1jb2xvcil9LnBpY21vLXBpY2tlciAucHJldmlldyAucHJldmlld0Vtb2ppe2dyaWQtYXJlYTplbW9qaTtmb250LXNpemU6dmFyKC0tZW1vamktcHJldmlldy1zaXplKTtmb250LWZhbWlseTp2YXIoLS1lbW9qaS1mb250KTt3aWR0aDoxLjI1ZW07ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyfS5waWNtby1waWNrZXIgLnByZXZpZXcgLnByZXZpZXdOYW1le2dyaWQtYXJlYTpuYW1lO2NvbG9yOnZhcigtLXRleHQtY29sb3IpO2ZvbnQtc2l6ZTouOGVtO3doaXRlLXNwYWNlOm5vd3JhcDtvdmVyZmxvdzpoaWRkZW47dGV4dC1vdmVyZmxvdzplbGxpcHNpcztmb250LXdlaWdodDo1MDB9LnBpY21vLXBpY2tlciAucHJldmlldyAudGFnTGlzdHtncmlkLWFyZWE6dGFncztsaXN0LXN0eWxlLXR5cGU6bm9uZTtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246cm93O3BhZGRpbmc6MDttYXJnaW46MDtmb250LXNpemU6Ljc1ZW07b3ZlcmZsb3c6aGlkZGVufS5waWNtby1waWNrZXIgLnByZXZpZXcgLnRhZ3tib3JkZXItcmFkaXVzOjNweDtiYWNrZ3JvdW5kOnZhcigtLXRhZy1iYWNrZ3JvdW5kLWNvbG9yKTtjb2xvcjp2YXIoLS10ZXh0LWNvbG9yKTtwYWRkaW5nOjJweCA4cHg7bWFyZ2luLXJpZ2h0Oi4yNWVtO3doaXRlLXNwYWNlOm5vd3JhcH0ucGljbW8tcGlja2VyIC5wcmV2aWV3IC50YWc6bGFzdC1jaGlsZHttYXJnaW4tcmlnaHQ6MH0ucGljbW8tcGlja2VyIC5zZWFyY2hDb250YWluZXJ7ZGlzcGxheTpmbGV4O2hlaWdodDp2YXIoLS1zZWFyY2gtaGVpZ2h0KTtib3gtc2l6aW5nOmJvcmRlci1ib3g7cGFkZGluZzowIDhweDtwb3NpdGlvbjpyZWxhdGl2ZX0ucGljbW8tcGlja2VyIC5zZWFyY2hDb250YWluZXIgLnNlYXJjaEZpZWxke2JhY2tncm91bmQ6dmFyKC0tc2VhcmNoLWJhY2tncm91bmQtY29sb3IpO2JvcmRlci1yYWRpdXM6M3B4O2JvcmRlcjpub25lO2JveC1zaXppbmc6Ym9yZGVyLWJveDtjb2xvcjp2YXIoLS10ZXh0LWNvbG9yKTtmb250LXNpemU6LjllbTtvdXRsaW5lOm5vbmU7cGFkZGluZzouNWVtIDIuMjVlbSAuNWVtIC41ZW07d2lkdGg6MTAwJX0ucGljbW8tcGlja2VyIC5zZWFyY2hDb250YWluZXIgLnNlYXJjaEZpZWxkOmZvY3Vze2JhY2tncm91bmQ6dmFyKC0tc2VhcmNoLWZvY3VzLWJhY2tncm91bmQtY29sb3IpfS5waWNtby1waWNrZXIgLnNlYXJjaENvbnRhaW5lciAuc2VhcmNoRmllbGQ6OnBsYWNlaG9sZGVye2NvbG9yOnZhcigtLXNlYXJjaC1wbGFjZWhvbGRlci1jb2xvcil9LnBpY21vLXBpY2tlciAuc2VhcmNoQ29udGFpbmVyIC5zZWFyY2hBY2Nlc3Nvcnl7Y29sb3I6dmFyKC0tc2VhcmNoLWljb24tY29sb3IpO2hlaWdodDoxMDAlO3Bvc2l0aW9uOmFic29sdXRlO3JpZ2h0OjFlbTt0b3A6MDt3aWR0aDoxLjI1cmVtO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXJ9LnBpY21vLXBpY2tlciAuc2VhcmNoQ29udGFpbmVyIC5zZWFyY2hBY2Nlc3Nvcnkgc3Zne2ZpbGw6dmFyKC0tc2VhcmNoLWljb24tY29sb3IpfS5waWNtby1waWNrZXIgLnNlYXJjaENvbnRhaW5lciAuY2xlYXJCdXR0b257Ym9yZGVyOjA7Y29sb3I6dmFyKC0tc2VhcmNoLWljb24tY29sb3IpO2JhY2tncm91bmQ6dHJhbnNwYXJlbnQ7Y3Vyc29yOnBvaW50ZXJ9LnBpY21vLXBpY2tlciAuc2VhcmNoQ29udGFpbmVyIC5jbGVhclNlYXJjaEJ1dHRvbntjdXJzb3I6cG9pbnRlcjtib3JkZXI6bm9uZTtiYWNrZ3JvdW5kOnRyYW5zcGFyZW50O2NvbG9yOnZhcigtLXNlYXJjaC1pY29uLWNvbG9yKTtmb250LXNpemU6MWVtO3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtwYWRkaW5nOjB9LnBpY21vLXBpY2tlciAuc2VhcmNoQ29udGFpbmVyIC5ub3RGb3VuZCBbZGF0YS1pY29uXXtmaWxsOiNmM2UyNjV9LnBpY21vLXBpY2tlciAudmFyaWFudE92ZXJsYXl7YmFja2dyb3VuZDp2YXIoLS1vdmVybGF5LWJhY2tncm91bmQtY29sb3IpO2JvcmRlci1yYWRpdXM6NXB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47aGVpZ2h0OjEwMCU7anVzdGlmeS1jb250ZW50OmNlbnRlcjtsZWZ0OjA7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7d2lkdGg6MTAwJTt6LWluZGV4OjF9LnBpY21vLXBpY2tlciAudmFyaWFudE92ZXJsYXkgLnZhcmlhbnRQb3B1cHtiYWNrZ3JvdW5kOnZhcigtLXZhcmlhbnQtcG9wdXAtYmFja2dyb3VuZC1jb2xvcik7Ym9yZGVyLXJhZGl1czo1cHg7bWFyZ2luOi41ZW07cGFkZGluZzouNWVtO3RleHQtYWxpZ246Y2VudGVyO3VzZXItc2VsZWN0Om5vbmU7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyfS5jdXN0b21FbW9qaXt3aWR0aDoxZW07aGVpZ2h0OjFlbX1Aa2V5ZnJhbWVzIHNoaW5le3Rve3RyYW5zZm9ybTp0cmFuc2xhdGUoMTAwJSl9fS5waWNtby1waWNrZXIgLmltYWdlUGxhY2Vob2xkZXJ7d2lkdGg6MnJlbTtoZWlnaHQ6MnJlbTtib3JkZXItcmFkaXVzOjUwJX0ucGxhY2Vob2xkZXJ7YmFja2dyb3VuZDojREREQkREO3Bvc2l0aW9uOnJlbGF0aXZlfS5wbGFjZWhvbGRlcjphZnRlcntwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDtyaWdodDowO2JvdHRvbTowO2xlZnQ6MDt0cmFuc2Zvcm06dHJhbnNsYXRlKC0xMDAlKTtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudCg5MGRlZyxyZ2JhKDI1NSwyNTUsMjU1LDApIDAscmdiYSgyNTUsMjU1LDI1NSwuMikgMjAlLHJnYmEoMjU1LDI1NSwyNTUsLjUpIDYwJSxyZ2JhKDI1NSwyNTUsMjU1LDApIDEwMCUpO2FuaW1hdGlvbjpzaGluZSAycyBpbmZpbml0ZTtjb250ZW50OlwiXCJ9XG5gO1xuZnVuY3Rpb24gYnMoaSkge1xuICByZXR1cm4gcmUoaS5sb2NhbGUsIGkuZGF0YVN0b3JlLCBpLm1lc3NhZ2VzLCBpLmVtb2ppRGF0YSk7XG59XG5sZXQgQ3MgPSAwO1xuZnVuY3Rpb24ganMoKSB7XG4gIHJldHVybiBgcGljbW8tJHtEYXRlLm5vdygpfS0ke0NzKyt9YDtcbn1cbmNvbnN0IGtzID0gdnMoKTtcbmZ1bmN0aW9uIExzKGkpIHtcbiAga3Mod3MpO1xuICBjb25zdCBlID0ga3QoaSksIHQgPSAoKGUgPT0gbnVsbCA/IHZvaWQgMCA6IGUuY3VzdG9tKSB8fCBbXSkubWFwKChsKSA9PiAoe1xuICAgIC4uLmwsXG4gICAgY3VzdG9tOiAhMCxcbiAgICB0YWdzOiBbXCJjdXN0b21cIiwgLi4ubC50YWdzIHx8IFtdXVxuICB9KSksIHMgPSBuZXcgeHQoKSwgbyA9IGJzKGUpLCByID0gbmV3IHlzKGUuaTE4bik7XG4gIG8udGhlbigobCkgPT4ge1xuICAgIHMuZW1pdChcImRhdGE6cmVhZHlcIiwgbCk7XG4gIH0pLmNhdGNoKChsKSA9PiB7XG4gICAgcy5lbWl0KFwiZXJyb3JcIiwgbCk7XG4gIH0pO1xuICBjb25zdCBuID0gbmV3IHBzKHtcbiAgICBldmVudHM6IHMsXG4gICAgaTE4bjogcixcbiAgICBjdXN0b21FbW9qaXM6IHQsXG4gICAgcmVuZGVyZXI6IGUucmVuZGVyZXIsXG4gICAgb3B0aW9uczogZSxcbiAgICBlbW9qaURhdGE6IG8sXG4gICAgcGlja2VySWQ6IGpzKClcbiAgfSkuY3JlYXRlKGdzKTtcbiAgcmV0dXJuIG4ucmVuZGVyU3luYygpLCBuO1xufVxuY29uc3QgXyA9IHt9O1xuZnVuY3Rpb24gRXMoaSkge1xuICByZXR1cm4gX1tpXSB8fCAoX1tpXSA9IG5ldyB4cyhpKSksIF9baV07XG59XG5Fcy5kZWxldGVEYXRhYmFzZSA9IChpKSA9PiB7XG59O1xuY2xhc3MgeHMgZXh0ZW5kcyBrZSB7XG4gIG9wZW4oKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG4gIGRlbGV0ZSgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cbiAgY2xvc2UoKSB7XG4gIH1cbiAgaXNQb3B1bGF0ZWQoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSghMSk7XG4gIH1cbiAgZ2V0RW1vamlDb3VudCgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuZW1vamlzLmxlbmd0aCk7XG4gIH1cbiAgZ2V0RXRhZ3MoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IGZvbzogXCJiYXJcIiB9KTtcbiAgfVxuICBnZXRIYXNoKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoXCJcIik7XG4gIH1cbiAgcG9wdWxhdGUoZSkge1xuICAgIHJldHVybiB0aGlzLmNhdGVnb3JpZXMgPSBlLmdyb3VwcywgdGhpcy5lbW9qaXMgPSBlLmVtb2ppcywgUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cbiAgZ2V0Q2F0ZWdvcmllcyhlKSB7XG4gICAgdmFyIHM7XG4gICAgbGV0IHQgPSB0aGlzLmNhdGVnb3JpZXMuZmlsdGVyKChvKSA9PiBvLmtleSAhPT0gXCJjb21wb25lbnRcIik7XG4gICAgaWYgKGUuc2hvd1JlY2VudHMgJiYgdC51bnNoaWZ0KHsga2V5OiBcInJlY2VudHNcIiwgb3JkZXI6IC0xIH0pLCAocyA9IGUuY3VzdG9tKSAhPSBudWxsICYmIHMubGVuZ3RoICYmIHQucHVzaCh7IGtleTogXCJjdXN0b21cIiwgb3JkZXI6IDEwIH0pLCBlLmNhdGVnb3JpZXMpIHtcbiAgICAgIGNvbnN0IG8gPSBlLmNhdGVnb3JpZXM7XG4gICAgICB0ID0gdC5maWx0ZXIoKHIpID0+IG8uaW5jbHVkZXMoci5rZXkpKSwgdC5zb3J0KChyLCBhKSA9PiBvLmluZGV4T2Yoci5rZXkpIC0gby5pbmRleE9mKGEua2V5KSk7XG4gICAgfSBlbHNlXG4gICAgICB0LnNvcnQoKG8sIHIpID0+IG8ub3JkZXIgLSByLm9yZGVyKTtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHQpO1xuICB9XG4gIGdldEVtb2ppcyhlLCB0KSB7XG4gICAgY29uc3QgcyA9IHRoaXMuZW1vamlzLmZpbHRlcigobykgPT4gby5ncm91cCA9PT0gZS5vcmRlcikuZmlsdGVyKChvKSA9PiBvLnZlcnNpb24gPD0gdCkuc29ydCgobywgcikgPT4gby5vcmRlciAhPSBudWxsICYmIHIub3JkZXIgIT0gbnVsbCA/IG8ub3JkZXIgLSByLm9yZGVyIDogMCkubWFwKEUpO1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoTShzLCB0KSk7XG4gIH1cbiAgc2VhcmNoRW1vamlzKGUsIHQsIHMsIG8pIHtcbiAgICBjb25zdCByID0gdGhpcy5lbW9qaXMuZmlsdGVyKChsKSA9PiBCKGwsIGUsIG8pKS5tYXAoRSksIGEgPSB0LmZpbHRlcigobCkgPT4gQihsLCBlLCBvKSksIG4gPSBbXG4gICAgICAuLi5NKHIsIHMpLFxuICAgICAgLi4uYVxuICAgIF07XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuKTtcbiAgfVxuICBzZXRNZXRhKGUpIHtcbiAgICB0aGlzLm1ldGEgPSBlO1xuICB9XG59XG5jbGFzcyBGcyBleHRlbmRzIHhlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoc2Vzc2lvblN0b3JhZ2UpO1xuICB9XG59XG5hc3luYyBmdW5jdGlvbiBBcyhpLCBlLCB0LCBzKSB7XG4gIChhd2FpdCByZShpLCBlLCB0LCBzKSkuY2xvc2UoKTtcbn1cbmV4cG9ydCB7XG4gIGdzIGFzIEVtb2ppUGlja2VyLFxuICBhZSBhcyBFdmVudHMsXG4gIFVlIGFzIEZvY3VzVHJhcCxcbiAgRXMgYXMgSW5NZW1vcnlTdG9yZUZhY3RvcnksXG4gIEVlIGFzIEluZGV4ZWREYlN0b3JlRmFjdG9yeSxcbiAgQ3QgYXMgTG9jYWxTdG9yYWdlUHJvdmlkZXIsXG4gIHB0IGFzIE5hdGl2ZVJlbmRlcmVyLFxuICBidCBhcyBSZWNlbnRzUHJvdmlkZXIsXG4gIHV0IGFzIFJlbmRlcmVyLFxuICBGcyBhcyBTZXNzaW9uU3RvcmFnZVByb3ZpZGVyLFxuICBJIGFzIGFuaW1hdGUsXG4gICRzIGFzIGF1dG9UaGVtZSxcbiAgaGUgYXMgY2FzZUluc2Vuc2l0aXZlSW5jbHVkZXMsXG4gIFZlIGFzIGNvbXB1dGVIYXNoLFxuICBBcyBhcyBjcmVhdGVEYXRhYmFzZSxcbiAgTHMgYXMgY3JlYXRlUGlja2VyLFxuICB2cyBhcyBjcmVhdGVTdHlsZUluamVjdG9yLFxuICB6cyBhcyBkYXJrVGhlbWUsXG4gIFJlIGFzIGRlYm91bmNlLFxuICBQcyBhcyBkZWxldGVEYXRhYmFzZSxcbiAgeXQgYXMgZW4sXG4gIFUgYXMgZ2V0RW1vamlGb3JFdmVudCxcbiAga3QgYXMgZ2V0T3B0aW9ucyxcbiAgZyBhcyBnZXRQcmVmaXhlZENsYXNzZXMsXG4gIEV0IGFzIGdsb2JhbENvbmZpZyxcbiAgS2UgYXMgbGlnaHRUaGVtZSxcbiAgb2UgYXMgcHJlZml4Q2xhc3NOYW1lLFxuICBiZSBhcyBzaG91bGRBbmltYXRlLFxuICBUZSBhcyB0aHJvdHRsZSxcbiAgSiBhcyB0b0VsZW1lbnRcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgJy4vc3R5bGVzL2pzL2Zvcm1zL2Zvcm0tdHlwZS1lbW9qaS5qcyc7XG4iXSwibmFtZXMiOlsiY3JlYXRlUG9wdXAiLCJhdXRvVGhlbWUiLCJkYXJrVGhlbWUiLCJsaWdodFRoZW1lIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJlbCIsInBpY2tlck9wdGlvbnMiLCJ0aGVtZSIsInBvcHVwT3B0aW9ucyIsInRyaWdnZXJFbGVtZW50IiwicmVmZXJlbmNlRWxlbWVudCIsInBvcHVwIiwiZXZlbnQiLCJ2YWx1ZSIsImVtb2ppIiwidG9nZ2xlIl0sInNvdXJjZVJvb3QiOiIifQ==