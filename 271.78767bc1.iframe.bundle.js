(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[271],{

/***/ 4536:
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
    }, rest), children.concat([_c('defs', [_c('clipPath', {
      attrs: {
        "id": "a"
      }
    }, [_c('path', {
      attrs: {
        "fill-opacity": ".7",
        "d": "M0 0h496v496H0z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "1pt",
        "clip-path": "url(#a)",
        "transform": "scale(1.0321)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#fe0000",
        "d": "M0 0h744v496H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#000095",
        "d": "M0 0h373.7v248H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M273.3 173l-45.8-9.4 9.7 45.8-35-31.1-14.4 44.5-14.8-44.4-34.8 31.3 9.5-45.8-45.8 9.7 31-35-44.5-14.4 44.5-14.8-31.4-34.8 45.9 9.5-9.8-45.8 35 31 14.5-44.5 14.7 44.5 34.8-31.4-9.4 45.9L273 74l-31.1 35 44.5 14.4-44.4 14.8z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#000095",
        "d": "M231 169.5l-14.4 7.7-14.1 8.3-16.4-.6-16.4.2-14-8.6-14.2-8-7.7-14.5-8.4-14 .5-16.4-.1-16.4 8.7-13.8 8-14.3 14.5-7.7 14-8.3 16.5.5 16.4-.2 13.9 8.7 14.3 8 7.7 14.5 8.3 14-.5 16.4.2 16.3-8.7 14z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M237 124.3a50.3 50.3 0 11-100.5 0 50.3 50.3 0 01100.5 0z"
      }
    })])]));
  }
});

/***/ })

}]);