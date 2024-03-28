(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[51],{

/***/ 4266:
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
    }, rest), children.concat([_c('defs', [_c('clipPath', {
      attrs: {
        "id": "a"
      }
    }, [_c('path', {
      attrs: {
        "fill-opacity": ".7",
        "d": "M0 0h512v512H0z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "clip-path": "url(#a)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#009",
        "d": "M0 0h512v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fc0",
        "d": "M77 0l437 437V0H77z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#FFF",
        "d": "M461.4 470.4l-26.1-19.1-26.9 19 10.2-31.2-26.4-19.2h32.7l10.2-31 10 31.1 32.8.1-26.2 19.4 9.7 30.9zm76.7 10.4h-32.7l-10-31.2-10.2 31.1h-32.8l26.4 19.2-10.1 31.2 26.8-19 26.2 19-9.8-30.9 26.2-19.4zM391.8 379.6l26.2-19.4h-32.7L375.2 329 365 360h-32.7l26.4 19.3-10.1 31.1 26.8-19 26.1 19.1-9.7-31zm-60.3-60.4l26.2-19.4-32.8-.1-10-31.2-10.2 31.2-32.7-.1 26.4 19.2-10.2 31.2 26.9-19 26.1 19.1-9.7-31zm-59.7-59.7l26.2-19.4h-32.7l-10.1-31.2L245 240h-32.7l26.4 19.2-10.1 31.2 26.8-19 26.1 19-9.7-30.9zm-60.4-60.3l26.2-19.3-32.8-.1-10-31.2-10.2 31.2-32.7-.1 26.4 19.2-10.2 31.2 26.9-19 26.1 19-9.7-30.8zm-59.7-59.9L178 120l-32.7-.1-10-31.2-10.3 31.1H92.2l26.4 19.2-10.1 31.2 26.8-19 26.1 19-9.7-30.9zm-60-60L118 60l-32.7-.1-10-31.2L65 59.8H32.2L58.6 79l-10.1 31.2 26.8-19 26.2 19-9.8-30.9zm-60-60L58 0 25.2-.1l-10-31.2L4.8-.2h-32.7L-1.4 19l-10.1 31.2 26.8-19 26.1 19-9.7-30.9z"
      }
    })])]));
  }
});

/***/ })

}]);