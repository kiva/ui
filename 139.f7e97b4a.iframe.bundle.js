(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[139],{

/***/ 4354:
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
    }, rest), children.concat([_c('g', {
      attrs: {
        "stroke-width": "1pt"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#006",
        "d": "M0 0h512v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 0v19.2l234 152.6h29.5v-19.2L29.5 0H0zm263.5 0v19.2l-234 152.6H0v-19.2L234 0h29.5z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M109.8 0v171.8h43.9V0h-44zM0 57.3v57.3h263.5V57.3H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#c00",
        "d": "M0 68.7v34.4h263.5V68.7H0zM118.6 0v171.8h26.3V0h-26.3zM0 171.8l87.8-57.2h19.7l-87.9 57.3H0zM0 0l87.8 57.3H68.2L0 12.8V0zm156 57.3L243.8 0h19.7l-87.8 57.3H156zm107.5 114.5l-87.9-57.2h19.7l68.2 44.4v12.8z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "fill-rule": "evenodd",
        "d": "M69.1 443.6l-16.3 17.2 3.2-23.5-23.6-2L52.8 423l-13.1-19.8 22.1 8.4 7.3-22.5 7.3 22.5 22.1-8.4-13 19.8 20.3 12.1-23.6 2 3.2 23.6m295.1 6L369 479l2.3-16.5-16.6-1.5 14.3-8.5-9.2-13.9 15.6 6 5.1-16 5.1 16 15.7-6-9.3 14 14.4 8.4-16.7 1.5L392 479m-11.5-259.5l-11.5 12 2.3-16.5-16.6-1.4L369 205l-9.2-14 15.6 6 5.1-16 5.1 16 15.7-6-9.3 14 14.4 8.5-16.7 1.4 2.3 16.6m-104.3 88.4L276.2 332l2.3-16.5L262 314l14.3-8.5-9.2-14 15.6 6 5.1-15.9 5.1 15.9 15.7-6-9.3 14 14.4 8.5-16.7 1.5 2.3 16.5M463 295.2l-11.5 12 2.3-16.5-16.6-1.4 14.3-8.5-9.2-14 15.6 6 5-16 5.2 16 15.6-6-9.2 14 14.3 8.5-16.6 1.4 2.3 16.5M411 349l-8.2-6.9 10.7-.8 4-9.9 4 10 10.8.7-8.2 6.9 2.5 10.4-9-5.7-9.2 5.7"
      }
    })])]));
  }
});

/***/ })

}]);