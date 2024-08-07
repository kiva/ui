(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[203],{

/***/ 4572:
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
        "fill-opacity": ".7",
        "d": "M0 0h512v512H0z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "clip-path": "url(#a)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 0h512v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#3662a2",
        "d": "M-108.2.2l.8 368.6L466.6 0l-574.8.2z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#38a100",
        "d": "M630.7 511.5l-1.4-383.2-579 383.5 580.4-.3z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#c70000",
        "d": "M-107.9 396.6l.5 115.4 125.3-.2 611.7-410.1L629 1.4 505.2.2l-613 396.4z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ffe700",
        "d": "M154 183.4l-23.1-14-13.4 23.6-13-23.8L81 183l.6-27.1-27 .2 14-23.2L45 119.5l23.8-13L55 83l27 .6-.1-27.1 23.2 14 13.4-23.6 13 23.7L155.2 57l-.6 27 27-.1-14 23.2 23.6 13.3-23.8 13.1 13.7 23.4-27-.5z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#3662a2",
        "d": "M167.8 120c0 27.2-22.3 49.3-49.8 49.3s-49.7-22.1-49.7-49.4 22.3-49.3 49.8-49.3 49.7 22 49.7 49.3z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ffe700",
        "d": "M157 120a39 39 0 11-77.9 0 39 39 0 0177.9 0z"
      }
    })])]));
  }
});

/***/ })

}]);