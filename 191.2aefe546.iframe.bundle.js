(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[191],{

/***/ 4560:
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
        "fill": "#00785e",
        "d": "M0 0h512v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fbd116",
        "d": "M272.5 147.4L256 96.5l-16.5 51 43.3-31.5h-53.6z"
      }
    }), _c('g', {
      attrs: {
        "id": "a"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M256 353.7H146.7a156 156 0 01-4-4.2H256a2.3 2.3 0 011.5 2c0 1-.6 1.9-1.5 2.2zm0-33.4c.6-1.3 1.9-4.3 1.3-8a13.2 13.2 0 00-1.3-4.1 87.4 87.4 0 01-34.7 20.2 86.4 86.4 0 01-25 3.7h-67.4a154 154 0 006.3 8.6h65a86.2 86.2 0 0055.8-20.4zM139.1 294a34.4 34.4 0 01-10.3 2.2 86.3 86.3 0 0064.8 29.3 86.3 86.3 0 0062.4-26.6 470.3 470.3 0 004.8-62.9 470.3 470.3 0 00-4.8-72.2c-7 6.3-20.2 20-26.4 40.9a86.5 86.5 0 00-3.6 24.6 86.1 86.1 0 0014.6 48.1 86.1 86.1 0 01-18-52.9 86.1 86.1 0 018.2-37 34.7 34.7 0 01-8-13.8 86 86 0 00-11.2 42.6 86.1 86.1 0 0017 51.4 101.4 101.4 0 00-78.3-31.5 34.8 34.8 0 017.2 9.5 101.4 101.4 0 0173.3 31.4 101.3 101.3 0 00-65.2-23.6c-13.8 0-27 2.7-39 7.8a86.6 86.6 0 0088 55.6 87 87 0 01-15.4 1.4 86.2 86.2 0 01-60.1-24.3zM256 388.7h-56.6a153 153 0 0056.6 10.8 11.6 11.6 0 001.3-5.3 11.7 11.7 0 00-1.3-5.5zm0-26.2h-99.9a154 154 0 008.4 6.7H256a4.9 4.9 0 001.4-3.3c0-2-1.2-3.1-1.4-3.4zm0 13.4h-81.8a153.2 153.2 0 0015.4 8.5H256a8 8 0 001.2-4.5 8 8 0 00-1.2-4z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fbd116",
        "d": "M155.6 211.7l-7-36.4-15.7 33.6 32.4-18-36.8-4.5zm49.3-58.8l-29.6-22.3 10.8 35.4 12.1-35-30.3 21.3z"
      }
    })]), _c('use', {
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