(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[333],{

/***/ 4548:
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
        "d": "M150.131 0h339.656v480H150.132z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#d52b1e",
        "d": "M-19.65 0h169.781v480H-19.65zm509.438 0h169.78v480H489.882zm-288.75 231.938l-13.313 4.5 61.406 53.906c4.688 13.781-1.593 17.812-5.625 25.125l66.563-8.438-1.594 67.031 13.875-.375-3.094-66.562 66.75 7.969c-4.125-8.719-7.781-13.313-4.031-27.188l61.313-51.094-10.688-3.937c-8.813-6.75 3.75-32.531 5.625-48.844 0 0-35.719 12.281-38.063 5.813l-9.187-17.532-32.531 35.813c-3.563.844-5.063-.563-5.906-3.563l15-74.812-23.813 13.406c-1.969.938-3.938.188-5.25-2.156l-22.969-45.938-23.625 47.72c-1.781 1.687-3.562 1.874-5.062.75l-22.688-12.75 13.688 74.155c-1.125 3-3.75 3.75-6.75 2.157L239.85 171.75c-4.031 6.562-6.75 17.156-12.187 19.594-5.344 2.25-23.438-4.5-35.532-7.125 4.125 14.906 17.063 39.656 8.907 47.812z"
      }
    })]));
  }
});

/***/ })

}]);