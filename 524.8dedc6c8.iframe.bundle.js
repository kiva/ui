(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[524],{

/***/ 4789:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
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
        "viewBox": "0 0 640 480"
      }, attrs)
    }, rest), children.concat([_c('path', {
      attrs: {
        "fill": "#00247d",
        "d": "M0 0h640v480H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fed100",
        "d": "M108.1 354.6c-6.7-.1 62.8-37 120.9-84.4 76.2-62.1 240.3-161.4 288.6-177.6 5-1.7-10.3 8.6-12.3 11.9-51.5 61-10.4 176 54 233.9 19.4 14.8 18.4 15.6 54.3 17v3.4l-505.5-4.2zm-4.2 6.7s-4.9 3.5-4.9 6.1c0 2.9 5.5 6.7 5.5 6.7l498.5 5.5 9.2-6.1-12.8-7.9-495.5-4.3z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M106.8 109.1l-4 12.2 10.4-7.5 10.3 7.5-3.9-12.2 10.3-7.5h-12.8l-3.9-12.2-4 12.2H96.4zm78.1 57.4l8.6-6.3h-10.7l-3.3-10.1-3.3 10.1h-10.6l8.6 6.3-3.3 10.1 8.6-6.3 8.7 6.3zm-145.2 13l-4-12.2-3.9 12.2H19l10.3 7.5-3.9 12.2 10.3-7.5 10.4 7.5-4-12.2 10.4-7.5zm78.1 122.3l-4.6-14.2-4.6 14.2h-15l12.1 8.7-4.6 14.3 12.1-8.8 12.1 8.8-4.7-14.3 12.1-8.7z"
      }
    })]));
  }
});

/***/ })

}]);