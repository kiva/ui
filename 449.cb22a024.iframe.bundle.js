(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[449],{

/***/ 5507:
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
        "d": "M-54.7 0H628v512H-54.7z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "1pt",
        "clip-path": "url(#a)",
        "transform": "translate(51.3) scale(.9375)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#002170",
        "d": "M-140 0H884v512H-140z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ffb20d",
        "d": "M-140 234.1H884V278H-140z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M161.8 438l-33-33-10.5 45.4-12-45-31.9 34 12.1-45L42 407.9l33-33-45.4-10.6 45-12-34-31.8 45 12L72 288l33 33 10.6-45.4 12 45 31.8-34-12 45 44.5-13.5-33 33 45.4 10.5-45 12 34 32-45-12.2z"
      }
    })])]));
  }

};

/***/ })

}]);