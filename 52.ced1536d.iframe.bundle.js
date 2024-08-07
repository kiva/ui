(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[52],{

/***/ 4421:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__);


var _excluded = ["class", "staticClass", "style", "staticStyle", "attrs"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
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
      rest = _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1___default()(data, _excluded);
    return _c('svg', _objectSpread({
      class: [classNames, staticClass],
      style: [style, staticStyle],
      attrs: Object.assign({
        "xmlns": "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        "viewBox": "0 0 512 512"
      }, attrs)
    }, rest), children.concat([_c('path', {
      attrs: {
        "fill": "#00267f",
        "d": "M0-.2h512V512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ffc726",
        "d": "M170.7-.2h170.6V512H170.7z"
      }
    }), _c('path', {
      attrs: {
        "id": "a",
        "d": "M256 173.3c-5.5 15.1-11.2 30.9-23.3 43a51.7 51.7 0 0114.6-2.3v63.6l-18 2.7c-.7 0-.9-1-.9-2.4a243.6 243.6 0 00-11.7-53.6c-.4-2.3-7.2-11.3-2-9.7.7 0 7.7 3 6.6 1.6a68 68 0 00-37.1-19.2c-1.2-.3-2 .3-.9 1.7 18 27.7 33.1 60.4 33 99.2 7 0 24-4.1 31-4.1v44.9h8.8l2-125.4z"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "matrix(-1 0 0 1 512 0)",
        "xlink:href": "#a"
      }
    })]));
  }
});

/***/ })

}]);