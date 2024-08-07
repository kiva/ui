(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[120],{

/***/ 4489:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__);


var _excluded = ["class", "staticClass", "style", "staticStyle", "attrs"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
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
      rest = _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1___default()(data, _excluded);
    return _c('svg', _objectSpread({
      class: [classNames, staticClass],
      style: [style, staticStyle],
      attrs: Object.assign({
        "xmlns": "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        "viewBox": "0 0 512 512"
      }, attrs)
    }, rest), children.concat([_c('defs', [_c('g', {
      attrs: {
        "id": "c"
      }
    }, [_c('g', {
      attrs: {
        "id": "b"
      }
    }, [_c('path', {
      attrs: {
        "id": "a",
        "fill": "#fcd116",
        "d": "M0-1v1h.5",
        "transform": "rotate(18 0 -1)"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "scale(-1 1)",
        "xlink:href": "#a"
      }
    })]), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "rotate(72)",
        "xlink:href": "#b"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "rotate(144)",
        "xlink:href": "#b"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "rotate(-144)",
        "xlink:href": "#b"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "rotate(-72)",
        "xlink:href": "#b"
      }
    })])]), _c('path', {
      attrs: {
        "fill": "#ce1126",
        "d": "M0 0h512v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#007a5e",
        "d": "M71.7 71.7h368.6v368.6H71.7z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fcd116",
        "d": "M71.7 71.7h368.6L71.7 440.4h368.6z"
      }
    }), _c('circle', {
      attrs: {
        "cx": "255.9",
        "cy": "256.1",
        "r": "61.4",
        "fill": "#ce1126"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "translate(256 256) scale(56.32)",
        "xlink:href": "#c"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "x": "-100",
        "transform": "translate(-16.4 -.1)",
        "xlink:href": "#d"
      }
    }), _c('use', {
      attrs: {
        "id": "d",
        "width": "100%",
        "height": "100%",
        "transform": "translate(256 35.9) scale(33.28)",
        "xlink:href": "#c"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "x": "100",
        "transform": "translate(16.4)",
        "xlink:href": "#d"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ce1126",
        "d": "M99.8 256.8c7.7 14.3 22.6 29.8 35.7 35.3.2-14.5-5-33.2-12-48l-23.7 12.7z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fcd116",
        "d": "M86.8 207.6c11.1 23.3-29 78.7 37.8 91.7a67.5 67.5 0 01-11.5-44.7 75.5 75.5 0 0134.6 32.8c17.5-63.4-44.8-59.5-61-79.8z"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "x": "-100",
        "transform": "translate(-16.4 442)",
        "xlink:href": "#d"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "translate(256 478) scale(33.28)",
        "xlink:href": "#c"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "x": "100",
        "transform": "translate(16.4 442.2)",
        "xlink:href": "#d"
      }
    })]));
  }
});

/***/ })

}]);