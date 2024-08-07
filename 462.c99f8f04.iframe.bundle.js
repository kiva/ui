(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[462],{

/***/ 4831:
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
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        "viewBox": "0 0 640 480"
      }, attrs)
    }, rest), children.concat([_c('path', {
      attrs: {
        "fill": "#cc0001",
        "d": "M0 0h640v480H0z"
      }
    }), _c('path', {
      attrs: {
        "id": "a",
        "fill": "#fff",
        "d": "M0 445.8h640V480H0z"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "translate(0 -68.6)",
        "xlink:href": "#a"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "translate(0 -137.2)",
        "xlink:href": "#a"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "translate(0 -205.8)",
        "xlink:href": "#a"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "translate(0 -274.3)",
        "xlink:href": "#a"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "translate(0 -343)",
        "xlink:href": "#a"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "translate(0 -411.5)",
        "xlink:href": "#a"
      }
    }), _c('path', {
      attrs: {
        "fill": "#010066",
        "d": "M0 0h372.6v274.3H0z"
      }
    }), _c('g', {
      attrs: {
        "fill": "#fc0"
      }
    }, [_c('path', {
      attrs: {
        "d": "M149.7 48.5c-49 0-88.9 39.7-88.9 88.6a88.8 88.8 0 0089 88.6 88.7 88.7 0 0048-14 78.9 78.9 0 01-25.8 4.2 78.7 78.7 0 01-78.8-78.5 78.7 78.7 0 01106.2-73.7 88.7 88.7 0 00-49.7-15.2z"
      }
    }), _c('path', {
      attrs: {
        "d": "M297.1 183.2l-37.4-19.5 11 40-25-33.5-7.8 40.7-7.7-40.7-25.1 33.4 11.2-40-37.6 19.5 28-31.3-42.5 1.6 39-16.3-39-16.5 42.5 1.7L178.9 91l37.4 19.5-11-40 25 33.5 7.8-40.7 7.7 40.7 25.1-33.3-11.2 39.9 37.6-19.4-28 31.2 42.5-1.6-39 16.4 39 16.5-42.5-1.8z"
      }
    })])]));
  }
});

/***/ })

}]);