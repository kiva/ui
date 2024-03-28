(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[561],{

/***/ 5737:
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
        "version": "1.1",
        "id": "Layer_1",
        "xmlns": "http://www.w3.org/2000/svg",
        "x": "0",
        "y": "0",
        "viewBox": "0 0 21.2 29.1",
        "xml:space": "preserve",
        "fill": "#277056"
      }, attrs)
    }, rest), children.concat([_c('path', {
      staticClass: "st0",
      attrs: {
        "d": "M2.9 13.7l5.3 2.6c1 .5.9 2-.2 2.3L2.2 20c-.7.2-1.4-.3-1.5-1-.2-1.6 0-3.1.5-4.5.2-.8 1-1.1 1.7-.8zM5 24.6l3.9-4.4c.8-.8 2.1-.3 2.1.9l-.2 5.9c0 .7-.7 1.3-1.4 1.2-1.5-.3-3-.8-4.2-1.7-.6-.5-.7-1.4-.2-1.9zM14.3 18.8l5.6 1.8c.7.2 1 1 .7 1.7-.7 1.4-1.6 2.6-2.8 3.6-.6.5-1.4.3-1.8-.3l-3.1-5c-.6-1 .3-2.2 1.4-1.8zM20 15.2l-5.6 1.6c-1.1.3-2-.9-1.3-1.8l3.3-4.9c.4-.6 1.3-.7 1.8-.2 1.1 1 2 2.2 2.7 3.7.1.6-.2 1.4-.9 1.6zM6.8 1.5c-1 .3-2 .6-2.9 1.1-.7.3-.9 1.1-.5 1.7l5.5 9.6c.6 1.1 2.3.6 2.3-.6v-11c0-.7-.6-1.3-1.3-1.2-1.1 0-2.1.2-3.1.4z"
      }
    })]));
  }
});

/***/ })

}]);