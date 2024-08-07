(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[119],{

/***/ 4488:
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
        "fill": "#012169",
        "d": "M0 0h512v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#FFF",
        "d": "M512 0v64L322 256l190 187v69h-67L254 324 68 512H0v-68l186-187L0 74V0h62l192 188L440 0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#C8102E",
        "d": "M184 324l11 34L42 512H0v-3l184-185zm124-12l54 8 150 147v45L308 312zM512 0L320 196l-4-44L466 0h46zM0 1l193 189-59-8L0 49V1z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#FFF",
        "d": "M176 0v512h160V0H176zM0 176v160h512V176H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#C8102E",
        "d": "M0 208v96h512v-96H0zM208 0v512h96V0h-96z"
      }
    })]));
  }
});

/***/ })

}]);