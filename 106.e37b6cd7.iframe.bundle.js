(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[106],{

/***/ 4475:
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
        "d": "M229.3 6.3h489.3v489.3H229.3z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "1pt",
        "clip-path": "url(#a)",
        "transform": "translate(-240 -6.6) scale(1.046)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#ffc621",
        "d": "M2 9.7h991.8v475.9H1.9z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ef2118",
        "d": "M0 333.6h993.2v162H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#298c08",
        "d": "M2 6.3h991.8v172H2z"
      }
    }), _c('circle', {
      attrs: {
        "cx": "534.2",
        "cy": "353",
        "r": "199.7",
        "fill": "#006bc6",
        "transform": "matrix(.515 0 0 .515 204.7 77)"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ffc621",
        "d": "M434 186.2l-6 4.3 22.4 31.6 6-3.9-22.3-32zm28.2 74.5l-9.2-6.5 3.8-12-46 .6-13.3-10.2 62.7-.7 11.7-35.3L478 211l-16 49.8zm73.1-67.6l-6-4.5-23.3 31 5.5 4.5 23.8-31zm-62.5 49.3l3.3-10.7h12.7L474.3 188l5.7-15.8 19.6 59.7 37.2.4-11.7 10.3-52.3-.2zm86.6 49l2.5-7.2-36.6-12.6-2.6 6.5 36.7 13.2zm-66-44.4l11.2-.2 4 12.1 37-27.2 16.7.6-50.7 37 11 35.5-13.4-8-15.9-49.8zm-19 97.5l7.6.1.3-38.7-7-.4-.8 39zm21-76.8l3.7 10.6L489 286l37.6 26.5 4.8 16-51.2-36.2-30.1 21.7 3.3-15.2 42.1-31zm-98.7 12.4l2.3 7.2 36.9-11.7-1.8-6.8-37.4 11.3zm79.6-3.8l-9 6.8-10.4-7.4-13.5 44-13.8 9.5 18.7-60-30-21.8 15.5-1.6 42.5 30.5z"
      }
    })])]));
  }
});

/***/ })

}]);