(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[463],{

/***/ 5521:
/***/ (function(module, exports) {

module.exports = {
  functional: true,

  render(_h, _vm) {
    const {
      _c,
      _v,
      data,
      children = []
    } = _vm;
    const {
      class: classNames,
      staticClass,
      style,
      staticStyle,
      attrs = {},
      ...rest
    } = data;
    return _c('svg', {
      class: [classNames, staticClass],
      style: [style, staticStyle],
      attrs: Object.assign({
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 640 480"
      }, attrs),
      ...rest
    }, children.concat([_c('defs', [_c('clipPath', {
      attrs: {
        "id": "a"
      }
    }, [_c('path', {
      attrs: {
        "fill-opacity": ".7",
        "d": "M-118 0h682.7v512H-118z"
      }
    })])]), _c('g', {
      attrs: {
        "clip-path": "url(#a)",
        "transform": "translate(110.6) scale(.9375)"
      }
    }, [_c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "1pt"
      }
    }, [_c('path', {
      attrs: {
        "d": "M-246 0H778v170.7H-246z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M-246 170.7H778v170.6H-246z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#090",
        "d": "M-246 341.3H778V512H-246z"
      }
    }), _c('path', {
      attrs: {
        "fill": "red",
        "d": "M-246 512l512-256L-246 0v512z"
      }
    })])])]));
  }

};

/***/ })

}]);