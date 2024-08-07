(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[308],{

/***/ 4677:
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
    }, rest), children.concat([_c('path', {
      attrs: {
        "fill": "#006",
        "d": "M0 0h640v480H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "fill-rule": "evenodd",
        "d": "M299.8 392.5l-43.7 3.8 6 43.4L232 408l-30.1 31.7 6-43.4-43.7-3.8 37.7-22.3-24.3-36.5 41 15.5 13.4-41.7 13.5 41.7 41-15.5-24.3 36.5m224.4 62.3L476 416.7l17.8 6.7 5.8-18.1 5.8 18.1 17.8-6.7-10.5 15.8 16.4 9.7-19 1.7 2.6 18.9-13-13.9-13.2 13.9 2.6-18.9-19-1.6m16.4-291.9L476 134.6l17.8 6.7 5.8-18.1 5.8 18.1 17.8-6.7-10.5 15.8 16.4 9.8-19 1.6 2.6 18.9-13-13.8-13.2 13.7 2.6-18.8-19-1.6M380.8 265l-10.5-15.8 17.8 6.7 5.8-18.1 5.9 18.1 17.8-6.7L407 265l16.4 9.7-19 1.7 2.7 18.9-13.2-13.9-13 13.9 2.5-18.9-19-1.6m216.3-38L570 221l17.8 6.7 5.8-18.1 5.9 18.1 17.8-6.7-10.5 15.8 16.3 9.7-19 1.7 2.6 18.8-13-13.8-13.2 13.8 2.6-18.8-19-1.7M542 320l-10.3 6.5 2.9-11.9-9.3-7.8 12.1-1 4.6-11.2 4.7 11.3 12.1.9-9.3 7.8 2.9 11.9"
      }
    }), _c('path', {
      attrs: {
        "fill": "#006",
        "d": "M0 0h320v240H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M37.5 0l122 90.5L281 0h39v31l-120 89.5 120 89V240h-40l-120-89.5L40.5 240H0v-30l119.5-89L0 32V0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#c8102e",
        "d": "M212 140.5L320 220v20l-135.5-99.5zm-92 10l3 17.5-96 72H0zM320 0v1.5l-124.5 94 1-22L295 0zM0 0l119.5 88h-30L0 21z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M120.5 0v240h80V0zM0 80v80h320V80z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#c8102e",
        "d": "M0 96.5v48h320v-48zM136.5 0v240h48V0z"
      }
    })]));
  }
});

/***/ })

}]);