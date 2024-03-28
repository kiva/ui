(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[245],{

/***/ 4460:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__);



function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
        rest = _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1___default()(data, ["class", "staticClass", "style", "staticStyle", "attrs"]);

    return _c('svg', _objectSpread({
      class: [classNames, staticClass],
      style: [style, staticStyle],
      attrs: Object.assign({
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 512 512"
      }, attrs)
    }, rest), children.concat([_c('path', {
      attrs: {
        "fill": "#ee1c25",
        "d": "M0 0h512v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#0b4ea2",
        "d": "M0 0h512v341.3H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 0h512v170.7H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M203.2 395.5c-45.9-22-111.5-66-111.5-152.8s4.1-126.2 4.1-126.2h214.8s4.2 39.4 4.2 126.2S249 373.4 203.2 395.5z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ee1c25",
        "d": "M203.2 384c-42.1-20.3-102.3-60.5-102.3-140.2s3.8-115.8 3.8-115.8h197s3.8 36.2 3.8 115.8-60.2 120-102.3 140.2z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M212.2 223c11.4.2 33.7.6 53.5-6 0 0-.6 7-.6 15.3s.6 15.3.6 15.3a172 172 0 00-53.5-6v44h-18v-44a172 172 0 00-53.5 6s.6-7 .6-15.3-.6-15.3-.6-15.3c19.9 6.6 42.1 6.2 53.5 6v-27.7a128 128 0 00-42.3 6.1s.5-7 .5-15.3-.5-15.4-.5-15.4c17 5.7 31.9 6.2 42.2 6-.5-17.4-5.6-39.4-5.6-39.4s10.5.8 14.7.8c4.2 0 14.7-.8 14.7-.8s-5.1 22-5.7 39.5a126 126 0 0042.3-6s-.5 7-.5 15.3.5 15.3.5 15.3c-17-5.7-31.9-6.1-42.3-6V223z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#0b4ea2",
        "d": "M203.2 280.8c-21.2 0-32.6 29.4-32.6 29.4s-6.3-14-23.6-14c-11.7 0-20.3 10.5-25.8 20.2 21.3 33.8 55.3 54.7 82 67.6 26.7-12.9 60.7-33.8 82-67.7-5.5-9.6-14.1-20-25.8-20-17.3 0-23.6 14-23.6 14s-11.4-29.5-32.6-29.5z"
      }
    })]));
  }
});

/***/ })

}]);