(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[47],{

/***/ 4312:
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
        "fill": "#006",
        "d": "M0 0h512v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "fill-rule": "evenodd",
        "d": "M54.9 368.6L95.5 384l13.4-41.4 13.3 41.4 40.7-15.4-24.1 36.3 37.4 22.2-43.3 3.7 6 43.1-30-31.5-30 31.5 6-43-43.4-3.8L79 404.9m325 71.5l-19 1.6 2.7 18.8-13-13.7-13 13.7L364 478l-18.8-1.6 16.3-9.6L351 451l17.7 6.7 5.8-18 5.7 18L398 451l-10.4 15.8m16.2-270.4L385 198l2.6 18.8-13-13.7-13 13.7L364 198l-18.8-1.6 16.3-9.6L351 171l17.7 6.7 5.8-18 5.7 18L398 171l-10.4 15.8m-88.8 123.4l-18.8 1.6 2.6 18.7-13-13.7-13 13.7 2.5-18.7-18.8-1.6 16.3-9.7-10.5-15.7 17.7 6.7 5.8-18 5.7 18 17.7-6.7-10.4 15.7M497 282.2l-18.8 1.6 2.6 18.7-13-13.7-13 13.7 2.5-18.7-18.8-1.6 16.3-9.7-10.5-15.7 17.7 6.7 5.8-18 5.8 18 17.6-6.7-10.4 15.7M416.6 355l-10.3 6.4 2.9-11.8-9.3-7.8 12-.9 4.7-11.2L421 341l12.1 1-9.2 7.7 2.9 11.8"
      }
    }), _c('path', {
      attrs: {
        "fill": "#006",
        "d": "M0 0h256v256H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M256 0v32l-95 96 95 93.5V256h-33.5L127 162l-93 94H0v-34l93-93.5L0 37V0h31l96 94 93-94z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#c8102e",
        "d": "M92 162l5.5 17L21 256H0v-1.5zm62-6l27 4 75 73.5V256zM256 0l-96 98-2-22 75-76zM0 .5L96.5 95 67 91 0 24.5z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M88 0v256h80V0zM0 88v80h256V88z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#c8102e",
        "d": "M0 104v48h256v-48zM104 0v256h48V0z"
      }
    })]));
  }
});

/***/ })

}]);