(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[532],{

/***/ 4797:
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
        "viewBox": "0 0 640 480"
      }, attrs)
    }, rest), children.concat([_c('defs', [_c('clipPath', {
      attrs: {
        "id": "a"
      }
    }, [_c('path', {
      attrs: {
        "fill-opacity": ".7",
        "d": "M0 0h682.7v512H0z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "1pt",
        "clip-path": "url(#a)",
        "transform": "scale(.9375)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#fe0000",
        "d": "M0 0h768v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#000095",
        "d": "M0 0h385.7v256H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M282.1 178.6l-47.3-9.8 10 47.3-36-32.1-15 46-15.2-45.9-36 32.4 9.8-47.4-47.2 10.1 32-36.1-46-15 46-15.2-32.4-35.8 47.3 9.7-10-47.3 36 32.1 15-46 15.2 45.9 35.9-32.4-9.7 47.4 47.2-10.1-32 36.1 45.9 15-45.9 15.2z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#000095",
        "d": "M238.5 175l-15 7.9-14.5 8.6-17-.6-16.9.2-14.3-9L146 174l-8-15-8.6-14.5.6-16.8-.2-17 9-14.2 8.3-14.8 14.9-7.9 14.6-8.6 16.9.6 17-.2 14.3 9 14.7 8.2 8 14.9 8.6 14.5-.6 16.9.2 16.9-9 14.3z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M244.6 128.3a51.9 51.9 0 11-103.7 0 51.9 51.9 0 01103.7 0z"
      }
    })])]));
  }
});

/***/ })

}]);