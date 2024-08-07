(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[362],{

/***/ 4731:
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
    }, rest), children.concat([_c('defs', [_c('clipPath', {
      attrs: {
        "id": "a"
      }
    }, [_c('path', {
      attrs: {
        "fill-opacity": ".7",
        "d": "M-158.7 0H524v512h-682.7z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "clip-path": "url(#a)",
        "transform": "translate(148.8) scale(.94)"
      }
    }, [_c('path', {
      attrs: {
        "d": "M-180 0H844v256H-180z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#107b00",
        "d": "M-180 256H844v256H-180z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M-180 169.3H844v176.1H-180z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#f0f",
        "d": "M310 195.6c-45.2-19.5-84.1 20.6-84 58 0 39.2 38 81 86 62.5-34-10-48-35.3-48-60.7-.3-25.2 15.8-54.6 46-59.9z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ff1800",
        "d": "M363.1 294.2l-25.8-18.9-26 19 10-30.5-26-18.8h32l9.9-30.5 9.8 30.4h32.1l-25.9 18.8"
      }
    }), _c('path', {
      attrs: {
        "fill": "red",
        "d": "M314.3 315.6a65.2 65.2 0 01-89.2-59.4 65 65 0 0189.5-60.9 60.6 60.6 0 00-51.2 59.2 61.3 61.3 0 0051 61.1zM-180 0l348.6 256.6L-180 512V0z"
      }
    })])]));
  }
});

/***/ })

}]);