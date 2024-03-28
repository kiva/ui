(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[162],{

/***/ 4377:
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
        "d": "M0 0h416.3v416.3H0z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "clip-path": "url(#a)",
        "transform": "scale(1.23)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#ff0",
        "d": "M0 0h625v104H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 104h625v104.1H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#be0027",
        "d": "M0 208.1h625v104H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#3b5aa3",
        "d": "M0 312.2h625v104H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#239e46",
        "d": "M0 0v416.2l310.4-207.5L0 0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M127.8 115c-69.2-3.5-100.7 51.6-100.6 94.2-.2 50.4 47.6 92 91.7 89.4A100 100 0 0165.8 209a98.3 98.3 0 0162-94z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M126.8 160.2l-9.8-7.6-11.8 3.7 4.2-11.6-7.1-10.1 12.3.4 7.4-10 3.4 12 11.8 3.9-10.3 7zm-.2 42.3l-9.8-7.6-11.8 3.7 4.2-11.6-7.2-10.1 12.4.4 7.4-10 3.4 12 11.8 4-10.3 6.9zm.2 42.8l-9.8-7.6-11.8 3.7 4.2-11.7-7.1-10 12.3.4 7.4-10 3.4 12 11.8 3.9-10.3 6.9zm-.2 43.1l-9.8-7.6-11.8 3.7 4.2-11.6-7.2-10.1 12.4.4 7.4-10 3.4 12 11.8 4-10.3 6.9z"
      }
    })])]));
  }
});

/***/ })

}]);