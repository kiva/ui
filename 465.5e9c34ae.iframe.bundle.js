(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[465],{

/***/ 5523:
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
        "d": "M-70.3 0h640v480h-640z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "1pt",
        "clip-path": "url(#a)",
        "transform": "translate(70.3)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#4aadd6",
        "d": "M-173.4 0h846.3v480h-846.3z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ffde00",
        "d": "M335.6 232.1a135.9 130.1 0 11-271.7 0 135.9 130.1 0 11271.7 0z"
      }
    })])]));
  }

};

/***/ })

}]);