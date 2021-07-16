(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[296],{

/***/ 5354:
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
        "fill": "gray",
        "d": "M67.6-154h666v666h-666z"
      }
    })])]), _c('g', {
      attrs: {
        "clip-path": "url(#a)",
        "transform": "matrix(.961 0 0 .7207 -65 111)"
      }
    }, [_c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "1pt"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#319400",
        "d": "M0-154h333v666H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ffd600",
        "d": "M333-154h666v333H333z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#de2110",
        "d": "M333 179h666v333H333z"
      }
    })])])]));
  }

};

/***/ })

}]);