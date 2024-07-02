(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[531],{

/***/ 4796:
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
    }, rest), children.concat([_c('path', {
      attrs: {
        "fill": "#009fca",
        "d": "M0 0h640v480H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff40d",
        "fill-rule": "evenodd",
        "d": "M593.3 122.7H621l-22.3 15.2 8.5 24.7-22.3-15.3-22.2 15.3 8.5-24.7-22.3-15.2h27.5l8.5-24.7zm-69.2 196.8h27.6l-22.3 15.2 8.5 24.7-22.3-15.3-22.3 15.3 8.6-24.7-22.3-15.2H507l8.5-24.7zm69.2-44.6H621l-22.3 15.2 8.5 24.7-22.3-15.3-22.2 15.3 8.5-24.7-22.3-15.2h27.5l8.5-24.7zM295.8 417.7h27.6L301 432.8l8.6 24.6-22.3-15.2-22.3 15.2 8.6-24.6-22.4-15.3h27.6l8.5-24.6zm62.6-76.5h-27.6l22.3-15.3-8.5-24.6 22.3 15.2 22.3-15.2-8.6 24.6 22.3 15.3h-27.5l-8.5 24.6zm81.3-112.5H412l22.3-15.2-8.5-24.7 22.3 15.3 22.3-15.3-8.6 24.7 22.3 15.2h-27.5l-8.5 24.7zm68.3-23.3h-27.6l22.4-15.3-8.6-24.6 22.3 15.2 22.3-15.2-8.6 24.6 22.4 15.3H525l-8.5 24.6zM439.7 400H412l22.3-15.2L426 360l22.3 15.2 22.3-15.2-8.6 24.7 22.3 15.2h-27.5l-8.5 24.7zm-81.3 19.9h-27.6l22.3-15.2-8.5-24.7 22.3 15.2 22.3-15.2-8.6 24.6L403 420h-27.5l-8.5 24.7z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#012169",
        "d": "M0 0h320v240H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#FFF",
        "d": "M37.5 0l122 90.5L281 0h39v31l-120 89.5 120 89V240h-40l-120-89.5L40.5 240H0v-30l119.5-89L0 32V0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#C8102E",
        "d": "M212 140.5L320 220v20l-135.5-99.5zm-92 10l3 17.5-96 72H0zM320 0v1.5l-124.5 94 1-22L295 0zM0 0l119.5 88h-30L0 21z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#FFF",
        "d": "M120.5 0v240h80V0zM0 80v80h320V80z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#C8102E",
        "d": "M0 96.5v48h320v-48zM136.5 0v240h48V0z"
      }
    })]));
  }
});

/***/ })

}]);