(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[475],{

/***/ 4740:
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
    }, rest), children.concat([_c('defs', [_c('clipPath', {
      attrs: {
        "id": "c"
      }
    }, [_c('path', {
      attrs: {
        "d": "M0 0h600v300H0z"
      }
    })]), _c('clipPath', {
      attrs: {
        "id": "d"
      }
    }, [_c('path', {
      attrs: {
        "d": "M0 0l300 150H0zm300 0h300L300 150zm0 150h300v150zm0 0v150H0z"
      }
    })]), _c('g', {
      attrs: {
        "id": "b"
      }
    }, [_c('g', {
      attrs: {
        "id": "a"
      }
    }, [_c('path', {
      attrs: {
        "d": "M0 0v.5L1 0z",
        "transform": "translate(0 -.3)"
      }
    }), _c('path', {
      attrs: {
        "d": "M0 0v-.5L1 0z",
        "transform": "rotate(-36 .5 -.2)"
      }
    })]), _c('use', {
      attrs: {
        "transform": "scale(-1 1)",
        "xlink:href": "#a"
      }
    }), _c('use', {
      attrs: {
        "transform": "rotate(72 0 0)",
        "xlink:href": "#a"
      }
    }), _c('use', {
      attrs: {
        "transform": "rotate(-72 0 0)",
        "xlink:href": "#a"
      }
    }), _c('use', {
      attrs: {
        "transform": "scale(-1 1) rotate(72)",
        "xlink:href": "#a"
      }
    })])]), _c('path', {
      attrs: {
        "fill": "#00247d",
        "fill-rule": "evenodd",
        "d": "M0 0h640v480H0z"
      }
    }), _c('g', {
      attrs: {
        "transform": "translate(-93 36.1) scale(.66825)"
      }
    }, [_c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "fill": "#fff",
        "transform": "matrix(45.4 0 0 45.4 900 120)",
        "xlink:href": "#b"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "fill": "#cc142b",
        "transform": "matrix(30 0 0 30 900 120)",
        "xlink:href": "#b"
      }
    })]), _c('g', {
      attrs: {
        "transform": "rotate(82 534.2 125) scale(.66825)"
      }
    }, [_c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "fill": "#fff",
        "transform": "rotate(-82 519 -457.7) scale(40.4)",
        "xlink:href": "#b"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "fill": "#cc142b",
        "transform": "rotate(-82 519 -457.7) scale(25)",
        "xlink:href": "#b"
      }
    })]), _c('g', {
      attrs: {
        "transform": "rotate(82 534.2 125) scale(.66825)"
      }
    }, [_c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "fill": "#fff",
        "transform": "rotate(-82 668.6 -327.7) scale(45.4)",
        "xlink:href": "#b"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "fill": "#cc142b",
        "transform": "rotate(-82 668.6 -327.7) scale(30)",
        "xlink:href": "#b"
      }
    })]), _c('g', {
      attrs: {
        "transform": "translate(-93 36.1) scale(.66825)"
      }
    }, [_c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "fill": "#fff",
        "transform": "matrix(50.4 0 0 50.4 900 480)",
        "xlink:href": "#b"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "fill": "#cc142b",
        "transform": "matrix(35 0 0 35 900 480)",
        "xlink:href": "#b"
      }
    })]), _c('path', {
      attrs: {
        "stroke": "#fff",
        "stroke-width": "60",
        "d": "M0 0l600 300M0 300L600 0",
        "clip-path": "url(#c)",
        "transform": "scale(.60681 .73139)"
      }
    }), _c('path', {
      attrs: {
        "stroke": "#cc142b",
        "stroke-width": "40",
        "d": "M0 0l600 300M0 300L600 0",
        "clip-path": "url(#d)",
        "transform": "scale(.60681 .73139)"
      }
    }), _c('path', {
      staticStyle: {
        "line-height": "normal",
        "text-indent": "0",
        "text-align": "start",
        "text-decoration-line": "none",
        "text-decoration-style": "solid",
        "text-decoration-color": "#000",
        "text-transform": "none",
        "block-progression": "tb",
        "isolation": "auto",
        "mix-blend-mode": "normal"
      },
      attrs: {
        "fill": "#fff",
        "d": "M151.7 0v79.4H0V140h151.7v79.4h60.7v-79.3H364V79.4H212.4V0z",
        "clip-path": "url(#c)",
        "color": "#000",
        "font-family": "sans-serif",
        "font-weight": "400",
        "overflow": "visible"
      }
    }), _c('path', {
      staticStyle: {
        "line-height": "normal",
        "text-indent": "0",
        "text-align": "start",
        "text-decoration-line": "none",
        "text-decoration-style": "solid",
        "text-decoration-color": "#000",
        "text-transform": "none",
        "block-progression": "tb",
        "isolation": "auto",
        "mix-blend-mode": "normal"
      },
      attrs: {
        "fill": "#cc142b",
        "d": "M163.8 0v91.5H0v36.4h163.8v91.5h36.4V128h163.9V91.5H200.2V0z",
        "color": "#000",
        "font-family": "sans-serif",
        "font-weight": "400",
        "overflow": "visible"
      }
    })]));
  }
});

/***/ })

}]);