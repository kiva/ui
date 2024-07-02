(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[201],{

/***/ 4466:
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
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        "viewBox": "0 0 512 512"
      }, attrs)
    }, rest), children.concat([_c('path', {
      attrs: {
        "fill": "#cc0001",
        "d": "M0 0h512v512H0z"
      }
    }), _c('path', {
      attrs: {
        "id": "a",
        "fill": "#fff",
        "d": "M0 475.5h512V512H0z"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "translate(0 -73.1)",
        "xlink:href": "#a"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "translate(0 -146.3)",
        "xlink:href": "#a"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "translate(0 -219.4)",
        "xlink:href": "#a"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "translate(0 -292.6)",
        "xlink:href": "#a"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "translate(0 -365.7)",
        "xlink:href": "#a"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "translate(0 -438.9)",
        "xlink:href": "#a"
      }
    }), _c('path', {
      attrs: {
        "fill": "#010066",
        "d": "M0 0h320v292.6H0z"
      }
    }), _c('g', {
      attrs: {
        "fill": "#fc0"
      }
    }, [_c('path', {
      attrs: {
        "d": "M123.8 51.9a93 93 0 00-93.2 92.9 93 93 0 00143.7 78.1 82.7 82.7 0 01-27 4.5 82.5 82.5 0 01-82.7-82.3c0-45.5 37-82.4 82.6-82.4a82.6 82.6 0 0128.7 5A93 93 0 00124 52z"
      }
    }), _c('path', {
      attrs: {
        "d": "M278.4 193.2L239 172.7l11.6 41.9-26.2-35-8.2 42.6-8-42.7-26.5 35 11.8-41.9-39.3 20.4 29.2-32.8-44.5 1.7 40.9-17.1-40.9-17.3 44.5 1.8-29-32.9 39.2 20.5L182 75l26.2 35 8.2-42.6 8 42.7L251 75l-11.8 42 39.3-20.4-29.2 32.8 44.5-1.7-40.9 17.2 40.9 17.2-44.5-1.8z"
      }
    })])]));
  }
});

/***/ })

}]);