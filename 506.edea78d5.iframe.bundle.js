(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[506],{

/***/ 4721:
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
        "viewBox": "0 0 640 480"
      }, attrs)
    }, rest), children.concat([_c('path', {
      attrs: {
        "fill": "#ee1c25",
        "d": "M0 0h640v480H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#0b4ea2",
        "d": "M0 0h640v320H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 0h640v160H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M233 370.8c-43-20.7-104.6-61.9-104.6-143.2 0-81.4 4-118.4 4-118.4h201.3s3.9 37 3.9 118.4S276 350 233 370.8z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ee1c25",
        "d": "M233 360c-39.5-19-96-56.8-96-131.4s3.6-108.6 3.6-108.6h184.8s3.5 34 3.5 108.6C329 303.3 272.5 341 233 360z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M241.4 209c10.7.2 31.6.6 50.1-5.6 0 0-.4 6.7-.4 14.4s.5 14.4.5 14.4c-17-5.7-38.1-5.8-50.2-5.7v41.2h-16.8v-41.2c-12-.1-33.1 0-50.1 5.7 0 0 .5-6.7.5-14.4 0-7.8-.5-14.4-.5-14.4 18.5 6.2 39.4 5.8 50 5.6v-25.9c-9.7 0-23.7.4-39.6 5.7 0 0 .5-6.6.5-14.4 0-7.7-.5-14.4-.5-14.4 15.9 5.3 29.9 5.8 39.6 5.7-.5-16.4-5.3-37-5.3-37s9.9.7 13.8.7c4 0 13.8-.7 13.8-.7s-4.8 20.6-5.3 37c9.7.1 23.7-.4 39.6-5.7 0 0-.5 6.7-.5 14.4 0 7.8.5 14.4.5 14.4a119 119 0 00-39.7-5.7v26z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#0b4ea2",
        "d": "M233 263.3c-19.9 0-30.5 27.5-30.5 27.5s-6-13-22.2-13c-11 0-19 9.7-24.2 18.8 20 31.7 51.9 51.3 76.9 63.4 25-12 57-31.7 76.9-63.4-5.2-9-13.2-18.8-24.2-18.8-16.2 0-22.2 13-22.2 13S253 263.3 233 263.3z"
      }
    })]));
  }
});

/***/ })

}]);