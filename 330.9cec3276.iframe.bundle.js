(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[330],{

/***/ 5388:
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
        "d": "M-40 0h682.7v512H-40z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "clip-path": "url(#a)",
        "transform": "translate(37.5) scale(.94)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#0c0",
        "d": "M-40 0h768v512H-40z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#69f",
        "d": "M-40 0h768v256H-40z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fffefe",
        "d": "M-40 0l382.7 255.7L-40 511V0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "red",
        "d": "M119.8 292L89 270l-30.7 22.4L69.7 256l-30.6-22.5 37.9-.3 11.7-36.3 12 36.2h37.9l-30.5 22.7 11.7 36.4z"
      }
    })])]));
  }

};

/***/ })

}]);