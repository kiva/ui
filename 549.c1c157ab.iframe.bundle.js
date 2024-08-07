(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[549],{

/***/ 4918:
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
        "viewBox": "0 0 640 480"
      }, attrs)
    }, rest), children.concat([_c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "1pt"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#ce1126",
        "d": "M0 0h640v480H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#002b7f",
        "d": "M0 0h320v240H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M180 229.3l-20.7-14-19.9 14.1 6.5-24.9-19-15.2 24.5-1.5 8.1-23.6 8.8 24 24 .7-19 16.3zm-3.6-165.6L159.8 53l-16 10.4 4.4-20-14.6-12.7 19.4-1.6 7.2-18.6 7.4 18.7 19.1 1.7L172 44.3zm-73 59.5l-16-11-16.7 11 5.2-19.4L60.8 91 80 90l7-19 6.8 18.9 19.6 1.1-15 12.5zM250 110l-15.4-10-15 10 4.4-18.3-14-11.8 18.3-1.5 6.3-17.2 7 17.4 17.7 1-13.7 12.3zm-43.1 43.4l-10.3-6.4-10.3 6.6 2.7-12.3-9.2-8.3 12-1 4.6-11.6 4.9 11.6 11.9 1-9.1 8.3z"
      }
    })])]));
  }
});

/***/ })

}]);