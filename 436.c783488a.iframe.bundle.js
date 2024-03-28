(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[436],{

/***/ 4651:
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
        "fill": "#fff",
        "d": "M0 0h640v480H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#009543",
        "d": "M0 336h640v144H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#00209f",
        "d": "M0 0h640v144H0z"
      }
    }), _c('path', {
      attrs: {
        "stroke": "#000",
        "stroke-width": "1.6",
        "d": "M319.6 153c-2.7 0-5.4 3-5.4 3l.3 32.4-10.3 10.7h8.3v18.5l-49 66-7.2-2.6-12.7 27s31.3 19.6 76.7 19c49.8-.5 76.9-19.9 76.9-19.9l-13-26.6-6.5 2.8-49.6-65.6v-19.1h8.2L325.1 188v-32.2s-2.7-3-5.5-2.9z"
      }
    }), _c('path', {
      attrs: {
        "fill": "none",
        "stroke": "#000",
        "stroke-width": "8",
        "d": "M336.7 230.4h-33.9s-12.2-25.9-10.3-44c2-18.4 12.6-27.1 26.6-27.3 16.6-.1 25.2 8.1 27.8 26.6 2.6 18.3-10.2 44.7-10.2 44.7z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M260.5 292.1c-.6.7-4.7 8.9-4.7 8.9l7-1.5-2.3-7.4zm4 10.5l-7.4 2.4 8.9 3.5-1.5-5.9zm3.3-10.3l3.7 10.9 9-2.6-2.3-5.2-10.4-3.1zm5.8 14.8l1.2 4.4 12 3-4.8-10.2-8.4 2.8zm13.2-9.3l4.3 10.2 9-3.5-3-4.5-10.3-2.2zm6 13.9l1.4 3.8 14 2-5.9-9.2-9.6 3.4zm13.4-11l5.2 9.1 13-4.8-1.4-3.5-16.8-.7zm7.6 12.4l2.7 4.8 16.2-.5-6-9-13 4.7zm17.1-12l4.4 7.6 10.4-5-2.8-4-12 1.4zm17 5.8l-10.3 5.1 2.7 4.5 13.8-2.2-6.2-7.4zm3.3-8l5.3 6.7 8.7-6.9-3-3-11 3.2zm15.9 3.5l-8.3 6.3 2.2 3.9 11.4-3-5.3-7.2zm11.4-13l2 2.9-5.7 8.5-5.9-7.6 9.6-3.8zm3.9 7.3l3.5 7-7 2.4-.6-3.3 4-6z"
      }
    })]));
  }
});

/***/ })

}]);