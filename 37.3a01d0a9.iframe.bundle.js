(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[37],{

/***/ 4406:
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
    }, rest), children.concat([_c('defs', [_c('clipPath', {
      attrs: {
        "id": "a"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#25ff01",
        "d": "M109 47.6h464.8v464.9H109z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "clip-path": "url(#a)",
        "transform": "translate(-120 -52.4) scale(1.1014)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 47.6h693V512H0z"
      }
    }), _c('path', {
      attrs: {
        "d": "M1.5 48.2h690.9v196.2H1.5z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#0061ff",
        "d": "M128.3 232.1h458.5v103.4H128.3z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#e20000",
        "d": "M692.5 49.2v463.3H347L692.5 49.2zm-691.3 0v463.3h345.7L1.2 49.2z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ffd600",
        "d": "M508.8 232.2l-69.3-17.6 59-44.4-72.5 10.3 37.3-63-64.1 37.2 11.3-73.5-43.4 58-17.6-67.3-19.6 69.3-43.4-59 12.4 75.6-64.1-39.3 37.2 63-70.3-11.3 57.9 43.4-72.4 18.6h321.6z"
      }
    })])]));
  }
});

/***/ })

}]);