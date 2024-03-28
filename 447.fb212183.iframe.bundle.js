(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[447],{

/***/ 4662:
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
    }, rest), children.concat([_c('g', {
      attrs: {
        "fill-rule": "evenodd"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#3b5aa3",
        "d": "M0 0h639.9v480H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#e2ae57",
        "d": "M0 467L639.9 0v87L0 480v-13z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M22.4 480L640 179.2l-.1-95.5L0 480h22.4zm153-464.8L169 118l-27-65.6 10.4 69.8-41.9-56.4 27.5 64.3-55-42.6 42.8 53.6-62.1-27.6 54.4 41.2-67.7-9 64 25.4L14 180.3l100.6 6.7-63.7 26.2 67-9-54.3 40 63-27.6-43 54 54.6-41.3-27 62.9 43.6-54.7-11.8 68.1 27.5-63.7 6.2 100.7 9.7-100.4 23.7 64-9-69 43.4 54.8-28.6-64 54.6 44-43.4-54.9 64.9 27-57.4-41.9 69.9 11.8-67-25.7 104.1-6.5-104-9.7 68.5-22.8-71 9 58.6-41-66 26.5 45.6-55.3-55.6 43.4 26.7-66.4-43.1 56.4 9.3-70.4-25.7 66.5-9.6-102.8z"
      }
    })])]));
  }
});

/***/ })

}]);