(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[381],{

/***/ 4646:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
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
        "viewBox": "0 0 640 480"
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
        "transform": "scale(-1 1)",
        "xlink:href": "#a"
      }
    })]), _c('use', {
      attrs: {
        "transform": "rotate(72)",
        "xlink:href": "#b"
      }
    }), _c('use', {
      attrs: {
        "transform": "rotate(144)",
        "xlink:href": "#b"
      }
    }), _c('use', {
      attrs: {
        "transform": "rotate(216)",
        "xlink:href": "#b"
      }
    }), _c('use', {
      attrs: {
        "transform": "rotate(288)",
        "xlink:href": "#b"
      }
    })])]), _c('path', {
      attrs: {
        "fill": "#ce1126",
        "d": "M0 0h640v480H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#007a5e",
        "d": "M67.2 67.2h505.6v345.6H67.2z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fcd116",
        "d": "M67.2 67.3h505.6L67.2 412.9h505.6z"
      }
    }), _c('circle', {
      attrs: {
        "cx": "319.9",
        "cy": "240.1",
        "r": "57.6",
        "fill": "#ce1126"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "matrix(52.8 0 0 52.8 320 240)",
        "xlink:href": "#c"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "x": "-100",
        "transform": "translate(-30.3)",
        "xlink:href": "#d"
      }
    }), _c('use', {
      attrs: {
        "id": "d",
        "width": "100%",
        "height": "100%",
        "transform": "matrix(31.2 0 0 31.2 320 33.6)",
        "xlink:href": "#c"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "x": "100",
        "transform": "translate(30.3)",
        "xlink:href": "#d"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ce1126",
        "d": "M102.3 240.7a80.4 80.4 0 0033.5 33.2 111 111 0 00-11.3-45l-22.2 11.8z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fcd116",
        "d": "M90.1 194.7c10.4 21.7-27.1 73.7 35.5 85.9a63.2 63.2 0 01-10.9-41.9 70 70 0 0132.5 30.8c16.4-59.5-42-55.8-57.1-74.8z"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "x": "-100",
        "transform": "translate(-30.3 414.6)",
        "xlink:href": "#d"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "matrix(31.2 0 0 31.2 320 448.2)",
        "xlink:href": "#c"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "x": "100",
        "transform": "translate(30.3 414.6)",
        "xlink:href": "#d"
      }
    })]));
  }
});

/***/ })

}]);