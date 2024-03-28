(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[121],{

/***/ 4336:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__);



function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/* harmony default export */ __webpack_exports__["default"] = ({
  functional: true,
  render: function render(_h, _vm) {
    var _c = _vm._c,
        _v = _vm._v,
        data = _vm.data,
        _vm$children = _vm.children,
        children = _vm$children === void 0 ? [] : _vm$children;

    var classNames = data.class,
        staticClass = data.staticClass,
        style = data.style,
        staticStyle = data.staticStyle,
        _data$attrs = data.attrs,
        attrs = _data$attrs === void 0 ? {} : _data$attrs,
        rest = _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1___default()(data, ["class", "staticClass", "style", "staticStyle", "attrs"]);

    return _c('svg', _objectSpread({
      class: [classNames, staticClass],
      style: [style, staticStyle],
      attrs: Object.assign({
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 512 512"
      }, attrs)
    }, rest), children.concat([_c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 0h512v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "red",
        "d": "M205 0h102v512H205z"
      }
    }), _c('path', {
      attrs: {
        "fill": "red",
        "d": "M0 205h512v102H0z"
      }
    }), _c('path', {
      staticStyle: {
        "mix-blend-mode": "multiply"
      },
      attrs: {
        "fill": "red",
        "fill-rule": "evenodd",
        "d": "M114.1 397.9c1.1-18 4.3-33.4 4.3-33.4s-10.6 1-15.9 1c-5.3 0-15.9-1-15.9-1s3.2 15.3 4.3 33.4c-18-1.1-33.4-4.3-33.4-4.3s1 8 1 15.9-1 15.9-1 15.9 15.3-3.2 33.4-4.3c-1.1 18-4.3 33.4-4.3 33.4s8-1 15.9-1c8 0 15.9 1 15.9 1s-3.2-15.3-4.3-33.4c18 1.1 33.4 4.3 33.4 4.3s-1-10.6-1-15.9c0-5.3 1-15.9 1-15.9s-15.3 3.2-33.4 4.3zm307-307c1.1-18 4.3-33.4 4.3-33.4s-10.6 1-15.9 1c-5.3 0-15.9-1-15.9-1s3.2 15.4 4.3 33.4c-18-1.1-33.4-4.3-33.4-4.3s1 8 1 15.9c0 8-1 15.9-1 15.9s15.3-3.2 33.4-4.3c-1.1 18-4.3 33.4-4.3 33.4s8-1 15.9-1 15.9 1 15.9 1-3.2-15.3-4.3-33.4c18 1.1 33.4 4.3 33.4 4.3s-1-10.6-1-15.9c0-5.2 1-15.9 1-15.9s-15.4 3.2-33.4 4.3zm-307 0c1.1-18 4.3-33.4 4.3-33.4s-10.6 1-15.9 1c-5.3 0-15.9-1-15.9-1s3.2 15.4 4.3 33.4c-18-1.1-33.4-4.3-33.4-4.3s1 8 1 15.9c0 8-1 15.9-1 15.9s15.3-3.2 33.4-4.3c-1.1 18-4.3 33.4-4.3 33.4s8-1 15.9-1c8 0 15.9 1 15.9 1s-3.2-15.3-4.3-33.4c18 1.1 33.4 4.3 33.4 4.3s-1-10.6-1-15.9c0-5.2 1-15.9 1-15.9s-15.3 3.2-33.4 4.3zm307 307c1.1-18 4.3-33.4 4.3-33.4s-10.6 1-15.9 1c-5.3 0-15.9-1-15.9-1s3.2 15.3 4.3 33.4c-18-1.1-33.4-4.3-33.4-4.3s1 8 1 15.9-1 15.9-1 15.9 15.3-3.2 33.4-4.3c-1.1 18-4.3 33.4-4.3 33.4s8-1 15.9-1 15.9 1 15.9 1-3.2-15.3-4.3-33.4c18 1.1 33.4 4.3 33.4 4.3s-1-10.6-1-15.9c0-5.3 1-15.9 1-15.9s-15.4 3.2-33.4 4.3z"
      }
    })]));
  }
});

/***/ })

}]);