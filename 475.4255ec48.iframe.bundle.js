(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[475],{

/***/ 5533:
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
        "fill": "red",
        "d": "M0 0h992.1v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#090",
        "d": "M0 512l992.1-170.7V512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 512l992.1-341.3v170.6L0 512z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#009",
        "d": "M0 512V0h330.7L0 512z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ff0",
        "d": "M0 512L330.7 0h330.7L0 512z"
      }
    })])]));
  }

};

/***/ })

}]);