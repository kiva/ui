(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[189],{

/***/ 4404:
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
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        "viewBox": "0 0 512 512"
      }, attrs)
    }, rest), children.concat([_c('defs', [_c('path', {
      attrs: {
        "id": "a",
        "fill": "#fff",
        "d": "M.2 0h-.4L0-.5z",
        "transform": "scale(8.844)"
      }
    }), _c('g', {
      attrs: {
        "id": "b"
      }
    }, [_c('use', {
      attrs: {
        "width": "18",
        "height": "12",
        "transform": "rotate(-144)",
        "xlink:href": "#a"
      }
    }), _c('use', {
      attrs: {
        "width": "18",
        "height": "12",
        "transform": "rotate(-72)",
        "xlink:href": "#a"
      }
    }), _c('use', {
      attrs: {
        "width": "18",
        "height": "12",
        "xlink:href": "#a"
      }
    }), _c('use', {
      attrs: {
        "width": "18",
        "height": "12",
        "transform": "rotate(72)",
        "xlink:href": "#a"
      }
    }), _c('use', {
      attrs: {
        "width": "18",
        "height": "12",
        "transform": "rotate(144)",
        "xlink:href": "#a"
      }
    })])]), _c('path', {
      attrs: {
        "fill": "#fecb00",
        "d": "M0 0h512v170.7H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ea2839",
        "d": "M0 341.3h512V512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#34b233",
        "d": "M0 170.7h512v170.6H0z"
      }
    }), _c('use', {
      attrs: {
        "width": "18",
        "height": "12",
        "x": "9",
        "y": "6.4",
        "transform": "translate(-127.7) scale(42.66667)",
        "xlink:href": "#b"
      }
    })]));
  }
});

/***/ })

}]);