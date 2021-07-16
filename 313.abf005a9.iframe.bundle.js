(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[313],{

/***/ 5371:
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
        "d": "M-79.5 32h640v480h-640z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "1pt",
        "clip-path": "url(#a)",
        "transform": "translate(79.5 -32)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#ff0",
        "d": "M-119.5 32h720v480h-720z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#00ca00",
        "d": "M-119.5 32v480l480-480h-480z"
      }
    }), _c('path', {
      attrs: {
        "fill": "red",
        "d": "M120.5 512h480V32l-480 480z"
      }
    })])]));
  }

};

/***/ })

}]);