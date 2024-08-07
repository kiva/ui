(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[270],{

/***/ 4639:
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
        "viewBox": "0 0 512 512"
      }, attrs)
    }, rest), children.concat([_c('path', {
      attrs: {
        "fill": "#009fca",
        "d": "M0 0h512v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff40d",
        "fill-rule": "evenodd",
        "d": "M478 226.3l7.1 20.4-18.4-12.6-18.5 12.6 7.1-20.4-18.5-12.6h22.9l7-20.4 7 20.4h22.8zm-57.2 162.8l7 20.4-18.4-12.7-18.4 12.7 7-20.4-18.4-12.7h22.8l7-20.4 7 20.5h22.9zm57.3-36.9l7 20.4-18.4-12.6-18.5 12.6 7.1-20.4-18.5-12.6h22.9l7-20.4 7 20.4h22.8zm-246.2 118l7.1 20.5-18.4-12.7-18.5 12.7 7.1-20.4-18.5-12.6h22.8l7-20.4 7.1 20.4h22.8zm43.1-88.4l-7-20.4 18.4 12.6 18.4-12.6-7 20.4 18.4 12.6h-22.8l-7 20.4-7-20.4h-22.8zm67.3-93l-7.1-20.4 18.4 12.6 18.5-12.6-7 20.4 18.4 12.6h-22.8l-7 20.4-7-20.4h-22.9zm56.5-19.3l-7-20.4 18.4 12.6 18.4-12.6-7 20.4 18.4 12.6h-22.8l-7 20.4-7-20.4h-22.9zm-56.5 161l-7.1-20.4 18.4 12.6 18.5-12.6-7 20.4 18.4 12.6h-22.8l-7 20.4-7-20.4h-22.9zM275 446.9l-7-20.4 18.4 12.6 18.4-12.6-7 20.4 18.4 12.6h-22.8l-7 20.4-7-20.4h-22.8z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#012169",
        "d": "M0 0h256v256H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#FFF",
        "d": "M256 0v32l-95 96 95 93.5V256h-33.5L127 162l-93 94H0v-34l93-93.5L0 37V0h31l96 94 93-94z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#C8102E",
        "d": "M92 162l5.5 17L21 256H0v-1.5zm62-6l27 4 75 73.5V256zM256 0l-96 98-2-22 75-76zM0 .5L96.5 95 67 91 0 24.5z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#FFF",
        "d": "M88 0v256h80V0zM0 88v80h256V88z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#C8102E",
        "d": "M0 104v48h256v-48zM104 0v256h48V0z"
      }
    })]));
  }
});

/***/ })

}]);