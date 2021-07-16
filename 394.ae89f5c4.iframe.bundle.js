(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[394],{

/***/ 5452:
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
        "d": "M-88 32h640v480H-88z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "1pt",
        "clip-path": "url(#a)",
        "transform": "translate(88 -32)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M-128 32h720v480h-720z"
      }
    }), _c('circle', {
      attrs: {
        "cx": "523.1",
        "cy": "344.1",
        "r": "194.9",
        "fill": "#d30000",
        "transform": "translate(-168.4 8.6) scale(.76554)"
      }
    })])]));
  }

};

/***/ })

}]);