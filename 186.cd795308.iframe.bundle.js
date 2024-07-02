(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[186],{

/***/ 4451:
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
    }, rest), children.concat([_c('g', {
      attrs: {
        "fill-rule": "evenodd"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#3b5aa3",
        "d": "M0 0h511.9v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M139 1.2l-5.3 88-23.2-56.1 9 59.7-35.9-48.2 23.5 55-47-36.5L96.7 109 43.5 85.4l46.6 35.3-58-7.7L87 134.7l-86 7.9 86 5.7-54.5 22.4L90 163l-46.4 34.2 53.8-23.6-36.7 46.2 46.7-35.4-23.4 54 37.4-46.8-10 58.3 23.4-54.5 5.4 86.1 8.2-85.9 20.3 54.9-7.7-59.1 37.2 46.8-24.5-54.7 46.7 37.6-37-47 55.4 23.1-49.1-35.8 59.8 10-57.3-22 89-5.5-89-8.3L251 116l-60.7 7.6 50.2-35-56.6 22.7 39-47.3-47.5 37.1 23-56.8-37 48.3 8-60.3-22 56.9-8.2-88z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#e2ae57",
        "d": "M0 498.2L512 0v92.7L0 512v-13.8z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M18 512l494-320.8-.1-101.9L-.1 512h18z"
      }
    })])]));
  }
});

/***/ })

}]);