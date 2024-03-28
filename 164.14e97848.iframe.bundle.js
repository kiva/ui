(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[164],{

/***/ 4379:
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
        "d": "M92.2 7.8h593.6v485.5H92.2z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "clip-path": "url(#a)",
        "transform": "matrix(.86254 0 0 1.0546 -79.5 -8.3)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#fff",
        "stroke": "#000",
        "stroke-width": "1.1",
        "d": "M991.8 492.9H4.2V8.4h987.6z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#3e5698",
        "d": "M991.8 405.2H4.2V493h987.6z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#c60000",
        "d": "M991.8 384.9H4.2V116.4h987.6z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#3e5698",
        "d": "M991.8 8.4H4.2V96h987.6z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M473 250.7c0 60.1-61.5 108.9-137.4 108.9-76 0-137.6-48.8-137.6-109 0-60.1 61.6-108.9 137.6-108.9S473 190.5 473 250.7z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#c40000",
        "d": "M402.9 326.8l-66.1-38.6-67.1 39 26.3-62.8-66.1-38.5 82.4-.3 26.2-63 24.5 62.8 82.4-.4-67.2 39z"
      }
    })])]));
  }
});

/***/ })

}]);