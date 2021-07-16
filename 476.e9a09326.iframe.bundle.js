(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[476],{

/***/ 5534:
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
        "d": "M0 0h682.7v512H0z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "1pt",
        "clip-path": "url(#a)",
        "transform": "scale(.9375)"
      }
    }, [_c('path', {
      attrs: {
        "d": "M0 341.3h1024V512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 170.6h1024v170.7H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "red",
        "d": "M0 0h1024.8v170.7H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#009a00",
        "d": "M0 0v512l341.3-256L0 0z"
      }
    })])]));
  }

};

/***/ })

}]);