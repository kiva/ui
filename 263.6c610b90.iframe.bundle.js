(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[263],{

/***/ 4528:
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
        "viewBox": "0 0 512 512"
      }, attrs)
    }, rest), children.concat([_c('path', {
      attrs: {
        "fill": "#00247d",
        "d": "M0 0h512v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fed100",
        "d": "M90.7 384.2c-5.3 0 50-29.5 96.4-67.2 60.7-49.5 191.5-128.7 230-141.5 4-1.3-8.2 6.8-9.8 9.5-41.1 48.6-8.3 140.3 43 186.4 15.4 11.8 14.6 12.4 43.2 13.6v2.7l-402.8-3.5zm-3.3 5.4s-3.9 2.8-3.9 4.9c0 2.3 4.4 5.4 4.4 5.4l397.3 4.4 7.3-4.9-10.2-6.3-394.9-3.5z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M105.5 116.6l-4 12.1 10.4-7.5 10.3 7.5-4-12.1 10.4-7.5h-12.8l-3.9-12.2-4 12.2H95.2zm77.8 57.1l8.6-6.2h-10.6l-3.3-10.1-3.3 10.1h-10.6l8.6 6.2-3.3 10.1 8.6-6.2 8.6 6.2zm-144.7 13l-3.9-12.1-4 12.1H18l10.3 7.5-4 12.1 10.4-7.5 10.3 7.5-3.9-12.1 10.3-7.5zm77.9 121.9l-4.6-14.2-4.6 14.2H92.4l12 8.7-4.6 14.2 12.1-8.8 12 8.8-4.6-14.2 12-8.7z"
      }
    })]));
  }
});

/***/ })

}]);