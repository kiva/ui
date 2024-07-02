(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[292],{

/***/ 4557:
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
        "d": "M70.1 0h499.6v499.6H70.1z"
      }
    })])]), _c('g', {
      attrs: {
        "clip-path": "url(#a)",
        "transform": "translate(-71.9) scale(1.0248)"
      }
    }, [_c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "1pt"
      }
    }, [_c('path', {
      attrs: {
        "d": "M0 397.9v-296l220.4 147.9L0 397.9z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#00c",
        "d": "M150.4 499.7l247.4-166.5h351.6v166.5h-599z"
      }
    }), _c('path', {
      attrs: {
        "fill": "red",
        "d": "M134.5 0h615v166.6H397.7S137.8-1.6 134.5 0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fc0",
        "d": "M0 62.5v39.3l220.4 148L0 397.8v39.4l277.6-187.4L0 62.5z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#093",
        "d": "M0 62.5V0h92.6l294 199h362.8v101.7H386.6l-294 198.9H0v-62.4l277.6-187.4L0 62.5z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M92.6 0h57.8l247.4 166.6h351.6V199H386.6L92.6 0zm0 499.7h57.8l247.4-166.5h351.6v-32.4H386.6l-294 198.8z"
      }
    })])])]));
  }
});

/***/ })

}]);