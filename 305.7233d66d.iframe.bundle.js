(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[305],{

/***/ 5363:
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
        "d": "M0 0h640v480H0z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "1pt",
        "clip-path": "url(#a)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M-28 0h699.7v512H-28z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#d72828",
        "d": "M-53-77.8h218.7v276.2H-53zM289.4-.6h381v199h-381zM-27.6 320h190.4v190.3H-27.6zm319.6 2.1h378.3v188.2H292z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#003897",
        "d": "M196.7-25.4H261v535.7h-64.5z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#003897",
        "d": "M-27.6 224.8h698v63.5h-698z"
      }
    })])]));
  }

};

/***/ })

}]);